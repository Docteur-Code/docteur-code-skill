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

  /* ---- Form: validation + wa.me handoff ---- */
  var form = document.querySelector('#ordonnance-form');
  if (form) {
    var WHATSAPP_NUMBER = '33658323806';

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

      var get = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ''; };
      var msg =
        'Bonjour Docteur Code ! Voici ma demande de consultation :\n\n' +
        'Nom : ' + get('nom') + '\n' +
        'Projet : ' + get('projet') + '\n' +
        'Outil IA utilisé : ' + (get('outil') || 'non précisé') + '\n' +
        'Symptômes : ' + get('symptomes');

      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);

      var success = document.querySelector('.form-success');
      if (success) {
        form.style.display = 'none';
        success.classList.add('show');
        var waLink = success.querySelector('[data-wa]');
        if (waLink) waLink.href = url;
      }
      window.open(url, '_blank', 'noopener');
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
})();
