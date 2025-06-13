import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button.jsx';
import Modal from './Modal.jsx';
import { consultarBimestre } from "../service/serviceBimestre.js"

const BimestreSelector = ({ 
  selectedBimestre, 
  onSelectBimestre 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bimestres, setBimestres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const bimestresByAnoLetivo = bimestres.reduce((acc, bimestre) => {
    const anoLetivoId = bimestre.bimestre_anoletivo_id;
    if (!acc[anoLetivoId]) {
      acc[anoLetivoId] = [];
    }
    acc[anoLetivoId].push(bimestre);
    return acc;
  }, {});

  useEffect(() => {
    if (isModalOpen) {
      setLoading(true);
      setError(null);
      
      consultarBimestre()
        .then(response => {
          if (response.status) {
            setBimestres(response.listaDeBimestres);
          } else {
            setError('Não foi possível carregar os bimestres.');
          }
        })
        .catch(() => {
          setError('Erro ao carregar bimestres. Tente novamente.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isModalOpen]);

  const handleSelect = (bimestre) => {
    onSelectBimestre(bimestre);
    setIsModalOpen(false);
  };

  const getBimestreLabel = (bimestreId, anoLetivoId) => {
    const bimestreNum = ((bimestreId - 1) % 4) + 1;
    return `${bimestreNum}º Bimestre`;
  };

  return (
    <div>
      <Button 
        onClick={() => setIsModalOpen(true)}
        variant={selectedBimestre ? 'primary' : 'outline'}
        icon={<Calendar size={18} />}
      >
        {selectedBimestre ? 
          getBimestreLabel(selectedBimestre.bimestre_id, selectedBimestre.bimestre_anoletivo_id) + 
          ` (Ano Letivo ${selectedBimestre.bimestre_anoletivo_id})` : 
          'Selecionar Bimestre'}
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Selecione o Bimestre"
        size="lg"
      >
        {loading ? (
          <div className="flex flex-col justify-center items-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Carregando bimestres...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
              <div className="bg-red-100 rounded-full p-3 w-fit mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-red-800 font-semibold mb-2">Ops! Algo deu errado</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 max-h-96 overflow-y-auto pr-2">
            {Object.entries(bimestresByAnoLetivo).map(([anoLetivoId, bimestresGroup]) => (
              <motion.div 
                key={anoLetivoId} 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-3 pb-2 border-b border-gray-100">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2">
                    <Calendar size={18} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Ano Letivo {anoLetivoId}
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bimestresGroup.map((bimestre, index) => (
                    <motion.div
                      key={bimestre.bimestre_id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.2 }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelect(bimestre)}
                      className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg ${
                        selectedBimestre?.bimestre_id === bimestre.bimestre_id
                          ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-400 shadow-blue-100'
                          : 'bg-white border border-gray-200 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50 hover:border-blue-300'
                      }`}
                    >
                      {/* Background Pattern */}
                      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-20"></div>
                      
                      <div className="relative p-5">
                        <div className="flex items-center space-x-4">
                          <div className={`rounded-xl p-3 transition-colors ${
                            selectedBimestre?.bimestre_id === bimestre.bimestre_id
                              ? 'bg-blue-500 shadow-lg'
                              : 'bg-gradient-to-br from-green-100 to-emerald-100'
                          }`}>
                            <Calendar size={20} className={
                              selectedBimestre?.bimestre_id === bimestre.bimestre_id
                                ? 'text-white'
                                : 'text-green-600'
                            } />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className={`font-bold text-lg leading-tight ${
                              selectedBimestre?.bimestre_id === bimestre.bimestre_id
                                ? 'text-blue-700'
                                : 'text-gray-800'
                            }`}>
                              {getBimestreLabel(bimestre.bimestre_id, parseInt(anoLetivoId))}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                ID: {bimestre.bimestre_id}
                              </span>
                              {selectedBimestre?.bimestre_id === bimestre.bimestre_id && (
                                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                  Selecionado
                                </span>
                              )}
                            </div>
                          </div>

                          {selectedBimestre?.bimestre_id === bimestre.bimestre_id && (
                            <div className="text-blue-500">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BimestreSelector;