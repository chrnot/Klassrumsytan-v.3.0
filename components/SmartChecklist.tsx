
import React, { useState, useEffect } from 'react';
import { ChecklistItem } from '../types';

const KEYWORD_EMOJIS: Record<string, string> = { 'läs': '📖', 'skriv': '✍️', 'diskutera': '🗣️', 'räkna': '🔢', 'titta': '👁️', 'lyssna': '👂', 'rita': '🎨', 'samarbeta': '👥', 'städa': '🧹', 'lunch': '🍱', 'rast': '⚽', 'prov': '📝', 'jobba': '💼' };

const SmartChecklist: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('kp_checklist_items');
    return saved ? JSON.parse(saved) : [{ id: '1', text: 'Läs sid 24-28 i boken', completed: false, isSpotlight: false, timerSeconds: 600 }, { id: '2', text: 'Skriv svar på frågorna', completed: false, isSpotlight: false, timerSeconds: 900 }, { id: '3', text: 'Diskutera med grannen', completed: false, isSpotlight: false, timerSeconds: 300 }];
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTimerId, setActiveTimerId] = useState<string | null>(null);

  useEffect(() => { localStorage.setItem('kp_checklist_items', JSON.stringify(items)); }, [items]);
  useEffect(() => {
    let interval: any = null;
    if (activeTimerId) {
      interval = setInterval(() => {
        setItems(prev => prev.map(item => {
          if (item.id === activeTimerId && item.timerSeconds && item.timerSeconds > 0) return { ...item, timerSeconds: item.timerSeconds - 1 };
          if (item.id === activeTimerId && item.timerSeconds === 0) setActiveTimerId(null);
          return item;
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimerId]);

  const completedCount = items.filter(i => i.completed).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div className="flex flex-col h-full bg-white pt-6">
      <div className="flex justify-end gap-2 px-6 mb-4 shrink-0">
        <button onClick={() => setIsEditing(!isEditing)} className={`px-4 py-1.5 rounded-xl border font-bold text-[10px] uppercase tracking-widest transition-all ${isEditing ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white text-slate-500 border-slate-200'}`}>
          {isEditing ? '💾 Spara' : '✏️ Redigera'}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 space-y-3 mb-6">
        {items.map((item) => {
          const emoji = Object.entries(KEYWORD_EMOJIS).find(([k]) => item.text.toLowerCase().includes(k))?.[1];
          return (
            <div key={item.id} className={`group flex items-center gap-4 p-4 rounded-3xl transition-all border-2 ${item.isSpotlight ? 'bg-indigo-50 border-indigo-200 scale-[1.02]' : item.completed ? 'bg-slate-50 border-slate-50 opacity-50' : 'bg-white border-slate-50'}`}>
              <button onClick={() => !isEditing && setItems(prev => prev.map(i => i.id === item.id ? { ...i, completed: !i.completed, isSpotlight: false } : i))} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${item.completed ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200'}`}>{item.completed && '✓'}</button>
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input type="text" value={item.text} onChange={(e) => setItems(prev => prev.map(i => i.id === item.id ? { ...i, text: e.target.value } : i))} className="w-full bg-transparent border-b border-indigo-100 font-bold text-slate-700 py-1" />
                ) : (
                  <div className="flex items-center gap-2">
                    {emoji && <span className="text-xl">{emoji}</span>}
                    <span className={`font-black text-lg truncate ${item.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{item.text}</span>
                    {item.timerSeconds !== undefined && <span className="ml-auto font-mono text-sm px-2.5 py-1 rounded-xl bg-slate-50 text-slate-500 border border-slate-100">{Math.floor(item.timerSeconds / 60)}:{ (item.timerSeconds % 60).toString().padStart(2, '0') }</span>}
                  </div>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                {isEditing ? <button onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))} className="p-2 text-slate-300 hover:text-red-500">🗑️</button> : !item.completed && <button onClick={() => setItems(prev => prev.map(i => i.id === item.id ? { ...i, isSpotlight: !i.isSpotlight } : { ...i, isSpotlight: false }))} className={`p-2 rounded-xl ${item.isSpotlight ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>🔦</button>}
              </div>
            </div>
          );
        })}
        {isEditing && <button onClick={() => setItems([...items, { id: Math.random().toString(36).substr(2, 9), text: '', completed: false, isSpotlight: false }])} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 font-bold hover:text-indigo-500 transition-all">+ Lägg till</button>}
      </div>
      <footer className="shrink-0 p-6 border-t border-slate-50">
        <div className="flex justify-between items-center mb-2 px-1"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Progress</span><span className="text-[9px] font-black text-indigo-600">{Math.round(progress)}%</span></div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${progress}%` }} /></div>
      </footer>
    </div>
  );
};

export default SmartChecklist;
