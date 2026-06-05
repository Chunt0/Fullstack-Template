// Sidebar.tsx — the putty-ai left rail: brand, new chat, search, sessions, models, tools, user bar.
declare const React: typeof import('react');
declare const Icons: any;
declare const Boat: any;

type Session = { id: string; title: string };
type SidebarProps = {
  sessions: Session[];
  activeSession: string | null;
  activeTool: string | null;
  userName: string;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onSelectTool: (tool: string) => void;
  onBrandClick: () => void;
  onBurger?: () => void;
};

const TOOLS: { id: string; label: string; Icon: any }[] = [
  { id: 'brain', label: 'Brain', Icon: Icons.Brain },
  { id: 'calendar', label: 'Calendar', Icon: Icons.Calendar },
  { id: 'compare', label: 'Compare', Icon: Icons.Compare },
  { id: 'cookbook', label: 'Cookbook', Icon: Icons.Cookbook },
  { id: 'research', label: 'Deep Research', Icon: Icons.Research },
  { id: 'gallery', label: 'Gallery', Icon: Icons.Gallery },
  { id: 'library', label: 'Library', Icon: Icons.Library },
  { id: 'notes', label: 'Notes', Icon: Icons.Notes },
  { id: 'tasks', label: 'Tasks', Icon: Icons.Tasks },
  { id: 'theme', label: 'Theme', Icon: Icons.Theme },
];

function Sidebar(props: SidebarProps) {
  const { sessions, activeSession, activeTool, userName, onNewChat, onSelectSession, onSelectTool, onBrandClick, onBurger } = props;
  return (
    <nav className="sb" aria-label="Sidebar">
      <div className="sb-head">
        <button className="sb-burger" title="Toggle sidebar" aria-label="Toggle sidebar" onClick={onBurger}><Icons.Menu size={18} /></button>
        <div className="sb-brand" onClick={onBrandClick} title="New chat">
          <span className="wm">putty-ai</span>
        </div>
      </div>
      <div className="sb-inner">
        <div className="li" onClick={onNewChat}>
          <span className="ic"><Icons.Pencil size={15} /></span>
          <span className="grow">New Chat</span>
        </div>
        <div className="li">
          <span className="ic"><Icons.Search size={14} /></span>
          <span className="grow">Search</span>
        </div>

        <div className="sb-sec">
          <div className="sb-sec-title"><span className="ic"><Icons.Chat size={13} /></span>Chats</div>
          {sessions.length === 0 && (
            <div style={{ fontSize: 12, color: 'var(--muted)', padding: '4px 10px', opacity: 0.7 }}>No conversations yet.</div>
          )}
          {sessions.map((s) => (
            <div key={s.id}
              className={'li session' + (activeSession === s.id ? ' active' : '')}
              onClick={() => onSelectSession(s.id)}>
              <span className="grow">{s.title}</span>
            </div>
          ))}
        </div>

        <div className="sb-sec">
          <div className="sb-sec-title"><span className="ic"><Icons.Chat size={12} /></span>Models</div>
          <div className="model-row">
            <select className="model-sel" aria-label="Select model" defaultValue="llama-3.1-8b">
              <option>llama-3.1-8b</option>
              <option>qwen2.5-14b</option>
              <option>mistral-small</option>
              <option>gpt-4o (API)</option>
            </select>
            <button className="mini-btn">+ Chat</button>
          </div>
        </div>

        <div className="sb-sec">
          <div className="sb-sec-title"><span className="ic"><Icons.Tool size={12} /></span>Tools</div>
          {TOOLS.map((t) => (
            <div key={t.id}
              className={'li' + (activeTool === t.id ? ' active' : '')}
              onClick={() => onSelectTool(t.id)}>
              <span className="ic"><t.Icon size={14} /></span>
              <span className="grow">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sb-user">
        <div className="avatar">{userName.slice(0, 1).toUpperCase()}</div>
        <span className="nm">{userName}</span>
        <button className="iconbtn" title="Settings" aria-label="Settings"><Icons.Settings size={16} /></button>
      </div>
    </nav>
  );
}

(window as any).Sidebar = Sidebar;
