/* ==========================================================================
   NAVIGATOR TOURS & TRAVELS — SCRIPT.JS
   Vanilla JS: navbar, menu, scroll effects, counters, slider, gallery,
   form validation, loader, dark/light mode
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- LOADING SCREEN ---------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });
  // Fallback in case 'load' already fired
  if (document.readyState === 'complete') {
    setTimeout(() => loader.classList.add('hidden'), 400);
  }

  /* ---------------- DESTINATION DATA ---------------- */
  const WM = (file) => `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=700`;

  const destinations = [
    { name: 'Dubai', desc: 'Skyscrapers, souks and desert safaris in one dazzling city.', img: WM('Dubai_Skyline_and_Burj_Khalifa_-_25072008.jpg') },
    { name: 'Singapore', desc: 'A futuristic skyline packed with gardens and world flavours.', img: WM('Marina_Bay_Sands_and_the_skyline_of_the_Central_Business_District,_Singapore,_at_dusk_-_20120805.jpg') },
    { name: 'Malaysia', desc: 'The Petronas Towers, street food, and Kuala Lumpur\'s buzz.', img: WM('2016_Kuala_Lumpur,_Petronas_Towers_(26).jpg') },
    { name: 'Ooty', desc: 'Misty hills, tea gardens and a toy train through the Nilgiris.', img: WM('Ooty,_Tamil_Nadu,_INDIA.JPG') },
    { name: 'Munnar', desc: 'Rolling tea estates and cool hill-station air in Kerala.', img: WM('Munnar_tea_gardens.jpg') },
    { name: 'Wayanad', desc: 'Misty ghats, wildlife and waterfalls in Kerala\'s green heartland.', img: WM('Pozhuthana_Wayanad.jpg') }
  ];

  const destGrid = document.getElementById('destGrid');
  if (destGrid) {
    destGrid.innerHTML = destinations.map((d, i) => `
      <div class="dest-card fade-in-up">
        <div class="dest-img-wrap">
          <img src="${d.img}" alt="${d.name}" loading="lazy">
        </div>
        <div class="dest-body">
          <h3>${d.name}</h3>
          <p>${d.desc}</p>
          <a href="#contact" class="dest-book">Book Now <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>
    `).join('');
  }

  /* ---------------- GALLERY DATA ---------------- */
  const galleryImages = [
    { src: WM('Goa_beautiful_beach.JPG').replace('width=700', 'width=900'), label: 'Beaches' },
    { src: WM('Himalayas_in_India.jpg'), label: 'Mountains' },
    { src: WM('Heritage_Machan_Tree_house_hotel_in_Lonavala,_India_-_2008.jpg'), label: 'Hotels' },
    { src: WM('At_the_Top_SKY_@_Burj_Khalifa_@_Dubai_(15700184337).jpg').replace('width=700', 'width=900'), label: 'Burj Khalifa' },
    { src: WM('Burj_Al_Arab_(52070466433).jpg').replace('width=700', 'width=900'), label: 'Burj Al Arab, Dubai' },
    { src: WM('Petronas_Towers_at_Night_-_from_the_base_upwards.jpg').replace('width=700', 'width=900'), label: 'Petronas Twin Towers' }
  ];

  const galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid) {
    galleryGrid.innerHTML = galleryImages.map(g => `
      <div class="gallery-item fade-in-up">
        <img src="${g.src}" alt="${g.label}" loading="lazy">
        <div class="gallery-overlay"><span>${g.label}</span></div>
      </div>
    `).join('');
  }

  /* ---------------- STICKY NAVBAR ---------------- */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const scrollTopBtn = document.getElementById('scrollTop');

  function handleScroll() {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 60);
    scrollTopBtn.classList.toggle('show', scrollY > 500);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';

    updateActiveNav();
  }
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ---------------- SCROLL TO TOP ---------------- */
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------- MOBILE HAMBURGER MENU ---------------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  /* ---------------- ACTIVE NAV HIGHLIGHT ---------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let current = 'home';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  /* ---------------- FADE-IN ON SCROLL ---------------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  function observeFadeEls() {
    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
  }
  observeFadeEls();

  /* ---------------- COUNTER ANIMATION ---------------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const decimalDivisor = el.getAttribute('data-decimal') ? parseInt(el.getAttribute('data-decimal'), 10) : null;
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = decimalDivisor ? (current / decimalDivisor).toFixed(1) : Math.round(current);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------------- TESTIMONIAL SLIDER ---------------- */
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  const cards = track ? track.children : [];
  let currentSlide = 0;
  let sliderInterval;

  if (track && cards.length) {
    for (let i = 0; i < cards.length; i++) {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    }

    function goToSlide(index) {
      currentSlide = (index + cards.length) % cards.length;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      document.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }

    document.getElementById('testiNext').addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoSlide(); });
    document.getElementById('testiPrev').addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoSlide(); });

    function startAutoSlide() {
      sliderInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
    }
    function resetAutoSlide() {
      clearInterval(sliderInterval);
      startAutoSlide();
    }
    startAutoSlide();
  }

  /* ---------------- DARK / LIGHT MODE TOGGLE ---------------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  const root = document.documentElement;

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    [themeToggle, themeToggleMobile].forEach(btn => {
      if (btn) btn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });
    try { localStorage.setItem('navigator-theme', theme); } catch (err) { /* storage unavailable */ }
  }

  function toggleTheme() {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  let savedTheme = 'light';
  try { savedTheme = localStorage.getItem('navigator-theme') || 'light'; } catch (err) { /* storage unavailable */ }
  setTheme(savedTheme);

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

  /* ---------------- INIT ---------------- */
  handleScroll();
  observeFadeEls();
});
