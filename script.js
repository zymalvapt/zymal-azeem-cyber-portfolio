const body = document.body;
const header = document.querySelector('.site-header');
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const scrollProgress = document.getElementById('scrollProgress');
const currentYear = document.getElementById('currentYear');
const cursorGlow = document.getElementById('cursorGlow');
const typewriterText = document.getElementById('typewriterText');
const terminalOutput = document.getElementById('terminalOutput');
const radarCard = document.getElementById('radarCard');
const navLinks = [...document.querySelectorAll('.site-nav a')];
const revealElements = [...document.querySelectorAll('.reveal')];
const glowCards = [...document.querySelectorAll('.glow-card')];

if (currentYear) currentYear.textContent = new Date().getFullYear();

menuToggle?.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  menuToggle.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    menuToggle?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...(entry.target.parentElement?.children || [])];
    const index = Math.max(0, siblings.indexOf(entry.target));
    entry.target.style.transitionDelay = `${Math.min(index * 75, 300)}ms`;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.14, rootMargin: '0px 0px -5% 0px' });

revealElements.forEach(el => revealObserver.observe(el));

const rolePhrases = [
  'Cybersecurity Fundamentals',
  'Reconnaissance & Enumeration',
  'Vulnerability Assessment',
  'Web Security Fundamentals',
  'Red Teaming Foundations',
  'Linux & Security Tools'
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;
let typeTimer;

function typeLoop() {
  if (!typewriterText) return;
  const current = rolePhrases[roleIndex];

  if (!deleting) {
    charIndex += 1;
    typewriterText.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      typeTimer = setTimeout(typeLoop, 1300);
      return;
    }
  } else {
    charIndex -= 1;
    typewriterText.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % rolePhrases.length;
    }
  }

  typeTimer = setTimeout(typeLoop, deleting ? 34 : 58);
}

typeLoop();

const terminalResponses = {
  whoami: [
    '$ whoami',
    'Zymal Azeem — Computer Science student, cybersecurity intern, and aspiring offensive-security professional.'
  ],
  skills: [
    '$ skills',
    'Cybersecurity fundamentals • Reconnaissance • Scanning • Enumeration • Vulnerability assessment • Web & network security basics • Kali Linux • Nmap • Burp Suite • Nikto'
  ],
  learning: [
    '$ learning',
    'Current path: fundamentals → reconnaissance → scanning → enumeration → vulnerability identification → safe testing → reporting.'
  ],
  goals: [
    '$ goals',
    'Future focus: VAPT • Web Application Pentesting • API Pentesting • Network Pentesting • Red Teaming • Professional Security Reporting.'
  ]
};

document.querySelectorAll('[data-command]').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.dataset.command;
    const response = terminalResponses[key];
    if (!response || !terminalOutput) return;

    terminalOutput.innerHTML = `
      <p><span class="prompt">$</span> ${response[0].replace('$ ', '')}</p>
      <p class="terminal-response terminal-response-animated">${response[1]}</p>
    `;
  });
});

function updateOnScroll() {
  const y = window.scrollY;
  header?.classList.toggle('scrolled', y > 16);

  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (y / max) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = `${pct}%`;

  const sections = [...document.querySelectorAll('main section[id]')];
  let currentId = '';
  sections.forEach(section => {
    if (y >= section.offsetTop - 140) currentId = section.id;
  });

  navLinks.forEach(link => {
    const id = link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', id === currentId);
  });
}

window.addEventListener('scroll', updateOnScroll, { passive: true });
updateOnScroll();

window.addEventListener('pointermove', event => {
  if (cursorGlow) {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
    cursorGlow.style.opacity = '1';
  }
}, { passive: true });

window.addEventListener('pointerleave', () => {
  if (cursorGlow) cursorGlow.style.opacity = '0';
});

glowCards.forEach(card => {
  card.addEventListener('pointermove', event => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  });
});

radarCard?.addEventListener('pointermove', event => {
  const rect = radarCard.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  const rotateY = (x - 0.5) * 8;
  const rotateX = (0.5 - y) * 7;
  radarCard.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

radarCard?.addEventListener('pointerleave', () => {
  radarCard.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg)';
});

// Lightweight animated network canvas
const canvas = document.getElementById('networkCanvas');
const ctx = canvas?.getContext('2d');
let particles = [];
let animationFrame;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.min(55, Math.max(24, Math.floor(window.innerWidth / 26)));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    r: Math.random() * 1.2 + 0.5
  }));
}

