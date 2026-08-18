import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiRss, FiCalendar, FiUsers, FiCpu } from 'react-icons/fi';

const BottomNavigation = () => {
  const navItems = [
    { name: 'Home', path: '/dashboard/student', icon: FiGrid },
    { name: 'Feed', path: '/feed', icon: FiRss },
    { name: 'AI Helper', path: '/ai', icon: FiCpu },
    { name: 'Events', path: '/events', icon: FiCalendar },
    { name: 'Clubs', path: '/clubs', icon: FiUsers },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200/50 dark:border-slate-800/50 flex justify-around items-center px-2 pb-safe z-40">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-500 transition-colors
              ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}
            `}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">{item.name}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default BottomNavigation;