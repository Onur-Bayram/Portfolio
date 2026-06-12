// Projects section preview helpers.
(function () {
  var app = window.PortfolioProjects;
  if (!app || !app.isReady) return;

  var projects = app.data.projects;
  var elements = app.elements;
  var state = app.state;
  var helpers = app.helpers;

  /**
   * Hides the preview panel.
   */
  function hidePreviewPanel() {
    if (!elements.previewPanel) return;
    elements.previewPanel.setAttribute('aria-hidden', 'true');
    elements.previewPanel.classList.remove('is-visible');
  }

  /**
   * Clears the desktop preview state.
   */
  function clearDesktopState() {
    hidePreviewPanel();
    elements.rows.forEach(function (row) {
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
    if (elements.layout) elements.layout.classList.remove('is-hidden');

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
    if (elements.layout) elements.layout.classList.add('is-hidden');
    hidePreviewPanel();
    elements.rows.forEach(function (row) {
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
    if (!elements.previewPanel || !elements.list || !row) return;

    var panelHeight = elements.previewPanel.offsetHeight;
    if (!panelHeight) return;

    var desiredTop = row.offsetTop + (row.offsetHeight - panelHeight) / 2;
    var maxTop = Math.max(0, elements.list.offsetHeight - panelHeight);
    var nextTop = Math.max(0, Math.min(maxTop, desiredTop));

    elements.previewPanel.style.top = Math.round(nextTop) + 'px';
  }

  /**
   * Renders the desktop preview.
   *
   * @param {string} projectId Project id.
   */
  function renderPreview(projectId) {
    if (!elements.previewPanel || !elements.previewImage || !helpers.isDesktopLayout()) {
      hidePreviewPanel();
      return;
    }

    var project = projects[projectId];
    var row = helpers.getRow(projectId);
    if (!project || !project.image || !row) {
      hidePreviewPanel();
      return;
    }

    elements.previewImage.src = project.image;
    elements.previewImage.alt = project.imageAlt || (project.title + ' project preview');
    elements.previewPanel.setAttribute('aria-hidden', 'false');
    elements.previewPanel.classList.add('is-visible');
    window.requestAnimationFrame(function () {
      positionPreview(row);
    });
  }

  /**
   * Updates the hover preview.
   *
   * @param {string} projectId Project id.
   */
  function previewProject(projectId) {
    if (!projects[projectId] || !helpers.isDesktopLayout() || state.detailOpen) return;

    state.currentId = projectId;
    helpers.updateRowState(projectId);
    renderPreview(projectId);
  }

  app.preview = {
    hidePreviewPanel: hidePreviewPanel,
    clearDesktopState: clearDesktopState,
    showOverview: showOverview,
    hideOverview: hideOverview,
    positionPreview: positionPreview,
    renderPreview: renderPreview,
    previewProject: previewProject
  };
})();
