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

  function onMove(event) {
    var rect = hero.getBoundingClientRect();
    targetX = event.clientX - rect.left;
    targetY = event.clientY - rect.top;
  }

  hero.addEventListener('mouseenter', function (event) {
    var rect = hero.getBoundingClientRect();
    targetX = event.clientX - rect.left;
    targetY = event.clientY - rect.top;
    currentX = targetX;
    currentY = targetY;
    glow.classList.add('is-visible');

    if (!rafId) {
      rafId = window.requestAnimationFrame(animate);
    }

    isInside = true;
  });

  hero.addEventListener('mousemove', onMove);

  hero.addEventListener('mouseleave', function () {
    glow.classList.remove('is-visible');
    isInside = false;
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && isInside) {
      glow.classList.remove('is-visible');
      isInside = false;
    }
  });
})();
