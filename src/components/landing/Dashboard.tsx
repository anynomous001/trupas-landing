export type DashView = 'overview' | 'ids' | 'sync' | 'audit';

interface DashViewData {
  nav: string;
  h: string;
  filter: string;
  stats: { lab: string; val: string; d: string }[];
  mediaLabel: string;
  mediaCaption: string;
  image: string;
  imageAlt: string;
  imageClass?: string;
}

const DASH_VIEWS: Record<DashView, DashViewData> = {
  overview: {
    nav: 'Overview',
    h: 'One console, every site',
    filter: 'Last 24h',
    stats: [
      { lab: 'Verified', val: '1,284', d: '+12%' },
      { lab: 'Locations', val: '12', d: 'all synced' },
      { lab: 'Avg time', val: '2.1s', d: '-0.3s' },
    ],
    mediaLabel: 'Front desk overview',
    mediaCaption: 'Reception, staffing, and verification in one view.',
    image: 'https://images.unsplash.com/photo-1759038086832-795644825e3a?auto=format&fit=crop&fm=jpg&q=80&w=2400',
    imageAlt: 'Modern front desk lobby interior',
    imageClass: 'overview',
  },
  ids: {
    nav: 'IDs',
    h: 'Reads any ID source',
    filter: 'This week',
    stats: [
      { lab: 'Scans', val: '8.4K', d: '+18%' },
      { lab: 'Match rate', val: '99.1%', d: '+0.4' },
      { lab: 'Manual', val: '3', d: '-5' },
    ],
    mediaLabel: 'Document verification',
    mediaCaption: 'Passport and ID capture with glare-tolerant reads.',
    image: 'https://images.unsplash.com/photo-1576243165717-ce0a37f0ac8b?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    imageAlt: 'Person holding a passport for verification',
    imageClass: 'ids',
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
    mediaLabel: 'Live sync backbone',
    mediaCaption: 'Local buffering and instant re-sync across every site.',
    image: 'https://images.unsplash.com/photo-1695668548342-c0c1ad479aee?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    imageAlt: 'Server rack infrastructure',
    imageClass: 'sync',
  },
  audit: {
    nav: 'Audit',
    h: 'Audit-ready by default',
    filter: 'Today',
    stats: [
      { lab: 'Logged', val: '1,291', d: '+12%' },
      { lab: 'Reviewed', val: '1,284', d: '99.5%' },
      { lab: 'Disputed', val: '0', d: '—' },
    ],
    mediaLabel: 'Tamper + audit trail',
    mediaCaption: 'Every entry is recorded with monitoring built in.',
    image: 'https://images.unsplash.com/photo-1753108140127-afc3e215d75b?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    imageAlt: 'Security camera monitoring device',
    imageClass: 'audit',
  },
};

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
          <div className="d-grp">Operations</div>
          {navs.slice(0, 2).map((k) => (
            <a key={k} className={k === view ? 'on' : ''}>
              <span className="d-dot" />{DASH_VIEWS[k].nav}
            </a>
          ))}
          <div className="d-grp">Security</div>
          {navs.slice(2).map((k) => (
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
            <div className="d-media">
              <img className={`d-media-img ${v.imageClass ?? ''}`} src={v.image} alt={v.imageAlt} loading="lazy" />
              <div className="d-media-overlay" />
              <div className="d-media-copy">
                <div className="d-media-lab">{v.mediaLabel}</div>
                <p>{v.mediaCaption}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
