import React from 'react';
import { AlertTriangle, Save, X, Trash2 } from 'lucide-react';

function ConfirmationModal({ isOpen, onConfirmSave, onDiscardChanges, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-100 text-orange-600 p-2 rounded-full">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Alterações não salvas
            </h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            Você tem alterações não salvas na avaliação atual. O que deseja fazer?
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirmSave}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Save size={20} />
              <span>Salvar e continuar</span>
            </button>
            
            <button
              onClick={onDiscardChanges}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 size={20} />
              <span>Descartar alterações</span>
            </button>
            
            <button
              onClick={onCancel}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <X size={20} />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;