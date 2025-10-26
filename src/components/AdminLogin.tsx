import { useState } from 'react';
import { X, Lock, User, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'cfdt2025';

export default function AdminLogin({ onClose, onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simuler une petite latence pour une meilleure UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Stocker la session dans localStorage
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_username', username);
      onSuccess();
    } else {
      setError('Nom d\'utilisateur ou mot de passe incorrect');
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl shadow-2xl border border-purple-500/30 max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-md border-b border-purple-500/20 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors p-2 hover:bg-purple-500/20 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600/30 rounded-lg">
              <Lock className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-light text-white">Connexion Admin</h3>
              <p className="text-sm text-purple-200">Accès sécurisé au panneau</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-light text-slate-300">
              <User className="w-4 h-4" />
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              autoFocus
              className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white font-light placeholder-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-light text-slate-300">
              <Lock className="w-4 h-4" />
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white font-light placeholder-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-red-300">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 shadow-lg transition-all duration-200 font-light disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connexion...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Se connecter
              </>
            )}
          </button>

          <p className="text-xs text-center text-slate-500">
            L'accès admin est réservé aux administrateurs autorisés
          </p>
        </form>
      </div>
    </div>
  );
}

