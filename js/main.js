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

  /* Reveal on scroll */
  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); revealer.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { revealer.observe(el); });

  /* Count-up stats */
  var counter = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      counter.unobserve(e.target);
      var el = e.target;
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
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(function (el) { counter.observe(el); });

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
