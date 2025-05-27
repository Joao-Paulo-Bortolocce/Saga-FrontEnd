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
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <div className="grid gap-2">
              {series.map((serie) => (
                <motion.div
                  key={serie.serieId}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(serie)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSerie?.serieId === serie.serieId
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <BookOpen size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{serie.serieDescr}</h3>
                      <p className="text-sm text-gray-500">Série {serie.serieNum}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Modal>
      </div>
    );
  };

  export default SeriesSelector;
