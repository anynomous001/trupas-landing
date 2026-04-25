import { useState, useEffect, useRef } from 'react';
import { Kiosk } from '../components/landing/Kiosk';
import { Dashboard } from '../components/landing/Dashboard';
import type { DashView } from '../components/landing/Dashboard';

// ─── Data ───────────────────────────────────────────────────────────────────

const FEATURES: { view: DashView; title: string; body: string }[] = [
  { view: 'overview', title: 'One place for everything.', body: 'Kiosks, terminals, locations and team members live in a single console. No tab-jumping, no duplicate dashboards.' },
  { view: 'ids',      title: 'Reads any ID, on any door.', body: '200+ document types, glare-tolerant, with manual override for the edge cases. Match rate stays above 99%.' },
  { view: 'sync',     title: 'Real-time sync, every site.', body: 'Every device heartbeats every 5 seconds. See exactly what is online, where, and how it has been performing.' },
  { view: 'audit',    title: 'An audit trail you can hand to a regulator.', body: 'Every read is logged with photo, timestamp, location and operator. Exportable. Tamper-evident. Quiet by default.' },
  { view: 'alerts',   title: 'Alerts that are worth the ping.', body: 'Tamper, offline, repeat-flag, watchlist match. No noisy thresholds — only events you would have wanted woken for.' },
  { view: 'team',     title: 'Roles and handoffs, no spreadsheet.', body: 'Permissions per location, shift handoffs, and a clear record of who was on the door when something happened.' },
];

const STEPS = [
  { state: 'idle'    as const, title: 'Plug it in.',     body: 'Mount, power, network. Out of the box to your first scan in under an hour.' },
  { state: 'scan'    as const, title: 'They scan.',      body: 'Customer or visitor places ID in the frame. Kiosk reads, captures a photo, and starts verification.' },
  { state: 'verify'  as const, title: 'You verify.',     body: 'Match against ID + face, check age and watchlist, surface any flags. Operator can override in the moment.' },
  { state: 'success' as const, title: 'Everyone moves.', body: 'Logged, synced, audit-ready. Median time at the door: 2.1 seconds.' },
];

const SCENES = [
  { cls: '',   tag: 'Hospitality', label: 'Hotel lobby · 3am check-in', title: "A reception desk that doesn't blink at 3am.", body: 'Front-of-house teams handle late arrivals without paging a manager. ID, age, and reservation match in one tap.' },
  { cls: 's2', tag: 'Retail · Dispensary', label: 'Compliance window', title: 'Compliance, without the side-eye.', body: 'Age-restricted retail moves the awkward part to the kiosk. Customers self-verify; staff get a clean log for the regulator.' },
  { cls: 's3', tag: 'Corporate', label: 'Office front desk', title: 'Visitors who feel expected.', body: 'Pre-registered visitors badge in by ID. Hosts get a heads-up. Security gets the audit. No clipboards.' },
];

const FAQ_ITEMS = [
  { q: "What's in the box?", a: "Trupas T1 kiosk, anchored desk mount, power brick, network cable, and the setup card. SIM tray for cellular failover is included on the Plus tier." },
  { q: "Do I need a network at the door?", a: "Wired ethernet is preferred. Wi-Fi works. Cellular failover keeps the door working through outages, and the device caches up to 72 hours of activity offline." },
  { q: "How long does setup take?", a: "Most customers go from unboxed to verifying in under an afternoon. Mount, plug, pair to your account, set roles. We'll stay on the call." },
  { q: "Which IDs does it accept?", a: "200+ document types — US/EU/CA driver licenses and passports out of the box. The list updates monthly. Manual override is always available." },
  { q: "How is the data stored?", a: "Encrypted at rest and in transit. SOC 2 Type II. Logs and photos are retained per your policy — defaults follow the strictest of your jurisdictions." },
  { q: "What does it cost?", a: "Hardware is a one-time cost; software is per-location, per-month. No per-scan fees. Talk to us about volume — we're not coy about pricing." },
];

// ─── Section Components ──────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="nav wrap">
      <a className="brand" href="/">
        <span className="mark">T</span>
        Trupas
      </a>
      <div className="links">
        <a href="#device">Device</a>
        <a href="#features">Software</a>
        <a href="#how">How it works</a>
        <a href="#use">Industries</a>
      </div>
      <div className="right">
        <a className="signin" href="/login">Sign in</a>
        <a className="btn primary" href="/login">Get started <span className="ar">→</span></a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero wrap" style={{ borderBottom: 'none', paddingBottom: '48px' }}>
      <div>
        <span className="eyebrow">
          <span className="dot" />
          Hardware + software · v1 shipping now
        </span>
        <h1>
          Built for<br />
          the <span className="accent-word">front</span> desk.
        </h1>
        <p className="lede">
          A purpose-built kiosk and a dashboard that keeps every door honest. One place for kiosks,
          terminals, locations, and team members — calm enough to forget, sharp enough to catch what matters.
        </p>
        <div className="ctas">
          <a className="btn primary lg" href="/login">Get started <span className="ar">→</span></a>
          <a className="btn lg" href="#how">How it works</a>
        </div>
        <div className="trust">
          <span className="pill">✓ no credit card</span>
          <span className="pill">✓ SOC 2 Type II</span>
          <span className="pill">✓ 24/7 monitoring</span>
        </div>
      </div>
      <div className="hero-stage">
        <Kiosk state="scan" callouts={true} />
      </div>
    </section>
  );
}

