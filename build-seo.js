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

const POSTS = new Function(
  fs.readFileSync(path.join(__dirname, 'posts.js'), 'utf8') + ';return POSTS;'
)().slice().sort((a, b) => (a.date < b.date ? 1 : -1));

const SITE = D.siteUrl.replace(/\/$/, '');
const TODAY = new Date().toISOString().slice(0, 10);
const NL = String.fromCharCode(10);

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

// ── blog ───────────────────────────────────────────────────────
const PAGE_CSS = `
  :root { --ink:#101010; --dim:#555; --line:#e2e2e2; --accent:#0a7d32; --bg:#fff; --code:#f4f4f4; }
  @media (prefers-color-scheme: dark) {
    :root { --ink:#e8e8e8; --dim:#9a9a9a; --line:#2a2a2a; --accent:#00ff41; --bg:#0d0d0d; --code:#151515; }
  }
  * { box-sizing:border-box; }
  body { margin:0 auto; max-width:740px; padding:40px 24px 96px;
         font:17px/1.72 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Arial,sans-serif;
         color:var(--ink); background:var(--bg); }
  nav { font-size:.86rem; margin-bottom:40px; padding-bottom:14px; border-bottom:1px solid var(--line); }
  nav a { color:var(--dim); text-decoration:none; margin-right:18px; }
  nav a:hover { color:var(--accent); }
  h1 { font-size:2.05rem; line-height:1.25; letter-spacing:-.6px; margin:0 0 12px; }
  h2 { font-size:1.26rem; margin:40px 0 12px; letter-spacing:-.2px; }
  .meta { color:var(--dim); font-size:.88rem; margin:0 0 36px; }
  .tags { margin-top:6px; }
  .tags span { display:inline-block; font-size:.74rem; color:var(--dim);
               border:1px solid var(--line); border-radius:3px; padding:1px 7px; margin:0 5px 5px 0; }
  p { margin:0 0 17px; }
  ul, ol { margin:0 0 17px; padding-left:22px; }
  li { margin-bottom:7px; }
  pre { background:var(--code); border:1px solid var(--line); border-radius:6px;
        padding:15px 17px; overflow-x:auto; margin:0 0 20px; }
  code { font:14px/1.6 ui-monospace,SFMono-Regular,"Cascadia Code",Consolas,monospace; }
  p code, li code { background:var(--code); padding:1px 5px; border-radius:3px; font-size:.88em; }
  a { color:var(--accent); }
  strong { font-weight:650; }
  .postlist { list-style:none; padding:0; }
  .postlist li { margin-bottom:30px; }
  .postlist h2 { margin:0 0 5px; font-size:1.2rem; }
  .postlist h2 a { text-decoration:none; }
  .postlist p { margin:0; color:var(--dim); font-size:.94rem; }
  .postlist .when { font-size:.8rem; color:var(--dim); }
  footer { margin-top:70px; padding-top:22px; border-top:1px solid var(--line);
           font-size:.86rem; color:var(--dim); }
  footer a { color:var(--accent); }
`;

const NAV = `<nav>
  <a href="${SITE}/">Krish Kumar</a>
  <a href="${SITE}/blog/">Writing</a>
  <a href="${SITE}/photos.html">Photos</a>
  <a href="${SITE}/resume.html">Résumé</a>
  <a href="${D.contact.github}">GitHub</a>
  <a href="${D.contact.linkedin}">LinkedIn</a>
</nav>`;

const FOOTER = `<footer>
  <p>Written by <strong>Krish Kumar</strong> (${esc(D.handle)}) — ${esc(D.jobTitle)} in
  ${esc(D.addressLocality)}, Gujarat, India. I build applied LLM systems, agent
  architectures and the backends they run on.</p>
  <p><a href="${SITE}/">Portfolio</a> · <a href="${SITE}/resume.html">Résumé</a> ·
  <a href="${D.contact.linkedin}">LinkedIn</a> · <a href="${D.contact.github}">GitHub</a> ·
  <a href="mailto:${esc(D.contact.email)}">${esc(D.contact.email)}</a></p>
</footer>`;

