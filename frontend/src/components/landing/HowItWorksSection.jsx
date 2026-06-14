import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    num: "1",
    title: "Crie Seu Perfil",
    desc: "Configure suas preferências: tamanho de fonte, contraste, fonte e espaçamento. Salve para usar em qualquer dispositivo.",
    link: { label: "Criar Perfil", page: "Cadastro" },
    gradient: "from-blue-600 to-indigo-600",
    border: "border-blue-200",
    btnBg: "bg-blue-50 text-blue-700",
  },
  {
    num: "2",
    title: "Explore o Conteúdo",
    desc: "Acesse vídeos com LIBRAS, artigos com Braille e áudios com audiodescrição completa.",
    link: { label: "Ver Conteúdo", page: "Conteudo" },
    gradient: "from-emerald-600 to-teal-600",
    border: "border-emerald-200",
    btnBg: "bg-emerald-50 text-emerald-700",
  },
  {
    num: "3",
    title: "Converta e Adapte",
    desc: "Use o conversor para transformar qualquer texto em áudio, Braille, texto simplificado ou ampliado.",
    link: { label: "Abrir Conversor", page: "Conversor" },
    gradient: "from-violet-600 to-purple-600",
    border: "border-violet-200",
    btnBg: "bg-violet-50 text-violet-700",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-2">
            Como Funciona
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f2440] mb-4">
            Comece em 3 Passos Simples
          </h2>
          <p className="text-slate-500 leading-relaxed">
            A plataforma foi desenhada para ser intuitiva, rápida e acessível desde o primeiro acesso.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-slate-200" aria-hidden="true" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative bg-white rounded-2xl border ${step.border} p-8 flex flex-col gap-5`}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-md flex-shrink-0`}
                aria-hidden="true"
              >
                <span className="text-white font-extrabold text-xl">{step.num}</span>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-[#0f2440] mb-2 text-lg">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>

              <Link
                to={createPageUrl(step.link.page)}
                className={`inline-flex items-center gap-1.5 text-sm font-bold ${step.btnBg} px-4 py-2 rounded-lg hover:opacity-80 transition w-fit`}
              >
                {step.link.label}
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}