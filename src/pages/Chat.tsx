import React, { useState } from 'react';
import { Send, Paperclip, ChevronDown, ChevronUp, Bot, User, Database, ShieldCheck } from 'lucide-react';

const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [showSql, setShowSql] = useState(false);

  const assistants = [
    { id: 1, name: 'Assistente de PCP', active: true },
    { id: 2, name: 'Análise de Gargalos', active: false },
    { id: 3, name: 'Previsão de Demanda', active: false },
  ];

  const messages = [
    {
        id: 1,
        role: 'user',
        content: 'Qual é o status da ordem de produção #1234?'
    },
    {
        id: 2,
        role: 'assistant',
        content: 'A ordem de produção #1234 está atualmente em processo de montagem final.',
        sql: "SELECT id, status, description FROM planintex.ordens WHERE id = '1234' AND company_id = 'uuid-company-123';"
    }
  ];

  return (
    <div className="flex h-full bg-white overflow-hidden">
      {/* Assistants Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col hidden md:flex">
        <div className="p-4 font-semibold text-gray-700 border-b border-gray-200 text-sm uppercase tracking-wider">
            Assistentes
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {assistants.map(assistant => (
                <button
                    key={assistant.id}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-colors ${assistant.active ? 'bg-white shadow-sm text-indigo-700 font-medium ring-1 ring-gray-200' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <Bot size={18} className={assistant.active ? 'text-indigo-600' : 'text-gray-400'} />
                    {assistant.name}
                </button>
            ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm z-10">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Bot className="text-indigo-600" size={20} />
                Assistente de PCP
            </h2>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 animate-pulse">
                <ShieldCheck size={14} />
                <span>Conectado de forma segura ao Planintex</span>
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-50/50">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-emerald-600'}`}>
                        {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </div>
                    <div className={`max-w-[85%] md:max-w-[70%] space-y-2`}>
                        <div className={`p-4 rounded-2xl text-sm shadow-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}`}>
                            {msg.content}
                        </div>

                        {/* Text-to-SQL Accordion */}
                        {msg.role === 'assistant' && msg.sql && (
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden text-xs shadow-sm w-full max-w-lg">
                                <button
                                    onClick={() => setShowSql(!showSql)}
                                    className="w-full flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors bg-gray-50/50"
                                >
                                    <div className="flex items-center gap-2">
                                        <Database size={14} className="text-blue-600" />
                                        <span className="font-medium text-blue-900">Ver SQL Gerado</span>
                                    </div>
                                    {showSql ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                                {showSql && (
                                    <div className="p-3 bg-slate-900 text-blue-300 font-mono overflow-x-auto border-t border-gray-200 text-[11px] leading-relaxed">
                                        <code>{msg.sql}</code>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
            <div className="max-w-4xl mx-auto space-y-3">
                 {/* Action Pills */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    <button className="px-3 py-1.5 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 text-gray-600 rounded-full text-xs font-medium transition-colors whitespace-nowrap border border-transparent hover:border-indigo-200">
                        🍌 Criar imagem
                    </button>
                    <button className="px-3 py-1.5 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 text-gray-600 rounded-full text-xs font-medium transition-colors whitespace-nowrap border border-transparent hover:border-indigo-200">
                        📝 Escrever relatório
                    </button>
                    <button className="px-3 py-1.5 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 text-gray-600 rounded-full text-xs font-medium transition-colors whitespace-nowrap border border-transparent hover:border-indigo-200">
                        📊 Analisar dados
                    </button>
                </div>

                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Pergunte sobre sua produção..."
                        className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm group-hover:bg-white group-hover:shadow-sm"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                            <Paperclip size={18} />
                        </button>
                        <button className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                            <Send size={16} />
                        </button>
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-gray-400">A IA pode cometer erros. Verifique informações importantes.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
