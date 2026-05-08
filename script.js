/* ─────────────────────────────────────────
   Lumière & Co. — script.js
───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. NAVBAR SCROLL ─── */
  const nav = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });


  /* ─── 2. HAMBURGER / MOBILE MENU ─── */
  const ham     = document.getElementById('ham');
  const mobMenu = document.getElementById('mobMenu');
  let menuOpen  = false;

  function setMenu(open) {
    menuOpen = open;
    mobMenu.classList.toggle('open', open);
    const spans = ham.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(4.5px, 4.5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4.5px, -4.5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }

  ham.addEventListener('click', () => setMenu(!menuOpen));

  document.querySelectorAll('.ml').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });


  /* ─── 3. SCROLL REVEAL ─── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ─── 4. COUNTER ANIMATION ─── */
  function animateCounter(el) {
    const target   = +el.dataset.t;
    const duration = 1600;
    const suffix   = el.dataset.t === '99' ? '%' : '+';
    const start    = performance.now();

    (function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    })(start);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));


  /* ─── 5. TESTIMONIAL SLIDER ─── */
  const slides = document.querySelectorAll('.t-item');
  const dots   = document.querySelectorAll('.tdot');
  let current  = 0;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(+dot.dataset.i));
  });

  setInterval(() => goTo(current + 1), 5000);


  /* ─── 6. INQUIRY FORM VALIDATION ─── */
  const form      = document.getElementById('inquiryForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnTxt    = document.getElementById('btnTxt');
  const successEl = document.getElementById('successMsg');

  function validateField(id, errId, message) {
    const field = document.getElementById(id);
    const errEl = document.getElementById(errId);
    const val   = field.value.trim();

    if (!val) {
      field.classList.add('err');
      errEl.textContent = message;
      return false;
    }
    if (id === 'em' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      field.classList.add('err');
      errEl.textContent = 'Please enter a valid email address.';
      return false;
    }
    field.classList.remove('err');
    errEl.textContent = '';
    return true;
  }

  /* Live error clear on input */
  ['p1', 'p2', 'em', 'msg'].forEach(id => {
    document.getElementById(id).addEventListener('input', function () {
      this.classList.remove('err');
      const errEl = document.getElementById('e-' + id);
      if (errEl) errEl.textContent = '';
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const v1 = validateField('p1',  'e-p1',  'Please enter your name.');
    const v2 = validateField('p2',  'e-p2',  "Please enter your partner's name.");
    const v3 = validateField('em',  'e-em',  'Please enter your email address.');
    const v4 = validateField('msg', 'e-msg', 'Please share your vision with us.');

    if (!v1 || !v2 || !v3 || !v4) return;

    submitBtn.disabled = true;
    btnTxt.textContent = 'Sending…';

    setTimeout(() => {
      successEl.classList.add('show');
    }, 1000);
  });

});
