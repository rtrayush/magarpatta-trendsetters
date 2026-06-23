let ALL_MEMBERS = [];

function daysUntilNextBirthday(dobMMDD) {
  const [m, d] = dobMMDD.split('-').map(Number);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let next = new Date(today.getFullYear(), m - 1, d);
  if (next < today) next = new Date(today.getFullYear() + 1, m - 1, d);
  return { days: Math.round((next - today) / 86400000), date: next };
}

function isBirthdayToday(dobMMDD) {
  const today = new Date();
  const todayMMDD = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return dobMMDD === todayMMDD;
}

function renderBirthdayStrip(members) {
  const strip = document.getElementById('birthdayStrip');
  if (!strip) return;
  const upcoming = members
    .map(m => ({ ...m, ...daysUntilNextBirthday(m.dob) }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 8);

  if (!upcoming.length) {
    strip.innerHTML = '<p>No birthdays on file yet.</p>';
    return;
  }

  strip.innerHTML = upcoming.map(m => {
    const label = m.days === 0 ? 'Today \ud83c\udf89' : m.days === 1 ? 'Tomorrow' : `In ${m.days} days`;
    const dateStr = m.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    return `
      <div class="birthday-pill">
        <span class="dot">\ud83c\udf82</span>
        <span class="meta"><strong>${m.name}</strong><span>${dateStr} &middot; ${label}</span></span>
      </div>`;
  }).join('');
}

function renderMembers(members) {
  const grid = document.getElementById('memberGrid');
  if (!grid) return;
  if (!members.length) {
    grid.innerHTML = '<div class="empty-state">No members match that search just yet.</div>';
    return;
  }
  grid.innerHTML = members.map(m => `
    <div class="badge-card reveal in">
      ${isBirthdayToday(m.dob) ? '<span class="birthday-flag">\ud83c\udf82 Birthday!</span>' : ''}
      <div class="badge-photo">${m.initials}</div>
      <h3>${m.name}</h3>
      <span class="badge-role">${m.role}</span>
      <p class="badge-bio">${m.bio}</p>
      <div class="badge-since">Member since ${m.since}</div>
    </div>
  `).join('');
}

function populateRoleFilter(members) {
  const select = document.getElementById('roleFilter');
  if (!select) return;
  const roles = [...new Set(members.map(m => m.role))].sort();
  select.innerHTML = '<option value="">All roles</option>' + roles.map(r => `<option value="${r}">${r}</option>`).join('');
}

function applyMemberFilters() {
  const q = (document.getElementById('memberSearch')?.value || '').toLowerCase();
  const role = document.getElementById('roleFilter')?.value || '';
  const filtered = ALL_MEMBERS.filter(m =>
    (!role || m.role === role) &&
    (m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q))
  );
  renderMembers(filtered);
}

async function initMembersPage() {
  const grid = document.getElementById('memberGrid');
  const strip = document.getElementById('birthdayStrip');
  if (!grid && !strip) return;
  try {
    const res = await fetch('data/members.json');
    ALL_MEMBERS = await res.json();
    renderMembers(ALL_MEMBERS);
    renderBirthdayStrip(ALL_MEMBERS);
    populateRoleFilter(ALL_MEMBERS);
    document.getElementById('memberSearch')?.addEventListener('input', applyMemberFilters);
    document.getElementById('roleFilter')?.addEventListener('change', applyMemberFilters);
  } catch (e) {
    console.error('Could not load members.json', e);
    if (grid) grid.innerHTML = '<div class="empty-state">Couldn\'t load member data.</div>';
  }
}

document.addEventListener('partialsLoaded', initMembersPage);
