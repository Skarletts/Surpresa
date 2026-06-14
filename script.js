/* ═══════════════════════════════════════════════════════
   PEDIDO DE CASAMENTO — script.js
   Kerollaynne ❤ Venilda | início: 18/08/2023
═══════════════════════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────────
   ESTADO GLOBAL
───────────────────────────────────────── */
const S = {
  tela:      'tela-capa',
  galIdx:    0,
  galTimer:  null,
  cartaDone: false,
  vozPlay:   false,
  fadeRaf:   null,
};

/* ─────────────────────────────────────────
   GALERIA — definição exata conforme solicitado
───────────────────────────────────────── */
const GALERIA = [
  { src: "foto1.jpg",  txt: "18 de Agosto de 2023" },
  { src: "foto2.jpg",  txt: "O dia em que tudo começou." },
  { src: "foto3.jpg",  txt: "Você transformou minha vida." },
  { src: "foto4.jpg",  txt: "Meu lugar favorito..." },
  { src: "foto5.jpg",  txt: "...sempre estará ao seu lado." },
  { src: "foto6.jpg",  txt: "Cada momento ao seu lado é um presente." },
  { src: "foto7.jpg",  txt: "Você é meu lar." },
  { src: "foto8.jpg",  txt: "Nossa história mais bonita..." },
  { src: "foto9.jpg",  txt: "...ainda está por vir." },
  { src: "beijo.jpeg", txt: "❤️" },
];

/* ─────────────────────────────────────────
   DATA DE INÍCIO
───────────────────────────────────────── */
const INICIO = new Date('2023-08-18T00:00:00');

/* ─────────────────────────────────────────
   BOOT
───────────────────────────────────────── */
window.addEventListener('load', () => {
  initEstrelas();
  initParticulas();
  initContadorCapa();

  /* Splash → Capa após 2.8 s */
  setTimeout(() => {
    const splash = document.getElementById('splash');
    splash.classList.add('out');
    setTimeout(() => {
      splash.style.display = 'none';
      document.getElementById('tela-capa').classList.add('active');
      S.tela = 'tela-capa';
    }, 1300);
  }, 2800);
});

/* ─────────────────────────────────────────
   NAVEGAÇÃO
───────────────────────────────────────── */
function irParaTela(id) {
  if (S.tela === id) return;
  const saindo   = document.getElementById(S.tela);
  const entrando = document.getElementById(id);
  if (!saindo || !entrando) return;

  saindo.classList.add('leaving');
  setTimeout(() => {
    saindo.classList.remove('active', 'leaving');
    entrando.classList.add('active');
    S.tela = id;
    onEntrou(id);
  }, 870);
}

function onEntrou(id) {
  if (id === 'tela-galeria')  initGaleria();
  if (id === 'tela-timeline') initTimeline();
  if (id === 'tela-carta')    initCarta();
  if (id === 'tela-cinema')   initCinema();
}

/* ─────────────────────────────────────────
   TELA 1 · CAPA — contador em tempo real
───────────────────────────────────────── */
function initContadorCapa() {
  function tick() {
    const [a, m, d, h, mn] = calcDiff(INICIO, new Date());
    set('c-anos',  a);
    set('c-meses', m);
    set('c-dias',  d);
    set('c-horas', pad(h));
    set('c-min',   pad(mn));
  }
  tick();
  setInterval(tick, 10000);
}

function iniciarJornada() {
  vib([80, 40, 80]);
  const m = document.getElementById('bg-music');
  m.volume = 0;
  m.play().then(() => fadeVol(m, 0, .55, 1800)).catch(() => {});
  irParaTela('tela-galeria');
}

/* ─────────────────────────────────────────
   TELA 2 · GALERIA
───────────────────────────────────────── */

/**
 * Atualiza a galeria com o item atual de GALERIA[S.galIdx].
 * Usa exatamente os IDs: gal-img, gal-texto, gal-contador.
 */
function atualizarGaleria() {
  const item    = GALERIA[S.galIdx];
  const img     = document.getElementById('gal-img');
  const txt     = document.getElementById('gal-texto');
  const contador = document.getElementById('gal-contador');

  if (img) {
    img.src = item.src;
    img.alt = item.txt;
  }
  if (txt) {
    txt.textContent = item.txt;
  }
  if (contador) {
    contador.textContent =
      String(S.galIdx + 1).padStart(2, '0') +
      ' / ' +
      String(GALERIA.length).padStart(2, '0');
  }
}

