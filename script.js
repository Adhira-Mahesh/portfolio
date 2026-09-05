/**
 * ADHIRA MAHESH - PORTFOLIO INTERACTIVITY ENGINE
 * Features:
 * - Fluid Magnetic Custom Cursor with Lerp Physics
 * - Interactive Particle Mesh Canvas
 * - 3D Card Tilt with Perspective
 * - Smooth Dark/Light Theme Switcher with Persistence
 * - Animated Typewriter Text
 * - Web Audio API Micro-Interactions (Toggleable)
 * - Interactive Developer Easter Egg Terminal
 * - Direct Functional Email Delivery via FormSubmit AJAX
 * - 1-Click Clipboard Copying & Toast Notifications
 * - Category Filtering for Experience & Skills
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCursor();
  initCanvas();
  initTypewriter();
  initTiltCards();
  initAudio();
  initTerminal();
  initContactForm();
  initCopyButtons();
  initFilters();
  initNavigation();
});

/* ============================================================
   1. THEME SWITCHER (DARK / LIGHT)
   ============================================================ */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('am_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('am_theme', nextTheme);
      playSound('toggle');
      showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }
}

/* ============================================================
   2. FLUID MAGNETIC CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isHovering = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Lerp smoothing loop for the trailing ring
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover detection for interactive elements
  const hoverTargets = document.querySelectorAll('a, button, input, textarea, .tilt-card, .skill-item, .filter-btn, .skill-tab');

  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
      playSound('hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  window.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-active');
  });

  window.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-active');
  });
}

/* ============================================================
   3. INTERACTIVE PARTICLE CANVAS
   ============================================================ */
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
  let particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.density = Math.random() * 20 + 5;
    }

    draw(theme) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = theme === 'light' ? 'rgba(99, 102, 241, 0.45)' : 'rgba(56, 189, 248, 0.45)';
      ctx.fill();
    }

    update(theme) {
      // Natural floating
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse repulsion & interaction
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = (dx / distance) * force * this.density * 0.5;
          const directionY = (dy / distance) * force * this.density * 0.5;
          this.x -= directionX;
          this.y -= directionY;
        }
      }

      this.draw(theme);
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  createParticles();

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

    // Draw connected lines between proximate particles
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          let opacity = 1 - dist / 110;
          ctx.strokeStyle =
            currentTheme === 'light'
              ? `rgba(99, 102, 241, ${opacity * 0.15})`
              : `rgba(99, 102, 241, ${opacity * 0.2})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
      particles[a].update(currentTheme);
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/* ============================================================
   4. 3D CARD TILT WITH PERSPECTIVE
   ============================================================ */
function initTiltCards() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (max ~10 deg)
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ============================================================
   5. TYPEWRITER ANIMATION
   ============================================================ */
function initTypewriter() {
  const typewriterEl = document.getElementById('typewriter');
  if (!typewriterEl) return;

  const roles = [
    'Full Stack Developer',
    'MIS Portal Engineer',
    'B.Tech CS Undergrad (9.7 CGPA)',
    'Robotics & ROS 2 Enthusiast',
    'Tech Leader & Problem Solver'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function tick() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      charIdx--;
      typeSpeed = 45;
    } else {
      charIdx++;
      typeSpeed = 90;
    }

    typewriterEl.textContent = currentRole.substring(0, charIdx);

    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      typeSpeed = 1600; // Pause at end of word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 400; // Pause before typing next
    }

    setTimeout(tick, typeSpeed);
  }

  tick();
}

/* ============================================================
   6. WEB AUDIO API SYNTHESIZER (MICRO-INTERACTIONS)
   ============================================================ */
let audioCtx = null;
let soundEnabled = false;

function initAudio() {
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const mutedIcon = document.getElementById('sound-icon-muted');
  const activeIcon = document.getElementById('sound-icon-active');

  if (!soundToggleBtn) return;

  soundToggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    soundEnabled = !soundEnabled;

    if (soundEnabled) {
      mutedIcon.classList.add('hidden');
      activeIcon.classList.remove('hidden');
      playSound('toggle');
      showToast('Sound Effects Enabled 🔊', 'info');
    } else {
      mutedIcon.classList.remove('hidden');
      activeIcon.classList.add('hidden');
      showToast('Sound Effects Muted 🔇', 'info');
    }
  });
}

function playSound(type) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.04);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'toggle') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(550, now + 0.06);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  } catch (e) {
    // Graceful silent fallback
  }
}

/* ============================================================
   7. INTERACTIVE DEVELOPER TERMINAL
   ============================================================ */
function initTerminal() {
  const terminalDrawer = document.getElementById('terminal-drawer');
  const toggleBtn = document.getElementById('terminal-toggle-btn');
  const closeBtn = document.getElementById('terminal-close-btn');
  const clearBtn = document.getElementById('terminal-clear-btn');
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');
  const body = document.getElementById('terminal-body');

  if (!terminalDrawer || !toggleBtn) return;

  function openTerminal() {
    terminalDrawer.classList.add('active');
    terminalDrawer.setAttribute('aria-hidden', 'false');
    playSound('click');
    setTimeout(() => input.focus(), 150);
  }

  function closeTerminal() {
    terminalDrawer.classList.remove('active');
    terminalDrawer.setAttribute('aria-hidden', 'true');
    playSound('click');
  }

  toggleBtn.addEventListener('click', () => {
    if (terminalDrawer.classList.contains('active')) {
      closeTerminal();
    } else {
      openTerminal();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);
  if (clearBtn) clearBtn.addEventListener('click', () => {
    body.innerHTML = '';
    appendTerminalLine("Terminal cleared. Type 'help' for command list.", 'term-cyan');
  });

  // Hotkey ~ or ` to toggle terminal
  window.addEventListener('keydown', (e) => {
    if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      if (terminalDrawer.classList.contains('active')) closeTerminal();
      else openTerminal();
    }
  });

  function appendTerminalLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.innerHTML = text;
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }

  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawVal = input.value.trim();
      input.value = '';

      if (!rawVal) return;

      appendTerminalLine(`<span class="term-prompt">adhira@dev:~$</span> ${rawVal}`);
      playSound('click');

      const cmd = rawVal.toLowerCase();

      switch (cmd) {
        case 'help':
          appendTerminalLine('Available commands:');
          appendTerminalLine('&nbsp;&nbsp;<span class="term-cyan">about</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Short bio &amp; background');
          appendTerminalLine('&nbsp;&nbsp;<span class="term-cyan">skills</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Technical stack breakdown');
          appendTerminalLine('&nbsp;&nbsp;<span class="term-cyan">projects</span>&nbsp;&nbsp;&nbsp;- Featured projects list');
          appendTerminalLine('&nbsp;&nbsp;<span class="term-cyan">experience</span>&nbsp;- Career and internship timeline');
          appendTerminalLine('&nbsp;&nbsp;<span class="term-cyan">cgpa</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- View official academic standing');
          appendTerminalLine('&nbsp;&nbsp;<span class="term-cyan">contact</span>&nbsp;&nbsp;&nbsp;&nbsp;- Reach out to Adhira directly');
          appendTerminalLine('&nbsp;&nbsp;<span class="term-cyan">hire</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Send hiring inquiry');
          appendTerminalLine('&nbsp;&nbsp;<span class="term-cyan">theme</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Toggle Dark / Light theme');
          appendTerminalLine('&nbsp;&nbsp;<span class="term-cyan">clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clear screen');
          break;

        case 'about':
          appendTerminalLine('Adhira Mahesh | B.Tech Computer Science (2024-2028)');
          appendTerminalLine('College: Pillai College of Engineering, Panvel (CGPA: 9.7/10)');
          appendTerminalLine('Passionate about Next.js, PostgreSQL systems, and ROS 2 simulation.');
          break;

        case 'skills':
          appendTerminalLine('<span class="term-yellow">Languages:</span> Java, Python, C, JavaScript, SQL, HTML, CSS');
          appendTerminalLine('<span class="term-yellow">Frameworks:</span> Next.js, React, Prisma, Tailwind, Firebase, ROS 2');
          appendTerminalLine('<span class="term-yellow">Databases:</span> PostgreSQL, MySQL, Firestore');
          break;

        case 'projects':
          appendTerminalLine('1. <strong>Smart Todo App</strong> (Next.js, React, PostgreSQL, Prisma)');
          appendTerminalLine('2. <strong>Sustainability Event Platform</strong> (React, Firebase)');
          appendTerminalLine('3. <strong>Movie Recommendation System</strong> (Python, Pandas, ML)');
          break;

        case 'experience':
          appendTerminalLine('• <strong>Full Stack Intern</strong> @ MIS Portal (June 2026 - Present)');
          appendTerminalLine('• <strong>Technical Member</strong> @ Google Developer Group (2025-2026)');
          appendTerminalLine('• <strong>MIS Member</strong> @ Alegria 2026 (10k+ tickets)');
          appendTerminalLine('• <strong>Robotics Simulation Intern</strong> (ROS 2 & CoppeliaSim)');
          break;

        case 'cgpa':
          appendTerminalLine('⭐ Official CGPA: <span class="term-green"><strong>9.7 / 10.0</strong></span> (B.Tech CSE, Pillai College of Engineering)');
          break;

        case 'contact':
          appendTerminalLine('📧 Email: <span class="term-cyan">work.adhira.mahesh@gmail.com</span>');
          appendTerminalLine('📞 Phone: <span class="term-cyan">+91 84519 51752</span>');
          appendTerminalLine('🔗 LinkedIn: <span class="term-cyan">linkedin.com/in/adhiramahesh</span>');
          break;

        case 'hire':
          appendTerminalLine('🎉 Awesome! Scrolling to the contact form so you can send your note...');
          document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
          closeTerminal();
          break;

        case 'theme':
          document.getElementById('theme-toggle-btn').click();
          appendTerminalLine('Theme toggled!');
          break;

        case 'clear':
          body.innerHTML = '';
          break;

        case 'sudo':
          appendTerminalLine('<span class="term-red">adhira is already in the sudoers file. Nice try though! 😉</span>');
          break;

        default:
          appendTerminalLine(`<span class="term-red">Command not recognized: '${rawVal}'. Type 'help' for available commands.</span>`);
          break;
      }
    });
  }
}

