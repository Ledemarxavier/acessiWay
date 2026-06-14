import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";

import { useAuth } from "@/lib/AuthContext";

import {
    Menu,
    X,
    ArrowRight,
    LogIn,
    User,
    LogOut
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Navbar({ currentPage }) {

    const [mobileOpen, setMobileOpen] = useState(false);

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const location = useLocation();

    const handleLogout = () => {

        logout();

        navigate(createPageUrl("Home"));
    };

    const handleHashLink = (e, page, hash) => {

        e.preventDefault();

        const targetPath = createPageUrl(page);

        if (
            location.pathname === targetPath ||
            location.pathname === "/"
        ) {

            const el = document.querySelector(hash);

            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            }

        } else {

            navigate(targetPath + hash);

            setTimeout(() => {

                const el = document.querySelector(hash);

                if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                }

            }, 300);
        }

        setMobileOpen(false);
    };

    const links = [
        { label: "Funcionalidades", page: "Home", hash: "#features" },
        { label: "Como Funciona", page: "Home", hash: "#how-it-works" },
        { label: "Qualidade", page: "Home", hash: "#quality" },
        { label: "Conteúdo", page: "Conteudo" },
        { label: "Conversor", page: "Conversor" },
        { label: "Ajuda", page: "Ajuda" },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link
                        to={createPageUrl("Home")}
                        className="flex items-center gap-2.5"
                    >

                        <div className="w-9 h-9 bg-[#1e3a5f] rounded-xl flex items-center justify-center">

                            <span className="text-white font-bold text-sm">
                                A
                            </span>

                        </div>

                        <span className="text-[#1e3a5f] font-bold text-xl tracking-tight">
                            AcessiWay
                        </span>

                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-1">

                        {links.map((link) => (

                            <Link
                                key={link.label}
                                to={
                                    link.hash
                                        ? createPageUrl(link.page) + link.hash
                                        : createPageUrl(link.page)
                                }
                                onClick={
                                    link.hash
                                        ? (e) =>
                                            handleHashLink(
                                                e,
                                                link.page,
                                                link.hash
                                            )
                                        : undefined
                                }
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === link.page &&
                                    !link.hash
                                    ? "text-[#1e3a5f] bg-slate-50"
                                    : "text-slate-600 hover:text-[#1e3a5f] hover:bg-slate-50"
                                    }`}
                            >

                                {link.label}

                            </Link>
                        ))}

                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-3">

                        {user ? (

                            <>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100">

                                    <User className="w-4 h-4 text-[#1e3a5f]" />

                                    <span className="text-sm font-medium text-slate-700">
                                        {user.name}
                                    </span>

                                </div>

                                <Button
                                    variant="outline"
                                    className="rounded-full gap-2"
                                    onClick={handleLogout}
                                >

                                    <LogOut className="w-4 h-4" />

                                    Sair

                                </Button>
                            </>

                        ) : (

                            <>
                                <Link to={createPageUrl("Login")}>

                                    <Button
                                        variant="outline"
                                        className="rounded-full gap-2"
                                    >

                                        <LogIn className="w-4 h-4" />

                                        Entrar

                                    </Button>

                                </Link>

                                <Link to={createPageUrl("Cadastro")}>

                                    <Button className="bg-[#1e3a5f] hover:bg-[#0f2440] text-white rounded-full px-5 gap-2">

                                        Criar Perfil

                                        <ArrowRight className="w-4 h-4" />

                                    </Button>

                                </Link>
                            </>
                        )}

                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >

                        {mobileOpen
                            ? <X className="w-5 h-5" />
                            : <Menu className="w-5 h-5" />
                        }

                    </button>

                </div>

            </div>

            {/* Mobile Menu */}
            {mobileOpen && (

                <div className="lg:hidden border-t border-slate-100 bg-white pb-4">

                    <div className="px-4 pt-2 space-y-1">

                        {links.map((link) => (

                            <Link
                                key={link.label}
                                to={
                                    link.hash
                                        ? createPageUrl(link.page) + link.hash
                                        : createPageUrl(link.page)
                                }
                                className="block px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-[#1e3a5f] hover:bg-slate-50 rounded-lg"
                                onClick={
                                    link.hash
                                        ? (e) =>
                                            handleHashLink(
                                                e,
                                                link.page,
                                                link.hash
                                            )
                                        : () => setMobileOpen(false)
                                }
                            >

                                {link.label}

                            </Link>
                        ))}

                        {/* Mobile User */}
                        {user ? (

                            <div className="pt-4 space-y-3">

                                <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-slate-100">

                                    <User className="w-4 h-4 text-[#1e3a5f]" />

                                    <span className="text-sm font-medium text-slate-700">
                                        {user.name}
                                    </span>

                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full rounded-full gap-2"
                                    onClick={handleLogout}
                                >

                                    <LogOut className="w-4 h-4" />

                                    Sair

                                </Button>

                            </div>

                        ) : (

                            <div className="pt-4 space-y-3">

                                <Link
                                    to={createPageUrl("Login")}
                                    onClick={() => setMobileOpen(false)}
                                >

                                    <Button
                                        variant="outline"
                                        className="w-full rounded-full gap-2"
                                    >

                                        <LogIn className="w-4 h-4" />

                                        Entrar

                                    </Button>

                                </Link>

                                <Link
                                    to={createPageUrl("Cadastro")}
                                    onClick={() => setMobileOpen(false)}
                                >

                                    <Button className="w-full bg-[#1e3a5f] hover:bg-[#0f2440] text-white rounded-full gap-2">

                                        Criar Perfil

                                        <ArrowRight className="w-4 h-4" />

                                    </Button>

                                </Link>

                            </div>
                        )}

                    </div>

                </div>
            )}

        </nav>
    );
}