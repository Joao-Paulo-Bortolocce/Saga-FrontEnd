import { useState } from 'react';
import TabelaTurmas from './componentes/TabelaTurmasChamada.jsx';
import TurmaSelecionada from './componentes/TurmaChamada.jsx';
import Telas from './componentes/Telas.jsx';

export default function App() {
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);

  return (
    <Telas titulo="Tela de Chamada">
      {!turmaSelecionada ? (
        <TabelaTurmas selecionarTurma={setTurmaSelecionada} />
      ) : (
        <TurmaSelecionada turma={turmaSelecionada} voltar={() => setTurmaSelecionada(null)} />
      )}
    </Telas>
  );
}
