import React, { useState } from "react";

import {
    Eye,
    Play,
    Volume2,
    FileText,
    Captions,
    Accessibility
} from "lucide-react";

import { Button } from "@/components/ui/button";

import ContentCard from "@/components/conteudo/ContentCard";

import { useAuth } from "@/lib/AuthContext";

const FILTERS = [
    {
        value: "all",
        label: "Todos",
        icon: Eye
    },
    {
        value: "video",
        label: "Vídeo",
        icon: Play
    },
    {
        value: "audio",
        label: "Áudio",
        icon: Volume2
    },
    {
        value: "artigo",
        label: "Artigo",
        icon: FileText
    },
];

const CONTENT = [
    {
        type: "video",

        title: "Introdução à Acessibilidade Web",

        description:
            "Aprenda os conceitos básicos de acessibilidade digital e WCAG 2.2 com exemplos práticos e demonstrações reais.",

        duration: "12:30",

        image:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",

        tags: [
            "Legendas CC",
            "Audiodescrição"
        ],

        // ID LIMPO
        videoId: "M7lc1UVf-VE",
    },

    {
        type: "video",

        title: "Como Funciona um Leitor de Tela",

        description:
            "Conheça os princípios dos leitores de tela, navegação acessível e estrutura semântica na web.",

        duration: "09:40",

        image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",

        tags: [
            "Leitor de Tela",
            "WCAG",
            "Acessibilidade"
        ],

        videoId: "gnO_6NDfQHI",
    },

    {
        type: "audio",

        title: "Recursos de Leitura de Tela",

        description:
            "Como usar NVDA, JAWS e VoiceOver: guia narrado completo para escolher e configurar o leitor de tela ideal para você.",

        duration: "8:15",

        image: null,

        tags: [
            "Legendas CC",
            "Audiodescrição",
            "Braille"
        ],
    },

    {
        type: "artigo",

        title: "Navegação por Teclado: Guia Completo",

        description:
            "Guia completo de atalhos e técnicas de navegação sem mouse, com exemplos práticos para Windows, Mac e Linux.",

        duration: "6 min de leitura",

        image: null,

        tags: [
            "Audiodescrição",
            "Braille",
            "Leitor de Tela"
        ],

        articleContent: [

            "A navegação por teclado é uma das formas mais importantes de acessibilidade digital.",

            "A tecla Tab é a principal ferramenta de navegação.",

            "Atalhos essenciais no Windows: Alt + F4 fecha a janela atual.",

            "No Mac, o Command substitui o Ctrl na maioria dos atalhos.",

            "Em navegadores web, F6 alterna entre diferentes áreas da janela.",

            "Para usuários de leitores de tela como NVDA ou JAWS, existem modos especiais de navegação.",

            "Boas práticas para desenvolvedores: sempre garanta que todos os elementos interativos sejam focáveis.",

            "Praticar a navegação por teclado regularmente ajuda a identificar barreiras."
        ],
    },
];

export default function Conteudo() {

    const [filter, setFilter] =
        useState("all");

    const { user } = useAuth();

    const filtered =
        filter === "all"
            ? CONTENT
            : CONTENT.filter(
                (c) => c.type === filter
            );

    return (

        <div className="min-h-screen bg-slate-50">

            <div
                className="
                    max-w-5xl
                    mx-auto
                    px-4
                    sm:px-6
                    lg:px-8
                    py-12
                "
            >

                {/* HEADER */}
                <div className="mb-10">

                    <div className="flex items-center gap-3 mb-4">

                        <div
                            className="
                                w-14
                                h-14
                                rounded-2xl
                                bg-[#1e3a5f]
                                text-white
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <Accessibility className="w-7 h-7" />

                        </div>

                        <div>

                            <h1
                                tabIndex={0}
                                className="
                                    text-3xl
                                    sm:text-4xl
                                    font-extrabold
                                    text-[#0f2440]
                                "
                            >
                                Conteúdo Acessível
                            </h1>

                            <p className="text-slate-500 mt-1">

                                Plataforma inclusiva de aprendizagem.

                            </p>

                        </div>

                    </div>

                    <p
                        className="
                            text-slate-500
                            max-w-2xl
                            leading-relaxed
                        "
                    >

                        Biblioteca curada com vídeo,
                        legenda automática,
                        audiodescrição,
                        leitor de tela integrado,
                        transcrição sincronizada
                        e conteúdo adaptado.

                    </p>

                </div>

                {/* FILTROS */}
                <div
                    className="
                        flex
                        flex-wrap
                        gap-2
                        mb-8
                    "
                >

                    {FILTERS.map((f) => (

                        <Button
                            key={f.value}
                            variant={
                                filter === f.value
                                    ? "default"
                                    : "outline"
                            }
                            className={`
                                rounded-full
                                gap-2
                                transition-all

                                ${filter === f.value
                                    ? "bg-[#1e3a5f] hover:bg-[#0f2440]"
                                    : "hover:bg-slate-100"}
                            `}
                            onClick={() =>
                                setFilter(f.value)
                            }
                            aria-label={`Filtrar conteúdo por ${f.label}`}
                        >

                            <f.icon className="w-4 h-4" />

                            {f.label}

                        </Button>

                    ))}

                </div>

                {/* LISTA */}
                <div className="space-y-6">

                    {filtered.map((item, i) => (

                        <ContentCard
                            key={i}
                            item={item}
                            index={i}
                        />

                    ))}

                </div>

            </div>

        </div>
    );
}