import { useState } from 'react';
import TabelaTurmas from './componentes/TabelaTurmas.jsx';
import TurmaSelecionada from './componentes/TurmaSelecionada.jsx';
import Telas from './componentes/Telas.jsx';

export default function App() {
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);

  return (
    <Telas titulo="Cadastro de presença">
      {!turmaSelecionada ? (
        <TabelaTurmas selecionarTurma={setTurmaSelecionada} />
      ) : (
        <TurmaSelecionada turma={turmaSelecionada} voltar={() => setTurmaSelecionada(null)} />
      )}
    </Telas>
  );
}
