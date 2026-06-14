import React from "react";
import { motion } from "framer-motion";

const modes = [
  {
    label: "Normal",
    bg: "bg-white",
    text: "text-slate-800",
    sub: "text-slate-500",
    btn: "bg-[#1e3a5f] text-white",
    border: "border-slate-200",
  },
  {
    label: "Alto Contraste",
    bg: "bg-black",
    text: "text-white",
    sub: "text-gray-300",
    btn: "bg-yellow-400 text-black",
    border: "border-gray-700",
  },
  {
    label: "Invertido",
    bg: "bg-gray-900",
    text: "text-gray-100",
    sub: "text-gray-400",
    btn: "bg-blue-400 text-black",
    border: "border-gray-600",
  },
  {
    label: "Amarelo/Preto",
    bg: "bg-black",
    text: "text-yellow-300",
    sub: "text-yellow-200/70",
    btn: "bg-yellow-300 text-black",
    border: "border-yellow-500/30",
  },
];

export default function ContrastPreview() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-emerald-500 font-semibold text-sm uppercase tracking-widest">
              Toolbar de Acessibilidade
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f2440] mt-3 mb-6">
              Personalize a Experiência em Tempo Real
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              A barra de acessibilidade flutuante está disponível em todas as páginas e permite ajustar fonte, contraste, espaçamento e ativar o guia de leitura sem sair da página.
            </p>

            <div className="space-y-6">
              {[
                { title: "5 Modos de Contraste", desc: "Normal, Alto Contraste, Invertido, Azul/Amarelo, Amarelo/Preto" },
                { title: "4 Fontes Acessíveis", desc: "Atkinson Hyperlegible, OpenDyslexic, Arial, Verdana" },
                { title: "Espaçamento Ajustável", desc: "Controle de entrelinha e espaço entre letras em tempo real" },
                { title: "Atalhos de Teclado", desc: "Alt+C, Alt+G, H, T, K e mais — completamente documentados" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#0f2440] text-sm">{item.title}</h4>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {modes.map((mode, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${mode.bg} ${mode.border} border rounded-2xl p-5 shadow-sm`}
              >
                <p className={`text-xs font-medium ${mode.sub} mb-3`}>{mode.label}</p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-current opacity-10 rounded-lg" />
                  <h4 className={`font-bold text-sm ${mode.text}`}>AcessiWay</h4>
                </div>
                <p className={`text-xs ${mode.sub} mb-4`}>Inclusão digital para todos</p>
                <div className={`${mode.btn} text-xs font-semibold px-3 py-1.5 rounded-full inline-block`}>
                  Acessar →
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}