/* ============================================================
   8. FUNCTIONAL CONTACT FORM (FORMSUBMIT AJAX API)
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const btnIcon = submitBtn ? submitBtn.querySelector('.btn-icon') : null;
  const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset errors
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const subjectError = document.getElementById('subject-error');
    const messageError = document.getElementById('message-error');

    nameError.textContent = '';
    emailError.textContent = '';
    subjectError.textContent = '';
    messageError.textContent = '';

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter your name.';
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Please enter your email address.';
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      subjectError.textContent = 'Please provide a subject.';
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      messageError.textContent = 'Please write a message.';
      isValid = false;
    } else if (messageInput.value.trim().length < 8) {
      messageError.textContent = 'Message should be at least 8 characters long.';
      isValid = false;
    }

    if (!isValid) {
      playSound('click');
      return;
    }

    // Set Loading State
    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Sending to Adhira...';
    if (btnIcon) btnIcon.classList.add('hidden');
    if (btnSpinner) btnSpinner.classList.remove('hidden');

    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      subject: subjectInput.value.trim(),
      message: messageInput.value.trim(),
      _subject: `Portfolio Message from ${nameInput.value.trim()}: ${subjectInput.value.trim()}`,
      _template: 'table',
      _captcha: 'false'
    };

    try {
      // Direct AJAX Post to FormSubmit
      const response = await fetch('https://formsubmit.co/ajax/work.adhira.mahesh@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok || result.success === 'true' || result.message) {
        // Success celebration
        playSound('success');
        showToast('✨ Message received! Adhira will get back to you soon.', 'success');
        form.reset();

        if (btnText) btnText.textContent = 'Message Sent! ✓';
        setTimeout(() => {
          if (btnText) btnText.textContent = 'Send Message Directly';
          if (btnIcon) btnIcon.classList.remove('hidden');
          if (btnSpinner) btnSpinner.classList.add('hidden');
          submitBtn.disabled = false;
        }, 3500);
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      console.warn('FormSubmit AJAX dispatch notice:', err);
      // Helpful fallback: open direct mail client so the message is never lost
      playSound('toggle');
      showToast('Opening your email client to send directly...', 'info');

      const mailtoUrl = `mailto:work.adhira.mahesh@gmail.com?subject=${encodeURIComponent(
        formData.subject
      )}&body=${encodeURIComponent(
        `From: ${formData.name} (${formData.email})\n\n${formData.message}`
      )}`;
      window.location.href = mailtoUrl;

      if (btnText) btnText.textContent = 'Send Message Directly';
      if (btnIcon) btnIcon.classList.remove('hidden');
      if (btnSpinner) btnSpinner.classList.add('hidden');
      submitBtn.disabled = false;
    }
  });
}

/* ============================================================
   9. 1-CLICK CLIPBOARD COPY BUTTONS & TOASTS
   ============================================================ */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        playSound('success');
        showToast(`Copied to clipboard: ${textToCopy}`, 'success');

        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        setTimeout(() => {
          btn.innerHTML = originalHTML;
        }, 2000);
      } catch (err) {
        showToast(`Selected: ${textToCopy}`, 'info');
      }
    });
  });
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : '💡';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <div class="toast-content">
      <p>${message}</p>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 4000);
}

/* ============================================================
   10. INTERACTIVE CATEGORY FILTERS (EXPERIENCE & SKILLS)
   ============================================================ */
function initFilters() {
  // Experience Timeline Filters
  const expFilterBtns = document.querySelectorAll('.filter-btn');
  const timelineCards = document.querySelectorAll('.timeline-card');

  expFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      expFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      playSound('click');

      const filter = btn.getAttribute('data-exp-filter');

      timelineCards.forEach((card) => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Skills Category Tabs
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillItems = document.querySelectorAll('.skill-item');

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      skillTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      playSound('click');

      const catFilter = tab.getAttribute('data-skill-tab');

      skillItems.forEach((item) => {
        const cat = item.getAttribute('data-cat') || '';
        if (catFilter === 'all' || cat === catFilter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ============================================================
   11. NAVIGATION, SCROLL SPY & MOBILE MENU
   ============================================================ */
function initNavigation() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const backToTopBtn = document.getElementById('back-to-top');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Mobile drawer toggle
  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      playSound('click');
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
      });
    });
  }

  // Back to Top button
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playSound('click');
    });
  }

  // Active section scroll spy
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
