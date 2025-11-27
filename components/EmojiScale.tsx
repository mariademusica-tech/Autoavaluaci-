import React from 'react';
import { Frown, Meh, Smile, Laugh } from 'lucide-react';

interface EmojiScaleProps {
  value: number | undefined;
  onChange: (val: number) => void;
}

export const EmojiScale: React.FC<EmojiScaleProps> = ({ value, onChange }) => {
  const options = [
    { val: 1, icon: Frown, color: 'text-red-500', label: 'Caldria millorar' },
    { val: 2, icon: Meh, color: 'text-orange-400', label: 'Regular' },
    { val: 3, icon: Smile, color: 'text-lime-500', label: 'Bé' },
    { val: 4, icon: Laugh, color: 'text-green-600', label: 'Molt bé!' },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-6">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = value === opt.val;
        
        return (
          <button
            key={opt.val}
            onClick={() => onChange(opt.val)}
            className={`
              group relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300
              ${isSelected ? 'bg-white shadow-xl scale-110 ring-4 ring-offset-2 ring-indigo-200' : 'hover:bg-white/50 hover:scale-105'}
            `}
          >
            <Icon 
              size={48} 
              className={`transition-all duration-300 ${isSelected ? opt.color : 'text-gray-400 group-hover:text-gray-500'} stroke-[1.5px]`} 
            />
            {isSelected && (
              <span className={`absolute -bottom-8 text-sm font-bold whitespace-nowrap ${opt.color}`}>
                {opt.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};