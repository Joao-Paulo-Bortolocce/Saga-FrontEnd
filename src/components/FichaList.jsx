import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import Button from './Button';

const FichaList = ({ fichas, onEditFicha, onDeleteFicha }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-xl shadow-lg"
    >
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">Fichas Cadastradas</h2>
      
      <div className="space-y-4">
        {Object.entries(fichasBySerie).map(([serieId, seriaFichas]) => (
          <div key={serieId} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSerie(serieId)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium text-gray-700">
                Série {serieId} ({seriaFichas.length} ficha{seriaFichas.length !== 1 ? 's' : ''})
              </span>
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
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {seriaFichas.map((ficha) => (
                      <motion.tr 
                        key={ficha.ficha_id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {ficha.ficha_id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {ficha.bimestreDescr || `Bimestre ${ficha.ficha_bimestre_id}`}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {ficha.anoLetivoDescr || ficha.ficha_bimestre_anoLetivo_id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-center space-x-2">
                            <Button 
                              variant="primary"
                              size="sm"
                              icon={<Edit size={16} />}
                              onClick={() => onEditFicha(ficha)}
                            >
                              Editar
                            </Button>
                            <Button 
                              variant="danger"
                              size="sm"
                              icon={<Trash2 size={16} />}
                              onClick={() => onDeleteFicha(ficha)}
                            >
                              Excluir
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FichaList;