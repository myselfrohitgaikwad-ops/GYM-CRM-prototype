document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();


  const scheduleModal = document.getElementById('scheduleModal');
  const leadModal = document.getElementById('addLeadModal');
  const openSchedule = () => scheduleModal?.classList.add('open');
  const closeSchedule = () => scheduleModal?.classList.remove('open');
  const openLead = () => leadModal?.classList.add('open');
  const closeLead = () => leadModal?.classList.remove('open');
  document.getElementById('scheduleFollowup')?.addEventListener('click', openSchedule);
  const scheduleParams = new URLSearchParams(window.location.search);
  const preselectedLead = scheduleParams.get('scheduleLead');
  if (preselectedLead && scheduleModal) {
    const leadField = document.getElementById('scheduleLead');
    if (leadField) leadField.value = preselectedLead;
    openSchedule();
  }
  document.getElementById('closeScheduleModal')?.addEventListener('click', closeSchedule);
  document.getElementById('cancelSchedule')?.addEventListener('click', closeSchedule);
  scheduleModal?.addEventListener('click', event => { if (event.target === scheduleModal) closeSchedule(); });
  document.getElementById('openAddLeadModal')?.addEventListener('click', openLead);
  document.getElementById('closeLeadModal')?.addEventListener('click', closeLead);
  document.getElementById('cancelLeadModal')?.addEventListener('click', closeLead);
  leadModal?.addEventListener('click', event => { if (event.target === leadModal) closeLead(); });

  const rows = [...document.querySelectorAll('#followTableBody tr')];
  const search = document.getElementById('followSearch');
  const filterControls = ['followStatus', 'followChannel', 'followPriority'].map(id => document.getElementById(id));
  const noResults = document.getElementById('noFollowResults');
  const count = document.getElementById('followCount');
  function filterRows() {
    const query = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    rows.forEach(row => {
      const fieldsMatch = filterControls.every(select => {
        if (!select?.value) return true;
        const key = select.id === 'followStatus' ? 'status' : select.id === 'followChannel' ? 'channel' : 'priority';
        return row.dataset[key] === select.value;
      });
      row.hidden = !(fieldsMatch && (!query || row.textContent.toLowerCase().includes(query)));
      if (!row.hidden) visible++;
    });
    if (noResults) noResults.hidden = visible !== 0;
    if (count) count.textContent = visible ? `1–${visible}` : '0';
  }
  search?.addEventListener('input', filterRows);
  document.getElementById('globalSearchInput')?.addEventListener('input', event => {
    if (search) search.value = event.target.value;
    filterRows();
  });
  filterControls.forEach(control => control?.addEventListener('change', filterRows));
  document.getElementById('followAssigned')?.addEventListener('change', filterRows);
  document.getElementById('followDate')?.addEventListener('change', event => {
    document.getElementById('followStatus').value = event.target.value === 'Overdue' ? 'Overdue' : '';
    filterRows();
  });
  document.getElementById('clearFollowFilters')?.addEventListener('click', () => {
    if (search) search.value = '';
    const globalSearch = document.getElementById('globalSearchInput');
    if (globalSearch) globalSearch.value = '';
    document.querySelectorAll('.follow-filter-row select').forEach(select => { select.value = ''; });
    filterRows();
  });
  document.getElementById('queueSort')?.addEventListener('change', event => {
    const body = document.getElementById('followTableBody');
    rows.sort((a, b) => event.target.value === 'name' ? a.cells[0].textContent.localeCompare(b.cells[0].textContent) : Number(a.dataset.order) - Number(b.dataset.order));
    rows.forEach(row => body.append(row));
  });
  rows.forEach((row, index) => { row.dataset.order = index; });

  document.querySelectorAll('.complete-task').forEach(button => button.addEventListener('click', () => {
    button.classList.toggle('done');
    button.textContent = button.classList.contains('done') ? 'Completed ✓' : 'Complete ✓';
  }));
  document.querySelectorAll('.queue-action,.mini-call,.mini-whatsapp').forEach(button => button.addEventListener('click', () => {
    const row = button.closest('tr,.overdue-person');
    const name = row?.querySelector('.follow-lead b,.overdue-person b')?.textContent || 'prospect';
    const action = button.classList.contains('mini-whatsapp') ? 'WhatsApp' : button.textContent.replace(/\s+/g, ' ').trim();
    alert(`Initiating ${action} with ${name}`);
  }));
  document.getElementById('viewCalendar')?.addEventListener('click', () => alert("Today's follow-up schedule is shown on this page."));

  document.getElementById('exportSchedule')?.addEventListener('click', () => {
    const headings = ['Lead', 'Follow-up', 'Channel', 'Assigned to', 'Priority', 'Status'];
    const data = [headings, ...rows.map(row => [...row.cells].slice(0, 6).map(cell => cell.innerText.replace(/\s+/g, ' ').trim()))];
    const csv = data.map(record => record.map(value => `"${value.replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = 'gym-follow-up-schedule.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  });
  document.getElementById('scheduleForm')?.addEventListener('submit', event => {
    event.preventDefault();
    alert('Follow-up scheduled successfully.');
    event.currentTarget.reset();
    closeSchedule();
  });
  document.getElementById('leadModalForm')?.addEventListener('submit', event => {
    event.preventDefault();
    alert('Lead added successfully!');
    event.currentTarget.reset();
    closeLead();
  });
  document.querySelector('.btn-logout')?.addEventListener('click', () => { window.location.href = '../Login/index.html'; });
  window.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      document.getElementById('globalSearchInput')?.focus();
    }
    if (event.key === 'Escape') { closeSchedule(); closeLead(); }
  });
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

