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
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <div className="space-y-6">
            {Object.entries(bimestresByAnoLetivo).map(([anoLetivoId, bimestresGroup]) => (
              <div key={anoLetivoId} className="space-y-2">
                <h3 className="text-lg font-medium text-gray-800">
                  Ano Letivo {anoLetivoId}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {bimestresGroup.map((bimestre) => (
                    <motion.div
                      key={bimestre.bimestre_id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(bimestre)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedBimestre?.bimestre_id === bimestre.bimestre_id
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-white border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <Calendar size={18} className="text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {getBimestreLabel(bimestre.bimestre_id, parseInt(anoLetivoId))}
                          </h3>
                          <p className="text-sm text-gray-500">ID: {bimestre.bimestre_id}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BimestreSelector;
