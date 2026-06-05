// Projects section.
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

      var row = document.createElement('button');
      row.className = 'project-row';
      row.type = 'button';
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

  /**
   * Locks page scrolling for the detail overlay.
   */
  function lockProjectModal() {
    document.documentElement.classList.add('is-project-modal-open');
    document.body.classList.add('is-project-modal-open');
  }

  /**
   * Removes the page scroll lock.
   */
  function unlockProjectModal() {
    document.documentElement.classList.remove('is-project-modal-open');
    document.body.classList.remove('is-project-modal-open');
  }

  /**
   * Checks whether the desktop layout is active.
   *
   * @returns {boolean}
   */
  function isDesktopLayout() {
    return desktopQuery.matches;
  }

  /**
   * Finds a project row by id.
   *
   * @param {string} projectId Project id.
   * @returns {HTMLElement|null}
   */
  function getRow(projectId) {
    return rows.find(function (row) {
      return row.dataset.projectId === projectId;
    }) || null;
  }

  /**
   * Updates the active row.
   *
   * @param {string} activeId Project id.
   */
  function updateRowState(activeId) {
    rows.forEach(function (row) {
      var isActive = row.dataset.projectId === activeId;
      row.classList.toggle('is-active', isActive);
      row.setAttribute('aria-expanded', String(isActive));
    });
  }

  /**
   * Hides the preview panel.
   */
  function hidePreviewPanel() {
    if (!previewPanel) return;
    previewPanel.setAttribute('aria-hidden', 'true');
    previewPanel.classList.remove('is-visible');
  }

  /**
   * Clears the desktop preview state.
   */
  function clearDesktopState() {
    hidePreviewPanel();
    rows.forEach(function (row) {
      row.classList.remove('is-active');
      row.setAttribute('aria-expanded', 'false');
    });
  }

  /**
   * Shows the overview layout.
   *
   * @param {boolean} clearRows Whether to clear row state.
   */
  function showOverview(clearRows) {
    if (layout) layout.classList.remove('is-hidden');
    if (clearRows) {
      clearDesktopState();
      return;
    }

    hidePreviewPanel();
  }

  /**
   * Hides the overview layout.
   */
  function hideOverview() {
    if (layout) layout.classList.add('is-hidden');
    hidePreviewPanel();
    rows.forEach(function (row) {
      row.classList.remove('is-active');
      row.setAttribute('aria-expanded', 'false');
    });
  }

  /**
   * Positions the preview next to a row.
   *
   * @param {HTMLElement|null} row Row element.
   */
  function positionPreview(row) {
    if (!previewPanel || !list || !row) return;

    var panelHeight = previewPanel.offsetHeight;
    if (!panelHeight) return;

    var desiredTop = row.offsetTop + (row.offsetHeight - panelHeight) / 2;
    var maxTop = Math.max(0, list.offsetHeight - panelHeight);
    var nextTop = Math.max(0, Math.min(maxTop, desiredTop));

    previewPanel.style.top = Math.round(nextTop) + 'px';
  }

  /**
   * Renders the desktop preview.
   *
   * @param {string} projectId Project id.
   */
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

  /**
   * Hides the detail image area.
   */
  function hideDetailMedia() {
    if (!imageEl || !card) return;
    imageEl.removeAttribute('src');
    imageEl.alt = '';
    if (mediaEl) mediaEl.classList.add('is-hidden');
    card.classList.add('has-no-media');
  }

  /**
   * Shows the detail image area.
   *
   * @param {string} src Image path.
   * @param {string} alt Image alt text.
   */
  function showDetailMedia(src, alt) {
    if (!imageEl || !card) return;
    imageEl.src = src;
    imageEl.alt = alt || '';
    if (mediaEl) mediaEl.classList.remove('is-hidden');
    card.classList.remove('has-no-media');
  }

  /**
   * Renders the tech stack.
   *
   * @param {ProjectTech[]} techItems Stack items.
   */
  function renderStack(techItems) {
    if (!stackEl) return;
    stackEl.innerHTML = '';

    techItems.forEach(function (tech) {
      var item = document.createElement('span');
      item.className = 'project-detail-tech';

      var icon = document.createElement('span');
      icon.className = 'project-detail-tech-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.style.webkitMaskImage = 'url("' + tech.icon + '")';
      icon.style.maskImage = 'url("' + tech.icon + '")';

      var label = document.createElement('span');
      label.textContent = tech.label;

      item.appendChild(icon);
      item.appendChild(label);
      stackEl.appendChild(item);
    });
  }

  /**
   * Shows the detail card.
   */
  function showCard() {
    if (!card) return;
    card.classList.remove('is-hidden');
    card.setAttribute('aria-hidden', 'false');
  }

  /**
   * Hides the detail card.
   *
   * @param {boolean} preserveRows Whether to keep the active row.
   */
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

  /**
   * Fills the detail card with project data.
   *
   * @param {string} projectId Project id.
   * @returns {boolean}
   */
  function renderDetailCard(projectId) {
    var project = PROJECTS[projectId];
    if (!project || !card || !numberEl || !titleEl || !descriptionEl || !stackEl || !githubEl || !liveEl) {
      return false;
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
    return true;
  }

  /**
   * Updates the hover preview.
   *
   * @param {string} projectId Project id.
   */
  function previewProject(projectId) {
    if (!PROJECTS[projectId] || !isDesktopLayout() || detailOpen) return;
    currentId = projectId;
    updateRowState(projectId);
    renderPreview(projectId);
  }

  /**
   * Opens a project.
   *
   * @param {string} projectId Project id.
   */
  function openProject(projectId) {
    if (!PROJECTS[projectId]) return;

    currentId = projectId;
    detailOpen = true;
    updateRowState(projectId);

    if (!renderDetailCard(projectId)) return;
    lockProjectModal();
    hideOverview();
  }

  /**
   * Closes the project overlay.
   */
  function closeProjectDetail() {
    detailOpen = false;
    unlockProjectModal();
    hideCard();
    showOverview(true);
  }

  /**
   * Syncs the layout after breakpoint changes.
   */
  function syncProjectsLayout() {
    if (detailOpen) {
      lockProjectModal();
      hideOverview();
      renderDetailCard(currentId);
      return;
    }

    unlockProjectModal();
    showOverview(true);
    hideCard(true);
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

    row.addEventListener('click', function () {
      openProject(row.dataset.projectId);
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
      openProject(projectOrder[nextIndex]);
    });
  }

  if (closeButton) {
    closeButton.addEventListener('click', function () {
      closeProjectDetail();
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && detailOpen) {
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

  /**
   * Refreshes an open detail card after a language switch.
   */
  window.updateProjectLanguage = function () {
    if (!detailOpen || !currentId || !PROJECTS[currentId]) return;
    renderDetailCard(currentId);
  };
})();
