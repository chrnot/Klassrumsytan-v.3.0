
import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';

interface CircleData {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  radius: number;
}

interface TagData {
  id: string;
  text: string;
  x: number;
  y: number;
}

const COLORS = [
  'rgba(59, 130, 246, 0.45)', // Blå
  'rgba(239, 68, 68, 0.45)',  // Röd
  'rgba(245, 158, 11, 0.45)'  // Gul
];

const DEFAULT_CIRCLES: CircleData[] = [
  { id: 'a', label: 'Begrepp A', x: 80, y: 100, color: COLORS[0], radius: 190 },
  { id: 'b', label: 'Begrepp B', x: 340, y: 100, color: COLORS[1], radius: 190 },
  { id: 'c', label: 'Begrepp C', x: 210, y: 310, color: COLORS[2], radius: 190 }
];

const DraggableCircle: React.FC<{
  circle: CircleData;
  isLocked: boolean;
  onStop: (x: number, y: number) => void;
  onLabelChange: (label: string) => void;
  onRadiusChange: (radius: number) => void;
}> = ({ circle, isLocked, onStop, onLabelChange, onRadiusChange }) => {
  const nodeRef = useRef(null);
  return (
    <Draggable
      nodeRef={nodeRef}
      disabled={isLocked}
      position={{ x: circle.x, y: circle.y }}
      onStop={(_, data) => onStop(data.x, data.y)}
      bounds="parent"
    >
      <div 
        ref={nodeRef}
        className={`absolute flex flex-col items-center justify-start pt-14 rounded-full transition-shadow ${!isLocked ? 'cursor-move ring-2 ring-indigo-400 ring-dashed shadow-2xl z-20' : 'z-10'}`}
        style={{ 
          width: circle.radius * 2, 
          height: circle.radius * 2, 
          backgroundColor: circle.color,
          mixBlendMode: 'multiply',
        }}
      >
        {isLocked ? (
          <span className="text-xl md:text-2xl font-black text-slate-800/80 uppercase tracking-widest pointer-events-none text-center px-8 break-words max-w-full">
            {circle.label}
          </span>
        ) : (
          <div className="flex flex-col items-center gap-4 px-4 w-full">
            <input 
              type="text" 
              value={circle.label}
              onChange={(e) => onLabelChange(e.target.value)}
              className="bg-white/90 border-2 border-indigo-400 rounded-xl px-4 py-2 text-sm font-black uppercase outline-none text-center shadow-lg w-full"
              onMouseDown={(e) => e.stopPropagation()}
            />
            <div className="bg-white/90 p-2 rounded-xl border border-indigo-100 flex flex-col items-center gap-1 shadow-md w-fit" onMouseDown={(e) => e.stopPropagation()}>
               <span className="text-[8px] font-black uppercase text-indigo-400">Storlek</span>
               <input 
                 type="range" min="100" max="300" value={circle.radius} 
                 onChange={(e) => onRadiusChange(parseInt(e.target.value))}
                 className="w-24 accent-indigo-500 h-1.5"
               />
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
};

const DraggableTag: React.FC<{
  tag: TagData;
  onStop: (x: number, y: number) => void;
  onRemove: () => void;
}> = ({ tag, onStop, onRemove }) => {
  const nodeRef = useRef(null);
  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: tag.x, y: tag.y }}
      onStop={(_, data) => onStop(data.x, data.y)}
      bounds="parent"
    >
      <div 
        ref={nodeRef}
        className="absolute bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-xl cursor-grab active:cursor-grabbing group hover:border-indigo-400 hover:scale-105 transition-all z-[100] flex items-center gap-3"
        style={{ maxWidth: '280px' }}
      >
        <span className="font-black text-slate-800 text-sm leading-tight">{tag.text}</span>
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
        >
          ✕
        </button>
      </div>
    </Draggable>
  );
};

