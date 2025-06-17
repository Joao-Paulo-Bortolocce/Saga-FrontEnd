import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ESTADO from "./estados.js";
import { consultarMateria, gravarMateria, alterarMateria, excluirMateria } from "../service/serviceMateria.js";

export const buscarMaterias = createAsyncThunk('buscarMaterias', async (termo) => {
  try {
    const resultado = await consultarMateria(termo);
    if (Array.isArray(resultado.listaDeMaterias)) {
      return {
        status: true,
        mensagem: "Matérias recuperadas com sucesso",
        listaDeMaterias: resultado.listaDeMaterias
      };
    } else {
      return {
        status: false,
        mensagem: "Erro ao recuperar as matérias do backend",
        listaDeMaterias: []
      };
    }
  } catch (erro) {
    return {
      status: false,
      mensagem: "Erro: " + erro.message,
      listaDeMaterias: []
    };
  }
});

export const incluirMateria = createAsyncThunk('incluirMateria', async (materia) => {
  try {
    const resultado = await gravarMateria(materia);
    return {
      status: resultado.status,
      mensagem: resultado.mensagem,
      materia: materia
    };
  } catch (erro) {
    return {
      status: false,
      mensagem: "Erro: " + erro.message
    };
  }
});

export const atualizarMateria = createAsyncThunk('atualizarMateria', async (materia) => {
  try {
    const resultado = await alterarMateria(materia);
    return {
      status: resultado.status,
      mensagem: resultado.mensagem,
      materia: materia
    };
  } catch (erro) {
    return {
      status: false,
      mensagem: "Erro: " + erro.message
    };
  }
});

export const apagarMateria = createAsyncThunk('apagarMateria', async (materia) => {
  try {
    const resultado = await excluirMateria(materia);
    return {
      status: resultado.status,
      mensagem: resultado.mensagem,
      id: materia.id
    };
  } catch (erro) {
    return {
      status: false,
      mensagem: "Erro: " + erro.message
    };
  }
});

const materiaSlice = createSlice({
  name: "materia",
  initialState: {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    listaDeMaterias: [],
    inserido: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscarMaterias.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (buscando matérias)";
      })
      .addCase(buscarMaterias.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
        } else {
          state.estado = ESTADO.ERRO;
        }
        state.mensagem = action.payload.mensagem;
        state.listaDeMaterias = action.payload.listaDeMaterias;
      })
      .addCase(buscarMaterias.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao buscar matérias";
        state.listaDeMaterias = [];
      })
      .addCase(incluirMateria.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando a requisição (inclusão da matéria no backend)";
      })
      .addCase(incluirMateria.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.inserido = true;
          state.listaDeMaterias.push(action.payload.materia);
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(incluirMateria.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao incluir matéria";
      })
      .addCase(atualizarMateria.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (atualização da matéria)";
      })
      .addCase(atualizarMateria.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaDeMaterias = state.listaDeMaterias.map((m) =>
            m.id === action.payload.materia.id ? action.payload.materia : m
          );
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(atualizarMateria.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao atualizar matéria";
      })
      .addCase(apagarMateria.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (exclusão da matéria)";
      })
      .addCase(apagarMateria.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaDeMaterias = state.listaDeMaterias.filter((m) => m.id !== action.payload.id);
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(apagarMateria.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao excluir matéria";
      });
  }
});

export default materiaSlice.reducer;
