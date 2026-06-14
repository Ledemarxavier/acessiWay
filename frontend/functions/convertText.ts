import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const PROMPTS = {
  simplified: (text) => `Você é um especialista em comunicação inclusiva. Simplifique o seguinte texto usando frases curtas (máx 15 palavras cada), vocabulário simples e acessível. Evite jargões e termos técnicos. Mantenha as ideias principais. Escreva em português brasileiro:

${text}`,

  audio: (text) => `Você é um especialista em síntese de voz. Adapte o seguinte texto para ser lido em voz alta de forma natural e clara. Adicione indicações de pausa com vírgulas e pontos. Separe ideias complexas em frases menores. Remova símbolos que não se pronunciam bem. Escreva em português brasileiro:

${text}`,

  braille: (text) => `Converta o seguinte texto para uma representação em Braille usando os caracteres unicode de Braille (⠀-⣿). Mapeie cada letra do português para seu equivalente Braille padrão. Mantenha a estrutura de parágrafos:

${text}`,

  enlarged: (text) => `Você é um especialista em acessibilidade para baixa visão. Reescreva o seguinte texto com:
- Parágrafos curtos (máx 3 frases cada)
- Uma ideia por parágrafo
- Frases bem separadas com ponto final
- Sem abreviações
Escreva em português brasileiro:

${text}`,

  libras: (text) => `Você é um intérprete de LIBRAS. Adapte o seguinte texto para facilitar a interpretação em Língua Brasileira de Sinais. Use estrutura de tópicos, elimine palavras desnecessárias, priorize substantivos e verbos principais. Use ordem: SUJEITO + OBJETO + VERBO quando possível. Escreva em português simplificado para LIBRAS:

${text}`,
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, format } = await req.json();

    if (!text || !text.trim()) {
      return Response.json({ error: 'Texto não fornecido.' }, { status: 400 });
    }

    if (!format || !PROMPTS[format]) {
      return Response.json({ error: 'Formato inválido. Use: simplified, audio, braille, enlarged, libras.' }, { status: 400 });
    }

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: PROMPTS[format](text.trim()),
    });

    return Response.json({ result, format, original: text });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});