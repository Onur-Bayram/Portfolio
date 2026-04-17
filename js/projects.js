(function () {
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
  var githubEl = document.getElementById('projectDetailGithub');
  var liveEl = document.getElementById('projectDetailLive');

  if (!rows.length || !numberEl || !titleEl || !descriptionEl || !stackEl || !imageEl || !githubEl || !liveEl) {
    return;
  }

  var projects = {
    join: {
      number: '01',
      title: 'Join',
      description: 'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.',
      image: 'assets/images/projects/join.png',
      imageAlt: 'Join project preview',
      github: '#',
      live: '#',
      tech: [
        { icon: 'assets/icons/tech/css-2026.svg', label: 'CSS' },
        { icon: 'assets/icons/tech/html-2026.svg', label: 'HTML' },
        { icon: 'assets/icons/tech/supabase-2026.svg', label: 'Firebase' },
        { icon: 'assets/icons/tech/angular-2026.svg', label: 'Angular' },
        { icon: 'assets/icons/tech/typescript-2026.svg', label: 'TypeScript' }
      ]
    },
    sharkie: {
      number: '02',
      title: 'Sharkie',
      description: '2D jump-and-run browser game built with object-oriented JavaScript. Fight your way through animated levels, collect items and defeat the end boss.',
      image: 'assets/images/projects/sharkie.png',
      imageAlt: 'Sharkie project preview',
      github: 'https://github.com/Onur-Bayram/Sharkie.git',
      live: 'https://onur-bayram.developerakademie.net/DeveloperAkademie/Sharkie/index.html',
      tech: [
        { icon: 'assets/icons/tech/javascript-2026.svg', label: 'JavaScript' },
        { icon: 'assets/icons/tech/html-2026.svg', label: 'HTML' },
        { icon: 'assets/icons/tech/css-2026.svg', label: 'CSS' }
      ]
    },
    pokedex: {
      number: '03',
      title: 'Pokédex',
      description: 'Interactive Pokédex app that fetches character data from a REST API, lets users browse entries and view detailed information inside a responsive interface.',
      image: 'assets/images/projects/pokedex.png',
      imageAlt: 'Pokédex project preview',
      github: 'https://github.com/Onur-Bayram/Pokedex.git',
      live: 'https://onur-bayram.developerakademie.net/DeveloperAkademie/PokedexP8/index.html',
      tech: [
        { icon: 'assets/icons/tech/javascript-2026.svg', label: 'JavaScript' },
        { icon: 'assets/icons/tech/html-2026.svg', label: 'HTML' },
        { icon: 'assets/icons/tech/css-2026.svg', label: 'CSS' },
        { icon: 'assets/icons/tech/rest-api-2026.svg', label: 'REST API' }
      ]
    }
  };

  var projectOrder = rows
    .map(function (row) {
      return row.dataset.projectId;
    })
    .filter(function (projectId) {
      return Boolean(projects[projectId]);
    });

  var currentId = projectOrder[0];

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

  function renderProject(projectId) {
    var project = projects[projectId];
    if (!project) return;

    currentId = projectId;
    numberEl.textContent = project.number;
    titleEl.textContent = project.title;
    descriptionEl.textContent = project.description;
    imageEl.src = project.image;
    imageEl.alt = project.imageAlt;
    githubEl.href = project.github;
    liveEl.href = project.live;
    renderStack(project.tech);
    updateRowState(projectId);
    showCard();
  }

  rows.forEach(function (row) {
    row.addEventListener('click', function (event) {
      event.preventDefault();
      renderProject(row.dataset.projectId);
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

  renderProject(currentId);
})();