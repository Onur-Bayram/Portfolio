// Testimonials slider.
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

  /**
   * Returns the text for the active language.
   *
   * @param {string} textDE German text.
   * @param {string} textEN English text.
   * @returns {string}
   */
  function translatedValue(textDE, textEN) {
    return langEN && langEN.classList.contains('is-active') ? textEN : textDE;
  }

  /**
   * Creates an element with both language variants.
   *
   * @param {string} tagName Element tag.
   * @param {string} className CSS class.
   * @param {string} textDE German text.
   * @param {string} textEN English text.
   * @returns {HTMLElement}
   */
  function buildTranslatedElement(tagName, className, textDE, textEN) {
    var element = document.createElement(tagName);
    element.className = className;
    element.dataset.de = textDE;
    element.dataset.en = textEN;
    element.textContent = translatedValue(textDE, textEN);
    return element;
  }

  /**
   * Builds one testimonial card.
   *
   * @param {TestimonialEntry} testimonial Testimonial data.
   * @param {number} originalIndex Real item index.
   * @param {boolean} isClone Whether the card is a clone.
   * @returns {HTMLElement}
   */
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

  if (hasLoopClones) {
    track.appendChild(buildCard(DATA[DATA.length - 1], DATA.length - 1, true));
  }

  DATA.forEach(function (testimonial, index) {
    track.appendChild(buildCard(testimonial, index, false));
  });

  if (hasLoopClones) {
    track.appendChild(buildCard(DATA[0], 0, true));
  }

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

  /**
   * Returns the rendered card width including margins.
   *
   * @returns {number}
   */
  function cardTotalWidth() {
    if (!cards[0]) return 0;
    var style = window.getComputedStyle(cards[0]);
    return cards[0].offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
  }

  /**
   * Centers the active card.
   *
   * @param {boolean} instant Whether to skip the transition.
   */
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

  /**
   * Updates active card and dot states.
   */
  function syncActiveState() {
    cards.forEach(function (card, index) {
      card.classList.toggle('is-active', index === trackIndex);
    });

    dots.forEach(function (dot, index) {
      dot.classList.toggle('is-active', index === current);
    });
  }

  /**
   * Updates the slider UI.
   *
   * @param {{instant?: boolean}=} options Render options.
   */
  function update(options) {
    var instant = options && options.instant;
    syncActiveState();
    setTrackPosition(instant);
  }

  /**
   * Moves the slider to a specific item.
   *
   * @param {number} nextCurrent Logical item index.
   * @param {number} nextTrackIndex Rendered track index.
   */
  function goTo(nextCurrent, nextTrackIndex) {
    current = nextCurrent;
    trackIndex = nextTrackIndex;
    update();
  }

  /**
   * Moves to the previous testimonial.
   */
  function goPrev() {
    if (!hasLoopClones) return;
    goTo((current - 1 + DATA.length) % DATA.length, trackIndex - 1);
  }

  /**
   * Moves to the next testimonial.
   */
  function goNext() {
    if (!hasLoopClones) return;
    goTo((current + 1) % DATA.length, trackIndex + 1);
  }

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

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      current = index;
      trackIndex = hasLoopClones ? index + 1 : index;
      update();
    });
  });

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

  window.addEventListener('resize', function () {
    update({ instant: true });
  });

  update({ instant: true });
})();
