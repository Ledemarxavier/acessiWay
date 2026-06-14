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

        html.classList.remove(
            "contrast-normal",
            "contrast-high_contrast",
            "contrast-inverted",
            "contrast-yellow_black",

            "font-default",
            "font-atkinson",
            "font-opendyslexic",
            "font-arial",
            "font-verdana",

            "font-size-normal",
            "font-size-large",
            "font-size-extra-large",

            "line-spacing-normal",
            "line-spacing-large"
        );

        html.classList.add(
            `contrast-${preferences.contrast_mode}`
        );

        html.classList.add(
            `font-${preferences.font_family}`
        );

        html.classList.add(
            `font-size-${preferences.font_size}`
        );

        html.classList.add(
            `line-spacing-${preferences.line_spacing}`
        );

    }, [
        preferences.contrast_mode,
        preferences.font_family,
        preferences.font_size,
        preferences.line_spacing
    ]);

    const updatePreferences = (newPrefs) => {

        if (!user) return;

        const updatedUser = {
            ...user,
            ...newPrefs
        };

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

        setUser(updatedUser);
    };

    return (
        <AccessibilityContext.Provider
            value={{
                preferences,
                setPreferences: updatePreferences
            }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    return useContext(AccessibilityContext);
}