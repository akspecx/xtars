import React from 'react';
import { Link, useLocation, useNavigate } from "react-router"; 
import { 
  LayoutDashboard, 
  BarChart3, 
  UserCog, 
  Settings as SettingsIcon, 
  CreditCard, 
  Info,
  LogOut
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { useMode } from "../context/ModeContext";

const parentItems = [
  {
    icon: <LayoutDashboard className="size-5" />,
    name: "Parent Dashboard",
    path: "/parent",
  },
  {
    icon: <BarChart3 className="size-5" />,
    name: "Course Progress",
    path: "/parent/progress",
  },
  {
    icon: <UserCog className="size-5" />,
    name: "Child Profile",
    path: "/parent/profile",
  },
  {
    icon: <SettingsIcon className="size-5" />,
    name: "App Settings",
    path: "/parent/settings",
  },
  {
    icon: <CreditCard className="size-5" />,
    name: "Subscription",
    path: "/parent/subscription",
  },
  {
    icon: <Info className="size-5" />,
    name: "Platform Intro",
    path: "/parent/intro",
  },
];

const ParentNav: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { toggleMode, lastProfilePath } = useMode();
  const location = useLocation();
  const navigate = useNavigate();

  const handleExitParent = () => {
    toggleMode(); // Switch back to Child Mode
    if (lastProfilePath) {
      navigate(lastProfilePath); // Return to the game/module where the session was triggered
    } else {
      navigate("/"); // Fallback to Dashboard
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-[#f8fafc] dark:bg-[#1e293b] dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/parent">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-2">
              <img src="/xtars/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
              <span className="text-xl font-bold text-slate-800 dark:text-white">Parent Hub</span>
            </div>
          ) : (
            <img src="/xtars/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear flex-1">
        <nav className="mb-6">
          <ul className="flex flex-col gap-2">
            {parentItems.map((nav) => (
              <li key={nav.name}>
                <Link
                  to={nav.path}
                  className={`menu-item group ${isActive(nav.path) ? "menu-item-active bg-slate-200 dark:bg-slate-700 border-l-4 border-indigo-500" : "menu-item-inactive hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                >
                  <span className={`menu-item-icon-size ${isActive(nav.path) ? "text-indigo-600" : "text-slate-500"}`}>
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text font-medium">{nav.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="pb-8 mt-auto px-2">
        <button
          onClick={handleExitParent}
          className="w-full flex items-center justify-center gap-2 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-md group overflow-hidden"
        >
          <LogOut className="size-5 transition-transform group-hover:-translate-x-1" />
          {(isExpanded || isHovered || isMobileOpen) && (
            <span className="font-semibold whitespace-nowrap">Exit Parent Mode</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default ParentNav;
