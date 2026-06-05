// Looping CTA label.
(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var ctas = Array.prototype.slice.call(document.querySelectorAll('.btn-loop-cta'));

  if (!ctas.length) return;

  ctas.forEach(function (button) {
    var measure = button.querySelector('.btn-loop-measure');
    var track = button.querySelector('.btn-loop-track');
    var frameId = 0;
    var lastTime = 0;
    var offset = 0;
    var idleOffset = 0;
    var idleTop = 0;
    var resetOffset = 0;
    var segmentWidth = 0;

    var speed = 110;
    var returnSpeed = 220;

    if (!measure || !track) return;

    /**
     * Rebuilds the moving label.
     */
    function buildTrack() {
      var label = measure.textContent.trim();
      var viewportWidth = button.clientWidth;
      var buttonRect = button.getBoundingClientRect();
      var measureRect = measure.getBoundingClientRect();

      segmentWidth = Math.ceil(measure.getBoundingClientRect().width);
      idleOffset = Math.round(measureRect.left - buttonRect.left - button.clientLeft);
      idleTop = Math.round(measureRect.top - buttonRect.top - button.clientTop);
      resetOffset = viewportWidth;
      offset = idleOffset;
      track.textContent = label;
      track.style.top = idleTop + 'px';
      track.style.height = Math.round(measureRect.height) + 'px';
      track.style.transform = 'translate3d(' + offset + 'px, 0, 0)';
    }

    /**
     * Draws the moving label.
     */
    function renderTrack() {
      track.style.transform = 'translate3d(' + offset + 'px, 0, 0)';
    }

    /**
     * Advances the label while it is looping.
     *
     * @param {DOMHighResTimeStamp} now Frame timestamp.
     */
    function step(now) {
      if (!button.classList.contains('is-looping')) {
        frameId = 0;
        return;
      }

      if (!lastTime) {
        lastTime = now;
      }

      var delta = now - lastTime;
      lastTime = now;
      offset -= speed * (delta / 1000);

      if (offset <= -segmentWidth) {
        offset = resetOffset;
      }

      renderTrack();
      frameId = window.requestAnimationFrame(step);
    }

    /**
     * Starts the loop.
     */
    function startLoop() {
      if (prefersReducedMotion.matches) return;

      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }

      if (!button.classList.contains('is-returning')) {
        buildTrack();
      }

      lastTime = 0;
      button.classList.remove('is-returning');
      button.classList.add('is-looping');

      if (!frameId) {
        frameId = window.requestAnimationFrame(step);
      }
    }

    /**
     * Restores the resting state.
     */
    function finishReturn() {
      button.classList.remove('is-returning');
      frameId = 0;
      lastTime = 0;
      offset = idleOffset;
      renderTrack();
    }

    /**
     * Moves the label back to its start position.
     *
     * @param {DOMHighResTimeStamp} now Frame timestamp.
     */
    function returnStep(now) {
      if (!button.classList.contains('is-returning')) {
        frameId = 0;
        return;
      }

      if (!lastTime) {
        lastTime = now;
      }

      var delta = now - lastTime;
      lastTime = now;

      if (offset < idleOffset) {
        offset += returnSpeed * (delta / 1000);

        if (offset >= idleOffset) {
          finishReturn();
          return;
        }
      } else if (offset > idleOffset) {
        offset -= returnSpeed * (delta / 1000);

        if (offset <= idleOffset) {
          finishReturn();
          return;
        }
      } else {
        finishReturn();
        return;
      }

      renderTrack();
      frameId = window.requestAnimationFrame(returnStep);
    }

    /**
     * Stops the loop.
     */
    function stopLoop() {
      button.classList.remove('is-looping');
      lastTime = 0;

      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }

      if (prefersReducedMotion.matches || Math.abs(offset - idleOffset) < 1) {
        finishReturn();
        return;
      }

      button.classList.add('is-returning');
      frameId = window.requestAnimationFrame(returnStep);
    }

    button.addEventListener('pointerenter', startLoop);
    button.addEventListener('pointerleave', stopLoop);
    button.addEventListener('focusin', startLoop);
    button.addEventListener('focusout', stopLoop);

    window.addEventListener('resize', function () {
      if (button.classList.contains('is-looping') || button.classList.contains('is-returning')) {
        buildTrack();
      }
    });

    var observer = new MutationObserver(function () {
      if (button.classList.contains('is-looping') || button.classList.contains('is-returning')) {
        buildTrack();
      }
    });

    observer.observe(measure, {
      childList: true,
      characterData: true,
      subtree: true
    });

    buildTrack();
  });
})();
