type KioskState = 'idle' | 'scan' | 'verify' | 'success';

interface KioskProps {
  state?: KioskState;
  callouts?: boolean;
  label?: string;
}

function KioskScreen({ state }: { state: KioskState }) {
  if (state === 'idle') {
    return (
      <div className="kscreen">
        <div className="ks-title">Welcome.</div>
        <div className="ks-meta">tap to begin</div>
        <div className="ks-id" style={{ justifyContent: 'center' }}>
          <div style={{ fontFamily: 'var(--font-hand)', fontSize: '34px', fontWeight: 700, color: 'var(--ink)' }}>
            tap →
          </div>
        </div>
        <div className="ks-meta" style={{ textAlign: 'center' }}>Trupas T1 · Lobby</div>
      </div>
    );
  }

  if (state === 'scan') {
    return (
      <div className="kscreen">
        <div className="ks-title">Scan ID</div>
        <div className="ks-meta">align inside the frame</div>
        <div className="ks-id">
          <div className="ks-scan" />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-soft)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            DRIVER LICENSE<br />REGION · CA
          </div>
        </div>
        <div className="ks-meta" style={{ textAlign: 'center' }}>holding still…</div>
      </div>
    );
  }

  if (state === 'verify') {
    return (
      <div className="kscreen">
        <div className="ks-title">Verifying</div>
        <div className="ks-meta">match · age · watchlist</div>
        <div className="ks-card" style={{ display: 'flex', gap: '8px', padding: '8px 10px' }}>
          <div className="ks-photo" />
          <div className="ks-rows">
            <div className="r"><span>NAME</span><b>A. Mendez</b></div>
            <div className="r"><span>AGE</span><b>34</b></div>
            <div className="r"><span>EXP</span><b>2031</b></div>
            <div className="r"><span>MATCH</span><b style={{ color: 'var(--accent)' }}>97%</b></div>
          </div>
        </div>
        <div
          className="ks-status-ok"
          style={{ borderStyle: 'dashed', background: 'var(--paper)', color: 'var(--ink-soft)', borderColor: 'var(--ink-faint)' }}
        >
          <div className="ks-check" style={{ borderColor: 'var(--ink-soft)' }}>•</div>
          checking…
        </div>
      </div>
    );
  }

  return (
    <div className="kscreen">
      <div className="ks-title">All clear.</div>
      <div className="ks-meta">welcome back, A.</div>
      <div className="ks-bigcheck">✓</div>
      <div className="ks-status-ok">
        <div className="ks-check">✓</div>
        Verified · 2.1s
      </div>
      <div className="ks-meta" style={{ textAlign: 'center' }}>logged · synced</div>
    </div>
  );
}

export function Kiosk({ state = 'scan', callouts = true, label = 'Trupas T1' }: KioskProps) {
  return (
    <div className="kiosk-wrap">
      <div className="kiosk">
        <span className="device-label">{label} · 10.1"</span>
        <div className="k-screen">
          <div className="k-cam" />
          <div className="k-screen-inner">
            <KioskScreen state={state} />
          </div>
        </div>
        <div className="k-neck" />
        <div className="k-base" />
      </div>
      {callouts && (
        <>
          <span className="callout c1">↘ ID scanner</span>
          <span className="callout c2">← real-time sync</span>
          <span className="callout c3">↗ tamper-proof</span>
        </>
      )}
    </div>
  );
}
