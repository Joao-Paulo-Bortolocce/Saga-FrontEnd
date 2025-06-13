import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';
import Modal from './Modal';
import { buscarSeries } from '../service/servicoSerie';

const SeriesSelector = ({ selectedSerie, onSelectSerie }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isModalOpen) {
      setLoading(true);
      setError(null);
      
      buscarSeries()
        .then(response => {
          if (response.status) {
            setSeries(response.series);
          } else {
            setError('Não foi possível carregar as séries.');
          }
        })
        .catch(() => {
          setError('Erro ao carregar séries. Tente novamente.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isModalOpen]);

  const handleSelect = (serie) => {
    onSelectSerie(serie);
    setIsModalOpen(false);
  };

  return (
    <div>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant={selectedSerie ? 'primary' : 'outline'}
        icon={<BookOpen size={18} />}
      >
        {selectedSerie ? selectedSerie.serieDescr : 'Selecionar Série'}
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Selecione a Série"
        size="md"
      >
        {loading ? (
          <div className="flex flex-col justify-center items-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-100"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent absolute top-0"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Carregando séries...</p>
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
          <div className="space-y-1 max-h-80 overflow-y-auto pr-2">
            <div className="mb-6 text-center">
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-full p-3 w-fit mx-auto mb-3">
                <BookOpen size={24} className="text-white" />
              </div>
              <p className="text-gray-600 text-sm">Escolha uma série para continuar</p>
            </div>

            {series.map((serie, index) => (
              <motion.div
                key={serie.serieId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(serie)}
                className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                  selectedSerie?.serieId === serie.serieId
                    ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-400 shadow-purple-100'
                    : 'bg-white border border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50 hover:border-purple-300'
                }`}
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 -mt-3 -mr-3 w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full opacity-20"></div>
                
                {/* Selection Indicator */}
                {selectedSerie?.serieId === serie.serieId && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-blue-600"></div>
                )}

                <div className="relative p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`rounded-xl p-3 transition-all duration-300 ${
                      selectedSerie?.serieId === serie.serieId
                        ? 'bg-purple-500 shadow-lg scale-110'
                        : 'bg-gradient-to-br from-purple-100 to-blue-100'
                    }`}>
                      <BookOpen size={20} className={
                        selectedSerie?.serieId === serie.serieId
                          ? 'text-white'
                          : 'text-purple-600'
                      } />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg leading-tight ${
                        selectedSerie?.serieId === serie.serieId
                          ? 'text-purple-700'
                          : 'text-gray-800'
                      }`}>
                        {serie.serieDescr}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          Série {serie.serieNum}
                        </span>
                        {selectedSerie?.serieId === serie.serieId && (
                          <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                            Selecionada
                          </span>
                        )}
                      </div>
                    </div>

                    {selectedSerie?.serieId === serie.serieId ? (
                      <div className="text-purple-500">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="text-gray-300 group-hover:text-purple-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover effect line */}
                <div className={`h-0.5 bg-gradient-to-r from-purple-500 to-blue-600 transform origin-left transition-transform duration-300 ${
                  selectedSerie?.serieId === serie.serieId ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></div>
              </motion.div>
            ))}

            {series.length === 0 && !loading && !error && (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full p-4 w-fit mx-auto mb-4">
                  <BookOpen size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Nenhuma série encontrada</p>
                <p className="text-gray-400 text-sm mt-1">Tente recarregar a página</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SeriesSelector;