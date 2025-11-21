import React, { useState, useCallback, useMemo } from 'react';
import { FileText, AlertCircle, RefreshCw, Calendar, Download, Mail, Filter, X, ChevronRight, Clock, CheckCircle, ShieldCheck, DollarSign, List, TrendingUp, Pause, Play } from 'lucide-react';

// Enhanced sample data to include detailed fields and mock dates/statuses for filtering
const sampleRmdStatus = [
  { id: 1, fileName: 'RMD_20241113.csv', status: 'Completed', records: 1250, date: '2024-11-13', detail: { orderAmount: 50000.00, fees: 500.00, taxes: 4000.00, refundAmount: 100.00, chargebackAmount: 0.00, currency: 'USD' } },
  { id: 2, fileName: 'RMD_20241112.csv', status: 'Processing', records: 980, date: '2024-11-12', detail: { orderAmount: 45000.00, fees: 450.00, taxes: 3600.00, refundAmount: 0.00, chargebackAmount: 0.00, currency: 'USD' } },
  { id: 3, fileName: 'RMD_20241111.csv', status: 'Failed', records: 0, date: '2024-11-11', detail: { orderAmount: 0, fees: 0, taxes: 0, refundAmount: 0, chargebackAmount: 0, currency: 'USD' } },
];

const sampleMissingData = {
  missingInA: [
    { id: 'TXN001', amount: 1250.50, date: '2024-11-13', merchant: 'Store ABC', daysPending: 1, detail: { orderAmount: 1250.50, fees: 10.00, taxes: 100.00, refundAmount: 0.00, chargebackAmount: 0.00, gateway: 'GW1', pmt: 'VISA' } },
    { id: 'TXN002', amount: 890.25, date: '2024-11-08', merchant: 'Shop XYZ', daysPending: 5, detail: { orderAmount: 890.25, fees: 8.00, taxes: 70.00, refundAmount: 50.00, chargebackAmount: 0.00, gateway: 'GW2', pmt: 'MC' } },
    { id: 'TXN006', amount: 150.00, date: '2024-11-09', merchant: 'Retailer P', daysPending: 4, detail: { orderAmount: 150.00, fees: 2.00, taxes: 15.00, refundAmount: 0.00, chargebackAmount: 0.00, gateway: 'GW1', pmt: 'VISA' } },
  ],
  missingInSwitch: [
    { id: 'TXN003', amount: 2100.00, date: '2024-11-13', merchant: 'Outlet 123', daysPending: 1, detail: { orderAmount: 2100.00, fees: 21.00, taxes: 170.00, refundAmount: 0.00, chargebackAmount: 0.00, gateway: 'GW3', pmt: 'AMEX' } },
  ],
  missingInAcquirer: [
    { id: 'TXN004', amount: 750.75, date: '2024-11-12', merchant: 'Merchant PQR', daysPending: 2, detail: { orderAmount: 750.75, fees: 7.50, taxes: 60.00, refundAmount: 0.00, chargebackAmount: 0.00, gateway: 'GW2', pmt: 'VISA' } },
  ],
  notFound: [
    { id: 'TXN005', amount: 450.00, date: '2024-11-11', merchant: 'Unknown', daysPending: 3, detail: { orderAmount: 450.00, fees: 4.50, taxes: 35.00, refundAmount: 0.00, chargebackAmount: 0.00, gateway: 'GW1', pmt: 'Discover' } },
  ]
};

const sampleRecoveryData = {
  transactions: [
    { id: 'REC001', amount: 1500.00, date: '2024-11-10', status: 'Pending', merchant: 'Store DEF', gateway: 'GW1', pmt: 'VISA' },
    { id: 'REC002', amount: 2250.50, date: '2024-11-09', status: 'In Progress', merchant: 'Shop GHI', gateway: 'GW2', pmt: 'MC' },
  ],
  chargebacks: [
    { id: 'CB001', amount: 890.00, date: '2024-11-08', status: 'Initiated', reason: 'Duplicate charge', gateway: 'GW3', pmt: 'AMEX' },
    { id: 'CB002', amount: 1200.00, date: '2024-11-07', status: 'Under Review', reason: 'Service not received', gateway: 'GW1', pmt: 'VISA' },
  ]
};

// Mock Settlement Data
const mockSettlementData = [
  { id: 101, rmdId: 'RMD1113', orderAmount: 50000.00, refundAmount: 1000.00, settlementAmount: 49000.00, rmdNotificationAmount: 50000.00, status: 'Ready' },
  { id: 102, rmdId: 'RMD1112', orderAmount: 45000.00, refundAmount: 0.00, settlementAmount: 45000.00, rmdNotificationAmount: 45000.00, status: 'Ready' },
  { id: 103, rmdId: 'RMD1111', orderAmount: 60000.00, refundAmount: 500.00, settlementAmount: 59500.00, rmdNotificationAmount: 60000.00, status: 'Ready' },
];


