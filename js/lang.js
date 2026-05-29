// Shared language switcher.
// Copies text, placeholders, and ARIA labels from data attributes into the live DOM.
(function () {
  var btnEN = document.getElementById('langEN');
  var btnDE = document.getElementById('langDE');
  if (!btnEN || !btnDE) return;

  // Replace the draft-like About copy with the refined production version.
  function applyRefinedAboutCopy() {
    var aboutHeading = document.querySelector('#about .about-card h2');
    var aboutIntro = document.querySelector('#about .about-intro');
    var aboutPoints = document.querySelectorAll('#about .about-points li > span:last-child');

    if (aboutHeading) {
      aboutHeading.dataset.de = '\u00dcber mich';
      aboutHeading.dataset.en = 'About me';
    }

    if (aboutIntro) {
      aboutIntro.dataset.de = 'Hi, ich bin Onur. Ich entwickle saubere, benutzerfreundliche Weboberfl\u00e4chen mit einem klaren Fokus auf Struktur, Usability und wartbaren Code. Mich motiviert es, aus Ideen digitale L\u00f6sungen zu machen, die echte Probleme l\u00f6sen und sich gut anf\u00fchlen.';
      aboutIntro.dataset.en = 'Hi, I\'m Onur. I build clean, user-focused web interfaces with a strong focus on structure, usability, and maintainable code. What drives me is turning ideas into digital solutions that solve real problems and feel good to use.';
    }

    if (aboutPoints.length >= 3) {
      aboutPoints[0].dataset.de = 'Ich komme aus Frankfurt und bin offen f\u00fcr Remote-Arbeit. Ich arbeite gerne in kollaborativen Teams, \u00fcbernehme Verantwortung und wachse an neuen Herausforderungen.';
      aboutPoints[0].dataset.en = 'I\'m based in Frankfurt and open to remote work. I enjoy working in collaborative teams, taking ownership, and growing through new challenges.';

      aboutPoints[1].dataset.de = 'Ich lerne schnell und entwickle mich kontinuierlich weiter. Moderne Frontend-Workflows, neue Tools und aktuelle Best Practices geh\u00f6ren f\u00fcr mich ganz selbstverst\u00e4ndlich dazu.';
      aboutPoints[1].dataset.en = 'I learn quickly and keep improving continuously. Modern front-end workflows, new tools, and current best practices are a natural part of how I work.';

      aboutPoints[2].dataset.de = 'Ich gehe Probleme analytisch an und suche nach L\u00f6sungen, die klar, effizient und skalierbar sind. Guter Code sollte zuverl\u00e4ssig funktionieren und gleichzeitig leicht verst\u00e4ndlich bleiben.';
      aboutPoints[2].dataset.en = 'I approach problems analytically and look for solutions that are clear, efficient, and scalable. Good code should work reliably while still being easy to understand.';
    }
  }

  // Apply the chosen language across all supported elements on the page.
  function setLang(lang) {
    var isEN = lang === 'en';
    btnEN.classList.toggle('is-active', isEN);
    btnDE.classList.toggle('is-active', !isEN);
    btnEN.setAttribute('aria-pressed', String(isEN));
    btnDE.setAttribute('aria-pressed', String(!isEN));

    // Keep the mobile language chips visually synchronized with the desktop toggle.
    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.lang === lang);
    });

    // Replace inner HTML so links and inline markup inside translated copy still render.
    document.querySelectorAll('[data-en][data-de]').forEach(function (el) {
      el.innerHTML = isEN ? el.dataset.en : el.dataset.de;
    });

    // Inputs and textareas read their translated placeholder from dedicated data attributes.
    document.querySelectorAll('[data-placeholder-en][data-placeholder-de]').forEach(function (el) {
      el.setAttribute('placeholder', isEN ? el.dataset.placeholderEn : el.dataset.placeholderDe);
    });

    // Some controls expose translated accessibility labels separately from visible text.
    document.querySelectorAll('[data-aria-en][data-aria-de]').forEach(function (el) {
      el.setAttribute('aria-label', isEN ? el.dataset.ariaEn : el.dataset.ariaDe);
    });

    // The projects module exposes a refresh hook because its content is rendered dynamically.
    if (window.updateProjectLanguage) {
      window.updateProjectLanguage();
    }
  }

  // Desktop language toggle buttons.
  btnEN.addEventListener('click', function () {
    setLang('en');
  });

  btnDE.addEventListener('click', function () {
    setLang('de');
  });

  // Mobile menu language chips call the same shared language function.
  document.querySelectorAll('[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.dataset.lang);
    });
  });

  applyRefinedAboutCopy();
  setLang(btnEN.classList.contains('is-active') ? 'en' : 'de');
})();
