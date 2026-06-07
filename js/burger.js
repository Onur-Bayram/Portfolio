// Mobile menu.
(function () {
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  var header = document.getElementById('header');
  if (!burger || !menu || !header) return;

  var backdrop = header.querySelector('.mobile-menu-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-menu-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    header.appendChild(backdrop);
  }

  var backgroundRoots = Array.from(document.body.children).filter(function (node) {
    return node !== header && node.tagName !== 'SCRIPT';
  });

  /**
   * Makes the page behind the menu inert or interactive again.
   *
   * @param {boolean} isInert Whether the background should be inert.
   */
  function setBackgroundInert(isInert) {
    backgroundRoots.forEach(function (node) {
      if (isInert) {
        node.setAttribute('inert', '');
        return;
      }

      node.removeAttribute('inert');
    });
  }

  /**
   * Locks page scrolling while the mobile menu is open.
   */
  function lockMobileMenu() {
    document.documentElement.classList.add('is-mobile-menu-open');
    document.body.classList.add('is-mobile-menu-open');
  }

  /**
   * Releases the page scroll lock.
   */
  function unlockMobileMenu() {
    document.documentElement.classList.remove('is-mobile-menu-open');
    document.body.classList.remove('is-mobile-menu-open');
  }

  /**
   * Opens or closes the mobile menu.
   *
   * @param {boolean} isOpen Menu state.
   */
  function setMenuState(isOpen) {
    burger.classList.toggle('open', isOpen);
    menu.classList.toggle('open', isOpen);
    backdrop.classList.toggle('is-visible', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', getBurgerLabel(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
    backdrop.setAttribute('aria-hidden', String(!isOpen));

    if (isOpen) {
      lockMobileMenu();
      setBackgroundInert(true);
      return;
    }

    unlockMobileMenu();
    setBackgroundInert(false);
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

  backdrop.addEventListener('click', function () {
    setMenuState(false);
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setMenuState(false);
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu.classList.contains('open')) {
      setMenuState(false);
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1200 && menu.classList.contains('open')) {
      setMenuState(false);
    }
  });

  document.addEventListener('site:langchange', function () {
    setMenuState(menu.classList.contains('open'));
  });

  setMenuState(false);
})();