function initGaleria() {
  /* Constrói dots */
  const dotsEl = document.getElementById('gal-dots');
  dotsEl.innerHTML = '';
  GALERIA.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'gal-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => {
      clearInterval(S.galTimer);
      S.galIdx = i;
      mostrarGal(false);
      S.galTimer = setInterval(avançarGal, 4500);
    });
    dotsEl.appendChild(d);
  });

  /* Setas */
  document.getElementById('gal-prev').addEventListener('click', () => {
    clearInterval(S.galTimer);
    S.galIdx = (S.galIdx - 1 + GALERIA.length) % GALERIA.length;
    mostrarGal(true);
    S.galTimer = setInterval(avançarGal, 4500);
  });
  document.getElementById('gal-next').addEventListener('click', () => {
    clearInterval(S.galTimer);
    avançarGal();
    S.galTimer = setInterval(avançarGal, 4500);
  });

  S.galIdx = 0;
  mostrarGal(false);

  clearInterval(S.galTimer);
  S.galTimer = setInterval(avançarGal, 4500);
}

function avançarGal() {
  S.galIdx = (S.galIdx + 1) % GALERIA.length;
  mostrarGal(true);
}

function mostrarGal(animate) {
  const img = document.getElementById('gal-img');
  const bg  = document.getElementById('gal-bg');

  if (animate && img) {
    img.classList.add('swap');
    setTimeout(() => {
      atualizarGaleria();
      img.onload = () => img.classList.remove('swap');
      /* fundo dinâmico */
      if (bg) bg.style.backgroundImage = `url('${GALERIA[S.galIdx].src}')`;
    }, 280);
  } else {
    atualizarGaleria();
    if (img) img.classList.remove('swap');
    if (bg)  bg.style.backgroundImage = `url('${GALERIA[S.galIdx].src}')`;
  }

  /* Atualiza dots */
  document.querySelectorAll('.gal-dot').forEach((d, i) =>
    d.classList.toggle('active', i === S.galIdx)
  );
}

/* ─────────────────────────────────────────
   TELA 3 · TIMELINE
───────────────────────────────────────── */
function initTimeline() {
  document.querySelectorAll('.tl-item').forEach(el => {
    const delay = parseInt(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('vis'), 280 + delay);
  });
}

/* ─────────────────────────────────────────
   TELA 4 · CARTA (máquina de escrever)
───────────────────────────────────────── */
const CARTA_TEXTO = `Venilda,

Desde que você entrou na minha vida, tudo mudou.

Você esteve comigo nos dias mais felizes e também nos momentos mais difíceis.

Você me ensinou sobre amor, parceria, respeito e cumplicidade.

Hoje eu não consigo imaginar um futuro onde você não esteja ao meu lado.

E é por isso que quero fazer a pergunta mais importante da minha vida.`;

function initCarta() {
  if (S.cartaDone) return;
  S.cartaDone = true;

  const elTxt = document.getElementById('carta-txt');
  const elCur = document.getElementById('carta-cursor');
  const elBtn = document.getElementById('btn-carta-next');

  elTxt.textContent = '';
  let i = 0;

  function type() {
    if (i < CARTA_TEXTO.length) {
      elTxt.textContent += CARTA_TEXTO[i];
      i++;
      const c = CARTA_TEXTO[i - 1];
      const delay = c === '\n' ? 115 : c === '.' ? 90 : c === ',' ? 68 : 27;
      setTimeout(type, delay);
    } else {
      elCur.style.display = 'none';
      elBtn.classList.remove('hidden');
      vib([60]);
    }
  }
  setTimeout(type, 500);
}

/* ─────────────────────────────────────────
   TELA 5 · ÁUDIO DE VOZ — sistema de fade
───────────────────────────────────────── */

/**
 * Fade suave de volume via requestAnimationFrame com easing cúbico.
 * Cancela qualquer fade anterior antes de iniciar.
 * @param {HTMLAudioElement} el
 * @param {number} from   volume de partida (0–1)
 * @param {number} to     volume de destino (0–1)
 * @param {number} ms     duração em milissegundos
 * @param {Function} [cb] callback ao término
 */
