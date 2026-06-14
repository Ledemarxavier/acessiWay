import React, { useState, useEffect, useRef } from "react";

import {
    Accessibility,
    SlidersHorizontal,
    X,
    Type,
    Sun,
    AlignLeft,
    BookOpen,
    RotateCcw,
    Volume2,
    Eye,
    Play,
    Pause,
    ZoomIn,
    ZoomOut,
    Maximize2,
} from "lucide-react";

import { useAuth } from "@/lib/AuthContext";

const CONTRAST_MODES = [
    { value: "normal", label: "Normal" },
    { value: "high_contrast", label: "Alto Contraste" },
    { value: "inverted", label: "Invertido" },
    { value: "yellow_black", label: "Amarelo/Preto" },
];

const FONTS = [
    { value: "default", label: "Padrão" },
    { value: "arial", label: "Arial" },
    { value: "verdana", label: "Verdana" },
    { value: "opendyslexic", label: "OpenDyslexic" },
];

const MAGNIFIER_MODES = [
    { value: "off", label: "Desligada" },
    { value: "lens", label: "Lente" },
    { value: "section", label: "Seção" },
    { value: "fullscreen", label: "Tela Total" },
];

const defaultSettings = {
    fontSize: 100,
    contrast: "normal",
    font: "default",
    lineSpacing: "normal",
    readingGuide: false,
    screenReader: false,
    magnifier: "off",
    magnifierZoom: 2,
};

// Aplica apenas fonte/tamanho/espaçamento localmente
// O contraste é gerenciado exclusivamente pelo AccessibilityContext via classes no html
function applyLocalSettings(settings) {
    const root = document.documentElement;
    root.style.fontSize = settings.fontSize + "%";

    const fontMap = {
        default: "'Inter', sans-serif",
        arial: "Arial, sans-serif",
        verdana: "Verdana, sans-serif",
        opendyslexic: "'OpenDyslexic', sans-serif",
    };
    document.body.style.fontFamily = fontMap[settings.font] || fontMap.default;

    const spacingMap = { normal: "1.5", relaxed: "1.8", loose: "2.2" };
    document.body.style.lineHeight = spacingMap[settings.lineSpacing] || "1.5";
}

