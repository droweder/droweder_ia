import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { MessageSquare, CreditCard, Shield, Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Layout: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Derive display name from user metadata or email
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';
  const companyName = user?.user_metadata?.company_name || 'Minha Empresa'; // In a real app, fetch from relation

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col shadow-sm z-10 transition-colors duration-200">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">D</div>
            <span className="font-bold text-lg text-gray-800 dark:text-white tracking-tight">DRoweder AI</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/chat"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive('/chat') ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'}`}
          >
            <MessageSquare size={18} />
            <span>Chat IA</span>
          </Link>
          <Link
            to="/dashboard/billing"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive('/dashboard/billing') ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'}`}
          >
            <CreditCard size={18} />
            <span>Faturamento</span>
          </Link>

          <div className="pt-6 mt-2">
             <div className="px-3 mb-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Admin</div>
             <Link
                to="/super-admin/companies"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive('/super-admin/companies') ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'}`}
             >
                <Shield size={18} />
                <span>Gestão Empresas</span>
             </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="relative">
             <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors text-left"
             >
                <div className="w-9 h-9 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-indigo-600 dark:to-indigo-800 rounded-full flex items-center justify-center text-xs text-white font-medium ring-2 ring-white dark:ring-gray-700 uppercase">
                    {displayName.substring(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">{displayName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{companyName}</p>
                </div>
                <ChevronDown size={14} className="text-gray-400" />
             </button>

             {/* User Menu Dropdown */}
             {showUserMenu && (
                <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <button
                        onClick={toggleTheme}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                        <span>Alternar Tema</span>
                    </button>
                    <button
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                        <LogOut size={16} />
                        <span>Sair</span>
                    </button>
                </div>
             )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
