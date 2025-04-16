import { configureStore } from "@reduxjs/toolkit";
import pessoaReducer from "./pessoaReducer";
import matriculaReducer from "./matriculaReducer";
import alunoReducer from "./alunoReducer"


const store= configureStore({
    reducer:{
        'pessoa':pessoaReducer,
        'matricula':matriculaReducer,
        'aluno':alunoReducer
    }
})

export default store;