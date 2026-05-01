/* ============================================================
   ROMANTIC DIGITAL GIFT — script.js
   ============================================================ */

/* ──────────────────────────────────────────
   0. SVG GRADIENT (inject into DOM for heart)
────────────────────────────────────────── */
document.body.insertAdjacentHTML('afterbegin', `
  <svg class="svg-defs" aria-hidden="true">
    <defs>
      <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stop-color="#f4a0b8"/>
        <stop offset="50%"  stop-color="#e8758a"/>
        <stop offset="100%" stop-color="#c94f6a"/>
      </linearGradient>
    </defs>
  </svg>
`);

/* ──────────────────────────────────────────
   1. PARTICLE CANVAS (opening screen sparkles)
────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#f4b8cc', '#d98fa5', '#c9a8e0', '#f6d4e0', '#e8c0f0', '#fce8d8'];

  function rnd(a, b)  { return Math.random() * (b - a) + a; }
  function pick(arr)  { return arr[Math.floor(Math.random() * arr.length)]; }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = rnd(0, W);
      this.y    = rnd(0, H);
      this.r    = rnd(1.5, 4.5);
      this.color= pick(COLORS);
      this.vx   = rnd(-0.3, 0.3);
      this.vy   = rnd(-0.5, -0.15);
      this.alpha= rnd(0.3, 0.85);
      this.life = rnd(80, 200);
      this.age  = 0;
      this.twinkle = rnd(0.01, 0.035);
      this.phase = rnd(0, Math.PI * 2);
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.age++;
      if (this.age > this.life || this.y < -10) this.reset();
    }
    draw() {
      const a = this.alpha * (0.5 + 0.5 * Math.sin(this.age * this.twinkle + this.phase));
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle   = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  let animId;
  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }
  loop();

  // Stop canvas animation when opening screen hides (perf)
  document.getElementById('open-btn')?.addEventListener('click', () => {
    setTimeout(() => cancelAnimationFrame(animId), 1200);
  });
})();

/* ──────────────────────────────────────────
   2. FLOATING HEARTS (opening screen)
────────────────────────────────────────── */
(function () {
  const container = document.getElementById('floating-hearts');
  if (!container) return;

  const EMOJIS = ['❤', '🌸', '💕', '✨', '💗', '🌹', '💖'];
  const COUNT  = 18;

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('span');
    el.className   = 'float-heart';
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    el.style.setProperty('--dur',   `${6 + Math.random() * 8}s`);
    el.style.setProperty('--del',   `${Math.random() * 8}s`);
    el.style.setProperty('--drift', `${(Math.random() - 0.5) * 80}px`);
    el.style.left  = `${Math.random() * 100}%`;
    el.style.fontSize = `${0.8 + Math.random() * 1.2}rem`;
    container.appendChild(el);
  }
})();

/* ──────────────────────────────────────────
   3. AMBIENT HEARTS (main site background)
────────────────────────────────────────── */
(function () {
  const container = document.getElementById('ambient-hearts');
  if (!container) return;

  const EMOJIS = ['❤', '💕', '🌸', '✨'];
  const COUNT  = 14;

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('span');
    el.className   = 'ambient-heart';
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    el.style.setProperty('--dur', `${18 + Math.random() * 18}s`);
    el.style.setProperty('--del', `${Math.random() * 20}s`);
    el.style.left  = `${Math.random() * 100}%`;
    el.style.bottom = `${Math.random() * 20}%`;
    el.style.fontSize = `${0.6 + Math.random() * 0.8}rem`;
    container.appendChild(el);
  }
})();

/* ──────────────────────────────────────────
   4. OPEN BUTTON → reveal main site
────────────────────────────────────────── */
(function () {
  const openBtn      = document.getElementById('open-btn');
  const openScreen   = document.getElementById('opening-screen');
  const mainSite     = document.getElementById('main-site');

  if (!openBtn || !openScreen || !mainSite) return;

  openBtn.addEventListener('click', () => {
    openBtn.disabled = true;

    // 1. Fade out opening screen
    openScreen.classList.add('fade-out');

    // 2. Show main site
    setTimeout(() => {
      mainSite.setAttribute('aria-hidden', 'false');
      mainSite.classList.add('visible');
      document.body.style.overflow = 'auto';

      // Trigger typewriter after site appears
      setTimeout(startTypewriter, 300);
    }, 800);
  });
})();

/* ──────────────────────────────────────────
   5. TYPEWRITER EFFECT
────────────────────────────────────────── */
function startTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  // ✏️ The message is read from data-message attr in the HTML.
  //    Change it there or directly here as the fallback string.
  const message = el.dataset.message ||
    'Every moment with you feels like a beautiful memory I never want to forget.';

  let i = 0;
  el.textContent = '';

  function type() {
    if (i < message.length) {
      el.textContent += message[i];
      i++;
      setTimeout(type, 36 + Math.random() * 28); // slight human variance
    }
  }
  type();
}

/* ──────────────────────────────────────────
   6. SCROLL REVEAL (IntersectionObserver)
────────────────────────────────────────── */
(function () {
  const revealEls = document.querySelectorAll('.reveal, .reveal-card');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
})();

/* ──────────────────────────────────────────
   7. SCROLL PROGRESS BAR
────────────────────────────────────────── */
(function () {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${(scrolled / total) * 100}%`;
  }, { passive: true });
})();

/* ──────────────────────────────────────────
   8. MODAL — "One More Thing"
────────────────────────────────────────── */
(function () {
  const surpriseBtn  = document.getElementById('surprise-btn');
  const modal        = document.getElementById('love-modal');
  const closeBtn     = modal?.querySelector('.modal-close');
  const backdrop     = modal?.querySelector('.modal-backdrop');
  const heartsWrap   = modal?.querySelector('.modal-hearts');

  if (!surpriseBtn || !modal) return;

  // Inject floating hearts inside modal
  const EMOJIS = ['❤', '💕', '🌸', '✨', '💗'];
  for (let i = 0; i < 12; i++) {
    const el = document.createElement('span');
    el.className   = 'm-heart';
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    el.style.setProperty('--dur', `${3 + Math.random() * 3}s`);
    el.style.setProperty('--del', `${Math.random() * 3}s`);
    el.style.left   = `${Math.random() * 100}%`;
    el.style.bottom = `${Math.random() * 20}%`;
    el.style.fontSize = `${0.8 + Math.random() * 0.8}rem`;
    heartsWrap?.appendChild(el);
  }

  function openModal()  { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeModal() { modal.classList.remove('open'); document.body.style.overflow = 'auto'; }

  surpriseBtn.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
})();

/* ──────────────────────────────────────────
   9. BACKGROUND MUSIC TOGGLE
   ✏️ Add your audio source in index.html:
      <source src="assets/music/your-song.mp3" type="audio/mpeg">
────────────────────────────────────────── */
(function () {
  const btn   = document.getElementById('music-btn');
  const audio = document.getElementById('bg-music');
  if (!btn || !audio) return;

  // Check if audio has a source; hide button if none
  const hasSource = audio.querySelector('source');
  if (!hasSource) {
    btn.style.display = 'none';
    return;
  }

  let playing = false;
  audio.volume = 0.4; // gentle volume

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      btn.classList.remove('playing');
      btn.querySelector('.music-label').textContent = 'Play Music';
    } else {
      audio.play().catch(() => {});
      btn.classList.add('playing');
      btn.querySelector('.music-label').textContent = 'Pause Music';
    }
    playing = !playing;
  });
})();