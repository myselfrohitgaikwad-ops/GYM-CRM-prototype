document.addEventListener('DOMContentLoaded', () => {
  // Robust Mobile Navigation Controller
  initMobileNavigation();

  // Follow-up Tabs Filtering
  const tabButtons = document.querySelectorAll('.tab-btn');
  const followupItems = document.querySelectorAll('.timeline-row-item');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tabType = btn.getAttribute('data-tab');

      // Visual response for tab change
      followupItems.forEach(item => {
        item.style.opacity = '0.5';
        setTimeout(() => {
          item.style.opacity = '1';
        }, 150);
      });
      console.log(`Switched to tab: ${tabType}`);
    });
  });

  // Task Completion Action
  const completeButtons = document.querySelectorAll('.btn-complete-task');
  completeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.timeline-row-item');
      btn.textContent = 'Completed ✓';
      btn.style.backgroundColor = '#dcfce7';
      btn.style.borderColor = '#86efac';
      btn.style.color = '#15803d';
      btn.disabled = true;
      row.style.opacity = '0.6';
    });
  });

  // Call & Follow-up Actions in Table
  const tableActionButtons = document.querySelectorAll('.btn-table-action');
  tableActionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('tr');
      const leadName = row.querySelector('.lead-name').textContent;
      const actionName = btn.textContent.trim();
      console.log(`Action triggered: [${actionName}] for lead: ${leadName}`);
      alert(`Initiating ${actionName} with ${leadName}`);
    });
  });

  // Quick Action Modal Logic
  const openModalBtn = document.getElementById('openAddLeadModal');
  const quickAddBtn = document.getElementById('quickAddLead');
  const modalBackdrop = document.getElementById('addLeadModal');
  const closeModalBtn = document.getElementById('closeLeadModal');
  const cancelModalBtn = document.getElementById('cancelLeadModal');
  const leadModalForm = document.getElementById('leadModalForm');

  function openModal() {
    if (modalBackdrop) modalBackdrop.classList.add('open');
  }

  function closeModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('open');
  }

  if (openModalBtn) openModalBtn.addEventListener('click', openModal);
  if (quickAddBtn) quickAddBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  if (leadModalForm) {
    leadModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Lead added successfully!');
      leadModalForm.reset();
      closeModal();
    });
  }

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const search = document.getElementById('globalSearchInput');
      if (search) search.focus();
    }
  });

  // Logout handling
  const logoutBtn = document.querySelector('.btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.location.href = '../Login/index.html';
    });
  }
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

