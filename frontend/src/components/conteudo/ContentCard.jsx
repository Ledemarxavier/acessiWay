import React, { useState } from "react";
import { Play, Volume2, FileText, Download, ChevronRight, Pause, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import VideoModal from "./VideoModal";
import ArticleModal from "./ArticleModal";

const typeConfig = {
  video: { icon: Play, label: "VÍDEO", color: "text-blue-600", bg: "bg-blue-50" },
  audio: { icon: Volume2, label: "ÁUDIO", color: "text-emerald-600", bg: "bg-emerald-50" },
  artigo: { icon: FileText, label: "ARTIGO", color: "text-purple-600", bg: "bg-purple-50" },
};

const tagColors = {
  LIBRAS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Legendas CC": "bg-blue-50 text-blue-700 border-blue-200",
  "Audiodescrição": "bg-amber-50 text-amber-700 border-amber-200",
  Braille: "bg-pink-50 text-pink-700 border-pink-200",
  "Leitor de Tela": "bg-purple-50 text-purple-700 border-purple-200",
};

export default function ContentCard({ item, index }) {
  const config = typeConfig[item.type];
  const Icon = config.icon;
  const [speaking, setSpeaking] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [articleOpen, setArticleOpen] = useState(false);

  const handleListen = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = `${item.title}. ${item.description}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="flex flex-col sm:flex-row">
              {item.image && (
                  <div className="w-full sm:w-72 flex-shrink-0 aspect-video sm:aspect-auto">
                      <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                      />
                  </div>
              )}

        <div className="p-6 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Icon className={`w-4 h-4 ${config.color}`} />
            <span className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>
              {config.label}
            </span>
            <span className="text-slate-400 text-xs">• {item.duration}</span>
          </div>

          <h3 className="text-lg font-bold text-[#0f2440] mb-2">{item.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-4">{item.description}</p>

          <div className="flex flex-wrap gap-2 mb-5">
            {item.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={`text-xs font-medium ${tagColors[tag] || "bg-slate-50 text-slate-600 border-slate-200"}`}
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 rounded-full px-5 gap-2 text-sm"
              onClick={
                item.type === "audio" ? handleListen :
                item.type === "video" ? () => setVideoOpen(true) :
                item.type === "artigo" ? () => setArticleOpen(true) :
                undefined
              }
            >
              {item.type === "audio" ? (
                speaking ? <><Square className="w-4 h-4" /> Parar</> : <><Play className="w-4 h-4" /> Ouvir</>
              ) : item.type === "video" ? (
                <><Play className="w-4 h-4" /> Assistir</>
              ) : (
                <><ChevronRight className="w-4 h-4" /> Ler Artigo</>
              )}
            </Button>
            <Button variant="outline" className="rounded-full px-5 gap-2 text-sm">
              <Download className="w-4 h-4" /> Baixar
            </Button>
          </div>

          {videoOpen && item.videoId && (
            <VideoModal
              videoId={item.videoId}
              title={item.title}
              onClose={() => setVideoOpen(false)}
            />
          )}

          {articleOpen && item.articleContent && (
            <ArticleModal
              title={item.title}
              content={item.articleContent}
              onClose={() => setArticleOpen(false)}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}