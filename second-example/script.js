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
});
