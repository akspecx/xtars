import React from 'react';
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { ModeProvider, useMode } from "../context/ModeContext";
import { Outlet, useLocation } from "react-router"; 
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import ParentNav from "./ParentNav";
import ChildNav from "./ChildNav";
import AppSidebar from "./AppSidebar";
import ParentalGate from "./ParentalGate";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { isParentMode, showParentalGate, closeParentalGate, toggleMode } = useMode();
  const location = useLocation();

  // Determine which navigation to show
  // 1. Parent Mode takes precedence if active
  // 2. Child Mode (Kids Zone) if the path is related to games/kids
  // 3. Standard Sidebar for everything else
  
  const isKidsZonePath = location.pathname.startsWith('/games') || 
                         location.pathname.startsWith('/puzzles') ||
                         location.pathname.startsWith('/roadmap');

  const renderNav = () => {
    if (isParentMode) return <ParentNav />;
    if (isKidsZonePath) return <ChildNav />;
    return <AppSidebar />;
  };

  const handleGateSuccess = () => {
    // Logic for successful gate completion is handled in ModeContext
    closeParentalGate();
    toggleMode(); // Ensure Parent Mode is activated
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
          isParentMode ? "lg:ml-0" : 
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
  return (
    <SidebarProvider>
      <ModeProvider>
        <LayoutContent />
      </ModeProvider>
    </SidebarProvider>
  );
};

export default AppLayout;
