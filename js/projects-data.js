// Project data.
/**
 * @typedef {Object} ProjectTech
 * @property {string} icon Icon path.
 * @property {string} label Visible label.
 */

/**
 * @typedef {Object} ProjectEntry
 * @property {string} number Project number.
 * @property {string} title Project title.
 * @property {string} description_en English description.
 * @property {string} description_de German description.
 * @property {string} image Preview image path.
 * @property {string} imageAlt Image alt text.
 * @property {string} github GitHub URL.
 * @property {string} live Live URL.
 * @property {ProjectTech[]} tech Tech stack.
 */

/** @type {Record<string, ProjectEntry>} */
window.PROJECTS_DATA = {
  join: {
    number: '01',
    title: 'Join',
    description_en: 'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.',
    description_de: 'Task-Manager inspiriert vom Kanban-System. Erstelle und organisiere Aufgaben mit Drag-and-Drop-Funktionen, weise Benutzer und Kategorien zu.',
    image: 'assets/images/projects/Joinn.png',
    imageAlt: 'Join project preview',
    github: 'https://github.com/Onur-Bayram/024_Join.git',
    live: 'projects/join/index.html',
    tech: [
      { icon: 'assets/icons/tech/css-2026.svg', label: 'CSS' },
      { icon: 'assets/icons/tech/html-2026.svg', label: 'HTML' },
      { icon: 'assets/icons/tech/supabase-2026.svg', label: 'Supabase' },
      { icon: 'assets/icons/tech/angular-2026.svg', label: 'Angular' },
      { icon: 'assets/icons/tech/typescript-2026.svg', label: 'TypeScript' }
    ]
  },
  sharkie: {
    number: '02',
    title: 'Sharkie',
    description_en: '2D jump-and-run browser game built with object-oriented JavaScript. Fight your way through animated levels, collect items and defeat the end boss.',
    description_de: '2D Jump-and-Run-Browserspiel, das mit objektorientiertem JavaScript gebaut wurde. K\u00e4mpfe dich durch animierte Level, sammle Gegenst\u00e4nde und besiege den Endboss.',
    image: 'assets/images/projects/Sharkie.jpg',
    imageAlt: 'Sharkie project preview',
    github: 'https://github.com/Onur-Bayram/Sharkie.git',
    live: 'projects/sharkie/index.html',
    tech: [
      { icon: 'assets/icons/tech/javascript-2026.svg', label: 'JavaScript' },
      { icon: 'assets/icons/tech/html-2026.svg', label: 'HTML' },
      { icon: 'assets/icons/tech/css-2026.svg', label: 'CSS' }
    ]
  },
  pokedex: {
    number: '03',
    title: 'Pok\u00e9dex',
    description_en: 'Interactive Pok\u00e9dex app that fetches character data from a REST API, lets users browse entries and view detailed information inside a responsive interface.',
    description_de: 'Interaktive Pok\u00e9dex-App, die Charakterdaten von einer REST-API abruft, Benutzern das Durchsuchen von Eintr\u00e4gen erm\u00f6glicht und detaillierte Informationen in einer responsiven Oberfl\u00e4che anzeigt.',
    image: 'assets/images/projects/Pokedexx.jpg',
    imageAlt: 'Pok\u00e9dex project preview',
    github: 'https://github.com/Onur-Bayram/Pokedex.git',
    live: 'projects/pokedex/index.html',
    tech: [
      { icon: 'assets/icons/tech/javascript-2026.svg', label: 'JavaScript' },
      { icon: 'assets/icons/tech/html-2026.svg', label: 'HTML' },
      { icon: 'assets/icons/tech/css-2026.svg', label: 'CSS' },
      { icon: 'assets/icons/tech/rest-api-2026.svg', label: 'REST API' }
    ]
  }
};
