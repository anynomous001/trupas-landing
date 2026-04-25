export type DashView = 'overview' | 'ids' | 'sync' | 'audit' | 'alerts' | 'team';

interface DashViewData {
  nav: string;
  h: string;
  filter: string;
  stats: { lab: string; val: string; d: string }[];
  chartTitle: string;
  chartPoints: number[];
}

const DASH_VIEWS: Record<DashView, DashViewData> = {
  overview: {
    nav: 'Overview',
    h: 'Today at the door',
    filter: 'Last 24h',
    stats: [
      { lab: 'Verified', val: '1,284', d: '+12%' },
      { lab: 'Flags', val: '7', d: '-2' },
      { lab: 'Avg time', val: '2.1s', d: '-0.3s' },
    ],
    chartTitle: 'Throughput · hourly',
    chartPoints: [.2, .35, .5, .62, .55, .7, .85, .78, .9, .72, .6, .5],
  },
  ids: {
    nav: 'IDs',
    h: 'Reads, by source',
    filter: 'This week',
    stats: [
      { lab: 'Scans', val: '8.4K', d: '+18%' },
      { lab: 'Match rate', val: '99.1%', d: '+0.4' },
      { lab: 'Manual', val: '3', d: '-5' },
    ],
    chartTitle: 'Reads per day',
    chartPoints: [.4, .55, .5, .65, .7, .8, .78],
  },
  sync: {
    nav: 'Sync',
    h: 'Devices online',
    filter: 'Now',
    stats: [
      { lab: 'Online', val: '42', d: 'all up' },
      { lab: 'Offline', val: '0', d: '—' },
      { lab: 'Latency', val: '180ms', d: '-12ms' },
    ],
    chartTitle: 'Heartbeats',
    chartPoints: [.6, .62, .58, .65, .64, .66, .62, .7, .68, .7, .72, .7],
  },
  audit: {
    nav: 'Audit',
    h: 'Events',
    filter: 'Today',
    stats: [
      { lab: 'Logged', val: '1,291', d: '+12%' },
      { lab: 'Reviewed', val: '1,284', d: '99.5%' },
      { lab: 'Disputed', val: '0', d: '—' },
    ],
    chartTitle: 'Event volume',
    chartPoints: [.3, .4, .45, .5, .55, .6, .7, .66, .7, .74, .7, .72],
  },
  alerts: {
    nav: 'Alerts',
    h: 'Recent activity',
    filter: 'Live',
    stats: [
      { lab: 'Open', val: '2', d: '1 new' },
      { lab: 'Resolved', val: '14', d: 'today' },
      { lab: 'Median', val: '4m', d: 'response' },
    ],
    chartTitle: 'Alerts · 7d',
    chartPoints: [.2, .3, .5, .4, .6, .5, .45],
  },
  team: {
    nav: 'Team',
    h: 'Coverage',
    filter: 'This shift',
    stats: [
      { lab: 'On duty', val: '8', d: 'full' },
      { lab: 'Locations', val: '3', d: 'covered' },
      { lab: 'Handoffs', val: '2', d: 'today' },
    ],
    chartTitle: 'Active hours',
    chartPoints: [.3, .5, .7, .8, .9, .85, .7, .5],
  },
};

function Sparkline({ points }: { points: number[] }) {
  const w = 100, h = 100;
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - p * h * 0.85 - 5;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <pattern id="dgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,.05)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#dgrid)" />
      <path d={path} fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => {
        const x = (i / (points.length - 1)) * w;
        const y = h - p * h * 0.85 - 5;
        return <circle key={i} cx={x} cy={y} r="1.2" fill="var(--ink)" />;
      })}
    </svg>
  );
}

export function Dashboard({ view = 'overview' }: { view?: DashView }) {
  const v = DASH_VIEWS[view];
  const navs = Object.keys(DASH_VIEWS) as DashView[];

  return (
    <div className="dashboard">
      <div className="dash-chrome">
        <div className="d-dots"><span /><span /><span /></div>
        <div className="d-title">Trupas · Console</div>
        <div className="d-grow" />
        <div className="d-url">trupas.app/{view}</div>
      </div>
      <div className="dash-body">
        <aside className="dash-side">
          <div className="d-grp">Live</div>
          {navs.slice(0, 3).map(k => (
            <a key={k} className={k === view ? 'on' : ''}>
              <span className="d-dot" />{DASH_VIEWS[k].nav}
            </a>
          ))}
          <div className="d-grp">Records</div>
          {navs.slice(3).map(k => (
            <a key={k} className={k === view ? 'on' : ''}>
              <span className="d-dot" />{DASH_VIEWS[k].nav}
            </a>
          ))}
        </aside>
        <div className="dash-main">
          <div className="dash-view" key={view}>
            <div className="dash-h">
              <h4>{v.h}</h4>
              <div className="d-filter">{v.filter}</div>
            </div>
            <div className="d-stats">
              {v.stats.map((s, i) => (
                <div className="d-stat" key={i}>
                  <div className="d-lab">{s.lab}</div>
                  <div className="d-val">{s.val}</div>
                  <div className="d-delta">{s.d}</div>
                </div>
              ))}
            </div>
            <div className="d-chart">
              <div className="d-chart-title">
                <span>{v.chartTitle}</span>
                <span>↗</span>
              </div>
              <Sparkline points={v.chartPoints} />
            </div>
            <div className="d-list">
              <div className="d-lh"><span>EVENT</span><span>LOC</span><span>STATUS</span></div>
              <div className="d-li">
                <span className="d-who">A. Mendez · scan</span>
                <span>Lobby</span>
                <span className="d-ok">✓ ok</span>
              </div>
              <div className="d-li">
                <span className="d-who">J. Park · scan</span>
                <span>Door 2</span>
                <span className="d-ok">✓ ok</span>
              </div>
              <div className="d-li">
                <span className="d-who">Tamper sensor</span>
                <span>Door 3</span>
                <span className="d-warn">! check</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
