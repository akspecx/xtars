import React, { useState, useEffect, useRef } from 'react';

// Define the shape of our game data for better type safety
interface TransactionItem {
  text: string;
  isCorrect: boolean;
  value: number; // Added to store the numeric value
}

interface Instruction {
  id: string;
  text: string;
  description: string;
  draggableValue: string;
  correctDrops: {
    assets: string[];
    liabilities: string[];
    equity: string[];
  };
  dropped?: {
    assets?: TransactionItem[];
    liabilities?: TransactionItem[];
    equity?: TransactionItem[];
  };
  isCompleted: boolean;
}

const translations = {
  en: {
    instructionTitle: "Transaction:",
    initialInstruction: "Click 'Start Game' to begin!",
    assets: "Assets",
    liabilities: "Liabilities",
    equity: "Equity",
    correct: "Correct!",
    incorrect: "Incorrect!",
    score: "Score:",
    time: "Time:",
    timerExpired: "Time's up!",
    dragValuesHere: "Drag values here",
    description: "Description",
    totalAssets: "Total Assets",
    totalLiabilities: "Total Liabilities",
    totalEquity: "Total Equity",
    endOfGame: "Game Over!",
    cumulativeTotals: "Cumulative Totals",
    equationBalanced: "Equation is Balanced. You Won!",
    equationNotBalanced: "Total Assets is not equal to Total liabilities + total equity",
    congratulations: "Congratulations!",
    failed: "Failed!"
  },
  es: {
    instructionTitle: "Transacción:",
    initialInstruction: "¡Haz clic en 'Empezar' para comenzar!",
    assets: "Activos",
    liabilities: "Pasivos",
    equity: "Patrimonio",
    correct: "¡Correcto!",
    incorrect: "¡Incorrecto!",
    score: "Puntuación:",
    time: "Tiempo:",
    timerExpired: "¡Se acabó el tiempo!",
    dragValuesHere: "Arrastre los valores aquí",
    description: "Descripción",
    totalAssets: "Total de Activos",
    totalLiabilities: "Total de Pasivos",
    totalEquity: "Total de Patrimonio",
    endOfGame: "¡Juego terminado!",
    cumulativeTotals: "Totales Acumulados",
    equationBalanced: "La ecuación está equilibrada. ¡Ganaste!",
    equationNotBalanced: "La ecuación no está equilibrada. ¡Perdiste!",
    congratulations: "¡Felicidades!",
    failed: "¡Fallado!"
  },
  fr: {
    instructionTitle: "Transacción:",
    initialInstruction: "Cliquez sur 'Commencer' pour démarrer !",
    assets: "Actifs",
    liabilities: "Passifs",
    equity: "Capitaux Propres",
    correct: "Correct !",
    incorrect: "Incorrect !",
    score: "Score :",
    time: "Temps :",
    timerExpired: "Le temps est écoulé !",
    dragValuesHere: "Faites glisser les valeurs ici",
    description: "La description",
    totalAssets: "Total des Actifs",
    totalLiabilities: "Total des Passifs",
    totalEquity: "Total des Capitaux Propres",
    endOfGame: "Jeu terminé !",
    cumulativeTotals: "Totaux Cumulatifs",
    equationBalanced: "L'équation est équilibrée. Vous avez gagné!",
    equationNotBalanced: "Le total des actifs n'est pas égal au total des passifs + capitaux propres",
    congratulations: "Félicitations!",
    failed: "Échoué!"
  }
};

