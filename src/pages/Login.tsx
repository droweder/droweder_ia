import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        setError("Por favor, preencha todos os campos.");
        return;
    }

    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      navigate('/chat');
    } catch (err: any) {
      console.error(err);
      if (err.message === "Invalid login credentials") {
          setError("E-mail ou senha incorretos.");
      } else {
          setError('Erro ao fazer login: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-gray-100">

      {/* Background Aurora Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-red-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[10000ms]" />
          <div className="absolute top-[30%] -right-[20%] w-[60%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[7000ms]" />
          <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] bg-yellow-500/20 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[10000ms]" />
          {/* subtle noise overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
            <img src="https://phofwpyxbeulodrzfdjq.supabase.co/storage/v1/object/public/imagens_app/favicom_droweder.png" alt="DRoweder IA" className="w-12 h-12 object-contain" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Entrar na DRoweder AI
        </h2>
        <p className="mt-2 text-center text-sm text-gray-300">
          Acesso seguro para empresas conectadas ao Planintex
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Endereço de e-mail
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-10 sm:text-sm border-transparent rounded-md py-2.5 border bg-[#e6f0ff] text-slate-900 placeholder-slate-500 transition-all font-medium"
                  placeholder="voce@empresa.com"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {/* The image shows a key icon in a hexagon on the right side of the input boxes */}
                  <div className="text-slate-700 bg-slate-300/50 p-1 rounded">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-16 sm:text-sm border-transparent rounded-md py-2.5 border bg-[#e6f0ff] text-slate-900 placeholder-slate-500 transition-all font-medium tracking-widest"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-1 flex items-center gap-1">
                  <button
                    type="button"
                    className="p-1 text-slate-500 hover:text-slate-700 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                  <div className="text-slate-700 bg-slate-300/50 p-1 rounded pointer-events-none mr-2">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            {error && (
                <div className="rounded-md bg-red-900/30 p-4 border border-red-500/30 backdrop-blur-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-200">{error}</h3>
                        </div>
                    </div>
                </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all gap-2 items-center"
              >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin h-4 w-4" />
                        Entrando...
                    </>
                ) : (
                    'Entrar'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-400 bg-slate-900">
                  Segurança Enterprise
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-2 text-xs text-gray-400 items-center text-center opacity-80">
                <ShieldCheck size={14} className="flex-shrink-0" />
                <span>Seus dados são protegidos com criptografia de ponta a ponta.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
