// showcase.tsx — interactive component gallery for putty-ai.
declare const React: typeof import('react');
declare const ReactDOM: any;
declare const PAIcons: any;
declare const Button: any, Field: any, Input: any, Textarea: any, Select: any;
declare const Checkbox: any, Radio: any, Switch: any, Badge: any, Avatar: any, AvatarStack: any;
declare const Menu: any, Tooltip: any, Alert: any, Toast: any, Modal: any;
declare const Tabs: any, Segment: any, Table: any, Pagination: any, EmptyState: any, Skeleton: any, Progress: any, Legend: any, BarChart: any, LineChart: any, Donut: any;

const { useState } = React;

function Section({ title, sub, children, span }: { title: string; sub?: string; children: React.ReactNode; span?: boolean }) {
  return (
    <section className="sc-sec" style={span ? { gridColumn: '1 / -1' } : undefined}>
      <div className="sc-sec-head"><h2>{title}</h2>{sub && <span>{sub}</span>}</div>
      <div className="sc-sec-body">{children}</div>
    </section>
  );
}
const Row = ({ children, gap = 12, wrap = true, align = 'center' }: any) => <div style={{ display: 'flex', flexWrap: wrap ? 'wrap' : 'nowrap', gap, alignItems: align }}>{children}</div>;
const Col = ({ children, gap = 12 }: any) => <div style={{ display: 'flex', flexDirection: 'column', gap }}>{children}</div>;

