import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { MessageSquare, Sun, Moon, LogOut, ChevronDown, Plus, PanelLeft, Search, FileText, Bot, FolderKanban, MoreVertical, Layers } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Layout: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAssistantsOpen, setIsAssistantsOpen] = useState(true);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isRecentChatsOpen, setIsRecentChatsOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  // Placeholder mock data for the layout demo
  const recentChats = [
    { id: 1, title: 'Análise de Vendas' },
    { id: 2, title: 'Relatório Mensal' },
  ];

  // Derive display name from user metadata or email
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';
  const companyName = user?.user_metadata?.company_name || 'Minha Empresa'; // In a real app, fetch from relation

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      {/* Sidebar - Multiplier AI Style */}
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col z-10 transition-all duration-300 text-gray-700 dark:text-gray-100`}>

        {/* Header da Sidebar */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800">
             {!isSidebarCollapsed && (
                <div className="font-bold text-lg tracking-tight flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#7e639f] rounded flex items-center justify-center text-white text-xs">M</div>
                    Multiplier AI
                </div>
             )}
             {isSidebarCollapsed && (
                 <div className="w-6 h-6 bg-[#7e639f] rounded flex items-center justify-center text-white text-xs mx-auto">M</div>
             )}
             <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
             >
                <PanelLeft size={18} />
             </button>
        </div>

        {/* Menu Principal */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">

          <div className="space-y-1">
              <Link
                to="/chat"
                className={`flex items-center gap-3 h-8 px-3 rounded-md transition-all duration-200 text-sm font-medium ${isActive('/chat') ? 'bg-[#7e639f]/10 text-[#7e639f] border-r-2 border-[#7e639f]' : 'text-gray-600 dark:text-gray-300 hover:bg-[#7e639f]/10 hover:text-[#7e639f]'}`}
                title="Novo Chat"
              >
                <Plus size={20} className={isActive('/chat') ? 'text-[#7e639f]' : ''} />
                {!isSidebarCollapsed && <span>Novo Chat</span>}
              </Link>
              <button
                className={`w-full flex items-center gap-3 h-8 px-3 rounded-md transition-all duration-200 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-[#7e639f]/10 hover:text-[#7e639f]`}
                title="Buscar em chats"
              >
                <Search size={20} />
                {!isSidebarCollapsed && <span>Buscar em chats</span>}
              </button>
              <button
                className={`w-full flex items-center gap-3 h-8 px-3 rounded-md transition-all duration-200 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-[#7e639f]/10 hover:text-[#7e639f]`}
                title="Arquivos"
              >
                <FileText size={20} />
                {!isSidebarCollapsed && <span>Arquivos</span>}
              </button>
              <button
                className={`w-full flex items-center gap-3 h-8 px-3 rounded-md transition-all duration-200 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-[#7e639f]/10 hover:text-[#7e639f]`}
                title="Documentos"
              >
                <MessageSquare size={20} />
                {!isSidebarCollapsed && <span>Documentos</span>}
              </button>
              <button
                className={`w-full flex items-center gap-3 h-8 px-3 rounded-md transition-all duration-200 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-[#7e639f]/10 hover:text-[#7e639f]`}
                title="Categorias"
              >
                <Layers size={20} />
                {!isSidebarCollapsed && <span>Categorias</span>}
              </button>
          </div>

          {/* Collapsible Sections */}
          {!isSidebarCollapsed && (
            <>
              {/* Assistentes */}
              <div className="pt-2">
                 <button
                    onClick={() => setIsAssistantsOpen(!isAssistantsOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors group"
                 >
                    ASSISTENTES
                    <ChevronDown size={14} className={`transition-transform duration-200 opacity-0 group-hover:opacity-100 ${isAssistantsOpen ? '' : '-rotate-90'}`} />
                 </button>
                 {isAssistantsOpen && (
                     <div className="mt-1 space-y-1">
                        <button className="w-full flex items-center gap-3 h-8 px-3 rounded-md transition-all duration-200 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-[#7e639f]/10 hover:text-[#7e639f]">
                            <Bot size={20} />
                            <span>Explorar</span>
                        </button>
                     </div>
                 )}
              </div>

              {/* Projetos */}
              <div className="pt-2">
                 <button
                    onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors group"
                 >
                    PROJETOS
                    <ChevronDown size={14} className={`transition-transform duration-200 opacity-0 group-hover:opacity-100 ${isProjectsOpen ? '' : '-rotate-90'}`} />
                 </button>
                 {isProjectsOpen && (
                     <div className="mt-1 space-y-1">
                        <button className="w-full flex items-center gap-3 h-8 px-3 rounded-md transition-all duration-200 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-[#7e639f]/10 hover:text-[#7e639f]">
                            <FolderKanban size={20} />
                            <span>Novo Projeto</span>
                        </button>
                     </div>
                 )}
              </div>

              {/* Conversas Recentes */}
              <div className="pt-2">
                 <button
                    onClick={() => setIsRecentChatsOpen(!isRecentChatsOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors group"
                 >
                    CONVERSAS RECENTES
                    <ChevronDown size={14} className={`transition-transform duration-200 opacity-0 group-hover:opacity-100 ${isRecentChatsOpen ? '' : '-rotate-90'}`} />
                 </button>
                 {isRecentChatsOpen && (
                     <div className="mt-1 space-y-1">
                        {recentChats.map(chat => (
                            <div key={chat.id} className="group relative flex items-center justify-between h-8 px-3 rounded-md hover:bg-[#7e639f]/10 cursor-pointer text-gray-600 hover:text-[#7e639f] transition-colors">
                                <span className="text-sm truncate pr-6">{chat.title}</span>
                                <button className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-white rounded text-gray-400 hover:text-gray-700 transition-all">
                                    <MoreVertical size={14} />
                                </button>
                            </div>
                        ))}
                     </div>
                 )}
              </div>
            </>
          )}

        </nav>

        {/* User Menu (Bottom) */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800">
          <div className="relative">
             <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors text-left group`}
             >
                <div className="w-8 h-8 bg-[#7e639f] rounded flex items-center justify-center text-xs text-white font-medium uppercase flex-shrink-0">
                    {displayName.substring(0, 2)}
                </div>
                {!isSidebarCollapsed && (
                    <>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate group-hover:text-[#7e639f]">{displayName}</p>
                            <p className="text-xs text-gray-500 truncate">{companyName}</p>
                        </div>
                        <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600" />
                    </>
                )}
             </button>

             {/* User Menu Dropdown */}
             {showUserMenu && (
                <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg shadow-xl py-1 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
                    <button
                        onClick={toggleTheme}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                    >
                        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                        <span>{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
                    </button>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    <button
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 flex items-center gap-2"
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
      <main className="flex-1 overflow-hidden relative flex flex-col bg-white dark:bg-gray-800 transition-colors duration-200">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
