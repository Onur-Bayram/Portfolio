(function () {
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  burger.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
    menu.setAttribute('aria-hidden', String(!isOpen));
  });

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
