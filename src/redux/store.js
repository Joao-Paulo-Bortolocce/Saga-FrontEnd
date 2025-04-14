import { configureStore } from "@reduxjs/toolkit";
import pessoaReducer from "./pessoaReducer";
import matriculaReducer from "./matriculaReducer";


const store= configureStore({
    reducer:{
        'pessoa':pessoaReducer,
        'matricula':matriculaReducer
    }
})

export default store;