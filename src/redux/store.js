import { configureStore } from "@reduxjs/toolkit";
import pessoaReducer from "./pessoaReducer";
import matriculaReducer from "./matriculaReducer";
import alunoReducer from "./alunoReducer"
import profissionalReducer from './profissionalReducer'
import graduacaoReducer from "./graduacaoReducer"
import salaReducer from "./salaReducer"
import frequenciaReducer from "./frequenciaReducer"
import notificacaoReducer from "./notificacaoReducer"


const store= configureStore({
    reducer:{
        'pessoa':pessoaReducer,
        'matricula':matriculaReducer,
        'aluno':alunoReducer,
        'profissional':profissionalReducer,
         'graduacao':graduacaoReducer,
        'sala':salaReducer,
        'frequencia': frequenciaReducer,
        'notificacao': notificacaoReducer
    }
})

export default store;