// Mobile navigation controller.
// Handles the burger button, overlay visibility, and matching ARIA states.
(function () {
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  /**
   * Synchronizes the mobile menu visibility with the burger button state and ARIA attributes.
   *
   * @param {boolean} isOpen Controls whether the mobile navigation overlay is visible.
   * @returns {void}
   */
  function setMenuState(isOpen) {
    burger.classList.toggle('open', isOpen);
    menu.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Men\u00fc schlie\u00dfen' : 'Men\u00fc \u00f6ffnen');
    menu.setAttribute('aria-hidden', String(!isOpen));
  }

  burger.addEventListener('click', function () {
    setMenuState(!menu.classList.contains('open'));
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setMenuState(false);
    });
  });
})();
