import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';

const NotesPanel = ({ darkMode }) => {
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
    <div className={`rounded-2xl shadow-xl border p-6 flex flex-col h-full transition-colors duration-500 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
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
        className={`flex-1 w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-medium transition-colors ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-300 placeholder-slate-600' : 'bg-slate-50/50 border-slate-200 text-slate-700 placeholder-slate-400'}`}
        placeholder="Write your monthly thoughts here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div className={`mt-4 transition-all duration-300 transform ${isSaved ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border w-fit ${darkMode ? 'text-emerald-400 bg-emerald-900/20 border-emerald-900/50' : 'text-emerald-600 bg-emerald-50 border-emerald-100'}`}>
          <CheckCircle2 size={18} />
          <span className="text-sm font-semibold">Notes saved to local storage</span>
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;
