'use client';

import React from 'react';

const Cell = ({ letter, title, description, audioKey, color, onClick, isActive }: {
  letter: string;
  title: string;
  description: string;
  audioKey: string;
  color: 'red' | 'purple' | 'amber' | 'blue' | 'green';
  onClick?: () => void;
  isActive?: boolean;
}) => {
  const colorClasses = {
    red: 'text-red-400',
    purple: 'text-purple-400',
    amber: 'text-amber-400',
    blue: 'text-blue-400',
    green: 'text-green-400'
  };

  return (
    <div
      className={`border border-zinc-500 rounded-xl p-3 md:p-4 lg:p-5 text-center min-h-[120px] md:min-h-[130px] lg:min-h-[140px] flex flex-col justify-center items-center hover:bg-zinc-700 transition-all duration-300 hover:scale-105 cursor-pointer mx-1 ${
        isActive ? 'pulse-active' : ''
      }`}
      onClick={onClick}
    >
      <div className={`text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold transition-colors leading-tight ${colorClasses[color]}`}>
        {letter}
      </div>
      <div className="text-white text-sm md:text-base font-semibold mt-2">
        {title}
      </div>
      <div className="text-gray-300 text-xs md:text-sm mt-1">
        {description}
      </div>
    </div>
  );
};

export default Cell;
