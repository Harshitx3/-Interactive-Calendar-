import React from 'react';
import { format } from 'date-fns';

const HeroSection = ({ currentMonth }) => {
  return (
    <div className="relative w-full h-72 md:h-96 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000"
        alt="Hero Calendar"
        className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[2s]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center backdrop-blur-[2px]">
        <div className="space-y-2">
          <p className="text-blue-400 text-xs font-black uppercase tracking-[0.5em] animate-in fade-in slide-in-from-bottom-2 duration-700">
            Currently Viewing
          </p>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter drop-shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {format(currentMonth, 'MMMM')}
            <span className="text-blue-500 block md:inline md:ml-4 text-3xl md:text-5xl font-light tracking-normal opacity-80">
              {format(currentMonth, 'yyyy')}
            </span>
          </h1>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
    </div>
  );
};

export default HeroSection;
