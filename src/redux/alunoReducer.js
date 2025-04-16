import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ESTADO from "./estados.js";
import { gravarAluno,alterarAluno,excluirAluno,consultarAluno } from "../service/serviceAluno.js";


export const buscarAlunos = createAsyncThunk('buscarAlunos', async (termo) => {
  const resultado = await consultarAluno(termo);
  try {
    if (Array.isArray(resultado)) {
      return {
        "status": true,
        "mensagem": "Alunos recuperadas com sucesso",
        "listaDeAlunos": resultado
      };
    } else {
      return {
        "status": false,
        "mensagem": "Erro ao recuperar as alunos do backend",
        "listaDeAlunos": []
      };
    }
  } catch (erro) {
    return {
      "status": false,
      "mensagem": "Erro: " + erro.message,
      "listaDeAlunos": []
    };
  }
});

export const apagarAluno = createAsyncThunk('apagarAluno', async (aluno) => {
  const resultado = await excluirAluno(aluno);
  try {
    return {
      "status": resultado.status,
      "mensagem": resultado.mensagem,
      "ra": aluno.ra
    };
  } catch (erro) {
    return {
      "status": false,
      "mensagem": "Erro: " + erro.message,
    };
  }
});

export const incluirAluno = createAsyncThunk('incluirAluno', async (aluno) => {
  try {
    const resultado = await gravarAluno(aluno);
    if (resultado.status) {
      return {
        "status": resultado.status,
        "mensagem": resultado.mensagem,
        "aluno": aluno
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

export const atualizarAluno = createAsyncThunk('atualizarAluno', async (aluno) => {
  try {
    const resultado = await alterarAluno(aluno);
    if (resultado.status) {
      return {
        "status": resultado.status,
        "mensagem": resultado.mensagem,
        "aluno": aluno
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

const alunoSlice = createSlice({
  name: "aluno",
  initialState: {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    listaDeAlunos: [],
    inserido: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscarAlunos.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (buscando alunos)";
      })
      .addCase(buscarAlunos.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
        } else {
          state.estado = ESTADO.ERRO;
        }
        state.mensagem = action.payload.mensagem;
        state.listaDeAlunos = action.payload.listaDeAlunos;
      })
      .addCase(buscarAlunos.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
        state.listaDeAlunos = [];
      })
      .addCase(apagarAluno.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (excluindo a aluno do backend)";
      })
      .addCase(apagarAluno.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaDeAlunos = state.listaDeAlunos.filter((aluno) => aluno.ra !== action.payload.ra);
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(apagarAluno.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
      })
      .addCase(incluirAluno.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando a requisição (inclusão da aluno no backend)";
      })
      .addCase(incluirAluno.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.inserido = true;
          state.listaDeAlunos.push(action.payload.aluno);
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(incluirAluno.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
      })
      .addCase(atualizarAluno.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando a requisição (Atualização da aluno no backend)";
      })
      .addCase(atualizarAluno.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaDeAlunos = state.listaDeAlunos.map((item) => 
            item.ra === action.payload.aluno.ra ? action.payload.aluno : item
          );
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(atualizarAluno.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
      });
  }
});

export default alunoSlice.reducer;