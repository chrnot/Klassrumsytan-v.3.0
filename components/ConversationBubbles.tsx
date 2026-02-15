
import React, { useState, useMemo } from 'react';

const ConversationBubbles: React.FC = () => {
  const [mode, setMode] = useState('general');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const bubbles = [
    { id: '1', text: 'Jag vill fylla på det du sa med att...', icon: '🌱' },
    { id: '2', text: 'Å andra sidan skulle det kunna vara...', icon: '🔄' },
    { id: '3', text: 'Menar du att...? Kan du förklara mer?', icon: '🔍' },
    { id: '4', text: 'Det här påminner mig om när vi...', icon: '🔗' }
  ];

  return (
    <div className="flex flex-col h-full bg-white pt-6">
      <div className="flex justify-end gap-2 px-6 mb-6 shrink-0">
          <button onClick={() => setHighlightedId(null)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg">🎲 Slumpa</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 overflow-y-auto">
        {bubbles.map((b) => (
          <button key={b.id} onClick={() => setHighlightedId(b.id)} className={`text-left p-6 rounded-[2.5rem] border-2 transition-all ${highlightedId === b.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105' : 'bg-slate-50 border-transparent hover:border-indigo-100'}`}>
            <div className="flex gap-4"><span className="text-2xl">{b.icon}</span><h3 className={`text-base font-bold leading-tight ${highlightedId === b.id ? 'text-white' : 'text-slate-700'}`}>"{b.text}"</h3></div>
          </button>
        ))}
      </div>
      <footer className="mt-auto p-4 border-t border-slate-50 bg-slate-50/50 flex justify-center"><p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Mål: Lyssna aktivt på varandra</p></footer>
    </div>
  );
};

export default ConversationBubbles;
