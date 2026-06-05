// Composer.tsx — the putty-ai chat input bar: textarea, model picker, tool toggles, mode toggle, send.
declare const React: typeof import('react');
declare const Icons: any;

type ComposerProps = {
  value: string;
  mode: 'agent' | 'chat';
  webOn: boolean;
  shellOn: boolean;
  model: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onMode: (m: 'agent' | 'chat') => void;
  onToggleWeb: () => void;
  onToggleShell: () => void;
};

function Composer(props: ComposerProps) {
  const { value, mode, webOn, shellOn, model, onChange, onSend, onMode, onToggleWeb, onToggleShell } = props;
  const taRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
  }, [value]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="composer-wrap">
      <div className="composer">
        <div className="composer-top">
          <textarea
            ref={taRef}
            rows={1}
            value={value}
            placeholder="Message putty-ai..."
            aria-label="Message input"
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="mpick" title="Switch model">{model} <Icons.Chevron size={10} /></button>
        </div>
        <div className="composer-bot">
          <button className="cib" title="More tools" aria-label="More tools"><Icons.Chevron size={16} /></button>
          <button className={'cib' + (webOn ? ' on' : '')} title="Web search" aria-pressed={webOn} onClick={onToggleWeb}><Icons.Search size={16} sw={2} /></button>
          <button className={'cib' + (shellOn ? ' on' : '')} title="Shell access" aria-pressed={shellOn} onClick={onToggleShell}><Icons.Shell size={16} /></button>
          <div className="mode-toggle" role="group" aria-label="Mode">
            <button className={'mtb' + (mode === 'agent' ? ' on' : '')} aria-pressed={mode === 'agent'} onClick={() => onMode('agent')}>Agent</button>
            <button className={'mtb' + (mode === 'chat' ? ' on' : '')} aria-pressed={mode === 'chat'} onClick={() => onMode('chat')}>Chat</button>
          </div>
          <button className="send" aria-label="Send" disabled={!value.trim()} onClick={onSend}><Icons.Send size={15} /></button>
        </div>
      </div>
    </div>
  );
}

(window as any).Composer = Composer;
