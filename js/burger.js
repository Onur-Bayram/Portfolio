// Mobile menu.
(function () {
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  /**
   * Opens or closes the mobile menu.
   *
   * @param {boolean} isOpen Menu state.
   */
  function setMenuState(isOpen) {
    burger.classList.toggle('open', isOpen);
    menu.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', getBurgerLabel(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
  }

  /**
   * Returns the translated burger label.
   *
   * @param {boolean} isOpen Menu state.
   * @returns {string}
   */
  function getBurgerLabel(isOpen) {
    var isGerman = document.documentElement.lang === 'de';
    if (isGerman) {
      return isOpen ? 'Men\u00fc schlie\u00dfen' : 'Men\u00fc \u00f6ffnen';
    }

    return isOpen ? 'Close menu' : 'Open menu';
  }

  burger.addEventListener('click', function () {
    setMenuState(!menu.classList.contains('open'));
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setMenuState(false);
    });
  });

  document.addEventListener('site:langchange', function () {
    setMenuState(menu.classList.contains('open'));
  });

  setMenuState(false);
})();
