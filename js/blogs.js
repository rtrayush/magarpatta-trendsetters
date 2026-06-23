async function initBlogsPage() {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;
  try {
    const res = await fetch('data/blogs.json');
    const posts = await res.json();
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    grid.innerHTML = posts.map(p => {
      const date = new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      return `
        <article class="blog-card reveal in">
          <span class="event-tag">${p.tag}</span>
          <h3>${p.title}</h3>
          <p>${p.excerpt}</p>
          <div class="blog-meta">
            <span class="avatar">${p.authorInitials}</span>
            <span>${p.author} &middot; ${date}</span>
          </div>
        </article>`;
    }).join('');
  } catch (e) {
    console.error('Could not load blogs.json', e);
    grid.innerHTML = '<div class="empty-state">Couldn\'t load blog posts.</div>';
  }
}

document.addEventListener('partialsLoaded', initBlogsPage);
