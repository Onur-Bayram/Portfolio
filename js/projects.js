(function () {
  var PROJECTS = window.PROJECTS_DATA || {};
  var projectIds = Object.keys(PROJECTS);

  // --- Render project rows ---
  var list = document.querySelector('.projects-list');
  if (list && projectIds.length) {
    projectIds.forEach(function (id, index) {
      var p = PROJECTS[id];
      var techOverlayHtml = p.tech.map(function (t) {
        return '<img class="overlay-icon" src="' + t.icon + '" alt="' + t.label + '" />';
      }).join('');
      var a = document.createElement('a');
      a.className = 'project-row' + (index === 0 ? ' is-active' : '');
      a.href = '#projectDetailCard';
      a.setAttribute('role', 'listitem');
      a.setAttribute('data-project-id', id);
      a.setAttribute('aria-controls', 'projectDetailCard');
      a.setAttribute('aria-expanded', String(index === 0));
      a.innerHTML =
        '<div class="project-row-left">' +
          '<h3>' + p.title + ' <span class="project-arrow">\u2197</span></h3>' +
          '<p>' + p.tech.map(function (t) { return t.label; }).join(' | ') + '</p>' +
          '<div class="project-tech-overlay" aria-label="Project technologies">' + techOverlayHtml + '</div>' +
        '</div>' +
        '<div class="project-preview" aria-hidden="true">' +
          '<img src="' + p.image + '" alt="' + p.title + ' Vorschau" loading="lazy" />' +
        '</div>';
      list.appendChild(a);
    });
  }

  // --- Interaction logic ---
  var card = document.getElementById('projectDetailCard');
  if (!card) return;

  var rows = Array.from(document.querySelectorAll('.project-row[data-project-id]'));
  var closeButton = document.getElementById('projectDetailClose');
  var nextButton = document.getElementById('projectDetailNext');

  var numberEl = document.getElementById('projectDetailNumber');
  var titleEl = document.getElementById('projectDetailTitle');
  var descriptionEl = document.getElementById('projectDetailDescription');
  var stackEl = document.getElementById('projectDetailStack');
  var imageEl = document.getElementById('projectDetailImage');
  var mediaEl = imageEl ? imageEl.closest('.project-detail-media') : null;
  var githubEl = document.getElementById('projectDetailGithub');
  var liveEl = document.getElementById('projectDetailLive');

  if (!rows.length || !numberEl || !titleEl || !descriptionEl || !stackEl || !imageEl || !githubEl || !liveEl) {
    return;
  }

  var projects = PROJECTS;

  var projectOrder = rows
    .map(function (row) { return row.dataset.projectId; })
    .filter(function (projectId) { return Boolean(projects[projectId]); });

  var currentId = projectOrder[0];

  function hideDetailMedia() {
    imageEl.removeAttribute('src');
    imageEl.alt = '';
    if (mediaEl) mediaEl.classList.add('is-hidden');
    card.classList.add('has-no-media');
  }

  function showDetailMedia(src, alt) {
    imageEl.src = src;
    imageEl.alt = alt || '';
    if (mediaEl) mediaEl.classList.remove('is-hidden');
    card.classList.remove('has-no-media');
  }

  function setupListPreviewFallbacks() {
    var previewImages = document.querySelectorAll('.project-preview img');
    previewImages.forEach(function (img) {
      img.addEventListener('error', function () {
        var previewWrap = img.closest('.project-preview');
        if (previewWrap) previewWrap.classList.add('is-hidden');
      });
    });
  }

  function renderStack(techItems) {
    stackEl.innerHTML = '';
    techItems.forEach(function (tech) {
      var item = document.createElement('span');
      item.className = 'project-detail-tech';
      var icon = document.createElement('img');
      icon.src = tech.icon;
      icon.alt = '';
      icon.setAttribute('aria-hidden', 'true');
      var label = document.createElement('span');
      label.textContent = tech.label;
      item.appendChild(icon);
      item.appendChild(label);
      stackEl.appendChild(item);
    });
  }

  function updateRowState(activeId) {
    rows.forEach(function (row) {
      var isActive = row.dataset.projectId === activeId;
      row.classList.toggle('is-active', isActive);
      row.setAttribute('aria-expanded', String(isActive));
    });
  }

  function showCard() {
    card.classList.remove('is-hidden');
    card.setAttribute('aria-hidden', 'false');
  }

  function hideCard() {
    card.classList.add('is-hidden');
    card.setAttribute('aria-hidden', 'true');
    rows.forEach(function (row) {
      row.classList.remove('is-active');
      row.setAttribute('aria-expanded', 'false');
    });
  }

  function scrollToDetailCard() {
    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var header = document.getElementById('header');
    var headerOffset = header ? header.offsetHeight : 0;
    var extraOffset = 24;
    var targetTop = card.getBoundingClientRect().top + window.scrollY - headerOffset - extraOffset;
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  }

  function renderProject(projectId, options) {
    var project = projects[projectId];
    var shouldScroll = options && options.shouldScroll;
    if (!project) return;

    currentId = projectId;
    numberEl.textContent = project.number;
    titleEl.textContent = project.title;
    var langEN = document.getElementById('langEN');
    var isEnglish = langEN && langEN.classList.contains('is-active');
    var description = isEnglish ? (project.description_en || project.description) : (project.description_de || project.description);
    descriptionEl.textContent = description;
    if (project.image) {
      showDetailMedia(project.image, project.imageAlt);
    } else {
      hideDetailMedia();
    }
    githubEl.href = project.github;
    liveEl.href = project.live;
    renderStack(project.tech);
    updateRowState(projectId);
    showCard();

    if (shouldScroll) scrollToDetailCard();
  }

  rows.forEach(function (row) {
    row.addEventListener('click', function (event) {
      event.preventDefault();
      renderProject(row.dataset.projectId, { shouldScroll: true });
    });
  });

  if (nextButton) {
    nextButton.addEventListener('click', function () {
      var currentIndex = projectOrder.indexOf(currentId);
      var nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % projectOrder.length;
      renderProject(projectOrder[nextIndex]);
    });
  }

  if (closeButton) {
    closeButton.addEventListener('click', function () {
      hideCard();
    });
  }

  setupListPreviewFallbacks();

  imageEl.addEventListener('error', function () {
    hideDetailMedia();
  });

  renderProject(currentId);

  window.updateProjectLanguage = function () {
    if (currentId && projects[currentId]) {
      renderProject(currentId);
    }
  };
})();
