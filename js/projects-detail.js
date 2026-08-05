// Projects section detail dialog helpers.
(function () {
  var app = window.PortfolioProjects;
  if (!app || !app.isReady || !app.preview) return;

  var projects = app.data.projects;
  var elements = app.elements;
  var state = app.state;
  var helpers = app.helpers;
  var preview = app.preview;

  /**
   * Locks page scrolling for the detail overlay.
   */
  function lockProjectModal() {
    document.documentElement.classList.add('is-project-modal-open');
    document.body.classList.add('is-project-modal-open');

    if (!state.supportsModalDialog) {
      document.documentElement.classList.add('is-project-modal-fallback');
      document.body.classList.add('is-project-modal-fallback');
    }
  }

  /**
   * Removes the page scroll lock.
   */
  function unlockProjectModal() {
    document.documentElement.classList.remove('is-project-modal-open');
    document.body.classList.remove('is-project-modal-open');
    document.documentElement.classList.remove('is-project-modal-fallback');
    document.body.classList.remove('is-project-modal-fallback');
  }

  /**
   * Hides the detail image area.
   */
  function hideDetailMedia() {
    if (!elements.imageEl || !elements.card) return;

    elements.imageEl.removeAttribute('src');
    elements.imageEl.alt = '';
    if (elements.mediaEl) elements.mediaEl.classList.add('is-hidden');
    elements.card.classList.add('has-no-media');
  }

  /**
   * Shows the detail image area.
   *
   * @param {string} src Image path.
   * @param {string} alt Image alt text.
   */
  function showDetailMedia(src, alt) {
    if (!elements.imageEl || !elements.card) return;

    elements.imageEl.src = src;
    elements.imageEl.alt = alt || '';
    if (elements.mediaEl) elements.mediaEl.classList.remove('is-hidden');
    elements.card.classList.remove('has-no-media');
  }

  /**
   * Renders the tech stack.
   *
   * @param {ProjectTech[]} techItems Stack items.
   */
  function renderStack(techItems) {
    if (!elements.stackEl) return;

    elements.stackEl.innerHTML = '';
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
      elements.stackEl.appendChild(item);
    });
  }

  /**
   * Shows the detail card.
   */
  function showCard() {
    if (!elements.card) return;

    elements.card.classList.remove('is-hidden');
    elements.card.setAttribute('aria-hidden', 'false');

    if (state.supportsModalDialog && !elements.card.open) {
      elements.card.showModal();
    }
  }

  /**
   * Hides the detail card.
   *
   * @param {boolean} preserveRows Whether to keep the active row.
   */
  function hideCard(preserveRows) {
    if (!elements.card) return;

    if (state.supportsModalDialog && elements.card.open) {
      elements.card.close();
    }

    elements.card.classList.add('is-hidden');
    elements.card.setAttribute('aria-hidden', 'true');

    if (!preserveRows) {
      elements.rows.forEach(function (row) {
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
    var project = projects[projectId];
    if (!project || !elements.card || !elements.numberEl || !elements.titleEl || !elements.descriptionEl || !elements.stackEl || !elements.githubEl || !elements.liveEl) {
      return false;
    }

    elements.numberEl.textContent = project.number;
    elements.titleEl.textContent = project.title;
    elements.descriptionEl.textContent = helpers.isEnglish()
      ? (project.description_en || project.description)
      : (project.description_de || project.description);

    if (project.image) {
      showDetailMedia(project.image, project.imageAlt);
    } else {
      hideDetailMedia();
    }

    elements.githubEl.href = project.github;
    elements.liveEl.href = project.live;
    renderStack(project.tech);
    showCard();
    return true;
  }

  /**
   * Opens a project.
   *
   * @param {string} projectId Project id.
   */
  function openProject(projectId) {
    if (!projects[projectId]) return;

    state.currentId = projectId;
    state.lastTriggerRow = helpers.getRowTrigger(projectId) || state.lastTriggerRow;
    helpers.updateRowState(projectId);

    if (!renderDetailCard(projectId)) return;

    state.detailOpen = true;
    lockProjectModal();
    preview.hideOverview();
  }

  /**
   * Closes the project overlay.
   *
   * @param {boolean} restoreFocus Whether to restore focus to the opener row.
   */
  function closeProjectDetail(restoreFocus) {
    var shouldRestoreFocus = restoreFocus !== false;

    state.detailOpen = false;
    unlockProjectModal();
    hideCard();
    preview.showOverview(true);

    if (shouldRestoreFocus && state.lastTriggerRow && typeof state.lastTriggerRow.focus === 'function') {
      state.lastTriggerRow.focus();
    }
  }

  /**
   * Syncs the layout after breakpoint changes.
   */
  function syncProjectsLayout() {
    if (state.detailOpen) {
      lockProjectModal();
      preview.hideOverview();
      renderDetailCard(state.currentId);
      return;
    }

    unlockProjectModal();
    preview.showOverview(true);
    hideCard(true);
  }

  app.detail = {
    lockProjectModal: lockProjectModal,
    unlockProjectModal: unlockProjectModal,
    hideDetailMedia: hideDetailMedia,
    showDetailMedia: showDetailMedia,
    renderStack: renderStack,
    showCard: showCard,
    hideCard: hideCard,
    renderDetailCard: renderDetailCard,
    openProject: openProject,
    closeProjectDetail: closeProjectDetail,
    syncProjectsLayout: syncProjectsLayout
  };
})();
