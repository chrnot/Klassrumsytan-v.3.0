
import React, { useState, useEffect, useCallback, useMemo } from 'react';

type BubbleCategory = 'build' | 'challenge' | 'clarify' | 'connect';
type SubjectMode = 'general' | 'so' | 'no' | 'language' | 'custom';

interface Bubble { id: string; category: BubbleCategory; text: string; }

const CATEGORIES: Record<BubbleCategory, { label: string; color: string; light: string; text: string; icon: string }> = {
  build: { label: 'Bygga vidare', color: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700', icon: '🌱' },
  challenge: { label: 'Utmana/Vända', color: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-700', icon: '🔄' },
  clarify: { label: 'Förtydliga', color: 'bg-amber-400', light: 'bg-amber-50', text: 'text-amber-700', icon: '🔍' },
  connect: { label: 'Undra/Koppla', color: 'bg-indigo-500', light: 'bg-indigo-50', text: 'text-indigo-700', icon: '🔗' }
};

const BUBBLE_DATA: Record<Exclude<SubjectMode, 'custom'>, Bubble[]> = {
  general: [
    { id: 'g1', category: 'build', text: 'Jag vill fylla på det du sa med att...' },
    { id: 'g2', category: 'build', text: 'En annan sak som hänger ihop med det är...' },
    { id: 'g3', category: 'challenge', text: 'Å andra sidan skulle det kunna vara...' },
    { id: 'g4', category: 'challenge', text: 'Jag håller med om X, men inte om Y för att...' },
    { id: 'g5', category: 'clarify', text: 'Det viktigaste i det jag säger är...' },
    { id: 'g6', category: 'clarify', text: 'Menar du att...? Kan du förklara mer?' },
    { id: 'g7', category: 'connect', text: 'Det här påminner mig om när vi...' },
    { id: 'g8', category: 'connect', text: 'Vad skulle hända om vi istället...?' }
  ],
  so: [
    { id: 's1', category: 'build', text: 'En konsekvens av detta blev att...' },
    { id: 's2', category: 'challenge', text: 'Om vi kollar på källan så ser vi att...' },
    { id: 's3', category: 'clarify', text: 'Huvudorsaken till händelsen var...' },
    { id: 's4', category: 'connect', text: 'Det här liknar en annan tidsepok då...' },
    { id: 's5', category: 'challenge', text: 'Vems perspektiv är det vi hör här?' }
  ],
  no: [
    { id: 'n1', category: 'build', text: 'Min hypotes inför försöket är...' },
    { id: 'n2', category: 'clarify', text: 'Resultatet tyder på att...' },
    { id: 'n3', category: 'challenge', text: 'Skulle felkällan kunna vara att...?' },
    { id: 'n4', category: 'connect', text: 'Detta fenomen kan vi se i vardagen när...' },
    { id: 'n5', category: 'build', text: 'Vi kan dra slutsatsen att...' }
  ],
  language: [
    { id: 'l1', category: 'clarify', text: 'Jag tolkar budskapet i texten som...' },
    { id: 'l2', category: 'build', text: 'Textens stämning skapas genom att...' },
    { id: 'l3', category: 'connect', text: 'Huvudpersonen påminner mig om...' },
    { id: 'l4', category: 'challenge', text: 'Man kan också se motivet som...' },
    { id: 'l5', category: 'clarify', text: 'Författaren använder liknelsen för att...' }
  ]
};

const ConversationBubbles: React.FC = () => {
  const [mode, setMode] = useState<SubjectMode>(() => (localStorage.getItem('kp_bubbles_mode') as SubjectMode) || 'general');
  const [customBubbles, setCustomBubbles] = useState<Bubble[]>(() => {
    const saved = localStorage.getItem('kp_custom_bubbles');
    return saved ? JSON.parse(saved) : [{ id: 'c1', category: 'build', text: 'Skriv din egen meningsbyggare här...' }];
  });
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [randomizing, setRandomizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { localStorage.setItem('kp_bubbles_mode', mode); }, [mode]);
  useEffect(() => { localStorage.setItem('kp_custom_bubbles', JSON.stringify(customBubbles)); }, [customBubbles]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && timerSeconds > 0) interval = setInterval(() => setTimerSeconds(s => s - 1), 1000);
    else if (timerSeconds === 0) setIsTimerActive(false);
    return () => clearInterval(interval);
  }, [isTimerActive, timerSeconds]);

  const formatTime = (s: number) => { const min = Math.floor(s / 60); const sec = s % 60; return `${min}:${sec.toString().padStart(2, '0')}`; };
  const currentBubbles = useMemo(() => mode === 'custom' ? customBubbles : BUBBLE_DATA[mode], [mode, customBubbles]);
  const slumpa = () => {
    if (currentBubbles.length === 0) return;
    setRandomizing(true); setHighlightedId(null);
    let count = 0;
    const interval = setInterval(() => {
      const rand = currentBubbles[Math.floor(Math.random() * currentBubbles.length)];
      setHighlightedId(rand.id); count++;
      if (count > 10) { clearInterval(interval); setRandomizing(false); }
    }, 100);
  };

  const addCustomBubble = () => setCustomBubbles([...customBubbles, { id: Math.random().toString(36).substr(2, 9), category: 'build', text: 'Ny meningsbyggare...' }]);
  const updateCustomBubble = (id: string, updates: Partial<Bubble>) => setCustomBubbles(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  const removeCustomBubble = (id: string) => setCustomBubbles(prev => prev.filter(b => b.id !== id));

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-500 overflow-hidden pt-6">
      <header className="flex flex-wrap items-center justify-end gap-2 px-6 shrink-0 no-drag pb-4">
          <select value={mode} onChange={(e) => { const newMode = e.target.value as SubjectMode; setMode(newMode); setHighlightedId(null); if (newMode !== 'custom') setIsEditing(false); }} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer">
            <option value="general">🌍 Generellt</option><option value="so">🏛️ SO-läge</option><option value="no">🧪 NO-läge</option><option value="language">📖 Språk</option><option value="custom">⚙️ Eget</option>
          </select>
          {mode === 'custom' && <button onClick={() => setIsEditing(!isEditing)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm ${isEditing ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-300'}`}>{isEditing ? 'Spara' : 'Redigera'}</button>}
          <button onClick={slumpa} disabled={randomizing || currentBubbles.length === 0} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-700 shadow-lg active:scale-95 transition-all disabled:opacity-40">🎲 Slumpa</button>
      </header>

      <div className="flex-1 relative flex flex-col items-center justify-center p-4">
        {!isEditing && (
          <div className="z-20 mb-8">
            <div className={`w-32 h-32 md:w-44 md:h-44 rounded-full border-8 border-slate-50 shadow-2xl flex flex-col items-center justify-center transition-all duration-700 ${isTimerActive ? 'bg-indigo-50 ring-8 ring-indigo-100' : 'bg-white'}`}>
              <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">Samtalstid</span>
              <span className={`text-2xl md:text-4xl font-black tabular-nums transition-colors ${isTimerActive ? 'text-indigo-600' : 'text-slate-800'}`}>{formatTime(timerSeconds)}</span>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setIsTimerActive(!isTimerActive)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm border border-slate-100 text-xs hover:scale-110">{isTimerActive ? '⏸' : '▶'}</button>
                <button onClick={() => setTimerSeconds(prev => prev + 60)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm border border-slate-100 text-[10px] font-bold hover:scale-110">+1m</button>
              </div>
            </div>
          </div>
        )}

        <div className={`w-full grid grid-cols-1 sm:grid-cols-2 gap-4 ${isEditing ? 'mt-0' : 'mt-4'} overflow-y-auto custom-scrollbar px-6 max-h-[60%] md:max-h-none`}>
          {currentBubbles.map((bubble) => {
            const cat = CATEGORIES[bubble.category]; const isHighlighted = highlightedId === bubble.id;
            if (isEditing && mode === 'custom') return (
              <div key={bubble.id} className={`${cat.light} p-5 rounded-[2.5rem] border-2 border-slate-100 flex flex-col gap-3 relative animate-in zoom-in-95`}>
                <div className="flex items-center justify-between gap-2">
                  <select value={bubble.category} onChange={(e) => updateCustomBubble(bubble.id, { category: e.target.value as BubbleCategory })} className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[9px] font-black uppercase outline-none">{Object.entries(CATEGORIES).map(([key, val]) => (<option key={key} value={key}>{val.icon} {val.label}</option>))}</select>
                  <button onClick={() => removeCustomBubble(bubble.id)} className="text-slate-300 hover:text-red-500">✕</button>
                </div>
                <textarea value={bubble.text} onChange={(e) => updateCustomBubble(bubble.id, { text: e.target.value })} className="w-full bg-white/50 border border-slate-200 rounded-xl p-2 text-sm font-bold resize-none outline-none focus:ring-2 focus:ring-indigo-400" rows={2} />
              </div>
            );
            return (
              <button key={bubble.id} onClick={() => setHighlightedId(isHighlighted ? null : bubble.id)} className={`text-left p-5 rounded-[2.5rem] border-2 transition-all duration-500 group relative overflow-hidden ${isHighlighted ? `${cat.color} border-white shadow-xl scale-105 z-10` : `${cat.light} border-transparent opacity-80 hover:opacity-100 hover:scale-[1.02]`}`}>
                <div className="flex items-start gap-4 relative z-10"><span className={`text-2xl transition-transform duration-500 ${isHighlighted ? 'scale-125' : 'group-hover:scale-110'}`}>{cat.icon}</span><div className="flex-1"><p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${isHighlighted ? 'text-white/80' : 'text-slate-400'}`}>{cat.label}</p><h3 className={`text-sm md:text-base font-bold leading-tight ${isHighlighted ? 'text-white' : 'text-slate-700'}`}>"{bubble.text}"</h3></div>{isHighlighted && <div className="absolute -top-2 -right-2 text-white/40 animate-pulse">✨</div>}</div>
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 transition-all duration-1000 ${isHighlighted ? 'bg-white opacity-10' : 'bg-black opacity-[0.02]'}`} />
              </button>
            );
          })}
          {isEditing && mode === 'custom' && <button onClick={addCustomBubble} className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-5 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 transition-all group"><span className="text-3xl mb-2 group-hover:scale-110 transition-transform">➕</span><span className="text-[10px] font-black uppercase tracking-widest">Lägg till</span></button>}
        </div>
      </div>
      <footer className="shrink-0 p-4 border-t border-slate-50 bg-slate-50/50 flex justify-between items-center"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Mål: Lyssna på varandra</span></div><p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{isEditing ? 'Spara när du är klar.' : 'Tryck på en bubbla för att highlighta.'}</p></footer>
    </div>
  );
};

export default ConversationBubbles;
