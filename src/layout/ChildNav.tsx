import React, { useCallback } from 'react';
import { Link, useLocation } from "react-router";
import { motion } from 'framer-motion';
import { 
  Home, 
  Puzzle, 
  Gamepad2, 
  Brain, 
  UserCircle,
  Sparkles 
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

interface NavItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

const childNavItems: NavItem[] = [
  {
    name: "Home",
    icon: <Home size={32} />,
    path: "/",
    color: "bg-rose-400"
  },
  {
    name: "Learn",
    icon: <Puzzle size={32} />,
    path: "/learn",
    color: "bg-indigo-400"
  },
  {
    name: "Kids Zone",
    icon: <Gamepad2 size={32} />,
    path: "/games",
    color: "bg-emerald-400"
  },
  {
    name: "Brain Games",
    icon: <Brain size={32} />,
    path: "/puzzles",
    color: "bg-amber-400"
  },
  {
    name: "My Profile",
    icon: <UserCircle size={32} />,
    path: "/profile",
    color: "bg-violet-400"
  }
];

const ChildNav: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.2;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-4 left-0 bg-[#fffbeb] h-screen transition-all duration-300 ease-in-out z-50 border-r-4 border-amber-100 
        ${isExpanded || isMobileOpen ? "w-[260px]" : isHovered ? "w-[260px]" : "w-[100px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-10 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start px-2"}`}>
        <Link to="/" onClick={() => speak("XTARS Home")}>
          <motion.div 
            whileHover={{ rotate: [0, -10, 10, 0] }}
            className="flex items-center gap-3"
          >
            <img src="/xtars/images/logo/logo-icon.svg" alt="Logo" width={48} height={48} className="drop-shadow-lg" />
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className="text-3xl font-black text-amber-600 tracking-tighter drop-shadow-sm">XTARS</span>
            )}
          </motion.div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="flex flex-col gap-6">
          {childNavItems.map((item) => (
            <li key={item.name} className="px-2">
              <Link
                to={item.path}
                onClick={() => speak(item.name)}
                className={`flex items-center gap-4 p-3 rounded-[2rem] transition-all group relative
                  ${isActive(item.path) 
                    ? "bg-white shadow-lg ring-4 ring-amber-200" 
                    : "hover:bg-amber-50"
                  } ${!isExpanded && !isHovered ? "justify-center" : ""}`}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`${item.color} text-white p-4 rounded-full shadow-md flex items-center justify-center relative overflow-hidden`}
                >
                  {item.icon}
                  {isActive(item.path) && (
                    <motion.div 
                      layoutId="active-bg"
                      className="absolute inset-0 bg-white/20"
                    />
                  )}
                </motion.div>
                
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`text-xl font-black tracking-tight ${isActive(item.path) ? "text-amber-700" : "text-amber-900/60 group-hover:text-amber-700"}`}>
                    {item.name}
                  </span>
                )}

                {isActive(item.path) && (isExpanded || isHovered || isMobileOpen) && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="ml-auto w-3 h-3 bg-amber-500 rounded-full shadow-glow"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pb-10 flex justify-center">
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-amber-100"
        >
          <Sparkles className="text-amber-400" size={32} />
        </motion.div>
      </div>
    </aside>
  );
};

export default ChildNav;
