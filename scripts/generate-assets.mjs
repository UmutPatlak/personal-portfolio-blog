import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../client/public');
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

// 1. Favicon SVG content
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e1322" />
      <stop offset="100%" stop-color="#070a12" />
    </linearGradient>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.9" />
    </linearGradient>
    <linearGradient id="promptGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
    <linearGradient id="cursorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background container with rounded corners -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  <rect x="10" y="10" width="492" height="492" rx="104" fill="none" stroke="url(#borderGrad)" stroke-width="14" />

  <!-- Subtle ambient glow -->
  <circle cx="256" cy="256" r="160" fill="#6366f1" opacity="0.15" filter="url(#glow)" />

  <!-- Terminal symbols: > and _ perfectly balanced -->
  <g filter="url(#glow)">
    <!-- Terminal '>' chevron -->
    <path d="M 136 168 L 256 256 L 136 344"
          fill="none"
          stroke="url(#promptGrad)"
          stroke-width="52"
          stroke-linecap="round"
          stroke-linejoin="round" />

    <!-- Terminal '_' cursor -->
    <path d="M 296 344 L 376 344"
          fill="none"
          stroke="url(#cursorGrad)"
          stroke-width="52"
          stroke-linecap="round" />
  </g>
</svg>`;

// Helper function to build ICO file from an array of PNG buffers { width, height, buffer }
function createIco(images) {
  // ICO Header: 6 bytes
  // Count images
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(count, 4);

  // Directory entries: 16 bytes each
  const dirSize = 16 * count;
  let currentOffset = 6 + dirSize;
  const dirBuffers = [];
  const imageBuffers = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // Palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // Size
    entry.writeUInt32LE(currentOffset, 12); // Offset

    dirBuffers.push(entry);
    imageBuffers.push(img.buffer);
    currentOffset += img.buffer.length;
  }

  return Buffer.concat([header, ...dirBuffers, ...imageBuffers]);
}

async function renderHtmlToPng(htmlContent, outputPath, width, height) {
  const tempHtmlPath = path.resolve(__dirname, `temp_${Date.now()}_${width}x${height}.html`);
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');

  try {
    const fileUrl = 'file:///' + tempHtmlPath.replace(/\\/g, '/');
    const args = [
      '--headless',
      '--disable-gpu',
      '--hide-scrollbars',
      `--window-size=${width},${height}`,
      `--screenshot=${outputPath}`,
      fileUrl
    ];
    await execFileAsync(edgePath, args);
  } finally {
    if (fs.existsSync(tempHtmlPath)) {
      fs.unlinkSync(tempHtmlPath);
    }
  }
}

async function main() {
  console.log('1. Writing favicon.svg...');
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg, 'utf-8');

  // Favicon HTML template for high-res rendering
  const getFaviconHtml = (size) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: ${size}px; height: ${size}px; overflow: hidden; background: transparent; }
    svg { width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
  ${faviconSvg}
</body>
</html>`;

  console.log('2. Rendering PNG favicons via Edge...');
  const iconSizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 48, name: 'favicon-48x48.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'icon-192x192.png' },
    { size: 512, name: 'icon-512x512.png' },
  ];

  for (const { size, name } of iconSizes) {
    const outPath = path.join(publicDir, name);
    console.log(` Rendering ${name} (${size}x${size})...`);
    await renderHtmlToPng(getFaviconHtml(size), outPath, size, size);
  }

  // Also create android-chrome copies for standard PWA names
  fs.copyFileSync(path.join(publicDir, 'icon-192x192.png'), path.join(publicDir, 'android-chrome-192x192.png'));
  fs.copyFileSync(path.join(publicDir, 'icon-512x512.png'), path.join(publicDir, 'android-chrome-512x512.png'));

  console.log('3. Generating favicon.ico with 16, 32, 48 frames...');
  const icoBuffers = [
    { width: 16, height: 16, buffer: fs.readFileSync(path.join(publicDir, 'favicon-16x16.png')) },
    { width: 32, height: 32, buffer: fs.readFileSync(path.join(publicDir, 'favicon-32x32.png')) },
    { width: 48, height: 48, buffer: fs.readFileSync(path.join(publicDir, 'favicon-48x48.png')) },
  ];
  const icoData = createIco(icoBuffers);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoData);

  console.log('4. Generating Home OG Image (1200x630)...');
  const homeOgHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background-color: #07090e;
      font-family: 'Inter', -apple-system, sans-serif;
      color: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .ambient-glow-1 {
      position: absolute;
      top: -80px;
      left: -80px;
      width: 480px;
      height: 480px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.28) 0%, rgba(99, 102, 241, 0) 70%);
      filter: blur(40px);
    }
    .ambient-glow-2 {
      position: absolute;
      bottom: -80px;
      right: -80px;
      width: 520px;
      height: 520px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, rgba(6, 182, 212, 0) 70%);
      filter: blur(50px);
    }
    .ambient-glow-3 {
      position: absolute;
      top: 40%;
      right: 25%;
      width: 320px;
      height: 320px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, rgba(139, 92, 246, 0) 70%);
      filter: blur(60px);
    }
    .grid-pattern {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 40px 40px;
    }
    .window-card {
      position: relative;
      z-index: 10;
      width: 1100px;
      height: 540px;
      background: rgba(15, 20, 32, 0.82);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(99, 102, 241, 0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .window-header {
      height: 52px;
      background: rgba(10, 14, 24, 0.9);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
    }
    .dots {
      display: flex;
      gap: 8px;
    }
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #eab308; }
    .dot-green { background: #10b981; }
    .terminal-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 500;
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .terminal-title span {
      color: #6366f1;
    }
    .status-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.25);
      font-size: 13px;
      font-weight: 600;
      color: #34d399;
      font-family: 'JetBrains Mono', monospace;
    }
    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }
    .window-body {
      flex: 1;
      padding: 44px 52px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .top-meta {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo-badge {
      width: 58px;
      height: 58px;
      border-radius: 14px;
      background: #0b0f19;
      border: 1.5px solid rgba(99, 102, 241, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.25);
    }
    .logo-badge svg {
      width: 36px;
      height: 36px;
    }
    .meta-text-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 600;
      color: #cbd5e1;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.25);
      padding: 6px 14px;
      border-radius: 8px;
    }
    .main-content {
      margin-top: 10px;
    }
    .name-title {
      font-size: 54px;
      font-weight: 900;
      letter-spacing: -0.03em;
      line-height: 1.1;
      color: #ffffff;
    }
    .role-title {
      font-size: 28px;
      font-weight: 700;
      margin-top: 8px;
      background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.01em;
    }
    .description {
      font-size: 19px;
      line-height: 1.5;
      color: #94a3b8;
      margin-top: 14px;
      max-width: 820px;
    }
    .tech-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 24px;
    }
    .tech-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #e2e8f0;
      font-family: 'JetBrains Mono', monospace;
    }
    .tech-badge span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
    .badge-react span { background: #06b6d4; }
    .badge-nest span { background: #e11d48; }
    .badge-ts span { background: #3b82f6; }
    .badge-node span { background: #22c55e; }
    .badge-spring span { background: #10b981; }
    .badge-pg span { background: #38bdf8; }
    .badge-docker span { background: #60a5fa; }
    .card-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      color: #64748b;
      font-family: 'JetBrains Mono', monospace;
    }
    .footer-url {
      color: #818cf8;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .footer-location {
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="ambient-glow-1"></div>
  <div class="ambient-glow-2"></div>
  <div class="ambient-glow-3"></div>
  <div class="grid-pattern"></div>

  <div class="window-card">
    <div class="window-header">
      <div class="dots">
        <div class="dot dot-red"></div>
        <div class="dot dot-yellow"></div>
        <div class="dot dot-green"></div>
      </div>
      <div class="terminal-title">
        <span>&gt;_</span> umut.dev ~ developer portfolio
      </div>
      <div class="status-badge">
        <div class="status-dot"></div>
        Available for Projects
      </div>
    </div>

    <div class="window-body">
      <div>
        <div class="top-meta">
          <div class="logo-badge">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 18 20 L 32 32 L 18 44" stroke="#6366f1" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M 36 44 L 46 44" stroke="#06b6d4" stroke-width="6" stroke-linecap="round" />
            </svg>
          </div>
          <div class="meta-text-badge">Full-Stack &amp; Software Architect</div>
        </div>

        <div class="main-content">
          <h1 class="name-title">Umut Patlak</h1>
          <div class="role-title">Full-Stack Developer &amp; Software Engineer</div>
          <p class="description">
            Building scalable modern web applications, high-performance NestJS &amp; Spring Boot APIs, and reactive React ecosystems.
          </p>
        </div>

        <div class="tech-badges">
          <div class="tech-badge badge-react"><span></span>React</div>
          <div class="tech-badge badge-nest"><span></span>NestJS</div>
          <div class="tech-badge badge-ts"><span></span>TypeScript</div>
          <div class="tech-badge badge-node"><span></span>Node.js</div>
          <div class="tech-badge badge-spring"><span></span>Spring Boot</div>
          <div class="tech-badge badge-pg"><span></span>PostgreSQL</div>
          <div class="tech-badge badge-docker"><span></span>Docker</div>
        </div>
      </div>

      <div class="card-footer">
        <div class="footer-url">
          ⚡ your-domain.com
        </div>
        <div class="footer-location">
          📍 Istanbul, Turkey • github.com/patlakumut
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  await renderHtmlToPng(homeOgHtml, path.join(publicDir, 'og-image.png'), 1200, 630);
  // Also keep og-image.jpg updated
  fs.copyFileSync(path.join(publicDir, 'og-image.png'), path.join(publicDir, 'og-image.jpg'));

  console.log('5. Generating Blog OG Image (1200x630)...');
  const blogOgHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background-color: #07090e;
      font-family: 'Inter', -apple-system, sans-serif;
      color: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .ambient-glow-1 {
      position: absolute;
      top: -80px;
      left: -80px;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0) 70%);
      filter: blur(45px);
    }
    .ambient-glow-2 {
      position: absolute;
      bottom: -80px;
      right: -80px;
      width: 520px;
      height: 520px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(6, 182, 212, 0) 70%);
      filter: blur(50px);
    }
    .grid-pattern {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 40px 40px;
    }
    .window-card {
      position: relative;
      z-index: 10;
      width: 1100px;
      height: 540px;
      background: rgba(15, 20, 32, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 92, 246, 0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .window-header {
      height: 52px;
      background: rgba(10, 14, 24, 0.9);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
    }
    .dots {
      display: flex;
      gap: 8px;
    }
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #eab308; }
    .dot-green { background: #10b981; }
    .terminal-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 500;
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .terminal-title span {
      color: #a855f7;
    }
    .blog-tag {
      padding: 4px 12px;
      border-radius: 9999px;
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.3);
      font-size: 12px;
      font-weight: 700;
      color: #c084fc;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.05em;
    }
    .window-body {
      flex: 1;
      padding: 44px 52px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .top-meta {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo-badge {
      width: 58px;
      height: 58px;
      border-radius: 14px;
      background: #0b0f19;
      border: 1.5px solid rgba(168, 85, 247, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(168, 85, 247, 0.25);
    }
    .logo-badge svg {
      width: 36px;
      height: 36px;
    }
    .meta-text-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 600;
      color: #e2e8f0;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      background: rgba(168, 85, 247, 0.12);
      border: 1px solid rgba(168, 85, 247, 0.25);
      padding: 6px 14px;
      border-radius: 8px;
    }
    .main-content {
      margin-top: 12px;
    }
    .post-headline {
      font-size: 48px;
      font-weight: 900;
      letter-spacing: -0.03em;
      line-height: 1.15;
      color: #ffffff;
      max-width: 960px;
    }
    .post-subtext {
      font-size: 20px;
      line-height: 1.5;
      color: #94a3b8;
      margin-top: 14px;
      max-width: 860px;
    }
    .topics-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 24px;
    }
    .topic-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
      font-family: 'JetBrains Mono', monospace;
    }
    .topic-pill span {
      color: #06b6d4;
    }
    .card-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      color: #64748b;
      font-family: 'JetBrains Mono', monospace;
    }
    .footer-url {
      color: #c084fc;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .author-info {
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .author-name {
      color: #f8fafc;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="ambient-glow-1"></div>
  <div class="ambient-glow-2"></div>
  <div class="grid-pattern"></div>

  <div class="window-card">
    <div class="window-header">
      <div class="dots">
        <div class="dot dot-red"></div>
        <div class="dot dot-yellow"></div>
        <div class="dot dot-green"></div>
      </div>
      <div class="terminal-title">
        <span>&gt;_</span> umut.dev / blog ~ engineering &amp; architecture
      </div>
      <div class="blog-tag">
        TECHNICAL WRITING
      </div>
    </div>

    <div class="window-body">
      <div>
        <div class="top-meta">
          <div class="logo-badge">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 18 20 L 32 32 L 18 44" stroke="#a855f7" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M 36 44 L 46 44" stroke="#06b6d4" stroke-width="6" stroke-linecap="round" />
            </svg>
          </div>
          <div class="meta-text-badge">Articles &amp; Architecture Tutorials</div>
        </div>

        <div class="main-content">
          <h1 class="post-headline">Software Architecture &amp; Modern Web Insights</h1>
          <p class="post-subtext">
            Deep dives into React, NestJS, TypeScript, microservices, database optimizations, and software craftsmanship.
          </p>
        </div>

        <div class="topics-list">
          <div class="topic-pill"><span>#</span>React</div>
          <div class="topic-pill"><span>#</span>NestJS</div>
          <div class="topic-pill"><span>#</span>TypeScript</div>
          <div class="topic-pill"><span>#</span>Architecture</div>
          <div class="topic-pill"><span>#</span>PostgreSQL</div>
          <div class="topic-pill"><span>#</span>Spring Boot</div>
        </div>
      </div>

      <div class="card-footer">
        <div class="footer-url">
          📖 your-domain.com/blog
        </div>
        <div class="author-info">
          By <span class="author-name">Umut Patlak</span> • Full-Stack Developer
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  await renderHtmlToPng(blogOgHtml, path.join(publicDir, 'og-blog.png'), 1200, 630);

  console.log('Done generating all assets!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
