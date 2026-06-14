import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#0f2440] to-[#1e3a5f] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
          Pronto para Navegar sem Barreiras?
        </h2>
        <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
          Crie seu perfil de acessibilidade gratuitamente e acesse todos os recursos da plataforma adaptados às suas necessidades.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to={createPageUrl("Cadastro")}>
            <Button className="rounded-full px-8 py-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold gap-2 text-base">
              Criar Perfil Gratuitamente <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to={createPageUrl("Ajuda")}>
            <Button
              variant="outline"
                          className="rounded-full px-8 py-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold gap-2 text-base">
            >
              Ver Documentação
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}