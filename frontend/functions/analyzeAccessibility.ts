import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text } = await req.json();

    if (!text || !text.trim()) {
      return Response.json({ error: 'Texto não fornecido.' }, { status: 400 });
    }

    const prompt = `Analise o seguinte texto quanto à sua acessibilidade e legibilidade para pessoas com diferentes tipos de deficiência. Forneça uma análise detalhada em português brasileiro.

Texto para análise:
"""
${text.trim()}
"""

Retorne um JSON com a seguinte estrutura:
- overall_score: número de 0-100 indicando o nível geral de acessibilidade
- reading_level: classificação do nível de leitura (básico/intermediário/avançado)
- word_count: contagem de palavras
- avg_sentence_length: média de palavras por frase
- issues: array de objetos com { type, severity (baixa/média/alta), description, suggestion }
- strengths: array de strings com pontos positivos do texto
- recommendations: array de strings com recomendações gerais
- wcag_compliance: objeto com { perceivable, operable, understandable, robust } cada um com score 0-100 e notes`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          overall_score: { type: 'number' },
          reading_level: { type: 'string' },
          word_count: { type: 'number' },
          avg_sentence_length: { type: 'number' },
          issues: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                severity: { type: 'string' },
                description: { type: 'string' },
                suggestion: { type: 'string' },
              },
            },
          },
          strengths: { type: 'array', items: { type: 'string' } },
          recommendations: { type: 'array', items: { type: 'string' } },
          wcag_compliance: {
            type: 'object',
            properties: {
              perceivable: { type: 'object', properties: { score: { type: 'number' }, notes: { type: 'string' } } },
              operable: { type: 'object', properties: { score: { type: 'number' }, notes: { type: 'string' } } },
              understandable: { type: 'object', properties: { score: { type: 'number' }, notes: { type: 'string' } } },
              robust: { type: 'object', properties: { score: { type: 'number' }, notes: { type: 'string' } } },
            },
          },
        },
      },
    });

    return Response.json({ analysis: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});