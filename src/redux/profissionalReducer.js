import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ESTADO from "./estados.js";
import { gravarProfissional,alterarProfissional,excluirProfissional,consultarProfissional , consultarProfissionalSemAlunos} from "../service/serviceProfissional.js";


export const buscarProfissionais = createAsyncThunk('buscarProfissionais', async (termo) => {
  const resultado = await consultarProfissional(termo);
  try {
    if (Array.isArray(resultado)) {
      return {
        "status": true,
        "mensagem": "Profissionais recuperadas com sucesso",
        "listaDeProfissionais": resultado
      };
    } else {
      return {
        "status": false,
        "mensagem": "Erro ao recuperar as profissionals do backend",
        "listaDeProfissionais": []
      };
    }
  } catch (erro) {
    return {
      "status": false,
      "mensagem": "Erro: " + erro.message,
      "listaDeProfissionais": []
    };
  }
});

export const apagarProfissional = createAsyncThunk('apagarProfissional', async (profissional) => {
  const resultado = await excluirProfissional(profissional);
  try {
    return {
      "status": resultado.status,
      "mensagem": resultado.mensagem,
      "profissional_rn": profissional.profissional_rn
    };
  } catch (erro) {
    return {
      "status": false,
      "mensagem": "Erro: " + erro.message,
    };
  }
});

export const incluirProfissional = createAsyncThunk('incluirProfissional', async (profissional) => {
  try {
    const resultado = await gravarProfissional(profissional);
    if (resultado.status) {
      return {
        "status": resultado.status,
        "mensagem": resultado.mensagem,
        "profissional": profissional
      };
    } else {
      return {
        "status": resultado.status,
        "mensagem": resultado.mensagem,
      };
    }
  } catch (erro) {
    return {
      "status": false,
      "mensagem": "Erro: " + erro.message,
    };
  }
});

export const atualizarProfissional = createAsyncThunk('atualizarProfissional', async (profissional) => {
  try {
    const resultado = await alterarProfissional(profissional);
    if (resultado.status) {
      return {
        "status": resultado.status,
        "mensagem": resultado.mensagem,
        "profissional": profissional
      };
    } else {
      return {
        "status": resultado.status,
        "mensagem": resultado.mensagem,
      };
    }
  } catch (erro) {
    return {
      "status": false,
      "mensagem": "Erro: " + erro.message,
    };
  }
});

const profissionalSlice = createSlice({
  name: "profissional",
  initialState: {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    listaDeProfissionais: [],
    inserido: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscarProfissionais.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (buscando profissionals)";
      })
      .addCase(buscarProfissionais.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
        } else {
          state.estado = ESTADO.ERRO;
        }
        state.mensagem = action.payload.mensagem;
        state.listaDeProfissionais = action.payload.listaDeProfissionais;
      })
      .addCase(buscarProfissionais.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
        state.listaDeProfissionais = [];
      })
      .addCase(apagarProfissional.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (excluindo a profissional do backend)";
      })
      .addCase(apagarProfissional.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaDeProfissionais = state.listaDeProfissionais.filter((profissional) => profissional.profissional_rn !== action.payload.profissional_rn);
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(apagarProfissional.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
      })
      .addCase(incluirProfissional.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando a requisição (inclusão da profissional no backend)";
      })
      .addCase(incluirProfissional.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.inserido = true;
          state.listaDeProfissionais.push(action.payload.profissional);
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(incluirProfissional.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
      })
      .addCase(atualizarProfissional.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando a requisição (Atualização da profissional no backend)";
      })
      .addCase(atualizarProfissional.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaDeProfissionais = state.listaDeProfissionais.map((item) => 
            item.profissional_rn === action.payload.profissional.profissional_rn ? action.payload.profissional : item
          );
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(atualizarProfissional.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
      });
  }
});

export default profissionalSlice.reducer;