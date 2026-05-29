// Projects module.
// Builds the projects list, powers the desktop side preview, and keeps the small-screen detail card in sync.
(function () {
  var PROJECTS = window.PROJECTS_DATA || {};
  var projectIds = Object.keys(PROJECTS);
  var list = document.querySelector('.projects-list');
  var layout = document.querySelector('.projects-layout');
  var previewPanel = document.getElementById('projectsPreviewPanel');
  var previewImage = document.getElementById('projectsPreviewImage');
  var desktopQuery = window.matchMedia('(min-width: 981px)');

  if (list && projectIds.length) {
    projectIds.forEach(function (id, index) {
      var project = PROJECTS[id];
      var techHtml = project.tech.map(function (tech) {
        return '<span class="project-row-tech-item">' + tech.label + '</span>';
      }).join('');

      var row = document.createElement('a');
      row.className = 'project-row';
      row.href = '#projectDetailCard';
      row.setAttribute('role', 'listitem');
      row.setAttribute('data-project-id', id);
      row.setAttribute('aria-controls', 'projectDetailCard');
      row.setAttribute('aria-expanded', 'false');
      row.innerHTML =
        '<div class="project-row-left">' +
          '<h3>' + project.title + '<img class="project-arrow" src="assets/ui/arrow-up-right-white.svg" alt="" aria-hidden="true"></h3>' +
        '</div>' +
        '<div class="project-row-tech" aria-label="Project technologies">' + techHtml + '</div>';

      list.appendChild(row);
    });
  }

  var rows = Array.from(document.querySelectorAll('.project-row[data-project-id]'));
  if (!rows.length) return;

  var card = document.getElementById('projectDetailCard');
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

  var currentId = rows[0].dataset.projectId;
  var detailOpen = false;

  function lockProjectModal() {
    document.documentElement.classList.add('is-project-modal-open');
    document.body.classList.add('is-project-modal-open');
  }

  function unlockProjectModal() {
    document.documentElement.classList.remove('is-project-modal-open');
    document.body.classList.remove('is-project-modal-open');
  }

  function isDesktopLayout() {
    return desktopQuery.matches;
  }

  function getRow(projectId) {
    return rows.find(function (row) {
      return row.dataset.projectId === projectId;
    }) || null;
  }

  function updateRowState(activeId) {
    rows.forEach(function (row) {
      var isActive = row.dataset.projectId === activeId;
      row.classList.toggle('is-active', isActive);
      row.setAttribute('aria-expanded', String(isActive));
    });
  }

  function hidePreviewPanel() {
    if (!previewPanel) return;
    previewPanel.setAttribute('aria-hidden', 'true');
    previewPanel.classList.remove('is-visible');
  }

  function clearDesktopState() {
    hidePreviewPanel();
    rows.forEach(function (row) {
      row.classList.remove('is-active');
      row.setAttribute('aria-expanded', 'false');
    });
  }

  function showOverview(clearRows) {
    if (layout) layout.classList.remove('is-hidden');
    if (clearRows) {
      clearDesktopState();
      return;
    }

    hidePreviewPanel();
  }

  function hideOverview() {
    if (layout) layout.classList.add('is-hidden');
    hidePreviewPanel();
    rows.forEach(function (row) {
      row.classList.remove('is-active');
      row.setAttribute('aria-expanded', 'false');
    });
  }

  function positionPreview(row) {
    if (!previewPanel || !list || !row) return;

    var panelHeight = previewPanel.offsetHeight;
    if (!panelHeight) return;

    var desiredTop = row.offsetTop + (row.offsetHeight - panelHeight) / 2;
    var maxTop = Math.max(0, list.offsetHeight - panelHeight);
    var nextTop = Math.max(0, Math.min(maxTop, desiredTop));

    previewPanel.style.top = Math.round(nextTop) + 'px';
  }

  function renderPreview(projectId) {
    if (!previewPanel || !previewImage || !isDesktopLayout()) {
      hidePreviewPanel();
      return;
    }

    var project = PROJECTS[projectId];
    var row = getRow(projectId);
    if (!project || !project.image || !row) {
      hidePreviewPanel();
      return;
    }

    previewImage.src = project.image;
    previewImage.alt = project.imageAlt || (project.title + ' project preview');
    previewPanel.setAttribute('aria-hidden', 'false');
    previewPanel.classList.add('is-visible');
    window.requestAnimationFrame(function () {
      positionPreview(row);
    });
  }

  function hideDetailMedia() {
    if (!imageEl || !card) return;
    imageEl.removeAttribute('src');
    imageEl.alt = '';
    if (mediaEl) mediaEl.classList.add('is-hidden');
    card.classList.add('has-no-media');
  }

  function showDetailMedia(src, alt) {
    if (!imageEl || !card) return;
    imageEl.src = src;
    imageEl.alt = alt || '';
    if (mediaEl) mediaEl.classList.remove('is-hidden');
    card.classList.remove('has-no-media');
  }

  function renderStack(techItems) {
    if (!stackEl) return;
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

  function showCard() {
    if (!card) return;
    card.classList.remove('is-hidden');
    card.setAttribute('aria-hidden', 'false');
  }

  function hideCard(preserveRows) {
    if (!card) return;
    card.classList.add('is-hidden');
    card.setAttribute('aria-hidden', 'true');

    if (!preserveRows) {
      rows.forEach(function (row) {
        row.classList.remove('is-active');
        row.setAttribute('aria-expanded', 'false');
      });
    }
  }

  function scrollToDetailCard() {
    if (!card) return;

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

  function renderDetailCard(projectId, options) {
    var project = PROJECTS[projectId];
    var shouldScroll = options && options.shouldScroll;
    if (!project || !card || !numberEl || !titleEl || !descriptionEl || !stackEl || !githubEl || !liveEl) {
      return;
    }

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
    showCard();

    if (shouldScroll) scrollToDetailCard();
  }

  function previewProject(projectId) {
    if (!PROJECTS[projectId] || !isDesktopLayout() || detailOpen) return;
    currentId = projectId;
    updateRowState(projectId);
    renderPreview(projectId);
  }

  function openProject(projectId, options) {
    if (!PROJECTS[projectId]) return;

    currentId = projectId;
    detailOpen = true;
    updateRowState(projectId);

    if (isDesktopLayout()) {
      lockProjectModal();
      hideOverview();
      renderDetailCard(projectId);
      return;
    }

    unlockProjectModal();
    showOverview(false);
    hidePreviewPanel();
    renderDetailCard(projectId, options);
  }

  function closeProjectDetail() {
    detailOpen = false;
    unlockProjectModal();
    hideCard();

    if (isDesktopLayout()) {
      showOverview(true);
    }
  }

  function syncProjectsLayout() {
    if (isDesktopLayout()) {
      if (detailOpen) {
        lockProjectModal();
        hideOverview();
        renderDetailCard(currentId);
        return;
      }

      unlockProjectModal();
      showOverview(true);
      hideCard(true);
      return;
    }

    unlockProjectModal();
    showOverview(false);
    hidePreviewPanel();
    updateRowState(currentId);
    renderDetailCard(currentId);
  }

  rows.forEach(function (row) {
    row.addEventListener('pointerenter', function () {
      previewProject(row.dataset.projectId);
    });

    row.addEventListener('focusin', function () {
      if (isDesktopLayout()) {
        previewProject(row.dataset.projectId);
        return;
      }

      openProject(row.dataset.projectId);
    });

    row.addEventListener('click', function (event) {
      event.preventDefault();
      openProject(row.dataset.projectId, { shouldScroll: !isDesktopLayout() });
    });
  });

  if (list) {
    list.addEventListener('pointerleave', function () {
      if (isDesktopLayout()) {
        clearDesktopState();
      }
    });

    list.addEventListener('focusout', function (event) {
      if (isDesktopLayout() && !list.contains(event.relatedTarget)) {
        clearDesktopState();
      }
    });
  }

  var projectOrder = rows.map(function (row) {
    return row.dataset.projectId;
  }).filter(function (projectId) {
    return Boolean(PROJECTS[projectId]);
  });

  if (nextButton) {
    nextButton.addEventListener('click', function () {
      var currentIndex = projectOrder.indexOf(currentId);
      var nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % projectOrder.length;
      openProject(projectOrder[nextIndex], { shouldScroll: !isDesktopLayout() });
    });
  }

  if (closeButton) {
    closeButton.addEventListener('click', function () {
      closeProjectDetail();
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && detailOpen && isDesktopLayout()) {
      closeProjectDetail();
    }
  });

  if (imageEl) {
    imageEl.addEventListener('error', function () {
      hideDetailMedia();
    });
  }

  if (previewImage) {
    previewImage.addEventListener('load', function () {
      if (isDesktopLayout()) {
        positionPreview(getRow(currentId));
      }
    });

    previewImage.addEventListener('error', function () {
      hidePreviewPanel();
    });
  }

  window.addEventListener('resize', syncProjectsLayout);

  if (typeof desktopQuery.addEventListener === 'function') {
    desktopQuery.addEventListener('change', syncProjectsLayout);
  } else if (typeof desktopQuery.addListener === 'function') {
    desktopQuery.addListener(syncProjectsLayout);
  }

  syncProjectsLayout();

  window.updateProjectLanguage = function () {
    if (!currentId || !PROJECTS[currentId]) return;

    if (isDesktopLayout()) {
      if (detailOpen) {
        renderDetailCard(currentId);
      }
      return;
    }

    renderDetailCard(currentId);
  };
})();
