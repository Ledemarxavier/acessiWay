import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const method = req.method;
    const body = method !== 'GET' ? await req.json() : null;
    const action = body?.action;

    // GET: list profiles for current user
    if (method === 'GET') {
      const profiles = await base44.entities.AccessibilityProfile.filter({ created_by: user.email });
      return Response.json({ profiles });
    }

    // POST actions
    if (method === 'POST') {
      if (action === 'create') {
        const { name, disability_type, font_size, font_family, contrast_mode, line_spacing, reading_guide, screen_reader_optimized } = body;

        if (!name || !name.trim()) {
          return Response.json({ error: 'Nome é obrigatório.' }, { status: 400 });
        }

        const profile = await base44.entities.AccessibilityProfile.create({
          name: name.trim(),
          disability_type: disability_type || 'visual',
          font_size: font_size || 'normal',
          font_family: font_family || 'default',
          contrast_mode: contrast_mode || 'normal',
          line_spacing: line_spacing || 'normal',
          reading_guide: reading_guide ?? false,
          screen_reader_optimized: screen_reader_optimized ?? false,
        });

        return Response.json({ profile, message: 'Perfil criado com sucesso.' });
      }

      if (action === 'update') {
        const { id, ...updates } = body;
        if (!id) {
          return Response.json({ error: 'ID do perfil é obrigatório.' }, { status: 400 });
        }

        // Verify ownership
        const existing = await base44.entities.AccessibilityProfile.get(id);
        if (!existing || existing.created_by !== user.email) {
          return Response.json({ error: 'Perfil não encontrado ou sem permissão.' }, { status: 403 });
        }

        delete updates.action;
        const profile = await base44.entities.AccessibilityProfile.update(id, updates);
        return Response.json({ profile, message: 'Perfil atualizado com sucesso.' });
      }

      if (action === 'delete') {
        const { id } = body;
        if (!id) {
          return Response.json({ error: 'ID do perfil é obrigatório.' }, { status: 400 });
        }

        const existing = await base44.entities.AccessibilityProfile.get(id);
        if (!existing || existing.created_by !== user.email) {
          return Response.json({ error: 'Perfil não encontrado ou sem permissão.' }, { status: 403 });
        }

        await base44.entities.AccessibilityProfile.delete(id);
        return Response.json({ message: 'Perfil deletado com sucesso.' });
      }

      if (action === 'recommend') {
        // AI-powered recommendation based on disability type
        const { disability_type } = body;

        const prompt = `Com base no tipo de deficiência "${disability_type}", recomende as melhores configurações de acessibilidade. Responda em JSON com os campos: font_size (normal/large/extra_large), font_family (default/atkinson/opendyslexic/arial/verdana), contrast_mode (normal/high_contrast/inverted/blue_yellow/yellow_black), line_spacing (normal/relaxed/loose), reading_guide (true/false), screen_reader_optimized (true/false). Inclua um campo "justification" explicando brevemente cada escolha em português.`;

        const result = await base44.integrations.Core.InvokeLLM({
          prompt,
          response_json_schema: {
            type: 'object',
            properties: {
              font_size: { type: 'string' },
              font_family: { type: 'string' },
              contrast_mode: { type: 'string' },
              line_spacing: { type: 'string' },
              reading_guide: { type: 'boolean' },
              screen_reader_optimized: { type: 'boolean' },
              justification: { type: 'string' },
            },
          },
        });

        return Response.json({ recommendation: result });
      }
    }

    return Response.json({ error: 'Método ou ação não suportado.' }, { status: 405 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});