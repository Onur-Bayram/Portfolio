// Hero cursor glow.
(function () {
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

  /**
   * Moves the glow toward the pointer.
   */
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

  /**
   * Stores the current pointer position inside the hero.
   *
   * @param {MouseEvent} event Pointer event.
   */
  function syncTargetPosition(event) {
    var rect = hero.getBoundingClientRect();
    targetX = event.clientX - rect.left;
    targetY = event.clientY - rect.top;
  }

  /**
   * Shows the glow and starts the animation loop.
   *
   * @param {MouseEvent} event Pointer event.
   */
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

  /**
   * Hides the glow.
   */
  function hideGlow() {
    glow.classList.remove('is-visible');
    isInside = false;
  }

  hero.addEventListener('mouseenter', showGlow);

  hero.addEventListener('mousemove', syncTargetPosition);

  hero.addEventListener('mouseleave', hideGlow);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && isInside) {
      hideGlow();
    }
  });
})();
