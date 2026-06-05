// overlays.tsx — putty-ai overlay & feedback primitives (TypeScript/React).
// Exports to window: Menu, Modal, Toast, Tooltip, Alert.
declare const React: typeof import('react');
declare const PAIcons: any;
declare const Button: any;

/* ---- Menu / dropdown ----------------------------------------------------- */
type MenuItem = { label: string; icon?: React.ReactNode; kbd?: string; danger?: boolean; onClick?: () => void };
function Menu({ label, items, sections }: { label?: string; items?: MenuItem[]; sections?: { label?: string; items: MenuItem[] }[] }) {
  const blocks = sections ?? [{ label, items: items ?? [] }];
  return (
    <div className="pa-menu" role="menu">
      {blocks.map((sec, si) => (
        <React.Fragment key={si}>
          {si > 0 && <div className="pa-menu-sep" />}
          {sec.label && <div className="pa-menu-label">{sec.label}</div>}
          {sec.items.map((it, i) => (
            <div key={i} className={'pa-menu-item' + (it.danger ? ' is-danger' : '')} role="menuitem" onClick={it.onClick}>
              {it.icon}<span>{it.label}</span>{it.kbd && <span className="pa-kbd">{it.kbd}</span>}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ---- Tooltip ------------------------------------------------------------- */
function Tooltip({ text, children, open }: { text: string; children: React.ReactNode; open?: boolean }) {
  return (
    <span className="pa-tooltip">
      {children}
      <span className={'pa-tooltip-bubble' + (open ? ' is-shown' : '')} role="tooltip">{text}</span>
    </span>
  );
}

/* ---- Alert / banner ------------------------------------------------------ */
function Alert({ variant = 'info', title, children, onClose }: { variant?: 'info' | 'success' | 'warn' | 'error'; title?: string; children?: React.ReactNode; onClose?: () => void }) {
  const Ic: Record<string, any> = { info: PAIcons.info, success: PAIcons.checkCircle, warn: PAIcons.alertTri, error: PAIcons.alertCircle };
  const IcEl = Ic[variant];
  return (
    <div className={`pa-alert pa-alert-${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
      <span className="pa-alert-ic"><IcEl size={18} /></span>
      <div className="pa-alert-body">
        {title && <div className="pa-alert-title">{title}</div>}
        {children && <div className="pa-alert-msg">{children}</div>}
      </div>
      {onClose && <button className="pa-x" aria-label="Dismiss" onClick={onClose}><PAIcons.x size={15} /></button>}
    </div>
  );
}

/* ---- Toast --------------------------------------------------------------- */
function Toast({ variant = 'info', children, onClose }: { variant?: 'info' | 'success' | 'error'; children: React.ReactNode; onClose?: () => void }) {
  const Ic: Record<string, any> = { info: PAIcons.info, success: PAIcons.checkCircle, error: PAIcons.alertCircle };
  const IcEl = Ic[variant];
  return (
    <div className={`pa-toast pa-toast-${variant}`} role="status">
      <span className="pa-toast-ic"><IcEl size={18} /></span>
      <div className="pa-toast-body">{children}</div>
      {onClose && <button className="pa-toast-close" aria-label="Dismiss" onClick={onClose}><PAIcons.x size={14} /></button>}
    </div>
  );
}

/* ---- Modal / dialog ------------------------------------------------------
   Renders an absolutely-positioned scrim inside the nearest positioned
   ancestor (so it works inside an artboard, not just full-window). */
function Modal({ title, children, onClose, footer, open = true }: { title?: string; children?: React.ReactNode; onClose?: () => void; footer?: React.ReactNode; open?: boolean }) {
  if (!open) return null;
  return (
    <div className="pa-modal-scrim" onClick={onClose}>
      <div className="pa-modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="pa-modal-head">
          <div className="pa-modal-title">{title}</div>
          {onClose && <button className="pa-x" aria-label="Close" onClick={onClose}><PAIcons.x size={16} /></button>}
        </div>
        <div className="pa-modal-body">{children}</div>
        {footer && <div className="pa-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

Object.assign(window as any, { Menu, Tooltip, Alert, Toast, Modal });
