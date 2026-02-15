
import React, { useState, useMemo } from 'react';

const PollingTool: React.FC<{ initialType?: 'standard' | 'mindset' }> = ({ initialType = 'standard' }) => {
  const [question, setQuestion] = useState(initialType === 'mindset' ? 'Hur känns det inför uppgiften?' : 'Hur går det?');
  const [votes, setVotes] = useState<Record<string, number>>({ 1: 0, 2: 0, 3: 0 });

  const options = initialType === 'mindset' ? 
    [{ id: '1', label: 'Panik', icon: '🤯', color: 'bg-rose-500' }, { id: '2', label: 'Lärande', icon: '🌱', color: 'bg-emerald-500' }, { id: '3', label: 'Komfort', icon: '🛋️', color: 'bg-indigo-500' }] :
    [{ id: '1', label: 'Bra', icon: '😃', color: 'bg-emerald-500' }, { id: '2', label: 'Okej', icon: '😐', color: 'bg-amber-400' }, { id: '3', label: 'Svårt', icon: '😟', color: 'bg-rose-500' }];

  return (
    <div className="flex flex-col h-full bg-white pt-10 px-10 items-center justify-center">
      <h3 className="text-4xl font-black text-slate-800 text-center mb-12 tracking-tight leading-tight">{question}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {options.map(opt => (
          <button key={opt.id} onClick={() => setVotes({ ...votes, [opt.id]: votes[opt.id] + 1 })} className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-[3rem] hover:border-indigo-400 shadow-sm transition-all group">
            <span className="text-7xl mb-4 group-hover:scale-110 transition-transform">{opt.icon}</span>
            <span className="text-xl font-black text-slate-800">{opt.label}</span>
            <div className={`mt-6 px-6 py-2 rounded-full text-xs font-black text-white ${opt.color}`}>{votes[opt.id]} RÖSTER</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PollingTool;
