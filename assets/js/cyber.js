(() => {
  'use strict';

  // Os detalhes dos laboratórios usam HTML nativo e não dependem de bibliotecas.
  document.querySelectorAll('.lab-card details').forEach(details => {
    details.addEventListener('toggle', () => {
      const summary = details.querySelector('summary');
      if (summary) summary.setAttribute('aria-expanded', String(details.open));
    });
  });

  const body = document.body;
  const replayButton = document.getElementById('replay-intro');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const glyphs = '0123456789ABCDEF<>/\\[]{}#$%';
  const colors = ['#ff8ce8', '#f7b6ff', '#ba9cff', '#a9f9ff'];
  let introRoot = null;
  let animationFrame = 0;
  let introRunning = false;
  let glitchLoopStarted = false;

  const random = (min, max) => min + Math.random() * (max - min);
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const clamp = value => Math.max(0, Math.min(1, value));
  const easeOut = value => 1 - Math.pow(1 - clamp(value), 3);

  function buildSkullMask() {
    const mask = document.createElement('canvas');
    mask.width = 520;
    mask.height = 390;
    const ctx = mask.getContext('2d');
    ctx.fillStyle = '#fff';

    // Ossos cruzados atrás da caveira.
    ctx.lineCap = 'round';
    ctx.lineWidth = 25;
    ctx.strokeStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(105, 255); ctx.lineTo(415, 285); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(125, 300); ctx.lineTo(395, 242); ctx.stroke();
    [[96,254],[422,286],[117,302],[403,240]].forEach(([x,y]) => {
      ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + (x < 260 ? 8 : -8), y - 8, 10, 0, Math.PI * 2); ctx.fill();
    });

    // Crânio e mandíbula.
    ctx.beginPath();
    ctx.ellipse(260, 143, 108, 99, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(165, 145);
    ctx.lineTo(177, 218);
    ctx.lineTo(204, 252);
    ctx.lineTo(316, 252);
    ctx.lineTo(343, 218);
    ctx.lineTo(355, 145);
    ctx.closePath();
    ctx.fill();

    // Vazados escuros: olhos, nariz e boca. Eles ficam sem caracteres,
    // ajudando a caveira a continuar reconhecível em diferentes telas.
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.ellipse(219, 146, 27, 31, -0.08, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(301, 146, 27, 31, 0.08, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(260, 159); ctx.lineTo(244, 183); ctx.lineTo(260, 190); ctx.lineTo(276, 183);
    ctx.closePath(); ctx.fill();
    ctx.fillRect(218, 203, 84, 23);
    ctx.fillRect(226, 224, 6, 25);
    ctx.fillRect(243, 224, 6, 27);
    ctx.fillRect(260, 224, 6, 27);
    ctx.fillRect(277, 224, 6, 25);
    ctx.fillRect(294, 224, 6, 21);

    const pixels = ctx.getImageData(0, 0, mask.width, mask.height).data;
    const points = [];
    const step = 5;
    for (let y = 0; y < mask.height; y += step) {
      for (let x = 0; x < mask.width; x += step) {
        const i = (y * mask.width + x) * 4;
        const luminance = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        if (pixels[i + 3] > 80 && luminance > 150) {
          points.push({ x: x + random(-1.2, 1.2), y: y + random(-1.2, 1.2), char: pick(glyphs), color: pick(colors), delay: random(0, 430) });
        }
      }
    }
    return points;
  }

  function makeIntro() {
    const root = document.createElement('div');
    root.className = 'cyber-intro';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-label', 'Sequência visual de entrada da área Cybersecurity');
    root.innerHTML = `
      <canvas class="cyber-intro-canvas" aria-hidden="true"></canvas>
      <div class="cyber-intro-vignette" aria-hidden="true"></div>
      <div class="cyber-intro-hud">
        <div class="cyber-intro-topline">
          <span class="cyber-intro-brand"><i></i> SECURE ACCESS <b>//</b> CYBER.PORTFOLIO</span>
          <span id="cyber-intro-progress">BOOT SEQUENCE / 00%</span>
        </div>
        <p class="cyber-intro-title">RECONSTRUINDO <span>IDENTIDADE</span></p>
        <div class="cyber-intro-bottom">
          <p id="cyber-intro-status">[ INIT ] Gerando assinatura digital...</p>
          <div class="cyber-intro-progressbar"><span id="cyber-intro-progress-fill"></span></div>
          <p class="cyber-intro-footnote">AMBIENTE DE APRENDIZADO // ACESSO AUTORIZADO</p>
        </div>
        <button class="cyber-intro-skip" type="button">PULAR INTRO <span>[ ESC ]</span></button>
        <span class="cyber-intro-corner">NO SIGNAL IS RANDOM</span>
      </div>`;
    body.appendChild(root);
    return root;
  }

  function runIntro() {
    if (reduceMotion || introRunning) return;
    if (introRoot) introRoot.remove();
    cancelAnimationFrame(animationFrame);
    introRunning = true;
    body.classList.add('cyber-intro-lock');
    body.classList.remove('cyber-glitch-active');
    introRoot = makeIntro();

    const canvas = introRoot.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const progressText = introRoot.querySelector('#cyber-intro-progress');
    const progressFill = introRoot.querySelector('#cyber-intro-progress-fill');
    const statusText = introRoot.querySelector('#cyber-intro-status');
    const points = buildSkullMask();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let rain = [];
    let targets = [];
    const start = performance.now();
    const assembleDuration = 2050;
    const closeAt = 3650;
    let glitching = false;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const scale = Math.min((width * 0.78) / 520, (height * 0.60) / 390, 1.2);
      const left = (width - 520 * scale) / 2;
      const top = height * 0.43 - (390 * scale) / 2;
      targets = points.map(point => ({
        x: left + point.x * scale,
        y: top + point.y * scale,
        char: point.char,
        color: point.color,
        delay: point.delay,
        startX: random(-width * 0.1, width * 1.1),
        startY: random(-height * 0.15, height * 1.15),
        size: random(7, 10.5)
      }));
      const fontSize = 12;
      rain = [];
      for (let x = -5; x < width + 20; x += 22) {
        rain.push({ x, y: random(-height, height), speed: random(0.6, 2.0), length: Math.floor(random(4, 11)), fontSize });
      }
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function drawRain() {
      ctx.save();
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      rain.forEach(column => {
        column.y += column.speed;
        if (column.y > height + 100) column.y = random(-height, -20);
        for (let i = 0; i < column.length; i++) {
          const y = column.y - i * column.fontSize;
          if (y < -20 || y > height + 20) continue;
          ctx.globalAlpha = (1 - i / column.length) * 0.21;
          ctx.fillStyle = i === 0 ? '#ff9deb' : (i % 4 === 0 ? '#a9f9ff' : '#9d65c8');
          ctx.fillText(pick(glyphs), column.x, y);
        }
      });
      ctx.restore();
    }

    function finish(skip = false) {
      if (!introRunning) return;
      introRunning = false;
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      body.classList.remove('cyber-intro-lock');
      if (introRoot) {
        if (skip) {
          introRoot.remove();
          introRoot = null;
        } else {
          introRoot.classList.add('is-closing');
          const closingRoot = introRoot;
          window.setTimeout(() => {
            closingRoot.remove();
            if (introRoot === closingRoot) introRoot = null;
          }, 520);
        }
      }
      startGlitchLoop();
    }

    introRoot.querySelector('.cyber-intro-skip').addEventListener('click', () => finish(true));

    function frame(now) {
      if (!introRunning) return;
      const elapsed = now - start;
      ctx.clearRect(0, 0, width, height);
      drawRain();

      const assemble = clamp(elapsed / assembleDuration);
      const easedOverall = easeOut(assemble);
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      targets.forEach((target, index) => {
        const local = clamp((elapsed - target.delay) / (assembleDuration - target.delay));
        const eased = easeOut(local);
        let x = target.startX + (target.x - target.startX) * eased;
        let y = target.startY + (target.y - target.startY) * eased;
        // Pequenos deslocamentos horizontais durante os flashes de glitch.
        if ((elapsed > 2110 && elapsed < 2220) || (elapsed > 2310 && elapsed < 2390)) {
          if (index % 3 === 0) x += random(-12, 12);
        }
        ctx.globalAlpha = 0.2 + eased * 0.8;
        ctx.font = `${target.size}px monospace`;
        ctx.fillStyle = target.color;
        if (local > 0.94 && Math.random() > 0.985) target.char = pick(glyphs);
        ctx.fillText(target.char, x, y);
      });
      ctx.restore();

      if (elapsed < 1900) {
        statusText.textContent = '[ INIT ] Gerando assinatura digital...';
      } else if (elapsed < 2480) {
        statusText.textContent = '[ VERIFY ] Reconstruindo estrutura / validando integridade...';
      } else if (elapsed < 3000) {
        statusText.textContent = '[ OK ] Identidade reconhecida. Liberando ambiente...';
      } else {
        statusText.textContent = '[ ACCESS GRANTED ] Bem-vindo ao arquivo.';
      }
      const percent = Math.min(100, Math.round((elapsed / closeAt) * 100));
      progressText.textContent = `BOOT SEQUENCE / ${String(percent).padStart(2, '0')}%`;
      progressFill.style.width = `${percent}%`;

      if (elapsed > 2090 && elapsed < 2410 && !glitching) {
        glitching = true;
        introRoot.classList.add('is-glitching');
      } else if (elapsed >= 2410 && glitching) {
        glitching = false;
        introRoot.classList.remove('is-glitching');
      }

      if (elapsed >= closeAt) {
        finish(false);
        return;
      }
      animationFrame = requestAnimationFrame(frame);
    }
    animationFrame = requestAnimationFrame(frame);
  }

  function startGlitchLoop() {
    if (glitchLoopStarted || reduceMotion) return;
    glitchLoopStarted = true;
    const glitchLayer = document.createElement('div');
    glitchLayer.className = 'cyber-glitch-layer';
    glitchLayer.setAttribute('aria-hidden', 'true');
    body.appendChild(glitchLayer);

    const schedule = () => {
      window.setTimeout(() => {
        if (introRunning) {
          schedule();
          return;
        }
        body.classList.add('cyber-glitch-active');
        glitchLayer.classList.add('is-active');
        window.setTimeout(() => {
          body.classList.remove('cyber-glitch-active');
          glitchLayer.classList.remove('is-active');
          schedule();
        }, random(120, 230));
      }, random(8500, 17000));
    };
    schedule();
  }

  if (replayButton) replayButton.addEventListener('click', () => {
    const nav = document.getElementById('cyber-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    if (nav) nav.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    runIntro();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && introRunning) {
      introRoot?.querySelector('.cyber-intro-skip')?.click();
    }
  });

  // Se a pessoa prefere movimento reduzido, não exibimos a sequência animada.
  if (!reduceMotion) runIntro();
})();
