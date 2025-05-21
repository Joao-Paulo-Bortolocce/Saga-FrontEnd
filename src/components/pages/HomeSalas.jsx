import { useState, useEffect } from 'react';
import Page from '../layouts/Page.jsx';
import TabelaSalas from './tabelas/TabelaSalas.jsx';
import CadastrarSala from './cadastros/CadastroSalas.jsx';

export default function App() {
  const [sala, setSala] = useState({
    id: 0,
    ncarteiras: 0,
    descr: ""
  });
  const [salaEdicao, setSalaEdicao] = useState(false);
  const [exibirTabela, setExibirTabela] = useState(true);

  return (
      <div className='min-h-screen flex flex-col'>
        <div className='h-1/10'>
          <Page/>
        </div>
        <div className='h-9/10'>
          {exibirTabela ? (
            <TabelaSalas
              setExibirTabela={setExibirTabela}
              setSalaEdicao={setSalaEdicao}
              setSalas={setSala}
            />
          ) : (
            <CadastrarSala
              setExibirTabela={setExibirTabela}
              setSalaEdicao={setSalaEdicao}
              salaEdicao={salaEdicao}
              sala={sala}
              setSala = {setSala}
            />
          )}
        </div>        
      </div>
  );
}