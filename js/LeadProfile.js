document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get('id');
  let lead = null;
  try { lead = JSON.parse(sessionStorage.getItem('gymLeadCrm.selectedLead') || 'null'); }
  catch (error) { lead = null; }
  if (!lead) {
    // Provide a sensible default lead preview so profile page displays directly
    lead = {
      id: requestedId || 'LEAD-101',
      name: 'Rahul Sharma',
      phone: '98021 44521',
      email: 'rahul.sharma@example.com',
      source: 'Walk-in Enquiry',
      status: 'Hot Lead',
      intent: '6-Month Pro Strength',
      assigned: 'Priya Sharma',
      lastContact: 'Today • 10:15 AM',
      nextFollowup: 'Tomorrow • 10:30 AM',
      followupChannel: 'WhatsApp Messaging',
      subtitle: 'Trial workout scheduled. Very motivated by hypertrophy & compound lifting.',
      fitnessGoal: 'Muscle Gain',
      contactMethod: 'WhatsApp Messaging',
      budget: '₹3,500 - ₹4,500',
      joiningDate: '18 Sep 2026'
    };
  }

  const setValue = (key, value) => {
    document.querySelectorAll(`[data-profile="${key}"]`).forEach(element => {
      element.textContent = value || 'Not recorded';
    });
  };
  const name = lead.name || 'Lead';
  const phone = lead.phone || '';
  const phoneDigits = phone.replace(/\D/g, '');
  const profilePhone = phone.startsWith('+') ? phone : `+91 ${phone}`;
  const followupText = lead.nextFollowup && !/not scheduled/i.test(lead.nextFollowup)
    ? lead.nextFollowup
    : 'Not scheduled';
  const status = lead.status || 'Not recorded';

  setValue('id', lead.id);
  setValue('name', name);
  setValue('initials', lead.initials || name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase());
  setValue('phone', profilePhone);
  setValue('email', lead.email || 'Not recorded');
  setValue('source', lead.source);
  setValue('sourceShort', lead.source);
  setValue('status', status);
  setValue('statusShort', status);
  setValue('intent', lead.intent);
  setValue('assigned', lead.assigned || 'Not recorded');
  setValue('lastContact', lead.lastContact);
  setValue('nextAction', followupText);
  setValue('followupTime', followupText);
  setValue('followupDue', followupText === 'Not scheduled' ? 'No due date' : 'Scheduled');
  setValue('followupChannel', lead.followupChannel || 'Contact method not recorded');
  setValue('intentSummary', lead.subtitle || 'No call objective has been recorded for this lead.');
  setValue('fitnessGoal', lead.fitnessGoal || 'Not recorded');
  setValue('contactMethod', lead.contactMethod || 'Not recorded');
  setValue('budget', lead.budget || 'Not recorded');
  setValue('joiningDate', lead.joiningDate || 'Not recorded');
  setValue('sourceShort', lead.source);

  const statusClass = status.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  document.querySelectorAll('.profile-status-badge,.followup-badge,.info-status').forEach(element => element.classList.add(`status-${statusClass}`));
  if (/hot/i.test(status)) document.querySelector('[data-hot-badge]')?.removeAttribute('hidden');
  if (phoneDigits) {
    document.querySelectorAll('[data-profile-link="call"]').forEach(link => link.href = `tel:${phone.replace(/[^+\d]/g, '')}`);
    const whatsappNumber = phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits;
    document.querySelectorAll('[data-profile-link="whatsapp"]').forEach(link => {
      link.href = `https://wa.me/${whatsappNumber}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
  } else {
    document.querySelectorAll('[data-profile-link="call"],[data-profile-link="whatsapp"]').forEach(link => {
      link.setAttribute('aria-disabled', 'true');
      link.addEventListener('click', event => event.preventDefault());
    });
  }
  document.querySelectorAll('[data-profile-link="schedule"]').forEach(link => {
    link.href = `../Follow-ups/index.html?scheduleLead=${encodeURIComponent(name)}&leadId=${encodeURIComponent(lead.id)}`;
  });

  const noteKey = `gymLeadCrm.profile.notes.${lead.id}`;
  const noteList = document.getElementById('noteList');
  function renderNotes() {
    let notes = [];
    try { notes = JSON.parse(localStorage.getItem(noteKey) || '[]'); }
    catch (error) { notes = []; }
    if (!noteList) return;
    noteList.replaceChildren();
    if (!notes.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-record';
      empty.textContent = 'No reception notes have been recorded for this lead.';
      noteList.append(empty);
      return;
    }
    notes.forEach(note => {
      const article = document.createElement('article');
      article.className = 'note-entry';
      const header = document.createElement('div');
      header.className = 'note-entry-head';
      const avatar = document.createElement('span');
      avatar.className = 'note-author';
      avatar.textContent = 'PS';
      const author = document.createElement('span');
      author.textContent = 'Priya Sharma';
      const role = document.createElement('span');
      role.className = 'note-role';
      role.textContent = 'Receptionist';
      const date = document.createElement('small');
      date.textContent = note.date;
      header.append(avatar, author, role, date);
      article.append(header, document.createTextNode(note.text));
      noteList.append(article);
    });
  }
  renderNotes();

  document.getElementById('addNoteForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const field = document.getElementById('leadNoteInput');
    const noteText = field?.value.trim();
    if (!noteText) { field?.focus(); return; }
    try {
      const notes = JSON.parse(localStorage.getItem(noteKey) || '[]');
      notes.push({ text: noteText, date: new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()) });
      localStorage.setItem(noteKey, JSON.stringify(notes));
      field.value = '';
      renderNotes();
    } catch (error) {
      window.alert('This browser could not save the note.');
    }
  });

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
  document.getElementById('activityLogButton')?.addEventListener('click', () => document.querySelector('.activity-empty')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  document.querySelector('[data-profile-action="edit"]')?.addEventListener('click', () => window.alert('Lead editing is not connected in the current project.'));
  document.querySelector('[data-profile-action="complete"]')?.addEventListener('click', () => window.alert('Follow-up completion is not connected in the current project.'));

  initMobileNavigation();

  window.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      document.getElementById('globalSearchInput')?.focus();
    }
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

