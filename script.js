document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // Theme Toggle (Dark / Light)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.innerHTML = '☀️';
      themeToggleBtn.setAttribute('title', 'Cambiar a modo claro');
      themeToggleBtn.setAttribute('aria-label', 'Cambiar a modo claro');
    } else {
      themeIcon.innerHTML = '🌙';
      themeToggleBtn.setAttribute('title', 'Cambiar a modo oscuro');
      themeToggleBtn.setAttribute('aria-label', 'Cambiar a modo oscuro');
    }
  }

  // ==========================================
  // Navbar Scroll Background
  // ==========================================
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ==========================================
  // Mobile Menu Toggle
  // ==========================================
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const navLinks = document.getElementById('nav-links');

  if (menuToggleBtn && navLinks) {
    menuToggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      menuToggleBtn.innerHTML = isOpen ? '✕' : '☰';
      menuToggleBtn.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggleBtn.innerHTML = '☰';
        menuToggleBtn.setAttribute('aria-expanded', false);
      });
    });
  }

  // ==========================================
  // Active Nav Link On Scroll
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 140;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-links a[href*="${sectionId}"]`);
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        if (navItem) navItem.classList.add('active');
      } else {
        if (navItem) navItem.classList.remove('active');
      }
    });
  });

  // ==========================================
  // Interactive Mouse Spotlight Effect
  // ==========================================
  document.querySelectorAll('.spotlight-card, .timeline-card, .project-card, .skill-category-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ==========================================
  // DYNAMIC EXPERIENCE TIMELINE: SCROLLING ORB & HUD YEAR
  // ==========================================
  const timelineRail = document.getElementById('timeline-rail');
  const timelineProgress = document.getElementById('timeline-rail-progress');
  const trackerOrb = document.getElementById('timeline-tracker-orb');
  const orbYearDisplay = document.getElementById('orb-year-display');
  const itemsContainer = document.getElementById('timeline-items-wrapper');
  let timelineItems = document.querySelectorAll('.timeline-item');

  function updateTimelineTracker() {
    if (!timelineRail || !trackerOrb || timelineItems.length === 0) return;

    // Filter visible items
    const visibleItems = Array.from(timelineItems).filter(item => item.style.display !== 'none');
    if (visibleItems.length === 0) return;

    const railRect = timelineRail.getBoundingClientRect();
    const triggerY = window.innerHeight * 0.45; // Sweet spot for reading

    // Total travel distance in pixels
    const railTop = railRect.top;
    const railHeight = railRect.height;

    // Calculate progress between 0 and 1 relative to viewport center
    let currentDist = triggerY - railTop;
    let progressRatio = currentDist / railHeight;
    progressRatio = Math.max(0, Math.min(1, progressRatio));

    // Update progress bar height and orb top position
    const orbTopPx = progressRatio * railHeight;
    trackerOrb.style.top = `${orbTopPx}px`;
    if (timelineProgress) {
      timelineProgress.style.height = `${progressRatio * 100}%`;
    }

    // Find which timeline milestone is closest or currently active
    let activeItem = visibleItems[0];
    let minDistance = Infinity;

    visibleItems.forEach((item, index) => {
      const dot = item.querySelector('.timeline-dot');
      const itemRect = (dot || item).getBoundingClientRect();
      const itemCenterY = itemRect.top + itemRect.height / 2;
      const dist = Math.abs(triggerY - itemCenterY);

      if (dist < minDistance) {
        minDistance = dist;
        activeItem = item;
      }

      // Mark passed milestones
      if (itemCenterY < triggerY + 30) {
        item.classList.add('passed-milestone');
      } else {
        item.classList.remove('passed-milestone');
      }
    });

    // Update active class
    visibleItems.forEach(item => item.classList.remove('active-milestone'));
    if (activeItem) {
      activeItem.classList.add('active-milestone');
      
      // Read dynamic year from active item
      const year = activeItem.getAttribute('data-year') || '2014';
      const yearEnd = activeItem.getAttribute('data-year-end') || year;
      
      if (orbYearDisplay) {
        const displayYear = year === yearEnd ? year : (yearEnd === '2026' ? `${year}→Hoy` : `${year}–${yearEnd}`);
        if (orbYearDisplay.innerText !== displayYear) {
          orbYearDisplay.innerText = displayYear;
          orbYearDisplay.classList.add('year-bump');
          setTimeout(() => orbYearDisplay.classList.remove('year-bump'), 300);
        }
      }
    }
  }

  window.addEventListener('scroll', updateTimelineTracker, { passive: true });
  window.addEventListener('resize', updateTimelineTracker);
  // Initial call
  setTimeout(updateTimelineTracker, 250);

  // ==========================================
  // Timeline Sector Filter (Software, Electricidad, Electrónica, Industria)
  // ==========================================
  const expFilterBtns = document.querySelectorAll('.exp-filter-btn');

  expFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      expFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-exp-filter');

      timelineItems.forEach(item => {
        const category = item.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          item.style.display = 'block';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        } else {
          item.style.display = 'none';
        }
      });

      // Recalculate tracker
      setTimeout(updateTimelineTracker, 150);
    });
  });

  // ==========================================
  // Timeline Order Toggle (Cronológico vs Reciente primero)
  // ==========================================
  const orderToggleBtn = document.getElementById('order-toggle-btn');
  const orderLabel = document.getElementById('order-label');
  let isChronological = true;

  if (orderToggleBtn && itemsContainer) {
    orderToggleBtn.addEventListener('click', () => {
      isChronological = !isChronological;
      
      const itemsArray = Array.from(document.querySelectorAll('.timeline-item'));
      itemsArray.reverse();

      // Clear and re-append in reversed order
      itemsArray.forEach(item => itemsContainer.appendChild(item));

      // Refresh items reference
      timelineItems = document.querySelectorAll('.timeline-item');

      if (isChronological) {
        orderLabel.innerHTML = 'Cronológico (2014 &rarr; 2026)';
        orderToggleBtn.setAttribute('title', 'Cambiar a: Más recientes primero');
      } else {
        orderLabel.innerHTML = 'Recientes primero (2026 &rarr; 2014)';
        orderToggleBtn.setAttribute('title', 'Cambiar a: Orden cronológico');
      }

      setTimeout(updateTimelineTracker, 150);
    });
  }

  // ==========================================
  // Skills Tabs Filtering
  // ==========================================
  const skillTabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  skillTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tabFilter = btn.getAttribute('data-skill-filter');

      skillCards.forEach(card => {
        const cat = card.getAttribute('data-skill-cat') || '';
        if (tabFilter === 'all' || cat.includes(tabFilter)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // Project Filtering
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // Copy Email Button
  // ==========================================
  const copyBtn = document.getElementById('copy-email-btn');
  const emailTextEl = document.getElementById('email-address-text');

  if (copyBtn && emailTextEl) {
    copyBtn.addEventListener('click', () => {
      const email = emailTextEl.innerText.trim();
      navigator.clipboard.writeText(email).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✓ ¡Copiado!';
        copyBtn.style.color = '#10b981';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.style.color = '';
        }, 2200);
      }).catch(err => {
        console.error('Error al copiar:', err);
      });
    });
  }

  // ==========================================
  // Scroll Reveal Animations
  // ==========================================
  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.project-card, .skill-category-card, .highlight-box, .edu-card, .hybrid-showcase').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });

  window.addEventListener('scroll', () => {
    document.querySelectorAll('.revealed').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });
});
