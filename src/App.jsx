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
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'} p-4 md:p-10 font-sans selection:bg-blue-100 selection:text-blue-700`}>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Header Title & Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
              <CalendarIcon className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Interactive Calendar</h1>
              <p className={`text-sm font-semibold uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Digital Wall Calendar</p>
            </div>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-xl transition-all duration-300 ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-50 shadow-md'}`}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        {/* Hero Section */}
        <div className={`shadow-2xl rounded-2xl overflow-hidden ring-1 ${darkMode ? 'ring-slate-800' : 'ring-slate-200'}`}>
          <HeroSection currentMonth={currentMonth} />
          
          {/* Main Layout Grid */}
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8 transition-colors duration-500 ${darkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
            
            {/* Notes Section - Left Column (30% on desktop) */}
            <div className="lg:col-span-4 h-full">
              <NotesPanel 
                darkMode={darkMode} 
                startDate={startDate} 
                endDate={endDate} 
                onSelectRange={handleSelectRange}
              />
            </div>

            {/* Calendar Section - Right Column (70% on desktop) */}
            <div className="lg:col-span-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Month View</h2>
                  <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${darkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                    <Info size={14} />
                    <span>Click twice to select a range</span>
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
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
