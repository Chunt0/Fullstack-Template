// data.tsx — putty-ai data-display primitives (TypeScript/React).
// Exports to window: Tabs, Segment, Table, Pagination, EmptyState,
// Skeleton, Progress, Legend, BarChart, LineChart, Donut.
declare const React: typeof import('react');
declare const PAIcons: any;

/* ---- Tabs ---------------------------------------------------------------- */
function Tabs({ tabs, value, onChange }: { tabs: { id: string; label: string }[]; value: string; onChange: (id: string) => void }) {
  return (
    <div className="pa-tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={value === t.id} className={'pa-tab' + (value === t.id ? ' is-active' : '')} onClick={() => onChange(t.id)}>{t.label}</button>
      ))}
    </div>
  );
}

/* ---- Segmented control --------------------------------------------------- */
function Segment({ options, value, onChange }: { options: { id: string; label: string }[]; value: string; onChange: (id: string) => void }) {
  return (
    <div className="pa-segment" role="group">
      {options.map((o) => (
        <button key={o.id} aria-pressed={value === o.id} className={value === o.id ? 'is-active' : ''} onClick={() => onChange(o.id)}>{o.label}</button>
      ))}
    </div>
  );
}

/* ---- Table --------------------------------------------------------------- */
type Col = { key: string; label: string; num?: boolean; render?: (row: any) => React.ReactNode };
function Table({ columns, rows }: { columns: Col[]; rows: any[] }) {
  return (
    <div className="pa-table-wrap">
      <table className="pa-table">
        <thead><tr>{columns.map((c) => <th key={c.key} style={c.num ? { textAlign: 'right' } : undefined}>{c.label}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.key} className={c.num ? 'pa-num' : ''} style={c.num ? { textAlign: 'right' } : undefined}>
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---- Pagination ---------------------------------------------------------- */
function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  const nums: (number | string)[] = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== '…') nums.push('…');
  }
  return (
    <div className="pa-pagination">
      <button className="pa-page" disabled={page === 1} aria-label="Previous" onClick={() => onChange(page - 1)}><PAIcons.arrowLeft /></button>
      {nums.map((n, i) => typeof n === 'number'
        ? <button key={i} className={'pa-page' + (n === page ? ' is-active' : '')} onClick={() => onChange(n)}>{n}</button>
        : <span key={i} className="pa-page" style={{ border: 'none', background: 'none', cursor: 'default' }}>…</span>)}
      <button className="pa-page" disabled={page === pages} aria-label="Next" onClick={() => onChange(page + 1)}><PAIcons.arrowRight /></button>
    </div>
  );
}

/* ---- Empty state --------------------------------------------------------- */
function EmptyState({ icon, title, message, action }: { icon?: React.ReactNode; title: string; message?: string; action?: React.ReactNode }) {
  return (
    <div className="pa-empty">
      <div className="pa-empty-ic">{icon ?? <PAIcons.inbox size={22} />}</div>
      <div className="pa-empty-title">{title}</div>
      {message && <div className="pa-empty-msg">{message}</div>}
      {action}
    </div>
  );
}

/* ---- Skeleton ------------------------------------------------------------ */
function Skeleton({ w = '100%', h = 12, r = 6, style }: { w?: number | string; h?: number | string; r?: number; style?: React.CSSProperties }) {
  return <div className="pa-skel" style={{ width: w, height: h, borderRadius: r, ...style }} />;
}

/* ---- Progress ------------------------------------------------------------ */
function Progress({ value }: { value: number }) {
  return <div className="pa-progress"><span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}

/* ---- Legend -------------------------------------------------------------- */
function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="pa-legend">
      {items.map((it, i) => <span key={i} className="pa-legend-item"><span className="pa-legend-swatch" style={{ background: it.color }} />{it.label}</span>)}
    </div>
  );
}

/* ---- BarChart (grouped, SVG) --------------------------------------------- */
function BarChart({ data, height = 150, max }: { data: { label: string; values: number[] }[]; height?: number; max?: number }) {
  const W = 460, H = height, padB = 24, padL = 8, padT = 10;
  const top = max ?? Math.max(...data.flatMap((d) => d.values));
  const groups = data.length;
  const gw = (W - padL * 2) / groups;
  const series = data[0]?.values.length ?? 1;
  const bw = Math.min(18, (gw - 10) / series);
  const colors = ['var(--chart-1)', 'var(--chart-3)', 'var(--chart-2)'];
  const gridY = [0, 0.5, 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {gridY.map((g, i) => { const y = padT + (1 - g) * (H - padT - padB); return <line key={i} x1={padL} x2={W - padL} y1={y} y2={y} stroke="var(--chart-grid)" strokeWidth={1} />; })}
      {data.map((d, gi) => {
        const gx = padL + gi * gw + (gw - bw * series) / 2;
        return (
          <g key={gi}>
            {d.values.map((v, si) => {
              const h = (v / top) * (H - padT - padB);
              return <rect key={si} x={gx + si * bw} y={H - padB - h} width={bw - 3} height={h} rx={2} fill={colors[si % colors.length]} />;
            })}
            <text x={padL + gi * gw + gw / 2} y={H - 8} textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--chart-axis)">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---- LineChart (SVG) ----------------------------------------------------- */
function LineChart({ series, labels, height = 150 }: { series: { color: string; points: number[] }[]; labels?: string[]; height?: number }) {
  const W = 460, H = height, padB = 22, padX = 10, padT = 10;
  const all = series.flatMap((s) => s.points);
  const top = Math.max(...all), bot = Math.min(0, ...all);
  const n = series[0]?.points.length ?? 1;
  const x = (i: number) => padX + (i / (n - 1)) * (W - padX * 2);
  const y = (v: number) => padT + (1 - (v - bot) / (top - bot)) * (H - padT - padB);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {[0, 0.5, 1].map((g, i) => { const yy = padT + g * (H - padT - padB); return <line key={i} x1={padX} x2={W - padX} y1={yy} y2={yy} stroke="var(--chart-grid)" strokeWidth={1} />; })}
      {series.map((s, si) => {
        const d = s.points.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
        return (
          <g key={si}>
            <path d={d} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {s.points.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={2.4} fill={s.color} />)}
          </g>
        );
      })}
      {labels && labels.map((l, i) => <text key={i} x={x(i)} y={H - 7} textAnchor="middle" fontSize="9.5" fontFamily="var(--font-mono)" fill="var(--chart-axis)">{l}</text>)}
    </svg>
  );
}

/* ---- Donut --------------------------------------------------------------- */
function Donut({ segments, size = 120 }: { segments: { value: number; color: string }[]; size?: number }) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  const r = size / 2 - 10, c = size / 2, circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={12} />
      {segments.map((s, i) => {
        const len = (s.value / total) * circ;
        const el = <circle key={i} cx={c} cy={c} r={r} fill="none" stroke={s.color} strokeWidth={12} strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-offset} transform={`rotate(-90 ${c} ${c})`} strokeLinecap="butt" />;
        offset += len; return el;
      })}
    </svg>
  );
}

Object.assign(window as any, { Tabs, Segment, Table, Pagination, EmptyState, Skeleton, Progress, Legend, BarChart, LineChart, Donut });
