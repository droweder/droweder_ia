import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { MessageSquare, CreditCard, Shield } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">D</div>
            <span className="font-bold text-lg text-gray-800 tracking-tight">DRoweder AI</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/chat"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive('/chat') ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <MessageSquare size={18} />
            <span>Chat IA</span>
          </Link>
          <Link
            to="/dashboard/billing"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive('/dashboard/billing') ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <CreditCard size={18} />
            <span>Faturamento</span>
          </Link>

          <div className="pt-6 mt-2">
             <div className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin</div>
             <Link
                to="/super-admin/companies"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive('/super-admin/companies') ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
             >
                <Shield size={18} />
                <span>Gestão Empresas</span>
             </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-xs text-white font-medium ring-2 ring-white">JD</div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                <p className="text-xs text-gray-500 truncate">Planintex Corp</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
