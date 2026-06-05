// Login.tsx — first-run / sign-in screen. Mirrors the self-hosted "generated admin password" flow.
declare const React: typeof import('react');
declare const Boat: any;

function Login({ onLogin }: { onLogin: (name: string) => void }) {
  const [user, setUser] = React.useState('admin');
  const [pw, setPw] = React.useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(user.trim() || 'admin');
  };

  return (
    <div className="login">
      <form className="login-card" onSubmit={submit}>
        <div className="login-logo">
          <Boat size={44} className="boat" />
          <span className="wm">putty-ai</span>
        </div>
        <div className="slogan">Soft. Local. Yours.</div>
        <div className="field">
          <label htmlFor="lu">Username</label>
          <input id="lu" value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" />
        </div>
        <div className="field">
          <label htmlFor="lp">Password</label>
          <input id="lp" type="password" value={pw} placeholder="••••••••••" onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
        </div>
        <button className="login-btn" type="submit">Log in</button>
        <div className="login-hint">
          First boot? putty-ai printed a temporary password in your terminal —<br />
          look for <code>Generated admin password</code>, then change it in Settings.
        </div>
      </form>
    </div>
  );
}

(window as any).Login = Login;
