document.addEventListener('DOMContentLoaded', () => {
  // Tabs (simple, no ARIA)
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabPanels.forEach(panel => {
        panel.classList.toggle('active', panel.id === `panel-${tab}`);
      });
    });
  });

  // Report form + confirmation dialog with focus management
  const form = document.getElementById('report-form');
  const dialog = document.getElementById('confirmation');
  const backdrop = document.querySelector('.dialog-backdrop');
  const closeBtn = dialog?.querySelector('.dialog-close');
  let lastFocused = null;

  function openDialog() {
    if (!dialog) return;
    lastFocused = document.activeElement;
    dialog.hidden = false;
    if (backdrop) backdrop.hidden = false;
    closeBtn?.focus();
    document.addEventListener('keydown', trapFocus);
  }

  function closeDialog() {
    if (!dialog) return;
    dialog.hidden = true;
    if (backdrop) backdrop.hidden = true;
    document.removeEventListener('keydown', trapFocus);
    if (lastFocused) lastFocused.focus();
  }

  function trapFocus(e) {
    if (e.key !== 'Tab' || !dialog) return;
    const focusable = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  form?.addEventListener('submit', e => {
    e.preventDefault();
    openDialog();
  });

  closeBtn?.addEventListener('click', closeDialog);
  backdrop?.addEventListener('click', closeDialog);

  // Search button (no-op, keeps empty button markup)
  const searchBtn = document.querySelector('.search-btn');
  searchBtn?.addEventListener('click', () => {
    // intentionally no accessible behaviour
  });
});
