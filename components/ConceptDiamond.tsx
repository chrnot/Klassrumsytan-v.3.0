
import React, { useState, useEffect } from 'react';

type QuadrantId = 'definition' | 'characteristics' | 'examples' | 'nonExamples';

interface QuadrantData {
  id: QuadrantId;
  label: string;
  subtitle: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
}

const QUADRANTS: QuadrantData[] = [
  { id: 'definition', label: 'Definition', subtitle: 'Vad betyder det?', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-800', accentColor: 'bg-blue-600' },
  { id: 'characteristics', label: 'Kännetecken', subtitle: 'Vad utmärker det?', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', textColor: 'text-emerald-800', accentColor: 'bg-emerald-600' },
  { id: 'examples', label: 'Exempel', subtitle: 'Konkreta exempel', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', textColor: 'text-amber-800', accentColor: 'bg-amber-600' },
  { id: 'nonExamples', label: 'Icke-exempel', subtitle: 'Vad är det inte?', bgColor: 'bg-rose-50', borderColor: 'border-rose-200', textColor: 'text-rose-800', accentColor: 'bg-rose-600' }
];

const ConceptDiamond: React.FC = () => {
  const [concept, setConcept] = useState(() => localStorage.getItem('kp_cd_concept') || '');
  const [texts, setTexts] = useState<Record<QuadrantId, string>>(() => {
    const saved = localStorage.getItem('kp_cd_texts');
    return saved ? JSON.parse(saved) : { definition: '', characteristics: '', examples: '', nonExamples: '' };
  });
  const [hiddenStates, setHiddenStates] = useState<Record<QuadrantId, boolean>>({
    definition: false, characteristics: false, examples: false, nonExamples: false
  });
  const [focusedId, setFocusedId] = useState<QuadrantId | null>(null);

  useEffect(() => {
    localStorage.setItem('kp_cd_concept', concept);
    localStorage.setItem('kp_cd_texts', JSON.stringify(texts));
  }, [concept, texts]);

  const updateText = (id: QuadrantId, val: string) => {
    setTexts(prev => ({ ...prev, [id]: val }));
  };

  const toggleHidden = (id: QuadrantId, e: React.MouseEvent) => {
    e.stopPropagation();
    setHiddenStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const clearAll = () => {
    if (window.confirm("Vill du rensa hela diamanten?")) {
      setConcept('');
      setTexts({ definition: '', characteristics: '', examples: '', nonExamples: '' });
      setHiddenStates({ definition: false, characteristics: false, examples: false, nonExamples: false });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 select-none overflow-hidden relative font-sans">
      
      {/* GRID CONTAINER */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3 p-3 relative h-full">
        
        {QUADRANTS.map((q) => {
          const isFocused = focusedId === q.id;
          const isHidden = hiddenStates[q.id];

          return (
            <div 
              key={q.id}
              className={`relative flex flex-col transition-all duration-500 rounded-[2.5rem] border-2 shadow-sm overflow-hidden 
                ${isFocused ? 'fixed inset-4 z-[100] ring-[20px] ring-black/5 animate-in zoom-in-95' : 'z-10'} 
                ${q.bgColor} ${q.borderColor}`}
            >
              {/* HEADER */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-black/5 bg-white/40 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-8 rounded-full ${q.accentColor}`} />
                  <div>
                    <h4 className={`text-xs md:text-sm font-black uppercase tracking-widest ${q.textColor}`}>{q.label}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{q.subtitle}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 no-drag">
                  <button 
                    onClick={(e) => toggleHidden(q.id, e)}
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all shadow-sm ${isHidden ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
                    title={isHidden ? "Visa" : "Dölj"}
                  >
                    {isHidden ? '👁️' : '🙈'}
                  </button>
                  <button 
                    onClick={() => setFocusedId(isFocused ? null : q.id)}
                    className="w-9 h-9 rounded-2xl bg-white text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-all shadow-sm"
                  >
                    {isFocused ? '➘' : '⤢'}
                  </button>
                </div>
              </div>

              {/* TEXT AREA with SAFE ZONES for the center diamond */}
              <div className={`flex-1 p-6 relative flex flex-col min-h-0 ${isFocused ? '' : q.id === 'definition' ? 'pr-16 pb-16' : q.id === 'characteristics' ? 'pl-16 pb-16' : q.id === 'examples' ? 'pr-16 pt-16' : 'pl-16 pt-16'}`}>
                <textarea
                  value={texts[q.id]}
                  onChange={(e) => updateText(q.id, e.target.value)}
                  placeholder="Klicka för att skriva..."
                  className={`w-full h-full bg-transparent resize-none font-bold outline-none text-slate-700 transition-all duration-500 custom-scrollbar
                    ${isFocused ? 'text-2xl md:text-4xl p-8 leading-relaxed' : 'text-sm md:text-lg'}
                    ${isHidden ? 'blur-3xl select-none opacity-0 pointer-events-none' : 'opacity-100'}
                  `}
                />
                
                {isHidden && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/10 backdrop-blur-2xl z-20">
                    <button 
                      onClick={(e) => toggleHidden(q.id, e)}
                      className="group flex flex-col items-center gap-4 transition-transform active:scale-95"
                    >
                      <div className="w-20 h-20 rounded-[2.5rem] bg-white shadow-2xl flex items-center justify-center text-4xl group-hover:rotate-12 transition-transform">💡</div>
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] bg-white/80 px-4 py-2 rounded-full shadow-sm">Klicka för att visa</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* CENTER DIAMOND */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[50]">
          <div 
            className="w-48 h-48 md:w-64 md:h-64 bg-white shadow-[0_30px_90px_-20px_rgba(0,0,0,0.4)] border-[10px] border-slate-50 pointer-events-auto transition-all hover:scale-105 duration-500 flex items-center justify-center group"
            style={{ 
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
            }}
          >
            <div className="text-center p-6 flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-white to-slate-50">
              <span className="text-[9px] font-black uppercase text-indigo-500 tracking-[0.4em] mb-3 opacity-60 group-hover:opacity-100 transition-opacity">Begrepp</span>
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="..."
                className="w-full bg-transparent text-center font-black text-slate-900 uppercase tracking-tighter text-xl md:text-3xl outline-none placeholder:text-slate-200 border-b-2 border-transparent focus:border-indigo-100 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="shrink-0 p-5 bg-white border-t border-slate-200 flex justify-between items-center no-drag">
        <div className="flex items-center gap-6">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-400 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-rose-400 shadow-sm" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-800">Frayer-modellen</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">För djupare begreppsförståelse</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={clearAll}
            className="text-[10px] font-black text-slate-300 hover:text-rose-500 transition-colors uppercase tracking-[0.2em]"
          >
            Rensa allt
          </button>
          <div className="h-4 w-[1px] bg-slate-200" />
          <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full">
            Diamant v2.1
          </div>
        </div>
      </footer>

      {focusedId && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[90] animate-in fade-in duration-500"
          onClick={() => setFocusedId(null)}
        />
      )}
    </div>
  );
};

export default ConceptDiamond;
