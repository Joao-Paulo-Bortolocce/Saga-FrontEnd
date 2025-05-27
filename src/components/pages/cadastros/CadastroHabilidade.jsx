import { useState, useEffect } from 'react';
import { Search } from "lucide-react";
import { consultarMateria } from '../../../service/serviceMateria';
import { buscarSeries } from '../../../service/servicoSerie';

export default function CadastroHabilidade({
    atualizarLista,
    salvarHabilidade,
    habilidadeEmEdicao,
    cancelarEdicao,
    buscarPorDescricao,
}) {
    const [descricao, setDescricao] = useState('');
    const [materiaId, setMateriaId] = useState('');
    const [serieId, setSerieId] = useState('');
    const [materias, setMaterias] = useState([]);
    const [series, setSeries] = useState([]);
    const [busca, setBusca] = useState('');

    useEffect(() => {
        carregarDados();
    }, []);

    useEffect(() => {
        if (habilidadeEmEdicao) {
            setDescricao(habilidadeEmEdicao.descricao);
            setMateriaId(habilidadeEmEdicao.materia_id);
            setSerieId(habilidadeEmEdicao.habilidades_serie_id || '');
        } else {
            setDescricao('');
            setMateriaId('');
            setSerieId('');
        }
    }, [habilidadeEmEdicao]);

    async function carregarDados() {
        try {
            const [materiasRes, seriesRes] = await Promise.all([
                consultarMateria(),
                buscarSeries()
            ]);
            
            setMaterias(materiasRes.listaDeMaterias || []);
            setSeries(seriesRes.series || []);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        if (!descricao || !materiaId) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        const habilidade = {
            descricao,
            materia_id: parseInt(materiaId),
            habilidades_serie_id: serieId ? parseInt(serieId) : null,
            cod: habilidadeEmEdicao?.cod
        };

        await salvarHabilidade(habilidade, !!habilidadeEmEdicao);
        
        setDescricao('');
        setMateriaId('');
        setSerieId('');
    }

    function handleBuscaChange(e) {
        const termo = e.target.value;
        setBusca(termo);
        buscarPorDescricao(termo);
    }

    return (
        <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
            <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Descrição da Habilidade"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="p-2 rounded bg-gray-800 border border-gray-700 w-64"
                    required
                />
                
                <select
                    value={materiaId}
                    onChange={(e) => setMateriaId(e.target.value)}
                    className="p-2 rounded bg-gray-800 border border-gray-700 w-48"
                    required
                >
                    <option value="">Selecione uma matéria</option>
                    {materias.map((materia) => (
                        <option key={materia.id} value={materia.id}>
                            {materia.nome}
                        </option>
                    ))}
                </select>

                <select
                    value={serieId}
                    onChange={(e) => setSerieId(e.target.value)}
                    className="p-2 rounded bg-gray-800 border border-gray-700 w-48"
                >
                    <option value="">Selecione uma série (opcional)</option>
                    {series.map((serie) => (
                        <option key={serie.serieId} value={serie.serieId}>
                            {serie.serieNum}º Ano - {serie.serieDescr}
                        </option>
                    ))}
                </select>

                <button 
                    type="submit" 
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                >
                    {habilidadeEmEdicao ? 'Atualizar' : 'Cadastrar'}
                </button>
                
                {habilidadeEmEdicao && (
                    <button 
                        type="button" 
                        onClick={cancelarEdicao} 
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                    >
                        Cancelar
                    </button>
                )}
            </form>

            <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded px-2">
                <Search className="text-green-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Buscar por descrição..."
                    value={busca}
                    onChange={handleBuscaChange}
                    className="bg-transparent p-2 focus:outline-none w-64"
                />
            </div>
        </div>
    );
}