function buildPost(p) {
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    dateModified: p.date,
    keywords: p.tags.join(', '),
    url: `${SITE}/blog/${p.slug}.html`,
    mainEntityOfPage: `${SITE}/blog/${p.slug}.html`,
    image: `${SITE}/assets/krish-kumar-og-card.jpg`,
    inLanguage: 'en',
    author: {
      '@type': 'Person',
      '@id': `${SITE}/#krish-kumar`,
      name: D.name,
      alternateName: D.handle,
      url: `${SITE}/`,
      jobTitle: D.jobTitle,
      sameAs: socials,
    },
    publisher: { '@id': `${SITE}/#krish-kumar` },
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(p.title)} — Krish Kumar</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${SITE}/blog/${p.slug}.html">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="author" content="${esc(D.name)}">
<meta name="keywords" content="${esc(p.tags.join(', '))}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${SITE}/blog/${p.slug}.html">
<meta property="og:image" content="${SITE}/assets/krish-kumar-og-card.jpg">
<meta property="article:author" content="${esc(D.name)}">
<meta property="article:published_time" content="${p.date}">
${p.tags.map((t) => `<meta property="article:tag" content="${esc(t)}">`).join('\n')}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:creator" content="@${esc(D.handle)}">
<meta name="twitter:title" content="${esc(p.title)}">
<meta name="twitter:description" content="${esc(p.description)}">
<meta name="twitter:image" content="${SITE}/assets/krish-kumar-og-card.jpg">
<script type="application/ld+json">
${JSON.stringify(jsonld, null, 2)}
</script>
<style>${PAGE_CSS}</style>
</head>
<body>
${NAV}
<article>
  <h1>${esc(p.title)}</h1>
  <p class="meta">
    <time datetime="${p.date}">${new Date(p.date + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</time>
    · by <a href="${SITE}/">Krish Kumar</a>
    <span class="tags"><br>${p.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</span>
  </p>
${p.body.trim()}
</article>
${FOOTER}
</body>
</html>
`;
}

function buildBlogIndex() {
  const items = POSTS.map((p) => `    <li>
      <h2><a href="${p.slug}.html">${esc(p.title)}</a></h2>
      <p class="when">${new Date(p.date + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</p>
      <p>${esc(p.description)}</p>
    </li>`).join('\n');

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Krish Kumar — Writing',
    url: `${SITE}/blog/`,
    description: 'Engineering notes on applied LLM systems, agent architecture, correctness in money and data paths.',
    author: { '@id': `${SITE}/#krish-kumar` },
    blogPost: POSTS.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE}/blog/${p.slug}.html`,
      datePublished: p.date,
      author: { '@id': `${SITE}/#krish-kumar` },
    })),
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Writing — Krish Kumar (${esc(D.handle)}), AI Engineer</title>
<meta name="description" content="Engineering notes by Krish Kumar (${esc(D.handle)}) — applied LLM systems, MCP servers, agent architecture, correctness in money and data paths.">
<link rel="canonical" href="${SITE}/blog/">
<link rel="alternate" type="application/atom+xml" title="Krish Kumar — Engineering writing" href="${SITE}/feed.xml">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="author" content="${esc(D.name)}">
<meta property="og:type" content="website">
<meta property="og:title" content="Writing — Krish Kumar, AI Engineer">
<meta property="og:description" content="Engineering notes on applied LLM systems, agent architecture and correctness in money and data paths.">
<meta property="og:url" content="${SITE}/blog/">
<meta property="og:image" content="${SITE}/assets/krish-kumar-og-card.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${SITE}/assets/krish-kumar-og-card.jpg">
<script type="application/ld+json">
${JSON.stringify(jsonld, null, 2)}
</script>
<style>${PAGE_CSS}</style>
</head>
<body>
${NAV}
<h1>Writing</h1>
<p class="meta">Engineering notes by Krish Kumar — ${esc(D.jobTitle)}, ${esc(D.addressLocality)}.</p>
<ul class="postlist">
${items}
</ul>
${FOOTER}
</body>
</html>
`;
}

// ── photos.html ────────────────────────────────────────────────
const PHOTOS = JSON.parse(fs.readFileSync(path.join(__dirname, 'photos.json'), 'utf8'));

function buildPhotos() {
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: `Photos of ${D.name} (${D.handle}) — ${D.jobTitle}`,
    url: `${SITE}/photos.html`,
    description: `Photographs of ${D.name}, also known as ${D.handle}, ${D.jobTitle} based in ${D.addressLocality}, ${D.addressRegion}, India.`,
    about: { '@id': `${SITE}/#krish-kumar` },
    author: { '@id': `${SITE}/#krish-kumar` },
    associatedMedia: PHOTOS.map((p) => ({
      '@type': 'ImageObject',
      contentUrl: `${SITE}/assets/${p.file}`,
      url: `${SITE}/assets/${p.file}`,
      width: p.w,
      height: p.h,
      name: p.alt,
      caption: p.alt,
      description: p.alt,
      representativeOfPage: p.file === PHOTOS[0].file,
      about: { '@id': `${SITE}/#krish-kumar` },
      creditText: D.name,
      copyrightNotice: `© ${D.name}`,
    })),
  };

  const tiles = PHOTOS.map((p) => `    <figure>
      <img src="assets/${esc(p.file)}" alt="${esc(p.alt)}" title="${esc(p.alt)}"
           width="${p.w}" height="${p.h}" loading="lazy">
      <figcaption>${esc(p.caption)} — Krish Kumar, AI Engineer</figcaption>
    </figure>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Photos of ${esc(D.name)} (${esc(D.handle)}) — ${esc(D.jobTitle)}</title>
<meta name="description" content="Photographs of ${esc(D.name)}, also known as ${esc(D.handle)} — ${esc(D.jobTitle)} based in ${esc(D.addressLocality)}, ${esc(D.addressRegion)}, India.">
<link rel="canonical" href="${SITE}/photos.html">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="author" content="${esc(D.name)}">
<meta property="og:type" content="profile">
<meta property="og:title" content="Photos of ${esc(D.name)} (${esc(D.handle)})">
<meta property="og:description" content="Photographs of ${esc(D.name)}, ${esc(D.jobTitle)} in ${esc(D.addressLocality)}, India.">
<meta property="og:url" content="${SITE}/photos.html">
<meta property="og:image" content="${SITE}/assets/${PHOTOS[0].file}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${SITE}/assets/${PHOTOS[0].file}">
<script type="application/ld+json">
${JSON.stringify(jsonld, null, 2)}
</script>
<style>${PAGE_CSS}
  body { max-width: 1040px; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); gap:20px; }
  figure { margin:0; }
  figure img { width:100%; height:auto; border-radius:8px; display:block; border:1px solid var(--line); }
  figcaption { font-size:.8rem; color:var(--dim); margin-top:7px; }
</style>
</head>
<body>
${NAV}
<h1>Photos of Krish Kumar</h1>
<p class="meta">Krish Kumar, also known as <strong>${esc(D.handle)}</strong> — ${esc(D.jobTitle)}
based in ${esc(D.location)}. These are photographs of me; please credit if you use them.</p>
<div class="grid">
${tiles}
</div>
${FOOTER}
</body>
</html>
`;
}

