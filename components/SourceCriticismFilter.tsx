
import React, { useState, useMemo } from 'react';

const SourceCriticismFilter: React.FC = () => {
  const [sourceName, setSourceName] = useState('');
  const [authenticity, setAuthenticity] = useState(1); 
  const [time, setTime] = useState(70); 
  const [isFirstHand, setIsFirstHand] = useState(true);
  const [tendency, setTendency] = useState(2); 

  const score = useMemo(() => {
    const authScore = authenticity === 2 ? 100 : authenticity === 1 ? 50 : 0;
    const timeScore = time;
    const dependenceScore = isFirstHand ? 100 : 0;
    const tendencyScore = tendency === 2 ? 100 : tendency === 1 ? 50 : 0;

    const total = (authScore * 0.3) + (timeScore * 0.2) + (dependenceScore * 0.2) + (tendencyScore * 0.3);
    return Math.round(total);
  }, [authenticity, time, isFirstHand, tendency]);

  const getStatus = () => {
    if (score >= 71) return { label: 'Hög trovärdighet', color: 'text-emerald-600', bg: 'bg-emerald-500', icon: '✅' };
    if (score >= 41) return { label: 'Var observant', color: 'text-amber-600', bg: 'bg-amber-500', icon: '⚠️' };
    return { label: 'Låg trovärdighet', color: 'text-rose-600', bg: 'bg-rose-500', icon: '🚨' };
  };

  const status = getStatus();

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-500 overflow-hidden">
      {/* Intern Header borttagen pga dubbla rubriker - texten flyttad till WidgetFrame */}

      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8 space-y-8">
        {/* Källans URL/Namn */}
        <section className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] block px-1">Namn på källan</label>
          <input
            type="text"
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
            placeholder="T.ex. www.wikipedia.org"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
          />
        </section>

        {/* 1. ÄKTHET */}
        <section className="space-y-3">
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] px-1">1. Äkthet - Vem ligger bakom?</h4>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: 0, label: 'Privat', icon: '👤' },
              { val: 1, label: 'Nyheter', icon: '📰' },
              { val: 2, label: 'Institution', icon: '🏛️' }
            ].map(item => (
              <button
                key={item.val}
                onClick={() => setAuthenticity(item.val)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                  authenticity === item.val 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-[1.02]' 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-100'
                }`}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-[9px] font-black uppercase text-center">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 2. TID */}
        <section className="space-y-3">
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] px-1">2. Tid - Hur aktuell är den?</h4>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <input
              type="range"
              min="0"
              max="100"
              value={time}
              onChange={(e) => setTime(parseInt(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-3 text-[8px] font-black uppercase tracking-widest text-slate-400">
              <span>Gammal</span>
              <span className="text-indigo-600">{time}% aktuell</span>
              <span>Helt ny</span>
            </div>
          </div>
        </section>

        {/* 3. BEROENDE */}
        <section className="space-y-3">
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] px-1">3. Beroende - Är det originalet?</h4>
          <button
            onClick={() => setIsFirstHand(!isFirstHand)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
              isFirstHand ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-left">
              <span className={`text-[10px] font-black uppercase tracking-widest block ${isFirstHand ? 'text-indigo-600' : 'text-slate-400'}`}>
                {isFirstHand ? 'Förstahandskälla' : 'Andrahandskälla'}
              </span>
              <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">
                {isFirstHand ? 'Originalet som berättar' : 'Berättar vad andra har sagt'}
              </span>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-all ${isFirstHand ? 'bg-indigo-600' : 'bg-slate-300'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isFirstHand ? 'left-7' : 'left-1'}`} />
            </div>
          </button>
        </section>

        {/* 4. TENDENS */}
        <section className="space-y-3">
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] px-1">4. Tendens - Varför finns den?</h4>
          <div className="flex flex-col gap-2">
            {[
              { val: 0, label: 'Påverka / Sälja', color: 'rose' },
              { val: 1, label: 'Underhålla', color: 'amber' },
              { val: 2, label: 'Informera', color: 'emerald' }
            ].map(item => (
              <button
                key={item.val}
                onClick={() => setTendency(item.val)}
                className={`w-full text-left px-5 py-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                  tendency === item.val 
                    ? `bg-indigo-600 border-indigo-600 text-white shadow-md scale-[1.01]` 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Trust Meter Footer */}
      <footer className="shrink-0 p-6 bg-slate-900 text-white">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Resultat</span>
            <h3 className={`text-xl font-black ${status.color}`}>{status.label} {status.icon}</h3>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black tabular-nums">{score}%</span>
          </div>
        </div>
        
        <div className="h-3 bg-white/10 rounded-full overflow-hidden relative">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${status.bg}`}
            style={{ width: `${score}%` }}
          />
        </div>
        
        <p className="mt-4 text-[9px] text-slate-400 font-medium italic text-center leading-relaxed">
          Källkritik handlar om att ställa frågor till källan.<br/>Kom ihåg att alltid använda flera källor!
        </p>
      </footer>
    </div>
  );
};

export default SourceCriticismFilter;
