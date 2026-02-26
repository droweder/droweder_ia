import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative flex flex-col bg-white dark:bg-gray-800 transition-colors duration-200">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
