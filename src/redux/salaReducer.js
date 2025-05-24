import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ESTADO from "./estados.js";
import { gravarSala, alterarSala, excluirSala, consultarSala } from "../service/servicoSalas.js";

export const buscarSalas = createAsyncThunk('buscarSalas', async (termo) => {
  const resultado = await consultarSala(termo);
  try {
    if (Array.isArray(resultado)) {
      return {
        status: true,
        mensagem: "Salas recuperadas com sucesso",
        listaSalas: resultado
      };
    } else {
      return {
        status: false,
        mensagem: "Erro ao recuperar as salas do backend",
        listaSalas: []
      };
    }
  } catch (erro) {
    return {
      status: false,
      mensagem: "Erro: " + erro.message,
      listaSalas: []
    };
  }
});

export const apagarSalas = createAsyncThunk('apagarSalas', async (sala) => {
  const resultado = await excluirSala(sala);
  try {
    return {
      status: resultado.status,
      mensagem: resultado.mensagem,
      id: sala.id
    };
  } catch (erro) {
    return {
      status: false,
      mensagem: "Erro: " + erro.message
    };
  }
});

export const incluirSalas = createAsyncThunk('incluirSalas', async (sala) => {
  try {
    const resultado = await gravarSala(sala);
    if (resultado.status) {
      return {
        status: resultado.status,
        mensagem: resultado.mensagem,
        sala: sala
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

export const atualizarSalas = createAsyncThunk('atualizarSalas', async (sala) => {
  try {
    const resultado = await alterarSala(sala.id, sala);
    if (resultado.status) {
      return {
        status: resultado.status,
        mensagem: resultado.mensagem,
        sala: sala
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

const salaSlice = createSlice({
  name: "sala",
  initialState: {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    listaSalas: [],
    inserido: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscarSalas.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (buscando salas)";
      })
      .addCase(buscarSalas.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaSalas = action.payload.listaSalas;
        } else {
          state.estado = ESTADO.ERRO;
          state.listaSalas = [];
        }
        state.mensagem = action.payload.mensagem;
      })
      .addCase(buscarSalas.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao buscar salas.";
        state.listaSalas = [];
      })
      .addCase(apagarSalas.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (excluindo a sala do backend)";
      })
      .addCase(apagarSalas.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaSalas = state.listaSalas.filter(
            (sala) => sala.id !== action.payload.id
          );
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(apagarSalas.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao excluir a sala.";
      })
      .addCase(incluirSalas.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando a requisição (inclusão da sala no backend)";
      })
      .addCase(incluirSalas.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.inserido = true;
          state.listaSalas.push(action.payload.sala);
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(incluirSalas.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao incluir a sala.";
      })
      .addCase(atualizarSalas.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando a requisição (atualização da sala no backend)";
      })
      .addCase(atualizarSalas.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaSalas = state.listaSalas.map((item) =>
            item.id === action.payload.sala.id ? action.payload.sala : item
          );
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(atualizarSalas.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao atualizar a sala.";
      });
  }
});

export default salaSlice.reducer;
