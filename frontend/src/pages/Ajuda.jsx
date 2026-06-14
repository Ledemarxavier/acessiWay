import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  HelpCircle, Contrast, Type, ScanLine, Volume2, FileText, Keyboard,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const resources = [
  { icon: Contrast, title: "Modos de Contraste", desc: "Escolha entre Normal, Alto Contraste, Invertido, Azul/Amarelo e Amarelo/Preto para melhor legibilidade." },
  { icon: Type, title: "Fontes Especializadas", desc: "Utilize Atkinson Hyperlegible (baixa visão), OpenDyslexic (dislexia) ou fontes tradicionais como Arial e Verdana." },
  { icon: ScanLine, title: "Guia de Leitura", desc: "Máscara de foco visual que segue o cursor do mouse para facilitar a leitura linha por linha." },
  { icon: Volume2, title: "Síntese de Voz", desc: "Ouça qualquer texto em voz alta com controles de velocidade, tom e volume. Suporta português brasileiro." },
  { icon: FileText, title: "Conversor de Conteúdo", desc: "Converta textos para áudio, Braille, texto simplificado ou texto ampliado para diferentes necessidades." },
  { icon: Keyboard, title: "Navegação por Teclado", desc: "Navegue completamente pela plataforma sem usar o mouse, usando Tab e atalhos personalizados." },
];

const shortcuts = [
  { keys: "Alt + +", action: "Aumentar tamanho da fonte" },
  { keys: "Alt + -", action: "Diminuir tamanho da fonte" },
  { keys: "Alt + C", action: "Alternar modos de contraste (cicla entre os 4 modos)" },
  { keys: "Alt + G", action: "Ativar/desativar guia de leitura" },
  { keys: "Alt + 0", action: "Restaurar configurações padrão" },
  { keys: "H / Shift+H", action: "Navegar para o próximo/anterior heading" },
  { keys: "T / Shift+T", action: "Navegar para a próxima/anterior tabela" },
  { keys: "K / Shift+K", action: "Navegar para o próximo/anterior link ou botão" },
  { keys: "Tab", action: "Navegar entre elementos interativos" },
  { keys: "Enter/Espaço", action: "Ativar botões e links" },
];

const howToSteps = [
  {
    num: "1",
    title: "Configure Seu Perfil",
    desc: "Acesse a página de cadastro e crie um perfil personalizado com suas necessidades de acessibilidade.",
    link: { label: "Criar Perfil →", page: "Cadastro" },
  },
  {
    num: "2",
    title: "Explore o Conteúdo",
    desc: "Navegue pela biblioteca de vídeos, áudios e artigos, todos com recursos de acessibilidade completos.",
    link: { label: "Ver Conteúdo →", page: "Conteudo" },
  },
  {
    num: "3",
    title: "Use o Conversor",
    desc: "Converta qualquer texto para áudio, Braille ou outros formatos acessíveis conforme sua necessidade.",
    link: { label: "Abrir Conversor →", page: "Conversor" },
  },
];

export default function Ajuda() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-start gap-4 mb-12">
          <div className="w-12 h-12 bg-[#1e3a5f] rounded-xl flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <div>
                      <h1 tabIndex={0}
            className="text-3xl sm:text-4xl font-extrabold text-[#0f2440]">
              Central de Ajuda
            </h1>
            <p className="text-slate-500 mt-1">
              Aprenda a usar todos os recursos de acessibilidade do AcessiWay
            </p>
          </div>
        </div>

        {/* Resources */}
        <section className="mb-16">
          <h2 tabIndex={0}className="text-xl font-extrabold text-[#0f2440] mb-6">Recursos de Acessibilidade</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {resources.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#1e3a5f]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                    <r.icon className="w-5 h-5 text-[#1e3a5f]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0f2440] text-sm">{r.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed mt-1">{r.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Shortcuts */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Keyboard className="w-5 h-5 text-[#1e3a5f]" />
            <h2 className="text-xl font-extrabold text-[#0f2440]">Atalhos de Teclado</h2>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="grid grid-cols-2 gap-0">
              <div className="px-6 py-3 bg-slate-50 font-bold text-sm text-[#0f2440] border-b border-slate-100">
                Teclas
              </div>
              <div className="px-6 py-3 bg-slate-50 font-bold text-sm text-[#0f2440] border-b border-slate-100">
                Ação
              </div>
              {shortcuts.map((s, i) => (
                <React.Fragment key={i}>
                  <div className={`px-6 py-3.5 ${i < shortcuts.length - 1 ? "border-b border-slate-50" : ""}`}>
                    <div className="flex gap-1.5">
                      {s.keys.split(" + ").length > 1
                        ? s.keys.split(" + ").map((k, j) => (
                            <React.Fragment key={j}>
                              <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-700">
                                {k}
                              </kbd>
                              {j < s.keys.split(" + ").length - 1 && (
                                <span className="text-slate-400 text-xs self-center">+</span>
                              )}
                            </React.Fragment>
                          ))
                        : (
                          <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-700">
                            {s.keys}
                          </kbd>
                        )
                      }
                    </div>
                  </div>
                  <div className={`px-6 py-3.5 text-sm text-slate-600 ${i < shortcuts.length - 1 ? "border-b border-slate-50" : ""}`}>
                    {s.action}
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                <strong>Nota:</strong> Os atalhos H, T e K funcionam apenas quando você não está digitando em campos de texto.
              </p>
            </div>
          </div>
        </section>

        {/* Screen reader tips */}
        <section className="mb-16">
                  <h2 tabIndex={0} className="text-xl font-extrabold text-[#0f2440] mb-6">Dicas para Leitores de Tela</h2>
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <p className="text-slate-500 text-sm mb-4">
              Esta plataforma foi otimizada para funcionar com NVDA, JAWS, VoiceOver e outros leitores de tela. Aqui estão algumas dicas para melhorar sua experiência:
            </p>
            <ul className="space-y-3">
              {[
                "Use H1-H6 para navegar rapidamente entre seções",
                "Todos os botões e links têm labels descritivos",
                "Imagens possuem textos alternativos detalhados",
                "Formulários têm labels associados e mensagens de erro claras",
                "Regiões ARIA identificam diferentes partes da página",
                "Mudanças dinâmicas são anunciadas via aria-live",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How to start */}
        <section>
                  <h2 tabIndex={0} className="text-xl font-extrabold text-[#0f2440] mb-6">Como Começar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howToSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-[#0f2440] mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{step.desc}</p>
                <Link
                  to={createPageUrl(step.link.page)}
                  className="inline-flex items-center text-emerald-600 font-semibold text-sm hover:text-emerald-700"
                >
                  {step.link.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}