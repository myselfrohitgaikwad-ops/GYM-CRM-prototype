document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();


  const modal = document.getElementById('addLeadModal');
  const openButtons = [document.getElementById('openAddLeadModal')].filter(Boolean);
  const closeButtons = [document.getElementById('closeLeadModal'), document.getElementById('cancelLeadModal')].filter(Boolean);
  const openModal = () => modal?.classList.add('open');
  const closeModal = () => modal?.classList.remove('open');
  openButtons.forEach(button => button.addEventListener('click', openModal));
  closeButtons.forEach(button => button.addEventListener('click', closeModal));
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });

  const search = document.getElementById('leadSearch');
  const filters = ['statusFilter', 'intentFilter', 'sourceFilter'].map(id => document.getElementById(id));
  const rows = [...document.querySelectorAll('#leadsTableBody tr')];
  const noResults = document.getElementById('noResults');
  const visibleCount = document.getElementById('visibleCount');
  const applyFilters = () => {
    const query = (search?.value || '').trim().toLowerCase();
    let shown = 0;
    rows.forEach(row => {
      const matchQuery = !query || row.textContent.toLowerCase().includes(query);
      const matchFilters = filters.every(select => !select?.value || row.dataset[select.id.replace('Filter', '').toLowerCase()] === select.value);
      row.hidden = !(matchQuery && matchFilters);
      if (!row.hidden) shown++;
    });
    if (noResults) noResults.hidden = shown > 0;
    if (visibleCount) visibleCount.textContent = shown ? `1-${Math.min(shown, 10)}` : '0';
  };
  const savedListState = (() => {
    try { return JSON.parse(sessionStorage.getItem('gymLeadCrm.leads.returnState') || 'null'); }
    catch (error) { return null; }
  })();
  if (savedListState) {
    if (search) search.value = savedListState.search || '';
    filters.forEach(select => { if (select) select.value = savedListState.filters?.[select.id] || ''; });
    const sort = document.getElementById('sortLeads');
    if (sort && savedListState.sort) sort.value = savedListState.sort;
    applyFilters();
    sessionStorage.removeItem('gymLeadCrm.leads.returnState');
    requestAnimationFrame(() => window.scrollTo(0, Number(savedListState.scrollY) || 0));
  }
  search?.addEventListener('input', applyFilters);
  filters.forEach(select => select?.addEventListener('change', applyFilters));
  document.getElementById('clearFilters')?.addEventListener('click', () => {
    if (search) search.value = '';
    filters.forEach(select => { if (select) select.value = ''; });
    applyFilters();
  });
  document.getElementById('dateFilter')?.addEventListener('click', event => {
    event.currentTarget.classList.toggle('selected');
    event.currentTarget.setAttribute('aria-pressed', event.currentTarget.classList.contains('selected'));
  });
  document.getElementById('sortLeads')?.addEventListener('change', event => {
    const tbody = document.getElementById('leadsTableBody');
    if (event.target.value === 'name') rows.sort((a, b) => a.cells[0].textContent.localeCompare(b.cells[0].textContent));
    else rows.sort((a, b) => Number(a.dataset.originalOrder || rows.indexOf(a)) - Number(b.dataset.originalOrder || rows.indexOf(b)));
    rows.forEach((row, index) => { row.dataset.originalOrder = index; tbody.append(row); });
  });

  function openLeadProfile(row) {
    if (!row) return;
    const cells = [...row.cells];
    const lead = {
      id: row.dataset.leadId,
      name: row.querySelector('.lead-info b')?.textContent.trim() || 'Lead',
      subtitle: row.querySelector('.lead-info small')?.textContent.trim() || '',
      initials: row.querySelector('.lead-avatar')?.textContent.trim() || '--',
      phone: cells[1]?.textContent.trim() || '',
      status: row.querySelector('.status-tag')?.textContent.replace(/[•♨]/g, '').trim() || row.dataset.status || '',
      intent: row.dataset.intent || '',
      source: row.dataset.source || '',
      lastContact: cells[5]?.innerText.replace(/\s+/g, ' ').trim() || '',
      nextFollowup: cells[6]?.innerText.replace(/\s+/g, ' ').trim() || ''
    };
    try {
      sessionStorage.setItem('gymLeadCrm.selectedLead', JSON.stringify(lead));
      sessionStorage.setItem('gymLeadCrm.leads.returnState', JSON.stringify({
        search: search?.value || '',
        filters: Object.fromEntries(filters.filter(Boolean).map(select => [select.id, select.value])),
        sort: document.getElementById('sortLeads')?.value || 'recent',
        scrollY: window.scrollY
      }));
    } catch (error) {
      // Navigation can continue with the selected lead ID even if session storage is unavailable.
    }
    window.location.href = `./profile.html?id=${encodeURIComponent(lead.id)}`;
  }

  const leadTableBody = document.getElementById('leadsTableBody');
  leadTableBody?.querySelectorAll('tr').forEach(row => {
    row.tabIndex = 0;
    row.setAttribute('role', 'link');
    row.setAttribute('aria-label', `Open ${row.querySelector('.lead-info b')?.textContent.trim() || 'lead'} profile`);
  });
  leadTableBody?.addEventListener('click', event => {
    if (event.target.closest('.table-call')) return;
    const row = event.target.closest('tr');
    if (row && (event.target.closest('.view-lead') || !event.target.closest('button'))) openLeadProfile(row);
  });
  leadTableBody?.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('tr[role="link"]')) {
      event.preventDefault();
      openLeadProfile(event.target);
    }
  });

  document.getElementById('exportLeads')?.addEventListener('click', () => {
    const data = [['Lead','Contact','Status','Intent','Source','Last contact','Next follow-up']];
    rows.filter(row => !row.hidden).forEach(row => data.push([...row.cells].slice(0, 7).map(cell => cell.innerText.replace(/\s+/g, ' ').trim())));
    const csv = data.map(line => line.map(value => `"${value.replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = 'gym-leads.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  document.getElementById('leadModalForm')?.addEventListener('submit', event => {
    event.preventDefault();
    alert('Lead added successfully!');
    event.currentTarget.reset();
    closeModal();
  });
  document.querySelectorAll('.table-call').forEach(button => button.addEventListener('click', () => {
    const lead = button.closest('tr')?.querySelector('.lead-info b')?.textContent || 'lead';
    alert(`Initiating ${button.textContent.trim()} with ${lead}`);
  }));
  window.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      document.getElementById('globalSearchInput')?.focus();
    }
    if (event.key === 'Escape') closeModal();
  });
  document.querySelector('.btn-logout')?.addEventListener('click', () => { window.location.href = '../Login/index.html'; });
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

