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
  /* Stagger grouped reveals (grids/strips) for a cascade effect */
  try {
    document.querySelectorAll('.grid, .stats, .logos, .footer-grid, #program-grid').forEach(function (group) {
      var kids = group.querySelectorAll(':scope > .reveal');
      kids.forEach(function (el, i) { el.style.transitionDelay = Math.min(i * 70, 340) + 'ms'; });
    });
  } catch (e) { /* :scope unsupported — skip stagger, reveals still work */ }
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

  /* ============================================================
     Filterable + searchable card lists (blog, events)
     Markup: a wrapper [data-list] containing .filter-btn[data-filter],
     an optional .list-search input, a [data-list-grid] of .pcard[data-cat],
     and an optional [data-list-empty] message.
     ============================================================ */
  function srNorm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  document.querySelectorAll('[data-list]').forEach(function (root) {
    var grid = root.querySelector('[data-list-grid]');
    if (!grid) return;
    var empty = root.querySelector('[data-list-empty]');
    var searchInput = root.querySelector('.list-search input');
    var filterBtns = [].slice.call(root.querySelectorAll('.filter-btn'));
    var cards = [].slice.call(grid.querySelectorAll('.pcard'));
    var activeFilter = 'all', query = '';
    function apply() {
      var shown = 0;
      cards.forEach(function (c) {
        var cats = (c.getAttribute('data-cat') || '').split(' ');
        var matchF = activeFilter === 'all' || cats.indexOf(activeFilter) !== -1;
        var hay = srNorm(c.getAttribute('data-search') || c.textContent);
        var matchQ = !query || hay.indexOf(query) !== -1;
        var show = matchF && matchQ;
        c.hidden = !show; if (show) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    }
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (x) { x.classList.remove('is-active'); });
        btn.classList.add('is-active');
        activeFilter = btn.getAttribute('data-filter') || 'all';
        apply();
      });
    });
    if (searchInput) searchInput.addEventListener('input', function () { query = srNorm(searchInput.value.trim()); apply(); });
    apply();
  });

  /* ============================================================
     Countdown timers (event detail pages)
     Markup: [data-countdown][data-deadline="ISO"] with children
     [data-cd-days], [data-cd-hours], [data-cd-mins], [data-cd-secs].
     ============================================================ */
  document.querySelectorAll('[data-countdown]').forEach(function (el) {
    var deadline = new Date(el.getAttribute('data-deadline'));
    if (isNaN(deadline.getTime())) return;
    var d = el.querySelector('[data-cd-days]'), h = el.querySelector('[data-cd-hours]'),
        m = el.querySelector('[data-cd-mins]'), s = el.querySelector('[data-cd-secs]');
    function pad(n) { return String(n).padStart(2, '0'); }
    function setN(node, val) { if (!node || node.textContent === val) return; node.textContent = val; node.classList.remove('c-flip'); void node.offsetWidth; node.classList.add('c-flip'); }
    function tick() {
      var diff = deadline - new Date();
      if (diff <= 0) { el.innerHTML = '<p style="color:var(--gold-soft);font-weight:700;font-size:1rem">Acest eveniment a început!</p>'; return; }
      setN(d, pad(Math.floor(diff / 86400000)));
      setN(h, pad(Math.floor(diff % 86400000 / 3600000)));
      setN(m, pad(Math.floor(diff % 3600000 / 60000)));
      setN(s, pad(Math.floor(diff % 60000 / 1000)));
      setTimeout(tick, 1000);
    }
    tick();
  });

  /* Event registration forms — mailto + inline success box */
  document.querySelectorAll('form[data-register]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var fields = [];
      form.querySelectorAll('input, textarea').forEach(function (f) {
        if (f.name && f.value) fields.push(f.name + ': ' + f.value);
      });
      var subj = form.getAttribute('data-subject') || 'Înscriere eveniment — saymararyon.com';
      window.location.href = 'mailto:contact@saymararyon.com?subject=' +
        encodeURIComponent(subj) + '&body=' + encodeURIComponent(fields.join('\n'));
      var box = form.parentNode.querySelector('.reg-success');
      if (box) { form.style.display = 'none'; box.classList.add('show'); }
    });
  });

  /* ============================================================
     Simply Be! assistant — lightweight scripted chat.
     Suggested questions refresh after each answer and never repeat.
     ============================================================ */
  (function initChat() {
    var QA = [
      { q: 'Ce este TRE®?', k: ['tre', 'tremur', 'somatic', 'berceli', 'trauma', 'tensiun', 'stres'],
        a: 'TRE® (Tension, Stress &amp; Trauma Release), în metoda dr. David Berceli, activează tremurul neurogenic natural al corpului pentru a elibera tensiunea, stresul și trauma — în siguranță. <a href="curs-tre-6-saptamani.html">Vezi programul de 6 săptămâni →</a>' },
      { q: 'Ce este metoda ReUnity MATRIX®?', k: ['reunity', 'matrix', 'metoda integrativ'],
        a: 'ReUnity MATRIX® este metoda integrativă creată de Saymara — un sistem pe patru dimensiuni (viziune, coerență, sustenabilitate, strategie) care aduce claritate, libertate și sens. <a href="reunity-matrix.html">Descoperă metoda →</a>' },
      { q: 'Cu ce mă poți ajuta?', k: ['ajuta', 'ajut', 'servici', 'oferi', 'ce faci'],
        a: 'Te însoțesc pe patru căi: coaching holistic, grupuri de lucru integrative, mentoring în dezvoltare sustenabilă și cursuri &amp; programe. <a href="despre.html">Vezi abordarea →</a>' },
      { q: 'Ce este coaching-ul holistic?', k: ['coaching', 'holistic', 'coach'],
        a: 'O călătorie de transformare care abordează ființa în întregime — minte, corp, suflet și emoții — dincolo de obiective punctuale, pentru echilibru și împlinire reală. <a href="despre.html#coaching">Detalii →</a>' },
      { q: 'Ce cursuri și programe ai?', k: ['cursuri', 'programe', 'curs', 'program'],
        a: 'De la Cartea Vieții Conștiente (autoghidat) la TRE® de 6 săptămâni, minicursul pentru facilitatori și programele ReUnity MATRIX®. <a href="cursuri-programe.html">Vezi toate programele →</a>' },
      { q: 'Ce evenimente urmează?', k: ['eveniment', 'workshop', 'masterclass', 'retreat', 'cand', 'data'],
        a: 'Organizez clase de TRE®, masterclass-uri, retreat-uri și formări — online și în persoană. Datele se anunță pe rând. <a href="evenimente.html">Vezi evenimentele →</a>' },
      { q: 'Cum te pot contacta?', k: ['contact', 'email', 'telefon', 'scriu', 'programare', 'rezerv'],
        a: 'Cu drag: scrie la <a href="mailto:contact@saymararyon.com">contact@saymararyon.com</a>, prin <a href="contact.html">formularul de contact</a> sau la telefon +40 742 064 924.' },
      { q: 'Unde ești localizată?', k: ['unde', 'locati', 'adresa', 'bucures', 'sediu', 'oras'],
        a: 'La Atelier de Suflet #44, București, Sector 3 — și online, oriunde te-ai afla. <a href="contact.html">Vezi harta →</a>' },
      { q: 'Care sunt prețurile?', k: ['pret', 'cost', 'tarif', 'bani', 'plata', 'cat costa'],
        a: 'Prețurile diferă de la un program la altul. Cel mai bine începem cu un call de descoperire, ca să-ți recomand ce ți se potrivește și costul exact. <a href="contact.html">Scrie-mi →</a>' },
      { q: 'Lucrezi online sau în persoană?', k: ['online', 'persoana', 'fizic', 'distanta', 'zoom'],
        a: 'Ambele — multe programe se pot face online, iar unele (ca TRE® la Sambodhi Studio) se desfășoară și în persoană, la București.' },
      { q: 'Cine este Saymara?', k: ['cine este', 'cine e', 'saymara', 'iulia', 'despre tine'],
        a: 'Saymara B. Ryon (H.M. Iulia Ioana) — coach holistic, facilitator TRE® și fondatoarea metodei ReUnity MATRIX®, cu peste 20 de ani în dezvoltarea potențialului uman. <a href="despre.html">Despre mine →</a>' },
      { q: 'Ce este art-terapia?', k: ['art', 'terapie', 'creati', 'pictura'],
        a: 'Un vehicul de autocunoaștere prin creație — pictură, sunet, mișcare, Points of You® și Mandale de Lumină — într-un spațiu sigur, fără judecăți. <a href="despre.html#art-terapie">Detalii →</a>' },
      { q: 'Ce este Aspectologia®?', k: ['aspectolog', 'crimson', 'aspecte'],
        a: '„Psihologia noii conștiințe" — o metodă de a înțelege și integra aspectele sinelui, în învățăturile Crimson Circle®. <a href="despre.html#aspectologie">Detalii →</a>' },
      { q: 'Ce este metoda Resonanz®?', k: ['resonanz', 'kutschera', 'comunicare'],
        a: 'O abordare holistică fondată de dr. Gundl Kutschera (Institut Kutschera Austria) pentru armonie interioară și comunicare, bazată pe neuroștiințe. <a href="despre.html#resonanz">Detalii →</a>' },
      { q: 'Ce sunt Mandalele de Lumină?', k: ['mandala', 'mandale', 'lumina'],
        a: 'Instrumente bio-rezonatoare pe care le creezi și le folosești pentru echilibru și reconectare interioară — accesând deopotrivă logica și emoția.' },
      { q: 'Ce este Points of You® (POY)?', k: ['points of you', 'poy'],
        a: 'O metodă care folosește legăturile dintre o fotografie și un cuvânt pentru a-ți lărgi perspectivele și a debloca noi variante de a acționa.' },
      { q: 'E nevoie de un call de descoperire?', k: ['call', 'descoperire', 'discovery', 'consult', 'prima'],
        a: 'Da — înainte de orice program avem o discuție scurtă, ca să vedem împreună ce se potrivește momentului și nevoilor tale. <a href="contact.html">Programează →</a>' },
      { q: 'În ce limbi lucrezi?', k: ['limba', 'limbi', 'engleza', 'romana', 'language'],
        a: 'În română și engleză.' },
      { q: 'Cu cine lucrezi?', k: ['cu cine lucrezi', 'pentru cine', 'potrivit', 'client'],
        a: 'Cu oameni conștienți, aflați într-un moment de tranziție sau decizie profundă — care au bifat tot, dar simt că au pierdut ceva esențial pe drum.' },
      { q: 'Ce este Cartea Vieții Conștiente?', k: ['cartea', 'vietii', 'constiente', 'planner', 'autoghidat'],
        a: 'Un program holistic autoghidat de 12 teme — planner, carte inspirațională, caiet art-terapeutic și Mandale de Lumină, în ritmul tău. <a href="curs-cartea-vietii-constiente.html">Vezi programul →</a>' },
      { q: 'Cât durează programul TRE®?', k: ['cat dureaza', 'durata', 'saptamani', 'sesiuni'],
        a: 'Programul „Redescoperă Echilibrul cu TRE®" durează 6 săptămâni (6 sesiuni, vinerea), în grup restrâns la Sambodhi Studio. <a href="curs-tre-6-saptamani.html">Detalii →</a>' },
      { q: 'Pot primi ceva gratuit?', k: ['gratuit', 'ebook', 'free', 'bonus', 'cadou'],
        a: 'Da — poți primi gratuit eBook-ul „Eu sunt EU și e OK!" și te poți abona la newsletter pentru resurse și invitații.' },
      { q: 'Ce e minicursul pentru facilitatori?', k: ['minicurs', 'facilitator', 'grupuri'],
        a: 'Te învață să conduci grupuri cu încredere, structură și autenticitate — cele 10 reguli de aur, design de curs și acces la comunitate. <a href="curs-minicurs-facilitatori.html">Detalii →</a>' },
      { q: 'Care e diferența între coaching și mentoring?', k: ['diferenta', 'mentoring', 'mentorat', 'versus', 'vs'],
        a: 'Coaching-ul te ghidează să-ți găsești singur răspunsurile; mentoring-ul adaugă transferul experienței, ca de la maestru la discipol, pe un parcurs de 3–9 luni.' },
      { q: 'Ce este retreatul Dorința Inimii®?', k: ['dorinta', 'inimii', 'retreat'],
        a: 'Un retreat de grup pe module, în metoda ReUnity MATRIX® — o călătorie de reconectare cu dorința profundă a inimii și cu propriul potențial.' },
      { q: 'Cum mă abonez la newsletter?', k: ['abonez', 'newsletter', 'abonare', 'inbox'],
        a: 'Completează adresa de e-mail în secțiunea „Înscrie-te la newsletter" din subsolul oricărei pagini — primești inspirație și invitații la programe.' }
    ];
    var GREETING = 'Bună! 🌿 Sunt asistentul Simply Be!. Te pot ajuta cu informații despre programe, TRE®, ReUnity MATRIX® și cum putem lucra împreună. Alege o întrebare de mai jos sau scrie-mi.';
    var FALLBACK = 'Bună întrebare! Nu am un răspuns pregătit pentru asta, dar Saymara îți răspunde cu drag — scrie la <a href="mailto:contact@saymararyon.com">contact@saymararyon.com</a> sau alege una dintre întrebările sugerate.';

    function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

    var used = {};        // indices already asked — never suggested again
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<button class="chat-fab" aria-label="Deschide chatul" aria-expanded="false">' +
        '<span class="chat-ping"></span>' +
        '<svg class="ic-open" viewBox="0 0 24 24"><path d="M12 3C6.5 3 2 6.7 2 11.3c0 2.3 1.2 4.4 3.1 5.9-.1 1.2-.6 2.5-1.6 3.6 1.8-.2 3.4-.9 4.7-1.9 1.2.4 2.5.6 3.8.6 5.5 0 10-3.7 10-8.3S17.5 3 12 3z"/></svg>' +
        '<svg class="ic-close" viewBox="0 0 24 24"><path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"/></svg>' +
      '</button>' +
      '<section class="chat-panel" role="dialog" aria-label="Asistent Simply Be!">' +
        '<div class="chat-head">' +
          '<span class="chat-ava"><img src="images/symbol_colour.png" alt=""></span>' +
          '<div class="chat-title"><b>Asistent Simply Be!</b><small>online, îți răspunde acum</small></div>' +
          '<button class="chat-x" aria-label="Închide chatul">&times;</button>' +
        '</div>' +
        '<div class="chat-body" id="chatBody"></div>' +
        '<div class="chat-suggests" id="chatSuggests"></div>' +
        '<form class="chat-input" id="chatForm">' +
          '<input type="text" id="chatText" placeholder="Scrie o întrebare…" autocomplete="off" aria-label="Scrie o întrebare">' +
          '<button type="submit" aria-label="Trimite"><svg viewBox="0 0 24 24"><path d="M3 20.5 21 12 3 3.5 3 10l12 2-12 2z"/></svg></button>' +
        '</form>' +
      '</section>';
    document.body.appendChild(wrap);

    var fab = wrap.querySelector('.chat-fab');
    var panel = wrap.querySelector('.chat-panel');
    var body = wrap.querySelector('#chatBody');
    var sugg = wrap.querySelector('#chatSuggests');
    var form = wrap.querySelector('#chatForm');
    var text = wrap.querySelector('#chatText');
    var greeted = false;

    function scrollDown() { body.scrollTop = body.scrollHeight; }
    function addMsg(html, who) {
      var m = document.createElement('div');
      m.className = 'chat-msg ' + who;
      m.innerHTML = html;
      body.appendChild(m);
      scrollDown();
      return m;
    }
    function botReply(html) {
      var t = document.createElement('div');
      t.className = 'chat-typing';
      t.innerHTML = '<i></i><i></i><i></i>';
      body.appendChild(t); scrollDown();
      setTimeout(function () { t.remove(); addMsg(html, 'bot'); }, 600);
    }
    function renderChips() {
      sugg.innerHTML = '';
      var pool = [];
      for (var i = 0; i < QA.length; i++) if (!used[i]) pool.push(i);
      if (!pool.length) {
        var done = document.createElement('p');
        done.textContent = 'Ai explorat toate întrebările 🎉 Scrie-mi orice altceva sau contactează-mă direct.';
        sugg.appendChild(done);
        return;
      }
      var label = document.createElement('p');
      label.textContent = 'Întrebări sugerate';
      sugg.appendChild(label);
      pool.slice(0, 3).forEach(function (idx) {
        var c = document.createElement('button');
        c.type = 'button';
        c.className = 'chat-chip';
        c.textContent = QA[idx].q;
        c.addEventListener('click', function () { answer(idx, QA[idx].q); });
        sugg.appendChild(c);
      });
    }
    function answer(idx, userText) {
      addMsg(escapeHtml(userText), 'user');
      used[idx] = true;
      botReply(QA[idx].a);
      renderChips();
    }
    function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    function match(input) {
      var n = norm(input), best = -1, score = 0;
      for (var i = 0; i < QA.length; i++) {
        var s = 0, k = QA[i].k;
        for (var j = 0; j < k.length; j++) if (n.indexOf(norm(k[j])) !== -1) s++;
        if (norm(QA[i].q).indexOf(n) !== -1 && n.length > 4) s += 2;
        if (s > score) { score = s; best = i; }
      }
      return score > 0 ? best : -1;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = text.value.trim();
      if (!v) return;
      text.value = '';
      var idx = match(v);
      if (idx !== -1) {
        addMsg(escapeHtml(v), 'user');
        used[idx] = true;
        botReply(QA[idx].a);
        renderChips();
      } else {
        addMsg(escapeHtml(v), 'user');
        botReply(FALLBACK);
      }
    });

    function openChat() {
      document.body.classList.add('chat-open', 'chat-seen');
      fab.setAttribute('aria-expanded', 'true');
      if (!greeted) { greeted = true; botReply(GREETING); renderChips(); }
      setTimeout(function () { if (window.innerWidth > 560) text.focus(); }, 350);
    }
    function closeChat() {
      document.body.classList.remove('chat-open');
      fab.setAttribute('aria-expanded', 'false');
    }
    fab.addEventListener('click', function () {
      document.body.classList.contains('chat-open') ? closeChat() : openChat();
    });
    wrap.querySelector('.chat-x').addEventListener('click', closeChat);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('chat-open')) closeChat();
    });
  })();
})();
