import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';

const NotesPanel = () => {
  const [notes, setNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Load saved notes on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('calendar-notes');
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('calendar-notes', notes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          Monthly Notes
        </h3>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
        >
          <Save size={18} />
          Save
        </button>
      </div>

      <textarea
        className="flex-1 w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-slate-50/50 text-slate-700 font-medium"
        placeholder="Write your monthly thoughts here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div className={`mt-4 transition-all duration-300 transform ${isSaved ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 w-fit">
          <CheckCircle2 size={18} />
          <span className="text-sm font-semibold">Notes saved to local storage</span>
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;
