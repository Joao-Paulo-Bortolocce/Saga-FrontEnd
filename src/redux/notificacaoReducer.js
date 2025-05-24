import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ESTADO from "./estados.js";
import { gravarNotificacao, visualizarNotificacao, excluirNotificacao, consultarNotificacao} from "../service/serviceNotificacao.js";

export const buscarNotificacoes = createAsyncThunk("buscarNotificacoes", async (termo) => {
    try {
      const resultado = await consultarNotificacao(termo);
      if (Array.isArray(resultado)) {
        return {
          status: true,
          mensagem: "Notificações recuperadas com sucesso",
          listaDeNotificacoes: resultado,
        };
      } else {
        return {
          status: false,
          mensagem: "Erro ao recuperar as notificações do backend",
          listaDeNotificacoes: [],
        };
      }
    } catch (erro) {
      return {
        status: false,
        mensagem: "Erro: " + erro.message,
        listaDeNotificacoes: [],
      };
    }
  }
);

export const apagarNotificacao = createAsyncThunk("apagarNotificacao", async (notificacao) => {
    try {
      const resultado = await excluirNotificacao(notificacao.not_id);
      return {
        status: resultado.status,
        mensagem: resultado.mensagem,
        id: notificacao.not_id,
      };
    } catch (erro) {
      return {
        status: false,
        mensagem: "Erro: " + erro.message,
      };
    }
  }
);

export const incluirNotificacao = createAsyncThunk( "incluirNotificacao", async (notificacao) => {
    try {
      const resultado = await gravarNotificacao(notificacao);
      if (resultado.status) {
        return {
          status: resultado.status,
          mensagem: resultado.mensagem,
          notificacao: resultado.notificacao,
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

export const atualizarNotificacao = createAsyncThunk("atualizarNotificacao", async (notificacao) => {
    try {
      const resultado = await visualizarNotificacao(notificacao.not_id);
      if (resultado.status) {
        const visualizada = {
          not_id : notificacao.not_id,
          not_texto : notificacao.not_texto,
          not_data : notificacao.not_data,
          not_visto : true
        }
        return {
          status: resultado.status,
          mensagem: resultado.mensagem,
          notificacao: visualizada,
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

const notificacaoSlice = createSlice({
  name: "notificacao",
  initialState: {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    listaDeNotificacoes: [],
    inserido: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(buscarNotificacoes.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (buscando notificações)";
      })
      .addCase(buscarNotificacoes.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaDeNotificacoes = action.payload.listaDeNotificacoes;
        } else {
          state.estado = ESTADO.ERRO;
          state.listaDeNotificacoes = [];
        }
        state.mensagem = action.payload.mensagem;
      })
      .addCase(buscarNotificacoes.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao buscar notificações.";
        state.listaDeNotificacoes = [];
      })
      .addCase(apagarNotificacao.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição (excluindo a notificação do backend)";
      })
      .addCase(apagarNotificacao.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaDeNotificacoes = state.listaDeNotificacoes.filter((n) => 
            n.not_id !== action.payload.id
          );
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(apagarNotificacao.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao excluir a notificação.";
      })
      .addCase(incluirNotificacao.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando a requisição (inclusão da notificação no backend)";
      })
      .addCase(incluirNotificacao.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.inserido = true;
          state.listaDeNotificacoes.push(action.payload.notificacao);
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(incluirNotificacao.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao incluir a notificação.";
      })
      .addCase(atualizarNotificacao.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando a requisição (atualização da notificação no backend)";
      })
      .addCase(atualizarNotificacao.fulfilled, (state, action) => {
        state.mensagem = action.payload.mensagem;
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.listaDeNotificacoes = state.listaDeNotificacoes.map((item) =>
            item.not_id === action.payload.notificacao.not_id ? action.payload.notificacao : item
          );
        } else {
          state.estado = ESTADO.ERRO;
        }
      })
      .addCase(atualizarNotificacao.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload?.mensagem || "Erro ao atualizar a notificação.";
      });
  },
});

export default notificacaoSlice.reducer;
