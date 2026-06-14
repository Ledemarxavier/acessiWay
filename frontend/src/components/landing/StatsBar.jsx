import React from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "5", label: "Modos de Contraste", sub: "incluindo amarelo/preto" },
  { value: "AA", label: "Conformidade WCAG 2.2", sub: "nível mínimo garantido" },
  { value: "4+", label: "Fontes Acessíveis", sub: "Atkinson, OpenDyslexic…" },
  { value: "100%", label: "Navegável por Teclado", sub: "sem depender do mouse" },
];

export default function StatsBar() {
  return (
    <section className="bg-[#1e3a5f] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{stat.value}</p>
              <p className="text-white/90 font-semibold text-sm mb-1">{stat.label}</p>
              <p className="text-white/50 text-xs">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}