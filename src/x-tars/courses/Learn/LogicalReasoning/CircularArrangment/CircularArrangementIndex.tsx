import React, { useState, useEffect } from 'react';
import { 
  Menu, Search, X, ChevronDown, ChevronRight, 
  CheckCircle, Circle, Clock, BookOpen, PenTool, FileText 
} from 'lucide-react';
import { sampleCourse } from './CourseData.tsx'


// Compact Course Header Component
// Displays course title, level, and overall progress. Includes a menu toggle for mobile sidebar.
const CompactCourseHeader: React.FC<{ 
  title: string; 
  level: string; 
  overallProgress: number; 
  onMenuToggle: () => void; 
}> = ({ title, level, overallProgress, onMenuToggle }) => {
  return (
    <div className="bg-gradient-to-r from-purple-700 to-blue-700 dark:from-purple-800 dark:to-blue-800 text-white p-3 sm:p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Hamburger button shown only on small screens */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50" 
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-purple-100 dark:text-purple-200" />
            <div>
              <h1 className="text-base sm:text-lg font-bold">{title}</h1>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-purple-200 dark:text-purple-300">
                <span className="bg-yellow-400 dark:bg-yellow-500 text-purple-900 dark:text-purple-900 px-1.5 py-0.5 rounded-full text-xs font-semibold">
                  {level}
                </span>
                <span>{overallProgress}% Complete</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="w-32 bg-white/30 dark:bg-white/20 rounded-full h-2"> 
            <div 
              className="bg-yellow-300 dark:bg-yellow-400 h-2 rounded-full transition-all duration-300 shadow-sm" 
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Vertical Sidebar Component
// Displays modules and sub-modules, allowing users to navigate lessons.
const VerticalSidebar: React.FC<{ 
  modules: typeof sampleCourse['modules']; 
  selectedSubModule: string; 
  onSubModuleSelect: (moduleId: string, subModuleId: string) => void; 
  isOpen: boolean; 
  onClose: () => void; 
}> = ({ modules, selectedSubModule, onSubModuleSelect, isOpen, onClose }) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['1'])); 

  useEffect(() => {
    if (selectedSubModule) {
      for (const module of modules) {
        if (module.subModules.some(sm => sm.id === selectedSubModule)) {
          setExpandedModules(prev => {
            const newSet = new Set(prev);
            newSet.add(module.id);
            return newSet;
          });
          break; 
        }
      }
    }
  }, [selectedSubModule, modules]);

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200';
      case 'Medium': return 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200';
      case 'Hard': return 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <>
      {/* Overlay for mobile view when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar container */}
      <div className={`
        fixed top-0 h-full bg-white dark:bg-gray-800 shadow-xl z-50 transition-all duration-300 
        w-full sm:w-80 lg:relative lg:z-auto lg:shadow-none lg:border-r lg:border-gray-200 dark:lg:border-gray-700
        ${isOpen ? 'left-0' : '-left-full'} 
        ${!isOpen && 'hidden lg:block'}
      `}>
        {/* Mobile sidebar header with close button */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Learning Path</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Scrollable content of the sidebar */}
        <div className="p-4 overflow-y-auto h-full pb-20">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Learning Path</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track your progress through each module</p>
          </div>

          <div className="space-y-4">
            {/* Render each module */}
            {modules && Array.isArray(modules) && modules.map((module, index) => (
              <div key={module.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm dark:shadow-gray-900/20">
                {/* Module title and expand/collapse toggle */}
                <div 
                  className={`p-4 cursor-pointer transition-colors flex items-center justify-between group ${
                    expandedModules.has(module.id) ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-base shadow dark:shadow-blue-900/20">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">{module.title}</h3>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {module.completedLessons}/{module.totalLessons} lessons
                      </div>
                    </div>
                  </div>
                  {expandedModules.has(module.id) ? 
                    <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" /> : 
                    <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" /> 
                  }
                </div>

                {/* Submodules list (only visible when the parent module is expanded) */}
                {expandedModules.has(module.id) && (
                  <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 pt-2 pb-1">
                    {module.subModules.map((subModule) => (
                      <div
                        key={subModule.id}
                        className={`py-3 px-4 cursor-pointer transition-colors border-l-4 rounded-r-md mx-2 mb-1 last:mb-0 ${
                          selectedSubModule === subModule.id 
                            ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-600 dark:border-blue-400 text-blue-800 dark:text-blue-200 font-medium shadow-sm dark:shadow-blue-900/20'
                            : 'bg-white dark:bg-gray-800 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => {
                          onSubModuleSelect(module.id, subModule.id);
                        }}
                      >
                        <div className="flex items-start gap-2">
                          {subModule.completed ? 
                            <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0 mt-1" /> : 
                            <Circle className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-1" />
                          }
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{subModule.title}</h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(subModule.difficulty)}`}>
                                {subModule.difficulty}
                              </span>
                              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                <Clock className="w-3.5 h-3.5" />
                                {subModule.duration}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// MainContentArea Component
// Displays the content of the selected sub-module and its horizontal navigation tabs.
const MainContentArea: React.FC<{
  selectedSubModuleData: typeof sampleCourse['modules'][0]['subModules'][0] | null;
  selectedContentTab: string;
  onContentTabSelect: (tabId: string) => void;
}> = ({ selectedSubModuleData, selectedContentTab, onContentTabSelect }) => {
  if (!selectedSubModuleData) {
    return (
      <div className="flex-1 p-8 text-center text-gray-600 dark:text-gray-400 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <BookOpen className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">Select a lesson from the sidebar to begin.</p>
        <p className="text-base text-gray-500 dark:text-gray-400 mt-3">Your course content will appear here.</p>
      </div>
    );
  }

  const { title, content } = selectedSubModuleData;
  const tabs = content?.tabs || [];
  // Safely get the content for the selected tab by searching the tabs array
  const currentTab = tabs.find((tab: { id: string }) => tab.id === selectedContentTab);

  // Type guard for content object
  let currentContent: string | undefined = undefined;
  if (currentTab && content) {
    // Check if content has a property with the tab id
    if (Object.prototype.hasOwnProperty.call(content, currentTab.id)) {
      // @ts-expect-error: Index signature is not present, but we know the structure at runtime
      currentContent = content[currentTab.id];
    }
  }

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/20 p-6 md:p-8 mb-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">{title}</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{selectedSubModuleData.difficulty} &bull; {selectedSubModuleData.duration}</p>

        {/* Horizontal Navigation Tabs */}
        {tabs.length > 0 && (
          <div className="flex flex-wrap -mb-px border-b border-gray-200 dark:border-gray-700 overflow-x-auto no-scrollbar">
            {tabs.map((tab: { id: string; label: string; icon: any }) => {
              const Icon = tab.icon;
              const isActive = selectedContentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onContentTabSelect(tab.id)}
                  className={`
                    flex items-center flex-shrink-0 gap-2 px-5 py-3 text-base font-semibold rounded-t-lg transition-all duration-200
                    ${isActive
                      ? 'text-blue-700 dark:text-blue-300 border-b-3 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-sm dark:shadow-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Content display area */}
        <div className="prose prose-base sm:prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 py-6">
          {currentContent ? (
            <p>{currentContent}</p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              Loading content... (This would be fetched from an API in a real application)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


// Main Application Component
const CircularArrangementIndex: React.FC = () => {
  const [selectedSubModuleId, setSelectedSubModuleId] = useState<string>('1-1'); 
  const [selectedSubModuleData, setSelectedSubModuleData] = useState<typeof sampleCourse['modules'][0]['subModules'][0] | null>(null);
  const [selectedContentTab, setSelectedContentTab] = useState<string>(''); 
  
  // State to determine if it's a large screen (desktop)
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024); // Tailwind's 'lg' breakpoint
  // sidebarOpen state, initialized based on screen size
  const [sidebarOpen, setSidebarOpen] = useState(isLargeScreen); 

  const [course] = useState(sampleCourse); 

  // Effect to handle screen resize and update isLargeScreen
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Effect to update sidebarOpen when isLargeScreen changes
  useEffect(() => {
    setSidebarOpen(isLargeScreen);
  }, [isLargeScreen]);


  useEffect(() => {
    let foundSubModule: typeof sampleCourse['modules'][0]['subModules'][0] | null = null;
    for (const module of course.modules) {
      foundSubModule = module.subModules.find(sm => sm.id === selectedSubModuleId) || null;
      if (foundSubModule) {
        break;
      }
    }
    setSelectedSubModuleData(foundSubModule);
    if (foundSubModule && foundSubModule.content && foundSubModule.content.tabs.length > 0) {
      setSelectedContentTab(foundSubModule.content.tabs[0].id);
    } else {
      setSelectedContentTab(''); 
    }
  }, [selectedSubModuleId, course.modules]);

  const handleSubModuleSelect = (moduleId: string, subModuleId: string) => {
    setSelectedSubModuleId(subModuleId);
    // On mobile, close sidebar when a lesson is selected
    if (!isLargeScreen) {
      setSidebarOpen(false); 
    }
  };

  const handleContentTabSelect = (tabId: string) => {
    setSelectedContentTab(tabId);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col font-sans overflow-x-hidden"> 
      {/* Compact Header */}
      <CompactCourseHeader
        title={course.title}
        level={course.level}
        overallProgress={course.overallProgress}
        onMenuToggle={() => setSidebarOpen(prev => !prev)}
      />

      <div className="flex flex-1 overflow-hidden"> 
        {/* Vertical Sidebar */}
        <VerticalSidebar
          modules={course.modules}
          selectedSubModule={selectedSubModuleId}
          onSubModuleSelect={handleSubModuleSelect}
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        {/* Main Content Area */}
        <MainContentArea
          selectedSubModuleData={selectedSubModuleData}
          selectedContentTab={selectedContentTab}
          onContentTabSelect={handleContentTabSelect}
        />
      </div>
    </div>
  );
};
export default CircularArrangementIndex;

