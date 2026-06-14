import React, { useEffect } from "react";

import HeroSection from "@/components/landing/HeroSection";
import StatsBar from "@/components/landing/StatsBar";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ContrastPreview from "@/components/landing/ContrastPreview";
import QualitySection from "@/components/landing/QualitySection";
import CTASection from "@/components/landing/CTASection";

import { useAuth } from "@/lib/AuthContext";

export default function Home() {

    const { user } = useAuth();

    // APLICA PREFERÊNCIAS AUTOMÁTICAS
    useEffect(() => {

        if (!user) return;

        // DEFICIÊNCIA VISUAL
        if (user.disability_type === "visual") {

            document.body.classList.add(
                "visual-accessibility"
            );
        }

        // DEFICIÊNCIA AUDITIVA
        if (
            user.disability_type === "auditory" &&
            user.video_auto_caption
        ) {

            window.AUTO_VIDEO_CAPTION = true;
        }

        // DEFICIÊNCIA COGNITIVA
        if (
            user.disability_type === "cognitive"
        ) {

            document.body.classList.add(
                "simplified-language"
            );
        }

        // DEFICIÊNCIA MOTORA
        if (
            user.disability_type === "motor"
        ) {

            document.body.classList.add(
                "motor-accessibility"
            );
        }

        return () => {

            document.body.classList.remove(
                "visual-accessibility",
                "simplified-language",
                "motor-accessibility"
            );
        };

    }, [user]);

    return (

        <>
            <style>{`

                /* BOTÕES MAIORES */
                body.motor-accessibility button,
                body.motor-accessibility a,
                body.motor-accessibility input {
                    min-height: 52px !important;
                    min-width: 52px !important;
                }

                /* VISUAL */
                body.visual-accessibility {
                    scroll-behavior: smooth;
                }

                /* COGNITIVO */
                body.simplified-language p {
                    line-height: 2 !important;
                    letter-spacing: 0.3px;
                }

            `}</style>

            <div>

                <HeroSection />

                <StatsBar />

                <FeaturesSection />

                <HowItWorksSection />

                <ContrastPreview />

                <QualitySection />

                <CTASection />

            </div>
        </>
    );
}