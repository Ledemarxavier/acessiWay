import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HeroSection() {
  const features = [
    "Leitor de tela compatível (NVDA, JAWS, VoiceOver)",
    "5 modos de contraste incluindo amarelo/preto",
    "Conversor para áudio, Braille e LIBRAS",
  ];

  return (
    <section className="relative bg-gradient-to-br from-[#0f2440] via-[#1e3a5f] to-[#1e3a5f] overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-8">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-white/90 text-sm font-medium">
                WCAG 2.2 • ISO 9241-11 • ISO 25010
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              <span className="text-white">Inclusão Digital</span>
              <br />
              <span className="text-emerald-400">para Todos</span>
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg">
              Plataforma web acessível para pessoas com deficiências visuais, auditivas e cognitivas. 
              Converta conteúdo, personalize perfis e navegue sem barreiras.
            </p>

            <div className="space-y-3 mb-10">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <a href="#features">
                <Button
                  variant="outline"
                                  className="rounded-full px-6 py-6 bg-white text-[#1e3a5f] hover:bg-slate-100 font-semibold">
                
                  Explorar Funcionalidades <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <Link to={createPageUrl("Cadastro")}>
                <Button className="rounded-full px-6 py-6 bg-white text-[#1e3a5f] hover:bg-slate-100 font-semibold">
                  Criar Perfil Gratuito
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
              {/* Header */}
              <h2 className="text-center font-bold text-white mb-6">
                Acessibilidade em Primeiro Lugar
              </h2>

              {/* Illustration */}
              <div className="relative z-10 px-4 pb-2">
                <img
                  src="https://only-roast-39742611.figma.site/_assets/v11/dd34f7a7d9e05d2fddceb368e795668fe310fa77.png"
                  alt="Ilustração mostrando pessoas com deficiências usando a plataforma AcessiWay"
                  className="w-full object-contain"
                  style={{ maxHeight: "260px" }}
                />
              </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}