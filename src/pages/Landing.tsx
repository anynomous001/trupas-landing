import { useState, useEffect, useRef } from 'react';
import { Dashboard } from '../components/landing/Dashboard';
import type { DashView } from '../components/landing/Dashboard';

// ─── Data ───────────────────────────────────────────────────────────────────

const HERO_STATS = [
  { value: '2.1s', label: 'median door time' },
  { value: '99.1%', label: 'ID + face match rate' },
  { value: '<1s', label: 'tamper alert latency' },
];

const FEATURES: { view: DashView; title: string; body: string }[] = [
  { view: 'overview', title: 'One place for everything.', body: 'Kiosks, terminals, locations and team members live in a single console. No tab-jumping, no duplicate dashboards.' },
  { view: 'ids',      title: 'Reads any ID, on any door.', body: '200+ document types, glare-tolerant, with manual override for the edge cases. Match rate stays above 99%.' },
  { view: 'sync',     title: 'Real-time sync, every site.', body: 'Every device heartbeats every 5 seconds. See exactly what is online, where, and how it has been performing.' },
  { view: 'audit',    title: 'An audit trail you can hand to a regulator.', body: 'Every read is logged with photo, timestamp, location and operator. Exportable. Tamper-evident. Quiet by default.' },
];

const STEPS = [
  {
    title: 'Plug it in.',
    body: 'Mount, power, network. Out of the box to your first scan in under an hour.',
    image: 'https://images.unsplash.com/photo-1759038086832-795644825e3a?auto=format&fit=crop&fm=jpg&q=80&w=2400',
    imageAlt: 'Modern reception desk ready for guest check-in',
    tag: '01 · Setup',
    note: 'Desk-ready hardware with guided onboarding.',
  },
  {
    title: 'They scan.',
    body: 'Customer or visitor places ID in the frame. Kiosk reads, captures a photo, and starts verification.',
    image: 'https://images.unsplash.com/photo-1576243165717-ce0a37f0ac8b?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    imageAlt: 'Passport presented for ID verification',
    tag: '02 · Scan',
    note: 'Reads passports and IDs with minimal operator help.',
  },
  {
    title: 'You verify.',
    body: 'Match against ID + face, check age and watchlist, surface any flags. Operator can override in the moment.',
    image: 'https://images.unsplash.com/photo-1753108140127-afc3e215d75b?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    imageAlt: 'Security camera device for monitoring and verification alerts',
    tag: '03 · Verify',
    note: 'Flags surface instantly before anyone walks through.',
  },
  {
    title: 'Everyone moves.',
    body: 'Logged, synced, audit-ready. Median time at the door: 2.1 seconds.',
    image: 'https://images.unsplash.com/photo-1758448721205-8465cebc26af?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=2200',
    imageAlt: 'Modern corporate reception area showing smooth visitor flow',
    tag: '04 · Move',
    note: 'Guests move forward while the audit trail closes behind them.',
  },
];

