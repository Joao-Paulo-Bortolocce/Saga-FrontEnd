import { configureStore } from "@reduxjs/toolkit";
import pessoaReducer from "./pessoaReducer";
import matriculaReducer from "./matriculaReducer";
import alunoReducer from "./alunoReducer"
import profissionalReducer from './profissionalReducer'


const store= configureStore({
    reducer:{
        'pessoa':pessoaReducer,
        'matricula':matriculaReducer,
        'aluno':alunoReducer,
        'profissional':profissionalReducer
    }
})

export default store;