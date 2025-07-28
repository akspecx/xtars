import React, { useState } from 'react';
// ...existing imports...

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true); // collapsed by default

  return (
    <div className={`transition-all duration-300 bg-white shadow-lg ${collapsed ? 'w-16' : 'w-64'} h-full`}>
      <button
        className="p-2 focus:outline-none"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {/* Icon for collapse/expand */}
        <span>{collapsed ? '➡️' : '⬅️'}</span>
      </button>
      {!collapsed && (
        <div>
          {/* ...sidebar content... */}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
