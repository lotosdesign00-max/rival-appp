// Export Utilities for AI Generators (JSON, Formatted Document / PDF, SVG)

export const exportAsJSON = (filename: string, data: Record<string, any>) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.json') ? filename : `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportAsFormattedDoc = (filename: string, title: string, contentHtml: string) => {
  const fullHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #050508;
      color: #f4f4f5;
      margin: 0;
      padding: 40px;
      line-height: 1.6;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background-color: #0c0c14;
      border: 1px solid #27272a;
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    h1 { font-size: 24px; font-weight: 800; color: #ffffff; margin-top: 0; border-bottom: 2px solid #6366f1; padding-bottom: 12px; }
    h2 { font-size: 18px; font-weight: 700; color: #a5b4fc; margin-top: 24px; }
    p { font-size: 14px; color: #a1a1aa; }
    .badge { display: inline-block; background: #1e1b4b; color: #818cf8; font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 4px 10px; border-radius: 99px; font-weight: 700; }
    .color-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin: 16px 0; }
    .color-card { background: #07070c; border: 1px solid #27272a; border-radius: 16px; padding: 12px; text-align: center; }
    .color-swatch { height: 60px; border-radius: 12px; margin-bottom: 8px; border: 1px solid rgba(255,255,255,0.1); }
    .hex { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #ffffff; font-size: 13px; }
    .footer { margin-top: 40px; border-top: 1px solid #27272a; pt-16px; font-size: 11px; color: #71717a; text-align: center; }
    @media print {
      body { background: #ffffff; color: #000000; padding: 0; }
      .container { border: none; box-shadow: none; background: #ffffff; color: #000000; }
      h1 { color: #000000; border-bottom-color: #000000; }
      h2 { color: #333333; }
      .color-card { background: #f4f4f5; border-color: #e4e4e7; }
      .hex { color: #000000; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
      <span class="badge">RIVAL SPACE AI SYSTEM EXPORT</span>
      <span style="font-size:12px; color:#71717a; font-family:'JetBrains Mono';">${new Date().toLocaleDateString()}</span>
    </div>
    <h1>${title}</h1>
    ${contentHtml}
    <div class="footer">
      Generated automatically by Rival Space AI Generator &bull; www.rivalspace.ai
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.html') ? filename : `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportAsSVG = (filename: string, svgMarkup: string) => {
  const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
