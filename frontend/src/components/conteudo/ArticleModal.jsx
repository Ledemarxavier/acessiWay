import React from "react";
import { X } from "lucide-react";

export default function ArticleModal({ title, content, onClose }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 bg-[#0f2440] flex-shrink-0">
          <span className="text-white font-bold text-base truncate pr-4">{title}</span>
          <button onClick={onClose} className="text-white hover:opacity-70 flex-shrink-0" aria-label="Fechar artigo">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-6 text-slate-700 text-sm leading-relaxed space-y-4">
          {content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}