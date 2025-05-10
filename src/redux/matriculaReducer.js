import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ESTADO from "./estados.js";
import { gravarMatricula,alterarMatricula,excluirMatricula,consultarMatricula, consultarMatriculaFiltros } from "../service/serviceMatricula.js"


export const buscarMatriculas = createAsyncThunk('buscarMatriculas', async (termo) => {
  const resultado = await consultarMatricula(termo);
  try {
    if (Array.isArray(resultado)) {
      return {
        "status": true,
        "mensagem": "Matriculas recuperadas com sucesso",
        "listaDeMatriculas": resultado
      };
    } else {
      return {
        "status": false,
        "mensagem": "Erro ao recuperar as matriculas do backend",
        "listaDeMatriculas": []
      };
    }
  } catch (erro) {
    return {
      "status": false,
      "mensagem": "Erro: " + erro.message,
      "listaDeMatriculas": []
    };
  }
});

export const buscarMatriculasFiltros = createAsyncThunk('buscarMatriculasFiltros', async (termo) => {
  const resultado = await consultarMatriculaFiltros(termo);
  try {
    if (Array.isArray(resultado)) {
      return {
        "status": true,
        "mensagem": "Matriculas recuperadas com sucesso",
        "listaDeMatriculas": resultado
      };
    } else {
      return {
        "status": false,
        "mensagem": "Erro ao recuperar as matriculas do backend",
        "listaDeMatriculas": []
      };
    }
  } catch (erro) {
    return {
      "status": false,
      "mensagem": "Erro: " + erro.message,
      "listaDeMatriculas": []
    };
  }
});

export const apagarMatricula = createAsyncThunk('apagarMatricula', async (matricula) => {
  const resultado = await excluirMatricula(matricula);
  try {
    return {
      "status": resultado.status,
      "mensagem": resultado.mensagem,
      "id": matricula.id
    };
  } catch (erro) {
    return {
      "status": false,
      "mensagem": "Erro: " + erro.message,
    };
  }
});

export const incluirMatricula = createAsyncThunk('incluirMatricula', async (matricula) => {
  try {
    const resultado = await gravarMatricula(matricula);
    if (resultado.status) {
      return {
        "status": resultado.status,
        "mensagem": resultado.mensagem,
        "matricula": resultado.matricula
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

export const atualizarMatricula = createAsyncThunk('atualizarMatricula', async (matricula) => {
  try {
    const resultado = await alterarMatricula(matricula);
    if (resultado.status) {
      return {
        "status": resultado.status,
        "mensagem": resultado.mensagem,
        "matricula": matricula
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

const matriculaSlice = createSlice({
  name: "matricula",
  initialState: {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    listaDeMatriculas: [],
    inserido: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscarMatriculas.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (buscando matriculas)";
      })
      .addCase(buscarMatriculas.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
        } else {
          state.estado = ESTADO.ERRO;
        }
        state.mensagem = action.payload.mensagem;
        state.listaDeMatriculas = action.payload.listaDeMatriculas;
      })
      .addCase(buscarMatriculas.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
        state.listaDeMatriculas = [];
      })
      .addCase(buscarMatriculasFiltros.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (buscando matriculas com os devidos filtros)";
      })
      .addCase(buscarMatriculasFiltros.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
        } else {
          state.estado = ESTADO.ERRO;
        }
        state.mensagem = action.payload.mensagem;
        state.listaDeMatriculas = action.payload.listaDeMatriculas;
      })
      .addCase(buscarMatriculasFiltros.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
        state.listaDeMatriculas = [];
      })
      .addCase(apagarMatricula.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (excluindo a matricula do backend)";
      })
      .addCase(apagarMatricula.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaDeMatriculas = state.listaDeMatriculas.filter((matricula) => matricula.id !== action.payload.id);
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(apagarMatricula.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
      })
      .addCase(incluirMatricula.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando a requisição (inclusão da matricula no backend)";
      })
      .addCase(incluirMatricula.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.inserido = true;
          state.listaDeMatriculas.push(action.payload.matricula);
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(incluirMatricula.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
      })
      .addCase(atualizarMatricula.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando a requisição (Atualização da matricula no backend)";
      })
      .addCase(atualizarMatricula.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaDeMatriculas = state.listaDeMatriculas.map((item) => 
            item.id === action.payload.matricula.id ? action.payload.matricula : item
          );
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(atualizarMatricula.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
      });
  }
});

export default matriculaSlice.reducer;