function DeviceTour() {
  const cards = [
    {
      tag: 'ID reader',
      title: 'Reads any ID.',
      body: 'Driver licenses, passports, residency cards — front and back, glare-tolerant, NFC where the chip allows.',
      meta: ['200+ document types', '99.1% match rate'],
    },
    {
      tag: 'Offline mode',
      title: 'Works offline.',
      body: 'Local cache + rolling re-sync. The lobby keeps working when the WAN does not. Reconciles in seconds when it returns.',
      meta: ['72h offline buffer', 'rolling re-sync'],
    },
    {
      tag: 'Tamper guard',
      title: 'Locks down on tamper.',
      body: 'Anchored to the desk. Accelerometer + cover sensor. If it moves or opens, it shuts itself and pings you in under a second.',
      meta: ['<1s alert', 'cover + base sensor'],
    },
  ];

  return (
    <section id="device" className="wrap">
      <div className="sec-h">
        <span className="sec-num">02</span>
        <h2 className="sec-title">A terminal that does the boring parts well.</h2>
        <span className="sec-sub">device tour</span>
      </div>
      <div className="tour-grid">
        {cards.map((c) => (
          <div className="tour-card" key={c.tag}>
            <div className="shot"><span className="tag">{c.tag}</span></div>
            <h3>{c.title}</h3>
            <p>{c.body}</p>
            <div className="meta"><span>{c.meta[0]}</span><span>{c.meta[1]}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StickyFeatures({
  activeIdx,
  setActive,
  featureRefs,
}: {
  activeIdx: number;
  setActive: (i: number) => void;
  featureRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}) {
  const view = FEATURES[activeIdx]?.view ?? 'overview';

  return (
    <section id="features" className="wrap">
      <div className="sec-h">
        <span className="sec-num">03</span>
        <h2 className="sec-title">The dashboard that knows what's happening.</h2>
        <span className="sec-sub">scroll · 6 features</span>
      </div>
      <div className="sticky-row">
        <div className="sticky-left">
          <Dashboard view={view} />
        </div>
        <div className="feature-list">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              ref={(el) => { featureRefs.current[i] = el; }}
              className={`feature-row${i === activeIdx ? ' active' : ''}`}
              onClick={() => setActive(i)}
            >
              <div className="num">0{i + 1}</div>
              <div>
                <h4>{f.title}</h4>
                <p>{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks({
  stepIdx,
  setStep,
  stepRefs,
}: {
  stepIdx: number;
  setStep: (i: number) => void;
  stepRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}) {
  const currentState = STEPS[stepIdx]?.state ?? 'idle';

  return (
    <section id="how" className="wrap">
      <div className="sec-h">
        <span className="sec-num">04</span>
        <h2 className="sec-title">Unbox to verifying — in an afternoon.</h2>
        <span className="sec-sub">4 steps</span>
      </div>
      <div className="how-row">
        <div className="how-sticky">
          <Kiosk state={currentState} callouts={false} label="Trupas T1" />
        </div>
        <div className="how-list">
          {STEPS.map((st, i) => (
            <div
              key={i}
              ref={(el) => { stepRefs.current[i] = el; }}
              className={`how-step${i === stepIdx ? ' active' : ''}`}
              onClick={() => setStep(i)}
            >
              <div className="num-circle">{i + 1}</div>
              <div>
                <h4>{st.title}</h4>
                <p>{st.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCases({ slide, setSlide }: { slide: number; setSlide: (n: number) => void }) {
  return (
    <section id="use" className="wrap">
      <div className="sec-h">
        <span className="sec-num">05</span>
        <h2 className="sec-title">Wherever the door matters.</h2>
        <span className="sec-sub">3 industries</span>
      </div>
      <div className="carousel">
        <div className="carousel-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
          {SCENES.map((s, i) => (
            <div key={i} className={`carousel-slide${s.cls ? ' ' + s.cls : ''}`}>
              <span className="scene-tag">{s.label}</span>
              <div className="carousel-card">
                <div className="label">{s.tag}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <a className="read" href="#">Read story <span className="ar">→</span></a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="carousel-controls">
        <div className="c-dots">
          {SCENES.map((_, i) => (
            <button
              key={i}
              className={`c-dot${i === slide ? ' active' : ''}`}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <div className="chevs">
          <button className="chev" onClick={() => setSlide((slide - 1 + SCENES.length) % SCENES.length)}>‹</button>
          <button className="chev" onClick={() => setSlide((slide + 1) % SCENES.length)}>›</button>
        </div>
      </div>
    </section>
  );
}

function FaqSection({ openIdx, setOpen }: { openIdx: number; setOpen: (i: number) => void }) {
  const cols = [FAQ_ITEMS.slice(0, 3), FAQ_ITEMS.slice(3)];

  return (
    <section className="wrap">
      <div className="sec-h">
        <span className="sec-num">06</span>
        <h2 className="sec-title">The questions hardware buyers actually ask.</h2>
        <span className="sec-sub">6 questions</span>
      </div>
      <div className="faq-grid">
        {cols.map((col, ci) => (
          <div key={ci}>
            {col.map((row, ri) => {
              const idx = ci * 3 + ri;
              const open = openIdx === idx;
              return (
                <div
                  key={idx}
                  className={`faq-row${open ? ' open' : ''}`}
                  onClick={() => setOpen(open ? -1 : idx)}
                >
                  <div className="top">
                    <div className="q">{row.q}</div>
                    <div className="toggle">{open ? '−' : '+'}</div>
                  </div>
                  <div className="a">{row.a}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaCard() {
  return (
    <section id="cta" className="wrap">
      <div className="cta-card">
        <div>
          <h2>
            Order a terminal.<br />
            Verify by <span className="ul">next week</span>.
          </h2>
          <p>
            Most orders ship within 48 hours. Setup is included. Cancel any time in the first
            90 days — keep the kiosk while we sort it.
          </p>
          <div className="ctas">
            <a className="btn primary lg" href="/login">Get started <span className="ar">→</span></a>
            <a className="btn lg" href="#">Talk to sales</a>
          </div>
        </div>
        <div className="cta-side">
          <div className="cta-receipt">
            <div className="r-head">
              <b>Trupas T1</b>
              <span>QTY 1</span>
            </div>
            <div className="r-row"><span>Kiosk · 10.1"</span><b>$1,290</b></div>
            <div className="r-row"><span>Desk mount</span><b>incl.</b></div>
            <div className="r-row"><span>Setup + onboarding</span><b>incl.</b></div>
            <div className="r-row"><span>Software · per location</span><b>$89/mo</b></div>
            <div className="r-total"><span>Ships in</span><b>48 hrs</b></div>
            <div className="r-thank">thank you ✎</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="footer wrap">
      <div className="footer-grid">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-hand)', fontSize: '30px', fontWeight: 700 }}>
            <span style={{ width: '30px', height: '30px', border: '2px solid var(--ink)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ink)', color: 'var(--paper)', fontFamily: 'var(--font-hand)', fontSize: '22px', fontWeight: 700, lineHeight: 1, flexShrink: 0 }}>T</span>
            Trupas
          </div>
          <p className="blurb">Hardware on the floor. Software that knows what's happening on it. Built quietly in Oakland, shipped everywhere.</p>
        </div>
        <div>
          <h5>Product</h5>
          <ul>
            <li><a href="#">Kiosk T1</a></li>
            <li><a href="#">Console</a></li>
            <li><a href="#">API</a></li>
            <li><a href="#">Pricing</a></li>
          </ul>
        </div>
        <div>
          <h5>Industries</h5>
          <ul>
            <li><a href="#">Hospitality</a></li>
            <li><a href="#">Retail</a></li>
            <li><a href="#">Corporate</a></li>
            <li><a href="#">Healthcare</a></li>
          </ul>
        </div>
        <div>
          <h5>Company</h5>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Security</a></li>
            <li><a href="#">Customers</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Trupas, Inc. · Wherever the door matters.</span>
        <span>SOC 2 Type II · GDPR · CCPA</span>
      </div>
    </footer>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export const Landing = (): React.JSX.Element => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [slide, setSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState(-1);

  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight;

      let bestF = 0, bestFD = Infinity;
      featureRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - vh * 0.45);
        if (dist < bestFD) { bestFD = dist; bestF = i; }
      });
      setActiveFeature(bestF);

      let bestS = 0, bestSD = Infinity;
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - vh * 0.45);
        if (dist < bestSD) { bestSD = dist; bestS = i; }
      });
      setStepIdx(bestS);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main>
      <Nav />
      <Hero />
      <div className="squig wrap">· · · · · · · · · ·</div>
      <DeviceTour />
      <div className="squig wrap">· · · · · · · · · ·</div>
      <StickyFeatures
        activeIdx={activeFeature}
        setActive={setActiveFeature}
        featureRefs={featureRefs}
      />
      <div className="squig wrap">· · · · · · · · · ·</div>
      <HowItWorks
        stepIdx={stepIdx}
        setStep={setStepIdx}
        stepRefs={stepRefs}
      />
      <div className="squig wrap">· · · · · · · · · ·</div>
      <UseCases slide={slide} setSlide={setSlide} />
      <div className="squig wrap">· · · · · · · · · ·</div>
      <FaqSection openIdx={openFaq} setOpen={setOpenFaq} />
      <CtaCard />
      <SiteFooter />
    </main>
  );
};
