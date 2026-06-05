// Shared language switcher.
// Copies text, placeholders, and ARIA labels from data attributes into the live DOM.
(function () {
  var btnEN = document.getElementById('langEN');
  var btnDE = document.getElementById('langDE');
  if (!btnEN || !btnDE) return;

  // Apply the chosen language across all supported elements on the page.
  /**
   * Replaces translated copy, placeholders, and ARIA labels for the selected language.
   *
   * @param {'en'|'de'} lang The language code that should be rendered in the DOM.
   * @returns {void}
   */
  function setLang(lang) {
    var isEN = lang === 'en';
    btnEN.classList.toggle('is-active', isEN);
    btnDE.classList.toggle('is-active', !isEN);
    btnEN.setAttribute('aria-pressed', String(isEN));
    btnDE.setAttribute('aria-pressed', String(!isEN));

    // Keep the mobile language chips visually synchronized with the desktop toggle.
    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.lang === lang);
    });

    // Replace inner HTML so links and inline markup inside translated copy still render.
    document.querySelectorAll('[data-en][data-de]').forEach(function (el) {
      el.innerHTML = isEN ? el.dataset.en : el.dataset.de;
    });

    // Inputs and textareas read their translated placeholder from dedicated data attributes.
    document.querySelectorAll('[data-placeholder-en][data-placeholder-de]').forEach(function (el) {
      el.setAttribute('placeholder', isEN ? el.dataset.placeholderEn : el.dataset.placeholderDe);
    });

    // Some controls expose translated accessibility labels separately from visible text.
    document.querySelectorAll('[data-aria-en][data-aria-de]').forEach(function (el) {
      el.setAttribute('aria-label', isEN ? el.dataset.ariaEn : el.dataset.ariaDe);
    });

    // The projects module exposes a refresh hook because its content is rendered dynamically.
    if (window.updateProjectLanguage) {
      window.updateProjectLanguage();
    }
  }

  // Desktop language toggle buttons.
  btnEN.addEventListener('click', function () {
    setLang('en');
  });

  btnDE.addEventListener('click', function () {
    setLang('de');
  });

  // Mobile menu language chips call the same shared language function.
  document.querySelectorAll('[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.dataset.lang);
    });
  });

  setLang(btnEN.classList.contains('is-active') ? 'en' : 'de');
})();
