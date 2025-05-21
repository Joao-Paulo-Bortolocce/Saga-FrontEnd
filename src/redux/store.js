import { configureStore } from "@reduxjs/toolkit";
import pessoaReducer from "./pessoaReducer";
import matriculaReducer from "./matriculaReducer";
import alunoReducer from "./alunoReducer";
import graduacaoReducer from "./graduacaoReducer";
import salaReducer from "./salaReducer"

const store= configureStore({
    reducer:{
        'pessoa':pessoaReducer,
        'matricula':matriculaReducer,
        'aluno':alunoReducer,
        'graduacao':graduacaoReducer,
        'sala':salaReducer
    }
})

export default store;