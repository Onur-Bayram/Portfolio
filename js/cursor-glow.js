// Hero cursor glow effect.
// Follows the pointer with a smoothed animation on devices that support hover.
(function () {
  // Skip the effect when the hero is missing or the device primarily uses touch input.
  var hero = document.getElementById('hero');
  var glow = document.getElementById('heroCursorGlow');

  if (!hero || !glow) return;
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  var currentX = 0;
  var currentY = 0;
  var targetX = 0;
  var targetY = 0;
  var rafId = null;
  var isInside = false;

  // Ease toward the pointer position to create a softer, more polished movement.
  function animate() {
    if (!isInside) {
      rafId = null;
      return;
    }

    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;

    glow.style.transform = 'translate(' + currentX + 'px, ' + currentY + 'px) translate(-50%, -50%)';
    rafId = window.requestAnimationFrame(animate);
  }

  // Translate viewport coordinates into hero-local coordinates.
  function syncTargetPosition(event) {
    var rect = hero.getBoundingClientRect();
    targetX = event.clientX - rect.left;
    targetY = event.clientY - rect.top;
  }

  // Start the effect at the current pointer position when the hero is entered.
  function showGlow(event) {
    syncTargetPosition(event);
    currentX = targetX;
    currentY = targetY;
    glow.classList.add('is-visible');
    isInside = true;

    if (!rafId) {
      rafId = window.requestAnimationFrame(animate);
    }
  }

  function hideGlow() {
    glow.classList.remove('is-visible');
    isInside = false;
  }

  hero.addEventListener('mouseenter', showGlow);

  hero.addEventListener('mousemove', syncTargetPosition);

  // Hide the glow and stop scheduling frames once the pointer leaves the hero.
  hero.addEventListener('mouseleave', hideGlow);

  // Also stop the visual when the tab becomes hidden to avoid stale UI state.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && isInside) {
      hideGlow();
    }
  });
})();
