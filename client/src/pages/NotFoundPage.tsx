import { useState, useEffect, useRef, useMemo, type FormEvent, type KeyboardEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal as TerminalIcon,
  Home,
  BookOpen,
  ArrowLeft,
  CornerDownLeft,
  Trash2,
  Sparkles,
  Maximize2,
  Minimize2,
  FolderTree,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react';
import { SEO } from '@/components/seo/SEO';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

interface TerminalOutput {
  id: string;
  type: 'input' | 'system' | 'error' | 'success' | 'info' | 'ascii' | 'custom';
  text?: string;
  content?: React.ReactNode;
}

const ASCII_404 = `
 ██████   ██████  ██   ██ 
██  ████ ██    ██ ██   ██ 
██ ██ ██ ██    ██ ███████ 
████  ██ ██    ██      ██ 
 ██████   ██████       ██ 
`;

export function NotFoundPage() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isMaximized, setIsMaximized] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initial diagnostic log
  const initialOutputs = useMemo<TerminalOutput[]>(() => [
    {
      id: 'boot-1',
      type: 'system',
      text: `[SYSTEM] 404 NOT_FOUND_HANDLER v2.4.0 (x86_64-portfolio-linux)`,
    },
    {
      id: 'boot-2',
      type: 'info',
      text: `[ROUTER] Lookup initiated for requested URI: "${location.pathname}"`,
    },
    {
      id: 'boot-3',
      type: 'error',
      text: `[FATAL] 404_ERR: Route pointer returned NULL (0x00000404)`,
    },
    {
      id: 'boot-ascii',
      type: 'ascii',
      text: ASCII_404,
    },
    {
      id: 'boot-tip',
      type: 'custom',
      content: (
        <div className="text-xs sm:text-sm text-slate-400 border-l-2 border-amber-500/60 pl-3 py-1 my-2 bg-amber-500/5 rounded-r">
          <p className="text-amber-400 font-semibold mb-0.5">
            {i18n.language === 'tr' ? 'Hedef Konum Bulunamadı' : 'Target Destination Not Found'}
          </p>
          <p>
            {i18n.language === 'tr'
              ? 'Aradığınız sayfa silinmiş, taşınmış ya da hiç var olmamış olabilir. Komut satırına '
              : 'The requested resource may have been deleted, moved, or never existed. Type '}
            <code className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs">
              help
            </code>
            {i18n.language === 'tr'
              ? ' yazarak mevcut komutları görebilir veya aşağıdaki butonları kullanabilirsiniz.'
              : ' to explore interactive commands, or use the quick buttons below.'}
          </p>
        </div>
      ),
    },
  ], [location.pathname, i18n.language]);

  const [outputs, setOutputs] = useState<TerminalOutput[]>(initialOutputs);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [outputs]);

  // Focus terminal input on load & click
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Matrix Rain Easter Egg
  useEffect(() => {
    if (!matrixActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = canvas.parentElement?.clientHeight || 400;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789404';
    const alphabet = katakana + latin;

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const rainDrops: number[] = Array.from({ length: columns }).map(() => 1);

    const render = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#10b981';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        const dropY = rainDrops[i] ?? 1;
        ctx.fillText(text, i * fontSize, dropY * fontSize);

        if (dropY * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        } else {
          rainDrops[i] = dropY + 1;
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Auto-disable matrix after 10 seconds or when user types 'matrix' again
    const timeout = setTimeout(() => {
      setMatrixActive(false);
    }, 12000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeout);
    };
  }, [matrixActive]);

  const handleCopyPath = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeCommand = (cmdStr: string) => {
    const rawCmd = cmdStr.trim();
    if (!rawCmd) return;

    const nextOutputs: TerminalOutput[] = [
      ...outputs,
      {
        id: `cmd-${Date.now()}`,
        type: 'input',
        text: rawCmd,
      },
    ];

    // Add to history
    setHistory((prev) => [rawCmd, ...prev.filter((c) => c !== rawCmd)]);
    setHistoryIndex(-1);

    const lower = rawCmd.toLowerCase();
    const parts = lower.split(' ');
    const cmd = parts[0];
    const arg = parts.slice(1).join(' ');

    switch (cmd) {
      case 'help': {
        nextOutputs.push({
          id: `out-${Date.now()}`,
          type: 'custom',
          content: (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm py-1 font-mono">
              <div>
                <span className="text-cyan-400 font-bold">home / cd /</span> :{' '}
                <span className="text-slate-400">
                  {i18n.language === 'tr' ? 'Ana sayfaya git' : 'Return to home page'}
                </span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">blog / cd blog</span> :{' '}
                <span className="text-slate-400">
                  {i18n.language === 'tr' ? 'Teknik blog yazılarını oku' : 'Explore blog articles'}
                </span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">projects</span> :{' '}
                <span className="text-slate-400">
                  {i18n.language === 'tr' ? 'Öne çıkan projeyi incele' : 'View featured OCPP project'}
                </span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">contact</span> :{' '}
                <span className="text-slate-400">
                  {i18n.language === 'tr' ? 'İletişim formuna git' : 'Jump to contact section'}
                </span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">ls</span> :{' '}
                <span className="text-slate-400">
                  {i18n.language === 'tr' ? 'Rehber ve sayfaları listele' : 'List reachable directories'}
                </span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">pwd</span> :{' '}
                <span className="text-slate-400">
                  {i18n.language === 'tr' ? 'Mevcut rotayı yazdır' : 'Print current path'}
                </span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">whoami</span> :{' '}
                <span className="text-slate-400">
                  {i18n.language === 'tr' ? 'Kullanıcı rolünü göster' : 'Show visitor profile'}
                </span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">date</span> :{' '}
                <span className="text-slate-400">
                  {i18n.language === 'tr' ? 'Sistem zaman damgası' : 'Print system timestamp'}
                </span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">matrix</span> :{' '}
                <span className="text-emerald-400 font-semibold">
                  {i18n.language === 'tr' ? 'Dijital matrix yağmuru modu' : 'Digital matrix rain easter egg'}
                </span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">cat 404.log</span> :{' '}
                <span className="text-slate-400">
                  {i18n.language === 'tr' ? 'Hata kaydını incele' : 'Inspect anomaly incident log'}
                </span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">clear</span> :{' '}
                <span className="text-slate-400">
                  {i18n.language === 'tr' ? 'Ekranı temizle' : 'Clear terminal log'}
                </span>
              </div>
              <div>
                <span className="text-cyan-400 font-bold">back</span> :{' '}
                <span className="text-slate-400">
                  {i18n.language === 'tr' ? 'Önceki sayfaya dön' : 'Navigate backward in history'}
                </span>
              </div>
            </div>
          ),
        });
        break;
      }

      case 'home':
      case 'cd': {
        if (!arg || arg === '/' || arg === '~' || arg === '..' || arg === 'home') {
          nextOutputs.push({
            id: `out-${Date.now()}`,
            type: 'success',
            text: i18n.language === 'tr' ? '🏠 Ana sayfaya yönlendiriliyorsunuz...' : '🏠 Redirecting to home...',
          });
          setOutputs(nextOutputs);
          setTimeout(() => navigate('/'), 800);
          return;
        } else if (arg === 'blog') {
          nextOutputs.push({
            id: `out-${Date.now()}`,
            type: 'success',
            text: '📝 Redirecting to /blog...',
          });
          setOutputs(nextOutputs);
          setTimeout(() => navigate('/blog'), 800);
          return;
        } else if (arg === 'projects') {
          nextOutputs.push({
            id: `out-${Date.now()}`,
            type: 'success',
            text: '⚡ Redirecting to /projects/ocpp-gateway...',
          });
          setOutputs(nextOutputs);
          setTimeout(() => navigate('/projects/ocpp-gateway'), 800);
          return;
        } else if (arg === 'contact') {
          nextOutputs.push({
            id: `out-${Date.now()}`,
            type: 'success',
            text: '📬 Redirecting to #contact...',
          });
          setOutputs(nextOutputs);
          setTimeout(() => navigate('/#contact'), 800);
          return;
        } else {
          nextOutputs.push({
            id: `out-${Date.now()}`,
            type: 'error',
            text: `cd: no such file or directory: ${arg}`,
          });
        }
        break;
      }

      case 'blog': {
        nextOutputs.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: i18n.language === 'tr' ? '📝 Blog sayfasına gidiliyor...' : '📝 Navigating to Blog...',
        });
        setOutputs(nextOutputs);
        setTimeout(() => navigate('/blog'), 800);
        return;
      }

      case 'projects':
      case 'project': {
        nextOutputs.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: i18n.language === 'tr' ? '⚡ Proje detayına gidiliyor...' : '⚡ Navigating to OCPP Gateway project...',
        });
        setOutputs(nextOutputs);
        setTimeout(() => navigate('/projects/ocpp-gateway'), 800);
        return;
      }

      case 'contact': {
        nextOutputs.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: i18n.language === 'tr' ? '📬 İletişim bölümüne gidiliyor...' : '📬 Navigating to contact section...',
        });
        setOutputs(nextOutputs);
        setTimeout(() => navigate('/#contact'), 800);
        return;
      }

      case 'back': {
        nextOutputs.push({
          id: `out-${Date.now()}`,
          type: 'info',
          text: i18n.language === 'tr' ? '⬅️ Önceki sayfaya dönülüyor...' : '⬅️ Navigating back...',
        });
        setOutputs(nextOutputs);
        setTimeout(() => navigate(-1), 600);
        return;
      }

      case 'ls': {
        nextOutputs.push({
          id: `out-${Date.now()}`,
          type: 'custom',
          content: (
            <div className="space-y-1 font-mono text-xs sm:text-sm">
              <div className="text-slate-500">total 5 entries</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-indigo-400 font-semibold">
                <div>📁 home/</div>
                <div>📁 blog/</div>
                <div>📁 projects/</div>
                <div>📁 contact/</div>
              </div>
              <div className="text-amber-400 font-semibold mt-1">
                📄 404.log <span className="text-xs text-slate-500">(try: cat 404.log)</span>
              </div>
            </div>
          ),
        });
        break;
      }

      case 'pwd': {
        nextOutputs.push({
          id: `out-${Date.now()}`,
          type: 'info',
          text: `/var/www/umut.dev/void${location.pathname}`,
        });
        break;
      }

      case 'whoami': {
        nextOutputs.push({
          id: `out-${Date.now()}`,
          type: 'custom',
          content: (
            <div className="text-xs sm:text-sm font-mono text-slate-300">
              <p><span className="text-cyan-400 font-bold">User:</span> guest_visitor</p>
              <p><span className="text-cyan-400 font-bold">Host:</span> umut.dev</p>
              <p><span className="text-cyan-400 font-bold">Permissions:</span> read-only (unauthorized on void routes)</p>
              <p><span className="text-cyan-400 font-bold">Status:</span> Lost in cyberspace 🛰️</p>
            </div>
          ),
        });
        break;
      }

      case 'date': {
        nextOutputs.push({
          id: `out-${Date.now()}`,
          type: 'info',
          text: new Date().toUTCString(),
        });
        break;
      }

      case 'echo': {
        nextOutputs.push({
          id: `out-${Date.now()}`,
          type: 'system',
          text: arg || '',
        });
        break;
      }

      case 'matrix': {
        const nextState = !matrixActive;
        setMatrixActive(nextState);
        nextOutputs.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: nextState
            ? '🟢 Matrix digital rain initialized. Wake up, Neo...'
            : '⚪ Matrix mode disabled.',
        });
        break;
      }

      case 'cat': {
        if (arg === '404.log' || arg === 'log') {
          nextOutputs.push({
            id: `out-${Date.now()}`,
            type: 'custom',
            content: (
              <div className="bg-black/40 border border-slate-800 rounded p-3 text-xs font-mono text-slate-300 space-y-1">
                <div className="text-red-400 font-bold">--- BEGIN 404 INCIDENT REPORT ---</div>
                <div>[0.0001] Client GET {location.pathname} HTTP/2.0</div>
                <div>[0.0042] Checking Redis route cache... MISS</div>
                <div>[0.0098] Querying react-router hierarchy... 0 matches found</div>
                <div>[0.0150] Cosmic ray bit-flip probability: 0.0000001%</div>
                <div>[0.0195] Conclusion: Developer either moved this route or you made a typo.</div>
                <div className="text-emerald-400">[0.0210] Safe recovery path available at: /home</div>
                <div className="text-red-400 font-bold">--- END 404 INCIDENT REPORT ---</div>
              </div>
            ),
          });
        } else {
          nextOutputs.push({
            id: `out-${Date.now()}`,
            type: 'error',
            text: `cat: ${arg || 'file'}: No such file or directory`,
          });
        }
        break;
      }

      case 'sudo': {
        nextOutputs.push({
          id: `out-${Date.now()}`,
          type: 'error',
          text: `[sudo] password for guest: ***\nguest is not in the sudoers file. This incident will be reported to Umut.`,
        });
        break;
      }

      case 'clear': {
        setOutputs([]);
        setInputVal('');
        return;
      }

      case 'exit': {
        navigate('/');
        return;
      }

      default: {
        nextOutputs.push({
          id: `out-${Date.now()}`,
          type: 'error',
          text: `zsh: command not found: "${cmd}". Type 'help' to see valid commands.`,
        });
        break;
      }
    }

    setOutputs(nextOutputs);
    setInputVal('');
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    executeCommand(inputVal);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex + 1 < history.length ? historyIndex + 1 : historyIndex;
      setHistoryIndex(nextIdx);
      setInputVal(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx] || '');
      }
    }
  };

  const quickCommands = [
    { label: 'cd /home', cmd: 'home', icon: <Home className="w-3.5 h-3.5" /> },
    { label: 'cd /blog', cmd: 'blog', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { label: 'cd /projects', cmd: 'projects', icon: <FolderTree className="w-3.5 h-3.5" /> },
    { label: 'help', cmd: 'help', icon: <TerminalIcon className="w-3.5 h-3.5" /> },
    { label: 'matrix', cmd: 'matrix', icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> },
    { label: 'clear', cmd: 'clear', icon: <Trash2 className="w-3.5 h-3.5 text-red-400" /> },
  ];

  return (
    <>
      <SEO
        title={`${t('notFound.title', '404 - Sayfa Bulunamadı')} | Umut Patlak`}
        description={t(
          'notFound.subtitle',
          'Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak kullanım dışı olabilir.'
        )}
        noindex={true}
      />

      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center py-8 sm:py-12">
        <Container>
          {/* Header section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-2xl mx-auto mb-6 sm:mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm font-mono mb-3 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              {t('notFound.badge', 'HTTP 404 // NOT FOUND')}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-100 tracking-tight font-sans">
              {t('notFound.title', 'Sayfa Bulunamadı')}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-400">
              {t(
                'notFound.subtitle',
                'Aradığınız sayfa silinmiş, yolu değiştirilmiş veya dijital evrenin derinliklerinde kaybolmuş olabilir.'
              )}
            </p>
          </motion.div>

          {/* Terminal Window Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`mx-auto w-full transition-all duration-300 ${
              isMaximized ? 'max-w-5xl' : 'max-w-3xl'
            }`}
          >
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 dark:border-indigo-500/20 bg-[#0c0d14]/95 shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
              {/* Matrix Canvas Overlay */}
              <AnimatePresence>
                {matrixActive && (
                  <motion.canvas
                    ref={canvasRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.85 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none z-10 w-full h-full"
                  />
                )}
              </AnimatePresence>

              {/* Terminal Title Bar */}
              <div className="relative z-20 flex items-center justify-between px-4 py-3 bg-[#13141f] border-b border-slate-800/80 select-none">
                {/* Traffic lights */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(-1)}
                    title={t('notFound.goBack', 'Geri Dön')}
                    className="w-3 h-3 rounded-full bg-red-500/90 hover:bg-red-400 hover:shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-all cursor-pointer flex items-center justify-center group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black font-bold">×</span>
                  </button>
                  <button
                    onClick={() => setOutputs([])}
                    title={t('notFound.commands.clear', 'Temizle')}
                    className="w-3 h-3 rounded-full bg-amber-500/90 hover:bg-amber-400 hover:shadow-[0_0_8px_rgba(245,158,11,0.8)] transition-all cursor-pointer flex items-center justify-center group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black font-bold">-</span>
                  </button>
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    title={isMaximized ? 'Küçült' : 'Büyüt'}
                    className="w-3 h-3 rounded-full bg-emerald-500/90 hover:bg-emerald-400 hover:shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all cursor-pointer flex items-center justify-center group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-[7px] text-black font-bold">+</span>
                  </button>
                </div>

                {/* Center Title */}
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-medium">
                  <TerminalIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>guest@umut.dev: ~{location.pathname}</span>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyPath}
                    title={copied ? 'Kopyalandı' : 'URL Kopyala'}
                    className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors hidden sm:block"
                  >
                    {isMaximized ? (
                      <Minimize2 className="w-3.5 h-3.5" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terminal Screen Body */}
              <div
                onClick={() => inputRef.current?.focus()}
                className={`relative z-20 p-4 sm:p-6 font-mono text-xs sm:text-sm overflow-y-auto cursor-text transition-all ${
                  isMaximized ? 'h-[500px]' : 'h-[360px] sm:h-[400px]'
                }`}
              >
                {/* Outputs stream */}
                <div className="space-y-2">
                  {outputs.map((out) => {
                    if (out.type === 'input') {
                      return (
                        <div key={out.id} className="flex items-start gap-2 text-indigo-300">
                          <span className="text-emerald-400 select-none">guest@umut.dev:~$</span>
                          <span className="font-semibold text-white break-all">{out.text}</span>
                        </div>
                      );
                    }
                    if (out.type === 'system') {
                      return (
                        <div key={out.id} className="text-slate-400 leading-relaxed">
                          {out.text}
                        </div>
                      );
                    }
                    if (out.type === 'info') {
                      return (
                        <div key={out.id} className="text-cyan-400/90">
                          {out.text}
                        </div>
                      );
                    }
                    if (out.type === 'error') {
                      return (
                        <div key={out.id} className="text-red-400 font-semibold flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                          <span className="break-all">{out.text}</span>
                        </div>
                      );
                    }
                    if (out.type === 'success') {
                      return (
                        <div key={out.id} className="text-emerald-400 font-semibold">
                          {out.text}
                        </div>
                      );
                    }
                    if (out.type === 'ascii') {
                      return (
                        <pre
                          key={out.id}
                          className="text-indigo-400 font-bold leading-none select-none text-[10px] sm:text-xs md:text-sm overflow-x-hidden my-1 drop-shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                        >
                          {out.text}
                        </pre>
                      );
                    }
                    if (out.type === 'custom') {
                      return <div key={out.id}>{out.content}</div>;
                    }
                    return null;
                  })}
                </div>

                {/* Interactive Prompt Line */}
                <form
                  onSubmit={handleFormSubmit}
                  className="flex items-center gap-2 mt-3 pt-2 text-indigo-300"
                >
                  <span className="text-emerald-400 select-none shrink-0 font-bold">
                    guest@umut.dev:~$
                  </span>
                  <div className="relative flex-1 flex items-center">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={t('notFound.inputPlaceholder', 'Komut yazın (örn: help, home, blog)...')}
                      className="w-full bg-transparent text-white focus:outline-none font-mono text-xs sm:text-sm placeholder-slate-600 caret-indigo-400"
                      autoFocus
                    />
                    <button
                      type="submit"
                      title="Çalıştır"
                      className="ml-2 text-slate-500 hover:text-indigo-400 transition-colors p-1"
                    >
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>

                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Footer Quick Bar */}
              <div className="relative z-20 px-4 py-2.5 bg-[#10111a] border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-500 text-[11px] font-mono mr-1">
                    {t('notFound.quickCommands', 'Hızlı Komutlar')}:
                  </span>
                  {quickCommands.map((btn) => (
                    <button
                      key={btn.cmd}
                      onClick={() => executeCommand(btn.cmd)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/60 hover:bg-indigo-600/20 hover:text-indigo-300 text-slate-300 text-[11px] font-mono border border-slate-700/50 transition-all cursor-pointer"
                    >
                      {btn.icon}
                      <span>{btn.label}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setOutputs(initialOutputs)}
                  className="text-slate-500 hover:text-slate-300 text-[11px] font-mono transition-colors ml-auto"
                >
                  [Reset Terminal]
                </button>
              </div>
            </div>
          </motion.div>

          {/* Standard Navigation CTA Fallbacks */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8"
          >
            <Link to="/">
              <Button variant="primary" icon={<Home className="w-4 h-4" />}>
                {t('notFound.backHome', 'Ana Sayfaya Dön')}
              </Button>
            </Link>

            <Link to="/blog">
              <Button variant="secondary" icon={<BookOpen className="w-4 h-4" />}>
                {t('notFound.viewBlog', 'Blog Yazılarını Gör')}
              </Button>
            </Link>

            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              {t('notFound.goBack', 'Geri Dön')}
            </Button>
          </motion.div>
        </Container>
      </div>
    </>
  );
}
