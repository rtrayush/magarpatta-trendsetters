let ALL_EVENTS = { past: [], upcoming: [] };

function formatEventDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return {
    day: d.getDate(),
    month: d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
    full: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  };
}

function renderUpcoming(events) {
  const wrap = document.getElementById('upcomingGrid');
  if (!wrap) return;
  if (!events.length) {
    wrap.innerHTML = '<div class="empty-state">No upcoming events scheduled right now — check back soon!</div>';
    return;
  }
  wrap.innerHTML = events.map(ev => {
    const { day, month, full } = formatEventDate(ev.date);
    return `
      <div class="event-card reveal in">
        <div class="event-photo">
          <div class="date-stamp"><div class="d">${day}</div><div class="m">${month}</div></div>
          <span>${ev.icon}</span>
        </div>
        <div class="event-body">
          <span class="event-tag">${ev.category}</span>
          <h3>${ev.title}</h3>
          <p>${ev.description}</p>
          <div class="event-meta">
            <span>\ud83d\udcc5 ${full}</span>
            <span>\u23f0 ${ev.time}</span>
            <span>\ud83d\udccd ${ev.venue}</span>
          </div>
        </div>
      </div>`;
  }).join('');
}

function renderPast(events) {
  const wrap = document.getElementById('pastGrid');
  if (!wrap) return;
  if (!events.length) {
    wrap.innerHTML = '<div class="empty-state">No events match this filter.</div>';
    return;
  }
  wrap.innerHTML = events.map(ev => {
    const { day, month, full } = formatEventDate(ev.date);
    const thumbs = Array.from({ length: Math.min(ev.gallery, 4) }).map(() => `<div class="thumb">${ev.icon}</div>`).join('');
    return `
      <div class="event-card reveal in">
        <div class="event-photo">
          <div class="date-stamp"><div class="d">${day}</div><div class="m">${month}</div></div>
          <span>${ev.icon}</span>
        </div>
        <div class="gallery-strip">${thumbs}</div>
        <div class="event-body">
          <span class="event-tag">${ev.category}</span>
          <h3>${ev.title}</h3>
          <p>${ev.description}</p>
          <div class="event-meta">
            <span>\ud83d\udcc5 ${full}</span>
            <span>\ud83d\udccd ${ev.venue}</span>
            <span>\ud83d\uddbc\ufe0f ${ev.gallery} photos</span>
          </div>
        </div>
      </div>`;
  }).join('');
}

function populateEventFilterChips(events) {
  const bar = document.getElementById('eventFilterChips');
  if (!bar) return;
  const cats = [...new Set(events.map(e => e.category))];
  bar.innerHTML = ['All', ...cats].map((c, i) =>
    `<button class="filter-chip ${i === 0 ? 'active' : ''}" data-cat="${c === 'All' ? '' : c}">${c}</button>`
  ).join('');
  bar.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      bar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const cat = chip.dataset.cat;
      renderPast(cat ? ALL_EVENTS.past.filter(e => e.category === cat) : ALL_EVENTS.past);
    });
  });
}

async function initEventsPage() {
  const wrapPast = document.getElementById('pastGrid');
  const wrapUpcoming = document.getElementById('upcomingGrid');
  if (!wrapPast && !wrapUpcoming) return;
  try {
    const res = await fetch('data/events.json');
    ALL_EVENTS = await res.json();
    renderPast(ALL_EVENTS.past);
    renderUpcoming(ALL_EVENTS.upcoming);
    populateEventFilterChips(ALL_EVENTS.past);
  } catch (e) {
    console.error('Could not load events.json', e);
  }
}

document.addEventListener('partialsLoaded', initEventsPage);
