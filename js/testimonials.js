(function () {
  var track = document.getElementById('testimonialsTrack');
  var dotsEl = document.getElementById('testimonialsDots');
  var prev = document.getElementById('testimonialsPrev');
  var next = document.getElementById('testimonialsNext');

  if (!track) return;

  var cards = Array.from(track.querySelectorAll('.testimonial-card'));
  var dots = dotsEl ? Array.from(dotsEl.querySelectorAll('.dot')) : [];
  var current = cards.length ? Math.floor(cards.length / 2) : 0;

  function cardTotalWidth() {
    if (!cards[0]) return 0;
    var style = window.getComputedStyle(cards[0]);
    return cards[0].offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
  }

  function update() {
    var containerWidth = track.parentElement.offsetWidth;
    var cardWidth = cardTotalWidth();
    var offset = containerWidth / 2 - cardWidth * (current + 0.5);
    track.style.transform = 'translateX(' + offset + 'px)';

    cards.forEach(function (card, index) {
      card.classList.toggle('is-active', index === current);
    });

    dots.forEach(function (dot, index) {
      dot.classList.toggle('is-active', index === current);
    });
  }

  if (prev) {
    prev.addEventListener('click', function () {
      current = (current - 1 + cards.length) % cards.length;
      update();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      current = (current + 1) % cards.length;
      update();
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      current = index;
      update();
    });
  });

  window.addEventListener('resize', update);
  update();
})();
