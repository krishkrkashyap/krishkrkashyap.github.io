/* ============================================================
   build-stats.js — renders assets/github-stats.svg

   Self-hosted replacement for github-readme-stats.vercel.app, which
   is a free public instance that gets paused and 503s. This runs on
   GitHub Actions and commits the SVG to this repo, so the card is
   served from krishkrkashyap.github.io and cannot go down
   independently of the site itself.

   Uses only public endpoints — no token or secret required. The
   contribution totals include private-repo work because the account
   has "include private contributions on my profile" enabled.

   Run: node build-stats.js
   ============================================================ */

const fs = require('fs');
const path = require('path');

const USER = 'krishkrkashyap';

function get(url, headers = {}) {
  return fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (stats-card-builder)', ...headers },
  }).then((r) => {
    if (!r.ok) throw new Error(`${url} -> HTTP ${r.status}`);
    return r;
  });
}

async function contributions() {
  const html = await get(`https://github.com/users/${USER}/contributions`).then((r) => r.text());

  const cells = [...html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g)]
    .map((m) => ({ date: m[1], level: Number(m[2]) }));
  if (!cells.length) throw new Error('contribution calendar parse returned 0 cells');

  const counts = [...html.matchAll(/>(\d+|No)\s+contributions?\s+on/g)]
    .map((m) => (m[1] === 'No' ? 0 : Number(m[1])));

  const total = counts.reduce((a, b) => a + b, 0);
  const active = cells.filter((c) => c.level > 0).length;

  let run = 0, longest = 0, current = 0;
  cells.forEach((c) => {
    run = c.level > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  });
  // current streak counts back from the most recent day
  for (let i = cells.length - 1; i >= 0 && cells[i].level > 0; i--) current++;

  return { total, active, days: cells.length, longest, current, cells };
}

async function profile() {
  const u = await get(`https://api.github.com/users/${USER}`).then((r) => r.json());
  return { repos: u.public_repos, followers: u.followers, since: u.created_at.slice(0, 4) };
}

async function languages() {
  const repos = await get(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner`)
    .then((r) => r.json());
  const tally = {};
  repos.forEach((r) => {
    if (r.fork || !r.language) return;
    tally[r.language] = (tally[r.language] || 0) + 1;
  });
  return Object.entries(tally).sort((a, b) => b[1] - a[1]).slice(0, 5);
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const n = (x) => x.toLocaleString('en-US');

function svg({ c, p, langs }) {
  const W = 495, H = 195;
  const LANG_COLORS = {
    Python: '#3572A5', JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26',
    CSS: '#563d7c', Java: '#b07219', Kotlin: '#A97BFF', Jupyter: '#DA5B0B',
    'Jupyter Notebook': '#DA5B0B', Shell: '#89e051', Dockerfile: '#384d54', C: '#555555',
    'C++': '#f34b7d', PHP: '#4F5D95', Go: '#00ADD8', Rust: '#dea584',
  };

  const stats = [
    ['Contributions (1y)', n(c.total)],
    ['Active days', `${c.active} / ${c.days}`],
    ['Longest streak', `${c.longest} days`],
    ['Public repos', n(p.repos)],
  ];

  const rows = stats.map(([label, value], i) => `
    <text x="26" y="${74 + i * 26}" class="label">${esc(label)}</text>
    <text x="250" y="${74 + i * 26}" class="value" text-anchor="end">${esc(value)}</text>`).join('');

  // language bar
  const totalLang = langs.reduce((a, [, v]) => a + v, 0) || 1;
  let x = 0;
  const bar = langs.map(([name, v]) => {
    const w = (v / totalLang) * 190;
    const seg = `<rect x="${(285 + x).toFixed(1)}" y="62" width="${w.toFixed(1)}" height="9" rx="2"
      fill="${LANG_COLORS[name] || '#8b949e'}"/>`;
    x += w;
    return seg;
  }).join('');

  const legend = langs.map(([name, v], i) => `
    <circle cx="291" cy="${93 + i * 20}" r="5" fill="${LANG_COLORS[name] || '#8b949e'}"/>
    <text x="303" y="${97 + i * 20}" class="lang">${esc(name)}</text>
    <text x="471" y="${97 + i * 20}" class="langn" text-anchor="end">${v}</text>`).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"
     role="img" aria-label="GitHub statistics for Krish Kumar (krishkrkashyap)">
  <title>Krish Kumar (krishkrkashyap) — GitHub statistics</title>
  <style>
    .bg     { fill:#ffffff; stroke:#d0d7de; }
    .head   { fill:#0a7d32; font:600 15px -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif; }
    .sub    { fill:#656d76; font:400 10px -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif; }
    .label  { fill:#656d76; font:400 12.5px -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif; }
    .value  { fill:#1f2328; font:600 13.5px -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif; }
    .lang   { fill:#1f2328; font:400 11.5px -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif; }
    .langn  { fill:#656d76; font:400 11.5px -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif; }
    .rule   { stroke:#d8dee4; }
    @media (prefers-color-scheme: dark) {
      .bg    { fill:#0d1117; stroke:#30363d; }
      .head  { fill:#00ff41; }
      .sub, .label, .langn { fill:#8b949e; }
      .value, .lang { fill:#e6edf3; }
      .rule  { stroke:#21262d; }
    }
  </style>
  <rect class="bg" x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="8"/>
  <text x="26" y="33" class="head">Krish Kumar — krishkrkashyap</text>
  <text x="26" y="48" class="sub">AI Engineer · Ahmedabad, India · on GitHub since ${p.since}</text>
  <line class="rule" x1="268" y1="58" x2="268" y2="${H - 22}"/>
${rows}
  <text x="285" y="54" class="label">Most-used languages</text>
${bar}
${legend}
</svg>
`;
}

(async () => {
  const [c, p, langs] = await Promise.all([contributions(), profile(), languages()]);
  const out = path.join(__dirname, 'assets', 'github-stats.svg');
  fs.writeFileSync(out, svg({ c, p, langs }), 'utf8');
  console.log(`github-stats.svg  ${n(c.total)} contributions, ${c.active}/${c.days} active days, ` +
              `longest streak ${c.longest}d, ${p.repos} public repos`);
  console.log(`languages         ${langs.map(([k, v]) => `${k}:${v}`).join('  ')}`);
})().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
