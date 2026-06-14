import React from "react";
import { motion } from "framer-motion";
import { Shield, Clock, Monitor, Globe } from "lucide-react";

const badges = [
  { icon: Shield, label: "WCAG 2.2 Nível AA", sub: "Conformidade certificada" },
  { icon: Globe, label: "ISO 9241-11", sub: "Eficiência de usabilidade" },
  { icon: Clock, label: "< 3s de carga", sub: "Conexões 3G" },
  { icon: Monitor, label: "3+ navegadores", sub: "Cross-browser" },
];

const principles = [
  { title: "Perceptível", desc: "Alternativas textuais, contraste e adaptabilidade de conteúdo" },
  { title: "Operável", desc: "Teclado completo, tempo suficiente e navegação clara" },
  { title: "Compreensível", desc: "Linguagem simples, comportamentos previsíveis e ajuda contextual" },
  { title: "Robusto", desc: "Compatível com tecnologias assistivas atuais e futuras" },
];

export default function QualitySection() {
  return (
    <section id="quality" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-emerald-500 font-semibold text-sm uppercase tracking-widest">
            Padrões de Qualidade
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f2440] mt-3">
            Software Inclusivo e Confiável
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Seguimos normas internacionais rigorosas para garantir que a plataforma seja realmente acessível para todos.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {badges.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 text-center shadow-sm border border-slate-100"
            >
              <div className="w-12 h-12 bg-[#1e3a5f]/5 rounded-xl flex items-center justify-center mx-auto mb-3">
                <b.icon className="w-6 h-6 text-[#1e3a5f]" />
              </div>
              <p className="font-bold text-sm text-[#0f2440]">{b.label}</p>
              <p className="text-slate-500 text-xs mt-1">{b.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-[#0f2440] mb-6">
            Princípios WCAG 2.2 Implementados
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {principles.map((p, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-[#0f2440] text-sm">{p.title}</h4>
                  <p className="text-slate-500 text-sm mt-1">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}