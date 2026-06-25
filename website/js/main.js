/* DR. CODE — interactions */
(function () {
  'use strict';

  /* ---- Mobile nav toggle ---- */
  var burger = document.querySelector('.nav__burger');
  var links = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      q.closest('.faq-item').classList.toggle('open');
    });
  });

  /* ---- Form: validation + n8n webhook (email handoff) ---- */
  var form = document.querySelector('#ordonnance-form');
  if (form) {
    var ENDPOINT = 'https://n8n.cloudron.alpes-ia.fr/webhook/docteur-code-contact';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (input) {
        var field = input.closest('.field');
        var valid = input.value.trim() !== '';
        if (input.type === 'email') {
          valid = valid && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        }
        field.classList.toggle('invalid', !valid);
        if (!valid) ok = false;
      });
      if (!ok) {
        form.querySelector('.field.invalid input, .field.invalid select, .field.invalid textarea').focus();
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var errNote = form.querySelector('.form-error');
      if (errNote) errNote.hidden = true;
      if (btn) { btn.disabled = true; btn.textContent = 'Envoi en cours…'; }

      // Sent as form-urlencoded to avoid a CORS preflight on the n8n webhook
      var body = new URLSearchParams(new FormData(form)).toString();

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: body
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          var success = document.querySelector('.form-success');
          if (success) {
            form.style.display = 'none';
            success.classList.add('show');
          }
        })
        .catch(function () {
          if (errNote) errNote.hidden = false;
          if (btn) { btn.disabled = false; btn.textContent = '📋 Demander une consultation'; }
        });
    });

    form.querySelectorAll('[required]').forEach(function (input) {
      input.addEventListener('input', function () {
        input.closest('.field').classList.remove('invalid');
      });
    });
  }

  /* ---- Footer year ---- */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Auto-test copy (one or more boxes on the page) ---- */
  document.querySelectorAll('.autotest-box').forEach(function (box) {
    var code = box.querySelector('.autotest-code');
    var btn = box.querySelector('.autotest-copy-btn');
    var tooltip = box.querySelector('.autotest-tooltip');
    if (!code || !btn || !tooltip) return;

    function copy() {
      navigator.clipboard.writeText(code.dataset.copy).then(function () {
        tooltip.textContent = 'Copié !';
        tooltip.style.opacity = '1';
        setTimeout(function () {
          tooltip.style.opacity = '0';
          setTimeout(function () { tooltip.textContent = 'Copier'; }, 200);
        }, 800);
      });
    }

    btn.addEventListener('mouseenter', function () { tooltip.style.opacity = '1'; });
    btn.addEventListener('mouseleave', function () { tooltip.style.opacity = '0'; });
    btn.addEventListener('click', copy);
    code.addEventListener('click', copy);
  });
})();
