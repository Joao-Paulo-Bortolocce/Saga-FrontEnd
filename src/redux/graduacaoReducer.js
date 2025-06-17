import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ESTADO from "./estados.js";
import { gravarGraduacao, alterarGraduacao, excluirGraduacao, consultarGraduacao } from "../service/serviceGraduacao.js";

export const buscarGraduacao = createAsyncThunk('buscarGraduacao', async (termo) => {
  const resultado = await consultarGraduacao(termo);
  try {
    if (Array.isArray(resultado)) {
      return {
        status: true,
        mensagem: "Graduações recuperadas com sucesso",
        listaGraduacao: resultado
      };
    } else {
      return {
        status: false,
        mensagem: "Erro ao recuperar as graduações do backend",
        listaGraduacao: []
      };
    }
  } catch (erro) {
    return {
      status: false,
      mensagem: "Erro: " + erro.message,
      listaGraduacao: []
    };
  }
});

export const apagarGraduacao = createAsyncThunk('apagarGraduacao', async (graduacao) => {
  const resultado = await excluirGraduacao(graduacao);
  try {
    return {
      status: resultado.status,
      mensagem: resultado.mensagem,
      id: graduacao.id
    };
  } catch (erro) {
    return {
      status: false,
      mensagem: "Erro: " + erro.message
    };
  }
});

export const incluirGraduacao = createAsyncThunk('incluirGraduacao', async (graduacao) => {
  try {
    const resultado = await gravarGraduacao(graduacao);
    if (resultado.status) {
      return {
        status: resultado.status,
        mensagem: resultado.mensagem,
        graduacao: graduacao
      };
    } else {
      return {
        status: resultado.status,
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

export const atualizarGraduacao = createAsyncThunk('atualizarGraduacao', async (graduacao) => {
  try {
    const resultado = await alterarGraduacao(graduacao);
    if (resultado.status) {
      return {
        status: resultado.status,
        mensagem: resultado.mensagem,
        graduacao: graduacao
      };
    } else {
      return {
        status: resultado.status,
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

const graduacaoSlice = createSlice({
  name: "graduacao",
  initialState: {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    listaGraduacao: [],
    inserido: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscarGraduacao.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (buscando graduações)";
      })
      .addCase(buscarGraduacao.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
        } else {
          state.estado = ESTADO.ERRO;
        }
        state.mensagem = action.payload.mensagem;
        state.listaGraduacao = action.payload.listaGraduacao;
      })
      .addCase(buscarGraduacao.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao buscar graduações.";
        state.listaGraduacao = [];
      })
      .addCase(apagarGraduacao.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (excluindo a graduação do backend)";
      })
      .addCase(apagarGraduacao.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaGraduacao = state.listaGraduacao.filter(
            (graduacao) => graduacao.id !== action.payload.id
          );
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(apagarGraduacao.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao excluir a graduação.";
      })
      .addCase(incluirGraduacao.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando a requisição (inclusão da graduação no backend)";
      })
      .addCase(incluirGraduacao.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.inserido = true;
          state.listaGraduacao.push(action.payload.graduacao);
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(incluirGraduacao.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao incluir a graduação.";
      })
      .addCase(atualizarGraduacao.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando a requisição (atualização da graduação no backend)";
      })
      .addCase(atualizarGraduacao.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaGraduacao = state.listaGraduacao.map((item) =>
            item.id === action.payload.graduacao.id ? action.payload.graduacao : item
          );
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(atualizarGraduacao.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao atualizar a graduação.";
      });
  }
});

export default graduacaoSlice.reducer;
