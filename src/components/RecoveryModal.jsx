import React, { useState, useEffect } from 'react';
import { X, Search, FileText, GraduationCap, User } from 'lucide-react';

function RecoveryModal({ isOpen, onClose, assessmentRecords, onSelectRecord, series, matriculas }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (assessmentRecords && assessmentRecords.length > 0) {
      setFilteredRecords(assessmentRecords);
    }
  }, [assessmentRecords]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRecords(assessmentRecords);
    } else {
      const filtered = assessmentRecords.filter(record => {
        const matricula = matriculas.find(m => m.id === record.avaliacaodamatricula_matricula_id);
        const serie = series.find(s => s.serieId === matricula?.serie?.serieId);

        const alunoNome = matricula ? matricula.aluno.pessoa.nome.toLowerCase() : '';
        const serieDescr = serie ? serie.serieDescr.toLowerCase() : '';
        
        return alunoNome.includes(searchTerm.toLowerCase()) || 
               serieDescr.includes(searchTerm.toLowerCase()) ||
               record.avaliacaodamatricula_matricula_id.toString().includes(searchTerm);
      });
      setFilteredRecords(filtered);
    }
  }, [searchTerm, assessmentRecords, matriculas, series]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  if (!isOpen) return null;

  const modalClasses = isClosing
    ? "fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 opacity-0"
    : "fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 opacity-100";

  const contentClasses = isClosing
    ? "bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden transition-transform duration-300 transform -translate-y-4"
    : "bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden transition-transform duration-300 transform translate-y-0";

  const getMatriculaNome = (matriculaId) => {
    const matricula = matriculas.find(m => m.id === matriculaId);
    return matricula ? matricula.aluno.pessoa.nome : `Matrícula ${matriculaId}`;
  };

  const getSerieDescr = (matriculaId) => {
    const matricula = matriculas.find(m => m.id === matriculaId);
    const serie = series.find(s => s.serieId === matricula?.serie?.serieId);
    return serie ? serie.serieDescr : `Série não encontrada`;
  };

  return (
    <div className={modalClasses} onClick={handleClose}>
      <div className={contentClasses} onClick={e => e.stopPropagation()}>
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Recuperar Avaliação</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar por aluno ou série..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[60vh]">
          {filteredRecords.length === 0 ? (
            <div className="py-8 px-4 text-center text-gray-500">
              <FileText size={48} className="mx-auto mb-2 text-gray-400" />
              <p>Nenhuma avaliação encontrada.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredRecords.map((record, index) => (
                <li key={index} className="hover:bg-blue-50 transition-colors">
                  <button
                    onClick={() => onSelectRecord(record)}
                    className="w-full text-left px-4 py-3 flex items-center gap-4"
                  >
                    <div className="bg-blue-100 text-blue-700 p-3 rounded-lg">
                      <FileText size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-gray-800">
                        {getMatriculaNome(record.avaliacaodamatricula_matricula_id)}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <GraduationCap size={16} className="mr-1" />
                          {getSerieDescr(record.avaliacaodamatricula_matricula_id)}
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Avaliação existente
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecoveryModal;