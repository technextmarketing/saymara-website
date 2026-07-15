/* Saymara B. Ryon — shared behaviour */
(function () {
  'use strict';

  /* Mobile nav */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* Rotating words in heroes */
  document.querySelectorAll('.rotator').forEach(function (rot) {
    var words = rot.querySelectorAll('span');
    if (words.length < 2) return;
    var i = 0;
    setInterval(function () {
      words[i].classList.remove('on');
      words[i].style.position = 'absolute';
      i = (i + 1) % words.length;
      words[i].classList.add('on');
      words[i].style.position = 'relative';
    }, 2600);
  });

  /* Reveal on scroll — progressive enhancement.
     Content is visible by default (see CSS); the .js class enables the hide-then-reveal.
     A failsafe guarantees everything shows even if IntersectionObserver never fires. */
  var reveals = document.querySelectorAll('.reveal');
  function showAllReveals() {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }
  if ('IntersectionObserver' in window && reveals.length) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); revealer.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach(function (el) { revealer.observe(el); });
    /* Failsafe: if IO hasn't revealed everything shortly after load, force it. */
    setTimeout(showAllReveals, 2500);
  } else {
    showAllReveals();
  }

  /* Count-up stats — with the same failsafe philosophy. */
  function finalize(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    el.textContent = target.toLocaleString('ro-RO') + (el.getAttribute('data-suffix') || '');
  }
  function animateCount(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 1600, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('ro-RO') + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var counter = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        counter.unobserve(e.target);
        animateCount(e.target);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counter.observe(el); });
    /* Failsafe: ensure final numbers are shown even if IO never fires. */
    setTimeout(function () { counters.forEach(finalize); }, 2600);
  } else {
    counters.forEach(finalize);
  }

  /* Newsletter + contact demo forms → mailto */
  document.querySelectorAll('form[data-mailto]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var fields = [];
      form.querySelectorAll('input, textarea').forEach(function (f) {
        if (f.name && f.value) fields.push(f.name + ': ' + f.value);
      });
      var subj = form.getAttribute('data-subject') || 'Mesaj de pe saymararyon.com';
      window.location.href = 'mailto:contact@saymararyon.com?subject=' +
        encodeURIComponent(subj) + '&body=' + encodeURIComponent(fields.join('\n'));
      var note = form.querySelector('.form-note');
      if (note) note.textContent = 'Se deschide aplicația ta de e-mail pentru a trimite mesajul. Mulțumim!';
    });
  });

  /* Cookie banner */
  var bar = document.querySelector('.cookiebar');
  if (bar && !localStorage.getItem('sr-cookies-ok')) {
    bar.classList.add('show');
    var btn = bar.querySelector('button');
    if (btn) btn.addEventListener('click', function () {
      localStorage.setItem('sr-cookies-ok', '1');
      bar.classList.remove('show');
    });
  }

  /* Year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