const VennDiagram: React.FC = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [circleCount, setCircleCount] = useState<2 | 3>(() => {
    const saved = localStorage.getItem('kp_venn_count');
    return saved ? (parseInt(saved) as 2 | 3) : 2;
  });

  const [circles, setCircles] = useState<CircleData[]>(() => {
    const saved = localStorage.getItem('kp_venn_circles');
    return saved ? JSON.parse(saved) : DEFAULT_CIRCLES;
  });

  const [tags, setTags] = useState<TagData[]>(() => {
    const saved = localStorage.getItem('kp_venn_tags');
    return saved ? JSON.parse(saved) : [];
  });

  const [newTagText, setNewTagText] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => { localStorage.setItem('kp_venn_circles', JSON.stringify(circles)); }, [circles]);
  useEffect(() => { localStorage.setItem('kp_venn_tags', JSON.stringify(tags)); }, [tags]);
  useEffect(() => { localStorage.setItem('kp_venn_count', circleCount.toString()); }, [circleCount]);

  const addTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTagText.trim()) return;
    const newTag: TagData = {
      id: Math.random().toString(36).substr(2, 9),
      text: newTagText.trim(),
      x: 30,
      y: 30
    };
    setTags([...tags, newTag]);
    setNewTagText('');
  };

  const resetAll = () => {
    if (window.confirm("Vill du nollställa hela analysen (rensar alla begrepp och återställer cirklar)?")) {
      setTags([]);
      setCircles(DEFAULT_CIRCLES.map(c => ({...c}))); // Deep copy
      setIsLocked(true);
      setCircleCount(2);
    }
  };

  const resetPositions = () => {
    if (window.confirm("Vill du återställa cirklarnas positioner och storlekar?")) {
      setCircles(DEFAULT_CIRCLES.map((c, i) => ({
        ...circles[i],
        x: c.x,
        y: c.y,
        radius: c.radius
      })));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white select-none overflow-hidden">
      {/* KONTROLLPANEL */}
      <div className="flex flex-wrap items-center gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100 shrink-0 no-drag z-50">
        <form onSubmit={addTag} className="flex gap-2 flex-1 min-w-[200px] max-w-sm">
          <input 
            type="text" 
            value={newTagText}
            onChange={(e) => setNewTagText(e.target.value)}
            placeholder="Lägg till begrepp..."
            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
          <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-md active:scale-95 transition-all">Lägg till</button>
        </form>

        <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button onClick={() => setCircleCount(2)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${circleCount === 2 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>2 Cirklar</button>
          <button onClick={() => setCircleCount(3)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${circleCount === 3 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>3 Cirklar</button>
        </div>

        <button 
          onClick={() => setIsLocked(!isLocked)}
          className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md ${isLocked ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'}`}
        >
          {isLocked ? '🔒 Låst läge' : '🔓 Redigera cirklar'}
        </button>

        <div className="ml-auto flex gap-3">
          {!isLocked && (
            <button onClick={resetPositions} className="text-indigo-400 hover:text-indigo-600 text-[9px] font-black uppercase tracking-widest">Återställ cirklar</button>
          )}
          <button onClick={resetAll} className="text-slate-300 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors">Nollställ Allt</button>
        </div>
      </div>

      {/* RITYTA */}
      <div 
        ref={canvasRef} 
        className="flex-1 relative bg-white overflow-hidden p-4"
        style={{ isolation: 'isolate' }}
      >
        {/* CIRKLAR - renderas med mix-blend-mode: multiply */}
        {circles.slice(0, circleCount).map((c) => (
          <DraggableCircle
            key={c.id}
            circle={c}
            isLocked={isLocked}
            onStop={(x, y) => setCircles(prev => prev.map(p => p.id === c.id ? { ...p, x, y } : p))}
            onLabelChange={(label) => setCircles(prev => prev.map(p => p.id === c.id ? { ...p, label } : p))}
            onRadiusChange={(radius) => setCircles(prev => prev.map(p => p.id === c.id ? { ...p, radius } : p))}
          />
        ))}

        {/* TAGGAR (ORDBANK OCH PLACERADE) - renderas ovanpå */}
        {tags.map((tag) => (
          <DraggableTag
            key={tag.id}
            tag={tag}
            onStop={(x, y) => setTags(prev => prev.map(t => t.id === tag.id ? { ...t, x, y } : t))}
            onRemove={() => setTags(prev => prev.filter(t => t.id !== tag.id))}
          />
        ))}

        {/* GUIDANCE OVERLAY I SETUP MODE */}
        {!isLocked && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl z-[200] animate-bounce border-2 border-indigo-400 pointer-events-none">
            Anpassa cirklarna efter behov
          </div>
        )}
      </div>

      <footer className="shrink-0 px-6 py-3 border-t border-slate-50 bg-slate-50/50 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
        <div className="flex items-center gap-4">
          <span>Dra begrepp till rätt zon</span>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-400 opacity-50"></div><span>A</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400 opacity-50"></div><span>B</span></div>
          {circleCount === 3 && <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400 opacity-50"></div><span>C</span></div>}
        </div>
        <div>Venn-Analys v1.2</div>
      </footer>
    </div>
  );
};

export default VennDiagram;
