(function () {
  const ICONS = ['\ud83c\udf93', '\ud83c\udf0d', '\ud83d\udcbc', '\u2699\ufe0f'];
  const CANVAS_W = 640, CANVAS_H = 480;
  const BASKET_W = 90, BASKET_H = 22;
  const MAX_LIVES = 3;

  let canvas, ctx, scoreVal, livesVal, bestVal, overlay, startBtn, restartBtn;
  let basketX = CANVAS_W / 2;
  let items = [];
  let score = 0;
  let lives = MAX_LIVES;
  let best = parseInt(localStorage.getItem('serviceSprintBest') || '0', 10);
  let running = false;
  let spawnTimer = 0;
  let speedMultiplier = 1;
  let rafId = null;
  let lastTime = 0;

  function setupGame() {
    canvas = document.getElementById('gameCanvas');
    if (!canvas) return; // not on this page
    ctx = canvas.getContext('2d');
    scoreVal = document.getElementById('scoreVal');
    livesVal = document.getElementById('livesVal');
    bestVal = document.getElementById('bestVal');
    overlay = document.getElementById('gameOverlay');
    startBtn = document.getElementById('startBtn');
    restartBtn = document.getElementById('restartBtn');

    bestVal.textContent = best;

    canvas.addEventListener('mousemove', (e) => {
      basketX = clamp(toCanvasX(e.clientX), BASKET_W / 2, CANVAS_W - BASKET_W / 2);
    });
    canvas.addEventListener('touchmove', (e) => {
      if (e.touches[0]) basketX = clamp(toCanvasX(e.touches[0].clientX), BASKET_W / 2, CANVAS_W - BASKET_W / 2);
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('keydown', (e) => {
      if (!running) return;
      if (e.key === 'ArrowLeft') basketX = clamp(basketX - 28, BASKET_W / 2, CANVAS_W - BASKET_W / 2);
      if (e.key === 'ArrowRight') basketX = clamp(basketX + 28, BASKET_W / 2, CANVAS_W - BASKET_W / 2);
    });

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    drawIdleFrame();
  }

  function toCanvasX(clientX) {
    const rect = canvas.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * CANVAS_W;
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function startGame() {
    score = 0;
    lives = MAX_LIVES;
    items = [];
    speedMultiplier = 1;
    spawnTimer = 0;
    running = true;
    overlay.style.display = 'none';
    updateHud();
    lastTime = performance.now();
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);
  }

  function endGame() {
    running = false;
    if (score > best) {
      best = score;
      localStorage.setItem('serviceSprintBest', String(best));
    }
    bestVal.textContent = best;
    overlay.innerHTML = `
      <h2 style="margin:0;">Sprint Over &mdash; ${score} pts</h2>
      <p>${score >= best && score > 0 ? "New best score! \ud83c\udf89" : "Nice run. Want to beat it?"}</p>
      <button class="btn btn-gold" id="startBtn">Sprint Again</button>
    `;
    overlay.style.display = 'flex';
    document.getElementById('startBtn').addEventListener('click', startGame);
  }

  function updateHud() {
    scoreVal.textContent = score;
    livesVal.textContent = '\u2764\ufe0f'.repeat(lives) + '\ud83e\udd0d'.repeat(MAX_LIVES - lives);
  }

  function spawnItem() {
    items.push({
      x: 30 + Math.random() * (CANVAS_W - 60),
      y: -20,
      icon: ICONS[Math.floor(Math.random() * ICONS.length)],
      speed: (1.4 + Math.random() * 1.1) * speedMultiplier
    });
  }

  function loop(now) {
    const dt = Math.min(now - lastTime, 50);
    lastTime = now;
    if (!running) return;

    spawnTimer += dt;
    const spawnInterval = Math.max(420, 900 - score * 8);
    if (spawnTimer > spawnInterval) {
      spawnTimer = 0;
      spawnItem();
    }

    speedMultiplier = 1 + score * 0.02;

    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      it.y += it.speed * (dt / 16.7);

      const basketTop = CANVAS_H - 56;
      if (it.y >= basketTop && it.y <= basketTop + BASKET_H && Math.abs(it.x - basketX) < (BASKET_W / 2 + 14)) {
        score += 10;
        items.splice(i, 1);
        continue;
      }
      if (it.y > CANVAS_H + 10) {
        lives -= 1;
        items.splice(i, 1);
        if (lives <= 0) {
          updateHud();
          render();
          endGame();
          return;
        }
      }
    }

    updateHud();
    render();
    rafId = requestAnimationFrame(loop);
  }

  function render() {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // falling items
    ctx.font = '34px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    items.forEach(it => ctx.fillText(it.icon, it.x, it.y));

    // basket
    const by = CANVAS_H - 56;
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--azure').trim() || '#163E7A';
    roundRect(ctx, basketX - BASKET_W / 2, by, BASKET_W, BASKET_H, 8);
    ctx.fill();
    ctx.font = '20px serif';
    ctx.fillText('\ud83e\uddfa', basketX, by + BASKET_H / 2 + 1);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawIdleFrame() {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.font = '34px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.5;
    ICONS.forEach((icon, i) => ctx.fillText(icon, 120 + i * 140, 200));
    ctx.globalAlpha = 1;
  }

  document.addEventListener('partialsLoaded', setupGame);
})();
