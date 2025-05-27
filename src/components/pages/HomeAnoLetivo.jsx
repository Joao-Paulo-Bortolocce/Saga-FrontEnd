import { useState } from 'react';
import Page from '../layouts/Page.jsx';
import TabelaAnoLetivo from './tabelas/TabelaAnoLetivo.jsx';
import CadastroAnoLetivo from './cadastros/CadastroAnoLetivo.jsx';

export default function HomeAnoLetivo() {
  const [anoLetivo, setAnoLetivo] = useState({
    id: 0,
    inicio: "",
    fim: ""
  });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [exibirTabela, setExibirTabela] = useState(true);

  return (
      <div className='min-h-screen flex flex-col'>
        <div className='h-1/10'>
          <Page/>
        </div>
        <div className='h-9/10'>
          {exibirTabela ? (
            <TabelaAnoLetivo
              setExibirTabela={setExibirTabela}
              setModoEdicao={setModoEdicao}
              setAnoLetivo={setAnoLetivo}
            />
          ) : (
            <CadastroAnoLetivo
              setExibirTabela={setExibirTabela}
              setModoEdicao={setModoEdicao}
              modoEdicao={modoEdicao}
              anoLetivo={anoLetivo}
              setAnoLetivo = {setAnoLetivo}
            />
          )}
        </div>        
      </div>
  );
}
