// Projects section core.
(function () {
  var app = window.PortfolioProjects || {};
  var projects = window.PROJECTS_DATA || {};
  var projectIds = Object.keys(projects);
  var list = document.querySelector('.projects-list');
  var desktopQuery = window.matchMedia('(min-width: 981px)');

  /**
   * Builds the project rows from the data source.
   */
  function renderProjectRows() {
    if (!list || !projectIds.length) return;

    projectIds.forEach(function (id) {
      var project = projects[id];
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

  renderProjectRows();

  var rows = Array.from(document.querySelectorAll('.project-row[data-project-id]'));
  if (!rows.length) {
    app.isReady = false;
    window.PortfolioProjects = app;
    return;
  }

  var card = document.getElementById('projectDetailCard');
  var imageEl = document.getElementById('projectDetailImage');

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
   * Checks whether English is active.
   *
   * @returns {boolean}
   */
  function isEnglish() {
    var langEN = document.getElementById('langEN');
    return Boolean(langEN && langEN.classList.contains('is-active'));
  }

  /**
   * Updates the active project row.
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

  app.isReady = true;
  app.data = {
    projects: projects,
    projectIds: projectIds,
    projectOrder: rows.map(function (row) {
      return row.dataset.projectId;
    }).filter(function (projectId) {
      return Boolean(projects[projectId]);
    })
  };
  app.elements = {
    list: list,
    layout: document.querySelector('.projects-layout'),
    previewPanel: document.getElementById('projectsPreviewPanel'),
    previewImage: document.getElementById('projectsPreviewImage'),
    rows: rows,
    card: card,
    closeButton: document.getElementById('projectDetailClose'),
    nextButton: document.getElementById('projectDetailNext'),
    numberEl: document.getElementById('projectDetailNumber'),
    titleEl: document.getElementById('projectDetailTitle'),
    descriptionEl: document.getElementById('projectDetailDescription'),
    stackEl: document.getElementById('projectDetailStack'),
    imageEl: imageEl,
    mediaEl: imageEl ? imageEl.closest('.project-detail-media') : null,
    githubEl: document.getElementById('projectDetailGithub'),
    liveEl: document.getElementById('projectDetailLive')
  };
  app.state = {
    currentId: rows[0].dataset.projectId,
    detailOpen: false,
    lastTriggerRow: null,
    supportsModalDialog: Boolean(card && typeof card.showModal === 'function' && typeof card.close === 'function')
  };
  app.media = {
    desktopQuery: desktopQuery
  };
  app.helpers = {
    isDesktopLayout: isDesktopLayout,
    getRow: getRow,
    isEnglish: isEnglish,
    updateRowState: updateRowState
  };

  window.PortfolioProjects = app;
})();
