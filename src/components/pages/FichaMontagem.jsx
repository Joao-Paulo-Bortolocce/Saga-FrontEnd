import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Library } from 'lucide-react';
import FichaForm from '../FichaForm';
import FichaList from '../FichaList';
import { consultarFicha, excluirFicha } from '../../service/serviceFicha';
import { consultarFichaDaMatricula } from '../../service/serviceFichaDaMatricula';
import AlertDialog from '../AlertDialog';
import imagemFundoPrefeitura from "../../assets/images/imagemFundoPrefeitura.png"
import { useNavigate } from 'react-router-dom';

function FichaMontagem() {
  const [fichas, setFichas] = useState([]);
  const [fichasStatus, setFichasStatus] = useState({}); // Para armazenar o status de cada ficha
  const [loading, setLoading] = useState(true);
  const [editingFicha, setEditingFicha] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [error, setError] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState({ open: false, ficha: null });
  const [actionSuccess, setActionSuccess] = useState({ show: false, message: '' });

  const navigate = useNavigate();

  useEffect(() => {
    loadFichas();
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const loadFichas = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await consultarFicha();
      
      if (response && response.listaDeFichas && Array.isArray(response.listaDeFichas)) {
        const fichasData = response.listaDeFichas;
        setFichas(fichasData);
        
        // Carregar status das fichas
        await loadFichasStatus(fichasData);
      } else {
        setFichas([]);
        setFichasStatus({});
        if (response === "Não existem fichas cadastradas") {
          setError("Não existem fichas cadastradas");
        } else {
          setError("Formato de resposta inválido");
          console.error("Resposta inválida:", response);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar fichas:", err);
      setError("Erro ao carregar as fichas");
      setFichas([]);
      setFichasStatus({});
    } finally {
      setLoading(false);
    }
  };

  const loadFichasStatus = async (fichasData) => {
    try {
      // Consultar todas as fichas da matrícula para obter o status
      const fichasDaMatricula = await consultarFichaDaMatricula();
      
      if (Array.isArray(fichasDaMatricula)) {
        const statusMap = {};
        
        // Criar um mapa de status por ficha_id
        fichasDaMatricula.forEach(fichaDaMatricula => {
          const fichaId = fichaDaMatricula.ficha?.ficha_id;
          if (fichaId) {
            // Se já existe um status para esta ficha, manter o mais restritivo (maior número)
            if (!statusMap[fichaId] || fichaDaMatricula.status > statusMap[fichaId]) {
              statusMap[fichaId] = fichaDaMatricula.status;
            }
          }
        });
        
        setFichasStatus(statusMap);
        console.log('Status das fichas carregado:', statusMap);
      }
    } catch (error) {
      console.error('Erro ao carregar status das fichas:', error);
      setFichasStatus({});
    }
  };

  const getFichaStatus = (fichaId) => {
    return fichasStatus[fichaId] || 1; // Default para status 1 (editável)
  };

  const isFichaEditable = (fichaId) => {
    const status = getFichaStatus(fichaId);
    return status === 1; // Só pode editar se status for 1
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return 'Editável';
      case 2:
        return 'Em validação';
      case 3:
        return 'Validado';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return 'bg-green-100 text-green-800';
      case 2:
        return 'bg-yellow-100 text-yellow-800';
      case 3:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFichaSaved = (savedFicha) => {
    loadFichas();
    setEditingFicha(null);
    showSuccessMessage(editingFicha ? 'Ficha atualizada com sucesso!' : 'Ficha criada com sucesso!');
  };

  const handleEditFicha = (ficha) => {
    const isEditable = isFichaEditable(ficha.ficha_id);
    
    if (!isEditable) {
      const status = getFichaStatus(ficha.ficha_id);
      const statusLabel = getStatusLabel(status);
      showErrorMessage(`Esta ficha não pode ser editada porque está com status: ${statusLabel}`);
      return;
    }
    
    setEditingFicha(ficha);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRequest = (ficha) => {
    const isEditable = isFichaEditable(ficha.ficha_id);
    
    if (!isEditable) {
      const status = getFichaStatus(ficha.ficha_id);
      const statusLabel = getStatusLabel(status);
      showErrorMessage(`Esta ficha não pode ser excluída porque está com status: ${statusLabel}`);
      return;
    }
    
    setDeleteAlert({ open: true, ficha });
  };

  const handleDeleteConfirm = () => {
    const fichaToDelete = deleteAlert.ficha;
    if (!fichaToDelete) return;

    setLoading(true);
    excluirFicha(fichaToDelete)
      .then(() => {
        loadFichas();
        showSuccessMessage('Ficha excluída com sucesso!');
      })
      .catch(err => {
        console.error("Erro ao excluir ficha:", err);
        setError("Erro ao excluir a ficha");
      })
      .finally(() => {
        setDeleteAlert({ open: false, ficha: null });
        setLoading(false);
      });
  };

  const handleDeleteCancel = () => {
    setDeleteAlert({ open: false, ficha: null });
  };

  const handleCancelEdit = () => {
    setEditingFicha(null);
  };

  const showSuccessMessage = (message) => {
    setActionSuccess({ show: true, message });
    setTimeout(() => {
      setActionSuccess({ show: false, message: '' });
    }, 3000);
  };

  const showErrorMessage = (message) => {
    setActionSuccess({ show: true, message });
    setTimeout(() => {
      setActionSuccess({ show: false, message: '' });
    }, 5000);
  };

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${imagemFundoPrefeitura})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-indigo-900/50 backdrop-blur-[2px]"></div>
      </div>

      <header className="relative z-10 py-6 px-4 backdrop-blur-sm bg-white/20 border-b border-white/20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: fadeIn ? 1 : 0, y: fadeIn ? 0 : -20 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto justify-center flex items-center gap-3"
        >
          <button onClick={() => {
            navigate("/funcionalidades");
          }}>
            <Library size={32} className="text-white" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Montagem Ficha</h1>
        </motion.div>
      </header>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: fadeIn ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 container mx-auto py-8 px-4"
      >
        {actionSuccess.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`border-l-4 p-4 mb-6 rounded-md shadow-md ${
              actionSuccess.message.includes('não pode') || actionSuccess.message.includes('status')
                ? 'bg-red-100 border-red-500 text-red-700'
                : 'bg-green-100 border-green-500 text-green-700'
            }`}
          >
            <p>{actionSuccess.message}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <FichaForm
              onFichaSaved={handleFichaSaved}
              editingFicha={editingFicha}
              onCancelEdit={handleCancelEdit}
              fichaStatus={editingFicha ? getFichaStatus(editingFicha.ficha_id) : 1}
            />
          </section>

          <section>
            {loading ? (
              <div className="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-xl shadow-lg flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <p className="text-center text-red-500">{error}</p>
              </div>
            ) : (
              <FichaList
                fichas={fichas}
                onEditFicha={handleEditFicha}
                onDeleteFicha={handleDeleteRequest}
                fichasStatus={fichasStatus}
                getStatusLabel={getStatusLabel}
                getStatusColor={getStatusColor}
                isFichaEditable={isFichaEditable}
              />
            )}
          </section>
        </div>
      </motion.main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: fadeIn ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative py-4 px-4 mt-8 backdrop-blur-sm bg-white/10 border-t border-white/20"
      >
        <div className="container mx-auto text-center text-white/70 text-sm">
          Sistema de Administração e Gestão Acadêmica &copy; {new Date().getFullYear()}
        </div>
      </motion.footer>

      <AlertDialog
        isOpen={deleteAlert.open}
        title="Confirmar Exclusão"
        message={`Deseja realmente excluir a ficha ${deleteAlert.ficha?.ficha_id}?`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

export default FichaMontagem;