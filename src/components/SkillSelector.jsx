import React, { useState, useEffect } from 'react';
import { Search, CheckSquare, X, Filter, Book, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import Modal from './Modal';
import { consultarHabilidadesDaFicha } from "../service/serviceHabilidadesDaFicha.js";
import { buscarHabilidadesSer } from '../service/serviceHabilidade';

const SkillSelector = ({ 
  selectedSerie, 
  selectedBimestre, 
  selectedSkills = [], 
  onSkillsChange,
  fichaId = null // ID da ficha para carregar habilidades existentes
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [existingSkills, setExistingSkills] = useState([]); // Habilidades já cadastradas na ficha
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  // Group skills by subject
  const skillsBySubject = filteredSkills.reduce((acc, skill) => {
    const subjectId = skill.materia_id;
    const subjectName = getSubjectName(subjectId);
    
    if (!acc[subjectName]) {
      acc[subjectName] = [];
    }
    acc[subjectName].push(skill);
    return acc;
  }, {});

  function getSubjectName(subjectId) {
    const subjects = {
      1: 'Matemática',
      2: 'Português', 
      3: 'Ciências',
      4: 'História',
      5: 'Geografia',
      6: 'Artes',
      7: 'Educação Física',
      8: 'Inglês'
    };
    return subjects[subjectId] || `Matéria ${subjectId}`;
  }

  function getSubjectColor(subjectName) {
    const colors = {
      'Matemática': 'bg-blue-100 text-blue-700',
      'Português': 'bg-red-100 text-red-700',
      'Ciências': 'bg-green-100 text-green-700',
      'História': 'bg-amber-100 text-amber-700',
      'Geografia': 'bg-purple-100 text-purple-700',
      'Artes': 'bg-pink-100 text-pink-700',
      'Educação Física': 'bg-orange-100 text-orange-700',
      'Inglês': 'bg-indigo-100 text-indigo-700'
    };
    return colors[subjectName] || 'bg-gray-100 text-gray-700';
  }

  // Carregar habilidades existentes da ficha quando fichaId muda
  useEffect(() => {
    if (fichaId) {
      loadExistingSkills();
    } else {
      setExistingSkills([]);
    }
  }, [fichaId]);

  // Load skills when modal opens or serie/bimestre changes
  useEffect(() => {
    if (isModalOpen && selectedSerie && selectedBimestre) {
      loadSkills();
    }
  }, [isModalOpen, selectedSerie, selectedBimestre]);

  // Filter skills based on search query and active filters
  useEffect(() => {
    if (skills.length > 0) {
      let filtered = [...skills];
      
      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(skill => 
          skill.descricao.toLowerCase().includes(query)
        );
      }
      
      // Apply subject filters
      const activeSubjectFilters = Object.keys(activeFilters).filter(key => activeFilters[key]);
      if (activeSubjectFilters.length > 0) {
        filtered = filtered.filter(skill => {
          const subjectName = getSubjectName(skill.materia_id);
          return activeSubjectFilters.includes(subjectName);
        });
      }
      
      setFilteredSkills(filtered);
    }
  }, [skills, searchQuery, activeFilters]);

  const loadExistingSkills = async () => {
    if (!fichaId) return;
    
    try {
      console.log('Carregando habilidades existentes para ficha:', fichaId);
      const response = await consultarHabilidadesDaFicha(fichaId);
      
      if (response && response.status && response.listaDeHabilidadesDaFicha) {
        console.log('Habilidades existentes carregadas:', response.listaDeHabilidadesDaFicha);
        setExistingSkills(response.listaDeHabilidadesDaFicha);
      } else {
        console.log('Nenhuma habilidade existente encontrada');
        setExistingSkills([]);
      }
    } catch (error) {
      console.error('Erro ao carregar habilidades existentes:', error);
      setExistingSkills([]);
    }
  };

  const loadSkills = () => {
    setLoading(true);
    setError(null);
    
    const params = {
      serieId: selectedSerie.serieId,
      bimestreId: selectedBimestre.bimestre_id
    };
    
    buscarHabilidadesSer(params.serieId)
      .then(response => {
        if (response && response.status && response.listaDeHabilidades) {
          setSkills(response.listaDeHabilidades);
          setFilteredSkills(response.listaDeHabilidades);
          
          // Initialize filters based on available subjects
          const subjects = {};
          response.listaDeHabilidades.forEach(skill => {
            const subjectName = getSubjectName(skill.materia_id);
            subjects[subjectName] = false;
          });
          setActiveFilters(subjects);
        } else {
          setError('Não foi possível carregar as habilidades.');
          setSkills([]);
          setFilteredSkills([]);
        }
      })
      .catch(err => {
        console.error('Erro ao carregar habilidades:', err);
        setError('Erro ao carregar habilidades. Tente novamente.');
        setSkills([]);
        setFilteredSkills([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Verificar se uma habilidade já existe na ficha
  const isSkillExisting = (skill) => {
    return existingSkills.some(existing => 
      existing.habilidadesDaFicha_habilidades_id === skill.cod
    );
  };

  // Verificar se uma habilidade está selecionada (incluindo existentes)
  const isSkillSelected = (skill) => {
    return selectedSkills.some(s => s.cod === skill.cod) || isSkillExisting(skill);
  };

  const handleToggleSkill = (skill) => {
    // Não permitir alteração de habilidades já existentes na ficha
    if (isSkillExisting(skill)) {
      return;
    }

    const isSelected = selectedSkills.some(s => s.cod === skill.cod);
    let updatedSkills;
    
    if (isSelected) {
      updatedSkills = selectedSkills.filter(s => s.cod !== skill.cod);
    } else {
      updatedSkills = [...selectedSkills, skill];
    }
    
    onSkillsChange(updatedSkills);
  };

  const handleToggleFilter = (subjectName) => {
    setActiveFilters(prev => ({
      ...prev,
      [subjectName]: !prev[subjectName]
    }));
  };

  const clearFilters = () => {
    const resetFilters = {};
    Object.keys(activeFilters).forEach(key => {
      resetFilters[key] = false;
    });
    setActiveFilters(resetFilters);
    setSearchQuery('');
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Contar total de habilidades (selecionadas + existentes)
  const totalSelectedSkills = selectedSkills.length + existingSkills.length;

  return (
    <div>
      <div className="mb-2 flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Habilidades
        </label>
        {totalSelectedSkills > 0 && (
          <div className="flex items-center gap-2 text-sm">
            {existingSkills.length > 0 && (
              <span className="text-gray-600 font-medium">
                {existingSkills.length} já cadastrada{existingSkills.length !== 1 ? 's' : ''}
              </span>
            )}
            {selectedSkills.length > 0 && (
              <span className="text-blue-600 font-medium">
                {selectedSkills.length} nova{selectedSkills.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="mb-3">
        <Button 
          onClick={() => setIsModalOpen(true)}
          variant={totalSelectedSkills > 0 ? 'primary' : 'outline'}
          icon={<CheckSquare size={18} />}
        >
          {totalSelectedSkills > 0 
            ? `${totalSelectedSkills} Habilidade${totalSelectedSkills !== 1 ? 's' : ''} Total` 
            : 'Selecionar Habilidades'}
        </Button>
      </div>
      
      {(selectedSkills.length > 0 || existingSkills.length > 0) && (
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-4">
          <div className="space-y-3">
            {/* Habilidades já cadastradas na ficha */}
            {existingSkills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={14} className="text-gray-500" />
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Já cadastradas na ficha
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {existingSkills.map(existing => {
                    // Encontrar a habilidade completa na lista de skills
                    const fullSkill = skills.find(s => s.cod === existing.habilidadesDaFicha_habilidades_id);
                    if (!fullSkill) return null;
                    
                    const subjectName = getSubjectName(fullSkill.materia_id);
                    
                    return (
                      <motion.div
                        key={existing.habilidadesDaFicha_id}
                        layout
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm flex items-center gap-1 max-w-full border-2 border-gray-300"
                      >
                        <Lock size={12} className="text-gray-500 flex-shrink-0" />
                        <span className="truncate">{fullSkill.descricao}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Habilidades selecionadas (novas) */}
            {selectedSkills.length > 0 && (
              <div>
                {existingSkills.length > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                      Novas habilidades
                    </span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map(skill => {
                    const subjectName = getSubjectName(skill.materia_id);
                    const colorClass = getSubjectColor(subjectName);
                    
                    return (
                      <motion.div
                        key={skill.cod}
                        layout
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className={`${colorClass} px-2 py-1 rounded-md text-sm flex items-center gap-1 max-w-full`}
                      >
                        <span className="truncate">{skill.descricao}</span>
                        <button
                          onClick={() => handleToggleSkill(skill)}
                          className="text-current hover:text-gray-700 flex-shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title="Selecionar Habilidades"
        size="xl"
      >
        <div className="space-y-4">
          {/* Informações sobre habilidades existentes */}
          {existingSkills.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center gap-2 mb-1">
                <Lock size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  {existingSkills.length} habilidade{existingSkills.length !== 1 ? 's' : ''} já cadastrada{existingSkills.length !== 1 ? 's' : ''} nesta ficha
                </span>
              </div>
              <p className="text-xs text-blue-600">
                As habilidades já cadastradas aparecem bloqueadas e não podem ser removidas.
              </p>
            </div>
          )}

          {/* Search and filter bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar habilidades..."
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X size={18} className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            
            <div className="relative">
              <Button
                variant="outline"
                icon={<Filter size={18} />}
                onClick={() => {}}
                className="w-full sm:w-auto"
              >
                Filtrar
                {Object.values(activeFilters).some(Boolean) && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {Object.values(activeFilters).filter(Boolean).length}
                  </span>
                )}
              </Button>
            </div>
          </div>
          
          {/* Filter chips */}
          {Object.values(activeFilters).some(Boolean) && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeFilters)
                .filter(([_, isActive]) => isActive)
                .map(([subject]) => (
                  <div 
                    key={subject}
                    className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                  >
                    <span>{subject}</span>
                    <button
                      onClick={() => handleToggleFilter(subject)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              <button
                onClick={clearFilters}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                Limpar todos
              </button>
            </div>
          )}

          {/* Skills list by subject */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : filteredSkills.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              {searchQuery ? 'Nenhuma habilidade encontrada para esta busca.' : 'Nenhuma habilidade disponível.'}
            </div>
          ) : (
            <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
              {Object.entries(skillsBySubject).map(([subject, subjectSkills]) => (
                <div key={subject} className="space-y-2">
                  <div className={`flex items-center gap-2 ${getSubjectColor(subject)} px-3 py-2 rounded-md sticky top-0 z-10`}>
                    <Book size={18} />
                    <h3 className="text-base font-medium">
                      {subject} ({subjectSkills.length})
                    </h3>
                  </div>
                  
                  <div className="space-y-2 pl-2">
                    {subjectSkills.map((skill) => {
                      const isSelected = isSkillSelected(skill);
                      const isExisting = isSkillExisting(skill);
                      
                      return (
                        <motion.div
                          key={skill.cod}
                          whileHover={!isExisting ? { scale: 1.01 } : {}}
                          whileTap={!isExisting ? { scale: 0.99 } : {}}
                          onClick={() => handleToggleSkill(skill)}
                          className={`p-3 rounded-lg border transition-colors ${
                            isSelected
                              ? isExisting 
                                ? 'bg-gray-100 border-gray-400' // Habilidade já existente
                                : 'bg-blue-50 border-blue-300' // Habilidade selecionada nova
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          } ${
                            isExisting ? 'cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`p-2 rounded-md mr-3 flex items-center justify-center ${
                              isSelected 
                                ? isExisting 
                                  ? 'bg-gray-200' 
                                  : 'bg-blue-200'
                                : 'bg-gray-100'
                            }`}>
                              {isExisting ? (
                                <Lock 
                                  size={18} 
                                  className="text-gray-500" 
                                />
                              ) : (
                                <CheckSquare 
                                  size={18} 
                                  className={isSelected ? 'text-blue-600' : 'text-gray-400'}
                                  fill={isSelected ? 'currentColor' : 'none'}
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <p className={`text-sm ${
                                  isExisting ? 'text-gray-600' : 'text-gray-800'
                                }`}>
                                  {skill.descricao}
                                </p>
                                {isExisting && (
                                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                                    Já cadastrada
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 flex items-center gap-2">
                                <span className="text-xs text-gray-500">Código: {skill.cod}</span>
                                <span className={`text-xs px-1.5 py-0.5 rounded ${getSubjectColor(subject)}`}>
                                  {subject}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Fixed footer with buttons */}
          <div className="flex justify-between items-center pt-4 border-t bg-white sticky bottom-0">
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <div className="flex items-center gap-3">
              {selectedSkills.length > 0 && (
                <span className="text-sm text-gray-600">
                  {selectedSkills.length} nova{selectedSkills.length !== 1 ? 's' : ''} habilidade{selectedSkills.length !== 1 ? 's' : ''}
                </span>
              )}
              <Button
                variant="primary"
                onClick={handleConfirm}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SkillSelector;