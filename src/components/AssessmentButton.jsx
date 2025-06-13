import React from 'react';
import { X } from 'lucide-react';

function AssessmentButton({ value, currentValue, onClick, color }) {
  const isSelected = currentValue === value;

  const baseClass = "relative w-10 h-10 rounded-lg transition-all duration-200 font-medium text-sm";
  const colorClasses = {
    red: "bg-red-100 border-2 border-red-500 text-red-700",
    yellow: "bg-yellow-100 border-2 border-yellow-500 text-yellow-700",
    green: "bg-green-100 border-2 border-green-500 text-green-700"
  };

  const selectedClass = colorClasses[color];
  const unselectedClass = "bg-white border border-gray-200 text-gray-400 hover:bg-gray-50";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClass} ${isSelected ? selectedClass : unselectedClass}`}
      aria-pressed={isSelected}
    >
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <X size={16} className={`text-${color}-600`} />
        </div>
      )}
      <span className={isSelected ? 'opacity-0' : ''}>
        {value}
      </span>
    </button>
  );
}

export default AssessmentButton;