const App = () => {
  // --- State Management ---
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(-1);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [toastMessage, setToastMessage] = useState({ text: '', isCorrect: false, points: 0, visible: false });
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const TIMER_DURATION = 10;
  const timerIntervalRef = useRef<number | undefined>(undefined);

  // --- Effects ---
  useEffect(() => {
    // Load initial instructions with descriptive text
    const loadedInstructions: Instruction[] = [
      {
        "id": "tx-1",
        "description": "Company buys a machinery with a loan.",
        "text": "Company buys a machinery worth 50000 by taking a loan from a bank.",
        "draggableValue": "50000",
        "correctDrops": {
          "assets": ["Machinery (+50000)"],
          "liabilities": ["Bank Loan (+50000)"],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-2",
        "description": "Company sells old inventory.",
        "text": "Company sells old inventory for 10000 cash.",
        "draggableValue": "10000",
        "correctDrops": {
          "assets": ["Cash (+10000)", "Inventory (-10000)"],
          "liabilities": [],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-3",
        "description": "Company issues new shares.",
        "text": "Company issues 20000 in new shares to an investor.",
        "draggableValue": "20000",
        "correctDrops": {
          "assets": ["Cash (+20000)"],
          "liabilities": [],
          "equity": ["Share Capital (+20000)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-4",
        "description": "Company repays bank loan.",
        "text": "Company repays 5000 of its bank loan.",
        "draggableValue": "5000",
        "correctDrops": {
          "assets": ["Cash (-5000)"],
          "liabilities": ["Bank Loan (-5000)"],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-5",
        "description": "Company pays rent.",
        "text": "Company pays 1500 for monthly office rent.",
        "draggableValue": "1500",
        "correctDrops": {
          "assets": ["Cash (-1500)"],
          "liabilities": [],
          "equity": ["Retained Earnings (-1500)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-6",
        "description": "Company purchases supplies on credit.",
        "text": "Company buys 500 in office supplies and will pay the supplier later.",
        "draggableValue": "500",
        "correctDrops": {
          "assets": ["Office Supplies (+500)"],
          "liabilities": ["Accounts Payable (+500)"],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-7",
        "description": "Company receives payment from customer.",
        "text": "A customer pays 2500 for a previous sale.",
        "draggableValue": "2500",
        "correctDrops": {
          "assets": ["Cash (+2500)", "Accounts Receivable (-2500)"],
          "liabilities": [],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-8",
        "description": "Company distributes profits to shareholders.",
        "text": "Company declares and pays 1000 in dividends to its shareholders.",
        "draggableValue": "1000",
        "correctDrops": {
          "assets": ["Cash (-1000)"],
          "liabilities": [],
          "equity": ["Retained Earnings (-1000)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-9",
        "description": "Company pays salary to employees.",
        "text": "Company pays employees 3000 in salaries.",
        "draggableValue": "3000",
        "correctDrops": {
          "assets": ["Cash (-3000)"],
          "liabilities": [],
          "equity": ["Retained Earnings (-3000)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-10",
        "description": "Company sells goods on credit.",
        "text": "Company sells 7500 worth of goods on credit.",
        "draggableValue": "7500",
        "correctDrops": {
          "assets": ["Accounts Receivable (+7500)", "Inventory (-7500)"],
          "liabilities": [],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-11",
        "description": "Company receives a utility bill.",
        "text": "Company receives a 200 utility bill to be paid later.",
        "draggableValue": "200",
        "correctDrops": {
          "assets": [],
          "liabilities": ["Accounts Payable (+200)"],
          "equity": ["Retained Earnings (-200)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-12",
        "description": "Company purchases new computers.",
        "text": "Company buys 4000 worth of computers with cash.",
        "draggableValue": "4000",
        "correctDrops": {
          "assets": ["Equipment (+4000)", "Cash (-4000)"],
          "liabilities": [],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-13",
        "description": "Company takes a short-term loan.",
        "text": "Company borrows 10000 on a short-term basis.",
        "draggableValue": "10000",
        "correctDrops": {
          "assets": ["Cash (+10000)"],
          "liabilities": ["Short-term Loan (+10000)"],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-14",
        "description": "Company pays a utility bill.",
        "text": "Company pays the 200 utility bill.",
        "draggableValue": "200",
        "correctDrops": {
          "assets": ["Cash (-200)"],
          "liabilities": ["Accounts Payable (-200)"],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-15",
        "description": "Company purchases land with a mortgage.",
        "text": "Company buys land for 100000 with a mortgage.",
        "draggableValue": "100000",
        "correctDrops": {
          "assets": ["Land (+100000)"],
          "liabilities": ["Mortgage Payable (+100000)"],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-16",
        "description": "Company founder invests personal cash.",
        "text": "The founder invests 25000 of personal cash into the business.",
        "draggableValue": "25000",
        "correctDrops": {
          "assets": ["Cash (+25000)"],
          "liabilities": [],
          "equity": ["Owner's Capital (+25000)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-17",
        "description": "Company collects a loan.",
        "text": "Company collects 5000 from a long-term loan it gave to another company.",
        "draggableValue": "5000",
        "correctDrops": {
          "assets": ["Cash (+5000)", "Loan Receivable (-5000)"],
          "liabilities": [],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-18",
        "description": "Company pays interest on a bank loan.",
        "text": "Company pays 1200 in interest on its bank loan.",
        "draggableValue": "1200",
        "correctDrops": {
          "assets": ["Cash (-1200)"],
          "liabilities": [],
          "equity": ["Retained Earnings (-1200)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-19",
        "description": "Company sells a vehicle.",
        "text": "Company sells a company vehicle for 8000 cash.",
        "draggableValue": "8000",
        "correctDrops": {
          "assets": ["Cash (+8000)", "Vehicle (-8000)"],
          "liabilities": [],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-20",
        "description": "Company purchases a patent.",
        "text": "Company buys a patent for 15000 cash.",
        "draggableValue": "15000",
        "correctDrops": {
          "assets": ["Patent (+15000)", "Cash (-15000)"],
          "liabilities": [],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-21",
        "description": "Company receives advertising bill.",
        "text": "Company receives a 500 bill for advertising services.",
        "draggableValue": "500",
        "correctDrops": {
          "assets": [],
          "liabilities": ["Accounts Payable (+500)"],
          "equity": ["Retained Earnings (-500)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-22",
        "description": "Company pays advertising bill.",
        "text": "Company pays the 500 advertising bill.",
        "draggableValue": "500",
        "correctDrops": {
          "assets": ["Cash (-500)"],
          "liabilities": ["Accounts Payable (-500)"],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-23",
        "description": "Company provides services to a client.",
        "text": "Company provides 3000 worth of services, to be billed later.",
        "draggableValue": "3000",
        "correctDrops": {
          "assets": ["Accounts Receivable (+3000)"],
          "liabilities": [],
          "equity": ["Retained Earnings (+3000)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-24",
        "description": "Company repays short-term loan.",
        "text": "Company repays its 10000 short-term loan.",
        "draggableValue": "10000",
        "correctDrops": {
          "assets": ["Cash (-10000)"],
          "liabilities": ["Short-term Loan (-10000)"],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-25",
        "description": "Company donates office furniture.",
        "text": "Company donates 700 worth of office furniture to a charity.",
        "draggableValue": "700",
        "correctDrops": {
          "assets": ["Furniture (-700)"],
          "liabilities": [],
          "equity": ["Retained Earnings (-700)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-26",
        "description": "Company takes a loan from a director.",
        "text": "Company borrows 15000 from a director.",
        "draggableValue": "15000",
        "correctDrops": {
          "assets": ["Cash (+15000)"],
          "liabilities": ["Director's Loan (+15000)"],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-27",
        "description": "Company pays for legal services.",
        "text": "Company pays 1800 for legal services.",
        "draggableValue": "1800",
        "correctDrops": {
          "assets": ["Cash (-1800)"],
          "liabilities": [],
          "equity": ["Retained Earnings (-1800)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-28",
        "description": "Company receives payment for future services.",
        "text": "Company receives 5000 from a client for services to be provided next month.",
        "draggableValue": "5000",
        "correctDrops": {
          "assets": ["Cash (+5000)"],
          "liabilities": ["Deferred Revenue (+5000)"],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-29",
        "description": "Company repays director's loan.",
        "text": "Company repays the 15000 director's loan.",
        "draggableValue": "15000",
        "correctDrops": {
          "assets": ["Cash (-15000)"],
          "liabilities": ["Director's Loan (-15000)"],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-30",
        "description": "Company buys a delivery truck with a loan.",
        "text": "Company buys a delivery truck worth 25000 with a loan.",
        "draggableValue": "25000",
        "correctDrops": {
          "assets": ["Truck (+25000)"],
          "liabilities": ["Loan Payable (+25000)"],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-31",
        "description": "Company sells an old building for a loss.",
        "text": "Company sells an old building for 80000 cash, with a book value of 85000.",
        "draggableValue": "80000",
        "correctDrops": {
          "assets": ["Cash (+80000)", "Building (-85000)"],
          "liabilities": [],
          "equity": ["Retained Earnings (-5000)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-32",
        "description": "Company receives a government grant.",
        "text": "Company receives a government grant of 10000.",
        "draggableValue": "10000",
        "correctDrops": {
          "assets": ["Cash (+10000)"],
          "liabilities": [],
          "equity": ["Retained Earnings (+10000)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-33",
        "description": "Company issues a new bond.",
        "text": "Company issues 50000 in new bonds.",
        "draggableValue": "50000",
        "correctDrops": {
          "assets": ["Cash (+50000)"],
          "liabilities": ["Bonds Payable (+50000)"],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-34",
        "description": "Company buys back its own shares.",
        "text": "Company buys back 30000 worth of its own shares from the market.",
        "draggableValue": "30000",
        "correctDrops": {
          "assets": ["Cash (-30000)"],
          "liabilities": [],
          "equity": ["Treasury Stock (-30000)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-35",
        "description": "Company pays off a bond.",
        "text": "Company repays 10000 of its bonds.",
        "draggableValue": "10000",
        "correctDrops": {
          "assets": ["Cash (-10000)"],
          "liabilities": ["Bonds Payable (-10000)"],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-36",
        "description": "Company receives client deposit.",
        "text": "Company receives a 2000 deposit from a new client.",
        "draggableValue": "2000",
        "correctDrops": {
          "assets": ["Cash (+2000)"],
          "liabilities": ["Deferred Revenue (+2000)"],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-37",
        "description": "Company pays for a new software license.",
        "text": "Company pays 5000 for a new software license.",
        "draggableValue": "5000",
        "correctDrops": {
          "assets": ["Software License (+5000)", "Cash (-5000)"],
          "liabilities": [],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-38",
        "description": "Company sells goods on credit.",
        "text": "Company sells 4500 worth of goods on credit.",
        "draggableValue": "4500",
        "correctDrops": {
          "assets": ["Accounts Receivable (+4500)", "Inventory (-4500)"],
          "liabilities": [],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-39",
        "description": "Company borrows from a director.",
        "text": "Company borrows 8000 from a director.",
        "draggableValue": "8000",
        "correctDrops": {
          "assets": ["Cash (+8000)"],
          "liabilities": ["Director Loan (+8000)"],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-40",
        "description": "Company repays part of a long-term loan.",
        "text": "Company repays 7000 of its long-term loan.",
        "draggableValue": "7000",
        "correctDrops": {
          "assets": ["Cash (-7000)"],
          "liabilities": ["Long-term Loan (-7000)"],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-41",
        "description": "Company earns revenue but hasn't billed yet.",
        "text": "Company earns 1500 in revenue that has not yet been billed to the customer.",
        "draggableValue": "1500",
        "correctDrops": {
          "assets": ["Accounts Receivable (+1500)"],
          "liabilities": [],
          "equity": ["Retained Earnings (+1500)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-42",
        "description": "Company receives a private loan.",
        "text": "Company receives a 12000 loan from a private investor.",
        "draggableValue": "12000",
        "correctDrops": {
          "assets": ["Cash (+12000)"],
          "liabilities": ["Loan from Investor (+12000)"],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-43",
        "description": "Inventory revaluation.",
        "text": "The company revalues its inventory, increasing its value by 4000.",
        "draggableValue": "4000",
        "correctDrops": {
          "assets": ["Inventory (+4000)"],
          "liabilities": [],
          "equity": ["Revaluation Surplus (+4000)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-44",
        "description": "Company receives cash from a prior investment.",
        "text": "Company receives 5000 cash from a prior investment.",
        "draggableValue": "5000",
        "correctDrops": {
          "assets": ["Cash (+5000)", "Investment (-5000)"],
          "liabilities": [],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-45",
        "description": "Company pays a legal settlement.",
        "text": "Company pays 2500 for a legal settlement.",
        "draggableValue": "2500",
        "correctDrops": {
          "assets": ["Cash (-2500)"],
          "liabilities": [],
          "equity": ["Retained Earnings (-2500)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-46",
        "description": "Company issues a new series of preferred stock.",
        "text": "Company issues 15000 in new preferred stock.",
        "draggableValue": "15000",
        "correctDrops": {
          "assets": ["Cash (+15000)"],
          "liabilities": [],
          "equity": ["Preferred Stock (+15000)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-47",
        "description": "Non-cash contribution of equipment.",
        "text": "An owner contributes equipment worth 6000 to the company.",
        "draggableValue": "6000",
        "correctDrops": {
          "assets": ["Equipment (+6000)"],
          "liabilities": [],
          "equity": ["Contributed Capital (+6000)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-48",
        "description": "Convertible bond conversion.",
        "text": "A 10000 convertible bond is converted into equity.",
        "draggableValue": "10000",
        "correctDrops": {
          "assets": [],
          "liabilities": ["Convertible Bond (-10000)"],
          "equity": ["Share Capital (+10000)"]
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-49",
        "description": "Company prepays insurance.",
        "text": "Company pays 900 to prepay its insurance for the next year.",
        "draggableValue": "900",
        "correctDrops": {
          "assets": ["Prepaid Insurance (+900)", "Cash (-900)"],
          "liabilities": [],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      },
      {
        "id": "tx-50",
        "description": "Company pays out an accrued expense.",
        "text": "Company pays 1500 that was previously accrued for expenses.",
        "draggableValue": "1500",
        "correctDrops": {
          "assets": ["Cash (-1500)"],
          "liabilities": ["Accrued Expenses (-1500)"],
          "equity": []
        },
        "dropped": {
          "assets": [],
          "liabilities": [],
          "equity": []
        },
        "isCompleted": false
      }
    ]
    setInstructions(loadedInstructions);
  }, []);

  // Timer effect
  useEffect(() => {
    if (currentInstructionIndex > -1 && isGameRunning && timer > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(timerIntervalRef.current);
    }
    if (timer === 0 && isGameRunning && currentInstructionIndex > -1) {
      handleTimerExpired();
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [currentInstructionIndex, timer, isGameRunning]);

  // Toast message effect
  useEffect(() => {
    if (toastMessage.visible) {
      const toastTimer = setTimeout(() => {
        setToastMessage(prev => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(toastTimer);
    }
  }, [toastMessage.visible]);

  // --- Game Logic Functions ---
  const startGame = () => {
    if (isGameRunning) return;
    setIsGameRunning(true);
    setScore(0);
    setCurrentInstructionIndex(0);
    // Reset all instructions dropped state
    const resetInstructions = instructions.map(inst => ({
      ...inst,
      dropped: { assets: [], liabilities: [], equity: [] },
      isCompleted: false
    }));
    setInstructions(resetInstructions);
    setTimer(TIMER_DURATION);
    setShowFinalModal(false);
  };

  const nextTransaction = () => {
    if (currentInstructionIndex + 1 < instructions.length) {
      setCurrentInstructionIndex(currentInstructionIndex + 1);
      setTimer(TIMER_DURATION);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setIsGameRunning(false);
    setCurrentInstructionIndex(instructions.length);
    if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
    }
    setShowFinalModal(true);
  };

  const handleTimerExpired = () => {
    setScore(prevScore => prevScore - 5);
    setToastMessage({ text: translations[currentLanguage].timerExpired, isCorrect: false, points: -5, visible: true });
    endGame(); // End the game immediately on timer expiry
  };

  const showToast = (message: string, isCorrect: boolean, points: number) => {
    setToastMessage({ text: message, isCorrect, points, visible: true });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isGameRunning) return;

    const currentInstruction = instructions[currentInstructionIndex];
    if (!currentInstruction) return;

    const targetZone = e.currentTarget.dataset.zone as 'assets' | 'liabilities' | 'equity';
    const droppedValue = parseFloat(currentInstruction.draggableValue);

    const isCorrect = currentInstruction.correctDrops[targetZone].some(correctDrop => {
      const dropValue = parseFloat(correctDrop.match(/([+-]?\d+)/)?.[1] || '0');
      return Math.abs(dropValue) === droppedValue;
    });

    const points = isCorrect ? 10 : -5;
    setScore(prevScore => prevScore + points);
    showToast(isCorrect ? translations[currentLanguage].correct : translations[currentLanguage].incorrect, isCorrect, points);

    const updatedInstructions = [...instructions];
    const instructionToUpdate = updatedInstructions[currentInstructionIndex];

    if (instructionToUpdate) {
      const droppedItemText = isCorrect
        ? currentInstruction.draggableValue
        : `Incorrect Drop: ${currentInstruction.draggableValue}`;

      const newDroppedItem: TransactionItem = { text: droppedItemText, isCorrect, value: isCorrect ? droppedValue : 0 };

      if (!instructionToUpdate.dropped) {
        instructionToUpdate.dropped = { assets: [], liabilities: [], equity: [] };
      }
      instructionToUpdate.dropped[targetZone]?.push(newDroppedItem);
      
      setInstructions(updatedInstructions);
    }

    // Check if all required drops for the current instruction have been made
    const hasAssetsDropped = (instructionToUpdate?.dropped?.assets?.length || 0) > 0;
    const hasLiabilitiesOrEquityDropped = (instructionToUpdate?.dropped?.liabilities?.length || 0) > 0 || (instructionToUpdate?.dropped?.equity?.length || 0) > 0;

    const isTransactionComplete = hasAssetsDropped && hasLiabilitiesOrEquityDropped;
    
    if (isTransactionComplete) {
      updatedInstructions[currentInstructionIndex].isCompleted = true;
      setInstructions(updatedInstructions);
      if (currentInstructionIndex === instructions.length - 1) {
        endGame();
      } else {
        nextTransaction();
      }
    }
  };

  const calculateCumulativeTotals = () => {
    let assetsTotal = 0;
    let liabilitiesTotal = 0;
    let equityTotal = 0;
    const getAmount = (text: string) => {
      const match = text.match(/([+-]?\d+)/);
      return match ? parseFloat(match[1]) : 0;
    };
    
    // Sum up all completed transactions
    instructions.forEach((instruction) => {
      if (instruction.dropped) {
        instruction.dropped.assets?.forEach(item => {
          if (item.isCorrect) assetsTotal += getAmount(item.text);
        });
        instruction.dropped.liabilities?.forEach(item => {
          if (item.isCorrect) liabilitiesTotal += getAmount(item.text);
        });
        instruction.dropped.equity?.forEach(item => {
          if (item.isCorrect) equityTotal += getAmount(item.text);
        });
      }
    });
    return { assetsTotal, liabilitiesTotal, equityTotal };
  };

  const { assetsTotal, liabilitiesTotal, equityTotal } = calculateCumulativeTotals();
  const currentInstruction = instructions[currentInstructionIndex];
  const isLastInstruction = currentInstructionIndex === instructions.length - 1;
  const isGameOver = currentInstructionIndex === instructions.length || timer === 0;

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-500 font-inter p-4 md:p-8">
      {/* Toast/Message Box */}
      <div
        className={`fixed top-5 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-xl text-center z-50 transform transition-opacity duration-300 ${toastMessage.visible ? 'opacity-100' : 'opacity-0'} ${toastMessage.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
        {toastMessage.text} ({toastMessage.points > 0 ? '+' : ''}{toastMessage.points})
      </div>

      {/* Game Over Modal */}
      {showFinalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md w-full mx-4">
            <h2 className={`text-2xl font-bold mb-4 ${assetsTotal === liabilitiesTotal + equityTotal ? 'text-green-600' : 'text-red-600'}`}>
              {translations[currentLanguage].endOfGame}
            </h2>
            <p className="text-lg font-semibold mb-2">
              {translations[currentLanguage].totalAssets} ({assetsTotal}) = {translations[currentLanguage].totalLiabilities} ({liabilitiesTotal}) + {translations[currentLanguage].totalEquity} ({equityTotal})
            </p>
            {assetsTotal === liabilitiesTotal + equityTotal ? (
              <p className="text-xl font-bold text-green-600">
                {translations[currentLanguage].congratulations} {'🎉'}
              </p>
            ) : (
              <p className="text-xl font-bold text-red-600">
                {translations[currentLanguage].failed}
              </p>
            )}
            <button
              onClick={() => {
                setShowFinalModal(false);
                startGame();
              }}
              className="mt-6 px-6 py-3 rounded-full text-white font-semibold transition-colors duration-300 shadow-md bg-blue-600 hover:bg-blue-700"
            >
              Play Again
            </button>
          </div>
        </div>
      )}


      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-bold text-center">Financial Equation Game</h1>
          </div>
          <button id="theme-toggle" className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200" onClick={() => document.documentElement.classList.toggle('dark')}>
            <i className="fas fa-moon"></i>
          </button>
        </div>
        
        {/* Score and Timer */}
        <div className="flex justify-between items-center w-full mb-8">
            <div className="flex items-center space-x-2">
                <span className="font-semibold text-green-600">{translations[currentLanguage].score} {score}</span>
            </div>
            <div className="flex items-center space-x-2">
                <span className="font-semibold text-blue-600">{translations[currentLanguage].time} {timer}s</span>
            </div>
        </div>
        
        <div className="w-full h-auto">
            {/* Column Headers */}
            <div className="grid grid-cols-[1fr_1fr_0.2fr_1fr_0.2fr_1fr] border border-black dark:border-white w-full">
                <div className="text-center p-2 border-r border-black dark:border-white">
                    {translations[currentLanguage].description}
                </div>
                <div className="text-center p-2 border-r border-black dark:border-white">
                    {translations[currentLanguage].assets}
                    <div className="text-sm font-normal text-gray-600 dark:text-gray-400">(What company owns)</div>
                </div>
                <div className="flex items-center justify-center text-4xl font-extrabold dark:text-gray-100">
                    =
                </div>
                <div className="text-center p-2 border-r border-black dark:border-white">
                    {translations[currentLanguage].liabilities}
                    <div className="text-sm font-normal text-gray-600 dark:text-gray-400">(What company owes)</div>
                </div>
                <div className="flex items-center justify-center text-4xl font-extrabold dark:text-gray-100">
                    +
                </div>
                <div className="text-center p-2">
                    {translations[currentLanguage].equity}
                    <div className="text-sm font-normal text-gray-600 dark:text-gray-400">(What company pays to its owners)</div>
                </div>
            </div>

            {/* Transaction Rows */}
            <div className="w-full overflow-y-auto" style={{ maxHeight: '400px' }}>
                {instructions.map((instruction, index) => (
                    // Render a row for each instruction, whether completed or not
                    (instruction.dropped?.assets?.length > 0 || instruction.dropped?.liabilities?.length > 0 || instruction.dropped?.equity?.length > 0 || index === currentInstructionIndex) && (
                        <div key={instruction.id} className="grid grid-cols-[1fr_1fr_0.2fr_1fr_0.2fr_1fr] border-b border-l border-r border-black dark:border-white w-full">
                            {/* Description */}
                            <div className="p-4 border-r border-black dark:border-white flex items-center justify-center text-center">
                                {instruction.description}
                            </div>

                            {/* Assets */}
                            <div className="p-4 border-r border-black dark:border-white flex items-center justify-center" data-zone="assets" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
                                {instruction.dropped?.assets?.length > 0 && instruction.dropped.assets.map((item, itemIndex) => (
                                    <div key={`${index}-assets-${itemIndex}`} className={`p-4 rounded-lg shadow-md w-32 text-center ${item.isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                        {item.text}
                                    </div>
                                ))}
                            </div>

                            {/* Equals */}
                            <div className="flex items-center justify-center"></div>

                            {/* Liabilities */}
                            <div className="p-4 border-r border-black dark:border-white flex items-center justify-center" data-zone="liabilities" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
                                {instruction.dropped?.liabilities?.length > 0 && instruction.dropped.liabilities.map((item, itemIndex) => (
                                    <div key={`${index}-liabilities-${itemIndex}`} className={`p-4 rounded-lg shadow-md w-32 text-center ${item.isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                        {item.text}
                                    </div>
                                ))}
                            </div>

                            {/* Plus */}
                            <div className="flex items-center justify-center"></div>

                            {/* Equity */}
                            <div className="p-4 flex items-center justify-center" data-zone="equity" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
                                {instruction.dropped?.equity?.length > 0 && instruction.dropped.equity.map((item, itemIndex) => (
                                    <div key={`${index}-equity-${itemIndex}`} className={`p-4 rounded-lg shadow-md w-32 text-center ${item.isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                        {item.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>
            

            {/* Total Section */}
            <div className="grid grid-cols-[1fr_1fr_0.2fr_1fr_0.2fr_1fr] border-l border-r border-b border-black dark:border-white">
                <div className="p-2 border-r border-black dark:border-white flex items-center justify-center text-center">
                    {translations[currentLanguage].totalAssets}
                </div>
                <div className="p-2 border-r border-black dark:border-white flex items-center justify-center">
                    <div className="w-32 h-16 flex items-center justify-center border border-black dark:border-white rounded-lg shadow-md bg-white dark:bg-gray-800">
                        <span className="text-xl font-bold">({assetsTotal})</span>
                    </div>
                </div>
                <div className="flex items-center justify-center"></div>
                <div className="p-2 border-r border-black dark:border-white flex items-center justify-center">
                    <div className="w-32 h-16 flex items-center justify-center border border-black dark:border-white rounded-lg shadow-md bg-white dark:bg-gray-800">
                        <span className="text-xl font-bold">({liabilitiesTotal})</span>
                    </div>
                </div>
                <div className="flex items-center justify-center"></div>
                <div className="p-2 flex items-center justify-center">
                    <div className="w-32 h-16 flex items-center justify-center border border-black dark:border-white rounded-lg shadow-md bg-white dark:bg-gray-800">
                        <span className="text-xl font-bold">({equityTotal})</span>
                    </div>
                </div>
            </div>
        </div>


        {/* Instruction and buttons */}
        <div className="flex flex-col justify-center items-center mt-8">
            {isGameRunning && !isGameOver && currentInstruction && (
              <div className="flex flex-col items-center mb-4">
                <p className="text-xl font-medium w-full text-center">{currentInstruction.description}</p>
                <div
                    className="drag-item p-4 bg-blue-500 text-white rounded-lg shadow-md cursor-grab mt-4"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', currentInstruction.id)}
                >
                    {currentInstruction.draggableValue}
                </div>
              </div>
            )}

            <div className="flex justify-center">
              {!isGameRunning && !isGameOver ? (
                <button
                  id="start-game-btn"
                  className="px-6 py-3 rounded-full text-white font-semibold transition-colors duration-300 shadow-md bg-blue-600 hover:bg-blue-700"
                  onClick={startGame}
                >
                  Start Game
                </button>
              ) : null}
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;