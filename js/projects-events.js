// Projects section event bindings.
(function () {
  var app = window.PortfolioProjects;
  if (!app || !app.isReady || !app.preview || !app.detail) return;

  var projects = app.data.projects;
  var projectOrder = app.data.projectOrder;
  var elements = app.elements;
  var state = app.state;
  var media = app.media;
  var helpers = app.helpers;
  var preview = app.preview;
  var detail = app.detail;

  elements.rows.forEach(function (row) {
    row.addEventListener('pointerenter', function () {
      preview.previewProject(row.dataset.projectId);
    });

    row.addEventListener('focusin', function () {
      if (helpers.isDesktopLayout()) {
        preview.previewProject(row.dataset.projectId);
        return;
      }

      detail.openProject(row.dataset.projectId);
    });

    row.addEventListener('click', function () {
      detail.openProject(row.dataset.projectId);
    });
  });

  if (elements.list) {
    elements.list.addEventListener('pointerleave', function () {
      if (helpers.isDesktopLayout()) {
        preview.clearDesktopState();
      }
    });

    elements.list.addEventListener('focusout', function (event) {
      if (helpers.isDesktopLayout() && !elements.list.contains(event.relatedTarget)) {
        preview.clearDesktopState();
      }
    });
  }

  if (elements.nextButton) {
    elements.nextButton.addEventListener('click', function () {
      var currentIndex = projectOrder.indexOf(state.currentId);
      var nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % projectOrder.length;
      detail.openProject(projectOrder[nextIndex]);
    });
  }

  if (elements.closeButton) {
    elements.closeButton.addEventListener('click', function () {
      detail.closeProjectDetail();
    });
  }

  if (elements.card && state.supportsModalDialog) {
    elements.card.addEventListener('cancel', function (event) {
      event.preventDefault();
      detail.closeProjectDetail();
    });

    elements.card.addEventListener('click', function (event) {
      if (!state.detailOpen || event.target !== elements.card) return;

      var rect = elements.card.getBoundingClientRect();
      var isBackdropClick = event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;

      if (isBackdropClick) {
        detail.closeProjectDetail();
      }
    });

    elements.card.addEventListener('close', function () {
      if (state.detailOpen) {
        detail.closeProjectDetail(false);
      }
    });
  } else {
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && state.detailOpen) {
        detail.closeProjectDetail();
      }
    });

    document.addEventListener('pointerdown', function (event) {
      if (!state.detailOpen || !elements.card || elements.card.contains(event.target)) return;

      event.preventDefault();
      event.stopPropagation();
      detail.closeProjectDetail();
    }, true);
  }

  if (elements.imageEl) {
    elements.imageEl.addEventListener('error', function () {
      detail.hideDetailMedia();
    });
  }

  if (elements.previewImage) {
    elements.previewImage.addEventListener('load', function () {
      if (helpers.isDesktopLayout()) {
        preview.positionPreview(helpers.getRow(state.currentId));
      }
    });

    elements.previewImage.addEventListener('error', function () {
      preview.hidePreviewPanel();
    });
  }

  window.addEventListener('resize', detail.syncProjectsLayout);

  if (typeof media.desktopQuery.addEventListener === 'function') {
    media.desktopQuery.addEventListener('change', detail.syncProjectsLayout);
  } else if (typeof media.desktopQuery.addListener === 'function') {
    media.desktopQuery.addListener(detail.syncProjectsLayout);
  }

  detail.syncProjectsLayout();

  /**
   * Refreshes an open detail card after a language switch.
   */
  window.updateProjectLanguage = function () {
    if (!state.detailOpen || !state.currentId || !projects[state.currentId]) return;
    detail.renderDetailCard(state.currentId);
  };
})();
