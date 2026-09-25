import React, { useState } from 'react';
import { KeyRound, Lock, User, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminLoginView: React.FC = () => {
  const { adminLogin, setActiveView } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [masterKey, setMasterKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showMasterKey, setShowMasterKey] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Por favor ingresa tu usuario de administrador.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Por favor ingresa tu contraseña.');
      return;
    }
    if (!masterKey.trim()) {
      setErrorMessage('La Llave Maestra es obligatoria para validar este factor.');
      return;
    }

    setIsAuthenticating(true);
    setTimeout(() => {
      const res = adminLogin(username, password, masterKey);
      if (!res.success) {
        setErrorMessage(res.error || 'Credenciales o Llave Maestra no válidas.');
        setIsAuthenticating(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#0F172A] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#FFD242]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#6F4E37]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Top brand header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#1E293B] border border-[#FFD242]/40 text-[#FFD242] shadow-xl mb-2">
            <KeyRound className="w-8 h-8" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FFD242] text-[#2D1A0D]">
              Triple Factor Auth
            </span>
            <span className="text-xs text-slate-400 font-mono">/admincoffe</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
            Acceso Administrativo Melífera
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Consola privada y segura para la administración de productos, pedidos contraentrega, eventos y cotizaciones.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-[#1E293B]/90 backdrop-blur-md rounded-[32px] p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <strong className="block font-bold">Error de Autenticación</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Factor 1: Usuario */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#FFD242]" />
                <span>1. Usuario Administrador</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario de administrador"
                autoComplete="username"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-600 text-xs focus:outline-none focus:ring-2 focus:ring-[#FFD242] focus:border-transparent transition"
              />
            </div>

            {/* Factor 2: Contraseña */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#FFD242]" />
                  <span>2. Contraseña</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-600 text-xs focus:outline-none focus:ring-2 focus:ring-[#FFD242] focus:border-transparent transition"
              />
            </div>

            {/* Factor 3: Llave Maestra (Master Key) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#FFD242]" />
                  <span>3. Llave Maestra (Master Key)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowMasterKey(!showMasterKey)}
                  className="text-[10px] text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {showMasterKey ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <input
                type={showMasterKey ? 'text' : 'password'}
                value={masterKey}
                onChange={(e) => setMasterKey(e.target.value)}
                placeholder="Ingresa tu llave maestra"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-amber-500/40 text-amber-200 placeholder-slate-600 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#FFD242] focus:border-transparent transition"
              />
              <p className="text-[10px] text-slate-400 pt-0.5">
                Clave criptográfica maestra requerida para validar la sesión del panel.
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full mt-4 py-3.5 px-6 rounded-2xl bg-[#FFD242] hover:bg-[#ecc030] text-[#2D1A0D] font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-[#FFD242]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
            >
              {isAuthenticating ? (
                <span>Validando 3 Factores...</span>
              ) : (
                <>
                  <span>Autenticar y Entrar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Public Site */}
        <div className="text-center mt-6">
          <button
            onClick={() => setActiveView('inicio')}
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al sitio público</span>
          </button>
        </div>
      </div>
    </div>
  );
};
