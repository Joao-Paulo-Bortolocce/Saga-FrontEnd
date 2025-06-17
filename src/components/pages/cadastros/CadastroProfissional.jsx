import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertCircle, Loader2 } from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";
import logoPrefeitura from "../../../assets/images/logoPrefeitura.png";
import ESTADO from '../../../redux/estados';
import { buscarPossiveisProfissionais } from '../../../redux/pessoaReducer';
import { atualizarProfissional, incluirProfissional } from "../../../redux/profissionalReducer";
import { formatarCPF } from "../../../service/formatadores";
import { consultarProfissional } from '../../../service/serviceProfissional';
import {consultarGraduacao} from "../../../service/serviceGraduacao.js";

function CadastroProfissional(props) {
    const [profissional, setProfissional] = useState(props.profissional);
    const [listaDegraduacao, setListaDeGraduacao] = useState([]);
    const { estado, mensagem, listaDePessoas } = useSelector(state => state.pessoa);
    const dispatch = useDispatch();
    const [listaFiltrada, setListaFiltrada] = useState([]);
    const [validos, setValidos] = useState([true, true, true, true, true, true, true, true]);

    useEffect(() => {
        dispatch(buscarPossiveisProfissionais());
        consultarGraduacao().then((resultado)=>{
            if(Array.isArray(resultado))
                setListaDeGraduacao(resultado);
            else
                toast.error("Erro ao recuperar as graduações!")
        })
    }, []);

    useEffect(() => {
        filtrar();
    }, [profissional, listaDePessoas]);


    function filtrar() {
        const cpf = profissional.profissional_pessoa.cpf.toLowerCase();
        const nome = profissional.profissional_pessoa.nome.toLowerCase();

        const novaListaFiltrada = listaDePessoas.filter((pessoa) => {
            const nomePessoa = pessoa.nome.toLowerCase();
            const cpfPessoa = pessoa.cpf.toLowerCase();

            const filtroNome = nome === "" || nomePessoa.includes(nome);
            const filtroCPF = cpf === "" || cpfPessoa.includes(cpf);

            return filtroNome && filtroCPF;
        });
        setListaFiltrada(novaListaFiltrada);
    }

    function manipularMudanca(event) {
        const id = event.currentTarget.id;
        let value = event.currentTarget.value;
        let novosValidos = [...validos];

        if (id.startsWith("pessoa.")) {
            const idAux = id.split('.')[1];
            let valor = value;

            if (id === "pessoa.nome") {
                novosValidos[0] = true;
            } else {
                valor = formatarCPF(value, profissional.profissional_pessoa.cpf.length < value.length);
                novosValidos[1] = true;
            }

            setProfissional((profAntigo) => ({
                ...profAntigo,
                profissional_pessoa: {
                    ...profAntigo.profissional_pessoa,
                    [idAux]: valor,
                },
            }));
        } else {
            if (id === "profissional_rn") novosValidos[2] = true;
            if (id === "profissional_tipo") novosValidos[3] = true;
            if (id === "profissional_dataAdmissao") {
                let atual = new Date();
                let dataInformada = new Date(value);
                if (dataInformada > atual) {
                    toast.error("A data informada é inválida", { duration: 3000 });
                    value = ""
                }
                else{

                    if((atual-dataInformada)/(86400000*365)>50){
                        toast.error("A data informada precisa ser mais recente", { duration: 3000 });
                        value = ""
                    }
                    else
                        novosValidos[4] = true;
                }
            }
            if (id === "profissional_graduacao") {
                novosValidos[5] = true;
                setProfissional((profAntigo) => ({
                    ...profAntigo,
                    profissional_graduacao: {
                        id: value,
                    },
                }));
            } else if (id === "profissional_senha") {
                novosValidos[7] = true;
                setProfissional((profAntigo) => ({
                    ...profAntigo,
                    [id]: value,
                }));
            } else {
                setProfissional((profAntigo) => ({
                    ...profAntigo,
                    [id]: value,
                }));
                if (id === "profissional_usuario") novosValidos[6] = true;
            }
        }
        setValidos(novosValidos);
    }

    function zeraDados() {
        props.setProfissional({
            profissional_rn: 0,
            profissional_tipo: 0,
            profissional_dataAdmissao: new Date().toISOString().substring(0, 10),
            profissional_graduacao: {
                id: 0,
            },
            profissional_usuario: "",
            profissional_senha: "",
            profissional_pessoa: {
                cpf: "",
                nome: "",
            }
        });
    }

    function setarValores(pessoa) {
        setProfissional((prevProf) => ({
            ...prevProf,
            profissional_pessoa: {
                cpf: pessoa.cpf,
                nome: pessoa.nome,
            }
        }));
        toast.success("Pessoa selecionada com sucesso", {
            duration: 2000,
            repeat: false
        });
    }

    // function cadastrarInfosPessoais() {
    //     props.setExibirTabela(true);
    //     zeraDados();
    //     toast.success("Redirecionando para cadastro de pessoa", {
    //         duration: 2000,
    //         repeat: false
    //     });
    // }

    function validaInfos() {
        let valido = true;
        const novosValidos = [true, true, true, true, true, true, true, true];

        if (!profissional.profissional_pessoa.nome || profissional.profissional_pessoa.nome.trim() === "") {
            novosValidos[0] = false;
            valido = false;
        }

        if (!profissional.profissional_pessoa.cpf || profissional.profissional_pessoa.cpf.trim().length < 14) {
            novosValidos[1] = false;
            valido = false;
        }

        if (!profissional.profissional_rn || profissional.profissional_rn === 0) {
            novosValidos[2] = false;
            valido = false;
        }

        if (!profissional.profissional_tipo || profissional.profissional_tipo === 0) {
            novosValidos[3] = false;
            valido = false;
        }

        if (!profissional.profissional_dataAdmissao || profissional.profissional_dataAdmissao.trim() === "") {
            novosValidos[4] = false;
            valido = false;
        }

        if (!profissional.profissional_graduacao.id || profissional.profissional_graduacao.id === 0) {
            novosValidos[5] = false;
            valido = false;
        }

        if (!profissional.profissional_usuario || profissional.profissional_usuario.trim() === "") {
            novosValidos[6] = false;
            valido = false;
        }

        if (!profissional.profissional_senha || profissional.profissional_senha.trim() === "") {
            novosValidos[7] = false;
            valido = false;
        }

        setValidos(novosValidos);
        return valido;
    }

    function handleSubmit(evento) {
        evento.preventDefault();

        if (validaInfos()) {
            if (props.modoEdicao) {
                dispatch(atualizarProfissional(profissional));
                props.setExibirTabela(true);
                props.setModoEdicao(false);
                zeraDados();
            } else {
                if (listaFiltrada.length === 1) {
                    consultarProfissional(profissional.profissional_rn).then((aux) => {
                        if (aux === undefined || aux === null) {
                            dispatch(incluirProfissional(profissional));
                            props.setExibirTabela(true);
                            zeraDados();
                        } else {
                            toast.error("Este RN já está cadastrado", {
                                duration: 3000,
                                repeat: false
                            });
                        }
                    });
                } else {
                    toast.error("As informações não correspondem a uma pessoa, preencha todos os campos corretamente", {
                        duration: 2000,
                        repeat: false
                    });

                    setTimeout(() => {
                        toast.error("NOME E(OU) CPF ERRADO(S)!", {
                            duration: 2000,
                            repeat: false
                        });
                    }, 2000);

                    setTimeout(() => {
                        toast("Cadastre as informações pessoais do profissional antes de prosseguir este cadastro", {
                        duration: 3000,
                        repeat: false,
                        icon:'⚠'
                        
                    });
                    }, 4000);
                }
            }
        }
    }

    function mensagemAutorizado(mensagem) {
        if (props.modoEdicao)
            toast.error("Voce não pode alterar " + mensagem + " do profissional ja cadastrado", { duration: 2000 })
    }

    if (estado === ESTADO.PENDENTE) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">{mensagem}</div>
            </div>
        );
    }

    if (estado === ESTADO.ERRO) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
                <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {mensagem}
                </div>
                <button
                    onClick={() => dispatch(buscarPossiveisProfissionais())}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                >
                    Voltar
                </button>
            </div>
        );
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative p-4" >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 w-full max-w-screen-lg overflow-hidden">
                <div className="bg-gray-900 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 h-full flex flex-col">
                    <div className="flex flex-col items-center mb-6 md:mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 tracking-wide">Cadastro de Profissional</h2>
                        <img src={logoPrefeitura} alt="Logo da Prefeitura" className="h-16 sm:h-20 md:h-24 w-auto" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="pessoa.nome" className={`text-sm ${validos[0] ? 'text-white' : 'text-red-500'}`}>Nome</label>
                                <input
                                    disabled={props.modoEdicao}
                                    type="text"
                                    id="pessoa.nome"
                                    value={profissional.profissional_pessoa.nome}
                                    onChange={manipularMudanca}
                                    className={`w-full rounded-md p-2 sm:p-3 bg-gray-800 text-white ${!validos[0] ? 'border border-red-500' : ''}`}
                                />
                                {!validos[0] && <p className="text-red-500 text-sm mt-1">Campo obrigatório</p>}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="pessoa.cpf" className={`text-sm ${validos[1] ? 'text-white' : 'text-red-500'}`}>CPF</label>
                                <input
                                    disabled={props.modoEdicao}
                                    type="text"
                                    id="pessoa.cpf"
                                    value={profissional.profissional_pessoa.cpf}
                                    maxLength={14}
                                    onChange={manipularMudanca}
                                    className={`w-full rounded-md p-2 sm:p-3 bg-gray-800 text-white ${!validos[1] ? 'border border-red-500' : ''}`}
                                />
                                {!validos[1] && <p className="text-red-500 text-sm mt-1">Campo obrigatório</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="profissional_rn" className={`text-sm ${validos[2] ? 'text-white' : 'text-red-500'}`}>RN</label>
                                <input
                                    disabled={props.modoEdicao}
                                    type="number"
                                    id="profissional_rn"
                                    value={profissional.profissional_rn}
                                    onChange={manipularMudanca}
                                    className={`w-full rounded-md p-2 sm:p-3 bg-gray-800 text-white ${!validos[2] ? 'border border-red-500' : ''}`}
                                />
                                {!validos[2] && <p className="text-red-500 text-sm mt-1">Campo obrigatório</p>}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="profissional_tipo" className={`text-sm ${validos[3] ? 'text-white' : 'text-red-500'}`}>Tipo do Profissional</label>
                                <select
                                    id="profissional_tipo"
                                    value={profissional.profissional_tipo}
                                    onChange={manipularMudanca}
                                    className={`w-full rounded-md p-2 sm:p-3 bg-gray-800 text-white ${!validos[3] ? 'border border-red-500' : ''}`}
                                >
                                    <option value="0">Selecione</option>
                                    <option value="1">Secretaria</option>
                                    <option value="2">Professor</option>
                                    <option value="3">Gestão</option>
                                </select>
                                {!validos[3] && <p className="text-red-500 text-sm mt-1">Campo obrigatório</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="profissional_dataAdmissao" className={`text-sm ${validos[4] ? 'text-white' : 'text-red-500'}`}>Data de Admissão</label>
                                <input
                                    type="date"
                                    id="profissional_dataAdmissao"
                                    value={profissional.profissional_dataAdmissao}
                                    onChange={manipularMudanca}
                                    className={`w-full rounded-md p-2 sm:p-3 bg-gray-800 text-white ${!validos[4] ? 'border border-red-500' : ''}`}
                                />
                                {!validos[4] && <p className="text-red-500 text-sm mt-1">Campo obrigatório</p>}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="profissional_graduacao" className={`text-sm ${validos[5] ? 'text-white' : 'text-red-500'}`}>Graduação</label>
                                <select
                                    id="profissional_graduacao"
                                    value={profissional.profissional_graduacao.id}
                                    onChange={manipularMudanca}
                                    className={`w-full rounded-md p-2 sm:p-3 bg-gray-800 text-white ${!validos[5] ? 'border border-red-500' : ''}`}
                                >
                                    <option value="0">Selecione</option>
                                    {listaDegraduacao.map(g => (
                                        <option key={g.id} value={g.id}>
                                            {g.descricao}
                                        </option>
                                    ))}
                                </select>
                                {!validos[5] && <p className="text-red-500 text-sm mt-1">Campo obrigatório</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="profissional_usuario" className={`text-sm ${validos[6] ? 'text-white' : 'text-red-500'}`}>Nome de usuário</label>
                                <input
                                    type="text"
                                    id="profissional_usuario"
                                    value={profissional.profissional_usuario}
                                    onChange={manipularMudanca}
                                    className={`w-full rounded-md p-2 sm:p-3 bg-gray-800 text-white ${!validos[6] ? 'border border-red-500' : ''}`}
                                />
                                {!validos[6] && <p className="text-red-500 text-sm mt-1">Campo obrigatório</p>}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="profissional_senha" className={`text-sm ${validos[7] ? 'text-white' : 'text-red-500'}`}>Senha de usuario</label>
                                <input
                                    id="profissional_senha"
                                    type='password'
                                    value={profissional.profissional_senha}
                                    onChange={manipularMudanca}
                                    className={`w-full rounded-md p-2 sm:p-3 bg-gray-800 text-white ${!validos[7] ? 'border border-red-500' : ''}`}
                                />
                                {!validos[7] && <p className="text-red-500 text-sm mt-1">Campo obrigatório</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <button
                                type="submit"
                                className="w-full p-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                            >
                                Confirmar
                            </button>
                            <button
                                type="button"
                                onClick={() => { zeraDados(); props.setExibirTabela(true); props.setModoEdicao(false); }}
                                className="w-full p-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                                Voltar
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-white text-center text-xl">Pessoas ainda não cadastrados como profissionais</p>
                    <div className="mt-6 overflow-y-auto overflow-x-auto min-h-[40vh] max-h-[40vh]">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="sticky top-0 z-10 bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300 uppercase bg-gray-800">Nome</th>
                                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300 uppercase bg-gray-800">CPF</th>
                                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300 uppercase bg-gray-800">Data de Nascimento</th>
                                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300 uppercase bg-gray-800">Selecionar</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800/40 divide-y divide-gray-700">
                                {listaFiltrada.length > 0 ? (
                                    listaFiltrada.map((pessoa) => (
                                        <tr key={pessoa.cpf} className="hover:bg-gray-700/50 transition-colors">
                                            <td className="px-4 py-3 text-sm text-gray-300 break-words">{pessoa.nome}</td>
                                            <td className="px-4 py-3 text-sm text-gray-300 break-words">{pessoa.cpf}</td>
                                            <td className="px-4 py-3 text-sm text-gray-300 break-words">{new Date(pessoa.dataNascimento).toLocaleDateString()}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => setarValores(pessoa)}
                                                    className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                                                >
                                                    Selecionar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center text-gray-300 py-4">Nenhum Profissional encontrado</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Toaster position="top-center" />
        </div>
    );
}

export default CadastroProfissional;