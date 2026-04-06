import { useSidebar } from "../context/SidebarContext";
import { useMode } from "../context/ModeContext";
import { Outlet, useLocation, useNavigate } from "react-router"; 
import { useProfile } from "../context/ProfileContext";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import ParentNav from "./ParentNav";
import AppSidebar from "./AppSidebar";
import ParentalGate from "./ParentalGate";


const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { isParentMode, showParentalGate, closeParentalGate, toggleMode } = useMode();
  const { activeProfile } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine which navigation to show
  // 1. Parent Mode takes precedence if active
  // 2. Profile-specific navigation (restores lost 2-day work)
  // 3. Current path logic as fallback
  
  const isKidsZonePath = location.pathname.startsWith('/games') || 
                         location.pathname.startsWith('/puzzles') ||
                         location.pathname.startsWith('/roadmap');
  const renderNav = () => {
    if (isParentMode) return <ParentNav />;
    
    // Kids profile-specific logic: No sidebar for any Kids module (Restores user requirement)
    if (activeProfile?.type === 'KIDS') return null;

    return <AppSidebar />;
  };

  const handleGateSuccess = () => {
    // Logic for successful gate completion is handled in ModeContext
    closeParentalGate();
    toggleMode(location.pathname); // Save current path before switching (Restores user requirement)
    navigate('/parent'); // Redirect to Parent Dashboard immediately
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Dynamic Navigation Component */}
      {renderNav()}

      {/* Backdrop for mobile */}
      {isMobileOpen && <Backdrop />}

      {/* Main Content Area */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          isParentMode || activeProfile?.type === 'KIDS' ? "lg:ml-0" : 
          isKidsZonePath ? (isExpanded || isHovered || isMobileOpen ? "lg:ml-[260px]" : "lg:ml-[100px]") :
          (isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]")
        }`}
      >
        <AppHeader />
        
        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
          

          
          {/* Parental Gate Overlay */}
          {showParentalGate && (
            <ParentalGate 
              onSuccess={handleGateSuccess} 
              onClose={closeParentalGate} 
            />
          )}
        </main>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return <LayoutContent />;
};

export default AppLayout;
