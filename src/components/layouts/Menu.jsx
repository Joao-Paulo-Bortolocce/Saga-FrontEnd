import { useState, useContext } from 'react';
import {
    Dialog,
    DialogPanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from '@headlessui/react';
import {
    Bars3Icon,
    XMarkIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/outline';
import {
    UserRoundSearch,
    BookOpenText,
    School,
    Earth,
    LogOut,
    User,
} from 'lucide-react';

import logoPrefeitura from "../../assets/images/logoPrefeitura.png";
import { ContextoUsuario } from '../../App';

const opcoesCadastro = [
    {
        nome: 'Pessoas',
        descricao: 'Adicionar pessoa (Aluno, Responsável ou Profissional)',
        href: '/cadastros',
        icon: UserRoundSearch
    },
    {
        nome: 'Acadêmico',
        descricao: 'Adicionar itens do setor acadêmico',
        href: '/cadastros',
        icon: BookOpenText
    },
    {
        nome: 'Infraestrutura',
        descricao: 'Adicionar infraestrutura (salas, turmas, séries)',
        href: '/cadastros',
        icon: School
    },
    {
        nome: 'Todos',
        descricao: 'Todos os cadastros',
        href: '/cadastros',
        icon: Earth
    },
];

export default function HeaderMenu() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { setUsuario, usuario } = useContext(ContextoUsuario);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        setUsuario({ id: 0, username: '', senha: '', tipo: '', logado: false });
    };

    return (
        <header className="bg-white shadow relative z-50">
            <nav className="mx-auto max-w-7xl flex items-center justify-between p-4 lg:px-8">
                <div className="flex items-center gap-4">
                    <a href="/" className="flex items-center gap-2">
                        <img src={logoPrefeitura} alt="Logo Prefeitura" className="h-10 w-auto" />
                        <span className="sr-only">Início</span>
                    </a>
                    <div className="hidden lg:flex items-center gap-2 text-sm text-gray-700">
                        <User className="w-4 h-4" />
                        {usuario.username}
                    </div>
                </div>

                <div className="flex lg:hidden">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                </div>

                <PopoverGroup className="hidden lg:flex lg:gap-x-10">
                    {usuario.tipo % 2 == 1 ? <Popover className="relative">
                        <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold text-gray-900">
                            Cadastros
                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                        </PopoverButton>

                        <PopoverPanel className="absolute top-full left-0 z-50 mt-3 w-screen max-w-md overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-200">
                            <div className="p-4">
                                {opcoesCadastro.map((item) => (
                                    <a
                                        key={item.nome}
                                        href={`${item.href}?tipo=${item.nome}`}
                                        className="group flex items-center gap-4 rounded-lg p-3 hover:bg-gray-50"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 group-hover:bg-indigo-50">
                                            <item.icon className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{item.nome}</p>
                                            <p className="text-xs text-gray-500">{item.descricao}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </PopoverPanel>
                    </Popover> :
                        null}

                    <a href="/funcionalidades" className="text-sm font-semibold text-gray-900">
                        Funcionalidades
                    </a>
                    {
                        usuario.tipo > 1 && (
                            <a href="/cadastros/chamada" className="text-sm font-semibold text-gray-900">
                                Chamada
                            </a>)

                    }
                </PopoverGroup>

                <div className="hidden lg:flex lg:items-center">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                        <LogOut className="h-4 w-4" />
                        Sair
                    </button>
                </div>
            </nav>

            {/* Menu Mobile */}
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10 bg-black/20" />
                <DialogPanel className="fixed inset-y-0 right-0 z-20 w-full max-w-sm bg-white p-6 overflow-y-auto">
                    <div className="flex items-center justify-between">
                        <a href="/" className="flex items-center gap-2">
                            <img src={logoPrefeitura} alt="Logo Prefeitura" className="h-8 w-auto" />
                        </a>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="rounded-md p-2 text-gray-700"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="mt-6 space-y-4">
                        {opcoesCadastro.map((item) => (
                            <a
                                key={item.nome}
                                href={`${item.href}?tipo=${item.nome}`}
                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                            >
                                {item.nome}
                            </a>
                        ))}
                        <a
                            href="/funcionalidades"
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Funcionalidades
                        </a>
                        <a
                            href="/cadastros/chamada"
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Chamada
                        </a>
                        <hr className="my-4" />
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                        >
                            <LogOut className="h-5 w-5" />
                            Sair
                        </button>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    );
}
