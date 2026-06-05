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

  // The desktop detail panel behaves like a modal, so both root elements need a lock class.
  /**
   * Locks document scrolling while the project detail overlay is open.
   *
   * @returns {void}
   */
  function lockProjectModal() {
    document.documentElement.classList.add('is-project-modal-open');
    document.body.classList.add('is-project-modal-open');
  }

  /**
   * Removes the modal lock classes from the root elements.
   *
   * @returns {void}
   */
  function unlockProjectModal() {
    document.documentElement.classList.remove('is-project-modal-open');
    document.body.classList.remove('is-project-modal-open');
  }

  /**
   * Checks whether the current viewport should use the desktop projects layout.
   *
   * @returns {boolean} Returns true when the desktop media query matches.
   */
  function isDesktopLayout() {
    return desktopQuery.matches;
  }

  /**
   * Finds the rendered project row for a given project id.
   *
   * @param {string} projectId The project identifier assigned in the shared data object.
   * @returns {HTMLElement|null} The matching row element or null when none exists.
   */
  function getRow(projectId) {
    return rows.find(function (row) {
      return row.dataset.projectId === projectId;
    }) || null;
  }

  /**
   * Updates the active list row state so only one row appears selected at a time.
   *
   * @param {string} activeId The project id that should appear active.
   * @returns {void}
   */
  function updateRowState(activeId) {
    rows.forEach(function (row) {
      var isActive = row.dataset.projectId === activeId;
      row.classList.toggle('is-active', isActive);
      row.setAttribute('aria-expanded', String(isActive));
    });
  }

  /**
   * Hides the desktop preview panel and removes its visible state class.
   *
   * @returns {void}
   */
  function hidePreviewPanel() {
    if (!previewPanel) return;
    previewPanel.setAttribute('aria-hidden', 'true');
    previewPanel.classList.remove('is-visible');
  }

  /**
   * Clears preview and active-row state after hover or focus leaves the project list.
   *
   * @returns {void}
   */
  function clearDesktopState() {
    hidePreviewPanel();
    rows.forEach(function (row) {
      row.classList.remove('is-active');
      row.setAttribute('aria-expanded', 'false');
    });
  }

  // Desktop swaps between the list/preview overview and the large detail overlay.
  /**
   * Shows the normal projects overview and optionally clears active row state.
   *
   * @param {boolean} clearRows Controls whether active row state should also be reset.
   * @returns {void}
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
   * Hides the overview layout while the detail card is displayed as an overlay.
   *
   * @returns {void}
   */
  function hideOverview() {
    if (layout) layout.classList.add('is-hidden');
    hidePreviewPanel();
    rows.forEach(function (row) {
      row.classList.remove('is-active');
      row.setAttribute('aria-expanded', 'false');
    });
  }

  // The small desktop preview follows the hovered row, but never leaves the list bounds.
  /**
   * Positions the desktop preview card so it follows the active row without leaving the list bounds.
   *
   * @param {HTMLElement|null} row The row that should anchor the preview panel.
   * @returns {void}
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
   * Updates and reveals the desktop preview image for the active project row.
   *
   * @param {string} projectId The project identifier used to resolve preview content.
   * @returns {void}
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

  // The detail card reuses one DOM shell and swaps its content from the shared project data object.
  /**
   * Hides the media column when a project has no usable preview image.
   *
   * @returns {void}
   */
  function hideDetailMedia() {
    if (!imageEl || !card) return;
    imageEl.removeAttribute('src');
    imageEl.alt = '';
    if (mediaEl) mediaEl.classList.add('is-hidden');
    card.classList.add('has-no-media');
  }

  /**
   * Restores the media column with the supplied image source and alternative text.
   *
   * @param {string} src The image source that should be rendered in the detail card.
   * @param {string} alt The accessible alternative text for the detail image.
   * @returns {void}
   */
  function showDetailMedia(src, alt) {
    if (!imageEl || !card) return;
    imageEl.src = src;
    imageEl.alt = alt || '';
    if (mediaEl) mediaEl.classList.remove('is-hidden');
    card.classList.remove('has-no-media');
  }

  /**
   * Rebuilds the project stack badges shown inside the detail card.
   *
   * @param {ProjectTech[]} techItems The technology entries that should be rendered for the project.
   * @returns {void}
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
   * Reveals the shared project detail card shell.
   *
   * @returns {void}
   */
  function showCard() {
    if (!card) return;
    card.classList.remove('is-hidden');
    card.setAttribute('aria-hidden', 'false');
  }

  /**
   * Hides the detail card and optionally preserves the active row state.
   *
   * @param {boolean} preserveRows Controls whether the row selection state should remain intact.
   * @returns {void}
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
   * Fills the shared detail card with content from the selected project entry.
   *
   * @param {string} projectId The project identifier used to resolve detail content.
   * @returns {boolean} Returns true when the detail card was populated successfully.
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

  // Hover previews are desktop-only; once the overlay is open, hover should stop changing content.
  /**
   * Updates the desktop hover preview for a given project row.
   *
   * @param {string} projectId The project identifier that should drive the hover preview.
   * @returns {void}
   */
  function previewProject(projectId) {
    if (!PROJECTS[projectId] || !isDesktopLayout() || detailOpen) return;
    currentId = projectId;
    updateRowState(projectId);
    renderPreview(projectId);
  }

  // Click/tap always promotes a project into the full detail view.
  /**
   * Opens the project detail overlay for the selected project.
   *
   * @param {string} projectId The project identifier that should be opened.
   * @returns {void}
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
   * Closes the detail overlay and restores the default project overview state.
   *
   * @returns {void}
   */
  function closeProjectDetail() {
    detailOpen = false;
    unlockProjectModal();
    hideCard();
    showOverview(true);
  }

  // Resize and breakpoint changes must keep the current project visible in the correct layout mode.
  /**
   * Reconciles overview and detail states after viewport size or breakpoint changes.
   *
   * @returns {void}
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

  // Rows support three behaviors: desktop hover preview, keyboard focus preview, and click-to-open.
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

  // The "next project" control cycles through the current rendered order instead of hard-coding ids.
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

  // The language switcher calls back into the projects module so an open detail card can rerender its copy.
  /**
   * Rerenders the open detail card when the global language switch changes.
   *
   * @returns {void}
   */
  window.updateProjectLanguage = function () {
    if (!detailOpen || !currentId || !PROJECTS[currentId]) return;
    renderDetailCard(currentId);
  };
})();
