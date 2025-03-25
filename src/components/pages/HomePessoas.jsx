import { useState } from "react";
import Page from "../layouts/Page";
import CadastroPessoa from "./cadastros/CadastroPessoa";

export default function HomePessoas(props) {
    const[mostraTabela,setMostraTabela]= useState(false);


    return (
        <>
            <Page />
            {mostraTabela ? console.log("Esta mostrando a tabela"): <CadastroPessoa />} 
        </>
    )
}