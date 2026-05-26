// Seamless hover loop for the two hero CTA buttons.
// Measures the real button and text width so the text can pass through like a portal without visible resets.
(function () {
  // Respect reduced-motion preferences and limit the behavior to the dedicated hero CTA buttons.
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
    var startOffset = 0;
    var segmentWidth = 0;

    // Pixels per second for the text travel speed.
    var speed = 110;

    if (!measure || !track) return;

    // Rebuild the animated track from the current translated label.
    // This keeps the loop correct after language switches or viewport changes.
    function buildTrack() {
      var label = measure.textContent.trim();
      var viewportWidth = button.clientWidth;

      // Measure the real rendered width so the reset happens exactly
      // after the last character has fully left the button on the left side.
      segmentWidth = Math.ceil(measure.getBoundingClientRect().width);
      startOffset = viewportWidth;
      offset = startOffset;
      track.textContent = label;
      track.style.transform = 'translate3d(' + offset + 'px, -50%, 0)';
    }

    // Animate one continuous pass from right to left.
    // Once the whole word has exited on the left, the track jumps back to the
    // exact start point on the right, which creates the portal-like loop.
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
        offset = startOffset;
      }

      track.style.transform = 'translate3d(' + offset + 'px, -50%, 0)';
      frameId = window.requestAnimationFrame(step);
    }

    // Start the loop when the button is hovered or keyboard-focused.
    function startLoop() {
      if (prefersReducedMotion.matches) return;

      buildTrack();
      lastTime = 0;
      button.classList.add('is-looping');

      if (!frameId) {
        frameId = window.requestAnimationFrame(step);
      }
    }

    // Restore the static label and reset the animated track off-screen.
    function stopLoop() {
      button.classList.remove('is-looping');
      lastTime = 0;

      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }

      track.style.transform = 'translate3d(' + startOffset + 'px, -50%, 0)';
    }

    // Pointer and keyboard interactions should trigger the same visual behavior.
    button.addEventListener('pointerenter', startLoop);
    button.addEventListener('pointerleave', stopLoop);
    button.addEventListener('focusin', startLoop);
    button.addEventListener('focusout', stopLoop);

    // Re-measure on resize so the off-screen entry point still matches the button width.
    window.addEventListener('resize', function () {
      if (button.classList.contains('is-looping')) {
        buildTrack();
      }
    });

    // Language switching rewrites the label text, so keep the loop synchronized with the new string.
    var observer = new MutationObserver(function () {
      if (button.classList.contains('is-looping')) {
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
