(function () {
  var navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (!navLinks.length) return;

  var sectionMap = navLinks
    .map(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      return section ? { id: id, link: link, section: section } : null;
    })
    .filter(Boolean);

  if (!sectionMap.length) return;

  function setActive(id) {
    navLinks.forEach(function (link) {
      var isMatch = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', isMatch);
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      var id = link.getAttribute('href').slice(1);
      setActive(id);
    });
  });

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