function App() {
  const [modal, setModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; variant: string; msg: React.ReactNode }[]>([]);
  const [tab, setTab] = useState('overview');
  const [seg, setSeg] = useState('agent');
  const [page, setPage] = useState(3);
  const [chk, setChk] = useState(true);
  const [chk2, setChk2] = useState(false);
  const [radio, setRadio] = useState('local');
  const [sw, setSw] = useState(true);
  const [loading, setLoading] = useState(false);

  const pushToast = (variant: string, msg: React.ReactNode) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, variant, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  const modelRows = [
    { model: 'llama-3.1-8b', size: '4.7 GB', ctx: '128k', tps: 62 },
    { model: 'qwen2.5-14b', size: '8.2 GB', ctx: '32k', tps: 41 },
    { model: 'mistral-small', size: '13 GB', ctx: '32k', tps: 28 },
  ];

  return (
    <div className="sc-wrap">
      <header className="sc-top">
        <div className="sc-brand">
          <svg width="30" height="30" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 4px 14px rgba(224,108,117,.4))' }}><path d="M50 5 C61 4 64 -1 73 5 C82 10 78 19 86 24 C95 30 91 40 93 48 C95 57 99 63 92 71 C86 78 77 73 70 81 C63 89 59 96 49 93 C40 90 36 96 28 89 C21 83 26 75 18 70 C9 65 7 56 9 48 C11 40 3 35 10 27 C16 20 25 25 31 17 C37 10 39 6 50 5 Z" fill="#e06c75" /><ellipse cx="39" cy="47" rx="6" ry="7.5" fill="#161719" /><ellipse cx="62" cy="47" rx="6" ry="7.5" fill="#161719" /><path d="M41 63 q4.5 5.5 9 0" fill="none" stroke="#161719" strokeWidth="3.2" strokeLinecap="round" /></svg>
          <div><div className="sc-title">putty-ai · component library</div><div className="sc-subtitle">Coral on grey · WCAG-aware · TypeScript</div></div>
        </div>
        <Badge variant="accent" dot>17 themes</Badge>
      </header>

      <div className="sc-grid">
        <Section title="Buttons" sub="primary uses AA-safe coral; icon-only uses bright coral">
          <Col>
            <Row>
              <Button variant="primary" icon={<PAIcons.sparkle size={15} />}>Serve model</Button>
              <Button variant="secondary">Cancel</Button>
              <Button variant="ghost">Skip</Button>
              <Button variant="danger" icon={<PAIcons.trash />}>Delete</Button>
            </Row>
            <Row>
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="secondary" size="sm" icon={<PAIcons.download />}>Export</Button>
              <Button variant="primary" size="lg">Large action</Button>
              <Button variant="secondary" disabled>Disabled</Button>
              <span className="pa-icon-accent" title="Send"><PAIcons.plus size={16} /></span>
            </Row>
          </Col>
        </Section>

        <Section title="Form fields" sub="default · focus · error · disabled">
          <Col gap={14}>
            <Field label="Endpoint name" htmlFor="f1" hint="Shown in the model picker.">
              <Input id="f1" defaultValue="llama-3.1-8b-local" icon={<PAIcons.search />} />
            </Field>
            <Field label="API key" htmlFor="f2" error="This field is required.">
              <Input id="f2" invalid placeholder="sk-…" />
            </Field>
            <Field label="System prompt" htmlFor="f3">
              <Textarea id="f3" defaultValue="You are putty — helpful, local, and concise." />
            </Field>
            <Field label="Quantization" htmlFor="f4">
              <Select id="f4" defaultValue="q4"><option value="q4">Q4_K_M</option><option value="q5">Q5_K_M</option><option value="q8">Q8_0</option></Select>
            </Field>
          </Col>
        </Section>

        <Section title="Selection" sub="checkbox · radio · switch">
          <Col gap={13}>
            <Checkbox checked={chk} onChange={setChk} label="Stream tokens" />
            <Checkbox checked={chk2} onChange={setChk2} label="Save to memory" />
            <Checkbox checked={false} onChange={() => {}} label="Disabled option" disabled />
            <div style={{ height: 1, background: 'var(--border)' }} />
            <Radio name="rt" checked={radio === 'local'} onChange={() => setRadio('local')} label="Local models" />
            <Radio name="rt" checked={radio === 'api'} onChange={() => setRadio('api')} label="API provider" />
            <div style={{ height: 1, background: 'var(--border)' }} />
            <Switch checked={sw} onChange={setSw} label="Agent mode" />
          </Col>
        </Section>

        <Section title="Badges & avatars">
          <Col gap={14}>
            <Row gap={8}>
              <Badge>neutral</Badge><Badge variant="accent" dot>active</Badge><Badge variant="success" dot>online</Badge>
              <Badge variant="warn" dot>queued</Badge><Badge variant="error" dot>failed</Badge><Badge variant="solid">PRO</Badge>
            </Row>
            <Row gap={14}>
              <Avatar name="Ada Lovelace" status />
              <Avatar name="Grace Hopper" variant="slate" />
              <Avatar name="Putty" size="lg" ring />
              <AvatarStack names={['Ann Kim', 'Bo Li', 'Cy Park', 'Dee Ray']} />
            </Row>
          </Col>
        </Section>

        <Section title="Dropdown menu">
          <Menu sections={[
            { label: 'llama-3.1-8b', items: [
              { label: 'Rename', icon: <PAIcons.copy />, kbd: '⌘R' },
              { label: 'Duplicate', icon: <PAIcons.plus /> },
              { label: 'Download', icon: <PAIcons.download />, kbd: '⌘S' },
            ] },
            { items: [{ label: 'Delete model', icon: <PAIcons.trash />, danger: true }] },
          ]} />
        </Section>

        <Section title="Tabs & segmented">
          <Col gap={16}>
            <div>
              <Tabs tabs={[{ id: 'overview', label: 'Overview' }, { id: 'params', label: 'Parameters' }, { id: 'logs', label: 'Logs' }]} value={tab} onChange={setTab} />
              <div style={{ padding: '14px 2px', fontSize: 13.5, color: 'var(--muted)' }}>Showing <b style={{ color: 'var(--fg)' }}>{tab}</b>.</div>
            </div>
            <Segment options={[{ id: 'agent', label: 'Agent' }, { id: 'chat', label: 'Chat' }]} value={seg} onChange={setSeg} />
          </Col>
        </Section>

        <Section title="Table" sub="hover rows · tabular numerals" span>
          <Table
            columns={[
              { key: 'model', label: 'Model', render: (r: any) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span className="pa-dot8" style={{ background: 'var(--green)', width: 7, height: 7, borderRadius: 9, display: 'inline-block' }} />{r.model}</span> },
              { key: 'size', label: 'Size', num: true },
              { key: 'ctx', label: 'Context', num: true },
              { key: 'tps', label: 'tok/s', num: true, render: (r: any) => <b style={{ color: 'var(--fg)' }}>{r.tps}</b> },
              { key: 'a', label: '', render: () => <span className="pa-badge pa-badge-success">running</span> },
            ]}
            rows={modelRows}
          />
        </Section>

        <Section title="Alerts">
          <Col gap={10}>
            <Alert variant="info" title="Heads up">Running on your hardware. Nothing leaves this machine.</Alert>
            <Alert variant="success" title="Model served">Listening on :8080.</Alert>
            <Alert variant="warn" title="Low VRAM">This model may not fit alongside others.</Alert>
            <Alert variant="error" title="Download failed" onClose={() => {}}>Checksum mismatch — retry the pull.</Alert>
          </Col>
        </Section>

        <Section title="Overlays" sub="modal · toast · tooltip">
          <Row>
            <Button variant="secondary" onClick={() => setModal(true)}>Open dialog</Button>
            <Button variant="danger" onClick={() => setConfirm(true)}>Confirm delete</Button>
            <Button variant="secondary" onClick={() => pushToast('success', <span><b>Model served.</b> :8080</span>)}>Success toast</Button>
            <Button variant="ghost" onClick={() => pushToast('error', <span><b>Failed.</b> Out of memory</span>)}>Error toast</Button>
            <Tooltip text="Always-on for the demo" open><span className="pa-badge">hover me</span></Tooltip>
          </Row>
        </Section>

        <Section title="Pagination & progress">
          <Col gap={16}>
            <Pagination page={page} pages={9} onChange={setPage} />
            <div><div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Downloading… 64%</div><Progress value={64} /></div>
          </Col>
        </Section>

        <Section title="Empty & loading">
          <Col gap={16}>
            {loading
              ? <Col gap={10}><Skeleton w="60%" h={14} /><Skeleton w="90%" /><Skeleton w="80%" /><Row gap={10}><Skeleton w={44} h={44} r={10} /><Col gap={8}><Skeleton w={120} h={11} /><Skeleton w={80} h={11} /></Col></Row></Col>
              : <EmptyState title="No conversations yet" message="Start a chat to see it here." action={<Button variant="primary" size="sm" icon={<PAIcons.plus />}>New chat</Button>} />}
            <Button variant="ghost" size="sm" onClick={() => setLoading((v) => !v)}>Toggle loading</Button>
          </Col>
        </Section>

        <Section title="Charts" sub="categorical palette on ink" span>
          <div className="sc-charts">
            <div className="pa-card">
              <div className="sc-chart-title">Throughput by model (tok/s)</div>
              <BarChart data={[{ label: '8b', values: [62, 40] }, { label: '14b', values: [41, 25] }, { label: '32b', values: [22, 12] }, { label: '70b', values: [9, 5] }]} max={70} />
              <Legend items={[{ label: 'GPU', color: 'var(--chart-1)' }, { label: 'CPU', color: 'var(--chart-3)' }]} />
            </div>
            <div className="pa-card">
              <div className="sc-chart-title">Requests / hour</div>
              <LineChart labels={['9a', '11a', '1p', '3p', '5p', '7p']} series={[{ color: 'var(--chart-1)', points: [12, 30, 22, 48, 38, 60] }, { color: 'var(--chart-2)', points: [6, 14, 18, 24, 30, 34] }]} />
              <Legend items={[{ label: 'Chat', color: 'var(--chart-1)' }, { label: 'Agents', color: 'var(--chart-2)' }]} />
            </div>
            <div className="pa-card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <Donut segments={[{ value: 52, color: 'var(--chart-1)' }, { value: 26, color: 'var(--chart-3)' }, { value: 14, color: 'var(--chart-2)' }, { value: 8, color: 'var(--chart-4)' }]} />
              <Col gap={7}>
                <div className="sc-chart-title" style={{ marginBottom: 2 }}>VRAM usage</div>
                <Legend items={[{ label: 'llama 52%', color: 'var(--chart-1)' }, { label: 'qwen 26%', color: 'var(--chart-3)' }, { label: 'embed 14%', color: 'var(--chart-2)' }, { label: 'free 8%', color: 'var(--chart-4)' }]} />
              </Col>
            </div>
          </div>
        </Section>
      </div>

      <Modal open={modal} title="Serve a model" onClose={() => setModal(false)}
        footer={<><Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button><Button variant="primary" onClick={() => { setModal(false); pushToast('success', <span><b>Model served.</b> :8080</span>); }}>Serve</Button></>}>
        putty will scan your VRAM, pick a fit, and start a local server. You can stop it anytime from the Cookbook.
      </Modal>
      <Modal open={confirm} title="Delete llama-3.1-8b?" onClose={() => setConfirm(false)}
        footer={<><Button variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button><Button variant="danger" icon={<PAIcons.trash />} onClick={() => { setConfirm(false); pushToast('error', <span><b>Deleted.</b> 4.7 GB freed</span>); }}>Delete</Button></>}>
        This removes the weights from disk. This can't be undone.
      </Modal>

      <div className="sc-toasts">
        {toasts.map((t) => <Toast key={t.id} variant={t.variant as any} onClose={() => setToasts((x) => x.filter((y) => y.id !== t.id))}>{t.msg}</Toast>)}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
