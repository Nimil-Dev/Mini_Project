import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiGrid, FiRss, FiCalendar, FiUsers, FiCpu, FiBookmark, FiLogOut 
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isCollapsed }) => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard/student', icon: FiGrid },
    { name: 'Campus Feed', path: '/feed', icon: FiRss },
    { name: 'Events', path: '/events', icon: FiCalendar },
    { name: 'Clubs', path: '/clubs', icon: FiUsers },
    { name: 'AI Assistant', path: '/ai', icon: FiCpu },
    { name: 'Bookmarks', path: '/bookmarks', icon: FiBookmark },
  ];

  return (
    <aside className={`hidden md:flex flex-col fixed top-16 left-0 h-[calc(100vh-4rem)] border-r border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 transition-all duration-300 z-30 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Navigation Options */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition duration-150 group
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }
              `}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Anchor */}
      <div className="p-3 border-t border-slate-200/50 dark:border-slate-800/50">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition duration-150"
        >
          <FiLogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;