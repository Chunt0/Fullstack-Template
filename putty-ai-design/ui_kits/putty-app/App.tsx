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

function App() {
  const [userName, setUserName] = React.useState<string | null>(null);
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState('');
  const [mode, setMode] = React.useState<'agent' | 'chat'>('agent');
  const [webOn, setWebOn] = React.useState(false);
  const [shellOn, setShellOn] = React.useState(false);
  const [model] = React.useState('llama-3.1-8b');
  const replyIdx = React.useRef(0);

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

  const newChat = () => { setActiveId(null); setInput(''); };

  if (!userName) return <Login onLogin={setUserName} />;

  return (
    <div className="app">
      <Sidebar
        sessions={sessions}
        activeSession={activeId}
        activeTool={null}
        userName={userName}
        onNewChat={newChat}
        onSelectSession={setActiveId}
        onSelectTool={() => {}}
        onBrandClick={newChat}
      />
      <main className="chat">
        <div className="topbar">{active ? active.title : 'putty-ai'}</div>
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
