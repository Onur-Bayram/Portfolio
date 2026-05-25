// Mobile navigation controller.
// Handles the burger button, overlay visibility, and matching ARIA states.
(function () {
  // Cache the two elements that are required to open and close the mobile menu.
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  // Toggle the menu and keep the button semantics in sync for screen readers.
  burger.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
    menu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close the overlay after navigation so the next section is visible immediately.
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Menü öffnen');
      menu.setAttribute('aria-hidden', 'true');
    });
  });
})();
