import React, { useState, useEffect } from 'react';
import { Check, Save, X, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';
import SeriesSelector from './SeriesSelector';
import BimestreSelector from './BimestreSelector';
import SkillSelector from './SkillSelector';
import { gravarFicha, alterarFicha, consultarFicha } from '../service/serviceFicha';
import { Toaster, toast } from "react-hot-toast";
import { incluirHabilidadeDaFicha } from '../service/serviceHabilidadesDaFicha.js';
import { consultarHabilidadesDaFicha } from "../service/serviceHabilidadesDaFicha.js";

const FichaForm = ({ onFichaSaved, editingFicha = null, onCancelEdit = () => { } }) => {
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [selectedBimestre, setSelectedBimestre] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFichaId, setCurrentFichaId] = useState(null);
  const [showSkillSelector, setShowSkillSelector] = useState(false);
  const [existingFichas, setExistingFichas] = useState([]);

  useEffect(() => {
    loadExistingFichas();
  }, []);

  useEffect(() => {
    if (editingFicha) {
      console.log('Loading editing ficha:', editingFicha);

      setSelectedSerie({
        serieId: editingFicha.ficha_bimestre_serie_id,
        serieNum: 0,
        serieDescr: editingFicha.serieDescr || `Série ${editingFicha.ficha_bimestre_serie_id}`
      });

      setSelectedBimestre({
        bimestre_id: editingFicha.ficha_bimestre_id,
        bimestre_anoletivo_id: editingFicha.ficha_bimestre_anoLetivo_id
      });

      setIsEditing(true);
      setCurrentFichaId(editingFicha.ficha_id);
      setShowSkillSelector(false);
      console.log('Ficha ID set:', editingFicha.ficha_id);
    } else {
      resetForm();
    }
  }, [editingFicha]);

  const loadExistingFichas = async () => {
    try {
      const response = await consultarFicha();
      if (response && response.listaDeFichas) {
        setExistingFichas(response.listaDeFichas);
      }
    } catch (error) {
      console.error('Erro ao carregar fichas existentes:', error);
    }
  };

  const resetForm = () => {
    setSelectedSerie(null);
    setSelectedBimestre(null);
    setSelectedSkills([]);
    setIsEditing(false);
    setCurrentFichaId(null);
    setShowSkillSelector(false);
    setSuccess(false);
    setError(null);
  };

  const validateFicha = async () => {
    if (!selectedSerie || !selectedBimestre) {
      setError('Por favor, selecione a série e o bimestre.');
      return false;
    }

    // Sempre recarregar a lista antes de validar para garantir dados atualizados
    console.log('Recarregando lista de fichas para validação...');
    await loadExistingFichas();

    // Buscar também direto da API para garantir dados mais frescos
    try {
      const response = await consultarFicha();
      const fichasAtualizadas = response && response.listaDeFichas ? response.listaDeFichas : existingFichas;
      
      const duplicateFicha = fichasAtualizadas.find(ficha =>
        ficha.ficha_bimestre_serie_id === selectedSerie.serieId &&
        ficha.ficha_bimestre_id === selectedBimestre.bimestre_id &&
        (!isEditing || ficha.ficha_id !== editingFicha?.ficha_id)
      );

      if (duplicateFicha) {
        console.log('Ficha duplicada encontrada:', duplicateFicha);
        setError('Já existe uma ficha cadastrada para esta série e bimestre.');
        toast.error("Combinação de série e bimestre já existe");
        return false;
      }

      console.log('Validação passou - nenhuma duplicata encontrada');
      return true;
    } catch (error) {
      console.error('Erro ao validar ficha:', error);
      // Se houver erro na consulta, usar a lista local como fallback
      const duplicateFicha = existingFichas.find(ficha =>
        ficha.ficha_bimestre_serie_id === selectedSerie.serieId &&
        ficha.ficha_bimestre_id === selectedBimestre.bimestre_id &&
        (!isEditing || ficha.ficha_id !== editingFicha?.ficha_id)
      );

      if (duplicateFicha) {
        setError('Já existe uma ficha cadastrada para esta série e bimestre.');
        toast.error("Combinação de série e bimestre já existe");
        return false;
      }

      return true;
    }
  };

  async function existeRegistroHab(idFicha, habFicha) {
    const lista = await consultarHabilidadesDaFicha(idFicha);
    console.log("CARAII DE FICHA:", lista);

    if (lista.status) {
      let i = 0;
      while (
        i < lista.listaDeHabilidadesDaFicha.length &&
        (
          lista.listaDeHabilidadesDaFicha[i].habilidadesDaFicha_habilidades_id !== habFicha.habilidadesDaFicha_habilidades_id ||
          lista.listaDeHabilidadesDaFicha[i].habilidadesDaFicha_ficha_id !== habFicha.habilidadesDaFicha_ficha_id
        )
      ) {
        i++;
      }
      console.log("RETORNO TEM QUE SER TRUE CARAIOOO", i < lista.listaDeHabilidadesDaFicha.length);
      return i < lista.listaDeHabilidadesDaFicha.length;
    } else {
      return false;
    }
  }

  const handleSave = async () => {
    const isValid = await validateFicha();
    if (!isValid) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const fichaData = {
        ficha_id: isEditing ? editingFicha.ficha_id : 0,
        ficha_bimestre_id: selectedBimestre.bimestre_id,
        ficha_bimestre_anoLetivo_id: selectedBimestre.bimestre_anoletivo_id,
        ficha_bimestre_serie_id: selectedSerie.serieId
      };

      console.log('Saving ficha:', fichaData);

      const response = await (isEditing ? alterarFicha(fichaData) : gravarFicha(fichaData));

      console.log('Save response:', response);

      if (response && response.status) {
        // Correção principal: buscar o ID da ficha criada
        let fichaId;
        
        if (isEditing) {
          fichaId = editingFicha.ficha_id;
        } else {
          // Para nova ficha, extrair o ID da resposta
          console.log('Resposta completa da API:', response);
          
          // Tentar diferentes propriedades que podem conter o ID
          fichaId = response.ficha_id || response.id || response.insertId || response.fichaId;
          
          // Se não encontrou o ID na resposta, recarregar e buscar na lista
          if (!fichaId) {
            console.log('ID não encontrado na resposta, buscando na lista...');
            await loadExistingFichas();
            
            // Buscar a ficha recém-criada
            const fichasAtualizadas = await consultarFicha();
            if (fichasAtualizadas && fichasAtualizadas.listaDeFichas) {
              const novaFicha = fichasAtualizadas.listaDeFichas.find(ficha =>
                ficha.ficha_bimestre_serie_id === selectedSerie.serieId &&
                ficha.ficha_bimestre_id === selectedBimestre.bimestre_id
              );
              fichaId = novaFicha?.ficha_id;
              console.log('Ficha encontrada na lista:', novaFicha);
            }
          }
          
          // Se ainda não encontrou, tentar propriedades aninhadas
          if (!fichaId && response.data) {
            fichaId = response.data.ficha_id || response.data.id || response.data.insertId;
          }
          
          // Última tentativa: verificar se há alguma propriedade numérica
          if (!fichaId) {
            console.log('Todas as propriedades da resposta:', Object.keys(response));
            for (const key of Object.keys(response)) {
              const value = response[key];
              if (typeof value === 'number' && value > 0 && key.toLowerCase().includes('id')) {
                console.log(`Possível ID encontrado em ${key}:`, value);
                fichaId = value;
                break;
              }
            }
          }
        }

        console.log('Ficha ID determinado:', fichaId);

        if (fichaId) {
          // Definir o currentFichaId ANTES de processar as habilidades
          setCurrentFichaId(fichaId);
          setSuccess(true);

          // Processar habilidades se existirem
          if (selectedSkills && selectedSkills.length > 0) {
            console.log('Processando habilidades para ficha ID:', fichaId);
            
            for (let i = 0; i < selectedSkills.length; i++) {
              let objetoHabFicha = {
                "habilidadesDaFicha_id": 0,
                "habilidadesDaFicha_habilidades_id": selectedSkills[i].cod,
                "habilidadesDaFicha_ficha_id": fichaId
              };
              
              console.log("Processando habilidade: ", objetoHabFicha);
              
              let existe = await existeRegistroHab(fichaId, objetoHabFicha);
              if (!existe) {
                await incluirHabilidadeDaFicha(objetoHabFicha);
                console.log("Habilidade incluída:", objetoHabFicha);
              } else {
                console.log("Habilidade já existe:", objetoHabFicha);
              }
            }
          }

          toast.success(isEditing ? "Ficha atualizada com sucesso!" : "Ficha criada com sucesso!");
          await loadExistingFichas();
          
          // Criar objeto completo da ficha para retornar
          const fichaCompleta = {
            ...response,
            ficha_id: fichaId,
            ficha_bimestre_id: selectedBimestre.bimestre_id,
            ficha_bimestre_anoLetivo_id: selectedBimestre.bimestre_anoletivo_id,
            ficha_bimestre_serie_id: selectedSerie.serieId,
            serieDescr: selectedSerie.serieDescr
          };

          onFichaSaved(fichaCompleta);
          console.log('Ficha saved with ID:', fichaId);
          console.log('Ficha completa retornada:', fichaCompleta);

          // Reset do formulário após 2 segundos se não estiver editando
          if (!isEditing) {
            setTimeout(() => {
              console.log('Resetando formulário após criação da ficha...');
              resetForm();
            }, 2000);
          }

        } else {
          throw new Error('ID da ficha não pôde ser determinado');
        }
      } else {
        throw new Error(response?.mensagem || 'Erro ao salvar ficha');
      }
    } catch (error) {
      console.error('Erro ao salvar ficha:', error);
      setError('Erro ao salvar a ficha. Tente novamente.');
      toast.error(error.message || "Erro ao salvar ficha");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    onCancelEdit();
  };

  const handleSkillsChange = (skills) => {
    console.log("Habilidades selecionadas: ", skills);
    setSelectedSkills(skills);
  };

  const handleToggleSkillSelector = () => {
    console.log('Toggle skill selector - Current ficha ID:', currentFichaId);

    if (!currentFichaId) {
      toast.error("É necessário salvar a ficha antes de gerenciar habilidades");
      return;
    }

    setShowSkillSelector(!showSkillSelector);
    console.log('Skill selector toggled to:', !showSkillSelector);
  };

  const canShowSkillButton = currentFichaId && selectedSerie;
  const canShowSkillSelector = showSkillSelector && currentFichaId && selectedSerie;

  console.log('Render - currentFichaId:', currentFichaId, 'canShowSkillButton:', canShowSkillButton, 'showSkillSelector:', showSkillSelector);

  return (
    <>
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-xl shadow-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Editar Ficha' : 'Nova Ficha'}
          </h2>
          {isEditing && (
            <Button
              variant="danger"
              size="sm"
              icon={<X size={18} />}
              onClick={handleCancelEdit}
            >
              Cancelar
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Série
            </label>
            <SeriesSelector
              selectedSerie={selectedSerie}
              onSelectSerie={setSelectedSerie}
              disabled={isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bimestre
            </label>
            <BimestreSelector
              selectedBimestre={selectedBimestre}
              onSelectBimestre={setSelectedBimestre}
              disabled={isEditing}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <div>
              {canShowSkillButton && (
                <Button
                  onClick={handleToggleSkillSelector}
                  icon={showSkillSelector ? <Minus size={18} /> : <Plus size={18} />}
                  variant="outline"
                >
                  {showSkillSelector ? 'Ocultar Habilidades' : 'Gerenciar Habilidades'}
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={saving || !selectedSerie || !selectedBimestre}
                icon={success ? <Check size={18} /> : <Save size={18} />}
                variant={success ? 'success' : 'primary'}
              >
                {saving ? 'Salvando...' : success ? 'Salvo!' : isEditing ? 'Salvar Alterações' : 'Criar Ficha'}
              </Button>
            </div>
          </div>

          {canShowSkillSelector && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t"
            >
              <SkillSelector
                key={`skills-${currentFichaId}`}
                selectedSerie={selectedSerie}
                selectedBimestre={selectedBimestre}
                selectedSkills={selectedSkills}
                onSkillsChange={handleSkillsChange}
                fichaId={currentFichaId}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default FichaForm;