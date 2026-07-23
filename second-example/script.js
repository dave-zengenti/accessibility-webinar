document.addEventListener('DOMContentLoaded', () => {
  // Tabs with full ARIA markup but NO roving tabindex and NO arrow-key handling
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  function switchTab(targetBtn) {
    const targetTab = targetBtn.dataset.tab;

    tabBtns.forEach(btn => {
      const isActive = btn === targetBtn;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    tabPanels.forEach(panel => {
      const isActive = panel.id === `panel-${targetTab}`;
      panel.classList.toggle('active', isActive);
      panel.hidden = !isActive;
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn));
  });

  const initialActiveTab = document.querySelector('.tab-btn.active');
  if (initialActiveTab) switchTab(initialActiveTab);

  // Report form + confirmation dialog with NO focus management
  const form = document.getElementById('report-form');
  const dialog = document.getElementById('confirmation');
  const backdrop = document.querySelector('.dialog-backdrop');
  const closeBtn = dialog?.querySelector('.dialog-close');

  function openDialog() {
    if (!dialog) return;
    dialog.hidden = false;
    if (backdrop) backdrop.hidden = false;
    // Intentionally do NOT move focus, do NOT trap focus, do NOT make background inert
  }

  function closeDialog() {
    if (!dialog) return;
    dialog.hidden = true;
    if (backdrop) backdrop.hidden = true;
  }

  form?.addEventListener('submit', e => {
    e.preventDefault();
    openDialog();
  });

  closeBtn?.addEventListener('click', closeDialog);
  backdrop?.addEventListener('click', closeDialog);

  // Search button (no-op)
  const searchBtn = document.querySelector('.search-btn');
  searchBtn?.addEventListener('click', () => {
    // intentionally no accessible behaviour
  });

  // "Select a service" dropdown: MOUSE ONLY by design.
  // Click handlers only, no keydown/keyup, and nothing inside is focusable,
  // so Tab skips the whole control and a keyboard user can never open it.
  const dropdown = document.querySelector('[data-dropdown]');
  if (dropdown) {
    const toggle = dropdown.querySelector('[data-dropdown-toggle]');
    const menu = dropdown.querySelector('[data-dropdown-menu]');
    const value = dropdown.querySelector('.dropdown-value');

    function setOpen(open) {
      menu.hidden = !open;
      dropdown.classList.toggle('open', open);
    }

    toggle.addEventListener('click', () => setOpen(menu.hidden));

    menu.querySelectorAll('.dropdown-option').forEach(option => {
      option.addEventListener('click', () => {
        value.textContent = option.textContent;
        setOpen(false);
      });
    });

    document.addEventListener('click', e => {
      if (!dropdown.contains(e.target)) setOpen(false);
    });
  }

  // Zoom detection, for the reflow demo.
  // Browser zoom shrinks the viewport while the window chrome stays the
  // same size, so outerWidth / innerWidth gives the zoom factor. This is
  // independent of screen size and of display scaling, so it behaves the
  // same on any monitor.
  //
  // Skipped inside an iframe: there innerWidth is the frame's width, so
  // the ratio would measure the frame rather than the zoom level and a
  // narrow embed would be mistaken for a zoomed page.
  const inFrame = window.self !== window.top;

  function trackZoom() {
    if (inFrame || !window.outerWidth) return;
    const factor = window.outerWidth / window.innerWidth;
    document.documentElement.classList.toggle('zoomed', factor >= 1.5);
  }

  trackZoom();
  window.addEventListener('resize', trackZoom);
});
