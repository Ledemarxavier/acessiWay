import React from "react";
import { Eye, Ear, Search, FileText, User, Keyboard } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Eye,
    badge: "WCAG AA",
    badgeColor: "bg-blue-100 text-blue-700",
    title: "Deficientes Visuais",
    desc: "Navegação completa por teclado, leitor de tela, alto contraste dinâmico e texto ampliável até 200%.",
  },
  {
    icon: Ear,
    badge: "LIBRAS",
    badgeColor: "bg-emerald-100 text-emerald-700",
    title: "Surdos e Def. Auditivos",
    desc: "Transcrição automática de áudio, legendas CC sincronizadas, tradução para LIBRAS e alertas visuais.",
  },
  {
    icon: Search,
    badge: "Personalizável",
    badgeColor: "bg-purple-100 text-purple-700",
    title: "Baixa Visão",
    desc: "Lupa virtual, fontes especializadas (OpenDyslexic), controle de espaçamento e guia de leitura.",
  },
  {
    icon: FileText,
    badge: "Multi-formato",
    badgeColor: "bg-amber-100 text-amber-700",
    title: "Conversor de Conteúdo",
    desc: "Transforme qualquer conteúdo em formatos acessíveis: áudio, texto simplificado, Braille e LIBRAS.",
  },
  {
    icon: User,
    badge: "Exportável",
    badgeColor: "bg-pink-100 text-pink-700",
    title: "Perfis de Acessibilidade",
    desc: "Crie e salve perfis personalizados com todas as suas preferências de acessibilidade.",
  },
  {
    icon: Keyboard,
    badge: "Atalhos",
    badgeColor: "bg-cyan-100 text-cyan-700",
    title: "Navegação por Teclado",
    desc: "Atalhos completos: H para headings, T para tabelas, K para links. Navegação sem mouse.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-emerald-500 font-semibold text-sm uppercase tracking-widest">
            Funcionalidades
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f2440] mt-3">
            Recursos Projetados para a Inclusão
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Cada funcionalidade foi desenvolvida seguindo as diretrizes WCAG 2.2 e testada com usuários com diferentes necessidades de acessibilidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#1e3a5f] group-hover:text-white transition-colors">
                  <f.icon className="w-6 h-6 text-[#1e3a5f] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 ${f.badgeColor}`}>
                    {f.badge}
                  </span>
                  <h3 className="text-lg font-bold text-[#0f2440] mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}