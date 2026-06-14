import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Footer() {
  return (
    <footer className="bg-[#0f2440] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-white font-bold text-xl">AcessiWay</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Inclusão digital para todos. Plataforma acessível seguindo WCAG 2.2.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-300">Plataforma</h4>
            <div className="space-y-2.5">
              <Link to={createPageUrl("Home")} className="block text-sm text-slate-400 hover:text-white transition-colors">Início</Link>
              <Link to={createPageUrl("Conteudo")} className="block text-sm text-slate-400 hover:text-white transition-colors">Conteúdo</Link>
              <Link to={createPageUrl("Conversor")} className="block text-sm text-slate-400 hover:text-white transition-colors">Conversor</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-300">Suporte</h4>
            <div className="space-y-2.5">
              <Link to={createPageUrl("Ajuda")} className="block text-sm text-slate-400 hover:text-white transition-colors">Central de Ajuda</Link>
              <Link to={createPageUrl("Cadastro")} className="block text-sm text-slate-400 hover:text-white transition-colors">Criar Perfil</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-300">Conformidade</h4>
            <div className="space-y-2.5">
              <p className="text-sm text-slate-400">WCAG 2.2 Nível AA</p>
              <p className="text-sm text-slate-400">ISO 9241-11</p>
              <p className="text-sm text-slate-400">ISO 25010</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-8 text-center">
          <p className="text-sm text-slate-500">© 2026 AcessiWay. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}