// Projects section core.
(function () {
  var app = window.PortfolioProjects || {};
  var projects = window.PROJECTS_DATA || {};
  var projectIds = Object.keys(projects).filter(function (projectId) {
    return Boolean(projects[projectId]);
  }).sort(function (firstId, secondId) {
    return Number(projects[firstId].number) - Number(projects[secondId].number);
  });
  var list = document.querySelector('.projects-list');
  var desktopQuery = window.matchMedia('(min-width: 981px)');

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
   * Returns the live link label for the current language.
   *
   * @returns {string}
   */
  function getLiveLabel() {
    return isEnglish() ? 'Live Test' : 'Live-Test';
  }

  /**
   * Returns the live link aria-label for a project.
   *
   * @param {string} title Project title.
   * @returns {string}
   */
  function getLiveAriaLabel(title) {
    return isEnglish() ? ('Open live project: ' + title) : ('Live-Projekt öffnen: ' + title);
  }

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

      var row = document.createElement('div');
      row.className = 'project-row';
      row.setAttribute('role', 'listitem');
      row.setAttribute('data-project-id', id);
      row.innerHTML =
        '<button class="project-row-main" type="button" aria-controls="projectDetailCard" aria-expanded="false">' +
          '<div class="project-row-left">' +
            '<h3>' + project.title + '<img class="project-arrow" src="assets/ui/arrow-up-right-white.svg" alt="" aria-hidden="true"></h3>' +
          '</div>' +
          '<div class="project-row-tech" aria-label="Project technologies">' + techHtml + '</div>' +
        '</button>' +
        '<a class="project-row-live" href="' + project.live + '" target="_blank" rel="noopener noreferrer" data-de="Live-Test" data-en="Live Test" aria-label="' + getLiveAriaLabel(project.title) + '">' + getLiveLabel() + '</a>';

      list.appendChild(row);
    });
  }

  renderProjectRows();

  var rows = Array.from(document.querySelectorAll('.project-row[data-project-id]'));
  var rowTriggers = rows.map(function (row) {
    return row.querySelector('.project-row-main');
  }).filter(function (trigger) {
    return Boolean(trigger);
  });
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
   * Updates the active project row.
   *
   * @param {string} activeId Project id.
   */
  function updateRowState(activeId) {
    rows.forEach(function (row) {
      var isActive = row.dataset.projectId === activeId;
      var trigger = row.querySelector('.project-row-main');
      row.classList.toggle('is-active', isActive);
      if (trigger) {
        trigger.setAttribute('aria-expanded', String(isActive));
      }
    });
  }

  /**
   * Updates the live link labels after a language switch.
   */
  function updateRowLiveLabels() {
    rows.forEach(function (row) {
      var liveLink = row.querySelector('.project-row-live');
      var project = projects[row.dataset.projectId];
      if (!liveLink || !project) return;

      liveLink.textContent = getLiveLabel();
      liveLink.setAttribute('aria-label', getLiveAriaLabel(project.title));
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
    rowTriggers: rowTriggers,
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
    getRowTrigger: function (projectId) {
      var row = getRow(projectId);
      return row ? row.querySelector('.project-row-main') : null;
    },
    isEnglish: isEnglish,
    updateRowLiveLabels: updateRowLiveLabels,
    updateRowState: updateRowState
  };

  updateRowLiveLabels();

  window.PortfolioProjects = app;
})();
