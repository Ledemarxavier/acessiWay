import React from "react";

import {
    X,
    Captions,
    Volume2
} from "lucide-react";

import { useAuth } from "@/lib/AuthContext";

export default function VideoModal({
    videoId,
    title,
    onClose
}) {

    const { user } = useAuth();

    // PREFERÊNCIAS
    const autoCaption =
        user?.video_auto_caption || false;

    const readingAssistant =
        user?.reading_assistant || false;

    // URL CORRETA PARA IFRAME
    const youtubeUrl =
        `https://www.youtube.com/embed/${videoId}`;

    return (

        <div
            className="
                fixed
                inset-0
                z-[200]
                flex
                items-center
                justify-center
                p-4
            "
            role="dialog"
            aria-modal="true"
            aria-label={`Vídeo ${title}`}
        >

            {/* BACKDROP */}
            <div
                className="
                    absolute
                    inset-0
                    bg-black/70
                "
                onClick={onClose}
                aria-hidden="true"
            />

            {/* MODAL */}
            <div
                className="
                    relative
                    w-full
                    max-w-3xl
                    bg-black
                    rounded-2xl
                    overflow-hidden
                    shadow-2xl
                "
            >

                {/* HEADER */}
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        px-4
                        py-3
                        bg-[#0f2440]
                    "
                >

                    <div className="flex flex-col">

                        <span
                            className="
                                text-white
                                text-sm
                                font-semibold
                                truncate
                                pr-4
                            "
                        >
                            {title}
                        </span>

                        <div className="flex items-center gap-4 mt-1">

                            {/* LEGENDA */}
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-1
                                    text-[11px]
                                    text-slate-300
                                "
                            >

                                <Captions className="w-3 h-3" />

                                {autoCaption
                                    ? "Legenda automática ativada"
                                    : "Legenda automática desativada"
                                }

                            </div>

                            {/* ASSISTENTE */}
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-1
                                    text-[11px]
                                    text-slate-300
                                "
                            >

                                <Volume2 className="w-3 h-3" />

                                {readingAssistant
                                    ? "Assistente de leitura ativo"
                                    : "Assistente de leitura inativo"
                                }

                            </div>

                        </div>

                    </div>

                    {/* FECHAR */}
                    <button
                        onClick={onClose}
                        className="
                            text-white
                            hover:opacity-70
                            flex-shrink-0
                            transition-opacity
                        "
                        aria-label="Fechar vídeo"
                    >

                        <X className="w-5 h-5" />

                    </button>

                </div>

                {/* PLAYER */}
                <div
                    className="relative"
                    style={{
                        paddingBottom: "56.25%"
                    }}
                >

                    <iframe
                        className="
        absolute
        inset-0
        w-full
        h-full
    "
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={title}
                        frameBorder="0"
                        allow="
        accelerometer;
        autoplay;
        clipboard-write;
        encrypted-media;
        gyroscope;
        picture-in-picture
    "
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />

                </div>

            </div>

        </div>
    );
}