function fadeVol(el, from, to, ms, cb) {
  if (S.fadeRaf) { cancelAnimationFrame(S.fadeRaf); S.fadeRaf = null; }
  const delta = to - from;
  if (Math.abs(delta) < 0.001) { el.volume = to; if (cb) cb(); return; }
  const t0 = performance.now();

  function step(now) {
    const p = Math.min((now - t0) / ms, 1);
    /* easing cúbico ease-in-out */
    const e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    el.volume = Math.max(0, Math.min(1, from + delta * e));
    if (p < 1) {
      S.fadeRaf = requestAnimationFrame(step);
    } else {
      el.volume = to;
      S.fadeRaf = null;
      if (cb) cb();
    }
  }
  S.fadeRaf = requestAnimationFrame(step);
}

function setMVI(reduzido) {
  const mvi   = document.getElementById('mvi');
  const label = document.getElementById('mvi-label');
  const fill  = document.getElementById('mvi-fill');
  if (!mvi) return;
  if (reduzido) {
    mvi.classList.add('dim');
    label.textContent   = '🎵 música reduzida';
    fill.style.width    = '20%';
  } else {
    mvi.classList.remove('dim');
    label.textContent   = '🎵 música normal';
    fill.style.width    = '100%';
  }
}

function pararVoz(restoreMusic) {
  const a   = document.getElementById('voice-audio');
  const m   = document.getElementById('bg-music');
  const btn = document.getElementById('btn-audio');
  const vis = document.getElementById('audio-vis');
  const hrt = document.getElementById('audio-heart');

  a.pause();
  a.currentTime = 0;
  S.vozPlay = false;

  btn.textContent = '❤️ \u00a0Ouça Meu Coração';
  btn.classList.remove('playing');
  vis.classList.remove('active');
  if (hrt) hrt.classList.remove('active');
  setMVI(false);

  if (restoreMusic && m && !m.paused) {
    /* 20 % → volume normal em 2 s */
    fadeVol(m, m.volume, .55, 2000);
  }
}

function toggleVoz() {
  const a   = document.getElementById('voice-audio');
  const m   = document.getElementById('bg-music');
  const btn = document.getElementById('btn-audio');
  const vis = document.getElementById('audio-vis');
  const hrt = document.getElementById('audio-heart');

  /* PAUSAR */
  if (S.vozPlay) { pararVoz(true); return; }

  /* TOCAR — monta barras de onda */
  const bars = document.getElementById('wave-bars');
  bars.innerHTML = '';
  for (let i = 0; i < 30; i++) {
    const b = document.createElement('div');
    b.className = 'wave-bar';
    b.style.animationDelay    = (i * 0.055).toFixed(3) + 's';
    b.style.animationDuration = (0.42 + Math.random() * 0.65).toFixed(3) + 's';
    bars.appendChild(b);
  }

  /* Música 100 % → 20 % em 1 s */
  if (m && !m.paused) {
    fadeVol(m, m.volume, 0.11, 1000, () => setMVI(true));
  } else {
    setMVI(true);
  }

  a.volume = 1;
  const promise = a.play();

  const onOk = () => {
    S.vozPlay = true;
    btn.textContent = '⏸ Pausar';
    btn.classList.add('playing');
    vis.classList.add('active');
    if (hrt) hrt.classList.add('active');
  };

  if (promise !== undefined) {
    promise.then(onOk).catch(() => pararVoz(true));
  } else {
    onOk();
  }

  /* Ao terminar naturalmente → 20 % → 100 % em 2 s */
  a.onended = () => pararVoz(true);

  /* Fone desconectado / pausa externa */
  a.onpause = () => { if (S.vozPlay) pararVoz(true); };
}

/* ─────────────────────────────────────────
   TELA 6 · SEQUÊNCIA CINEMATOGRÁFICA
───────────────────────────────────────── */

/*
  Tabela de blocos:
  [ blk, holdBefore(ms), holdAfter(ms|null), vibração ]
  holdAfter=null → bloco final, não some.
*/
const CIN = [
  [  1,   800, 2600, false           ],  // VENILDA…
  [  2,  1000, 3200, false           ],  // Desde 18/08/2023…
  [  3,  1000, 2600, false           ],  // lugar seguro
  [  4,   900, 2400, false           ],  // sorriso favorito
  [  5,   900, 2400, false           ],  // melhor escolha
  [  6,  1000, 3000, false           ],  // Meu amor. (dourado)
  [  7,  3000, 2800, false           ],  // Existe algo que preciso te mostrar (pausa 3 s antes)
  [  8,  1200, 2600, false           ],  // Não cabe dentro de uma tela
  [  9,  1200, 2600, false           ],  // Precisa ser vivido
  [ 10,  2200, 2800, [80, 60, 80]    ],  // Olhe ao seu redor… (vibra)
  [ 11,  1400, 3000, false           ],  // Eu estou bem perto de você
  [ 12,  1800, null, [200,100,200,100,400] ], // VIRE-SE ❤️ — fica para sempre
];

