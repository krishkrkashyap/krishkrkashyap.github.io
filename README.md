# krishkrkashyap.github.io

Personal site of **Krish Kumar (krishkrkashyap)** — AI Engineer in Ahmedabad, India.

Live at **[krishkrkashyap.github.io](https://krishkrkashyap.github.io)**

| Page | What it is |
|---|---|
| [`/`](https://krishkrkashyap.github.io) | Matrix-themed single-page portfolio, rendered client-side from `data.js` |
| [`/resume.html`](https://krishkrkashyap.github.io/resume.html) | Static résumé — generated, no JS required |
| [`/blog/`](https://krishkrkashyap.github.io/blog/) | Engineering write-ups |
| [`/photos.html`](https://krishkrkashyap.github.io/photos.html) | Photo gallery with `ImageObject` schema |

## How it's built

No framework, no build step beyond one Node script. The homepage is vanilla JS over a
canvas matrix-rain intro; everything else is generated.

```
data.js       single source of truth — bio, experience, skills, projects, contact
posts.js      blog post content
photos.json   gallery manifest
build-seo.js  generates resume.html, blog/*.html, photos.html, sitemap.xml
```

Regenerate the static pages after editing any source file:

```bash
node build-seo.js
```

That writes `resume.html`, `blog/index.html`, one page per post, `photos.html`, and a
`sitemap.xml` carrying image entries.

## Why the static pages exist

The homepage renders from JavaScript. Googlebot executes JS, but Bingbot and the
answer-engine crawlers (GPTBot, ClaudeBot, PerplexityBot) largely do not — so without a
static copy they'd see an empty page. `resume.html` and the blog are plain HTML for
exactly that reason, and `index.html` carries a `<noscript>` identity block as well.

## Structured data

A single `Person` entity is declared once in `index.html` as a JSON-LD `@graph`
(`Person` + `WebSite` + `ProfilePage`) with a stable `@id`. Every other generated page —
each blog post, the résumé, the gallery — references that same `@id` as its author rather
than redeclaring the person, so the pages reinforce one entity instead of looking like
several different people with the same name.

`sameAs` links the GitHub, LinkedIn, X, Instagram, Facebook and Pinterest profiles.

## Notes

- `google*.html` is the Search Console verification file. **Don't delete it** — removing it revokes verification.
- Source photos stay local; only resized, SEO-named derivatives are committed.
- `robots.txt` deliberately allows `Google-Extended` and the AI crawlers.

---

MIT licensed where applicable. Photographs and written content © Krish Kumar.
