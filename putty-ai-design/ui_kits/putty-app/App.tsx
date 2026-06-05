// App.tsx — assembles the putty-ai workspace into a click-through prototype.
// Flow: login → welcome → type a message → session is created, assistant "streams" a reply.
declare const React: typeof import('react');
declare const ReactDOM: any;
declare const Sidebar: any;
declare const Composer: any;
declare const Welcome: any;
declare const Transcript: any;
declare const Login: any;

type Msg = { id: string; role: 'user' | 'ai'; text: string; streaming?: boolean };
type Session = { id: string; title: string; messages: Msg[] };

// A few brand-flavored canned replies so the demo feels alive (no backend).
const REPLIES = [
  "Hey — warmed up and running locally on your hardware. Nothing leaves this machine unless you point me at an external endpoint. What are we building?",
  "Good question. In `Agent` mode I can plan the task, call tools — `bash`, files, web search, memory — and work through it end to end. Want me to take it from here?",
  "I can serve that model for you from the `Cookbook` — it scans your VRAM, scores the fit, and starts a llama.cpp or vLLM server. Say the word and I'll spin it up.",
];

let uid = 0;
const nextId = () => 'm' + (++uid);

// All built-in themes from the source app (see /themes.ts and /themes.css).
// `putty` is the monochrome house brand and the default.
const THEME_LIST: { key: string; label: string }[] = [
  { key: 'putty', label: 'putty (mono)' },
  { key: 'putty-light', label: 'putty (light)' },
  { key: 'dark', label: 'Original' },
  { key: 'light', label: 'Light' },
  { key: 'midnight', label: 'Midnight' },
  { key: 'paper', label: 'Paper' },
  { key: 'cyberpunk', label: 'Cyberpunk' },
  { key: 'retrowave', label: 'Retrowave' },
  { key: 'forest', label: 'Forest' },
  { key: 'ocean', label: 'Ocean' },
  { key: 'ume', label: 'Ume' },
  { key: 'copper', label: 'Copper' },
  { key: 'terminal', label: 'Terminal' },
  { key: 'organs', label: 'Organs' },
  { key: 'lavender', label: 'Lavender' },
  { key: 'gpt', label: 'GPT' },
  { key: 'claude', label: 'Claude' },
  { key: 'cute', label: 'Cute' },
];

function ThemeSwitcher({ value, onChange }: { value: string; onChange: (k: string) => void }) {
  return (
    <label className="theme-switch" title="Theme">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><path d="M12 2a7 7 0 0 0 0 20 4 4 0 0 1 0-8 4 4 0 0 0 0-8" /><circle cx="8" cy="9" r="1.3" fill="currentColor" /><circle cx="15" cy="14" r="1.3" fill="currentColor" />
      </svg>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label="Select theme">
        {THEME_LIST.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
      </select>
    </label>
  );
}

function App() {
  const [userName, setUserName] = React.useState<string | null>(null);
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState('');
  const [mode, setMode] = React.useState<'agent' | 'chat'>('agent');
  const [webOn, setWebOn] = React.useState(false);
  const [shellOn, setShellOn] = React.useState(false);
  const [navOpen, setNavOpen] = React.useState(false);
  const [model] = React.useState('llama-3.1-8b');
  const [theme, setTheme] = React.useState<string>(() => {
    try { return localStorage.getItem('putty-kit-theme') || 'putty'; } catch { return 'putty'; }
  });
  const replyIdx = React.useRef(0);

  // Apply the theme by toggling data-theme on <html> (themes.css does the rest).
  // Suppress transitions for one frame so switching themes can't leave a
  // var()-based background/color stuck mid-fade.
  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme-switching', '');
    root.dataset.theme = theme;
    const id = window.requestAnimationFrame(() => window.requestAnimationFrame(() => root.removeAttribute('data-theme-switching')));
    try { localStorage.setItem('putty-kit-theme', theme); } catch { /* ignore */ }
    return () => window.cancelAnimationFrame(id);
  }, [theme]);

  const active = sessions.find((s) => s.id === activeId) || null;
  const messages = active ? active.messages : [];

  const patchSession = (id: string, fn: (s: Session) => Session) =>
    setSessions((prev) => prev.map((s) => (s.id === id ? fn(s) : s)));

  const streamReply = (sessionId: string) => {
    const full = REPLIES[replyIdx.current % REPLIES.length];
    replyIdx.current += 1;
    const aiId = nextId();
    patchSession(sessionId, (s) => ({ ...s, messages: [...s.messages, { id: aiId, role: 'ai', text: '', streaming: true }] }));
    const words = full.split(' ');
    let i = 0;
    const tick = () => {
      i += 1;
      const partial = words.slice(0, i).join(' ');
      const done = i >= words.length;
      patchSession(sessionId, (s) => ({
        ...s,
        messages: s.messages.map((m) => (m.id === aiId ? { ...m, text: partial, streaming: !done } : m)),
      }));
      if (!done) window.setTimeout(tick, 38 + Math.random() * 34);
    };
    window.setTimeout(tick, 260);
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    let sessionId = activeId;
    if (!sessionId) {
      sessionId = nextId();
      const title = text.length > 30 ? text.slice(0, 30) + '…' : text;
      const sess: Session = { id: sessionId, title, messages: [] };
      setSessions((prev) => [sess, ...prev]);
      setActiveId(sessionId);
    }
    const sid = sessionId as string;
    patchSession(sid, (s) => ({ ...s, messages: [...s.messages, { id: nextId(), role: 'user', text }] }));
    streamReply(sid);
  };

  const newChat = () => { setActiveId(null); setInput(''); setNavOpen(false); };

  if (!userName) return <Login onLogin={setUserName} />;

  return (
    <div className={'app' + (navOpen ? ' nav-open' : '')}>
      <div className="nav-scrim" onClick={() => setNavOpen(false)} />
      <Sidebar
        sessions={sessions}
        activeSession={activeId}
        activeTool={null}
        userName={userName}
        onNewChat={newChat}
        onSelectSession={(id) => { setActiveId(id); setNavOpen(false); }}
        onSelectTool={() => setNavOpen(false)}
        onBrandClick={newChat}
        onBurger={() => setNavOpen((v) => !v)}
      />
      <main className="chat">
        <div className="topbar">
          <button className="topbar-burger" aria-label="Open menu" onClick={() => setNavOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          <span className="topbar-title">{active ? active.title : 'putty-ai'}</span>
          <span style={{ flex: 1 }} />
          <ThemeSwitcher value={theme} onChange={setTheme} />
        </div>
        {active ? <Transcript messages={messages} /> : <Welcome userName={userName} onSetup={() => {}} />}
        <Composer
          value={input}
          mode={mode}
          webOn={webOn}
          shellOn={shellOn}
          model={model}
          onChange={setInput}
          onSend={send}
          onMode={setMode}
          onToggleWeb={() => setWebOn((v) => !v)}
          onToggleShell={() => setShellOn((v) => !v)}
        />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
