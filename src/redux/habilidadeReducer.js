import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ESTADO from "./estados.js";
import {
  incluirHabilidade,
  atualizarHabilidade,
  apagarHabilidade,
  buscarHabilidadesSer
} from "../service/serviceHabilidade.js";

export const buscarHabilidades = createAsyncThunk('buscarHabilidades', async (termo) => {
  try {
    const resultado = await buscarHabilidadesSer(termo);
    if (resultado.status && Array.isArray(resultado.listaDeHabilidades)) {
      return {
        status: true,
        mensagem: "Habilidades recuperadas com sucesso",
        listaDeHabilidades: resultado.listaDeHabilidades
      };
    } else {
      return {
        status: false,
        mensagem: "Erro ao recuperar as habilidades do backend",
        listaDeHabilidades: []
      };
    }
  } catch (erro) {
    return {
      status: false,
      mensagem: "Erro: " + erro.message,
      listaDeHabilidades: []
    };
  }
});

export const incluirHabilidade = createAsyncThunk('incluirHabilidade', async (habilidade) => {
  try {
    const resultado = await incluirHabilidade(habilidade);
    if (resultado.status) {
      return {
        status: true,
        mensagem: resultado.mensagem,
        habilidade
      };
    } else {
      return {
        status: false,
        mensagem: resultado.mensagem
      };
    }
  } catch (erro) {
    return {
      status: false,
      mensagem: "Erro: " + erro.message
    };
  }
});

export const atualizarHabilidade = createAsyncThunk('atualizarHabilidade', async (habilidade) => {
  try {
    const resultado = await atualizarHabilidade(habilidade);
    if (resultado.status) {
      return {
        status: true,
        mensagem: resultado.mensagem,
        habilidade
      };
    } else {
      return {
        status: false,
        mensagem: resultado.mensagem
      };
    }
  } catch (erro) {
    return {
      status: false,
      mensagem: "Erro: " + erro.message
    };
  }
});

export const apagarHabilidade = createAsyncThunk('apagarHabilidade', async (habilidade) => {
  try {
    const resultado = await apagarHabilidade(habilidade);
    return {
      status: resultado.status,
      mensagem: resultado.mensagem,
      cod: habilidade.cod
    };
  } catch (erro) {
    return {
      status: false,
      mensagem: "Erro: " + erro.message
    };
  }
});

const habilidadeSlice = createSlice({
  name: "habilidade",
  initialState: {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    listaDeHabilidades: [],
    inserido: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscarHabilidadesSer.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (buscando habilidades)";
      })
      .addCase(buscarHabilidadesSer.fulfilled, (state, action) => {
        state.estado = action.payload.status ? ESTADO.OCIOSO : ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
        state.listaDeHabilidades = action.payload.listaDeHabilidades;
      })
      .addCase(buscarHabilidadesSer.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao buscar habilidades";
        state.listaDeHabilidades = [];
      })
      .addCase(incluirHabilidade.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando a requisição (inclusão de habilidade)";
      })
      .addCase(incluirHabilidade.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.inserido = true;
          state.listaDeHabilidades.push(action.payload.habilidade);
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(incluirHabilidade.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao incluir habilidade";
      })
      .addCase(atualizarHabilidade.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (atualização de habilidade)";
      })
      .addCase(atualizarHabilidade.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaDeHabilidades = state.listaDeHabilidades.map((item) =>
            item.cod === action.payload.habilidade.cod ? action.payload.habilidade : item
          );
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(atualizarHabilidade.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao atualizar habilidade";
      })
      .addCase(apagarHabilidade.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (exclusão de habilidade)";
      })
      .addCase(apagarHabilidade.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaDeHabilidades = state.listaDeHabilidades.filter(
            (habilidade) => habilidade.cod !== action.payload.cod
          );
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(apagarHabilidade.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao excluir habilidade";
      });
  }
});

export default habilidadeSlice.reducer;
