# Accessibility demo — Northcombe District Council (two builds)

## What this is

This repo contains two intentionally-different builds of the SAME council website,
used in a live accessibility training webinar to demonstrate the gap between automated
scanning (the product, Insytful) and manual testing (the service).

- `./first-example` — the "raw" site. Must FAIL an automated scan on the six errors below.
- `./second-example` — the same site after remediation. Must PASS an automated scan, yet still
  FAIL manual testing.

The accessibility failures are the deliverable, not bugs.

## Prime directive (read before every task)

- NEVER add, restore, or "improve" accessibility beyond what each spec below states.
  Do not add `alt`, `<label>`, `aria-*`, `lang`, focus styles, or keyboard handlers
  except exactly where a spec line says to.
- The failures must be reproduced EXACTLY and ONE CLEAN INSTANCE of each — do not let
  a pattern (e.g. muted body text, icon-only controls) leak extra instances elsewhere.
- On ANY later/refinement task, re-read this file and re-verify every listed failure
  still exists before you finish. Never silently remediate.
- After building each demo, output a checklist (see Acceptance) confirming state.

## Tech

Plain static HTML + CSS + minimal vanilla JS. No framework, no build step. Each demo:
`index.html` (home), `report.html` (form page), `styles.css`, `script.js`.
Must run from a simple static server / `file://`. This keeps failures stable and
hand-verifiable. Implement the Pencil design in this repo if present; otherwise build
to the layout summary at the bottom.

---

## ./first-example — RAW (must fail on all six)

One clean instance of each:

1. **Missing document language** — `<html>` with NO `lang` attribute, both pages.
2. **Low contrast text** — the hero intro paragraph only, colour `#9AA0A6` on white
   (~2.6:1). This is the ONLY failing-contrast text: render news-card summaries and
   footer fine-print at a PASSING colour so they don't add duplicate instances.
3. **Missing alt** — the FIRST news-card thumbnail `<img>` has no `alt` attribute.
   Every other content image gets proper `alt`.
4. **Empty link** — the header logo is a single linked image lockup (crest + wordmark
   baked into ONE image): `<a href="index.html"><img src="logo.svg" alt=""></a>`.
   Empty `alt` = decorative (so this is NOT a missing-alt flag), and the link has no
   other content → the link has no accessible name → empty link.
5. **Empty button** — the header search control is a `<button>` containing only the
   magnifier icon, no text, no `aria-label`.
6. **Missing form label** — on `report.html`, the EMAIL input has no `<label>`, no
   `aria-label`, and no `placeholder` → no accessible name.

Everything else in first-example must be correct so the six stay isolated: the bin-card
"Search" button has visible text; footer social icons have `aria-label`s; the dialog
`×` button has `aria-label="Close"`; all other form fields use placeholder-as-label and
DO have placeholders (they pass the automated label check on purpose).

## ./second-example — REMEDIATED (must pass automated, fail manual)

Start from the first-example site, then:

### A. Clean fixes (clear all six automated flags)

- `<html lang="en">` on both pages.
- Header search button: add `aria-label="Search"`.
- Hero intro paragraph: darken to `#767676` (~4.54:1, passes AA).

### B. Remediations done badly (pass automated, fail a human)

- News thumbnail: add `alt="image"` — has alt (passes), useless to a screen reader.
- Logo image: `alt="logo"` — link now has a name so empty-link clears, but the name
  doesn't convey destination → fails link purpose (2.4.4); SR reads "logo, link".
- Email field: add `placeholder="Email"` only, still NO `<label>` — now has an
  accessible name via placeholder (passes automated), but placeholder-as-label fails
  manual. Rest of form stays placeholder-as-label.

### C. New manual-only failures (automated cannot see these)

- **No visible focus** — global `*:focus { outline: none; }` with no replacement focus
  style. (2.4.7)
- **Tabs with no roving tabindex** — "Popular services" uses FULL, valid ARIA tab
  markup (`role="tablist|tab|tabpanel"`, `aria-selected`, `aria-controls`,
  `aria-labelledby`) so automated ARIA checks pass — BUT implement NO roving tabindex
  and NO arrow-key handling; switching is click-only. Keyboard users can't drive it.
- **Dialog with no focus management** — the "report sent" confirmation has
  `role="dialog"` + an accessible name (so automated passes), but on open: focus stays
  on the trigger, focus is NOT moved into the dialog, there is NO focus trap, and the
  background is NOT inert. `×` keeps `aria-label="Close"`. (2.4.3 / focus management)
- **"Read more" links** — three identical "Read more" links: pass the empty-link check
  (they have text) but fail link purpose in context (2.4.4 / 2.4.9). Leave as-is.

---

## Acceptance — output after each build

- first-example: confirm each of the six is present, one instance, isolated.
- second-example: confirm each of the six automated flags is CLEARED, and each manual failure
  in B + C is PRESENT.
- Flag any place a failure leaked beyond its single intended instance.

## Layout summary (if no Pencil source present)

Desktop only, 1440px. Header (linked image logo lockup left; magnifier search button +
nav right). Hero (heading "Council services, all in one place" + muted intro + faint
high-street bg). Three action cards: Report it / Pay / Find your bin day (bin card has
inline postcode field + "Search"). "Popular services" tabbed panel (Housing / Planning
/ Roads & parking). "Latest news" three cards (thumbnail + headline + summary + "Read
more"). Dark-teal footer (social icon links, link columns, fine print). Cookie banner
on load. report.html: "Report a problem" form (full name, email, postcode, type
dropdown, description, file upload, "Send report"), placeholder-as-label, confirmation
dialog with `×` close. Palette: teal #0F5C6B, amber #E8A33D, headings #1A1A1A.
