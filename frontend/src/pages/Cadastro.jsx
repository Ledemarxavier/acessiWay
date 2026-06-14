import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    ArrowRight,
    ArrowLeft,
    User,
    Settings,
    CheckCircle,
    Mail,
    Lock,
    Volume2,
    Captions,
    Eye,
    Type
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
    { num: 1, label: "Conta" },
    { num: 2, label: "Preferências" },
    { num: 3, label: "Conclusão" },
];

const CONTRAST_MODES = [
    {
        value: "normal",
        label: "Normal",
        bg: "bg-white",
        text: "text-slate-800",
        border: "border-slate-200"
    },
    {
        value: "high_contrast",
        label: "Alto Contraste",
        bg: "bg-black",
        text: "text-white",
        border: "border-gray-600"
    },
    {
        value: "inverted",
        label: "Invertido",
        bg: "bg-gray-900",
        text: "text-gray-100",
        border: "border-gray-600"
    },
    {
        value: "yellow_black",
        label: "Amarelo/Preto",
        bg: "bg-black",
        text: "text-yellow-300",
        border: "border-yellow-500/30"
    },
];

const FONTS = [
    { value: "default", label: "Padrão (Inter)" },
    { value: "atkinson", label: "Atkinson Hyperlegible" },
    { value: "opendyslexic", label: "OpenDyslexic" },
    { value: "arial", label: "Arial" },
    { value: "verdana", label: "Verdana" },
];

