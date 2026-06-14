import React, { useState, useEffect } from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import { createPageUrl } from "@/utils";

import { useAuth } from "@/lib/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Mail,
    Lock,
    ArrowRight,
    LogIn,
    Volume2,
    Captions,
    BookOpen
} from "lucide-react";

import { motion } from "framer-motion";

export default function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [loading, setLoading] =
        useState(false);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [preferences, setPreferences] =
        useState({
            screenReader: false,
            captions: false,
            readingAssistant: false,
        });

    // =========================
    // UPDATE FIELD
    // =========================
    const updateField = (field, value) => {

        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // =========================
    // APLICAR PREFERÊNCIAS
    // =========================
    const applyAccessibility =
        (user) => {

            // LEITOR DE TELA
            if (
                user.screen_reader_optimized
            ) {

                document
                    .querySelectorAll(
                        "button, a, input, textarea, select, h1, h2, h3, h4, h5, h6, p, span"
                    )
                    .forEach((element) => {

                        const label =
                            element.innerText ||
                            element.placeholder ||
                            element.value;

                        if (!label) return;

                        if (
                            element.tagName ===
                            "BUTTON"
                        ) {

                            element.setAttribute(
                                "aria-label",
                                `Botão ${label}`
                            );
                        }

                        else if (
                            element.tagName === "A"
                        ) {

                            element.setAttribute(
                                "aria-label",
                                `Link ${label}`
                            );
                        }

                        else if (
                            element.tagName ===
                            "INPUT"
                        ) {

                            element.setAttribute(
                                "aria-label",
                                `Campo ${label}`
                            );
                        }

                        else {

                            element.setAttribute(
                                "aria-label",
                                `Texto ${label}`
                            );
                        }
                    });
            }

            // TRANSCRIÇÃO AUTOMÁTICA
            if (
                user.automatic_video_captions
            ) {

                document
                    .querySelectorAll("video")
                    .forEach((video) => {

                        const tracks =
                            video.querySelectorAll(
                                "track"
                            );

                        tracks.forEach((track) => {

                            track.mode =
                                "showing";
                        });
                    });
            }

            // ASSISTENTE DE LEITURA
            if (
                user.reading_assistant
            ) {

                document.body.classList.add(
                    "reading-assistant-active"
                );
            }
        };

    // =========================
    // LOGIN
    // =========================
    const handleLogin = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await fetch(
                "https://acessiway-backend.onrender.com",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(form),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Erro ao fazer login"
                );
            }

            console.log(
                "Login realizado:",
                data
            );

            // CONTEXTO
            login(
                data.user,
                data.token
            );

            // LOCAL STORAGE
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            localStorage.setItem(
                "token",
                data.token
            );

            // PREFERÊNCIAS
            setPreferences({
                screenReader:
                    data.user
                        .screen_reader_optimized,

                captions:
                    data.user
                        .automatic_video_captions,

                readingAssistant:
                    data.user
                        .reading_assistant,
            });

            // APLICAR
            applyAccessibility(
                data.user
            );

            // REDIRECIONAR
            navigate(
                createPageUrl("Home")
            );

        } catch (e) {

            console.error(
                "Erro login:",
                e.message
            );

            alert(e.message);

        } finally {

            setLoading(false);
        }
    };

    // =========================
    // VALIDAR
    // =========================
    const isValid =
        form.email.trim() &&
        form.password.trim();

    // =========================
    // EFFECT
    // =========================
    useEffect(() => {

        const style =
            document.createElement(
                "style"
            );

        style.innerHTML = `
            .reading-assistant-active p,
            .reading-assistant-active span,
            .reading-assistant-active li {

                line-height: 2.2 !important;
                letter-spacing: 0.03em;
            }

            .reading-assistant-active {

                background: #f8fafc;
            }
        `;

        document.head.appendChild(style);

        return () => {

            document.head.removeChild(style);
        };

    }, []);

    return (
        <div className="
            min-h-screen
            bg-slate-50
            flex
            items-center
            justify-center
            px-4
        ">

            <motion.div
                initial={{
                    opacity: 0,
                    y: 30
                }}

                animate={{
                    opacity: 1,
                    y: 0
                }}

                className="
                    w-full
                    max-w-md
                    bg-white
                    rounded-3xl
                    shadow-sm
                    border
                    border-slate-100
                    p-8
                "
            >

                {/* LOGO */}
                <div className="
                    flex
                    justify-center
                    mb-8
                ">

                    <Link
                        to={createPageUrl("Home")}
                        className="
                            flex
                            items-center
                            gap-2.5
                        "
                    >

                        <div className="
                            w-10
                            h-10
                            bg-[#1e3a5f]
                            rounded-xl
                            flex
                            items-center
                            justify-center
                        ">

                            <span className="
                                text-white
                                font-bold
                                text-sm
                            ">
                                A
                            </span>

                        </div>

                        <span className="
                            text-[#1e3a5f]
                            font-bold
                            text-2xl
                        ">
                            AcessiWay
                        </span>

                    </Link>

                </div>

                {/* HEADER */}
                <div className="
                    text-center
                    mb-8
                ">

                    <div className="
                        w-16
                        h-16
                        bg-blue-50
                        rounded-full
                        flex
                        items-center
                        justify-center
                        mx-auto
                        mb-4
                    ">

                        <LogIn className="
                            w-8
                            h-8
                            text-blue-600
                        " />

                    </div>

                    <h1
                    className="
                        text-3xl
                        font-extrabold
                        text-[#0f2440]
                    ">
                        Entrar
                    </h1>

                    

                </div>

                {/* FORM */}
                <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                >

                    {/* EMAIL */}
                    <div>

                        <Label>
                            Email
                        </Label>

                        <div className="
                            relative
                            mt-2
                        ">

                            <Mail className="
                                absolute
                                left-3
                                top-3.5
                                w-5
                                h-5
                                text-slate-400
                            " />

                            <Input
                                type="email"
                                placeholder="Digite seu email"
                                value={form.email}
                                onChange={(e) =>
                                    updateField(
                                        "email",
                                        e.target.value
                                    )
                                }
                                className="
                                    h-12
                                    pl-10
                                    rounded-xl
                                "
                            />

                        </div>

                    </div>

                    {/* SENHA */}
                    <div>

                        <Label>
                            Senha
                        </Label>

                        <div className="
                            relative
                            mt-2
                        ">

                            <Lock className="
                                absolute
                                left-3
                                top-3.5
                                w-5
                                h-5
                                text-slate-400
                            " />

                            <Input
                                type="password"
                                placeholder="Digite sua senha"
                                value={form.password}
                                onChange={(e) =>
                                    updateField(
                                        "password",
                                        e.target.value
                                    )
                                }
                                className="
                                    h-12
                                    pl-10
                                    rounded-xl
                                "
                            />

                        </div>

                    </div>

                    {/* BUTTON */}
                    <Button
                        type="submit"

                        disabled={
                            !isValid ||
                            loading
                        }

                        className="
                            w-full
                            h-12
                            rounded-xl
                            bg-[#1e3a5f]
                            hover:bg-[#0f2440]
                            text-white
                            font-semibold
                            gap-2
                        "
                    >

                        {loading
                            ? "Entrando..."
                            : (
                                <>
                                    Entrar

                                    <ArrowRight className="
                                        w-4
                                        h-4
                                    " />
                                </>
                            )
                        }

                    </Button>

                </form>

                {/* CADASTRO */}
                <div className="
                    mt-8
                    text-center
                ">

                    

                    <Link
                        to={createPageUrl("Cadastro")}

                        className="
                            inline-block
                            mt-2
                            text-[#1e3a5f]
                            font-semibold
                            hover:underline
                        "
                    >

                        Criar conta

                    </Link>

                </div>

            </motion.div>

        </div>
    );
}