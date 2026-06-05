// Messages.tsx — welcome screen + chat transcript (user bubbles, streaming assistant).
declare const React: typeof import('react');
declare const Icons: any;
declare const Boat: any;

type Msg = { id: string; role: 'user' | 'ai'; text: string; streaming?: boolean };

function Welcome({ userName, onSetup }: { userName: string; onSetup: () => void }) {
  return (
    <div className="welcome">
      <Boat size={56} className="boat" />
      <div className="wm">putty-ai</div>
      <div className="sub">
        Welcome,{' '}
        <span style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }} onClick={onSetup}>{userName}</span>
      </div>
      <div className="tip">Type /setup, then choose Local models or API.</div>
    </div>
  );
}

function Message({ msg }: { msg: Msg }) {
  if (msg.role === 'user') {
    return (
      <div className="msg user">
        <div className="bubble">{msg.text}</div>
      </div>
    );
  }
  return (
    <div className="msg ai">
      <div className="ai-head"><Boat size={16} className="boat" /> putty-ai</div>
      <div className="bubble">
        {renderText(msg.text)}
        {msg.streaming && <span className="cursor-blink" aria-hidden="true" />}
      </div>
    </div>
  );
}

// Minimal inline-code rendering for `code` spans — enough to feel like the real renderer.
function renderText(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((p, i) =>
    p.startsWith('`') && p.endsWith('`')
      ? React.createElement('code', { key: i }, p.slice(1, -1))
      : React.createElement(React.Fragment, { key: i }, p),
  );
}

function Transcript({ messages }: { messages: Msg[] }) {
  const endRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (endRef.current && endRef.current.parentElement) {
      const h = endRef.current.parentElement.parentElement;
      if (h) h.scrollTop = h.scrollHeight;
    }
  }, [messages]);
  return (
    <div className="history">
      <div className="hwrap">
        {messages.map((m) => <Message key={m.id} msg={m} />)}
        <div ref={endRef} />
      </div>
    </div>
  );
}

(window as any).Welcome = Welcome;
(window as any).Transcript = Transcript;
