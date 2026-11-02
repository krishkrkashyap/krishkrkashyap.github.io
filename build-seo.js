/* ============================================================
   build-seo.js — generates the static, crawlable surface of the site
   from data.js, the single source of truth.

   Outputs:
     resume.html   full static résumé (no JS needed — indexable by every crawler)
     sitemap.xml   with image entries, so photos reach Google Images

   Run: node build-seo.js
   ============================================================ */

const fs = require('fs');
const path = require('path');

const D = new Function(
  fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8') + ';return PORTFOLIO_DATA;'
)();

const SITE = D.siteUrl.replace(/\/$/, '');
const TODAY = new Date().toISOString().slice(0, 10);

const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const socials = [
  D.contact.github, D.contact.linkedin, D.contact.twitter,
  D.contact.instagram, D.contact.facebook, D.contact.pinterest,
].filter(Boolean);

// ── resume.html ────────────────────────────────────────────────
function buildResume() {
  const expHtml = D.experience.map((e) => {
    const bullets = (e.responsibilities || e.highlights || [])
      .map((b) => `        <li>${esc(b)}</li>`).join('\n');
    return `      <article class="role">
        <h3>${esc(e.title)}</h3>
        <p class="org">${esc(e.company)}</p>
        <p class="when">${esc(e.period)}</p>
        <ul>
${bullets}
        </ul>
      </article>`;
  }).join('\n');

  const projHtml = D.projects.map((p) => {
    const link = p.github
      ? ` <a href="${esc(p.github)}" rel="noopener">Source on GitHub</a>`
      : '';
    return `      <article class="project">
        <h3>${esc(p.name)}</h3>
        <p class="stack">${p.techStack.map(esc).join(' · ')}</p>
        <p>${esc(p.description)}${link}</p>
      </article>`;
  }).join('\n');

  const skillHtml = D.skills.map((g) =>
    `      <div class="skillgroup"><h3>${esc(g.category)}</h3><p>${g.items.map(esc).join(' · ')}</p></div>`
  ).join('\n');

  const eduHtml = D.education.map((e) =>
    `      <article class="edu"><h3>${esc(e.degree)}</h3><p class="org">${esc(e.school)}</p><p class="when">${esc(e.year)}</p><p>${esc(e.coursework)}</p></article>`
  ).join('\n');

  const certHtml = D.certifications.map((c) =>
    `        <li><strong>${esc(c.name)}</strong> — ${esc(c.issuer)}, ${esc(c.year)}</li>`
  ).join('\n');

  const achHtml = D.achievements.map((a) => `        <li>${esc(a)}</li>`).join('\n');

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: `${SITE}/resume.html`,
    name: `${D.name} (${D.handle}) — Résumé`,
    mainEntity: {
      '@type': 'Person',
      '@id': `${SITE}/#krish-kumar`,
      name: D.name,
      alternateName: [D.handle, 'Krish Kr Kashyap', 'Krish Kashyap'],
      url: `${SITE}/`,
      image: `${SITE}/assets/krish-kumar-ai-engineer-portrait.jpg`,
      jobTitle: D.jobTitle,
      email: `mailto:${D.contact.email}`,
      telephone: D.contact.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: D.addressLocality,
        addressRegion: D.addressRegion,
        addressCountry: D.addressCountry,
      },
      worksFor: { '@type': 'Organization', name: D.worksFor },
      sameAs: socials,
    },
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(D.name)} (${esc(D.handle)}) — Résumé | ${esc(D.jobTitle)}</title>
<meta name="description" content="Full résumé of ${esc(D.name)} (${esc(D.handle)}), ${esc(D.jobTitle)} in ${esc(D.addressLocality)}, India — experience, projects, skills, education and certifications.">
<link rel="canonical" href="${SITE}/resume.html">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="author" content="${esc(D.name)}">
<meta property="og:type" content="profile">
<meta property="og:title" content="${esc(D.name)} (${esc(D.handle)}) — Résumé">
<meta property="og:description" content="${esc(D.jobTitle)} in ${esc(D.addressLocality)}, India. Applied LLM systems, agent architecture, full-stack automation.">
<meta property="og:url" content="${SITE}/resume.html">
<meta property="og:image" content="${SITE}/assets/krish-kumar-og-card.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${SITE}/assets/krish-kumar-og-card.jpg">
<script type="application/ld+json">
${JSON.stringify(jsonld, null, 2)}
</script>
<style>
  :root { --ink:#101010; --dim:#555; --line:#e2e2e2; --accent:#0a7d32; --bg:#fff; }
  @media (prefers-color-scheme: dark) {
    :root { --ink:#e8e8e8; --dim:#9a9a9a; --line:#2a2a2a; --accent:#00ff41; --bg:#0d0d0d; }
  }
  * { box-sizing:border-box; }
  body { margin:0 auto; max-width:860px; padding:48px 24px 96px;
         font:16px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Arial,sans-serif;
         color:var(--ink); background:var(--bg); }
  header { display:flex; gap:28px; align-items:flex-start; flex-wrap:wrap;
           border-bottom:3px solid var(--accent); padding-bottom:28px; margin-bottom:12px; }
  header img { width:132px; height:auto; border-radius:8px; flex:0 0 auto; }
  h1 { font-size:2.2rem; margin:0 0 6px; letter-spacing:-.5px; }
  h1 span { color:var(--dim); font-weight:400; font-size:1.3rem; }
  h2 { font-size:.82rem; text-transform:uppercase; letter-spacing:2.5px; color:var(--accent);
       margin:44px 0 16px; padding-bottom:7px; border-bottom:1px solid var(--line); }
  h3 { font-size:1.06rem; margin:0 0 3px; }
  .title { font-size:1.12rem; font-weight:600; margin:0 0 4px; }
  .meta, .org, .when, .stack { color:var(--dim); font-size:.9rem; margin:0 0 4px; }
  .when { font-size:.84rem; }
  .stack { font-size:.84rem; font-style:italic; }
  .role, .project, .edu { margin-bottom:26px; }
  ul { margin:8px 0 0; padding-left:20px; }
  li { margin-bottom:6px; }
  a { color:var(--accent); }
  .links a { margin-right:14px; white-space:nowrap; }
  .skillgroup { margin-bottom:14px; }
  .skillgroup h3 { font-size:.92rem; }
  .skillgroup p { margin:2px 0 0; font-size:.9rem; color:var(--dim); }
  footer { margin-top:64px; padding-top:20px; border-top:1px solid var(--line);
           font-size:.85rem; color:var(--dim); }
</style>
</head>
<body>

<header>
  <img src="assets/krish-kumar-ai-engineer-portrait.jpg"
       alt="${esc(D.name)} (${esc(D.handle)}), ${esc(D.jobTitle)} in ${esc(D.addressLocality)}, India"
       width="896" height="1200">
  <div>
    <h1>${esc(D.name)} <span>(${esc(D.handle)})</span></h1>
    <p class="title">${esc(D.jobTitle)} — ${esc(D.worksFor)}</p>
    <p class="meta">${esc(D.location)}</p>
    <p class="meta">
      <a href="mailto:${esc(D.contact.email)}">${esc(D.contact.email)}</a> ·
      <a href="tel:${esc(D.contact.phone.replace(/\s/g, ''))}">${esc(D.contact.phone)}</a>
    </p>
    <p class="links">
      <a rel="me" href="${esc(D.contact.github)}">GitHub</a>
      <a rel="me" href="${esc(D.contact.linkedin)}">LinkedIn</a>
      <a rel="me" href="${esc(D.contact.twitter)}">X</a>
      <a rel="me" href="${esc(D.contact.instagram)}">Instagram</a>
      <a rel="me" href="${esc(D.contact.facebook)}">Facebook</a>
      <a rel="me" href="${esc(D.contact.pinterest)}">Pinterest</a>
    </p>
    <p class="links"><a href="${SITE}/">Portfolio</a> <a href="assets/Krish_Kumar_Resume.pdf">Résumé (PDF)</a></p>
  </div>
</header>

<h2>Professional Summary</h2>
<p>${esc(D.bio)}</p>

<h2>Key Achievements</h2>
<ul>
${achHtml}
</ul>

<h2>Experience</h2>
${expHtml}

<h2>Technical Skills</h2>
${skillHtml}

<h2>Selected Projects</h2>
${projHtml}

<h2>Education</h2>
${eduHtml}

<h2>Certifications</h2>
<ul>
${certHtml}
</ul>

<footer>
  <p>${esc(D.name)} — ${esc(D.jobTitle)}, ${esc(D.location)}.
  Also known as ${esc(D.handle)}. Last updated ${TODAY}.</p>
</footer>

</body>
</html>
`;
}

// ── sitemap.xml ────────────────────────────────────────────────
function buildSitemap() {
  const images = [
    ['assets/krish-kumar-ai-engineer-portrait.jpg', `${D.name} (${D.handle}), ${D.jobTitle} in ${D.addressLocality}, India — portrait`],
    ['assets/krish-kumar-ai-engineer-full.jpg', `${D.name} (${D.handle}), ${D.jobTitle} — full portrait`],
    ['assets/krish-kumar-ai-engineer-photo.jpg', `${D.name} (${D.handle}), ${D.jobTitle}, Ahmedabad India`],
    ['assets/krish-kumar-og-card.jpg', `${D.name} — ${D.jobTitle} portfolio card`],
  ];
  const imgXml = images.map(([u, t]) =>
    `    <image:image>
      <image:loc>${SITE}/${u}</image:loc>
      <image:title>${esc(t)}</image:title>
      <image:caption>${esc(t)}</image:caption>
    </image:image>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
${imgXml}
  </url>
  <url>
    <loc>${SITE}/resume.html</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${SITE}/assets/krish-kumar-ai-engineer-portrait.jpg</image:loc>
      <image:title>${esc(D.name)} (${esc(D.handle)}) — ${esc(D.jobTitle)}</image:title>
    </image:image>
  </url>
  <url>
    <loc>${SITE}/assets/Krish_Kumar_Resume.pdf</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
`;
}

fs.writeFileSync(path.join(__dirname, 'resume.html'), buildResume(), 'utf8');
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), buildSitemap(), 'utf8');

console.log(`resume.html   ${D.experience.length} roles, ${D.projects.length} projects, ${D.skills.length} skill groups`);
console.log(`sitemap.xml   3 urls, 5 images`);
console.log(`sameAs        ${socials.length} profiles: ${socials.map((s) => s.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]).join(', ')}`);
