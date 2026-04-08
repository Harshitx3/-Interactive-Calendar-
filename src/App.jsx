import React, { useState } from 'react';
import { isBefore, isSameDay } from 'date-fns';
import HeroSection from './components/HeroSection';
import CalendarGrid from './components/CalendarGrid';
import NotesPanel from './components/NotesPanel';
import { Calendar as CalendarIcon, Info } from 'lucide-react';

const App = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-10 font-sans selection:bg-blue-100 selection:text-blue-700">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Header Title (Hidden on small screens) */}
        <div className="hidden md:flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
            <CalendarIcon className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Interactive Calendar</h1>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Digital Wall Calendar</p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="shadow-2xl rounded-2xl overflow-hidden ring-1 ring-slate-200">
          <HeroSection currentMonth={currentMonth} />
          
          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8 bg-white">
            
            {/* Notes Section - Left Column (30% on desktop) */}
            <div className="lg:col-span-4 h-full">
              <NotesPanel />
            </div>

            {/* Calendar Section - Right Column (70% on desktop) */}
            <div className="lg:col-span-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800">Month View</h2>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                    <Info size={14} />
                    <span>Click twice to select a range</span>
                  </div>
                </div>
                
                <CalendarGrid 
                  currentMonth={currentMonth} 
                  startDate={startDate} 
                  endDate={endDate} 
                  onSelectDate={handleSelectDate} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <footer className="text-center pt-8">
          <p className="text-sm font-medium text-slate-400">
            &copy; 2026 Interactive Wall Calendar. Built with React & Tailwind CSS.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