// ── feed.xml (Atom) ───────────────────────────────────────────
function buildFeed() {
  const updated = new Date(POSTS[0].date + 'T00:00:00Z').toISOString();
  const entries = POSTS.map((p) => `  <entry>
    <title>${esc(p.title)}</title>
    <link href="${SITE}/blog/${p.slug}.html"/>
    <id>${SITE}/blog/${p.slug}.html</id>
    <updated>${new Date(p.date + 'T00:00:00Z').toISOString()}</updated>
    <summary>${esc(p.description)}</summary>
${p.tags.map((t) => `    <category term="${esc(t)}"/>`).join(NL)}
  </entry>`).join(NL);

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${esc(D.name)} — Engineering writing</title>
  <subtitle>Notes on applied LLM systems, agent architecture and correctness in money and data paths.</subtitle>
  <link href="${SITE}/feed.xml" rel="self"/>
  <link href="${SITE}/blog/"/>
  <id>${SITE}/</id>
  <updated>${updated}</updated>
  <author>
    <name>${esc(D.name)}</name>
    <uri>${SITE}/</uri>
    <email>${esc(D.contact.email)}</email>
  </author>
${entries}
</feed>
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
    <loc>${SITE}/photos.html</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
${PHOTOS.map((p) => `    <image:image>
      <image:loc>${SITE}/assets/${p.file}</image:loc>
      <image:title>${esc(p.alt)}</image:title>
      <image:caption>${esc(p.alt)}</image:caption>
    </image:image>`).join(NL)}
  </url>
  <url>
    <loc>${SITE}/blog/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${POSTS.map((p) => `  <url>
    <loc>${SITE}/blog/${p.slug}.html</loc>
    <lastmod>${p.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
  <url>
    <loc>${SITE}/assets/Krish_Kumar_Resume.pdf</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
`;
}

const blogDir = path.join(__dirname, 'blog');
fs.mkdirSync(blogDir, { recursive: true });

fs.writeFileSync(path.join(__dirname, 'resume.html'), buildResume(), 'utf8');
fs.writeFileSync(path.join(blogDir, 'index.html'), buildBlogIndex(), 'utf8');
POSTS.forEach((p) => fs.writeFileSync(path.join(blogDir, `${p.slug}.html`), buildPost(p), 'utf8'));
fs.writeFileSync(path.join(__dirname, 'photos.html'), buildPhotos(), 'utf8');
fs.writeFileSync(path.join(__dirname, 'feed.xml'), buildFeed(), 'utf8');
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), buildSitemap(), 'utf8');

console.log(`resume.html   ${D.experience.length} roles, ${D.projects.length} projects, ${D.skills.length} skill groups`);
POSTS.forEach((p) => console.log(`blog          ${p.slug}.html  (${p.date})`));
console.log(`photos.html   ${PHOTOS.length} images with ImageObject schema`);
console.log(`feed.xml      Atom feed, ${POSTS.length} entries`);
console.log(`sitemap.xml   ${5 + POSTS.length} urls, ${PHOTOS.length + 4} images`);
console.log(`sameAs        ${socials.length} profiles: ${socials.map((s) => s.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]).join(', ')}`);
