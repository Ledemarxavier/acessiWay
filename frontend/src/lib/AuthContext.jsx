import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const AuthContext =
    createContext();

export function AuthProvider({
    children
}) {

    const [user, setUser] =
        useState(null);

    const [isLoadingAuth, setIsLoadingAuth] =
        useState(true);

    // =========================
    // APLICAR ACESSIBILIDADE
    // =========================
    const applyAccessibilityPreferences =
        (userData) => {

            if (!userData) return;

            // =========================
            // CONTRASTE
            // =========================
            document.body.classList.remove(
                "contrast-high",
                "contrast-inverted",
                "contrast-yellow"
            );

            if (
                userData.contrast_mode ===
                "high_contrast"
            ) {

                document.body.classList.add(
                    "contrast-high"
                );
            }

            if (
                userData.contrast_mode ===
                "inverted"
            ) {

                document.body.classList.add(
                    "contrast-inverted"
                );
            }

            if (
                userData.contrast_mode ===
                "yellow_black"
            ) {

                document.body.classList.add(
                    "contrast-yellow"
                );
            }

            // =========================
            // FONTE
            // =========================
            const fontMap = {

                default:
                    "'Inter', sans-serif",

                arial:
                    "Arial, sans-serif",

                verdana:
                    "Verdana, sans-serif",

                atkinson:
                    "'Atkinson Hyperlegible', sans-serif",

                opendyslexic:
                    "'OpenDyslexic', sans-serif",
            };

            document.body.style.fontFamily =
                fontMap[
                userData.font_family
                ] || fontMap.default;

            // =========================
            // TAMANHO
            // =========================
            const fontSizeMap = {

                normal: "100%",

                large: "120%",

                "extra-large": "140%",
            };

            document.documentElement.style.fontSize =
                fontSizeMap[
                userData.font_size
                ] || "100%";

            // =========================
            // ESPAÇAMENTO
            // =========================
            const spacingMap = {

                normal: "1.5",

                relaxed: "1.8",

                loose: "2.2",
            };

            document.body.style.lineHeight =
                spacingMap[
                userData.line_spacing
                ] || "1.5";

            // =========================
            // ASSISTENTE DE LEITURA
            // =========================
            if (
                userData.reading_assistant
            ) {

                document.body.classList.add(
                    "reading-assistant-active"
                );

            } else {

                document.body.classList.remove(
                    "reading-assistant-active"
                );
            }

            // =========================
            // LEITOR DE TELA
            // =========================
            if (
                userData.screen_reader_optimized
            ) {

                document
                    .querySelectorAll(
                        "button, a, input, textarea, select, p, span, h1, h2, h3, h4, h5, h6"
                    )
                    .forEach((element) => {

                        const text =
                            element.innerText ||
                            element.placeholder ||
                            element.value;

                        if (!text) return;

                        // BOTÃO
                        if (
                            element.tagName ===
                            "BUTTON"
                        ) {

                            element.setAttribute(
                                "aria-label",
                                `Botão ${text}`
                            );
                        }

                        // LINK
                        else if (
                            element.tagName ===
                            "A"
                        ) {

                            element.setAttribute(
                                "aria-label",
                                `Link ${text}`
                            );
                        }

                        // INPUT
                        else if (
                            element.tagName ===
                            "INPUT"
                        ) {

                            element.setAttribute(
                                "aria-label",
                                `Campo ${text}`
                            );
                        }

                        // TEXTO
                        else {

                            element.setAttribute(
                                "aria-label",
                                `Texto ${text}`
                            );
                        }
                    });
            }

            // =========================
            // LEGENDAS AUTOMÁTICAS
            // =========================
            if (
                userData.automatic_video_captions
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
        };

    // =========================
    // LOAD USER
    // =========================
    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {

            const parsedUser =
                JSON.parse(storedUser);

            setUser(parsedUser);

            applyAccessibilityPreferences(
                parsedUser
            );
        }

        setIsLoadingAuth(false);

    }, []);

    // =========================
    // CSS GLOBAL
    // =========================
    useEffect(() => {

        const style =
            document.createElement("style");

        style.innerHTML = `

            body.contrast-high {
                filter: contrast(1.5) brightness(1.1);
            }

            body.contrast-inverted {
                filter: invert(1) hue-rotate(180deg);
            }

            body.contrast-yellow {
                background: #000 !important;
                color: #ff0 !important;
            }

            body.contrast-yellow * {
                color: #ff0 !important;
                border-color: #666 !important;
            }

            .reading-assistant-active p,
            .reading-assistant-active li,
            .reading-assistant-active span {

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

    // =========================
    // LOGIN
    // =========================
    const login = (
        userData,
        token
    ) => {

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        localStorage.setItem(
            "token",
            token
        );

        setUser(userData);

        applyAccessibilityPreferences(
            userData
        );
    };

    // =========================
    // LOGOUT
    // =========================
    const logout = () => {

        localStorage.removeItem("user");

        localStorage.removeItem("token");

        // RESET ESTILOS
        document.body.classList.remove(
            "contrast-high",
            "contrast-inverted",
            "contrast-yellow",
            "reading-assistant-active"
        );

        document.body.style.fontFamily =
            "";

        document.body.style.lineHeight =
            "";

        document.documentElement.style.fontSize =
            "";

        setUser(null);
    };

    return (

        <AuthContext.Provider
            value={{

                user,

                setUser,

                login,

                logout,

                isLoadingAuth,

                isLoadingPublicSettings: false,

                authError: null,

                navigateToLogin: () => {

                    window.location.href =
                        "/Login";
                }
            }}
        >

            {children}

        </AuthContext.Provider>
    );
}

export function useAuth() {

    return useContext(
        AuthContext
    );
}