import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ESTADO from "./estados.js";
import { gravarFrequencia, alterarFrequencia, excluirFrequencia, consultarFreqAluno, consultarFreqData} from "../service/serviceFrequencia.js";

export const buscarFrequenciasAluno = createAsyncThunk("buscarFrequenciasAluno", async (dados) => {
    try {
      const resultado = await consultarFreqAluno(dados);
      if (Array.isArray(resultado)) {
        return {
          status: true,
          mensagem: "Frequências recuperadas com sucesso",
          listaFrequencia: resultado,
        };
      } else {
        return {
          status: false,
          mensagem: "Erro ao recuperar as frequências do backend",
          listaFrequencia: [],
        };
      }
    } catch (erro) {
      return {
        status: false,
        mensagem: "Erro: " + erro.message,
        listaFrequencia: [],
      };
    }
  }
);

export const buscarFrequenciasData = createAsyncThunk("buscarFrequenciasData", async (dados) => {
    try {
      const resultado = await consultarFreqData(dados);
      if (Array.isArray(resultado)) {
        return {
          status: true,
          mensagem: "Frequências recuperadas com sucesso",
          listaFrequencia: resultado,
        };
      } else {
        return {
          status: false,
          mensagem: "Erro ao recuperar as frequências do backend",
          listaFrequencia: [],
        };
      }
    } catch (erro) {
      return {
        status: false,
        mensagem: "Erro: " + erro.message,
        listaFrequencia: [],
      };
    }
  }
);

export const apagarFrequencia = createAsyncThunk("apagarFrequencia", async (frequencia) => {
    try {
      const resultado = await excluirFrequencia(frequencia);
      return {
        status: resultado.status,
        mensagem: resultado.mensagem,
        id: frequencia.id,
      };
    } catch (erro) {
      return {
        status: false,
        mensagem: "Erro: " + erro.message,
      };
    }
  }
);

export const incluirFrequencia = createAsyncThunk("incluirFrequencia", async (frequencia) => {
    try {
      const resultado = await gravarFrequencia(frequencia);
      if (resultado.status) {
        return {
          status: resultado.status,
          mensagem: resultado.mensagem,
          frequencia: frequencia,
        };
      } else {
        return {
          status: resultado.status,
          mensagem: resultado.mensagem,
        };
      }
    } catch (erro) {
      return {
        status: false,
        mensagem: "Erro: " + erro.message,
      };
    }
  }
);

export const atualizarFrequencia = createAsyncThunk("atualizarFrequencia", async (frequencia) => {
    try {
      const resultado = await alterarFrequencia(frequencia);
      if (resultado.status) {
        return {
          status: resultado.status,
          mensagem: resultado.mensagem,
          frequencia: frequencia,
        };
      } else {
        return {
          status: resultado.status,
          mensagem: resultado.mensagem,
        };
      }
    } catch (erro) {
      return {
        status: false,
        mensagem: "Erro: " + erro.message,
      };
    }
  }
);

const frequenciaSlice = createSlice({
  name: "frequencia",
  initialState: {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    listaFrequencia: [],
    inserido: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscarFrequenciasAluno.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (buscando frequências)";
      })
      .addCase(buscarFrequenciasAluno.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaFrequencia = action.payload.listaFrequencia;
        } else {
          state.estado = ESTADO.ERRO;
          state.listaFrequencia = [];
        }
        state.mensagem = action.payload.mensagem;
      })
      .addCase(buscarFrequenciasAluno.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao buscar frequências.";
        state.listaFrequencia = [];
      })
      .addCase(buscarFrequenciasData.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (buscando frequências)";
      })
      .addCase(buscarFrequenciasData.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaFrequencia = action.payload.listaFrequencia;
        } else {
          state.estado = ESTADO.ERRO;
          state.listaFrequencia = [];
        }
        state.mensagem = action.payload.mensagem;
      })
      .addCase(buscarFrequenciasData.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao buscar frequências.";
        state.listaFrequencia = [];
      })
      .addCase(apagarFrequencia.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (excluindo a frequência do backend)";
      })
      .addCase(apagarFrequencia.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaFrequencia = state.listaFrequencia.filter(
            (f) => f.id !== action.payload.id
          );
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(apagarFrequencia.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao excluir a frequência.";
      })
      .addCase(incluirFrequencia.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando a requisição (inclusão da frequência no backend)";
      })
      .addCase(incluirFrequencia.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.inserido = true;
          state.listaFrequencia.push(action.payload.frequencia);
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(incluirFrequencia.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao incluir a frequência.";
      })
      .addCase(atualizarFrequencia.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando a requisição (atualização da frequência no backend)";
      })
      .addCase(atualizarFrequencia.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaFrequencia = state.listaFrequencia.map((item) =>
            item.id === action.payload.frequencia.id ? action.payload.frequencia : item
          );
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(atualizarFrequencia.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao atualizar a frequência.";
      });
  },
});

export default frequenciaSlice.reducer;