function drawNetwork() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < -20) p.x = window.innerWidth + 20;
    if (p.x > window.innerWidth + 20) p.x = -20;
    if (p.y < -20) p.y = window.innerHeight + 20;
    if (p.y > window.innerHeight + 20) p.y = -20;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(99,243,216,0.32)';
    ctx.fill();
  });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(111,140,255,${(1 - dist / 120) * 0.12})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  animationFrame = requestAnimationFrame(drawNetwork);
}

if (canvas && ctx && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  resizeCanvas();
  drawNetwork();
  window.addEventListener('resize', resizeCanvas);
}

window.addEventListener('beforeunload', () => {
  clearTimeout(typeTimer);
  cancelAnimationFrame(animationFrame);
});

// ---------- Enhanced presentation interactions (V2) ----------
const bootScreen = document.getElementById('bootScreen');
window.addEventListener('load', () => {
  window.setTimeout(() => bootScreen?.classList.add('is-hidden'), 1250);
});

// Make the interactive terminal response appear like live output.
let terminalTypingTimer;
document.querySelectorAll('[data-command]').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.dataset.command;
    const response = terminalResponses[key];
    if (!response || !terminalOutput) return;

    clearInterval(terminalTypingTimer);
    const command = response[0].replace('$ ', '');
    const text = response[1];
    terminalOutput.innerHTML = `
      <p><span class="prompt">$</span> ${command}</p>
      <p class="terminal-response terminal-response-animated" id="liveTerminalText"></p>
    `;

    const target = document.getElementById('liveTerminalText');
    let i = 0;
    terminalTypingTimer = setInterval(() => {
      if (!target) return clearInterval(terminalTypingTimer);
      target.textContent = text.slice(0, i++);
      if (i > text.length) clearInterval(terminalTypingTimer);
    }, 13);
  }, { capture: true });
});

// Subtle 3D card tilt on desktop.
if (window.matchMedia('(hover: hover)').matches) {
  glowCards.forEach(card => {
    card.addEventListener('pointermove', event => {
      if (!card.classList.contains('is-visible')) return;
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const ry = (px - .5) * 4.5;
      const rx = (.5 - py) * 4;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

// Magnetic buttons + click ripple.
document.querySelectorAll('.btn').forEach(btn => {
  if (window.matchMedia('(hover: hover)').matches) {
    btn.addEventListener('pointermove', event => {
      const rect = btn.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * .08}px, ${y * .12}px) translateY(-2px)`;
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
    });
  }

  btn.addEventListener('click', event => {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * .55;
    ripple.className = 'ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  });
});

// Hero parallax while scrolling.
const heroCopy = document.querySelector('.hero-copy');
const heroStage = document.getElementById('heroStage');
let parallaxTicking = false;
window.addEventListener('scroll', () => {
  if (parallaxTicking) return;
  parallaxTicking = true;
  requestAnimationFrame(() => {
    const y = Math.min(window.scrollY, 620);
    if (heroCopy) heroCopy.style.transform = `translateY(${y * .035}px)`;
    if (heroStage) heroStage.style.transform = `translateY(${y * -.025}px)`;
    parallaxTicking = false;
  });
}, { passive: true });

// Small cursor trail on desktop for a more interactive cyber feel.
if (window.matchMedia('(hover: hover)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const dots = Array.from({ length: 7 }, () => {
    const dot = document.createElement('span');
    dot.className = 'cursor-trail-dot';
    document.body.appendChild(dot);
    return { el: dot, x: -20, y: -20 };
  });
  let mx = -20, my = -20;
  window.addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function animateTrail() {
    let x = mx, y = my;
    dots.forEach((dot, index) => {
      dot.x += (x - dot.x) * .36;
      dot.y += (y - dot.y) * .36;
      dot.el.style.left = `${dot.x}px`;
      dot.el.style.top = `${dot.y}px`;
      dot.el.style.opacity = `${Math.max(.08, .46 - index * .055)}`;
      x = dot.x;
      y = dot.y;
    });
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
}