export default function Cadastro() {

    const [step, setStep] = useState(1);

    const { login } = useAuth();

    const [saving, setSaving] = useState(false);

    const [profile, setProfile] = useState({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",

        contrast_mode: "normal",
        font_family: "default",
        font_size: "normal",
        line_spacing: "normal",

        reading_guide: false,
        screen_reader_optimized: false,
        automatic_video_captions: false,
    });

    const updateField = (field, value) => {

        setProfile((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {

        if (
            profile.password !==
            profile.confirmPassword
        ) {
            alert("As senhas não coincidem");
            return;
        }

        setSaving(true);

        try {

            const response = await fetch(
                "https://acessiway.onrender.com/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(profile),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Erro ao cadastrar"
                );
            }

            login(data.user, data.token);

            setStep(3);

        } catch (e) {

            console.error(
                "Erro ao salvar perfil:",
                e.message
            );

            alert(e.message);

        } finally {

            setSaving(false);
        }
    };

    const canAdvance = () => {

        if (step === 1) {

            return (
                profile.name.trim() &&
                profile.email.trim() &&
                profile.password.trim() &&
                profile.confirmPassword.trim() &&
                profile.password ===
                profile.confirmPassword
            );
        }

        return true;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">

            {/* HEADER */}
            <div className="py-6 px-4">

                <div className="flex justify-center">

                    <Link
                        to={createPageUrl("Home")}
                        className="flex items-center gap-2.5"
                    >

                        <div className="w-9 h-9 bg-[#1e3a5f] rounded-xl flex items-center justify-center">

                            <span className="text-white font-bold text-sm">
                                A
                            </span>

                        </div>

                        <span className="text-[#1e3a5f] font-bold text-xl">
                            AcessiWay
                        </span>

                    </Link>

                </div>

            </div>

            {/* STEPS */}
            <div className="flex items-center justify-center gap-0 mb-10 px-4">

                {STEPS.map((s, i) => (

                    <React.Fragment key={s.num}>

                        <div
                            className={`
                                w-9 h-9 rounded-full
                                flex items-center justify-center
                                text-sm font-bold transition-colors
                                ${step >= s.num
                                    ? "bg-emerald-500 text-white"
                                    : "bg-slate-200 text-slate-400"}
                            `}
                        >

                            {step > s.num
                                ? (
                                    <CheckCircle className="w-5 h-5" />
                                )
                                : s.num
                            }

                        </div>

                        {i < STEPS.length - 1 && (

                            <div
                                className={`
                                    w-16 sm:w-20 h-0.5
                                    ${step > s.num
                                        ? "bg-emerald-500"
                                        : "bg-slate-200"}
                                `}
                            />

                        )}

                    </React.Fragment>
                ))}

            </div>

            {/* CONTENT */}
            <div className="flex-1 flex items-start justify-center px-4 pb-12">

                <div className="w-full max-w-lg">

                    <AnimatePresence mode="wait">

                        {/* STEP 1 */}
                        {step === 1 && (

                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="
                                    bg-white
                                    rounded-2xl
                                    shadow-sm
                                    border
                                    border-slate-100
                                    p-8
                                "
                            >

                                <div className="text-center mb-8">

                                    <div className="
                                        w-16 h-16
                                        bg-emerald-50
                                        rounded-full
                                        flex items-center justify-center
                                        mx-auto mb-4
                                    ">

                                        <User className="w-8 h-8 text-emerald-600" />

                                    </div>

                                    <h2 tabIndex={0} className="text-2xl font-extrabold text-[#0f2440]">
                                        Criar Conta
                                    </h2>

                                    <p className="text-slate-500 mt-2">
                                        Configure seu perfil personalizado.
                                    </p>

                                </div>

                                <div className="space-y-4">

                                    <div>

                                        <Label>Nome</Label>

                                        <Input
                                            placeholder="Digite seu nome"
                                            value={profile.name}
                                            onChange={(e) =>
                                                updateField(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            className="h-12"
                                        />

                                    </div>

                                    <div>

                                        <Label>Email</Label>

                                        <div className="relative">

                                            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

                                            <Input
                                                type="email"
                                                placeholder="Digite seu email"
                                                value={profile.email}
                                                onChange={(e) =>
                                                    updateField(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-12 pl-10"
                                            />

                                        </div>

                                    </div>

                                    <div>

                                        <Label>Senha</Label>

                                        <div className="relative">

                                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

                                            <Input
                                                type="password"
                                                placeholder="Digite sua senha"
                                                value={profile.password}
                                                onChange={(e) =>
                                                    updateField(
                                                        "password",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-12 pl-10"
                                            />

                                        </div>

                                    </div>

                                    <div>

                                        <Label>
                                            Confirmar Senha
                                        </Label>

                                        <div className="relative">

                                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />

                                            <Input
                                                type="password"
                                                placeholder="Confirme sua senha"
                                                value={profile.confirmPassword}
                                                onChange={(e) =>
                                                    updateField(
                                                        "confirmPassword",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-12 pl-10"
                                            />

                                        </div>

                                        {profile.confirmPassword &&
                                            profile.password !==
                                            profile.confirmPassword && (

                                                <p className="text-red-500 text-sm mt-2">
                                                    As senhas não coincidem
                                                </p>

                                            )}

                                    </div>

                                </div>

                                <Button
                                    className="
                                        w-full mt-6 h-12
                                        bg-[#1e3a5f]
                                        hover:bg-[#0f2440]
                                        rounded-xl
                                    "
                                    disabled={!canAdvance()}
                                    onClick={() => setStep(2)}
                                >

                                    Continuar

                                    <ArrowRight className="w-4 h-4 ml-2" />

                                </Button>

                            </motion.div>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (

                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="
                                    bg-white rounded-2xl
                                    shadow-sm border
                                    border-slate-100 p-8
                                "
                            >

                                <div className="text-center mb-8">

                                    <div className="
                                        w-16 h-16 bg-purple-50
                                        rounded-full flex
                                        items-center justify-center
                                        mx-auto mb-4
                                    ">

                                        <Settings className="w-8 h-8 text-purple-600" />

                                    </div>

                                    <h2 tabIndex={0} className="text-2xl font-extrabold text-[#0f2440]">
                                        Preferências de Acessibilidade
                                    </h2>

                                </div>

                                <div className="space-y-6">

                                    {/* CONTRASTE */}
                                    <div>

                                        <Label className="mb-3 block">
                                            Contraste
                                        </Label>

                                        <div className="grid grid-cols-2 gap-3">

                                            {CONTRAST_MODES.map((c) => (

                                                <button
                                                    key={c.value}
                                                    type="button"
                                                    onClick={() =>
                                                        updateField(
                                                            "contrast_mode",
                                                            c.value
                                                        )
                                                    }
                                                    className={`
                                                        ${c.bg}
                                                        ${c.text}
                                                        ${c.border}

                                                        p-3 rounded-xl
                                                        border-2
                                                        transition-all

                                                        ${profile.contrast_mode === c.value
                                                            ? "ring-4 ring-emerald-400 scale-105"
                                                            : "opacity-70 hover:opacity-100"}
                                                    `}
                                                >

                                                    {c.label}

                                                </button>

                                            ))}

                                        </div>

                                    </div>

                                    {/* FONTES */}
                                    <div>

                                        <Label className="mb-3 block">
                                            Fonte
                                        </Label>

                                        <div className="space-y-2">

                                            {FONTS.map((f) => (

                                                <button
                                                    key={f.value}
                                                    onClick={() =>
                                                        updateField(
                                                            "font_family",
                                                            f.value
                                                        )
                                                    }
                                                    className={`
                                                        w-full text-left
                                                        p-3 rounded-xl
                                                        border-2

                                                        ${profile.font_family === f.value
                                                            ? "border-emerald-500 bg-emerald-50"
                                                            : "border-slate-100"}
                                                    `}
                                                >

                                                    {f.label}

                                                </button>

                                            ))}

                                        </div>

                                    </div>

                                    {/* RECURSOS */}
                                    <div className="space-y-4">

                                        <Label className="block">
                                            Recursos Extras
                                        </Label>

                                        {/* LEITOR */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateField(
                                                    "screen_reader_optimized",
                                                    !profile.screen_reader_optimized
                                                )
                                            }
                                            className={`
                                                w-full flex
                                                items-center
                                                justify-between
                                                p-4 rounded-xl
                                                border-2 transition-all

                                                ${profile.screen_reader_optimized
                                                    ? "border-emerald-500 bg-emerald-50"
                                                    : "border-slate-100"}
                                            `}
                                        >

                                            <div className="flex items-center gap-3">

                                                <Volume2 className="w-5 h-5 text-[#1e3a5f]" />

                                                <div className="text-left">

                                                    <p className="font-semibold text-sm">
                                                        Leitor de Tela
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        Lê textos automaticamente
                                                    </p>

                                                </div>

                                            </div>

                                            <div className={`
                                                w-12 h-6 rounded-full relative
                                                ${profile.screen_reader_optimized
                                                    ? "bg-emerald-500"
                                                    : "bg-slate-300"}
                                            `}>

                                                <div className={`
                                                    absolute top-1 w-4 h-4
                                                    rounded-full bg-white
                                                    transition-all
                                                    ${profile.screen_reader_optimized
                                                        ? "right-1"
                                                        : "left-1"}
                                                `} />

                                            </div>

                                        </button>

                                        {/* GUIA */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateField(
                                                    "reading_guide",
                                                    !profile.reading_guide
                                                )
                                            }
                                            className={`
                                                w-full flex
                                                items-center
                                                justify-between
                                                p-4 rounded-xl
                                                border-2 transition-all

                                                ${profile.reading_guide
                                                    ? "border-emerald-500 bg-emerald-50"
                                                    : "border-slate-100"}
                                            `}
                                        >

                                            <div className="flex items-center gap-3">

                                                <Eye className="w-5 h-5 text-[#1e3a5f]" />

                                                <div className="text-left">

                                                    <p className="font-semibold text-sm">
                                                        Guia de Leitura
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        Linha guia para foco visual
                                                    </p>

                                                </div>

                                            </div>

                                            <div className={`
                                                w-12 h-6 rounded-full relative
                                                ${profile.reading_guide
                                                    ? "bg-emerald-500"
                                                    : "bg-slate-300"}
                                            `}>

                                                <div className={`
                                                    absolute top-1 w-4 h-4
                                                    rounded-full bg-white
                                                    transition-all
                                                    ${profile.reading_guide
                                                        ? "right-1"
                                                        : "left-1"}
                                                `} />

                                            </div>

                                        </button>

                                       

                                        {/* LEGENDAS */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateField(
                                                    "automatic_video_captions",
                                                    !profile.automatic_video_captions
                                                )
                                            }
                                            className={`
                                                w-full flex
                                                items-center
                                                justify-between
                                                p-4 rounded-xl
                                                border-2 transition-all

                                                ${profile.automatic_video_captions
                                                    ? "border-emerald-500 bg-emerald-50"
                                                    : "border-slate-100"}
                                            `}
                                        >

                                            <div className="flex items-center gap-3">

                                                <Captions className="w-5 h-5 text-[#1e3a5f]" />

                                                <div className="text-left">

                                                    <p className="font-semibold text-sm">
                                                        Legendas Automáticas
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        Ativa legendas em vídeos
                                                    </p>

                                                </div>

                                            </div>

                                            <div className={`
                                                w-12 h-6 rounded-full relative
                                                ${profile.automatic_video_captions
                                                    ? "bg-emerald-500"
                                                    : "bg-slate-300"}
                                            `}>

                                                <div className={`
                                                    absolute top-1 w-4 h-4
                                                    rounded-full bg-white
                                                    transition-all
                                                    ${profile.automatic_video_captions
                                                        ? "right-1"
                                                        : "left-1"}
                                                `} />

                                            </div>

                                        </button>

                                    </div>

                                </div>

                                <div className="flex gap-3 mt-6">

                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12"
                                        onClick={() => setStep(1)}
                                    >

                                        <ArrowLeft className="w-4 h-4 mr-2" />

                                        Voltar

                                    </Button>

                                    <Button
                                        className="
                                            flex-1 h-12
                                            bg-emerald-500
                                            hover:bg-emerald-600
                                        "
                                        onClick={handleSave}
                                        disabled={saving}
                                    >

                                        {saving
                                            ? "Salvando..."
                                            : "Salvar Perfil"}

                                    </Button>

                                </div>

                            </motion.div>
                        )}

                        {/* STEP 3 */}
                        {step === 3 && (

                            <motion.div
                                key="step3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="
                                    bg-white rounded-2xl
                                    shadow-sm border
                                    border-slate-100
                                    p-8 text-center
                                "
                            >

                                <div className="
                                    w-20 h-20 bg-emerald-50
                                    rounded-full flex
                                    items-center justify-center
                                    mx-auto mb-6
                                ">

                                    <CheckCircle className="w-10 h-10 text-emerald-500" />

                                </div>

                                <h2 tabIndex={0} className="
                                    text-2xl font-extrabold
                                    text-[#0f2440] mb-3
                                ">
                                    Cadastro realizado!
                                </h2>

                                <p className="text-slate-500 mb-8">
                                    Seu perfil foi criado com sucesso.
                                </p>

                                <Link to={createPageUrl("Home")}>

                                    <Button className="w-full h-12 bg-[#1e3a5f]">
                                        Ir para Home
                                    </Button>

                                </Link>

                            </motion.div>
                        )}

                    </AnimatePresence>

                </div>

            </div>

        </div>
    );
}