export default function AccessibilityToolbar() {

    const { user, setUser } = useAuth();
    const [open, setOpen] = useState(false);
    const [settings, setSettings] = useState(defaultSettings);
    const settingsRef = useRef(settings);

    useEffect(() => {
        settingsRef.current = settings;
    }, [settings]);

    // ==========================================
    // CARREGA CONFIGURAÇÕES DO USUÁRIO
    // ==========================================
    useEffect(() => {

        if (!user) {
            setSettings(defaultSettings);
            applyLocalSettings(defaultSettings);
            return;
        }

        const userSettings = {
            fontSize:
                user.font_size === "large" ? 120
                    : user.font_size === "extra-large" ? 140
                        : 100,
            contrast: user.contrast_mode || "normal",
            font: user.font_family || "default",
            lineSpacing: user.line_spacing || "normal",
            readingGuide: user.reading_guide || false,
            screenReader: user.screen_reader_optimized || false,
            magnifier: "off",
            magnifierZoom: 2,
        };

        setSettings(userSettings);
        applyLocalSettings(userSettings);

    }, [user]);

    useEffect(() => {
        applyLocalSettings(settings);
    }, [settings]);

    // ==========================================
    // GUIA DE LEITURA — position:fixed fora do #page-content
    // ==========================================
    useEffect(() => {
        let guide = document.getElementById("reading-guide-line");

        if (settings.readingGuide) {

            if (!guide) {
                guide = document.createElement("div");
                guide.id = "reading-guide-line";
                guide.style.position = "fixed";
                guide.style.left = "0";
                guide.style.width = "100%";
                guide.style.height = "4px";
                guide.style.background = "rgba(255,255,0,0.7)";
                guide.style.pointerEvents = "none";
                guide.style.zIndex = "999999";
                document.body.appendChild(guide);
            }

            const moveGuide = (e) => {
                guide.style.top = e.clientY + "px";
            };

            window.addEventListener("mousemove", moveGuide);

            return () => {
                window.removeEventListener("mousemove", moveGuide);
                if (guide) guide.remove();
            };
        }

        if (guide) guide.remove();

    }, [settings.readingGuide]);

    // ==========================================
    // LUPA VIRTUAL — 3 modos: lens, section, fullscreen
    // ==========================================
    useEffect(() => {

        const cleanup = () => {
            const old = document.getElementById("virtual-magnifier");
            if (old) old.remove();
            const oldCanvas = document.getElementById("magnifier-canvas");
            if (oldCanvas) oldCanvas.remove();
            const magnifiedTextSpan = document.querySelector('#virtual-magnifier > span');
            if (magnifiedTextSpan) magnifiedTextSpan.remove();

            document.body.style.cursor = "";
        };

        cleanup();

        if (settings.magnifier === "off") return;

        const zoom = settings.magnifierZoom || 2;

        if (settings.magnifier === "lens") {

            const size = 200;
            const lens = document.createElement("div");
            lens.id = "virtual-magnifier";
            lens.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                border: 3px solid #1e3a5f;
                overflow: hidden;
                pointer-events: none;
                z-index: 999998;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            document.body.appendChild(lens);

            const magnifiedTextSpan = document.createElement("span");
            magnifiedTextSpan.style.cssText = `
                font-size: 12px;
                line-height: 1.4;
                color: #0f2440;
                font-weight: 500;
                text-align: center;
                display: block;
                padding: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            `;
            magnifiedTextSpan.textContent = "Mova o mouse";
            lens.appendChild(magnifiedTextSpan);

            const move = (e) => {
                const x = e.clientX;
                const y = e.clientY;
                lens.style.left = (x - size / 2) + "px";
                lens.style.top = (y - size / 2) + "px";

                const el = document.elementFromPoint(e.clientX, e.clientY);
                if (el && el !== lens && el.textContent?.trim()) {
                    const text = el.textContent.trim().slice(0, 80);
                    magnifiedTextSpan.textContent = text || "...";
                    magnifiedTextSpan.style.fontSize = `${14 * zoom}px`;
                } else {
                    magnifiedTextSpan.textContent = "Mova o mouse";
                    magnifiedTextSpan.style.fontSize = "12px";
                }
            };

            window.addEventListener("mousemove", move);
            return () => {
                window.removeEventListener("mousemove", move);
                cleanup();
            };
        }

        if (settings.magnifier === "section") {

            const panel = document.createElement("div");
            panel.id = "virtual-magnifier";
            panel.style.cssText = `
                position: fixed;
                bottom: 100px;
                left: 16px;
                width: 320px;
                height: 120px;
                border: 3px solid #1e3a5f;
                border-radius: 12px;
                background: white;
                overflow: hidden;
                pointer-events: none;
                z-index: 999998;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                padding: 8px;
                font-size: 11px;
                color: #555;
            `;

            const label = document.createElement("div");
            label.style.cssText = "font-size:10px;color:#1e3a5f;font-weight:bold;margin-bottom:4px;";
            label.textContent = `Lupa de Seção (${zoom}x)`;

            const content = document.createElement("div");
            content.id = "magnifier-content";
            content.style.cssText = `
                font-size: ${14 * zoom}px;
                line-height: 1.4;
                overflow: hidden;
                color: #0f2440;
                font-weight: 500;
            `;
            content.textContent = "Passe o mouse sobre o texto...";

            panel.appendChild(label);
            panel.appendChild(content);
            document.body.appendChild(panel);

            const move = (e) => {
                const el = document.elementFromPoint(e.clientX, e.clientY);
                if (el && el !== panel && el.textContent?.trim()) {
                    const text = el.textContent.trim().slice(0, 80);
                    content.textContent = text || "...";
                }
            };

            window.addEventListener("mousemove", move);
            return () => {
                window.removeEventListener("mousemove", move);
                cleanup();
            };
        }

        if (settings.magnifier === "fullscreen") {

            const overlay = document.createElement("div");
            overlay.id = "virtual-magnifier";
            overlay.style.cssText = `
                position: fixed;
                top: 0; left: 0;
                width: 100vw;
                height: 60px;
                background: #1e3a5f;
                color: white;
                z-index: 999998;
                pointer-events: none;
                display: flex;
                align-items: center;
                padding: 0 24px;
                font-size: ${16 * zoom}px;
                font-weight: 600;
                letter-spacing: 0.5px;
                border-bottom: 3px solid #22c55e;
                overflow: hidden;
            `;
            overlay.textContent = "Lupa Tela Total ativada — passe o mouse sobre o texto";
            document.body.appendChild(overlay);

            const move = (e) => {
                const el = document.elementFromPoint(e.clientX, e.clientY);
                if (el && el !== overlay && el.textContent?.trim()) {
                    overlay.textContent = el.textContent.trim().slice(0, 120);
                }
            };

            window.addEventListener("mousemove", move);
            return () => {
                window.removeEventListener("mousemove", move);
                cleanup();
            };
        }

    }, [settings.magnifier, settings.magnifierZoom]);

    // ==========================================
    // NAVEGAÇÃO POR TECLADO + ATALHOS
    // ==========================================
    useEffect(() => {

        const isTyping = () => {
            const active = document.activeElement;
            if (!active) return false;
            const tag = active.tagName?.toLowerCase();
            return tag === "input" || tag === "textarea" || active.isContentEditable;
        };

        const focusNext = (selector, reverse = false) => {
            const elements = Array.from(document.querySelectorAll(selector))
                .filter((el) => el.offsetParent !== null);
            if (!elements.length) return;

            const active = document.activeElement;
            let index = elements.indexOf(active);
            index = reverse ? index - 1 : index + 1;
            if (index >= elements.length) index = 0;
            if (index < 0) index = elements.length - 1;

            elements[index]?.focus();
            elements[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
        };

        const handleKeyDown = (e) => {

            // ALT + + → aumenta fonte
            if (e.altKey && (e.key === "+" || e.key === "=")) {
                e.preventDefault();
                update("fontSize", Math.min(200, settingsRef.current.fontSize + 10));
            }

            // ALT + - → diminui fonte
            if (e.altKey && e.key === "-") {
                e.preventDefault();
                update("fontSize", Math.max(80, settingsRef.current.fontSize - 10));
            }

            // ALT + C → alterna contraste
            if (e.altKey && e.key.toLowerCase() === "c") {
                e.preventDefault();
                const modes = ["normal", "high_contrast", "inverted", "yellow_black"];
                const current = settingsRef.current.contrast;
                const next = modes[(modes.indexOf(current) + 1) % modes.length];
                update("contrast", next);
            }

            // ALT + G → guia de leitura
            if (e.altKey && e.key.toLowerCase() === "g") {
                e.preventDefault();
                update("readingGuide", !settingsRef.current.readingGuide);
            }

            // ALT + L → lupa
            if (e.altKey && e.key.toLowerCase() === "l") {
                e.preventDefault();
                const modes = ["off", "lens", "section", "fullscreen"];
                const current = settingsRef.current.magnifier;
                const next = modes[(modes.indexOf(current) + 1) % modes.length];
                update("magnifier", next);
            }

            // ALT + 0 → reset
            if (e.altKey && e.key === "0") {
                e.preventDefault();
                reset();
            }

            if (isTyping()) return;

            // H / SHIFT+H → headings
            if (e.key.toLowerCase() === "h") {
                e.preventDefault();
                focusNext("h1, h2, h3, h4, h5, h6", e.shiftKey);
            }

            // T / SHIFT+T → tabelas
            if (e.key.toLowerCase() === "t") {
                e.preventDefault();
                focusNext("table", e.shiftKey);
            }

            // K / SHIFT+K → links e botões
            if (e.key.toLowerCase() === "k") {
                e.preventDefault();
                focusNext(`a[href], button, [role="button"]`, e.shiftKey);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        const style = document.createElement("style");
        style.id = "a11y-focus-style";
        style.innerHTML = `
            *:focus-visible {
                outline: 3px solid #22c55e !important;
                outline-offset: 3px !important;
                border-radius: 8px !important;
            }
            html { scroll-behavior: smooth; }
        `;
        document.head.appendChild(style);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            style.remove();
        };

    }, []);

    // ==========================================
    // LEITOR DE TELA
    // ==========================================
    useEffect(() => {

        if (!settings.screenReader) {
            window.speechSynthesis.cancel();
            return;
        }

        const speakText = (text) => {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "pt-BR";
            utterance.rate = 1;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        };

        const handleMouseEnter = (e) => {
            const element = e.target;
            let text =
                element.innerText ||
                element.value ||
                element.getAttribute("aria-label") ||
                element.placeholder || "";

            text = text.trim();
            if (!text || text.length > 250) return;

            const tag = element.tagName.toLowerCase();
            const roleText =
                tag === "button" || element.getAttribute("role") === "button" ? "Botão"
                    : tag === "a" ? "Link"
                        : tag === "input" || tag === "textarea" ? "Campo de texto"
                            : tag === "img" ? "Imagem"
                                : tag === "select" ? "Lista de seleção"
                                    : "Texto";

            speakText(`${roleText}. ${text}`);
        };

        document.body.addEventListener("mouseenter", handleMouseEnter, true);

        return () => {
            document.body.removeEventListener("mouseenter", handleMouseEnter, true);
            window.speechSynthesis.cancel();
        };

    }, [settings.screenReader]);

    // ==========================================
    // SALVAR
    // ==========================================
    const update = async (key, value) => {

        const updatedSettings = { ...settings, [key]: value };
        setSettings(updatedSettings);

        if (!user) return;

        const payload = {
            contrast_mode: updatedSettings.contrast,
            font_family: updatedSettings.font,
            font_size:
                updatedSettings.fontSize >= 140 ? "extra-large"
                    : updatedSettings.fontSize >= 120 ? "large"
                        : "normal",
            line_spacing: updatedSettings.lineSpacing,
            reading_guide: updatedSettings.readingGuide,
            screen_reader_optimized: updatedSettings.screenReader,
        };

        // Atualiza localmente de imediato para o AccessibilityContext reagir
        const updatedUser = { ...user, ...payload };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        try {
            const response = await fetch(
                `https://acessiway-backend.onrender.com/api/users/atualizar/${user.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) throw new Error("Erro ao salvar preferências");

            const savedUser = await response.json();
            localStorage.setItem("user", JSON.stringify(savedUser));
            setUser(savedUser);

        } catch (err) {
            console.error(err);
        }
    };

    const reset = () => {
        setSettings(defaultSettings);
        if (!user) return;
        const updatedUser = {
            ...user,
            contrast_mode: "normal",
            font_family: "default",
            font_size: "normal",
            line_spacing: "normal",
            reading_guide: false,
            screen_reader_optimized: false,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    return (
        <>
            {/* BOTÃO FLUTUANTE */}
            <button
                id="accessibility-toolbar-root"
                className="
                    fixed right-4 bottom-4 z-[99999]
                    flex items-center gap-2
                    bg-[#1e3a5f] text-white
                    px-4 py-3 rounded-full shadow-lg
                    hover:bg-[#0f2440] transition-all
                "
                onClick={() => setOpen(true)}
                aria-label="Abrir painel de acessibilidade"
            >
                <Accessibility className="w-5 h-5" />
                <span className="text-sm font-medium">Acessibilidade</span>
                <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* PAINEL */}
            {open && (
                <div className="fixed bottom-24 right-4 z-[99999] w-[380px] max-w-[95vw]">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">

                        {/* HEADER */}
                        <div className="flex items-center justify-between px-5 py-4 bg-[#1e3a5f] text-white">
                            <div className="flex items-center gap-2">
                                <Accessibility className="w-5 h-5" />
                                <span className="font-bold text-sm">Acessibilidade</span>
                            </div>
                            <button onClick={() => setOpen(false)} aria-label="Fechar painel">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">

                            {/* ATALHOS DE TECLADO */}
                            <div className="bg-slate-50 rounded-xl px-4 py-3 text-xs text-slate-500 space-y-1">
                                <p className="font-bold text-slate-600 mb-1">Atalhos de teclado</p>
                                <p><kbd className="bg-white border rounded px-1">H</kbd> Ir para heading &nbsp; <kbd className="bg-white border rounded px-1">T</kbd> Ir para tabela &nbsp; <kbd className="bg-white border rounded px-1">K</kbd> Ir para link</p>
                                <p><kbd className="bg-white border rounded px-1">Alt+C</kbd> Alternar contraste &nbsp; <kbd className="bg-white border rounded px-1">Alt+G</kbd> Guia de leitura</p>
                                <p><kbd className="bg-white border rounded px-1">Alt++</kbd> Aumentar fonte &nbsp; <kbd className="bg-white border rounded px-1">Alt+-</kbd> Diminuir fonte</p>
                                <p><kbd className="bg-white border rounded px-1">Alt+L</kbd> Alternar lupa &nbsp; <kbd className="bg-white border rounded px-1">Alt+0</kbd> Restaurar padrões</p>
                            </div>

                            {/* TAMANHO DA FONTE — até 200% */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Type className="w-4 h-4 text-[#1e3a5f]" />
                                    <span className="text-sm font-bold text-[#0f2440]">Tamanho da Fonte</span>
                                    <span className="ml-auto text-xs text-slate-400">{settings.fontSize}%</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => update("fontSize", Math.max(80, settings.fontSize - 10))}
                                        className="w-9 h-9 rounded-lg border font-bold text-lg"
                                        aria-label="Diminuir fonte"
                                    >-</button>
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#1e3a5f] transition-all"
                                            style={{ width: ((settings.fontSize - 80) / 120) * 100 + "%" }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => update("fontSize", Math.min(200, settings.fontSize + 10))}
                                        className="w-9 h-9 rounded-lg border font-bold text-lg"
                                        aria-label="Aumentar fonte"
                                    >+</button>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Mínimo 80% · Máximo 200%</p>
                            </div>

                            {/* CONTRASTE */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Sun className="w-4 h-4 text-[#1e3a5f]" />
                                    <span className="text-sm font-bold text-[#0f2440]">Contraste</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {CONTRAST_MODES.map((c) => (
                                        <button
                                            key={c.value}
                                            onClick={() => update("contrast", c.value)}
                                            className={`px-3 py-2 rounded-lg text-xs font-semibold border-2 transition-all ${settings.contrast === c.value
                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                    : "border-slate-100"
                                                }`}
                                        >{c.label}</button>
                                    ))}
                                </div>
                            </div>

                            {/* FONTES */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Type className="w-4 h-4 text-[#1e3a5f]" />
                                    <span className="text-sm font-bold text-[#0f2440]">Fonte</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {FONTS.map((f) => (
                                        <button
                                            key={f.value}
                                            onClick={() => update("font", f.value)}
                                            className={`px-3 py-2 rounded-lg text-xs font-semibold border-2 transition-all ${settings.font === f.value
                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                    : "border-slate-100"
                                                }`}
                                        >{f.label}</button>
                                    ))}
                                </div>
                            </div>

                            {/* ESPAÇAMENTO */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <AlignLeft className="w-4 h-4 text-[#1e3a5f]" />
                                    <span className="text-sm font-bold text-[#0f2440]">Espaçamento</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {["normal", "relaxed", "loose"].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => update("lineSpacing", s)}
                                            className={`px-3 py-2 rounded-lg text-xs font-semibold border-2 transition-all ${settings.lineSpacing === s
                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                    : "border-slate-100"
                                                }`}
                                        >{s}</button>
                                    ))}
                                </div>
                            </div>

                            {/* GUIA DE LEITURA */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Eye className="w-4 h-4 text-[#1e3a5f]" />
                                    <span className="text-sm font-bold text-[#0f2440]">Guia de Leitura</span>
                                </div>
                                <button
                                    onClick={() => update("readingGuide", !settings.readingGuide)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${settings.readingGuide ? "border-emerald-500 bg-emerald-50" : "border-slate-100"
                                        }`}
                                >
                                    <span className="text-sm font-medium">
                                        {settings.readingGuide ? "Guia ativado" : "Ativar guia visual"}
                                    </span>
                                    <BookOpen className="w-4 h-4" />
                                </button>
                            </div>

                            {/* LUPA VIRTUAL */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <ZoomIn className="w-4 h-4 text-[#1e3a5f]" />
                                    <span className="text-sm font-bold text-[#0f2440]">Lupa Virtual</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    {MAGNIFIER_MODES.map((m) => (
                                        <button
                                            key={m.value}
                                            onClick={() => update("magnifier", m.value)}
                                            className={`px-3 py-2 rounded-lg text-xs font-semibold border-2 transition-all ${settings.magnifier === m.value
                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                    : "border-slate-100"
                                                }`}
                                        >{m.label}</button>
                                    ))}
                                </div>
                                {settings.magnifier !== "off" && (
                                    <div className="flex items-center gap-3">
                                        <ZoomOut className="w-4 h-4 text-slate-400" />
                                        <input
                                            type="range"
                                            min="1.5"
                                            max="5"
                                            step="0.5"
                                            value={settings.magnifierZoom}
                                            onChange={(e) => update("magnifierZoom", parseFloat(e.target.value))}
                                            className="flex-1"
                                            aria-label="Nível de zoom da lupa"
                                        />
                                        <Maximize2 className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs text-slate-400 w-8">{settings.magnifierZoom}x</span>
                                    </div>
                                )}
                            </div>

                            {/* LEITOR DE TELA */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Volume2 className="w-4 h-4 text-[#1e3a5f]" />
                                    <span className="text-sm font-bold text-[#0f2440]">Assistente de Leitura</span>
                                </div>
                                <button
                                    onClick={() => update("screenReader", !settings.screenReader)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${settings.screenReader ? "border-emerald-500 bg-emerald-50" : "border-slate-100"
                                        }`}
                                >
                                    <span className="text-sm font-medium">
                                        {settings.screenReader ? "Leitor ativado" : "Ativar leitor"}
                                    </span>
                                    {settings.screenReader ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* RESET */}
                            <button
                                onClick={reset}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-slate-100 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Restaurar padrões
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
