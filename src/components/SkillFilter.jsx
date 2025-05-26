import React, { useState, useRef, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const SkillFilter = ({ subjects, activeFilters, onFilterChange, onClearFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggleFilter = (subject) => {
    onFilterChange(subject);
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="relative" ref={filterRef}>
      <Button
        variant="outline"
        icon={<Filter size={18} />}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto"
      >
        Filtrar
        {activeFilterCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-3"
          >
            <div className="font-medium text-sm mb-2">Filtrar por matéria</div>
            {Object.keys(activeFilters).map(subject => (
              <div key={subject} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`filter-${subject}`}
                  checked={activeFilters[subject]}
                  onChange={() => handleToggleFilter(subject)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`filter-${subject}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  {subject}
                </label>
              </div>
            ))}
            <button
              onClick={onClearFilters}
              className="text-xs text-blue-600 hover:text-blue-800 mt-2"
            >
              Limpar filtros
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillFilter;