// ============================================================
// BLOG POSTS — consumed by build-seo.js, which renders each one
// to blog/<slug>.html plus a blog/index.html listing.
//
// To add a post: copy a block, give it a new slug, write `body`
// as plain HTML. Then run `node build-seo.js`.
// ============================================================

const POSTS = [
  {
    slug: 'money-in-integer-paise',
    title: 'Never store money in a float: integer paise and basis-point taxes',
    date: '2026-10-12',
    description:
      'Why a restaurant POS stores every amount as an integer number of paise, why tax rates are basis points rather than percentages, and the rounding rule that keeps a printed bill reconciling with the ledger.',
    tags: ['money', 'typescript', 'pos', 'correctness', 'rounding'],
    body: `
<p>Every billing system I have replaced had the same bug waiting in it, and it is always
the same bug: an amount stored as a floating-point number.</p>

<p>The canonical demonstration costs one line:</p>

<pre><code>0.1 + 0.2 === 0.3   // false
0.1 + 0.2           // 0.30000000000000004</code></pre>

<p>This is not a JavaScript quirk. IEEE 754 binary floating point cannot represent
one tenth exactly, for the same reason decimal cannot represent one third exactly. Any
language using doubles has it. The usual response is to round at the end and move on,
and for a while that works, because a single bill is small and the error hides below the
smallest coin.</p>

<p>It stops working when you sum. A till doing a few thousand lines a day across twelve
outlets accumulates those errors into a figure that is visible in the day's closing
balance and impossible to explain to an accountant. The error is never large. It is
simply unaccountable, which is worse.</p>

<h2>Store the smallest unit as an integer</h2>

<p>In <code>k-pos</code>, the offline-first POS I built to replace a paid SaaS till, no
amount is ever a decimal. Every amount is an integer count of <strong>paise</strong> —
the smallest unit of Indian currency, one hundredth of a rupee.</p>

<pre><code>// ₹249.50 is not 249.50
const price = 24950;  // paise, always an integer</code></pre>

<p>Integers add and multiply exactly. A sum of ten thousand integer line amounts is
exact. The rendering layer divides by 100 once, at the very last moment, purely to put
a string in front of a human. Nothing downstream of that string is ever read back as a
number.</p>

<p>SQLite made this easy to enforce: the column is <code>INTEGER</code>, so a decimal
cannot be written even by accident. A schema constraint is worth more than a convention,
because the convention only holds while everybody remembers it.</p>

<h2>Tax rates are basis points, not percentages</h2>

<p>The same reasoning applies one level up. GST in India is 5%, 12%, 18% — but a
restaurant also deals with per-item cess and composite rates that are not whole numbers.
Storing <code>0.05</code> as a rate reintroduces exactly the problem we just removed.</p>

<p>So rates are stored in <strong>basis points</strong>: one basis point is one
hundredth of one percent.</p>

<pre><code>// 5% = 500 bp, 18% = 1800 bp, 2.5% = 250 bp
const GST_5  = 500;
const GST_18 = 1800;

function taxOn(amountPaise: number, rateBp: number): number {
  // multiply first, divide last — never the reverse
  return Math.round((amountPaise * rateBp) / 10_000);
}</code></pre>

<p>The ordering in that function is the whole point. <code>amount * rate / 10000</code>
keeps full integer precision until the single division. <code>amount * (rate / 10000)</code>
computes a float first and hands you back the problem you were avoiding.</p>

<h2>Round once, and define which way</h2>

<p>There is exactly one rounding step, in <code>taxOn</code>, and it needs a stated
rule. I use half-up, because that is what the tax authority's own worked examples use,
and because a bill that disagrees with the inspector's arithmetic is a conversation you
do not want to have.</p>

<p>Banker's rounding — half-to-even — is better for statistical neutrality over very
large sample sizes. It is the wrong choice here. Matching the regulator beats matching
the textbook.</p>

<p>The rule that matters more than which rounding you pick: <strong>round once</strong>.
If tax is rounded per line and the lines are then summed, the bill total can differ from
tax computed on the order total. Both numbers are defensible, they are just not equal,
and whichever one you print is the one you must store. I round per line, because that
is what appears on the printed bill, and the stored total is the sum of the stored
lines. The invariant is that the ledger reproduces the paper.</p>

<h2>Price snapshots</h2>

<p>One more thing that looks unrelated and is not. An order line does not hold a
foreign key to the current price of an item. It holds a <em>copy</em> of the price at
the moment the line was created.</p>

<p>If it held a reference, then raising the price of a samosa tomorrow would silently
rewrite every historical bill that contained one. Last month's sales report would change
value every time the menu changed. I have seen this in production systems and the
symptom is always the same: a report that was correct on Monday is different on Friday,
and nobody can say why.</p>

<p>Snapshot the price. The storage cost is a few bytes per line. The alternative is a
ledger that is not a ledger.</p>

<h2>What this buys</h2>

<p>None of this is clever. It is a set of boring decisions taken early:</p>

<ul>
  <li>integers in the smallest unit, enforced by the column type</li>
  <li>rates as basis points, multiply before you divide</li>
  <li>one rounding step, half-up, documented</li>
  <li>prices copied into the order, never referenced</li>
</ul>

<p>The payoff is that the day's totals reconcile exactly, every day, without anyone
needing to investigate a two-rupee discrepancy. In a system handling money, "exactly"
is the only acceptable tolerance — not because two rupees matters, but because an
unexplained two rupees means you do not know what your system is doing.</p>
`,
  },

  {
    slug: 'mcp-server-over-a-pos',
    title: 'Putting a Model Context Protocol server over a commercial POS',
    date: '2026-09-28',
    description:
      'How exposing a point-of-sale platform as schema-validated MCP tools replaced a drawer full of one-off analysis scripts, and what the tool boundary has to look like for a model to use it safely.',
    tags: ['mcp', 'llm', 'ai-agents', 'python', 'pos'],
    body: `
<p>Before this, answering a question about the business meant writing a script. "Which
outlet is losing the most on wastage this quarter" was twenty minutes of pulling the POS
API, reshaping it in pandas, and printing a table. The script was then thrown away,
because the next question was slightly different.</p>

<p>That is an enormous amount of work to answer a question that a person could ask in
one sentence. So I built a <strong>Model Context Protocol server</strong> over the
Petpooja POS cloud, and now the question <em>is</em> the one sentence.</p>

<h2>What MCP actually is</h2>

<p>MCP is a protocol for handing a model a set of callable tools, each with a declared
JSON schema for its arguments and its return shape. The model does not see your API. It
sees a menu of named operations with typed parameters, and it picks one.</p>

<p>The interesting part is not the plumbing — the SDK handles that. The interesting part
is <strong>where you draw the tool boundary</strong>, because that decision determines
whether the model is useful or dangerous.</p>

<h2>Wrong boundary: mirror the REST API</h2>

<p>My first attempt exposed the POS endpoints roughly one-to-one. Fourteen endpoints
became fourteen tools. It worked, in the sense that calls succeeded, and it was close to
useless.</p>

<p>The model would fetch a raw order list, get back several thousand records, and then
try to reason about them in the context window. It ran out of room, and the arithmetic it
did on the records it could see was arithmetic a database should have done. A model is a
bad place to do a <code>GROUP BY</code>.</p>

<h2>Right boundary: expose the questions, not the endpoints</h2>

<p>The tools that work are shaped like the questions people actually ask:</p>

<pre><code>sales_by_outlet(date_from, date_to, segment=None)
wastage_summary(outlet_id, period)
item_movement(item_name, outlet_id=None, period="30d")
price_variance(outlet_id, period)
stock_on_hand(outlet_id, category=None)</code></pre>

<p>Each one does its aggregation in PostgreSQL and returns tens of rows, not thousands.
The model receives a small, already-correct result and spends its effort on
interpretation, which is the part it is genuinely good at.</p>

<p>This is the whole lesson, and it transfers to any agent you build:
<strong>a tool should return an answer, not a dataset.</strong> If the model has to
aggregate what you handed back, you drew the boundary one level too low.</p>

<h2>Schemas are a safety mechanism, not documentation</h2>

<p>Every argument is validated before anything executes. <code>outlet_id</code> must be
an integer that exists. <code>period</code> must match a known pattern. Dates must
parse, and the range cannot exceed a year.</p>

<p>This matters more than it does in ordinary code, because the caller is a language
model and a language model will confidently pass <code>outlet_id="the Prahlad Nagar
one"</code>. With a schema that is a clean validation error the model can read and
correct in one turn. Without one it is a confusing 500 from a vendor API, or worse, a
query that silently returns nothing and gets reported as "no wastage this quarter".</p>

<p>A tool that fails loudly is a tool a model can use. A tool that fails quietly is how
you get a confidently wrong answer in front of a business owner.</p>

<h2>Read-only, deliberately</h2>

<p>Every tool on this server reads. None of them writes. No tool voids a bill, adjusts
stock, or changes a price.</p>

<p>That was not a technical limitation and it would not have been hard to add. It is
that the value here is entirely in the asking, and the risk of a write path is entirely
asymmetric. The upside of "the model can also fix it" is small; the downside of a model
confidently adjusting stock on a misparsed instruction is a corrupted inventory ledger
that someone has to reconstruct by hand.</p>

<p>When write operations do become worth it, they go behind an explicit human approval
step — the model drafts the mutation, a person confirms it, and only then does it
execute. I use exactly that pattern in a vendor-payment bot elsewhere in the estate: it
drafts the message from the bank statement, and a human presses send.</p>

<h2>What changed</h2>

<p>The scripts are gone. Questions that used to cost twenty minutes cost one sentence,
and — more useful than the speed — people now ask questions they previously would not
have bothered to ask, because the cost of asking fell to roughly zero.</p>

<p>That is the actual return on an MCP server. Not that it answers faster, but that it
changes which questions are worth asking.</p>
`,
  },

  {
    slug: 'the-leak-that-was-not-in-the-data',
    title: 'A margin audit, and the leak that was not in the data',
    date: '2026-09-05',
    description:
      'A year of restaurant transaction data through a staged pandas pipeline. The price integrity was high, the discounting was clean, and the real finding was a category of transaction that no control was watching at all.',
    tags: ['data-engineering', 'pandas', 'forensics', 'audit', 'parquet'],
    body: `
<p>I was asked a narrow question: where is the margin going? Twelve outlets, a year of
transactions, and a gross margin that did not match what the menu costing said it should
be.</p>

<p>The assumption going in — mine as much as anyone's — was that the answer would be
discounting. It usually is. Someone is giving away too much, and once you quantify it
you tighten the policy and recover the difference.</p>

<p>That is not what the data said.</p>

<h2>The pipeline</h2>

<p>A year of line-item data across twelve outlets is not large by any serious standard,
but it is large enough that iterating on a CSV is miserable. The pipeline is staged, and
each stage writes Parquet:</p>

<pre><code>raw/       immutable export, never touched again
clean/     typed, deduplicated, canonical outlet and item names
joined/    lines joined to costing and category masters
features/  per-line margin, discount, void and modifier flags</code></pre>

<p>Each stage reads the previous one and writes a new directory. Nothing mutates in
place. When — not if — a mapping turns out to be wrong, you fix that stage and re-run
forward, and you still have the original to prove what the source actually said.</p>

<p>Parquet rather than CSV for the obvious reason: columnar, typed, and about a tenth of
the size, so a stage re-runs in seconds and you stay willing to re-run it. A slow
pipeline quietly discourages you from checking your own work.</p>

<p>The canonicalisation stage was the one that mattered most and looked least
interesting. The same item was spelled four ways across outlets. Until those collapse
into one name, every aggregate downstream is wrong in a way that is invisible — it does
not error, it just under-counts.</p>

<h2>What came back clean</h2>

<p>Price integrity at the till was high. The price charged matched the price on the menu
in the overwhelming majority of lines, and the exceptions were explainable — genuine
authorised overrides, concentrated in a small number of shifts.</p>

<p>Discounting was within policy. Voids were unremarkable. Wastage was real but roughly
what the kitchen already believed it to be.</p>

<p>Each of these was a hypothesis, and each came back negative. That is a result, and it
is worth stating plainly rather than quietly moving on, because "we checked and it is
fine" is information the business did not previously have about its own controls.</p>

<h2>The finding</h2>

<p>The leakage was not in any of the categories anyone was watching. It was in a class of
transaction that <strong>no control existed for at all</strong> — not a control that was
failing, a control that had never been written. It did not appear in any report, because
no report had a line for it. It was not an exception, because nothing had defined it as
one.</p>

<p>The reason it took a full pipeline to find is that it was invisible in aggregate. At
the level anybody normally looks — daily totals per outlet — it is a rounding error. It
only becomes visible when you have every line for a year in one place and go looking for
transaction shapes that no rule covers.</p>

<p>I am not going to detail the mechanism, because it is a live operational matter for
the business. The transferable part is the method, and it is this: <strong>auditing the
controls you have will never find the thing you have no control for.</strong> You have
to enumerate transaction types from the data itself and then ask which of them anything
is actually watching. The gap is the finding.</p>

<h2>Shipping a finding, not a report</h2>

<p>The thing I would do differently in every previous analysis I have written: do not
stop at the number.</p>

<p>A document saying "approximately this much is leaking through this mechanism" is
read, agreed with, and filed. Nothing changes, because nobody was given anything to
run.</p>

<p>So the deliverable was three things:</p>

<ol>
  <li>the quantified finding, with the method written out so it can be challenged</li>
  <li>a monitoring specification — what to watch, at what threshold, and who sees it</li>
  <li>a runnable control script implementing that specification against live data</li>
</ol>

<p>The third item is what makes the first two matter. An audit that ends in a PDF
describes a problem once. An audit that ends in a script that runs every week is a
control, and the next instance gets caught in days rather than in next year's audit.</p>

<h2>The general version</h2>

<p>Stage your pipeline and keep every stage on disk. Canonicalise before you aggregate,
or your aggregates lie quietly. State your negative results — proving the controls work
is a finding. And finish by handing over something that runs, not something that is
read.</p>
`,
  },
];

if (typeof module !== 'undefined') module.exports = POSTS;
