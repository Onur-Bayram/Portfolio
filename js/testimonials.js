// Testimonials slider.
// Renders cards from shared data and centers the active testimonial inside the viewport.
(function () {
  // Collect the stage elements and navigation controls used by the slider.
  var track = document.getElementById('testimonialsTrack');
  var dotsEl = document.getElementById('testimonialsDots');
  var prev = document.getElementById('testimonialsPrev');
  var next = document.getElementById('testimonialsNext');

  if (!track) return;

  var DATA = window.TESTIMONIALS_DATA || [];
  var langEN = document.getElementById('langEN');

  // Read the initial language from the shared toggle so cards render in the correct locale on load.
  function translatedValue(textDE, textEN) {
    return langEN && langEN.classList.contains('is-active') ? textEN : textDE;
  }

  // Dynamic testimonial nodes use the same data-de / data-en contract as the static page copy.
  function buildTranslatedElement(tagName, className, textDE, textEN) {
    var element = document.createElement(tagName);
    element.className = className;
    element.dataset.de = textDE;
    element.dataset.en = textEN;
    element.textContent = translatedValue(textDE, textEN);
    return element;
  }

  // Build all testimonial cards from the shared data set.
  DATA.forEach(function (t, index) {
    var article = document.createElement('article');
    article.className = 'testimonial-card' + (index === 1 ? ' is-active' : '');
    article.setAttribute('data-testimonial-index', String(index));

    var quote = document.createElement('span');
    quote.className = 'testimonial-quote';
    quote.setAttribute('aria-hidden', 'true');
    quote.textContent = '“';

    var text = buildTranslatedElement('p', 'testimonial-text', t.text_de, t.text_en);

    var author = document.createElement('div');
    author.className = 'testimonial-author';

    var line = document.createElement('span');
    line.className = 'testimonial-line';
    line.setAttribute('aria-hidden', 'true');

    var name = buildTranslatedElement('span', 'testimonial-name', t.name_de, t.name_en);

    author.appendChild(line);
    author.appendChild(name);
    article.appendChild(quote);
    article.appendChild(text);
    article.appendChild(author);
    track.appendChild(article);
  });

  // Build one navigation dot per testimonial card.
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

  // Include margins in the width calculation because cards are spaced with outer gaps.
  function cardTotalWidth() {
    if (!cards[0]) return 0;
    var style = window.getComputedStyle(cards[0]);
    return cards[0].offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
  }

  // Shift the track so the active card sits in the center of the visible stage.
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

  // Arrow controls move backward and forward through the looped data set.
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

  // Dot controls jump directly to a specific testimonial.
  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      current = index;
      update();
    });
  });

  // Recalculate the centering whenever the viewport changes size.
  window.addEventListener('resize', update);
  update();
})();
