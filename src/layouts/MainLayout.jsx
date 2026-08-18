import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/sidebar/Sidebar';
import BottomNavigation from '../components/BottomNavigation';

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex flex-col">
      {/* Top Navigation */}
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 relative">
        {/* Collapsible Desktop Sidebar */}
        <Sidebar isCollapsed={isSidebarCollapsed} />

        {/* Content Canvas Area */}
        <main 
          className={`flex-1 min-w-0 transition-all duration-300 px-4 py-6 md:px-8
            ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}
            pb-24 md:pb-8 /* Adds dynamic bottom spacing for mobile bottom navigation viewports */
          `}
        >
          {/* Main child pages inject here dynamically */}
          <Outlet />
        </main>
      </div>

      {/* Mobile-Only Bottom Navigation Menu */}
      <BottomNavigation />
    </div>
  );
};

export default MainLayout;