const SCENES = [
  {
    cls: '',
    tag: 'Hospitality',
    label: 'Hotel lobby · 3am check-in',
    title: "A reception desk that doesn't blink at 3am.",
    body: 'Front-of-house teams handle late arrivals without paging a manager. ID, age, and reservation match in one tap.',
    stat: '92% self-serve check-ins',
    detail: 'Late arrivals clear in under three taps.',
    image: 'https://images.unsplash.com/photo-1759038085950-1234ca8f5fed?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=2200',
  },
  {
    cls: 's2',
    tag: 'Retail · Dispensary',
    label: 'Compliance window',
    title: 'Compliance, without the side-eye.',
    body: 'Age-restricted retail moves the awkward part to the kiosk. Customers self-verify; staff get a clean log for the regulator.',
    stat: 'Audit trail ready in real time',
    detail: 'Staff only step in on flagged reads.',
    image: 'https://images.unsplash.com/photo-1691187861257-a56c4aa2d7fb?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=2200',
  },
  {
    cls: 's3',
    tag: 'Corporate',
    label: 'Office front desk',
    title: 'Visitors who feel expected.',
    body: 'Pre-registered visitors badge in by ID. Hosts get a heads-up. Security gets the audit. No clipboards.',
    stat: 'Lobby handoff synced to hosts',
    detail: 'Expected guests feel expected from the first minute.',
    image: 'https://images.unsplash.com/photo-1758448721205-8465cebc26af?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=2200',
  },
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

function BrandLockup() {
  return (
    <span className="brand-lockup">
      <span className="brand-emblem" aria-hidden="true">
        <span className="brand-emblem-core" />
        <span className="brand-emblem-chip" />
        <span className="brand-emblem-scan" />
      </span>
      <span>Trupas</span>
    </span>
  );
}

function Nav() {
  return (
    <nav className="nav wrap">
      <a className="brand" href="/">
        <BrandLockup />
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
    <section className="hero wrap">
      <div className="hero-image" aria-hidden="true" />
      <div className="hero-copy reveal is-visible">
        <p className="hero-kicker reveal-item delay-1">Merchant identity infrastructure</p>
        <h1 className="reveal-item delay-2">
          Built for<br />
          the <span className="accent-word">front</span> desk.
        </h1>
        <p className="lede reveal-item delay-3">
          A purpose-built kiosk and a dashboard that keeps every door honest. One place for kiosks,
          terminals, locations, and team members — calm enough to forget, sharp enough to catch what matters.
        </p>
        <div className="ctas reveal-item delay-4">
          <a className="btn primary lg" href="/login">Get started <span className="ar">→</span></a>
          <a className="btn lg" href="#how">How it works</a>
        </div>
        <div className="trust reveal-item delay-5">
          <span className="pill">✓ no credit card</span>
          <span className="pill">✓ SOC 2 Type II</span>
          <span className="pill">✓ 24/7 monitoring</span>
        </div>
        <div className="hero-proof-grid reveal-item delay-6">
          {HERO_STATS.map((item) => (
            <div key={item.label} className="hero-proof-card">
              <div className="value">{item.value}</div>
              <div className="label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeviceTour() {
  const cards = [
    {
      tag: 'ID reader',
      image: 'https://images.unsplash.com/photo-1576243165717-ce0a37f0ac8b?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
      imageAlt: 'Person holding a passport for ID verification',
      imageClass: 'passport',
      title: 'Reads any ID.',
      body: 'Driver licenses, passports, residency cards — front and back, glare-tolerant, NFC where the chip allows.',
      meta: ['200+ document types', '99.1% match rate'],
      points: ['Dual-light optics reduce glare', 'Auto-detects front/back orientation'],
    },
    {
      tag: 'Offline mode',
      image: 'https://images.unsplash.com/photo-1695668548342-c0c1ad479aee?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
      imageAlt: 'Server rack infrastructure representing offline sync and local buffering',
      imageClass: 'server',
      title: 'Works offline.',
      body: 'Local cache + rolling re-sync. The lobby keeps working when the WAN does not. Reconciles in seconds when it returns.',
      meta: ['72h offline buffer', 'rolling re-sync'],
      points: ['Sync queue survives hard power cycles', 'Operator only sees what needs attention'],
    },
    {
      tag: 'Tamper guard',
      image: 'https://images.unsplash.com/photo-1753108140127-afc3e215d75b?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
      imageAlt: 'Security camera device representing tamper alerts and monitoring',
      imageClass: 'camera',
      title: 'Locks down on tamper.',
      body: 'Anchored to the desk. Accelerometer + cover sensor. If it moves or opens, it shuts itself and pings you in under a second.',
      meta: ['<1s alert', 'cover + base sensor'],
      points: ['Sealed service panel with audit logging', 'Remote alert ships with photo + device state'],
    },
  ];

  return (
    <section id="device" className="wrap reveal">
      <div className="sec-h reveal-item">
        <span className="sec-num">02</span>
        <h2 className="sec-title">A terminal that does the boring parts well.</h2>
        <span className="sec-sub">device tour</span>
      </div>
      <div className="tour-grid">
        {cards.map((c) => (
          <div className={`tour-card reveal-item delay-${(cards.indexOf(c) % 3) + 1}`} key={c.tag}>
            <div className="shot">
              <img className={`shot-photo ${c.imageClass}`} src={c.image} alt={c.imageAlt} loading="lazy" />
              <span className="tag">{c.tag}</span>
            </div>
            <h3>{c.title}</h3>
            <p>{c.body}</p>
            <div className="tour-points">
              {c.points.map((point) => (
                <span key={point}>{point}</span>
              ))}
            </div>
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
    <section id="features" className="wrap reveal">
      <div className="sec-h reveal-item">
        <span className="sec-num">03</span>
        <h2 className="sec-title">The dashboard that knows what's happening.</h2>
        <span className="sec-sub">scroll · 4 features</span>
      </div>
      <div className="sticky-row">
        <div className="sticky-left reveal-item delay-1">
          <Dashboard view={view} />
        </div>
        <div className="feature-list">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              ref={(el) => { featureRefs.current[i] = el; }}
              className={`feature-row reveal-item delay-${(i % 3) + 1}${i === activeIdx ? ' active' : ''}`}
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
  const currentStep = STEPS[stepIdx] ?? STEPS[0];

  return (
    <section id="how" className="wrap reveal">
      <div className="sec-h reveal-item">
        <span className="sec-num">04</span>
        <h2 className="sec-title">Unbox to verifying — in an afternoon.</h2>
        <span className="sec-sub">4 steps</span>
      </div>
      <div className="how-row">
        <div className="how-sticky reveal-item delay-1">
          <div className="how-media">
            <img src={currentStep.image} alt={currentStep.imageAlt} className="how-media-img" loading="lazy" />
            <div className="how-media-overlay" />
            <div className="how-media-copy">
              <div className="how-media-tag">{currentStep.tag}</div>
              <strong>{currentStep.title}</strong>
              <p>{currentStep.note}</p>
            </div>
          </div>
        </div>
        <div className="how-list">
          {STEPS.map((st, i) => (
            <div
              key={i}
              ref={(el) => { stepRefs.current[i] = el; }}
              className={`how-step reveal-item delay-${(i % 3) + 1}${i === stepIdx ? ' active' : ''}`}
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
    <section id="use" className="wrap reveal">
      <div className="sec-h reveal-item">
        <span className="sec-num">05</span>
        <h2 className="sec-title">Wherever the door matters.</h2>
        <span className="sec-sub">3 industries</span>
      </div>
      <div className="carousel reveal-item delay-1">
        <div className="carousel-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
          {SCENES.map((s, i) => (
            <div
              key={i}
              className={`carousel-slide${s.cls ? ' ' + s.cls : ''}`}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(6, 8, 12, 0.34), rgba(6, 8, 12, 0.84)), linear-gradient(90deg, rgba(6, 8, 12, 0.84), rgba(6, 8, 12, 0.36) 42%, rgba(6, 8, 12, 0.84)), url("${s.image}")`,
              }}
            >
              <div className="scene-ambient">
                <div className="scene-grid" />
                <div className="scene-beam" />
                <div className="scene-stack">
                  <span>{s.tag}</span>
                  <span>{s.stat}</span>
                </div>
              </div>
              <span className="scene-tag">{s.label}</span>
              <div className="carousel-card">
                <div className="label">{s.tag}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <div className="scene-meta">
                  <span>{s.stat}</span>
                  <span>{s.detail}</span>
                </div>
                <a className="read" href="#">Read story <span className="ar">→</span></a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="carousel-controls reveal-item delay-2">
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
    <section id="faq" className="wrap reveal">
      <div className="sec-h reveal-item">
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
                  className={`faq-row reveal-item delay-${(idx % 3) + 1}${open ? ' open' : ''}`}
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
    <section id="cta" className="wrap reveal">
      <div className="cta-card reveal-item">
        <div>
          <span className="eyebrow inverse">
            <span className="dot" />
            Setup included · 90-day pilot safety net
          </span>
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
    <footer className="footer wrap reveal">
      <div className="footer-grid reveal-item">
        <div>
          <div className="footer-brand">
            <BrandLockup />
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
      <div className="footer-bottom reveal-item delay-2">
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

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const itemNodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal-item'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -10% 0px' }
    );

    nodes.forEach((node) => {
      if (!node.classList.contains('is-visible')) observer.observe(node);
    });

    itemNodes.forEach((node) => {
      const parentReveal = node.closest('.reveal');
      if (!parentReveal) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <section className="hero-shell">
        <Nav />
        <Hero />
      </section>
      <div className="squig wrap reveal"><span className="reveal-item">· · · · · · · · · ·</span></div>
      <DeviceTour />
      <div className="squig wrap reveal"><span className="reveal-item">· · · · · · · · · ·</span></div>
      <StickyFeatures
        activeIdx={activeFeature}
        setActive={setActiveFeature}
        featureRefs={featureRefs}
      />
      <div className="squig wrap reveal"><span className="reveal-item">· · · · · · · · · ·</span></div>
      <HowItWorks
        stepIdx={stepIdx}
        setStep={setStepIdx}
        stepRefs={stepRefs}
      />
      <div className="squig wrap reveal"><span className="reveal-item">· · · · · · · · · ·</span></div>
      <UseCases slide={slide} setSlide={setSlide} />
      <div className="squig wrap reveal"><span className="reveal-item">· · · · · · · · · ·</span></div>
      <FaqSection openIdx={openFaq} setOpen={setOpenFaq} />
      <CtaCard />
      <SiteFooter />
    </main>
  );
};
