
import React, { useState, useMemo } from 'react';

const SourceCriticismFilter: React.FC = () => {
  const [sourceName, setSourceName] = useState('');
  const [authenticity, setAuthenticity] = useState(1); // 0: Low, 1: Med, 2: High
  const [time, setTime] = useState(70); // 0-100
  const [isFirstHand, setIsFirstHand] = useState(true);
  const [tendency, setTendency] = useState(2); // 0: Sälja, 1: Underhålla, 2: Informera

  const score = useMemo(() => {
    const authScore = authenticity === 2 ? 100 : authenticity === 1 ? 50 : 0;
    const timeScore = time;
    const dependenceScore = isFirstHand ? 100 : 0;
    const tendencyScore = tendency === 2 ? 100 : tendency === 1 ? 50 : 0;

    // Weights: Auth (30%), Time (20%), Dep (20%), Tend (30%)
    const total = (authScore * 0.3) + (timeScore * 0.2) + (dependenceScore * 0.2) + (tendencyScore * 0.3);
    return Math.round(total);
  }, [authenticity, time, isFirstHand, tendency]);

  const getStatus = () => {
    if (score >= 71) return { label: 'Trovärdig', color: 'text-emerald-500', bg: 'bg-emerald-500', lightBg: 'bg-emerald-50', icon: '✅' };
    if (score >= 41) return { label: 'Granska noga', color: 'text-amber-500', bg: 'bg-amber-500', lightBg: 'bg-amber-50', icon: '⚠️' };
    return { label: 'Var vaksam!', color: 'text-rose-500', bg: 'bg-rose-500', lightBg: 'bg-rose-50', icon: '🚨' };
  };

  const status = getStatus();

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-500 p-2 overflow-y-auto custom-scrollbar">
      <header className="mb-6 px-4">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Källkritik-filtret</h2>
        <div className="mt-4">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 px-1">Källans namn eller URL</label>
          <input
            type="text"
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
            placeholder="T.ex. www.wikipedia.org..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
      </header>

      <div className="flex-1 space-y-8 px-4 pb-8">
        {/* 1. ÄKTHET */}
        <section className="space-y-3">
          <div className="flex justify-between items-end">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">1. Äkthet - Vem?</h4>
            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">Vem står bakom källan?</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: 0, label: 'Okänd / Privat', icon: '👤' },
              { val: 1, label: 'Nyhetsmedia', icon: '📰' },
              { val: 2, label: 'Myndighet', icon: '🏛️' }
            ].map(item => (
              <button
                key={item.val}
                onClick={() => setAuthenticity(item.val)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                  authenticity === item.val 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-[1.02]' 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-100'
                }`}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-[9px] font-black uppercase leading-tight text-center">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 2. TID */}
        <section className="space-y-3">
          <div className="flex justify-between items-end">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">2. Tid - När?</h4>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full group relative cursor-help">
              Relevans?
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[8px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Är informationen fortfarande relevant för ämnet?
              </div>
            </span>
          </div>
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
            <input
              type="range"
              min="0"
              max="100"
              value={time}
              onChange={(e) => setTime(parseInt(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
              <span>Gammal / Inaktuell</span>
              <span>Uppdaterad</span>
            </div>
          </div>
        </section>

        {/* 3. BEROENDE */}
        <section className="space-y-3">
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">3. Beroende - Original?</h4>
          <div className="flex items-center justify-between bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${!isFirstHand ? 'text-indigo-600' : 'text-slate-400'}`}>Andrahandskälla</span>
            <button
              onClick={() => setIsFirstHand(!isFirstHand)}
              className={`relative w-14 h-8 rounded-full transition-all duration-300 ${isFirstHand ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${isFirstHand ? 'left-7' : 'left-1'}`} />
            </button>
            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isFirstHand ? 'text-indigo-600' : 'text-slate-400'}`}>Förstahandskälla</span>
          </div>
        </section>

        {/* 4. TENDENS */}
        <section className="space-y-3">
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">4. Tendens - Varför?</h4>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl">
            {[
              { val: 0, label: 'Sälja / Påverka', color: 'hover:bg-rose-100 text-rose-600' },
              { val: 1, label: 'Underhålla', color: 'hover:bg-amber-100 text-amber-600' },
              { val: 2, label: 'Informera / Fakta', color: 'hover:bg-emerald-100 text-emerald-600' }
            ].map(item => (
              <button
                key={item.val}
                onClick={() => setTendency(item.val)}
                className={`py-3 px-1 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${
                  tendency === item.val 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : `text-slate-400 ${item.color}`
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* TRUST METER */}
      <footer className="shrink-0 p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-[2.5rem]">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] block mb-1">Resultat</span>
            <h3 className={`text-3xl font-black transition-colors ${status.color}`}>{status.label} {status.icon}</h3>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-slate-800 tabular-nums">{score}%</span>
          </div>
        </div>
        
        <div className="h-6 bg-slate-200 rounded-full overflow-hidden p-1 shadow-inner relative">
          <div 
            className={`h-full rounded-full transition-all duration-700 ease-out shadow-lg ${status.bg}`}
            style={{ width: `${score}%` }}
          />
          {/* Markers */}
          <div className="absolute inset-0 flex pointer-events-none">
            <div className="w-[40%] border-r border-white/30 h-full" />
            <div className="w-[30%] border-r border-white/30 h-full" />
          </div>
        </div>
        
        <p className="mt-4 text-[9px] text-slate-400 font-medium italic text-center">
          Beräkningen baseras på de fyra källkritiska principerna: Äkthet, Tid, Beroende och Tendens.
        </p>
      </footer>
    </div>
  );
};

export default SourceCriticismFilter;
