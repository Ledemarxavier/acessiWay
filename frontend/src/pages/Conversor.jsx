import React, { useState, useRef, useEffect } from "react";
import {
    FileText, Volume2, Eye, Type, Maximize, Copy, Download,
    Sparkles, Lightbulb, Play, Pause, Square, Mic, MicOff,
    Trash2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const SAMPLE_TEXTS = [
    {
        title: "Introdução à Acessibilidade Digital",
        text: "A acessibilidade digital refere-se à prática de tornar websites, aplicativos e outras tecnologias digitais utilizáveis por todas as pessoas, incluindo aquelas com deficiências. Isso envolve considerar uma ampla gama de necessidades, desde deficiências visuais e auditivas até cognitivas e motoras.\n\nAs Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.2 estabelecem quatro princípios fundamentais: perceptível, operável, compreensível e robusto. Seguir essas diretrizes garante que o conteúdo digital seja acessível ao maior número possível de pessoas, independentemente de suas capacidades ou tecnologias assistivas utilizadas.",
    },
    {
        title: "Tecnologias Assistivas",
        text: "Tecnologias assistivas são dispositivos, softwares ou equipamentos que ajudam pessoas com deficiências a realizar tarefas que de outra forma seriam difíceis ou impossíveis. Exemplos incluem leitores de tela, ampliadores de tela, dispositivos de entrada alternativos e software de reconhecimento de voz.",
    },
    {
        title: "LIBRAS e Inclusão",
        text: "A Língua Brasileira de Sinais (LIBRAS) é a língua natural da comunidade surda brasileira. Reconhecida oficialmente pela Lei nº 10.436/2002, a LIBRAS é fundamental para a inclusão de pessoas surdas na sociedade, educação e mercado de trabalho.",
    },
];

const FORMATS = [
    { value: "original", label: "Texto Original", desc: "Conteúdo sem modificações", icon: FileText },
    { value: "simplified", label: "Texto Simplificado", desc: "Frases curtas e simples", icon: Type },
    { value: "audio", label: "Áudio (TTS)", desc: "Síntese de voz", icon: Volume2 },
    { value: "braille", label: "Braille", desc: "Representação em Braille", icon: Eye },
    { value: "enlarged", label: "Texto Ampliado", desc: "Fonte grande para baixa visão", icon: Maximize },
];

const FORMAT_INFO = [
    { title: "Texto Simplificado", desc: "Frases mais curtas e vocabulário simplificado para melhor compreensão." },
    { title: "Áudio (TTS)", desc: "Síntese de voz com controles de velocidade, tom e volume personalizáveis." },
    { title: "Braille", desc: "Representação em Braille Grau 1 para impressão em dispositivos apropriados." },
    { title: "Texto Ampliado", desc: "Fonte grande com espaçamento otimizado para pessoas com baixa visão." },
];

const BRAILLE_MAP = {
    a: "⠁", b: "⠃", c: "⠉", d: "⠙", e: "⠑",
    f: "⠋", g: "⠛", h: "⠓", i: "⠊", j: "⠚",
    k: "⠅", l: "⠇", m: "⠍", n: "⠝", o: "⠕",
    p: "⠏", q: "⠟", r: "⠗", s: "⠎", t: "⠞",
    u: "⠥", v: "⠧", w: "⠺", x: "⠭", y: "⠽",
    z: "⠵",
    á: "⠷", é: "⠿", í: "⠌", ó: "⠬", ú: "⠾",
    â: "⠡", ê: "⠣", ô: "⠹", ã: "⠜", õ: "⠪",
    ç: "⠯", à: "⠈", ü: "⠳",
    ",": "⠂", ".": "⠄", "?": "⠦", "!": "⠖",
    ":": "⠒", ";": "⠆", "-": "⠤", "(": "⠦",
    ")": "⠴", "/": "⠌", "\"": "⠐", "'": "⠄",
    "@": "⠈⠁", "#": "⠼", "%": "⠨⠴", "&": "⠯",
    "+": "⠬", "=": "⠶", "*": "⠔", "<": "⠣",
    ">": "⠜", "[": "⠷", "]": "⠾", "_": "⠸",
    " ": " ", "\n": "\n", "\t": "  ",
};

const BRAILLE_DIGITS = {
    "1": "⠁", "2": "⠃", "3": "⠉", "4": "⠙", "5": "⠑",
    "6": "⠋", "7": "⠛", "8": "⠓", "9": "⠊", "0": "⠚",
};

function convertToBraille(text) {
    let result = "";
    let inNumber = false;
    for (const char of text.toLowerCase()) {
        if (BRAILLE_DIGITS[char] !== undefined) {
            if (!inNumber) { result += "⠼"; inNumber = true; }
            result += BRAILLE_DIGITS[char];
        } else {
            if (inNumber && char !== " " && char !== "\n") result += "⠀";
            inNumber = false;
            result += BRAILLE_MAP[char] ?? char;
        }
    }
    return result;
}

export default function Conversor() {

    // CONVERSOR
    const [selectedSample, setSelectedSample] = useState(0);
    const [customText, setCustomText] = useState("");
    const [activeFormat, setActiveFormat] = useState("original");
    const [convertedText, setConvertedText] = useState("");
    const [converting, setConverting] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const [paused, setPaused] = useState(false);
    const utteranceRef = useRef(null);

    // TRANSCRIÇÃO
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [interimText, setInterimText] = useState("");
    const [transError, setTransError] = useState("");
    const [speechSupported, setSpeechSupported] = useState(true);
    const recognitionRef = useRef(null);
    const finalTranscriptRef = useRef("");

    // Verifica suporte na montagem e limpa na desmontagem
    useEffect(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) setSpeechSupported(false);

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current._shouldRestart = false;
                try { recognitionRef.current.abort(); } catch (e) {}
            }
            window.speechSynthesis.cancel();
        };
    }, []);

    // Cria instância nova a cada gravação — evita conflitos
    const startListening = () => {
        setTransError("");

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setSpeechSupported(false);
            return;
        }

        // Cancela instância anterior se existir
        if (recognitionRef.current) {
            recognitionRef.current._shouldRestart = false;
            try { recognitionRef.current.abort(); } catch (e) {}
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "pt-BR";
        recognition._shouldRestart = true;

        recognition.onresult = (event) => {
            let interim = "";
            let final = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) final += result[0].transcript + " ";
                else interim += result[0].transcript;
            }
            if (final) {
                finalTranscriptRef.current += final;
                setTranscript(finalTranscriptRef.current);
            }
            setInterimText(interim);
        };

        recognition.onerror = (event) => {
            const msgs = {
                "no-speech": "Nenhuma fala detectada.",
                "audio-capture": "Microfone não encontrado.",
                "not-allowed": "Permissão de microfone negada.",
                "network": "Erro de rede.",
            };
            const msg = msgs[event.error];
            if (msg) setTransError(msg);
            if (event.error !== "aborted") setListening(false);
        };

        recognition.onend = () => {
            if (recognition._shouldRestart) {
                try { recognition.start(); } catch (e) {}
            } else {
                setListening(false);
                setInterimText("");
            }
        };

        recognitionRef.current = recognition;

        try {
            recognition.start();
            setListening(true);
        } catch (e) {
            setTransError("Erro ao iniciar microfone.");
            setListening(false);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current._shouldRestart = false;
            try { recognitionRef.current.stop(); } catch (e) {}
        }
        setListening(false);
        setInterimText("");
    };

    const useTranscript = () => {
        if (!transcript.trim()) return;
        setCustomText(transcript.trim());
        setActiveFormat("original");
        setConvertedText("");
        toast.success("Texto transcrito carregado!");
    };

    const handleSpeak = (text) => {
        if (!text) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "pt-BR";
        utterance.rate = 0.9;
        utterance.onstart = () => { setSpeaking(true); setPaused(false); };
        utterance.onend = () => { setSpeaking(false); setPaused(false); };
        utterance.onerror = () => { setSpeaking(false); setPaused(false); };
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const handlePause = () => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            setPaused(true);
        } else if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setPaused(false);
        }
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        setPaused(false);
    };

    const currentText = customText || SAMPLE_TEXTS[selectedSample].text;
    const currentTitle = customText ? "Seu Texto" : SAMPLE_TEXTS[selectedSample].title;

    const handleConvert = async (format) => {
        setActiveFormat(format);
        setConvertedText("");
        if (format === "original") return;
        if (format === "braille") { setConvertedText(convertToBraille(currentText)); return; }
        if (format === "audio") { setConvertedText(currentText); return; }
        if (format === "enlarged") { setConvertedText(currentText); return; }

        setConverting(true);
        try {
            const response = await fetch("http://localhost:3001/api/converter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: currentText, format }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Erro ao converter");
            setConvertedText(data.resultado || "");
        } catch (err) {
            console.error(err);
            toast.error("Erro ao converter texto");
            setConvertedText("");
        } finally {
            setConverting(false);
        }
    };

    const handleDownload = () => {
        if (!displayText) { toast.error("Nenhum conteúdo para exportar."); return; }
        const blob = new Blob([displayText], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${currentTitle.replace(/\s+/g, "_")}_${activeFormat}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Arquivo baixado!");
    };

    const displayText = activeFormat === "original" ? currentText : convertedText;

    const handleCopy = () => {
        navigator.clipboard.writeText(displayText);
        toast.success("Texto copiado!");
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Header */}
                <div className="flex items-start gap-4 mb-10">
                    <div className="w-12 h-12 bg-[#1e3a5f] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 tabIndex={0} className="text-3xl sm:text-4xl font-extrabold text-[#0f2440]">
                            Conversor de Conteúdo
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Transforme textos em formatos acessíveis: áudio, Braille, texto simplificado e mais
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Painel esquerdo */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Seleção de texto */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="w-5 h-5 text-[#1e3a5f]" />
                                <h2 tabIndex={0} className="font-bold text-[#0f2440] text-lg">
                                    Selecione o Texto
                                </h2>
                            </div>

                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                Textos de Exemplo
                            </p>

                            <div className="space-y-2 mb-6">
                                {SAMPLE_TEXTS.map((sample, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setSelectedSample(i);
                                            setCustomText("");
                                            setActiveFormat("original");
                                            setConvertedText("");
                                        }}
                                        className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                                            !customText && selectedSample === i
                                                ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
                                                : "border-slate-100 hover:border-slate-200"
                                        }`}
                                    >
                                        <p className={`font-semibold text-sm ${
                                            !customText && selectedSample === i ? "text-white" : "text-[#0f2440]"
                                        }`}>{sample.title}</p>
                                        <p className={`text-xs mt-1 line-clamp-2 ${
                                            !customText && selectedSample === i ? "text-white/70" : "text-slate-400"
                                        }`}>{sample.text}</p>
                                    </button>
                                ))}
                            </div>

                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                Ou Cole Seu Próprio Texto
                            </p>
                            <Textarea
                                placeholder="Digite ou cole seu texto aqui..."
                                value={customText}
                                onChange={(e) => {
                                    setCustomText(e.target.value);
                                    setActiveFormat("original");
                                    setConvertedText("");
                                }}
                                className="min-h-[120px] resize-none"
                            />
                        </div>

                        {/* TRANSCRIÇÃO DE ÁUDIO */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Mic className="w-5 h-5 text-[#1e3a5f]" />
                                <h2 className="font-bold text-[#0f2440] text-lg">Transcrição de Áudio</h2>
                            </div>

                            {!speechSupported ? (
                                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-700">
                                        Use Google Chrome ou Microsoft Edge para usar a transcrição de áudio.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={listening ? stopListening : startListening}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                                                listening
                                                    ? "bg-red-500 text-white hover:bg-red-600"
                                                    : "bg-[#1e3a5f] text-white hover:bg-[#0f2440]"
                                            }`}
                                        >
                                            {listening
                                                ? <><MicOff className="w-4 h-4" /> Parar</>
                                                : <><Mic className="w-4 h-4" /> Iniciar gravação</>
                                            }
                                        </button>

                                        {listening && (
                                            <div className="flex items-end gap-0.5 h-6">
                                                {[3, 5, 7, 5, 4, 6, 3].map((h, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-1 bg-red-400 rounded-full animate-pulse"
                                                        style={{
                                                            height: `${h * 3}px`,
                                                            animationDelay: `${i * 0.1}s`,
                                                            animationDuration: `${0.6 + i * 0.1}s`,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                                        <div className="min-h-[100px] max-h-[150px] overflow-y-auto p-3 bg-slate-50">
                                            {!transcript && !interimText ? (
                                                <p className="text-xs text-slate-400 text-center mt-6">
                                                    {listening ? "Ouvindo... fale agora" : "Pressione iniciar e fale"}
                                                </p>
                                            ) : (
                                                <p className="text-xs text-slate-700 leading-relaxed">
                                                    {transcript}
                                                    <span className="text-slate-400 italic">{interimText}</span>
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 px-3 py-2 bg-white border-t border-slate-100">
                                            <span className="text-xs text-slate-400 flex-1">
                                                {transcript
                                                    ? `${transcript.trim().split(/\s+/).length} palavras`
                                                    : "0 palavras"
                                                }
                                            </span>
                                            <button
                                                onClick={() => {
                                                    finalTranscriptRef.current = "";
                                                    setTranscript("");
                                                    setInterimText("");
                                                    setTransError("");
                                                }}
                                                disabled={!transcript && !interimText}
                                                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-all"
                                                title="Limpar"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(transcript);
                                                    toast.success("Transcrição copiada!");
                                                }}
                                                disabled={!transcript}
                                                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-all"
                                                title="Copiar"
                                            >
                                                <Copy className="w-3.5 h-3.5 text-slate-500" />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={useTranscript}
                                        disabled={!transcript.trim()}
                                        className="w-full py-2 rounded-xl border-2 border-[#1e3a5f] text-[#1e3a5f] text-sm font-semibold hover:bg-[#1e3a5f] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        Usar texto no conversor
                                    </button>

                                    {transError && (
                                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                                            <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                                            <p className="text-xs text-red-600">{transError}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Dica */}
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="w-5 h-5 text-amber-600" />
                                <h4 className="font-bold text-amber-800 text-sm">Dica de Acessibilidade</h4>
                            </div>
                            <p className="text-amber-700 text-xs leading-relaxed">
                                Use a transcrição para ditar seu texto e depois converta para o formato desejado.
                                O Braille é útil para preparar materiais impressos acessíveis.
                            </p>
                        </div>
                    </div>

                    {/* Painel direito */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">

                            <div className="p-6 border-b border-slate-100">
                                <h3 className="font-bold text-[#0f2440] text-lg">{currentTitle}</h3>
                                <p className="text-slate-500 text-sm mt-1">
                                    Converta o conteúdo para diferentes formatos acessíveis
                                </p>
                            </div>

                            <div className="flex overflow-x-auto border-b border-slate-100">
                                {FORMATS.map((f) => (
                                    <button
                                        key={f.value}
                                        onClick={() => handleConvert(f.value)}
                                        className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-5 py-4 transition-all border-b-2 ${
                                            activeFormat === f.value
                                                ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
                                                : "border-transparent text-slate-500 hover:bg-slate-50"
                                        }`}
                                    >
                                        <f.icon className="w-5 h-5" />
                                        <span className="text-xs font-semibold whitespace-nowrap">{f.label}</span>
                                        <span className={`text-[10px] whitespace-nowrap ${
                                            activeFormat === f.value ? "text-white/70" : "text-slate-400"
                                        }`}>{f.desc}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeFormat}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={`bg-slate-50 rounded-xl p-6 min-h-[200px] ${
                                            activeFormat === "enlarged" ? "text-xl leading-loose" : "text-sm leading-relaxed"
                                        }`}
                                    >
                                        {converting ? (
                                            <div className="flex items-center justify-center h-32">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-5 h-5 border-2 border-[#1e3a5f] border-t-transparent rounded-full animate-spin" />
                                                    <span className="text-slate-500">Convertendo...</span>
                                                </div>
                                            </div>
                                        ) : activeFormat === "audio" && displayText ? (
                                            <div className="space-y-4">
                                                <p className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
                                                    {displayText}
                                                </p>
                                                <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                                                    <button
                                                        onClick={() =>
                                                            speaking && !paused ? handlePause()
                                                            : speaking && paused ? handlePause()
                                                            : handleSpeak(displayText)
                                                        }
                                                        className="flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#0f2440] transition-colors"
                                                    >
                                                        {speaking && !paused ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                        {speaking && !paused ? "Pausar" : speaking && paused ? "Continuar" : "Ouvir Texto"}
                                                    </button>
                                                    {speaking && (
                                                        <button
                                                            onClick={handleStop}
                                                            className="flex items-center gap-2 border border-slate-200 px-4 py-2 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                                                        >
                                                            <Square className="w-4 h-4" /> Parar
                                                        </button>
                                                    )}
                                                    {speaking && !paused && (
                                                        <div className="flex items-center gap-1 ml-2">
                                                            {[1, 2, 3, 4, 5].map((i) => (
                                                                <div
                                                                    key={i}
                                                                    className="w-1 bg-emerald-500 rounded-full animate-pulse"
                                                                    style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.1}s` }}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-slate-700 whitespace-pre-wrap">{displayText}</p>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                <div className="flex gap-3 mt-4">
                                    <Button variant="outline" className="rounded-full gap-2" onClick={handleCopy}>
                                        <Copy className="w-4 h-4" /> Copiar
                                    </Button>
                                    <Button
                                        className="rounded-full gap-2 bg-emerald-500 hover:bg-emerald-600"
                                        onClick={handleDownload}
                                        disabled={!displayText}
                                    >
                                        <Download className="w-4 h-4" /> Baixar
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <h3 className="font-bold text-[#0f2440] mb-4">Sobre os Formatos de Conversão</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {FORMAT_INFO.map((info, i) => (
                                    <div key={i}>
                                        <h4 className="font-bold text-sm text-[#0f2440]">{info.title}</h4>
                                        <p className="text-slate-500 text-sm mt-1">{info.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
