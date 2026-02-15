
import React, { useState } from 'react';
import { Student, Group } from '../types';

interface GroupingToolProps {
  students: Student[];
  onResize?: (width: number, height: number) => void;
}

const GroupingTool: React.FC<GroupingToolProps> = ({ students, onResize }) => {
  const [groupCount, setGroupCount] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isViewMode, setIsViewMode] = useState(false);

  const generateGroups = () => {
    if (students.length === 0) return;
    const shuffled = [...students].sort(() => 0.5 - Math.random());
    const newGroups: Group[] = Array.from({ length: groupCount }, (_, i) => ({ id: i + 1, members: [] }));
    shuffled.forEach((student, index) => { newGroups[index % groupCount].members.push({ ...student }); });
    setGroups(newGroups);
  };

  const toggleViewMode = () => {
    const nextMode = !isViewMode;
    setIsViewMode(nextMode);
    if (onResize) onResize(nextMode ? 900 : 750, nextMode ? 850 : 750);
  };

  return (
    <div className={`flex flex-col h-full bg-white pt-6 ${isViewMode ? 'p-0' : ''}`}>
      <div className="flex items-center justify-end gap-2 px-6 mb-6 shrink-0 no-drag">
        {!isViewMode && (
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <input type="number" min="2" max="20" value={groupCount} onChange={(e) => setGroupCount(parseInt(e.target.value) || 2)} className="text-sm font-black text-indigo-600 w-10 bg-transparent outline-none text-center" />
            <button onClick={generateGroups} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase">Slumpa</button>
          </div>
        )}
        {groups.length > 0 && (
          <button onClick={toggleViewMode} className={`px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase transition-all ${isViewMode ? 'bg-white border border-slate-200 text-slate-500' : 'bg-amber-500 text-white'}`}>
            {isViewMode ? '⚙️ Redigera' : '📺 Storskärm'}
          </button>
        )}
      </div>
      <div className={`flex-1 ${isViewMode ? 'p-6 bg-slate-50/30 overflow-y-auto' : 'overflow-y-auto custom-scrollbar px-6'}`}>
        {groups.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center h-full flex flex-col items-center justify-center opacity-40">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Slumpa grupper för att börja</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${isViewMode ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
            {groups.map((group) => (
              <div key={group.id} className={`flex flex-col transition-all bg-white border border-slate-100 rounded-[2.5rem] p-6 ${isViewMode ? 'shadow-sm' : ''}`}>
                <h3 className="font-black text-indigo-500 text-[10px] uppercase tracking-widest mb-4 border-b border-indigo-50 pb-2 flex justify-between">GRUPP {group.id} <span className="text-slate-300">{group.members.length} elever</span></h3>
                <ul className="space-y-2">
                  {group.members.map((m) => (
                    <li key={m.id} className={`font-black tracking-tight ${isViewMode ? 'text-2xl text-slate-800' : 'text-slate-600 text-sm'}`}>{m.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupingTool;