function initCinema() {
  /* Reseta todos os textos */
  document.querySelectorAll('.cin-line').forEach(el => {
    el.classList.remove('vis', 'out');
    el.style.opacity   = '0';
    el.style.transform = 'translateY(14px)';
  });

  let step = 0;

  function runStep() {
    if (step >= CIN.length) return;
    const [blk, holdBefore, holdAfter, vibPattern] = CIN[step];
    const line = document.querySelector(`.cin-line[data-blk="${blk}"]`);
    if (!line) { step++; runStep(); return; }

    setTimeout(() => {
      if (vibPattern) vib(vibPattern);

      /* Remove inline styles deixados pelo reset e ativa a classe vis */
      line.style.opacity   = '';
      line.style.transform = '';
      line.classList.add('vis');

      step++;

      if (holdAfter === null) return; /* último bloco — para aqui */

      setTimeout(() => {
        line.classList.add('out');
        setTimeout(runStep, 860);   /* aguarda transição de saída */
      }, holdAfter);

    }, holdBefore);
  }

  setTimeout(runStep, 600);
}

/* ─────────────────────────────────────────
   ESTRELAS DISCRETAS (canvas global)
───────────────────────────────────────── */
function initEstrelas() {
  const canvas = document.getElementById('cv-stars');
  const ctx    = canvas.getContext('2d');
  let stars    = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: 120 }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.2 + 0.2,
      op:    Math.random() * 0.48 + 0.06,
      spd:   Math.random() * 0.007 + 0.002,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function loop(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const b = s.op + Math.sin(t * s.spd + s.phase) * 0.07;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,175,55,${Math.max(0, Math.min(.55, b))})`;
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(loop);
}

/* ─────────────────────────────────────────
   PARTÍCULAS DOURADAS (canvas global)
───────────────────────────────────────── */
function initParticulas() {
  const canvas = document.getElementById('cv-particles');
  const ctx    = canvas.getContext('2d');
  let ps       = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class P {
    constructor() { this.reset() }
    reset() {
      this.x    = Math.random() * canvas.width;
      this.y    = canvas.height + Math.random() * 80;
      this.r    = Math.random() * 2 + 0.4;
      this.vy   = Math.random() * 0.9 + 0.25;
      this.vx   = (Math.random() - 0.5) * 0.35;
      this.op   = Math.random() * 0.52 + 0.08;
      this.gold = Math.random() > 0.28;
    }
    update() {
      this.y  -= this.vy;
      this.x  += this.vx;
      this.op -= 0.0005;
      if (this.y < -8 || this.op <= 0) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.gold
        ? `rgba(212,175,55,${this.op})`
        : `rgba(139,0,0,${this.op * 0.5})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    const n = Math.min(88, Math.floor(window.innerWidth / 8));
    ps = Array.from({ length: n }, () => {
      const p = new P();
      p.y = Math.random() * canvas.height;
      return p;
    });
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ps.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { init(); });
  init();
  loop();
}

/* ─────────────────────────────────────────
   UTILITÁRIOS
───────────────────────────────────────── */

/** Calcula diferença precisa entre duas datas */
function calcDiff(from, to) {
  let anos  = to.getFullYear() - from.getFullYear();
  let meses = to.getMonth()    - from.getMonth();
  let dias  = to.getDate()     - from.getDate();
  let horas = to.getHours()    - from.getHours();
  let mins  = to.getMinutes()  - from.getMinutes();

  if (mins  < 0) { horas--; mins  += 60; }
  if (horas < 0) { dias--;  horas += 24; }
  if (dias  < 0) {
    meses--;
    dias += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
  }
  if (meses < 0) { anos--; meses += 12; }

  return [anos, meses, dias, horas, mins];
}

/** Seta textContent de um elemento pelo id sem refluxo desnecessário */
function set(id, val) {
  const el = document.getElementById(id);
  if (el && el.textContent !== String(val)) el.textContent = val;
}

/** Zero-pad para 2 dígitos */
function pad(n) { return String(n).padStart(2, '0'); }

/** Vibração segura (silencia erros em desktop) */
function vib(pattern) {
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (_) {}
}

/* ─────────────────────────────────────────
   SERVICE WORKER (PWA / GitHub Pages)
───────────────────────────────────────── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
