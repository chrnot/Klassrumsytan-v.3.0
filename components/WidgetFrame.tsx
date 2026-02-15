
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface WidgetFrameProps {
  title: string;
  subtitle?: string;
  icon: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
  x: number;
  y: number;
  zIndex: number;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  onFocus: () => void;
  initialWidth?: number;
  initialHeight?: number;
}

const WidgetFrame: React.FC<WidgetFrameProps> = ({ 
  title, subtitle, icon, description, children, onClose, x, y, zIndex, onMove, onResize, onFocus, 
  initialWidth = 450, initialHeight = 400
}) => {
  // Säkerställ att vi inte startar utanför skärmen
  const safeX = Math.max(20, x);
  const safeY = Math.max(20, y);

  const [localPos, setLocalPos] = useState({ x: safeX, y: safeY });
  const [localSize, setLocalSize] = useState({ width: initialWidth, height: initialHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  const dragStartOffset = useRef({ x: 0, y: 0 });
  const resizeStartData = useRef({ width: 0, height: 0, mouseX: 0, mouseY: 0 });
  const frameRef = useRef<HTMLDivElement>(null);

  // Synka position när props ändras utifrån (t.ex. vid "Ordna fönster"), 
  // men bara om vi inte själva håller på att dra i det.
  useEffect(() => {
    if (!isDragging) {
      setLocalPos({ x: Math.max(0, x), y: Math.max(0, y) });
    }
  }, [x, y, isDragging]);

  const centerWindow = useCallback(() => {
    const centerX = Math.max(20, (window.innerWidth - localSize.width) / 2);
    const centerY = Math.max(20, (window.innerHeight - localSize.height) / 2);
    setLocalPos({ x: centerX, y: centerY });
    onMove(centerX, centerY);
    onFocus();
  }, [localSize, onMove, onFocus]);

  const startDrag = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('.no-drag')) return;

    onFocus();
    setIsDragging(true);
    
    // Spara var i fönstret vi klickade relativt dess hörn
    dragStartOffset.current = {
      x: e.clientX - localPos.x,
      y: e.clientY - localPos.y
    };
    
    e.stopPropagation();
  };

  const startResize = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    onFocus();
    setIsResizing(true);
    resizeStartData.current = {
      width: localSize.width,
      height: localSize.height,
      mouseX: e.clientX,
      mouseY: e.clientY
    };
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // Beräkna ny position men håll kvar fönstret inom rimliga gränser
        const newX = e.clientX - dragStartOffset.current.x;
        const newY = e.clientY - dragStartOffset.current.y;
        
        // Tillåt drag men stanna vid kanterna (med lite marginal)
        setLocalPos({ 
          x: Math.max(-localSize.width + 100, Math.min(window.innerWidth - 100, newX)), 
          y: Math.max(0, Math.min(window.innerHeight - 60, newY)) 
        });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStartData.current.mouseX;
        const deltaY = e.clientY - resizeStartData.current.mouseY;
        const newW = Math.max(300, resizeStartData.current.width + deltaX);
        const newH = Math.max(200, resizeStartData.current.height + deltaY);
        setLocalSize({ width: newW, height: newH });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // Uppdatera huvud-appen med den slutgiltiga positionen
        onMove(localPos.x, localPos.y);
      }
      if (isResizing) {
        setIsResizing(false);
        onResize(localSize.width, localSize.height);
      }
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, localPos, localSize, onMove, onResize]);

  const frameStyle: React.CSSProperties = {
    transform: `translate3d(${localPos.x}px, ${localPos.y}px, 0)`,
    width: localSize.width, 
    height: localSize.height, 
    zIndex,
    position: 'absolute', 
    top: 0, 
    left: 0, 
    willChange: 'transform, width, height',
    // Ingen transition på transform när vi drar för att slippa lag/sticking
    transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.2s, height 0.2s'
  };

  return (
    <div 
      ref={frameRef}
      className={`bg-white shadow-2xl flex flex-col overflow-hidden ring-1 ring-slate-200 rounded-[2rem] pointer-events-auto ${isDragging ? 'shadow-[0_40px_80px_-15px_rgba(0,0,0,0.35)] opacity-95 scale-[1.005]' : ''}`}
      style={frameStyle}
      onMouseDown={onFocus}
    >
      {/* HEADER / DRAG HANDLE */}
      <div 
        className="h-14 bg-slate-50 border-b border-slate-100 flex items-center justify-between px-5 shrink-0 select-none cursor-grab active:cursor-grabbing"
        onMouseDown={startDrag}
        onDoubleClick={centerWindow}
        title="Dra för att flytta, dubbelklicka för att centrera"
      >
        <div className="flex items-center gap-2.5 min-w-0 pointer-events-none">
          <span className="text-xl shrink-0">{icon}</span>
          <div className="flex items-baseline gap-2 overflow-hidden">
            <span className="font-black text-slate-900 tracking-tight text-sm uppercase whitespace-nowrap">{title}</span>
            {subtitle && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap opacity-60 hidden sm:inline">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5 no-drag shrink-0">
          {description && (
            <button 
              onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-90 ${showInfo ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-slate-200 text-slate-400'}`}
            >
              <span className="text-sm">ℹ️</span>
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); centerWindow(); }}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition-all active:scale-90"
            title="Centrera fönster"
          >
            <span className="text-sm">🎯</span>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 hover:text-red-500 text-slate-300 transition-all active:scale-90"
          >
            <span className="text-base font-bold">✕</span>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-white relative">
        {children}
        
        {showInfo && (
          <div className="absolute inset-0 bg-white/98 backdrop-blur-sm z-[60] p-6 animate-in fade-in slide-in-from-top-4 duration-300 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-4">ℹ️</div>
            <h3 className="text-lg font-black text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed max-w-xs mb-6 text-sm">
              {description}
            </p>
            <button 
              onClick={() => setShowInfo(false)}
              className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
            >
              OK
            </button>
          </div>
        )}
      </div>

      {/* RESIZE HANDLE */}
      <div 
        className="no-drag absolute bottom-0 right-0 w-8 h-8 flex items-end justify-end p-1.5 cursor-nwse-resize group z-50"
        onMouseDown={startResize}
      >
        <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-slate-300 group-hover:border-indigo-500 transition-colors rounded-br-sm" />
      </div>
    </div>
  );
};

export default WidgetFrame;
