
import React, { useState, useRef, useEffect } from 'react';
import { PlacementStudent } from '../types';

interface RandomizerProps {
  students: PlacementStudent[];
  setStudents: React.Dispatch<React.SetStateAction<PlacementStudent[]>>;
}

const Randomizer: React.FC<RandomizerProps> = ({ students, setStudents }) => {
  const [activeTab, setActiveTab] = useState<'jar' | 'list'>('jar');
  const [newName, setNewName] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  
  // States för glasspinnar-logik
  const [drawnPopsicle, setDrawnPopsicle] = useState<PlacementStudent | null>(null);

  const addStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newS: PlacementStudent = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName.trim(),
      gender: 'okant',
      condition: 'ingen',
      notWith: [],
      prefNotWith: [],
      prefWith: [],
      isPlaced: false
    };
    setStudents([...students, newS]);
    setNewName('');
  };

  const removeStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const handleBulkAdd = () => {
    if (!bulkInput.trim()) return;
    const names = bulkInput.split(/[,\n;]/).map(n => n.trim()).filter(n => n !== "");
    const newStudents: PlacementStudent[] = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
      gender: 'okant', condition: 'ingen', notWith: [], prefNotWith: [], prefWith: [], isPlaced: false
    }));
    setStudents([...students, ...newStudents]);
    setBulkInput('');
    setIsBulkOpen(false);
  };

  const drawStick = () => {
    if (students.length === 0 || isDrawing) return;
    
    setIsDrawing(true);
    setDrawnPopsicle(null);
    
    // Kort fördröjning för att simulera att man "letar" i burken
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * students.length);
      setDrawnPopsicle(students[randomIndex]);
      setIsDrawing(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-500 overflow-hidden">
      {/* TABS NAVIGATION */}
      <nav className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl mb-6 mx-auto w-fit border border-slate-200/50 shrink-0">
        <button
          onClick={() => setActiveTab('jar')}
          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'jar' 
              ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          🍦 Burken
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'list' 
              ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          👥 Klasslista
        </button>
      </nav>

      <div className="flex-1 overflow-hidden relative">
        {/* TAB 1: THE JAR VIEW */}
        {activeTab === 'jar' && (
          <div className="h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
            {/* Drawn Popsicle Animation Area */}
            <div className="absolute top-0 w-full flex justify-center h-72 overflow-visible z-30">
              {drawnPopsicle && (
                <div className={`relative animate-in slide-in-from-bottom-[400px] duration-700 ease-out flex flex-col items-center`}>
                  {/* Pinnen */}
                  <div className="w-16 h-80 bg-[#f3d19c] rounded-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-x-4 border-b-8 border-[#e4bd7d] flex flex-col items-center py-12 px-2 overflow-hidden ring-4 ring-white/50 relative">
                     {/* Trä-vener/mönster dekoration */}
                     <div className="absolute inset-0 pointer-events-none opacity-10 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,#5d4037_11px)]"></div>
                     
                     {/* Texten på pinnen - Vertikal look */}
                     <span 
                       className="text-xl md:text-2xl font-black text-[#8b5e3c] text-center leading-[1.1] uppercase relative z-10"
                       style={{ 
                         writingMode: 'vertical-rl', 
                         textOrientation: 'upright',
                         letterSpacing: '-0.05em'
                       }}
                     >
                        {drawnPopsicle.name}
                     </span>
                  </div>
                  {/* Sparkles/Effekt */}
                  <div className="absolute -top-12 text-5xl animate-bounce">✨</div>
                </div>
              )}
            </div>

            {/* Burken Area */}
            <div className="relative mt-auto mb-10 z-10 group">
              {/* Burkelementet */}
              <div className="w-64 h-72 bg-white/40 backdrop-blur-md rounded-b-[4.5rem] rounded-t-[1rem] border-[8px] border-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] relative overflow-hidden ring-1 ring-slate-200">
                
                {/* Pinnar som syns inuti burken (dynamiskt antal) */}
                <div className="absolute inset-0 p-6 flex flex-wrap gap-1 justify-center content-end opacity-40">
                  {students.slice(0, 20).map((_, i) => (
                    <div 
                      key={i} 
                      className="w-3.5 h-44 bg-[#e4bd7d] rounded-full transform rotate-[var(--rot)] shadow-inner" 
                      style={{ '--rot': `${(i % 7) * 8 - 25}deg` } as any}
                    />
                  ))}
                </div>

                {/* Burkens framsida/Etikett */}
                <div className="absolute inset-x-0 bottom-16 flex flex-col items-center pointer-events-none">
                  <div className="bg-indigo-600 text-white px-8 py-2 rounded-full text-xs font-black uppercase tracking-[0.25em] shadow-xl">
                    Glasspinnar
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase mt-3 tracking-widest">{students.length} pinnar i burken</span>
                </div>
              </div>

              {/* Burk-kant (top) */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-72 h-10 bg-white border-2 border-slate-100 rounded-full shadow-md z-20"></div>
            </div>

            {/* Kontroller längst ner */}
            <div className="w-full max-w-sm px-6 pb-4">
              <button
                onClick={drawStick}
                disabled={isDrawing || students.length === 0}
                className={`w-full py-6 rounded-[2.5rem] font-black text-xl uppercase tracking-widest transition-all shadow-2xl group/btn overflow-hidden relative ${
                  isDrawing || students.length === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 active:scale-95'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-4">
                  {isDrawing ? (
                    <>
                      <span className="animate-spin text-3xl">🪄</span>
                      Blandar pinnar...
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">🍦</span>
                      Dra en pinne
                    </>
                  )}
                </span>
                {/* Hover-glans */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
              </button>
              
              {students.length === 0 && (
                <p className="mt-4 text-[10px] font-black text-rose-500 uppercase tracking-widest text-center animate-pulse">Burken är tom! Gå till Klasslistan för att fylla på.</p>
              )}
              
              {drawnPopsicle && !isDrawing && (
                 <div className="mt-6 flex justify-center gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                    <button 
                      onClick={() => setDrawnPopsicle(null)}
                      className="bg-slate-50 text-slate-400 px-6 py-2 rounded-full text-[10px] font-black uppercase hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all tracking-widest"
                    >
                      Lägg tillbaka pinnen ↺
                    </button>
                 </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: THE STUDENT LIST VIEW */}
        {activeTab === 'list' && (
          <div className="h-full flex flex-col gap-6 p-2 animate-in slide-in-from-right-4 duration-500 overflow-hidden">
            <header className="flex justify-between items-center shrink-0 px-2">
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Hantera klassen</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Namnen på dina glasspinnar</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsBulkOpen(!isBulkOpen)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isBulkOpen 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100'
                  }`}
                >
                  {isBulkOpen ? 'Visa Listan' : 'Massimport 📑'}
                </button>
                <button onClick={() => setStudents([])} className="bg-red-50 text-red-500 border border-red-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-red-100 transition-colors">Töm burken</button>
              </div>
            </header>

            {isBulkOpen ? (
              <div className="flex-1 flex flex-col gap-4 animate-in fade-in zoom-in-95">
                <div className="bg-slate-50 p-6 rounded-[2.5rem] border-2 border-dashed border-indigo-100 flex-1 flex flex-col gap-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Klistra in namn (separera med kommatecken eller ny rad)</p>
                  <textarea
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder="Anna, Bengt, Cesar..."
                    className="flex-1 p-5 text-sm rounded-[2rem] border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-white shadow-inner"
                  />
                  <button
                    onClick={handleBulkAdd}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-95 transition-all"
                  >
                    Importera alla namn
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                <form onSubmit={addStudent} className="flex gap-2 px-2 shrink-0">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Lägg till ett nytt namn..."
                    className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white shadow-sm"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
                  >
                    Lägg till
                  </button>
                </form>

                <div className="bg-slate-50/50 border border-slate-100 rounded-[3rem] overflow-hidden flex-1 flex flex-col">
                  <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center shrink-0">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">{students.length} Elever i listan</span>
                  </div>
                  <ul className="divide-y divide-slate-100 overflow-y-auto custom-scrollbar flex-1 px-2">
                    {students.map((student) => (
                      <li key={student.id} className="flex items-center justify-between px-6 py-4 hover:bg-white rounded-2xl transition-all group my-0.5">
                        <div className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-300"></span>
                          <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">{student.name}</span>
                        </div>
                        <button onClick={() => removeStudent(student.id)} className="text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg">Ta bort</button>
                      </li>
                    ))}
                    {students.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-30">
                         <span className="text-6xl mb-4">😶</span>
                         <h3 className="text-sm font-black uppercase tracking-[0.15em]">Inga namn än</h3>
                         <p className="text-xs font-medium mt-2">Lägg till elever för att fylla burken!</p>
                      </div>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global Styles for Shimmer */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Randomizer;
