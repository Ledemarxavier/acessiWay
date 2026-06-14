import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, format, title, exportFormat } = await req.json();

    if (!text || !text.trim()) {
      return Response.json({ error: 'Texto não fornecido.' }, { status: 400 });
    }

    // exportFormat: 'txt' | 'html' | 'json'
    const ef = exportFormat || 'txt';
    const safeTitle = (title || 'conteudo').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const now = new Date().toISOString();

    let content = '';
    let mimeType = 'text/plain';
    let filename = `${safeTitle}.txt`;

    if (ef === 'html') {
      mimeType = 'text/html';
      filename = `${safeTitle}.html`;
      content = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Conteúdo Acessível'}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.8; max-width: 800px; margin: 40px auto; padding: 20px; color: #1e293b; }
    h1 { color: #1e3a5f; border-bottom: 3px solid #10b981; padding-bottom: 12px; }
    .meta { color: #64748b; font-size: 13px; margin-bottom: 24px; }
    .content { font-size: 16px; white-space: pre-wrap; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; }
  </style>
</head>
<body>
  <h1>${title || 'Conteúdo Acessível'}</h1>
  <div class="meta">
    Formato: ${format || 'original'} · Exportado em: ${new Date().toLocaleDateString('pt-BR')} · AcessiWay
  </div>
  <div class="content">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
  <div class="footer">
    Gerado pela plataforma AcessiWay · Inclusão Digital para Todos
  </div>
</body>
</html>`;
    } else if (ef === 'json') {
      mimeType = 'application/json';
      filename = `${safeTitle}.json`;
      content = JSON.stringify({
        title: title || 'Conteúdo Acessível',
        format: format || 'original',
        exported_at: now,
        exported_by: user.email,
        content: text,
        platform: 'AcessiWay',
        wcag_version: '2.2',
      }, null, 2);
    } else {
      // Plain text
      content = `${title || 'Conteúdo Acessível'}\n${'='.repeat(50)}\nFormato: ${format || 'original'}\nExportado em: ${new Date().toLocaleDateString('pt-BR')}\nPlataforma: AcessiWay\n${'='.repeat(50)}\n\n${text}`;
    }

    // Upload file and return URL
    const blob = new Blob([content], { type: mimeType });
    const file = new File([blob], filename, { type: mimeType });

    const { file_url } = await base44.integrations.Core.UploadFile({ file });

    return Response.json({ file_url, filename, mimeType, message: 'Arquivo gerado com sucesso.' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});