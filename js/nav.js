// Active navigation tracker.
// Highlights the desktop navigation item that matches the section currently in view.
(function () {
  var navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (!navLinks.length) return;

  // Pair each anchor with its matching section element for later observation.
  var sectionMap = navLinks
    .map(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      return section ? { id: id, link: link, section: section } : null;
    })
    .filter(Boolean);

  if (!sectionMap.length) return;

  // Only one navigation link should look active at a time.
  function setActive(id) {
    navLinks.forEach(function (link) {
      var isMatch = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', isMatch);
    });
  }

  // Clicking a link updates the visual state immediately, even before scrolling settles.
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      var id = link.getAttribute('href').slice(1);
      setActive(id);
    });
  });

  // Observe visibility changes and promote the most visible section to the active nav state.
  var observer = new IntersectionObserver(
    function (entries) {
      var visible = entries
        .filter(function (entry) {
          return entry.isIntersecting;
        })
        .sort(function (a, b) {
          return b.intersectionRatio - a.intersectionRatio;
        });

      if (!visible.length) return;
      setActive(visible[0].target.id);
    },
    {
      root: null,
      rootMargin: '-35% 0px -50% 0px',
      threshold: [0.2, 0.4, 0.6]
    }
  );

  sectionMap.forEach(function (item) {
    observer.observe(item.section);
  });
})();
