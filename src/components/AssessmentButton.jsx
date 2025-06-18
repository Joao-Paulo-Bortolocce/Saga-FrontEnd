import React from 'react';
import { X } from 'lucide-react';

function AssessmentButton({ value, currentValue, onClick, color, disabled = false }) {
  const isSelected = currentValue === value;

  const baseClass = "relative w-12 h-12 rounded-xl transition-all duration-200 font-bold text-sm";
  const colorClasses = {
    red: "bg-red-100 border-2 border-red-500 text-red-700 hover:bg-red-200",
    yellow: "bg-yellow-100 border-2 border-yellow-500 text-yellow-700 hover:bg-yellow-200",
    green: "bg-green-100 border-2 border-green-500 text-green-700 hover:bg-green-200"
  };

  const selectedClass = colorClasses[color];
  const unselectedClass = disabled 
    ? "bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed"
    : "bg-white border border-gray-200 text-gray-400 hover:bg-gray-50 hover:border-gray-300";

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClass} ${isSelected ? selectedClass : unselectedClass} ${
        disabled ? 'opacity-50' : 'hover:scale-105 active:scale-95'
      } shadow-sm`}
      aria-pressed={isSelected}
      title={disabled ? `Avaliação bloqueada - não é possível alterar` : `${isSelected ? 'Remover' : 'Selecionar'} avaliação ${value}`}
    >
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <X size={18} className={`text-${color}-600`} />
        </div>
      )}
      <span className={isSelected ? 'opacity-0' : ''}>
        {value}
      </span>
    </button>
  );
}

export default AssessmentButton;