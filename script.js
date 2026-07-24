/* ============================================================
   MATRIX PORTFOLIO — COMPLETE JAVASCRIPT ENGINE
   KrishKrKashyap — AI Engineer Portfolio
   ============================================================ */

(function () {
  'use strict';

  // Force scroll to top on page reload so intro always starts correctly
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // ── 1. MATRIX RAIN ──────────────────────────────────────────
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  document.body.classList.add('no-scroll');

  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
  }

  const chars = '01';
  let matrixRunning = true;

  function drawMatrix() {
    if (!matrixRunning) return;
    ctx.fillStyle = 'rgba(10, 10, 10, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px Share Tech Mono';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Mix of green and red
      ctx.fillStyle = Math.random() > 0.92 ? '#ff0040' : '#00ff41';
      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    requestAnimationFrame(drawMatrix);
  }

  requestAnimationFrame(drawMatrix);

  // After 4 seconds — fade out matrix, show terminal
  setTimeout(function () {
    canvas.classList.add('matrix-fade');
  }, 4000);

  setTimeout(function () {
    matrixRunning = false;
    canvas.remove();
    document.body.classList.remove('no-scroll');
    const terminal = document.getElementById('terminal-section');
    if (terminal) {
      startTypewriter();
    }
  }, 5000);

  // ── 2. TYPEWRITER ───────────────────────────────────────────
  function startTypewriter() {
    const output = document.getElementById('terminal-output');
    const cursorEl = document.getElementById('cursor');
    if (!output) return;

    const line1 = '>>> print("Welcome to my portfolio #KrishKrKashyap")';
    const line2 = 'Welcome to my portfolio #KrishKrKashyap';
    let idx = 0;

    // Create line1 span
    const span1 = document.createElement('span');
    span1.className = 'terminal-line';
    output.appendChild(span1);

    function typeLine1() {
      if (idx < line1.length) {
        span1.textContent += line1[idx];
        idx++;
        setTimeout(typeLine1, 45);
      } else {
        // Pause, then show output
        setTimeout(function () {
          const span2 = document.createElement('span');
          span2.className = 'terminal-output-line';
          span2.textContent = line2;
          output.appendChild(span2);

          // Show scroll indicator
          setTimeout(function () {
            const indicator = document.getElementById('scroll-indicator');
            if (indicator) {
              indicator.style.opacity = '1';
              indicator.addEventListener('click', function () {
                const hero = document.getElementById('hero-photo-section');
                if (hero) hero.scrollIntoView({ behavior: 'smooth' });
              });
            }
          }, 800);
        }, 500);
      }
    }

    typeLine1();
  }

  // ── 3. POPULATE CONTENT FROM PORTFOLIO_DATA ─────────────────
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof PORTFOLIO_DATA === 'undefined') {
      console.error('PORTFOLIO_DATA not found. Make sure data.js is loaded before script.js');
      return;
    }
    const D = PORTFOLIO_DATA;

    // Hero photo section
    setText('hero-photo-title', D.name);
    setText('hero-photo-subtitle', D.designation + ' @ ' + D.company);

    // Intro
    setText('hero-name', D.name);
    setText('hero-designation', D.designation + ' @ ' + D.company);
    setText('hero-tagline', D.tagline);

    // Bio
    setText('bio-text', D.bio);

    // Experience
    populateExperience(D.experience);

    // Roles
    populateList('roles-list', D.roles, function (role) {
      const li = document.createElement('li');
      li.textContent = role;
      return li;
    });

    // Skills
    populateSkills(D.skills);

    // Achievements
    populateAchievements(D.achievements);

    // Certifications
    populateCerts(D.certifications);

    // Education
    populateEducation(D.education);

    // Hobbies
    populateHobbies(D.hobbies);

    // Projects
    populateProjects(D.projects);

    // Contact
    populateContact(D.contact);

    // Init scroll animations AFTER content is populated
    initScrollAnimations();
    initCTAButtons();
  });

  // ── HELPER: setText ──
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
  }

  // ── HELPER: populateList ──
  function populateList(id, items, createFn) {
    const container = document.getElementById(id);
    if (!container || !items) return;
    items.forEach(function (item) {
      container.appendChild(createFn(item));
    });
  }

  // ── Experience ──
  function populateExperience(experience) {
    const container = document.getElementById('experience-container');
    if (!container || !experience) return;
    experience.forEach(function (exp) {
      const card = document.createElement('div');
      card.className = 'exp-card';
      let html = '<h3>' + esc(exp.title) + '</h3>';
      html += '<p class="exp-company">' + esc(exp.company) + '</p>';
      html += '<p class="exp-period">' + esc(exp.period) + '</p>';
      if (exp.responsibilities && exp.responsibilities.length > 0) {
        html += '<ul>';
        exp.responsibilities.forEach(function (r) {
          html += '<li>' + esc(r) + '</li>';
        });
        html += '</ul>';
      }
      if (exp.highlights && exp.highlights.length > 0) {
        html += '<ul>';
        exp.highlights.forEach(function (h) {
          html += '<li>' + esc(h) + '</li>';
        });
        html += '</ul>';
      }
      card.innerHTML = html;
      container.appendChild(card);
    });
  }

  // ── Skills ──
  function populateSkills(skills) {
    const container = document.getElementById('skills-container');
    if (!container || !skills) return;
    skills.forEach(function (group) {
      const div = document.createElement('div');
      div.className = 'skill-group';
      let html = '<h3>' + esc(group.category) + '</h3><div class="skill-tags">';
      group.items.forEach(function (item) {
        html += '<span class="skill-tag">' + esc(item) + '</span>';
      });
      html += '</div>';
      div.innerHTML = html;
      container.appendChild(div);
    });
  }

  // ── Achievements ──
  function populateAchievements(achievements) {
    const container = document.getElementById('achievements-list');
    if (!container || !achievements) return;
    achievements.forEach(function (a) {
      const div = document.createElement('div');
      div.className = 'achievement-item';
      div.textContent = a;
      container.appendChild(div);
    });
  }

  // ── Certs ──
  function populateCerts(certs) {
    const container = document.getElementById('certs-container');
    if (!container || !certs) return;
    certs.forEach(function (cert) {
      const card = document.createElement('div');
      card.className = 'cert-card';
      card.innerHTML = '<h4>' + esc(cert.name) + '</h4><p>' + esc(cert.issuer) + '</p><small>' + esc(cert.year) + '</small>';
      container.appendChild(card);
    });
  }

  // ── Education ──
  function populateEducation(education) {
    const container = document.getElementById('education-container');
    if (!container || !education) return;
    education.forEach(function (edu) {
      const item = document.createElement('div');
      item.className = 'edu-item';
      let html = '<h4>' + esc(edu.degree) + '</h4>';
      html += '<p>' + esc(edu.school) + '</p>';
      html += '<small>' + esc(edu.year) + '</small>';
      if (edu.coursework) {
        html += '<p class="coursework"><strong>Coursework:</strong> ' + esc(edu.coursework) + '</p>';
      }
      item.innerHTML = html;
      container.appendChild(item);
    });
  }

  // ── Hobbies ──
  function populateHobbies(hobbies) {
    const container = document.getElementById('hobbies-container');
    if (!container || !hobbies) return;
    hobbies.forEach(function (h) {
      const div = document.createElement('div');
      div.className = 'hobby-item';
      div.innerHTML = '<span>' + h.icon + '</span><p>' + esc(h.name) + '</p>';
      container.appendChild(div);
    });
  }

  // ── Projects ──
  function populateProjects(projects) {
    const grid = document.getElementById('projects-grid');
    if (!grid || !projects) return;

    projects.forEach(function (proj) {
      const card = document.createElement('div');
      card.className = 'project-card';

      let html = '<h3 class="project-name">' + esc(proj.name) + '</h3>';
      html += '<p class="project-desc">' + esc(proj.description) + '</p>';

      html += '<div class="project-tech">';
      proj.techStack.forEach(function (t) {
        html += '<span class="tech-tag">' + esc(t) + '</span>';
      });
      html += '</div>';

      html += '<div class="project-links">';
      if (proj.github) {
        html += '<a href="' + esc(proj.github) + '" target="_blank" rel="noopener" class="github-link">';
        html += '<svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>';
        html += 'GitHub</a>';
      }
      if (proj.demo) {
        html += '<a href="' + esc(proj.demo) + '" target="_blank" rel="noopener" class="github-link">Live Demo</a>';
      }
      html += '</div>';

      card.innerHTML = html;
      grid.appendChild(card);
    });
  }

  // ── Contact ──
  function populateContact(contact) {
    const grid = document.getElementById('contact-grid');
    if (!grid || !contact) return;

    const contactMap = [
      { key: 'phone', icon: '📱', label: 'Phone', prefix: 'tel:' },
      { key: 'email', icon: '📧', label: 'Email', prefix: 'mailto:' },
      { key: 'instagram', icon: '📸', label: 'Instagram', prefix: '' },
      { key: 'linkedin', icon: '💼', label: 'LinkedIn', prefix: '' },
      { key: 'github', icon: '🖥️', label: 'GitHub', prefix: '' },
      { key: 'twitter', icon: '🐦', label: 'Twitter', prefix: '' },
    ];

    contactMap.forEach(function (c) {
      const val = contact[c.key];
      if (!val) return;
      const href = c.prefix ? c.prefix + val : val;
      const card = document.createElement('a');
      card.className = 'contact-card';
      card.href = href;
      card.target = '_blank';
      card.rel = 'noopener';
      card.innerHTML =
        '<span class="contact-icon">' + c.icon + '</span>' +
        '<span class="contact-label">' + c.label + '</span>' +
        '<span class="contact-value">' + esc(val) + '</span>';
      grid.appendChild(card);
    });
  }

  // ── 4. SCROLL ANIMATIONS ───────────────────────────────────
  function initScrollAnimations() {
    // A. Parallax Photo Effect
    const parallaxContainer = document.getElementById('parallax-container');
    const animatingPhoto = document.getElementById('animating-photo');
    const photoPortrait = document.getElementById('photo-portrait');
    const photoFull = document.getElementById('photo-full');
    
    if (parallaxContainer && animatingPhoto) {
      window.addEventListener('scroll', function() {
        // Calculate progress
        const rect = parallaxContainer.getBoundingClientRect();
        // The container is 200vh tall. We want the transition to happen over the first 100vh.
        // rect.top is 0 when container hits the top of viewport.
        const scrollDistance = -rect.top;
        const windowHeight = window.innerHeight;
        
        let progress = scrollDistance / windowHeight;
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;
        
        // Accelerate the photo animation so it completes when scrolled halfway
        let photoProgress = Math.min(1, progress * 2.0);
        
        // Mobile check — don't move left on small screens, just fade
        const isMobile = window.innerWidth <= 768;
        
        // Apply transformations
        if (!isMobile) {
          // Move from 50% left to 22% left
          const leftTarget = 50 - (photoProgress * 28);
          animatingPhoto.style.left = leftTarget + '%';
        } else {
          animatingPhoto.style.left = '50%';
        }
        
        // Crossfade between portrait and full sitting picture
        if (photoPortrait) photoPortrait.style.opacity = 1 - photoProgress;
        if (photoFull) photoFull.style.opacity = photoProgress;
        
        // Move overlays to simulate a sweeping light from left to right
        const sweepProgress = 10 + (photoProgress * 40);
      }, { passive: true });
    }

    // B. Detail blocks — fade in when scrolled into view
    const detailBlocks = document.querySelectorAll('.detail-block');
    if (detailBlocks.length > 0) {
      const detailObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.querySelector('.section-label') && !entry.target.dataset.scrambled) {
              const label = entry.target.querySelector('.section-label');
              const scrambler = new TextScramble(label);
              scrambler.reveal(label.textContent);
              entry.target.dataset.scrambled = 'true';
            }
            // Only animate once
            detailObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      detailBlocks.forEach(block => detailObserver.observe(block));
    }

    // D. Projects animation
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length > 0) {
      const projectsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            projectsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      projectCards.forEach(card => projectsObserver.observe(card));
    }
  }

  // ── 5. CTA BUTTONS ─────────────────────────────────────────
  function initCTAButtons() {
    const btnContact = document.getElementById('btn-contact');
    const btnProjects = document.getElementById('btn-projects');
    const hub = document.getElementById('contact-hub');

    if (btnContact && hub) {
      btnContact.addEventListener('click', function () {
        hub.classList.toggle('active');
        btnContact.textContent = hub.classList.contains('active') ? 'Close' : 'Get in Touch';
      });
    }

    if (btnProjects) {
      btnProjects.addEventListener('click', function () {
        const projects = document.getElementById('projects-section');
        if (projects) projects.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  // ── HTML escape helper ──
  function esc(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── 10. METEOR BACKGROUND ───────────────────────────────────
  function createMeteors() {
    const container = document.getElementById('meteor-container');
    if (!container) return;
    
    const numMeteors = 30; // Increase count for a nice meteor rain
    for (let i = 0; i < numMeteors; i++) {
      const meteor = document.createElement('div');
      meteor.classList.add('meteor');
      
      // Random position (x and y)
      // Since they fall down-right, starting them from top or left is good.
      // We can just scatter them anywhere, they'll wrap via animation.
      const top = -10 + Math.random() * 120; // -10 to 110%
      const left = -10 + Math.random() * 120; // -10 to 110%
      
      // Random animation delay and duration
      const delay = Math.random() * 8; // 0 to 8s
      const duration = 2.5 + Math.random() * 4; // 2.5s to 6.5s
      
      meteor.style.top = top + '%';
      meteor.style.left = left + '%';
      meteor.style.animationDelay = delay + 's';
      meteor.style.animationDuration = duration + 's';
      
      container.appendChild(meteor);
    }
  }
  
  // Initialize dynamic generation on load
  document.addEventListener('DOMContentLoaded', function() {
    createMeteors();
  });

})();
