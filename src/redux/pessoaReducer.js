import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ESTADO from "./estados.js";
import { gravarPessoa,alterarPessoa,excluirPessoa,consultarPessoa } from "../service/pessoaService";


export const buscarPessoas = createAsyncThunk('buscarPessoas', async (termo) => {
  const resultado = await consultarPessoa(termo);
  try {
    if (Array.isArray(resultado)) {
      return {
        "status": true,
        "mensagem": "Pessoas recuperadas com sucesso",
        "listaDePessoas": resultado
      };
    } else {
      return {
        "status": false,
        "mensagem": "Erro ao recuperar as pessoas do backend",
        "listaDePessoas": []
      };
    }
  } catch (erro) {
    return {
      "status": false,
      "mensagem": "Erro: " + erro.message,
      "listaDePessoas": []
    };
  }
});

export const apagarPessoa = createAsyncThunk('apagarPessoa', async (pessoa) => {
  const resultado = await excluirPessoa(pessoa);
  try {
    return {
      "status": resultado.status,
      "mensagem": resultado.mensagem,
      "cpf": pessoa.cpf
    };
  } catch (erro) {
    return {
      "status": false,
      "mensagem": "Erro: " + erro.message,
    };
  }
});

export const incluirPessoa = createAsyncThunk('incluirPessoa', async (pessoa) => {
  try {
    const resultado = await gravarPessoa(pessoa);
    if (resultado.status) {
      return {
        "status": resultado.status,
        "mensagem": resultado.mensagem,
        "pessoa": pessoa
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

export const atualizarPessoa = createAsyncThunk('atualizarPessoa', async (pessoa) => {
  try {
    const resultado = await alterarPessoa(pessoa);
    if (resultado.status) {
      return {
        "status": resultado.status,
        "mensagem": resultado.mensagem,
        "pessoa": pessoa
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

const pessoaSlice = createSlice({
  name: "pessoa",
  initialState: {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    listaDePessoas: [],
    inserido: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscarPessoas.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (buscando pessoas)";
      })
      .addCase(buscarPessoas.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
        } else {
          state.estado = ESTADO.ERRO;
        }
        state.mensagem = action.payload.mensagem;
        state.listaDePessoas = action.payload.listaDePessoas;
      })
      .addCase(buscarPessoas.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
        state.listaDePessoas = [];
      })
      .addCase(apagarPessoa.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (excluindo a pessoa do backend)";
      })
      .addCase(apagarPessoa.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaDePessoas = state.listaDePessoas.filter((pessoa) => pessoa.cpf !== action.payload.cpf);
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(apagarPessoa.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
      })
      .addCase(incluirPessoa.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando a requisição (inclusão da pessoa no backend)";
      })
      .addCase(incluirPessoa.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.inserido = true;
          state.listaDePessoas.push(action.payload.pessoa);
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(incluirPessoa.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
      })
      .addCase(atualizarPessoa.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando a requisição (Atualização da pessoa no backend)";
      })
      .addCase(atualizarPessoa.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaDePessoas = state.listaDePessoas.map((item) => 
            item.cpf === action.payload.pessoa.cpf ? action.payload.pessoa : item
          );
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(atualizarPessoa.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
      });
  }
});

export default pessoaSlice.reducer;