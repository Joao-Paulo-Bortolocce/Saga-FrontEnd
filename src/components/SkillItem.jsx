import React from 'react';
import { CheckSquare, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const SkillItem = ({ skill, isSelected, onToggle, subjectName, colorClass, isLoading = false }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => !isLoading && onToggle(skill)}
      className={`p-3 rounded-lg cursor-pointer border transition-colors ${
        isSelected
          ? 'bg-blue-50 border-blue-300'
          : 'bg-white border-gray-200 hover:bg-gray-50'
      } ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
    >
      <div className="flex items-start">
        <div className={`p-2 rounded-md mr-3 ${isSelected ? 'bg-blue-200' : 'bg-gray-100'} flex items-center justify-center`}>
          {isLoading ? (
            <Loader size={18} className="text-blue-600 animate-spin" />
          ) : (
            <CheckSquare 
              size={18} 
              className={isSelected ? 'text-blue-600' : 'text-gray-400'}
              fill={isSelected ? 'currentColor' : 'none'}
            />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-800">{skill.descricao}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-gray-500">Código: {skill.cod}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${colorClass}`}>
              {subjectName}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillItem;