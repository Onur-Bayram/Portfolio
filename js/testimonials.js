(function () {
  var track = document.getElementById('testimonialsTrack');
  var dotsEl = document.getElementById('testimonialsDots');
  var prev = document.getElementById('testimonialsPrev');
  var next = document.getElementById('testimonialsNext');

  if (!track) return;

  var DATA = window.TESTIMONIALS_DATA || [];
  var langEN = document.getElementById('langEN');

  // Render cards from data
  DATA.forEach(function (t, index) {
    var article = document.createElement('article');
    article.className = 'testimonial-card' + (index === 1 ? ' is-active' : '');
    article.setAttribute('data-testimonial-index', String(index));
    article.innerHTML =
      '<p class="testimonial-text" data-lang-de="' + t.text_de.replace(/"/g, '&quot;') + '" data-lang-en="' + t.text_en.replace(/"/g, '&quot;') + '">' +
        (langEN && langEN.classList.contains('is-active') ? t.text_en : t.text_de) +
      '</p>' +
      '<span class="testimonial-name">' + t.name_de + '</span>';
    track.appendChild(article);
  });

  if (dotsEl) {
    DATA.forEach(function (_, index) {
      var btn = document.createElement('button');
      btn.className = 'dot' + (index === 1 ? ' is-active' : '');
      btn.setAttribute('aria-label', 'Testimonial ' + (index + 1));
      dotsEl.appendChild(btn);
    });
  }

  var cards = Array.from(track.querySelectorAll('.testimonial-card'));
  var dots = dotsEl ? Array.from(dotsEl.querySelectorAll('.dot')) : [];
  var current = 1;

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
