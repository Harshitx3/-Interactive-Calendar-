import React, { useState, useEffect } from 'react';
import { isBefore, isSameDay, format } from 'date-fns';
import HeroSection from './components/HeroSection';
import CalendarGrid from './components/CalendarGrid';
import NotesPanel from './components/NotesPanel';
import { Calendar as CalendarIcon, Info, Moon, Sun } from 'lucide-react';

const App = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference
  useEffect(() => {
    const isDark = localStorage.getItem('calendar-dark-mode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('calendar-dark-mode', newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSelectDate = (date) => {
    // 1st click: set start date
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } 
    // 2nd click: set end date or reset
    else {
      if (isSameDay(date, startDate)) {
        // Reset if clicking same day
        setStartDate(null);
        setEndDate(null);
      } else if (isBefore(date, startDate)) {
        // If clicked date is before start date, make it the new start date
        setStartDate(date);
        setEndDate(null);
      } else {
        // Set end date
        setEndDate(date);
      }
    }
  };

  const handleSelectRange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className={`min-h-screen transition-all duration-700 p-4 md:p-8 font-sans selection:bg-blue-100 selection:text-blue-700 relative overflow-x-hidden ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[120px] opacity-20 transition-colors duration-700 ${darkMode ? 'bg-blue-600' : 'bg-blue-400'}`} />
        <div className={`absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-[120px] opacity-20 transition-colors duration-700 ${darkMode ? 'bg-emerald-600' : 'bg-emerald-400'}`} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8 animate-in fade-in duration-1000">
        
        {/* Header Title & Controls */}
        <header className="flex items-center justify-between relative z-10 mb-8">
          <div className="flex items-center gap-4 group">
            <div className="p-3.5 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-xl shadow-blue-500/20 transition-transform duration-500 group-hover:scale-110">
              <CalendarIcon className="text-white animate-float" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter leading-none">Interactive Calendar</h1>
              <p className={`text-[10px] font-black uppercase tracking-[0.3em] mt-1.5 ${darkMode ? 'text-blue-400/80' : 'text-blue-600/60'}`}>Digital Experience</p>
            </div>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-2xl transition-all duration-500 glass-effect hover:scale-110 active:scale-95 shadow-xl ${darkMode ? 'text-yellow-400' : 'text-slate-600'}`}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </header>

        
        <main className={`shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden border backdrop-blur-3xl relative z-10 w-full transition-all duration-700 ${darkMode ? 'border-slate-800 bg-slate-900/40' : 'border-white bg-white/40'}`}>
          <HeroSection currentMonth={currentMonth} />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-10">
            {/* Notes Section */}
            <div className="lg:col-span-5 xl:col-span-4 h-full min-w-0">
              <NotesPanel 
                darkMode={darkMode} 
                startDate={startDate} 
                endDate={endDate} 
                onSelectRange={handleSelectRange}
              />
            </div>

            {/* Calendar Section */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8 min-w-0">
              <div className="flex items-end justify-between px-2">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black tracking-tight">Month View</h2>
                  <div className={`h-1 w-12 rounded-full bg-blue-500/50`} />
                </div>
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${darkMode ? 'bg-slate-900/80 text-slate-500 border-slate-800' : 'bg-white/80 text-slate-400 border-slate-200'} backdrop-blur-md`}>
                  <Info size={12} className="text-blue-500" />
                  <span>Dual-Click Selection</span>
                </div>
              </div>
              
              <CalendarGrid 
                currentMonth={currentMonth} 
                startDate={startDate} 
                endDate={endDate} 
                onSelectDate={handleSelectDate}
                darkMode={darkMode}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
