(function () {
  var btnEN = document.getElementById('langEN');
  var btnDE = document.getElementById('langDE');
  if (!btnEN || !btnDE) return;

  function setLang(lang) {
    var isEN = lang === 'en';
    btnEN.classList.toggle('is-active', isEN);
    btnDE.classList.toggle('is-active', !isEN);
    btnEN.setAttribute('aria-pressed', String(isEN));
    btnDE.setAttribute('aria-pressed', String(!isEN));

    document.querySelectorAll('[data-en][data-de]').forEach(function (el) {
      el.innerHTML = isEN ? el.dataset.en : el.dataset.de;
    });
  }

  btnEN.addEventListener('click', function () {
    setLang('en');
  });

  btnDE.addEventListener('click', function () {
    setLang('de');
  });
})();
