import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Library } from 'lucide-react';
import FichaForm from '../FichaForm';
import FichaList from '../FichaList';
import { consultarFicha, excluirFicha } from '../../service/serviceFicha';
import AlertDialog from '../AlertDialog';
import imagemFundoPrefeitura from "../../assets/images/imagemFundoPrefeitura.png"
import { useNavigate } from 'react-router-dom';

function FichaMontagem() {
  const [fichas, setFichas] = useState([]);
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

  const loadFichas = () => {
    setLoading(true);
    setError(null);

    consultarFicha()
      .then(response => {
        if (response && response.listaDeFichas && Array.isArray(response.listaDeFichas)) {
          setFichas(response.listaDeFichas);
        } else {
          setFichas([]);
          if (response === "Não existem fichas cadastradas") {
            setError("Não existem fichas cadastradas");
          } else {
            setError("Formato de resposta inválido");
            console.error("Resposta inválida:", response);
          }
        }
      })
      .catch(err => {
        console.error("Erro ao carregar fichas:", err);
        setError("Erro ao carregar as fichas");
        setFichas([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFichaSaved = (savedFicha) => {
    loadFichas();
    setEditingFicha(null);
    showSuccessMessage(editingFicha ? 'Ficha atualizada com sucesso!' : 'Ficha criada com sucesso!');
  };

  const handleEditFicha = (ficha) => {
    setEditingFicha(ficha);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRequest = (ficha) => {
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
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow-md"
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