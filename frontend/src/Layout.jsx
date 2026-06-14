import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AccessibilityToolbar from "@/components/landing/AccessibilityToolbar";
import { useAuth } from "@/lib/AuthContext";

export default function Layout({ children, currentPageName }) {

    const { user } = useAuth();
    const hideNavFooter = false;

    return (
        <div className="min-h-screen flex flex-col">

            {/* LEITOR DE TELA */}
            <div
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {user?.screen_reader_optimized ? "Leitor de tela ativado" : ""}
            </div>
            <div id="page-content" className="flex flex-col flex-1">

                {!hideNavFooter && (
                    <Navbar currentPage={currentPageName} />
                )}

                <main className="flex-1" role="main">
                    {children}
                </main>

                {!hideNavFooter && (
                    <Footer />
                )}

            </div>
            <AccessibilityToolbar />

        </div>
    );
}
