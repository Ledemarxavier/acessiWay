import {
    createContext,
    useContext,
    useEffect,
    useMemo
} from "react";

import { useAuth } from "@/lib/AuthContext";

const AccessibilityContext = createContext();

const DEFAULT_PREFERENCES = {
    contrast_mode: "normal",
    font_family: "default",
    font_size: "normal",
    line_spacing: "normal",
};

export function AccessibilityProvider({ children }) {

    const { user, setUser } = useAuth();

    const preferences = useMemo(() => {

        if (!user) {
            return DEFAULT_PREFERENCES;
        }

        return {
            contrast_mode:
                user.contrast_mode || "normal",

            font_family:
                user.font_family || "default",

            font_size:
                user.font_size || "normal",

            line_spacing:
                user.line_spacing || "normal",
        };

    }, [user]);

    useEffect(() => {
        const html = document.documentElement;

        // Remove classes antigas
        html.classList.remove(
            "contrast-normal", "contrast-high_contrast",
            "contrast-inverted", "contrast-yellow_black",
            "font-default", "font-arial", "font-verdana", "font-opendyslexic",
            "font-size-normal", "font-size-large", "font-size-extra-large",
            "line-spacing-normal", "line-spacing-large"
        );

        html.classList.add(`contrast-${preferences.contrast_mode}`);
        html.classList.add(`font-${preferences.font_family}`);
        html.classList.add(`font-size-${preferences.font_size}`);
        html.classList.add(`line-spacing-${preferences.line_spacing}`);

        // Aplica contraste diretamente via style
        const contrastMap = {
            high_contrast: "contrast(2) brightness(0.9)",
            inverted: "invert(1) hue-rotate(180deg)",
            normal: "none",
            yellow_black: "none",
        };

        html.style.filter = contrastMap[preferences.contrast_mode] || "none";

        if (preferences.contrast_mode === "yellow_black") {
            document.body.style.background = "black";
            document.body.style.color = "yellow";
            const style = document.getElementById("a11y-yellow-black");
            if (!style) {
                const s = document.createElement("style");
                s.id = "a11y-yellow-black";
                s.innerHTML = "* { background: black !important; color: yellow !important; border-color: yellow !important; }";
                document.head.appendChild(s);
            }
        } else {
            document.body.style.background = "";
            document.body.style.color = "";
            const s = document.getElementById("a11y-yellow-black");
            if (s) s.remove();
        }

    }, [
        preferences.contrast_mode,
        preferences.font_family,
        preferences.font_size,
        preferences.line_spacing
    ]);

export function useAccessibility() {
    return useContext(AccessibilityContext);
}