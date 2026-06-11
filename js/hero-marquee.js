// Hero marquee.
(function () {
  var marquee = document.querySelector('.hero-marquee');
  var track = marquee ? marquee.querySelector('.hero-marquee-track') : null;
  var templateGroup = track ? track.querySelector('.hero-marquee-group') : null;
  var rebuildFrame = 0;

  if (!marquee || !track || !templateGroup) return;

  templateGroup.setAttribute('data-marquee-template', 'true');

  /**
   * Reads the active horizontal gap between marquee groups.
   *
   * @returns {number} Gap size in pixels.
   */
  function getTrackGap() {
    var styles = window.getComputedStyle(track);
    var gap = styles.columnGap && styles.columnGap !== 'normal' ? styles.columnGap : styles.gap;
    return parseFloat(gap) || 0;
  }

  /**
   * Removes previously generated marquee clones.
   */
  function clearClones() {
    Array.from(track.querySelectorAll('.hero-marquee-group[data-marquee-clone="true"]')).forEach(function (group) {
      group.remove();
    });
  }

  /**
   * Rebuilds the marquee so the track stays long enough for a seamless loop.
   */
  function buildMarquee() {
    clearClones();
    marquee.classList.remove('is-ready');

    var marqueeWidth = marquee.getBoundingClientRect().width;
    var groupWidth = templateGroup.getBoundingClientRect().width;
    var groupGap = getTrackGap();

    if (!marqueeWidth || !groupWidth) return;

    var travelDistance = groupWidth + groupGap;
    var totalTrackWidth = groupWidth;
    var groupCount = 1;

    while (groupCount < 2 || totalTrackWidth < marqueeWidth + travelDistance) {
      var clone = templateGroup.cloneNode(true);
      clone.setAttribute('data-marquee-clone', 'true');
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
      totalTrackWidth += groupWidth + groupGap;
      groupCount += 1;
    }

    track.style.setProperty('--marquee-distance', travelDistance + 'px');
    marquee.classList.add('is-ready');
  }

  /**
   * Schedules a marquee rebuild once per frame.
   */
  function scheduleBuild() {
    if (rebuildFrame) {
      window.cancelAnimationFrame(rebuildFrame);
    }

    rebuildFrame = window.requestAnimationFrame(function () {
      rebuildFrame = 0;
      buildMarquee();
    });
  }

  window.addEventListener('resize', scheduleBuild);
  window.addEventListener('load', scheduleBuild);
  document.addEventListener('site:langchange', scheduleBuild);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleBuild);
  }

  scheduleBuild();
})();
