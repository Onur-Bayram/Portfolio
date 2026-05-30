// Testimonials slider.
// Renders cards from shared data and keeps the slider looping seamlessly in both directions.
(function () {
  // Collect the stage elements and navigation controls used by the slider.
  var track = document.getElementById('testimonialsTrack');
  var dotsEl = document.getElementById('testimonialsDots');
  var prev = document.getElementById('testimonialsPrev');
  var next = document.getElementById('testimonialsNext');

  if (!track) return;

  var DATA = window.TESTIMONIALS_DATA || [];
  var langEN = document.getElementById('langEN');
  if (!DATA.length) return;

  var hasLoopClones = DATA.length > 1;
  var current = DATA.length > 1 ? 1 : 0;
  var trackIndex = hasLoopClones ? current + 1 : current;

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

  function buildCard(testimonial, originalIndex, isClone) {
    var article = document.createElement('article');
    article.className = 'testimonial-card';
    article.setAttribute('data-testimonial-index', String(originalIndex));
    if (isClone) article.setAttribute('data-testimonial-clone', 'true');

    var quote = document.createElement('span');
    quote.className = 'testimonial-quote';
    quote.setAttribute('aria-hidden', 'true');
    quote.textContent = '\u201c';

    var text = buildTranslatedElement('p', 'testimonial-text', testimonial.text_de, testimonial.text_en);

    var author = document.createElement('div');
    author.className = 'testimonial-author';

    var line = document.createElement('span');
    line.className = 'testimonial-line';
    line.setAttribute('aria-hidden', 'true');

    var name = buildTranslatedElement('span', 'testimonial-name', testimonial.name_de, testimonial.name_en);

    author.appendChild(line);
    author.appendChild(name);
    article.appendChild(quote);
    article.appendChild(text);
    article.appendChild(author);
    return article;
  }

  // Add clones at both ends so the slider can wrap without leaving empty space.
  if (hasLoopClones) {
    track.appendChild(buildCard(DATA[DATA.length - 1], DATA.length - 1, true));
  }

  DATA.forEach(function (testimonial, index) {
    track.appendChild(buildCard(testimonial, index, false));
  });

  if (hasLoopClones) {
    track.appendChild(buildCard(DATA[0], 0, true));
  }

  // Build one navigation dot per real testimonial card.
  if (dotsEl) {
    DATA.forEach(function (_, index) {
      var btn = document.createElement('button');
      btn.className = 'dot' + (index === current ? ' is-active' : '');
      btn.setAttribute('aria-label', 'Testimonial ' + (index + 1));
      dotsEl.appendChild(btn);
    });
  }

  var cards = Array.from(track.querySelectorAll('.testimonial-card'));
  var dots = dotsEl ? Array.from(dotsEl.querySelectorAll('.dot')) : [];

  // Include margins in the width calculation because cards are spaced with outer gaps.
  function cardTotalWidth() {
    if (!cards[0]) return 0;
    var style = window.getComputedStyle(cards[0]);
    return cards[0].offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
  }

  function setTrackPosition(instant) {
    var container = track.parentElement;
    var cardWidth = cardTotalWidth();
    if (!container || !cardWidth) return;

    var containerWidth = container.offsetWidth;
    var offset = containerWidth / 2 - cardWidth * (trackIndex + 0.5);

    if (instant) {
      track.classList.add('is-resetting');
      track.style.transition = 'none';
      track.style.transform = 'translateX(' + offset + 'px)';
      // Force layout once so the jump is applied before transitions are restored.
      void track.offsetWidth;
      track.style.removeProperty('transition');
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          track.classList.remove('is-resetting');
        });
      });
      return;
    }

    track.style.removeProperty('transition');
    track.style.transform = 'translateX(' + offset + 'px)';
  }

  // Keep the active card and the matching dot synchronized with the logical current slide.
  function syncActiveState() {
    cards.forEach(function (card, index) {
      card.classList.toggle('is-active', index === trackIndex);
    });

    dots.forEach(function (dot, index) {
      dot.classList.toggle('is-active', index === current);
    });
  }

  function update(options) {
    var instant = options && options.instant;
    syncActiveState();
    setTrackPosition(instant);
  }

  function goTo(nextCurrent, nextTrackIndex) {
    current = nextCurrent;
    trackIndex = nextTrackIndex;
    update();
  }

  function goPrev() {
    if (!hasLoopClones) return;
    goTo((current - 1 + DATA.length) % DATA.length, trackIndex - 1);
  }

  function goNext() {
    if (!hasLoopClones) return;
    goTo((current + 1) % DATA.length, trackIndex + 1);
  }

  // Seamless wrap: once a clone reaches the middle, jump instantly to the matching real slide.
  track.addEventListener('transitionend', function (event) {
    if (event.propertyName !== 'transform' || !hasLoopClones) return;

    if (trackIndex === 0) {
      trackIndex = DATA.length;
      update({ instant: true });
      return;
    }

    if (trackIndex === DATA.length + 1) {
      trackIndex = 1;
      update({ instant: true });
    }
  });

  if (prev) {
    prev.addEventListener('click', function () {
      goPrev();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      goNext();
    });
  }

  // Dot controls jump directly to a specific testimonial.
  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      current = index;
      trackIndex = hasLoopClones ? index + 1 : index;
      update();
    });
  });

  // Clicking the visible side cards also advances the loop in the expected direction.
  cards.forEach(function (card, index) {
    card.addEventListener('click', function () {
      if (index === trackIndex) return;

      if (index < trackIndex) {
        current = (current - 1 + DATA.length) % DATA.length;
        trackIndex = index;
        update();
        return;
      }

      current = (current + 1) % DATA.length;
      trackIndex = index;
      update();
    });
  });

  // Recalculate the centering whenever the viewport changes size.
  window.addEventListener('resize', function () {
    update({ instant: true });
  });

  update({ instant: true });
})();
