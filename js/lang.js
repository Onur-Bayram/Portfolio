// Language switch.
(function () {
  var btnEN = document.getElementById('langEN');
  var btnDE = document.getElementById('langDE');
  if (!btnEN || !btnDE) return;

  /**
   * Applies the selected language to the page.
   *
   * @param {'en'|'de'} lang Language code.
   */
  function setLang(lang) {
    var isEN = lang === 'en';
    btnEN.classList.toggle('is-active', isEN);
    btnDE.classList.toggle('is-active', !isEN);
    btnEN.setAttribute('aria-pressed', String(isEN));
    btnDE.setAttribute('aria-pressed', String(!isEN));
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.lang === lang);
    });

    document.querySelectorAll('[data-en][data-de]').forEach(function (el) {
      el.innerHTML = isEN ? el.dataset.en : el.dataset.de;
    });

    document.querySelectorAll('[data-placeholder-en][data-placeholder-de]').forEach(function (el) {
      el.setAttribute('placeholder', isEN ? el.dataset.placeholderEn : el.dataset.placeholderDe);
    });

    document.querySelectorAll('[data-aria-en][data-aria-de]').forEach(function (el) {
      el.setAttribute('aria-label', isEN ? el.dataset.ariaEn : el.dataset.ariaDe);
    });

    var titleEl = document.querySelector('title[data-title-en][data-title-de]');
    if (titleEl) {
      titleEl.textContent = isEN ? titleEl.dataset.titleEn : titleEl.dataset.titleDe;
    }

    if (window.updateProjectLanguage) {
      window.updateProjectLanguage();
    }

    document.dispatchEvent(new CustomEvent('site:langchange', { detail: { lang: lang } }));
  }

  btnEN.addEventListener('click', function () {
    setLang('en');
  });

  btnDE.addEventListener('click', function () {
    setLang('de');
  });

  document.querySelectorAll('[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.dataset.lang);
    });
  });

  setLang(btnEN.classList.contains('is-active') ? 'en' : 'de');
})();