// --- Detail Sidebar Component ---
const DetailSidebar = ({ detail, onClose }) => {
  if (!detail) return null;

  const detailItems = [
    { label: 'Order Amount', value: detail.orderAmount, currency: detail.currency || 'USD' },
    { label: 'Fees', value: detail.fees, currency: detail.currency || 'USD' },
    { label: 'Taxes', value: detail.taxes, currency: detail.currency || 'USD' },
    { label: 'Refund Amount', value: detail.refundAmount, currency: detail.currency || 'USD' },
    { label: 'Chargeback Amount', value: detail.chargebackAmount, currency: detail.currency || 'USD' },
    // Only show if available (Recon/Recovery data usually have this)
    ...(detail.gateway ? [{ label: 'Gateway', value: detail.gateway }] : []),
    ...(detail.pmt ? [{ label: 'Payment Method', value: detail.pmt }] : []),
  ];

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 transition-opacity duration-300">
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform translate-x-0 transition-transform duration-300">
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h3 className="text-xl font-bold text-gray-800">Transaction Details</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 space-y-4">
            {detailItems.filter(item => item.value !== null).map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm">
                <span className="text-sm font-medium text-gray-600">{item.label}</span>
                <span className="text-base font-semibold text-gray-800">
                  {item.value !== undefined && item.value !== null
                    ? item.currency ? `${item.currency} ${item.value.toFixed(2)}` : item.value
                    : 'N/A'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <button className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition">
              View Full Audit Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Analytics Summary Component ---
const AnalyticsSummary = ({ data, type }) => {
  let analytics;

  if (type === 'recon') {
    const totalTransactions = data.length;
    const netAmount = data.reduce((sum, item) => sum + item.amount, 0);
    const pendingCount = data.filter(item => item.daysPending && item.daysPending > 4).length;

    analytics = [
      { label: 'Total Exceptions', value: totalTransactions.toLocaleString(), icon: List, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Net Amount Pending', value: `$${netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Pending > 4 Days', value: pendingCount.toLocaleString(), icon: Clock, color: 'text-red-600', bg: 'bg-red-50' },
    ];
  } else if (type === 'recovery') {
    const totalItems = data.length;
    const netAmount = data.reduce((sum, item) => sum + item.amount, 0);
    const initiatedCount = data.filter(item => item.status && (item.status === 'Pending' || item.status === 'Initiated')).length;

    analytics = [
      { label: 'Total Items', value: totalItems.toLocaleString(), icon: List, color: 'text-purple-600', bg: 'bg-purple-50' },
      { label: 'Net Amount in Recovery', value: `$${netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
      { label: 'Pending / Initiated', value: initiatedCount.toLocaleString(), icon: TrendingUp, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    ];
  } else {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
      {analytics.map((stat, index) => (
        <div key={index} className={`p-4 rounded-xl shadow-md ${stat.bg} flex items-center space-x-4 border border-gray-200`}>
          <stat.icon className={`w-8 h-8 ${stat.color} p-1.5 rounded-full ${stat.bg.replace('50', '200')}`} />
          <div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};


// --- Main App Component ---
const App = () => {
  // State for Navigation
  const [activeTab, setActiveTab] = useState('rmd');
  const [rmdSubTab, setRmdSubTab] = useState('notifications');
  
  // Recon Workflow: step-1, step-2, step-3
  const [reconSubTab, setReconSubTab] = useState('step-1'); 
  
  // State for nested tabs under Step 2 (Exceptions Review)
  const [step2SubTab, setStep2SubTab] = useState('switch'); 
  const [recoverySubTab, setRecoverySubTab] = useState('transactions');
  
  // State for Filters
  const [dateFilter, setDateFilter] = useState(''); // RMD Notifications
  const [reconDateFilter, setReconDateFilter] = useState(''); // Recon Tabs
  const [recoveryDateStart, setRecoveryDateStart] = useState('');
  const [recoveryDateEnd, setRecoveryDateEnd] = useState('');
  const [recoveryPmtFilter, setRecoveryPmtFilter] = useState(''); // Combined filter
  
  // Validation States for the Recon Workflow
  const [isStep1Verified, setIsStep1Verified] = useState(false);
  const [isStep2Verified, setIsStep2Verified] = useState(false);
  const [isMissingAPendingFilterActive, setIsMissingAPendingFilterActive] = useState(false);
  
  // Settlement Management State
  const [settlementList, setSettlementList] = useState(mockSettlementData.map(item => ({...item, isSelected: false, currentStatus: item.status})));
  const [isAllSelected, setIsAllSelected] = useState(false);


  // State for Detail Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const notifications = [
    { id: 1, date: '2024-11-13', type: 'Error', message: 'RMD file processing failed', severity: 'high' },
    { id: 2, date: '2024-11-12', type: 'Success', message: 'RMD file processed successfully', severity: 'low' },
    { id: 3, date: '2024-11-11', type: 'Warning', message: 'Partial data mismatch detected', severity: 'medium' },
  ];

  // Mock data for the new RMD Summary Table
  const rmdSummary = {
    notificationAmount: 15000.00,
    fileAmount: 95000.00,
    matchedStatus: 'Partial Match',
  };

  // Combine static and dynamic data structures
  const rmdStatus = sampleRmdStatus;
  const missingData = sampleMissingData;
  const recoveryData = sampleRecoveryData;

  // --- Filtered Data Calculation ---

  const filteredNotifications = dateFilter
    ? notifications.filter(n => n.date === dateFilter)
    : notifications;

  const filterDataByDate = useCallback((data, filterDate) => {
    if (!filterDate) return data;
    return data.filter(item => item.date === filterDate);
  }, []);

  const getReconData = useMemo(() => {
    let data;
    if (reconSubTab === 'step-1') data = missingData.missingInA;
    
    // Step 2 logic: Uses the nested step2SubTab
    else if (reconSubTab === 'step-2') {
      if (step2SubTab === 'switch') data = missingData.missingInSwitch;
      else if (step2SubTab === 'acquirer') data = missingData.missingInAcquirer;
      else if (step2SubTab === 'not-found') data = missingData.notFound;
      else data = [];
    }
    else if (reconSubTab === 'step-3') data = []; // Step 3 is just a summary/action
    else data = [];

    // Apply the pending filter only if on Step 1 and the filter is active
    let filteredData = filterDataByDate(data, reconDateFilter);

    if (reconSubTab === 'step-1' && isMissingAPendingFilterActive) {
        filteredData = filteredData.filter(txn => txn.daysPending > 4);
    }

    return filteredData;

  }, [reconSubTab, reconDateFilter, step2SubTab, isMissingAPendingFilterActive, missingData]);

  const filteredRmdStatus = useMemo(() => {
    return filterDataByDate(rmdStatus, reconDateFilter);
  }, [reconDateFilter]);

  const filteredRecoveryData = useMemo(() => {
    let data = recoverySubTab === 'transactions'
      ? recoveryData.transactions
      : recoveryData.chargebacks;

    // Filter by Date Range
    data = data.filter(item => {
      if (recoveryDateStart && item.date < recoveryDateStart) return false;
      if (recoveryDateEnd && item.date > recoveryDateEnd) return false;
      return true;
    });

    // Filter by PMT/Gateway (simple search across both fields)
    if (recoveryPmtFilter) {
      const filterLower = recoveryPmtFilter.toLowerCase();
      data = data.filter(item =>
        (item.gateway && item.gateway.toLowerCase().includes(filterLower)) ||
        (item.pmt && item.pmt.toLowerCase().includes(filterLower))
      );
    }
    return data;
  }, [recoverySubTab, recoveryData, recoveryDateStart, recoveryDateEnd, recoveryPmtFilter]);

  // --- Settlement Handlers ---

  const handleToggleSelectAll = () => {
    const newState = !isAllSelected;
    setIsAllSelected(newState);
    setSettlementList(settlementList.map(item => ({ ...item, isSelected: newState })));
  };

  const handleToggleSelectItem = (id) => {
    const newList = settlementList.map(item =>
      item.id === id ? { ...item, isSelected: !item.isSelected } : item
    );
    setSettlementList(newList);
    setIsAllSelected(newList.every(item => item.isSelected));
  };

  const applyBulkAction = (action) => {
    const selectedIds = settlementList.filter(item => item.isSelected).map(item => item.id);
    if (selectedIds.length === 0) {
      alert('Please select at least one settlement file to perform an action.');
      return;
    }

    const actionMap = {
      hold: { status: 'On Hold', message: 'The selected settlements have been put On Hold.' },
      release: { status: 'Ready', message: 'The selected settlements have been Released.' },
      generate: { status: 'Generated', message: 'Settlement files successfully Generated!' }
    };

    const newStatus = actionMap[action].status;
    const newList = settlementList.map(item =>
      item.isSelected ? { ...item, currentStatus: newStatus, isSelected: false } : item
    );

    setSettlementList(newList);
    setIsAllSelected(false);
    alert(actionMap[action].message);
  };

  // --- General Handlers ---

  const handleRowClick = (item) => {
    // Determine the source of the detail data
    const detail = item.detail || {
      orderAmount: item.amount || item.orderAmount,
      fees: item.fees || 0,
      taxes: item.taxes || 0,
      refundAmount: item.refundAmount || 0,
      chargebackAmount: item.chargebackAmount || 0,
      currency: 'USD'
    };
    setSelectedDetail({ ...detail, transactionId: item.id || item.rmdId });
    setIsSidebarOpen(true);
  };

  const handleDownload = (data, filename) => {
    const csv = [
      Object.keys(data[0] || {}).join(','), // Header row
      ...data.map(row => Object.values(row).map(v => (typeof v === 'object' ? JSON.stringify(v) : v)).join(',')) // Data rows
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMailTrigger = () => {
    console.log('Mock Action: Triggering email for selected exceptions...');
    alert('Mock Action: Triggering email for selected exceptions...'); 
  };

  const handleVerifyStep = (step) => {
    if (step === 1) {
      setIsStep1Verified(true);
      setReconSubTab('step-2'); // Auto-advance
    } else if (step === 2) {
      setIsStep2Verified(true);
      setReconSubTab('step-3'); // Auto-advance
    }
  };
  

  // --- Shared Filter Component for Recon and RMD Status (Date Only) ---
  const DateFilter = ({ date, setDate, handleDownloadData, data, filename, filterButton, setReconFilter, isStep1 }) => (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 bg-gray-100 p-4 rounded-xl mb-4">
      <div className="flex items-center space-x-2 flex-grow">
        <Calendar className="w-5 h-5 text-gray-500" />
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
        />
        {date && (
          <button
            onClick={() => setDate('')}
            className="p-2 text-sm text-red-500 hover:text-red-700 font-medium transition duration-150"
          >
            Clear
          </button>
        )}
      </div>

      {filterButton && (
        <button
          onClick={() => setReconFilter(prev => !prev)}
          className={`flex items-center justify-center px-4 py-2 text-white font-semibold rounded-xl shadow-md transition duration-150 ${isMissingAPendingFilterActive ? 'bg-yellow-700 hover:bg-yellow-800' : 'bg-yellow-500 hover:bg-yellow-600'}`}
        >
          <Clock className="w-4 h-4 mr-2" />
          &gt; 4 Days Pending
        </button>
      )}

      {handleDownloadData && (
        <button
          onClick={() => handleDownload(data, filename)}
          className="flex items-center justify-center px-4 py-2 bg-green-500 text-white font-semibold rounded-xl shadow-md hover:bg-green-600 transition duration-150"
        >
          <Download className="w-4 h-4 mr-2" />
          Download CSV
        </button>
      )}

      {isStep1 && (
        <button
          onClick={handleMailTrigger}
          className="flex items-center justify-center px-4 py-2 bg-purple-500 text-white font-semibold rounded-xl shadow-md hover:bg-purple-600 transition duration-150"
        >
          <Mail className="w-4 h-4 mr-2" />
          Trigger Mail
        </button>
      )}
    </div>
  );

  // --- Recovery Filter Component (Date Range + PMT/Gateway) ---
  const RecoveryFilter = () => (
    <div className="bg-gray-100 p-4 rounded-xl mb-4 space-y-4">
      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <h4 className="text-sm font-bold text-gray-700 whitespace-nowrap">DATE RANGE:</h4>
        <div className="flex items-center space-x-2 w-full">
          <Calendar className="w-5 h-5 text-gray-500" />
          <input
            type="date"
            value={recoveryDateStart}
            onChange={(e) => setRecoveryDateStart(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            placeholder="Start Date"
          />
          <span className="text-gray-500">-</span>
          <input
            type="date"
            value={recoveryDateEnd}
            onChange={(e) => setRecoveryDateEnd(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            placeholder="End Date"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <h4 className="text-sm font-bold text-gray-700 whitespace-nowrap">GATEWAY/PMT:</h4>
        <div className="flex items-center space-x-2 w-full">
          <Filter className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={recoveryPmtFilter}
            onChange={(e) => setRecoveryPmtFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            placeholder="Filter by Gateway, PMT (e.g., VISA, GW1)"
          />
        </div>
        <button
          onClick={() => handleDownload(filteredRecoveryData, recoverySubTab)}
          className="flex items-center justify-center px-4 py-2 bg-green-500 text-white font-semibold rounded-xl shadow-md hover:bg-green-600 transition duration-150 w-full sm:w-auto"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </button>
      </div>
    </div>
  );

  const ReconStepButton = ({ step, title, currentStep, isVerified, onClick, isDisabled }) => {
    const isActive = currentStep === `step-${step}`;
    const isComplete = isVerified;
    
    let containerClasses = "flex items-center text-center flex-1 min-w-0";
    let circleClasses = "w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300";
    let titleClasses = "text-sm font-semibold transition-colors mt-2 whitespace-nowrap";
    
    if (isActive) {
      circleClasses += ' bg-blue-600 text-white shadow-lg ring-4 ring-blue-300/50';
      titleClasses += ' text-blue-600';
    } else if (isComplete) {
      circleClasses += ' bg-green-500 text-white shadow-md';
      titleClasses += ' text-green-600';
    } else if (isDisabled) {
      circleClasses += ' bg-gray-200 text-gray-500';
      titleClasses += ' text-gray-400';
    } else {
      circleClasses += ' bg-gray-100 text-gray-600 hover:bg-blue-50';
      titleClasses += ' text-gray-700 hover:text-blue-700';
    }

    return (
        <button
            onClick={onClick}
            disabled={isDisabled && step === 3} // Only disable step 3
            className={`${containerClasses} flex-col cursor-pointer ${isDisabled && step === 3 ? 'pointer-events-none' : ''}`}
            title={isDisabled && step === 3 ? 'Complete verification steps to unlock settlement' : title}
        >
            <div className='relative flex items-center justify-center'>
                <div className={circleClasses}>
                    {isComplete ? <ShieldCheck className='w-4 h-4' /> : step}
                </div>
                {step < 3 && (
                    <div className={`absolute left-full w-full sm:w-16 h-0.5 transform -translate-x-1/2 ${isComplete ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                )}
            </div>
            <span className={titleClasses}>{title}</span>
        </button>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Vertical Navigation Tabs (Responsive: hidden on mobile, shown on desktop) */}
      <div className="hidden sm:block w-64 bg-white border-r border-gray-200 shadow-xl shadow-gray-100/50">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">RMD Recon</h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard</p>
        </div>
        <nav className="p-4 space-y-2">
          {/* ... Navigation buttons ... */}
          <button
            onClick={() => setActiveTab('rmd')}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-[1.01] ${
              activeTab === 'rmd'
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-200/50'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            <FileText className="w-5 h-5 mr-3" />
            RMD Management
          </button>
          <button
            onClick={() => setActiveTab('recon')}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-[1.01] ${
              activeTab === 'recon'
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-200/50'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            <AlertCircle className="w-5 h-5 mr-3" />
            Recon Results
          </button>
          <button
            onClick={() => setActiveTab('recovery')}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-[1.01] ${
              activeTab === 'recovery'
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-200/50'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            <RefreshCw className="w-5 h-5 mr-3" />
            Recovery
          </button>
        </nav>
      </div>

      {/* Detail Sidebar */}
      {isSidebarOpen && <DetailSidebar detail={selectedDetail} onClose={() => setIsSidebarOpen(false)} />}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* RMD Management Tab */}
        {activeTab === 'rmd' && (
          <div className="p-6 sm:p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">RMD Management</h2>

            {/* Sub Tabs */}
            <div className="flex space-x-6 border-b border-gray-200 mb-8 overflow-x-auto">
              <button
                onClick={() => setRmdSubTab('notifications')}
                className={`px-4 py-3 text-lg font-semibold transition-colors rounded-t-lg whitespace-nowrap ${
                  rmdSubTab === 'notifications'
                    ? 'text-blue-600 border-b-4 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Notification Summary
              </button>
              <button
                onClick={() => setRmdSubTab('status')}
                className={`px-4 py-3 text-lg font-semibold transition-colors rounded-t-lg whitespace-nowrap ${
                  rmdSubTab === 'status'
                    ? 'text-blue-600 border-b-4 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Fetch Status & Summary
              </button>
            </div>

            {/* Notification Summary */}
            {rmdSubTab === 'notifications' && (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <label className="text-sm font-medium text-gray-700">Filter by Date:</label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition duration-150"
                  />
                  {dateFilter && (
                    <button
                      onClick={() => setDateFilter('')}
                      className="p-2 text-sm text-red-500 hover:text-red-700 font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map(notif => (
                      <div
                        key={notif.id}
                        className={`p-4 rounded-xl shadow-sm border ${
                          notif.severity === 'high' ? 'bg-red-50 border-red-300' :
                          notif.severity === 'medium' ? 'bg-yellow-50 border-yellow-300' :
                          'bg-green-50 border-green-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-1">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                notif.type === 'Error' ? 'bg-red-200 text-red-800' :
                                notif.type === 'Warning' ? 'bg-yellow-200 text-yellow-800' :
                                'bg-green-200 text-green-800'
                              }`}>
                                {notif.type.toUpperCase()}
                              </span>
                              <p className="text-base font-medium text-gray-700 truncate">{notif.message}</p>
                            </div>
                            <span className="text-xs text-gray-500 ml-1 block">{notif.date}</span>
                          </div>
                          {notif.type === 'Error' || notif.type === 'Warning' ? (
                            <AlertCircle className={`w-6 h-6 flex-shrink-0 ${notif.type === 'Error' ? 'text-red-500' : 'text-yellow-500'}`} />
                          ) : (
                            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic p-4 text-center">No notifications found for the selected date.</p>
                  )}
                </div>
              </div>
            )}

            {/* Fetch Status & Summary */}
            {rmdSubTab === 'status' && (
              <div className="space-y-6">
                
                {/* 1. Filter Module */}
                <DateFilter
                  date={reconDateFilter}
                  setDate={setReconDateFilter}
                  handleDownloadData={handleDownload}
                  data={filteredRmdStatus}
                  filename="rmd_fetch_status"
                />

                {/* 2. RMD Summary Table */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Reconciliation Summary</h3>
                  <div className="grid grid-cols-3 gap-6 text-center border border-gray-200 rounded-lg divide-x divide-gray-200">
                    <div className="p-4">
                      <p className="text-sm font-medium text-gray-500">RMD Notification Amount</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">${rmdSummary.notificationAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-medium text-gray-500">File Amount</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">${rmdSummary.fileAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-medium text-gray-500">Matched Status</p>
                      <span className={`inline-flex items-center px-3 py-1 mt-1 text-sm font-semibold rounded-full ${
                          rmdSummary.matchedStatus === 'Fully Matched' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {rmdSummary.matchedStatus}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* 3. RMD File Processing Status Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <h3 className="text-xl font-semibold text-gray-700 p-6 border-b">RMD File Processing Status</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">File Name</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Records</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Details</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filteredRmdStatus.map(file => (
                          <tr
                            key={file.id}
                            className="hover:bg-blue-50/50 transition duration-150 cursor-pointer"
                            onClick={() => handleRowClick(file)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{file.fileName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">{file.records.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${
                                file.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                file.status === 'Processing' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {file.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                              <ChevronRight className="w-4 h-4" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recon Results Tab */}
        {activeTab === 'recon' && (
          <div className="p-6 sm:p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Reconciliation Results Workflow</h2>

            {/* Workflow Steps (Visual Tabs) */}
            <div className="flex justify-between items-start space-x-3 border-b border-gray-200 mb-8 overflow-x-auto p-4">
              <ReconStepButton 
                step={1} 
                title="Verify Missing in A" 
                currentStep={reconSubTab} 
                isVerified={isStep1Verified}
                onClick={() => setReconSubTab('step-1')}
                isDisabled={false} 
              />
              <ReconStepButton 
                step={2} 
                title="Review Exceptions" 
                currentStep={reconSubTab} 
                isVerified={isStep2Verified}
                onClick={() => setReconSubTab('step-2')}
                isDisabled={false}
              />
              <ReconStepButton 
                step={3} 
                title="Generate Settlement" 
                currentStep={reconSubTab} 
                isVerified={isStep1Verified && isStep2Verified}
                onClick={() => isStep1Verified && isStep2Verified && setReconSubTab('step-3')}
                isDisabled={!(isStep1Verified && isStep2Verified)}
              />
            </div>

            {/* --- STEP 1: Missing in A --- */}
            {reconSubTab === 'step-1' && (
              <div className="space-y-6">
                
                <DateFilter
                  date={reconDateFilter}
                  setDate={setReconDateFilter}
                  handleDownloadData={handleDownload}
                  data={getReconData}
                  filename="step1_missing_in_a"
                  filterButton={true}
                  setReconFilter={setIsMissingAPendingFilterActive}
                  isStep1={true}
                />
                
                <AnalyticsSummary data={getReconData} type="recon" />
                
                {isMissingAPendingFilterActive && (
                  <div className="text-sm font-medium text-yellow-700 bg-yellow-100 p-3 rounded-xl mb-4 flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Showing transactions pending for more than 4 days.
                    <button onClick={() => setIsMissingAPendingFilterActive(false)} className="ml-auto text-yellow-800 hover:text-red-600"><X className='w-4 h-4' /></button>
                  </div>
                )}

                <h3 className="text-xl font-semibold text-gray-700 mb-4">Transactions Missing in System A ({getReconData.length})</h3>
                
                {/* Table: Missing in A */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Transaction ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Merchant</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Days Pending</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Details</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {getReconData.map(txn => (
                            <tr
                              key={txn.id}
                              className="hover:bg-red-50/50 transition duration-150 cursor-pointer"
                              onClick={() => handleRowClick(txn)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{txn.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.merchant}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${txn.daysPending > 4 ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                                  {txn.daysPending}
                                </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right">${txn.amount.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                                <ChevronRight className="w-4 h-4" />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Verification Button */}
                  {!isStep1Verified && (
                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={() => handleVerifyStep(1)}
                        className="flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition duration-200"
                      >
                        <ShieldCheck className="w-5 h-5 mr-2" />
                        Verify Step 1: Missing in A Cleared
                      </button>
                    </div>
                  )}
                  {isStep1Verified && (
                    <div className="pt-4 flex justify-end text-green-600 font-semibold">
                       <ShieldCheck className='w-5 h-5 mr-2' /> Step 1 Verified. Proceed to Step 2.
                    </div>
                  )}
              </div>
            )}

            {/* --- STEP 2: Exceptions Review (Missing in Switch, Acquirer, Not Found) --- */}
            {reconSubTab === 'step-2' && (isStep1Verified || reconSubTab === 'step-2') && (
              <div className="space-y-6">
                
                <DateFilter
                  date={reconDateFilter}
                  setDate={setReconDateFilter}
                  handleDownloadData={handleDownload}
                  data={getReconData}
                  filename={`step2_${step2SubTab}_exceptions`}
                  filterButton={false} 
                  setReconFilter={() => {}} 
                  isStep1={false}
                />
                
                <AnalyticsSummary data={getReconData} type="recon" />

                {/* Nested Tabs for Exceptions */}
                <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                  <h4 className="text-md font-semibold text-gray-700 mb-3">Step 2 Breakdown:</h4>
                  <div className="flex space-x-4 border-b border-gray-100">
                    <button
                      onClick={() => setStep2SubTab('switch')}
                      className={`px-3 py-2 text-sm font-medium transition-colors rounded-t-lg whitespace-nowrap ${
                        step2SubTab === 'switch' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Missing in Switch
                    </button>
                    <button
                      onClick={() => setStep2SubTab('acquirer')}
                      className={`px-3 py-2 text-sm font-medium transition-colors rounded-t-lg whitespace-nowrap ${
                        step2SubTab === 'acquirer' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Missing in Acquirer
                    </button>
                    <button
                      onClick={() => setStep2SubTab('not-found')}
                      className={`px-3 py-2 text-sm font-medium transition-colors rounded-t-lg whitespace-nowrap ${
                        step2SubTab === 'not-found' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Not Found (Suspense)
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-700 mb-4">Exceptions: {step2SubTab.charAt(0).toUpperCase() + step2SubTab.slice(1).replace('-', ' ')} ({getReconData.length})</h3>
                
                {/* Table: Exceptions Review */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Transaction ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Merchant/Reason</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Details</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {getReconData.map(txn => (
                            <tr
                              key={txn.id}
                              className="hover:bg-red-50/50 transition duration-150 cursor-pointer"
                              onClick={() => handleRowClick(txn)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{txn.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.merchant || "N/A"}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right">${txn.amount.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                                <ChevronRight className="w-4 h-4" />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Verification Button */}
                  {!isStep2Verified && (
                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={() => handleVerifyStep(2)}
                        className="flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition duration-200"
                      >
                        <ShieldCheck className="w-5 h-5 mr-2" />
                        Verify Step 2: Exceptions Cleared
                      </button>
                    </div>
                  )}
                  {isStep2Verified && (
                    <div className="pt-4 flex justify-end text-green-600 font-semibold">
                       <ShieldCheck className='w-5 h-5 mr-2' /> Step 2 Verified. Proceed to Step 3.
                    </div>
                  )}
              </div>
            )}
            
            {/* --- STEP 3: Generate Settlement --- */}
            {reconSubTab === 'step-3' && isStep1Verified && isStep2Verified && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800">Settlement Management</h3>
                <div className="p-6 bg-white rounded-xl shadow-lg space-y-4">
                  
                  {/* Bulk Actions */}
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 border-b pb-4 mb-4">
                    <button
                      onClick={() => applyBulkAction('hold')}
                      className="flex items-center justify-center px-4 py-2 bg-yellow-500 text-white font-semibold rounded-xl shadow-md hover:bg-yellow-600 transition duration-150 flex-1 disabled:opacity-50"
                      disabled={!settlementList.some(item => item.isSelected)}
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Put Selected On Hold
                    </button>
                    <button
                      onClick={() => applyBulkAction('release')}
                      className="flex items-center justify-center px-4 py-2 bg-indigo-500 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-600 transition duration-150 flex-1 disabled:opacity-50"
                      disabled={!settlementList.some(item => item.isSelected)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Release Selected
                    </button>
                    <button
                      onClick={() => applyBulkAction('generate')}
                      className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition duration-150 flex-1 disabled:opacity-50"
                      disabled={!settlementList.some(item => item.isSelected)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Generate Selected Settlement
                    </button>
                  </div>

                  {/* Settlement Table */}
                  <div className="overflow-x-auto bg-gray-50 rounded-xl">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-3 text-left">
                            <input
                              type="checkbox"
                              checked={isAllSelected}
                              onChange={handleToggleSelectAll}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">RMD ID</th>
                          <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">RMD Notification Amt</th>
                          <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Order Amt</th>
                          <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Refund Amt</th>
                          <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Settlement Amt</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Details</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {settlementList.map(item => (
                          <tr 
                            key={item.id} 
                            className="hover:bg-blue-50/30 transition duration-150"
                          >
                            <td className="px-3 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={item.isSelected}
                                onChange={() => handleToggleSelectItem(item.id)}
                                className="rounded text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.rmdId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">${item.rmdNotificationAmount.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">${item.orderAmount.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">${item.refundAmount.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700 text-right">${item.settlementAmount.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${
                                item.currentStatus === 'Ready' ? 'bg-green-100 text-green-800' :
                                item.currentStatus === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {item.currentStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 cursor-pointer" onClick={() => handleRowClick(item)}>
                                <ChevronRight className="w-4 h-4" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            )}
            
            {/* Blocked Message */}
            {reconSubTab === 'step-2' && !isStep1Verified && (
                 <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
                    <h4 className="font-bold mb-2">Access Denied</h4>
                    <p>Please complete and verify Step 1 (Missing in A) before accessing the Exceptions Review.</p>
                </div>
            )}
            {reconSubTab === 'step-3' && !(isStep1Verified && isStep2Verified) && (
                 <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
                    <h4 className="font-bold mb-2">Access Denied</h4>
                    <p>Please complete and verify Step 1 and Step 2 before generating the settlement file.</p>
                </div>
            )}

          </div>
        )}

        {/* Recovery Tab */}
        {activeTab === 'recovery' && (
          <div className="p-6 sm:p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Recovery Management</h2>

            {/* Sub Tabs */}
            <div className="flex space-x-6 border-b border-gray-200 mb-8 overflow-x-auto">
              <button
                onClick={() => setRecoverySubTab('transactions')}
                className={`px-4 py-3 text-lg font-semibold transition-colors rounded-t-lg whitespace-nowrap ${
                  recoverySubTab === 'transactions' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Transactions Pending Recovery
              </button>
              <button
                onClick={() => setRecoverySubTab('chargebacks')}
                className={`px-4 py-3 text-lg font-semibold transition-colors rounded-t-lg whitespace-nowrap ${
                  recoverySubTab === 'chargebacks' ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Chargebacks Under Review
              </button>
            </div>

            {/* Recovery Filters */}
            <RecoveryFilter />
            
            <AnalyticsSummary data={filteredRecoveryData} type="recovery" />

            {/* Recovery Data Content */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <h3 className="text-xl font-semibold text-gray-700 p-6 border-b">
                {recoverySubTab === 'transactions' ? 'Transactions Pending Recovery' : 'Chargebacks Under Review'} ({filteredRecoveryData.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Merchant</th>
                      {recoverySubTab === 'chargebacks' && (<th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Reason</th>)}
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredRecoveryData.map((rec) => (
                      <tr
                        key={rec.id}
                        className="hover:bg-blue-50/50 transition duration-150 cursor-pointer"
                        onClick={() => handleRowClick(rec)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rec.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rec.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rec.merchant || rec.reason}</td>
                        {recoverySubTab === 'chargebacks' && (<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rec.reason}</td>)}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right">${rec.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${
                            rec.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            rec.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            rec.status === 'Initiated' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                          <ChevronRight className="w-4 h-4" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;