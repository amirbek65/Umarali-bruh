// ================================
// КРИНЖ УМАРАЛИ — SCRIPT.JS
// ================================

document.addEventListener('DOMContentLoaded', () => {

  // ——— Fade-in on scroll ———
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, entry.target.dataset.delay || 0);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.gallery-card, .stat-card, .quote-item, .section-title, .section-desc').forEach((el, i) => {
    el.classList.add('fade-in');
    el.dataset.delay = (i % 5) * 80;
    observer.observe(el);
  });

  // ——— Animate stat numbers ———
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statsObserver.observe(el));

  function animateCount(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString('ru');
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // ——— Parallax hero bg text ———
  const bgText = document.querySelector('.hero-bg-text');
  if (bgText) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      bgText.style.transform = `translateY(${y * 0.3}px)`;
    }, { passive: true });
  }

  // ——— Hero image tilt on mousemove ———
  const heroImg = document.querySelector('.hero-img');
  if (heroImg && window.innerWidth > 768) {
    heroImg.addEventListener('mousemove', (e) => {
      const rect = heroImg.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = ((e.clientY - cy) / rect.height) * 10;
      const ry = ((e.clientX - cx) / rect.width) * -10;
      heroImg.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
    });

    heroImg.addEventListener('mouseleave', () => {
      heroImg.style.transform = '';
    });
  }

  // ——— Roast text glitch on hover ———
  const bigQuote = document.querySelector('.big-quote');
  if (bigQuote) {
    bigQuote.addEventListener('mouseenter', () => {
      bigQuote.style.animation = 'glitch 0.3s steps(2) forwards';
    });
    bigQuote.addEventListener('animationend', () => {
      bigQuote.style.animation = '';
    });
  }

  // ——— Gallery card random tilt ———
  document.querySelectorAll('.gallery-card').forEach(card => {
    const tilt = (Math.random() - 0.5) * 1.5;
    card.style.setProperty('--tilt', `${tilt}deg`);
  });

  // ——— Dynamic noise overlay ———
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.025;
    mix-blend-mode: overlay;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let noiseFrame;

  function drawNoise() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = data[i + 1] = data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    noiseFrame = requestAnimationFrame(drawNoise);
  }

  // Only draw noise on desktop for performance
  if (window.innerWidth > 768) {
    drawNoise();
  }

  // ——— Cursor custom (desktop) ———
  if (window.innerWidth > 768) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      width: 8px; height: 8px;
      background: #ff2d55;
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
      transition: opacity 0.2s;
      mix-blend-mode: difference;
    `;
    document.body.appendChild(dot);

    document.addEventListener('mousemove', (e) => {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
    });
  }

  // ——— Easter egg: konami code = 💀 ———
  const konami = [38,38,40,40,37,39,37,39,66,65];
  let pos = 0;
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === konami[pos]) {
      pos++;
      if (pos === konami.length) {
        alert('💀 Ты нашёл секрет! Умарали всё равно кринжует 💀');
        pos = 0;
      }
    } else {
      pos = 0;
    }
  });

});
