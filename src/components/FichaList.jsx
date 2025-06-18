import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, ChevronDown, ChevronRight, Lock, AlertTriangle } from 'lucide-react';
import Button from './Button';

const FichaList = ({ 
  fichas, 
  onEditFicha, 
  onDeleteFicha, 
  fichasStatus, 
  getStatusLabel, 
  getStatusColor, 
  isFichaEditable 
}) => {
  const [expandedSeries, setExpandedSeries] = React.useState({});

  if (!fichas || fichas.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-xl shadow-lg"
      >
        <p className="text-center text-gray-500">Nenhuma ficha encontrada</p>
      </motion.div>
    );
  }

  // Group fichas by série
  const fichasBySerie = fichas.reduce((acc, ficha) => {
    const serieId = ficha.ficha_bimestre_serie_id;
    if (!acc[serieId]) {
      acc[serieId] = [];
    }
    acc[serieId].push(ficha);
    return acc;
  }, {});

  const toggleSerie = (serieId) => {
    setExpandedSeries(prev => ({
      ...prev,
      [serieId]: !prev[serieId]
    }));
  };

  const renderStatusBadge = (fichaId) => {
    const status = fichasStatus[fichaId] || 1;
    const label = getStatusLabel(status);
    const colorClass = getStatusColor(status);
    
    return (
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorClass}`}>
          {label}
        </span>
        {status !== 1 && (
          <Lock size={14} className="text-gray-500" />
        )}
      </div>
    );
  };

  const renderActionButtons = (ficha) => {
    const isEditable = isFichaEditable(ficha.ficha_id);
    const status = fichasStatus[ficha.ficha_id] || 1;
    
    return (
      <div className="flex justify-center space-x-2">
        <Button 
          variant={isEditable ? "primary" : "secondary"}
          size="sm"
          icon={isEditable ? <Edit size={16} /> : <Lock size={16} />}
          onClick={() => onEditFicha(ficha)}
          disabled={!isEditable}
          className={!isEditable ? "opacity-50 cursor-not-allowed" : ""}
          title={!isEditable ? `Não é possível editar - Status: ${getStatusLabel(status)}` : "Editar ficha"}
        >
          {isEditable ? "Editar" : "Bloqueado"}
        </Button>
        <Button 
          variant={isEditable ? "danger" : "secondary"}
          size="sm"
          icon={isEditable ? <Trash2 size={16} /> : <AlertTriangle size={16} />}
          onClick={() => onDeleteFicha(ficha)}
          disabled={!isEditable}
          className={!isEditable ? "opacity-50 cursor-not-allowed" : ""}
          title={!isEditable ? `Não é possível excluir - Status: ${getStatusLabel(status)}` : "Excluir ficha"}
        >
          {isEditable ? "Excluir" : "Bloqueado"}
        </Button>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-xl shadow-lg"
    >
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Fichas Cadastradas</h2>
      
      <div className="space-y-4">
        {Object.entries(fichasBySerie).map(([serieId, seriaFichas]) => {
          const editableFichas = seriaFichas.filter(ficha => isFichaEditable(ficha.ficha_id));
          const nonEditableFichas = seriaFichas.filter(ficha => !isFichaEditable(ficha.ficha_id));
          
          return (
            <div key={serieId} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSerie(serieId)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-700">
                    Série {serieId} ({seriaFichas.length} ficha{seriaFichas.length !== 1 ? 's' : ''})
                  </span>
                  {nonEditableFichas.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                      <Lock size={12} />
                      <span>{nonEditableFichas.length} bloqueada{nonEditableFichas.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
                {expandedSeries[serieId] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </button>
              
              {expandedSeries[serieId] && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bimestre
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ano Letivo
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {seriaFichas.map((ficha) => {
                        const isEditable = isFichaEditable(ficha.ficha_id);
                        const status = fichasStatus[ficha.ficha_id] || 1;
                        
                        return (
                          <motion.tr 
                            key={ficha.ficha_id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`hover:bg-gray-50 ${!isEditable ? 'bg-gray-50/50' : ''}`}
                          >
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              <div className="flex items-center gap-2">
                                {ficha.ficha_id}
                                {!isEditable && <Lock size={14} className="text-gray-400" />}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {ficha.bimestreDescr || `Bimestre ${ficha.ficha_bimestre_id}`}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {ficha.anoLetivoDescr || ficha.ficha_bimestre_anoLetivo_id}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {renderStatusBadge(ficha.ficha_id)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              {renderActionButtons(ficha)}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FichaList;