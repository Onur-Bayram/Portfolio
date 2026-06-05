// Seamless hover loop for loop-enabled CTA buttons.
// Measures the real button and text width so the text can pass through like a portal without visible resets.
(function () {
  // Respect reduced-motion preferences and limit the behavior to the dedicated loop CTA buttons.
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var ctas = Array.prototype.slice.call(document.querySelectorAll('.btn-loop-cta'));

  if (!ctas.length) return;

  ctas.forEach(function (button) {
    // The visible button label keeps the layout width stable.
    // The track element is the animated overlay that slides through the button on hover.
    var measure = button.querySelector('.btn-loop-measure');
    var track = button.querySelector('.btn-loop-track');
    var frameId = 0;
    var lastTime = 0;
    var offset = 0;
    var idleOffset = 0;
    var idleTop = 0;
    var resetOffset = 0;
    var segmentWidth = 0;

    // Pixels per second for the text travel speed.
    var speed = 110;
    var returnSpeed = 220;

    if (!measure || !track) return;

    // Rebuild the animated track from the current translated label.
    // This keeps the loop correct after language switches or viewport changes.
    /**
     * Measures the current button label and rebuilds the animated overlay geometry.
     *
     * @returns {void}
     */
    function buildTrack() {
      var label = measure.textContent.trim();
      var viewportWidth = button.clientWidth;
      var buttonRect = button.getBoundingClientRect();
      var measureRect = measure.getBoundingClientRect();

      // Measure the real rendered width so the reset happens exactly
      // after the last character has fully left the button on the left side.
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
     * Applies the latest horizontal offset to the moving overlay text.
     *
     * @returns {void}
     */
    function renderTrack() {
      track.style.transform = 'translate3d(' + offset + 'px, 0, 0)';
    }

    // Animate one continuous pass from right to left.
    // Once the whole word has exited on the left, the track jumps back to the
    // exact start point on the right, which creates the portal-like loop.
    /**
     * Advances the marquee text while the loop state is active.
     *
     * @param {DOMHighResTimeStamp} now The timestamp supplied by requestAnimationFrame.
     * @returns {void}
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

    // Start the loop when the button is hovered or keyboard-focused.
    /**
     * Starts the label loop animation for hover and keyboard focus interactions.
     *
     * @returns {void}
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
     * Resets the button back to its static resting state once the return animation is complete.
     *
     * @returns {void}
     */
    function finishReturn() {
      button.classList.remove('is-returning');
      frameId = 0;
      lastTime = 0;
      offset = idleOffset;
      renderTrack();
    }

    /**
     * Animates the moving label back to its original resting position.
     *
     * @param {DOMHighResTimeStamp} now The timestamp supplied by requestAnimationFrame.
     * @returns {void}
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

    // Let the text glide back into its original position before restoring the static label.
    /**
     * Stops the looping state and transitions the overlay text back to the static label position.
     *
     * @returns {void}
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

    // Pointer and keyboard interactions should trigger the same visual behavior.
    button.addEventListener('pointerenter', startLoop);
    button.addEventListener('pointerleave', stopLoop);
    button.addEventListener('focusin', startLoop);
    button.addEventListener('focusout', stopLoop);

    // Re-measure on resize so the off-screen entry point still matches the button width.
    window.addEventListener('resize', function () {
      if (button.classList.contains('is-looping') || button.classList.contains('is-returning')) {
        buildTrack();
      }
    });

    // Language switching rewrites the label text, so keep the loop synchronized with the new string.
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

    // Seed the initial geometry once so the reset point is ready before first hover.
    buildTrack();
  });
})();
