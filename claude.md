# Accessibility demo: Northcombe District Council (two builds)

## What this is

Two builds of the SAME council website, used in a live accessibility webinar to show the
gap between automated scanning (the product, Insytful) and manual testing (the service).

- `./first-example` (DEMO 1): the raw site. FAILS an automated scan.
- `./second-example` (DEMO 2): the same site "remediated". PASSES an automated scan with
  a perfect score, yet fails badly under manual testing.

**The accessibility failures are the deliverable, not bugs.**

This file describes what is ACTUALLY BUILT, not the original brief. It has been revised
as the demo evolved. If you change the demos, update this file to match.

## Prime directive

- NEVER "improve" accessibility. Do not add `alt`, `<label>`, `aria-*`, `lang`, focus
  styles or keyboard handlers unless a change explicitly asks for it.
- Before finishing ANY task, re-verify every failure below still exists. Never silently
  remediate. If a change would remove one, say so and ask.
- Instance counts below are deliberate. Several failures appear more than once on purpose
  (see DEMO 1 contrast, alt and empty links). Do not "tidy" them down to one each.
- DEMO 2 must keep scoring 100 in an automated scan. Any new focusable element needs an
  accessible name, or the score breaks.

## Tech

Plain static HTML, CSS and vanilla JS. No framework, no build step. Each demo has
`index.html`, `report.html`, `styles.css`, `script.js`. Runs from any static server.
Deployed via GitHub Pages from `main`.

## Shared design (both demos)

The two builds must look **identical at 100% zoom at any window width**. Layout is fluid:
container padding `clamp(20px, 5vw, 72px)`, `auto-fit` grids for cards and news,
icon-above-title cards, squarish corners and light shadows for a govtech feel.

Insytful renders the page in an iframe (roughly 640 to 700px) beside its issues panel,
so both builds must also look good at that width.

Home page sections: header (linked logo lockup, nav, magnifier search button), hero,
three action cards (Report it / Select a service / Find your bin day), "Popular services"
tabs, "Latest news", dark teal footer. `report.html` has the "Report a problem" form and a
confirmation dialog. Palette: teal `#0F5C6B`, dark teal `#0A4651`, headings `#1A1A1A`.

The middle action card is a **custom "Select a service" dropdown** in BOTH builds: plain
`div`/`ul`/`li`, no `tabindex`, no ARIA roles, click-only handlers. It is mouse-only by
design and Tab skips it entirely. It carries no ARIA, so no scanner sees anything wrong.

---

## DEMO 1: first-example (must FAIL a scan)

Six categories, matching the "96% of errors" talking point:

1. **Missing document language.** `<html>` with no `lang`, both pages.
2. **Low contrast**, deliberately graded to show that severity matters:
   - hero intro `#9AA0A6` on white, about **2.64:1**. Borderline, only some people lose it.
   - footer fine print `#125A67` on the footer's `#0A4651`, about **1.34:1**. Close to
     invisible for nearly everyone. Sits directly under footer column links at 8.2:1 for
     an immediate side-by-side. Reports as 6 nodes (two `<p>` plus four `<a>`).
3. **Missing alt.** All three news thumbnails have no `alt`.
4. **Empty links.** The logo lockup `<a href="index.html"><img src="logo.svg" alt="">`
   (empty alt is decorative, so the link has no accessible name), plus the four footer
   social icon links, which have no `aria-label`.
5. **Empty button.** Header search `<button>`: magnifier icon only, no text, no `aria-label`.
6. **Missing form labels**, three instances:
   - `index.html` postcode: a visible `<label class="postcode-label">` with **no `for`**,
     and no placeholder on the input, so the label is not associated.
   - `report.html` email: no label, no `aria-label`, no placeholder.
   - `report.html` problem type `<select>`: no label and no `aria-label`.

**Passing on purpose in DEMO 1** (do not break these, they keep the failures legible):
footer column links 8.2:1, card and news body text `#666` at 5.7:1, the bin-day "Search"
button has visible text, the dialog close button has `aria-label="Close"`, the file input
has an associated label, and name/postcode/description use placeholder-as-label (which
passes the automated label check on purpose).

**Also in DEMO 1, not scanner-visible:** one clear focus ring everywhere
(`:focus-visible { outline: 3px solid #1A1A1A }`, no faint or missing variants), three
generic "Read more" links, the mouse-only dropdown, and a confirmation dialog that DOES
manage focus properly (moves focus in, traps it, restores it). DEMO 1 is deliberately the
better build for keyboard users.

---

## DEMO 2: second-example (must PASS a scan, fail manual)

### Automated flags cleared

`lang="en"` both pages; search button `aria-label="Search"`; hero intro `#767676`
(4.54:1); footer fine print `#A8C2C8` (5.59:1); all three news images have `alt` (all of
it useless, see below); logo `alt="logo"`; all four social links have `aria-label`;
postcode label associated via `for`; email `placeholder="Email"`; problem type select
`aria-label="Problem type"`.

### Manual failures: keyboard focus

The tab order tells a story. Do not reorder it.

