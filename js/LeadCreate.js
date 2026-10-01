document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('createLeadForm');
  const sourceSelect = form?.elements.namedItem('source');
  const message = document.getElementById('createFormMessage');

  document.querySelectorAll('.source-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (sourceSelect) sourceSelect.value = chip.dataset.source;
      document.querySelectorAll('.source-chip').forEach(item => item.classList.toggle('selected', item === chip));
    });
  });
  sourceSelect?.addEventListener('change', () => {
    document.querySelectorAll('.source-chip').forEach(chip => chip.classList.toggle('selected', chip.dataset.source === sourceSelect.value));
  });

  document.querySelectorAll('.goal-option input').forEach(input => {
    input.addEventListener('change', () => {
      document.querySelectorAll('.goal-option').forEach(option => option.classList.toggle('selected', option.querySelector('input')?.checked));
    });
  });
  document.querySelectorAll('.priority-options input').forEach(input => {
    input.addEventListener('change', () => {
      document.querySelectorAll('.priority-options label').forEach(option => option.classList.toggle('selected', option.querySelector('input')?.checked));
    });
  });

  // Conversation history tabs channel filter
  document.querySelectorAll('.conversation-tabs [data-channel]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.conversation-tabs [data-channel]').forEach(item => {
        const active = item === tab;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
      });
      const channel = tab.getAttribute('data-channel');
      document.querySelectorAll('#conversationFeed .conversation-item').forEach(item => {
        if (channel === 'all' || item.getAttribute('data-channel') === channel) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (message) message.textContent = 'Lead added successfully!';
    window.alert('Lead added successfully!');
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

