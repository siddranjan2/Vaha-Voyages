
import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: (passphrase: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === 'vaha2025') { // This would be a server-side check in production
      onLogin(pass);
    } else {
      setError(true);
      setPass('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Accents */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-900/30 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-900/20 blur-[100px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10 space-y-12 animate-fade-in">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-serif tracking-[0.2em] text-white uppercase">
            <span className="text-teal-500 font-bold">V</span>AHA VOYAGES
          </h2>
          <p className="text-teal-500/60 uppercase tracking-[0.4em] text-[10px] font-black">Secure Curator Node</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 space-y-10 shadow-2xl">
          <div className="space-y-4">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 font-black px-4">Access Key</label>
            <input 
              autoFocus
              type="password"
              placeholder="••••••••"
              className={`w-full bg-white/5 border-2 rounded-2xl px-8 py-6 text-white text-lg focus:outline-none transition-all ${error ? 'border-red-500/50 shake' : 'border-white/5 focus:border-teal-500/50'}`}
              value={pass}
              onChange={(e) => { setPass(e.target.value); setError(false); }}
            />
            {error && <p className="text-red-400 text-[10px] uppercase font-bold tracking-widest text-center px-4">Unauthorized Entry Attempt</p>}
          </div>

          <button 
            type="submit"
            className="w-full bg-teal-600 text-white font-black uppercase tracking-[0.3em] py-6 rounded-full hover:bg-white hover:text-slate-950 transition-all shadow-xl shadow-teal-600/20 active:scale-95 text-xs"
          >
            Authenticate
          </button>
        </form>

        <div className="text-center">
          <a href="/" className="text-white/20 hover:text-white/60 text-[10px] uppercase tracking-[0.4em] font-black transition-colors">Return to Civilisation</a>
        </div>
      </div>
      
      <style>{`
        .shake { animation: shake 0.4s ease-in-out; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
