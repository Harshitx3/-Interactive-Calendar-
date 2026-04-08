import React from 'react';
import { format } from 'date-fns';

const HeroSection = ({ currentMonth }) => {
  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-t-2xl shadow-lg">
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000"
        alt="Hero Calendar"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wider drop-shadow-md">
          {format(currentMonth, 'MMMM yyyy')}
        </h1>
      </div>
    </div>
  );
};

export default HeroSection;
