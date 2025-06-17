import React, { useState } from 'react';
import { X, Search, User, GraduationCap, Calendar, FileText } from 'lucide-react';

function RecoveryModal({ 
  isOpen, 
  onClose, 
  assessmentRecords, 
  series, 
  matriculas, 
  fichas, 
  onSelectRecord,
  onRecordUpdated 
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSerie, setSelectedSerie] = useState('');

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setSearchTerm('');
      setSelectedSerie('');
    }, 300);
  };

  const handleSelectRecord = (record) => {
    onSelectRecord(record);
    handleClose();
  };

  // Função para obter informações da matrícula
  const getMatriculaInfo = (matriculaId) => {
    const matricula = matriculas.find(m => m.id === matriculaId);
    return matricula ? {
      nome: matricula.aluno.pessoa.nome,
      serie: matricula.serie.serieDescr,
      serieId: matricula.serie.serieId
    } : null;
  };

  // Função para obter nome da série
  const getSerieNome = (serieId) => {
    const serie = series.find(s => s.serieId === serieId);
    return serie ? serie.serieDescr : `Série ${serieId}`;
  };

  // Filtrar registros baseado na busca e série selecionada
  const filteredRecords = assessmentRecords.filter(record => {
    const matriculaInfo = getMatriculaInfo(record.avaMatId);
    if (!matriculaInfo) return false;

    const matchesSearch = searchTerm === '' || 
      matriculaInfo.nome.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSerie = selectedSerie === '' || 
      matriculaInfo.serieId.toString() === selectedSerie;

    return matchesSearch && matchesSerie;
  });

  // Agrupar registros por matrícula
  const groupedRecords = filteredRecords.reduce((acc, record) => {
    const matriculaInfo = getMatriculaInfo(record.avaMatId);
    if (!matriculaInfo) return acc;

    const key = record.avaMatId;
    if (!acc[key]) {
      acc[key] = {
        matriculaId: record.avaMatId,
        matriculaInfo,
        avaliacoes: []
      };
    }
    acc[key].avaliacoes.push(record);
    return acc;
  }, {});

  if (!isOpen) return null;

  const modalClasses = isClosing
    ? "fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 opacity-0"
    : "fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 opacity-100";

  const contentClasses = isClosing
    ? "bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden transition-transform duration-300 transform -translate-y-4"
    : "bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden transition-transform duration-300 transform translate-y-0";

  return (
    <div className={modalClasses} onClick={handleClose}>
      <div className={contentClasses} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FileText size={20} />
            Recuperar Avaliações
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="border-b border-gray-200 p-4 bg-gray-50">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome do aluno..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="w-48">
              <select
                value={selectedSerie}
                onChange={(e) => setSelectedSerie(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Todas as séries</option>
                {series.map(serie => (
                  <option key={serie.serieId} value={serie.serieId}>
                    {serie.serieDescr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4" style={{ maxHeight: '60vh' }}>
          {Object.keys(groupedRecords).length === 0 ? (
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                {assessmentRecords.length === 0 
                  ? "Nenhuma avaliação encontrada" 
                  : "Nenhuma avaliação encontrada com os filtros aplicados"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.values(groupedRecords).map(({ matriculaId, matriculaInfo, avaliacoes }) => (
                <div key={matriculaId} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User size={16} className="text-gray-500" />
                        <span className="font-medium text-gray-800">{matriculaInfo.nome}</span>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <GraduationCap size={14} />
                          <span>{matriculaInfo.serie}</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {avaliacoes.length} avaliação(ões)
                      </span>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {avaliacoes.map((record, index) => (
                      <div 
                        key={`${record.avaMatId}-${record.avaHabId}-${index}`}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleSelectRecord(record)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                Habilidade ID: {record.avaHabId}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                record.avaAv === 'A' ? 'bg-green-100 text-green-800' :
                                record.avaAv === 'EC' ? 'bg-yellow-100 text-yellow-800' :
                                record.avaAv === 'NA' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {record.avaAv || 'Não avaliado'}
                              </span>
                            </div>
                            {record.avaObs && (
                              <p className="text-sm text-gray-600 mb-1">
                                Observação: {record.avaObs}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>ID: {record.avaId}</span>
                              {record.avaDataCriacao && (
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} />
                                  {new Date(record.avaDataCriacao).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                              Selecionar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {Object.keys(groupedRecords).length} matrícula(s) com avaliações encontrada(s)
            </p>
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecoveryModal;