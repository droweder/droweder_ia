import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, ChevronDown, ChevronUp, Bot, User, Database, ShieldCheck, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { chatWithOpenRouterViaEdge } from '../lib/openRouterEdge';
import type { OpenRouterMessage } from '../lib/openRouterClient';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    model_used?: string;
}

interface Conversation {
    id: string;
    title: string;
    created_at: string;
}

const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [showSql, setShowSql] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedModel, setSelectedModel] = useState<string>('google/gemini-2.0-flash-lite-preview-02-05:free');

  const models = [
    { id: 'google/gemini-2.0-flash-lite-preview-02-05:free', name: 'Gemini 2.0 Flash Lite (Free)' },
    { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1 (Free)' },
    { id: 'meta-llama/llama-3-8b-instruct:free', name: 'Llama 3 8B (Free)' },
    { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B (Free)' },
  ];

  useEffect(() => {
    if (user) {
        fetchCompanyId();
        fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (activeConversationId) {
        fetchMessages(activeConversationId);
    } else {
        setMessages([]); // Clear messages when creating new conversation
    }
  }, [activeConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchCompanyId = async () => {
    if (!user) return;
    try {
        const { data, error } = await supabase
            .schema('planintex')
            .from('users')
            .select('company_id')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching user company:', error);
            setError("Não foi possível identificar sua empresa.");
        } else if (data) {
            setCompanyId(data.company_id);
        } else {
             setError("Sua conta não está vinculada a nenhuma empresa no Planintex.");
        }
    } catch (err) {
        console.error("Unexpected error fetching company:", err);
    }
  };

  const fetchConversations = async () => {
    const { data, error } = await supabase
        .schema('droweder_ia')
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) console.error('Error fetching conversations:', error);
    if (data) {
        setConversations(data);
        if (data.length > 0 && !activeConversationId) {
            setActiveConversationId(data[0].id);
        }
    }
  };

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase
        .schema('droweder_ia')
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

    if (error) console.error('Error fetching messages:', error);
    if (data) setMessages(data as Message[]);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !user || !companyId) {
        if (!companyId) setError("Empresa não identificada. Contate o suporte.");
        return;
    }

    const newMessageContent = input;
    setInput('');
    setLoading(true);
    setError(null);

    let conversationId = activeConversationId;

    // Create conversation if none exists
    if (!conversationId) {
        const { data: newConv, error: convError } = await supabase
            .schema('droweder_ia')
            .from('conversations')
            .insert({
                user_id: user.id,
                company_id: companyId,
                title: newMessageContent.substring(0, 30) + '...',
            })
            .select()
            .single();

        if (convError || !newConv) {
            console.error('Error creating conversation:', convError);
            setError("Erro ao iniciar conversa.");
            setLoading(false);
            return;
        }
        conversationId = newConv.id;
        setActiveConversationId(newConv.id);
        setConversations([newConv, ...conversations]);
    }

    // Save user message
    const { error: msgError } = await supabase
        .schema('droweder_ia')
        .from('messages')
        .insert({
            conversation_id: conversationId,
            role: 'user',
            content: newMessageContent
        });

    if (msgError) {
        console.error('Error saving message:', msgError);
        setLoading(false);
        return;
    }

    // Optimistic update
    const userMessage: Message = { id: 'temp-' + Date.now(), role: 'user', content: newMessageContent };
    setMessages(prev => [...prev, userMessage]);

    // Construct message history for LLM context
    const openRouterMessages: OpenRouterMessage[] = [
        { role: 'system', content: `Você é um assistente de IA especialista em manufatura e PCP (Planejamento e Controle da Produção), conectado ao ERP Planintex.
        Seu objetivo é ajudar gestores a entender seus dados. Responda em Português do Brasil.
        Você tem acesso (simulado) a tabelas de 'ordens', 'estoque' e 'previsão'.` },
        ...messages.map(m => ({ role: m.role, content: m.content }) as OpenRouterMessage),
        { role: 'user', content: newMessageContent }
    ];

    try {
        const aiResponse = await chatWithOpenRouterViaEdge(selectedModel, openRouterMessages);

        const aiContent = aiResponse?.choices[0]?.message?.content || "Desculpe, não consegui processar sua solicitação no momento.";
        const modelUsed = aiResponse?.model || selectedModel;

        // Save AI response
        const { data: aiMsg, error: aiError } = await supabase
            .schema('droweder_ia')
            .from('messages')
            .insert({
                conversation_id: conversationId,
                role: 'assistant',
                content: aiContent,
                model_used: modelUsed,
            })
            .select()
            .single();

        if (aiMsg) {
            setMessages(prev => [...prev, aiMsg as Message]);
        } else if (aiError) {
             console.error('Error saving AI message:', aiError);
             // Show error in UI as fallback
             setMessages(prev => [...prev, { id: 'err-' + Date.now(), role: 'assistant', content: "Erro ao salvar resposta no histórico." }]);
        }

    } catch (error) {
        console.error("LLM Error:", error);
        setMessages(prev => [...prev, { id: 'err-' + Date.now(), role: 'assistant', content: "Erro de conexão com a IA. Tente novamente." }]);
    } finally {
        setLoading(false);
    }
  };

  const toggleSql = (msgId: string) => {
    if (showSql === msgId) {
        setShowSql(null);
    } else {
        setShowSql(msgId);
    }
  }


  return (
    <div className="flex h-full bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      {/* Sidebar - History */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex flex-col hidden md:flex transition-colors duration-200">
        <div className="p-4 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800 text-sm uppercase tracking-wider flex justify-between items-center">
            <span>Histórico</span>
            <button
                onClick={() => setActiveConversationId(null)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-xs transition-colors"
            >
                NOVA
            </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.map(conv => (
                <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-colors truncate ${activeConversationId === conv.id ? 'bg-white dark:bg-gray-800 shadow-sm text-indigo-700 dark:text-indigo-400 font-medium ring-1 ring-gray-200 dark:ring-gray-700' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    <Bot size={16} className={activeConversationId === conv.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'} />
                    <span className="truncate">{conv.title}</span>
                </button>
            ))}
            {conversations.length === 0 && (
                <div className="text-center p-4 text-xs text-gray-400">Nenhuma conversa ainda.</div>
            )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 shadow-sm z-10 transition-colors duration-200">
            <div className="flex items-center gap-4">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Bot className="text-indigo-600 dark:text-indigo-400" size={20} />
                    Assistente de PCP
                </h2>

                {/* Model Selector */}
                <div className="relative group">
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                        {models.map(model => (
                            <option key={model.id} value={model.id}>{model.name}</option>
                        ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck size={14} />
                <span className="hidden sm:inline">Conectado de forma segura ao Planintex</span>
                <span className="sm:hidden">Seguro</span>
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-50/50 dark:bg-gray-950 transition-colors duration-200">
            {messages.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-2">
                        <Sparkles size={32} className="text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Como posso ajudar com sua produção hoje?</p>
                </div>
            )}

            {/* Error Banner */}
            {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800 mx-auto max-w-2xl mt-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                        </div>
                    </div>
                </div>
            )}

            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-emerald-600 dark:text-emerald-400'}`}>
                        {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </div>
                    <div className={`max-w-[85%] md:max-w-[70%] space-y-2`}>
                        <div className={`p-4 rounded-2xl text-sm shadow-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'}`}>
                            {msg.content}
                        </div>

                        {/* Mock Text-to-SQL Accordion for Assistant */}
                        {msg.role === 'assistant' && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-xs shadow-sm w-full max-w-lg transition-colors duration-200">
                                <button
                                    onClick={() => toggleSql(msg.id)}
                                    className="w-full flex items-center justify-between px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-gray-50/50 dark:bg-gray-800/50"
                                >
                                    <div className="flex items-center gap-2">
                                        <Database size={14} className="text-blue-600 dark:text-blue-400" />
                                        <span className="font-medium text-blue-900 dark:text-blue-300">Ver SQL Gerado (Simulação)</span>
                                    </div>
                                    {showSql === msg.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                                {showSql === msg.id && (
                                    <div className="p-3 bg-slate-900 text-blue-300 font-mono overflow-x-auto border-t border-gray-200 dark:border-gray-700 text-[11px] leading-relaxed">
                                        <code>SELECT * FROM planintex.ordens LIMIT 5; -- Exemplo</code>
                                    </div>
                                )}
                            </div>
                        )}

                        {msg.role === 'assistant' && msg.model_used && (
                            <div className="text-[10px] text-gray-400 text-right pr-1">
                                Gerado por {msg.model_used}
                            </div>
                        )}
                    </div>
                </div>
            ))}
             {loading && (
                <div className="flex gap-4 animate-pulse">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-emerald-600 dark:text-emerald-400">
                        <Loader2 size={18} className="animate-spin" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 p-4 rounded-2xl rounded-tl-none text-sm shadow-sm flex items-center gap-2">
                        <span>Processando...</span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
            <div className="max-w-4xl mx-auto space-y-3">
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Pergunte sobre sua produção..."
                        disabled={loading}
                        className="w-full pl-4 pr-12 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-gray-900 dark:text-gray-100 group-hover:bg-white dark:group-hover:bg-gray-800 group-hover:shadow-sm disabled:opacity-50"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <Paperclip size={18} />
                        </button>
                        <button
                            onClick={handleSendMessage}
                            disabled={!input.trim() || loading}
                            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">A IA pode cometer erros. Verifique informações importantes.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