| Tab | Element | Focus treatment |
|-----|---------|-----------------|
| 1 to 3 | logo, Home, Services | good ring, 3px `#1A1A1A` |
| 4 | News nav link | `.focus-faint`, 1px `#EDF0F1`, about 1.1:1 |
| 5 | Contact nav link | `.focus-none`, nothing |
| 6 | header search button | `.focus-none`, nothing (keeps its `aria-label`) |
| 7, 8 | two `.utility-links` | focusable but INVISIBLE, nothing on screen at all |
| 9 | "Report a problem" | good ring |
| -- | "Select a service" dropdown | **SKIPPED, not focusable** |
| 10, 11 | postcode input, "Search" | good ring |

- The `.utility-links` are real links with real text, clipped to a 1x1 box that never
  reveals on focus. They are **not** `aria-hidden`: focusable content inside `aria-hidden`
  is `aria-hidden-focus`, one of the few things a scanner would catch.
- **Stops 9, 10 and 11 are protected.** They bracket the dropdown and are what proves it
  is skipped. Never insert a focusable element between "Report a problem" and the
  postcode input, and never remove their focus rings.

### Manual failures: everything else

- **Dropdown**: mouse-only, as described under Shared design. This is the centrepiece.
- **Tabs**: full valid ARIA (`role="tablist|tab|tabpanel"`, `aria-selected`,
  `aria-controls`, `aria-labelledby`) so ARIA checks pass, but click-only. Inactive tabs
  get `tabindex="-1"` and there is no arrow-key handling, so a keyboard user can never
  switch tab.
- **Dialog**: `role="dialog"` plus an accessible name, but on open focus is not moved in,
  there is no trap and the background is not inert. Close button keeps `aria-label="Close"`.
- **Vague and useless text alternatives**: `alt="logo"` (does not convey destination), and
  all three news images `alt="image"`. Every image has alt, so the scan is clean, but none
  of it tells a screen reader user anything.
- **Placeholder-as-label** on the report form.
- **Three identical "Read more" links**: pass the link-name check, fail link purpose.
- **Reflow collapse at 200% zoom**, below.

### Zoom breakage (DEMO 2 only)

`script.js` measures **actual browser zoom**, not viewport width: zoom shrinks the
viewport while the window chrome stays put, so `outerWidth / innerWidth` gives the factor.
At 1.5 and above it puts `.zoomed` on `<html>`. Detection is skipped inside an iframe,
where that ratio would measure the frame instead.

This matters: because it keys off zoom rather than width, DEMO 2 is identical to DEMO 1
at 100% on any monitor and inside the Insytful frame. Earlier versions inferred zoom from
width and broke on wide screens and in the embed. **Do not go back to width-based rules.**

When `.zoomed` applies: `body` gets `min-width: 1500px` (horizontal scrollbar), the hero
becomes a short fixed box with a narrow panel and a 64px heading at `line-height: 0.55`
and `letter-spacing: -5px` (lines and letters overlap), every section gets a large
negative `margin-top` so bands pile onto each other, cards become fixed width with
`-130px` margins so they stack, and card paragraphs are clipped at a fixed height.

Nothing here is scanner-visible: no rule covers reflow or text spacing.

---

## The only intended differences between the two stylesheets

`diff first-example/styles.css second-example/styles.css` should show these and nothing
else. Anything else is drift.

1. `.hero-intro` colour (`#9AA0A6` vs `#767676`).
2. `.footer-fine` colour (`#125A67` vs `#A8C2C8`).
3. Focus scheme: DEMO 1 has one good ring; DEMO 2 adds `.focus-faint` and `.focus-none`.
4. `.utility-links` block, DEMO 2 only.
5. `.zoomed` block, DEMO 2 only.
6. `.help-card h3` vs `.help-card h2`, matching each build's own `report.html` markup.

---

## Verification

After any change, confirm and report:

- DEMO 1: all six categories still fire, with the instance counts above.
- DEMO 2: scan is clean (no missing `lang`, alt, accessible names or duplicate IDs, and
  no text under 4.5:1), and every manual failure above is still present.
- Both builds still look identical at 100% at 1280px and at a wide width such as 1920px.
- DEMO 2 still collapses when `.zoomed` is applied.

Quickest check is to serve the repo root and read computed styles in the browser. To test
the zoomed state without a real browser zoom, override `innerWidth`/`outerWidth` to a 2:1
ratio and dispatch a `resize` event, which exercises the real detection path.

## Gotchas

- **Caching.** Browsers hold on to `styles.css` and `script.js` hard, and GitHub Pages
  caches too. Hard-refresh, or serve from a fresh port, before concluding a change failed.
- **Never `aria-hidden` anything focusable.** That is a real scanner failure and would
  cost DEMO 2 its perfect score.
- **Presenting:** zoom with Ctrl or Cmd and `+`. Trackpad pinch-zoom does not change
  `outerWidth`/`innerWidth`, so it will not trigger the breakage.
- Focusing the invisible `.utility-links` nudges the page toward the top, since browsers
  scroll focused elements into view.
