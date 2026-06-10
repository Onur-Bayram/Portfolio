// Language switch.
(function () {
  var btnEN = document.getElementById('langEN');
  var btnDE = document.getElementById('langDE');
  if (!btnEN || !btnDE) return;

  var storageKey = 'portfolio-language';

  /**
   * Reads the saved language if localStorage is available.
   *
   * @returns {'en'|'de'|''}
   */
  function getSavedLang() {
    try {
      var savedLang = window.localStorage.getItem(storageKey);
      return savedLang === 'de' || savedLang === 'en' ? savedLang : '';
    } catch (error) {
      return '';
    }
  }

  /**
   * Saves the active language for the next visit.
   *
   * @param {'en'|'de'} lang Language code.
   */
  function saveLang(lang) {
    try {
      window.localStorage.setItem(storageKey, lang);
    } catch (error) {
      // localStorage can be blocked in private browsing, the page still works without it.
    }
  }

  /**
   * Applies the selected language to the page.
   *
   * @param {'en'|'de'} lang Language code.
   */
  function setLang(lang) {
    var isEN = lang === 'en';
    saveLang(lang);
    btnEN.classList.toggle('is-active', isEN);
    btnDE.classList.toggle('is-active', !isEN);
    btnEN.setAttribute('aria-pressed', String(isEN));
    btnDE.setAttribute('aria-pressed', String(!isEN));
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      var isActive = btn.dataset.lang === lang;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
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

  setLang(getSavedLang() || (btnEN.classList.contains('is-active') ? 'en' : 'de'));
})();
