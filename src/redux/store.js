import { configureStore } from "@reduxjs/toolkit";
import pessoaReducer from "./pessoaReducer";


const store= configureStore({
    reducer:{
        'pessoa':pessoaReducer
    }
})

export default store;