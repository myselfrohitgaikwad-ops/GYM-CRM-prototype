document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('settingsForm');
  const status = document.getElementById('autosaveStatus');
  const draftKey = 'gymLeadCrm.settings.draft';
  const savedKey = 'gymLeadCrm.settings.saved';
  const logoPicker = document.getElementById('logoFile');
  const logoPreview = document.getElementById('logoPreview');
  const removeLogo = document.getElementById('removeLogo');
  const originalLogo = logoPreview?.innerHTML || '';

  if (!form) return;

  function readSettings() {
    const values = {};
    form.querySelectorAll('[name]').forEach(control => {
      if (control.type === 'file') return;
      if (control.type === 'checkbox') {
        if (control.name === 'workingDays') {
          values.workingDays ||= [];
          if (control.checked) values.workingDays.push(control.value);
        } else {
          values[control.name] = control.checked;
        }
      } else {
        values[control.name] = control.value;
      }
    });
    return values;
  }

  function applySettings(values) {
    if (!values) return;
    form.querySelectorAll('[name]').forEach(control => {
        if (control.type === 'file' || !(control.name in values)) return;
        if (control.type === 'checkbox') {
          control.checked = control.name === 'workingDays'
          ? (values.workingDays || []).includes(control.value)
          : Boolean(values[control.name]);
      } else {
        control.value = values[control.name];
      }
    });
    updateSwitchStates();
  }

  function updateSwitchStates() {
    form.querySelectorAll('.toggle-switch input').forEach(toggle => {
      toggle.setAttribute('role', 'switch');
      toggle.setAttribute('aria-checked', String(toggle.checked));
      const label = toggle.closest('.notification-row')?.querySelector('.notification-copy b')?.textContent;
      if (label) toggle.setAttribute('aria-label', label);
    });
  }

  function setStatus(message, pending = false) {
    if (!status) return;
    status.classList.toggle('is-pending', pending);
    const text = status.querySelector('span');
    if (text) text.innerHTML = message;
  }

  function storeDraft() {
    const values = readSettings();
    try {
      localStorage.setItem(draftKey, JSON.stringify(values));
    } catch (error) {
      // Keep the controls usable if browser storage is unavailable.
    }
    setStatus('All modifications<br>autosaved');
    updateSwitchStates();
  }

  function saveSettings() {
    const values = readSettings();
    try {
      localStorage.setItem(savedKey, JSON.stringify(values));
      localStorage.removeItem(draftKey);
      setStatus('Preferences<br>saved');
    } catch (error) {
      setStatus('Unable to save<br>in this browser', true);
    }
  }

  function cancelDraft() {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(savedKey) || 'null');
      localStorage.removeItem(draftKey);
    } catch (error) {
      saved = null;
    }
    if (saved) applySettings(saved);
    else form.reset();
    setStatus('All modifications<br>autosaved');
  }

  try {
    const saved = JSON.parse(localStorage.getItem(savedKey) || 'null');
    const draft = JSON.parse(localStorage.getItem(draftKey) || 'null');
    applySettings(draft || saved);
  } catch (error) {
    // The screenshot defaults remain in place when storage cannot be read.
  }
  updateSwitchStates();

  form.addEventListener('input', storeDraft);
  form.addEventListener('change', storeDraft);
  document.querySelectorAll('[data-save-settings]').forEach(button => button.addEventListener('click', saveSettings));
  document.getElementById('cancelSettings')?.addEventListener('click', cancelDraft);

  logoPicker?.addEventListener('change', () => {
    const file = logoPicker.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      window.alert('Choose a logo smaller than 2 MB.');
      logoPicker.value = '';
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (!logoPreview || typeof reader.result !== 'string') return;
      logoPreview.innerHTML = `<img src="${reader.result}" alt="Selected gym logo"><i>✓</i>`;
    });
    reader.readAsDataURL(file);
  });
    if (logoPreview) logoPreview.innerHTML = originalLogo;
    if (logoPicker) logoPicker.value = '';
  });

  initMobileNavigation();
});

function initMobileNavigation() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('mobileMenuToggle');
  if (!sidebar || sidebar.dataset.mobileNavInitialized) return;
  sidebar.dataset.mobileNavInitialized = 'true';

  let backdrop = document.querySelector('.sidebar-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);
  }

  let closeBtn = sidebar.querySelector('.sidebar-close-btn');
  if (!closeBtn) {
    const sidebarHeader = sidebar.querySelector('.sidebar-header');
    if (sidebarHeader) {
      closeBtn = document.createElement('button');
      closeBtn.className = 'sidebar-close-btn';
      closeBtn.setAttribute('aria-label', 'Close menu');
      closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      sidebarHeader.appendChild(closeBtn);
    }
  }

  function openSidebar() {
    sidebar.classList.add('mobile-open');
    backdrop.classList.add('active');
    document.body.classList.add('sidebar-drawer-open');
  }

  function closeSidebar() {
    sidebar.classList.remove('mobile-open');
    backdrop.classList.remove('active');
    document.body.classList.remove('sidebar-drawer-open');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (sidebar.classList.contains('mobile-open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSidebar();
    });
  }

  backdrop.addEventListener('click', closeSidebar);

  sidebar.querySelectorAll('.nav-link, .btn-sidebar-add').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        closeSidebar();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
      closeSidebar();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992 && sidebar.classList.contains('mobile-open')) {
      closeSidebar();
    }
  });
}

