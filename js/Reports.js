document.addEventListener('DOMContentLoaded', () => {
  const dateButton = document.getElementById('reportDate');
  dateButton?.addEventListener('click', () => {
    dateButton.classList.toggle('is-selected');
    dateButton.setAttribute('aria-pressed', dateButton.classList.contains('is-selected'));
  });

  document.getElementById('exportReport')?.addEventListener('click', () => {
    const rows = [
      ['Metric', 'Value', 'Details'],
      ['Total Leads', '128', '14.2% vs. previous 30 days'],
      ['Contacted', '86', '67.2% contact outreach'],
      ['Follow-ups', '42', 'Active tasks assigned to staff'],
      ['Converted', '18', '14.1% membership rate'],
      ['Lost Leads', '14', '10.9% unqualified / lost'],
      [],
      ['Lead Source', 'Leads', 'Converted', 'Conversion Rate'],
      ['Walk-in', '32', '8', '25.0%'],
      ['Phone', '28', '4', '14.3%'],
      ['WhatsApp', '26', '3', '11.5%'],
      ['Website', '18', '2', '11.1%'],
      ['Social Media', '16', '1', '6.3%'],
      ['Referral', '8', '2', '25.0%']
    ];
    const csv = rows.map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const file = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = 'gym-lead-report.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  });
});
