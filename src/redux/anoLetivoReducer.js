import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ESTADO from "./estados.js";
import { buscarAnosLetivos, gravarAnoLetivo, alterarAnoLetivo, excluirAnoLetivo } from "../service/anoLetivoService.js";

export const consultarAnosLetivos = createAsyncThunk("consultarAnosLetivos", async (termo) => {
    try {
      const resultado = await buscarAnosLetivos(termo);
      if (Array.isArray(resultado)) {
        return {
          status: true,
          mensagem: "Anos letivos carregados com sucesso.",
          listaAnosLetivos: resultado
        };
      } else {
        return {
          status: false,
          mensagem: "Erro ao recuperar anos letivos do backend.",
          listaAnosLetivos: []
        };
      }
    } catch (erro) {
      return {
        status: false,
        mensagem: "Erro: " + erro.message,
        listaAnosLetivos: []
      };
    }
  }
);

export const incluirAnoLetivo = createAsyncThunk("incluirAnoLetivo", async (anoLetivo) => {
    try {
      const resultado = await gravarAnoLetivo(anoLetivo);
      if (resultado.status) {
        return {
          status: true,
          mensagem: resultado.mensagem,
          anoLetivo: anoLetivo
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
        mensagem: "Erro ao gravar ano letivo: " + erro.message
      };
    }
  }
);

export const atualizarAnoLetivo = createAsyncThunk("atualizarAnoLetivo", async (anoLetivo) => {
    try {
      const resultado = await alterarAnoLetivo(anoLetivo.id, anoLetivo);
      if (resultado.status) {
        return {
          status: true,
          mensagem: resultado.mensagem,
          anoLetivo: anoLetivo
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
        mensagem: "Erro ao atualizar ano letivo: " + erro.message
      };
    }
  }
);

export const apagarAnoLetivo = createAsyncThunk("apagarAnoLetivo", async (anoLetivo) => {
    try {
      const resultado = await excluirAnoLetivo(anoLetivo);
      return {
        status: resultado.status,
        mensagem: resultado.mensagem,
        id: anoLetivo.id
      };
    } catch (erro) {
      return {
        status: false,
        mensagem: "Erro ao apagar ano letivo: " + erro.message
      };
    }
  }
);

const anoLetivoSlice = createSlice({
  name: "anoLetivo",
  initialState: {
    listaAnosLetivos: [],
    estado: ESTADO.OCIOSO,
    mensagem: "",
    inserido: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(consultarAnosLetivos.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Carregando anos letivos...";
      })
      .addCase(consultarAnosLetivos.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaAnosLetivos = action.payload.listaAnosLetivos;
        } else {
          state.estado = ESTADO.ERRO;
          state.listaAnosLetivos = [];
        }
        state.mensagem = action.payload.mensagem;
      })
      .addCase(consultarAnosLetivos.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao buscar anos letivos.";
        state.listaAnosLetivos = [];
      })
      .addCase(incluirAnoLetivo.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Incluindo novo ano letivo...";
      })
      .addCase(incluirAnoLetivo.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.inserido = true;
          state.listaAnosLetivos.push(action.payload.anoLetivo);
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(incluirAnoLetivo.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao incluir ano letivo.";
      })
      .addCase(atualizarAnoLetivo.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Atualizando ano letivo...";
      })
      .addCase(atualizarAnoLetivo.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaAnosLetivos = state.listaAnosLetivos.map((item) =>
            item.id === action.payload.anoLetivo.id ? action.payload.anoLetivo : item
          );
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(atualizarAnoLetivo.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao atualizar ano letivo.";
      })
      .addCase(apagarAnoLetivo.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Apagando ano letivo...";
      })
      .addCase(apagarAnoLetivo.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaAnosLetivos = state.listaAnosLetivos.filter(
            (ano) => ano.id !== action.payload.id
          );
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(apagarAnoLetivo.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao apagar ano letivo.";
      });
  }
});

export default anoLetivoSlice.reducer;