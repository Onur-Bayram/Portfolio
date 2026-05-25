// Project content source.
// Exposes a global data object that powers both the project list and the detail card.
window.PROJECTS_DATA = {
  // Each project entry contains:
  // - static display metadata
  // - translated descriptions
  // - preview media
  // - external links
  // - a tech stack used in the list overlay and detail view
  join: {
    number: '01',
    title: 'Join',
    description_en: 'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.',
    description_de: 'Task-Manager inspiriert vom Kanban-System. Erstelle und organisiere Aufgaben mit Drag-and-Drop-Funktionen, weise Benutzer und Kategorien zu.',
    image: 'assets/images/projects/Joinn.png',
    imageAlt: 'Join project preview',
    github: 'https://github.com/Onur-Bayram/024_Join.git',
    live: 'https://join.onur-bayram.de/',
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
    description_de: '2D Jump-and-Run-Browserspiel, das mit objektorientiertem JavaScript gebaut wurde. Kämpfe dich durch animierte Level, sammle Gegenstände und besiege den Endboss.',
    image: 'assets/images/projects/Sharkie.png',
    imageAlt: 'Sharkie project preview',
    github: 'https://github.com/Onur-Bayram/Sharkie.git',
    live: 'https://sharkie.onur-bayram.de/',
    tech: [
      { icon: 'assets/icons/tech/javascript-2026.svg', label: 'JavaScript' },
      { icon: 'assets/icons/tech/html-2026.svg', label: 'HTML' },
      { icon: 'assets/icons/tech/css-2026.svg', label: 'CSS' }
    ]
  },
  pokedex: {
    number: '03',
    title: 'Pokédex',
    description_en: 'Interactive Pokédex app that fetches character data from a REST API, lets users browse entries and view detailed information inside a responsive interface.',
    description_de: 'Interaktive Pokédex-App, die Charakterdaten von einer REST-API abruft, Benutzern das Durchsuchen von Einträgen ermöglicht und detaillierte Informationen in einer responsiven Oberfläche anzeigt.',
    image: 'assets/images/projects/Pokedexx.png',
    imageAlt: 'Pokédex project preview',
    github: 'https://github.com/Onur-Bayram/Pokedex.git',
    live: 'https://pokedex.onur-bayram.de/',
    tech: [
      { icon: 'assets/icons/tech/javascript-2026.svg', label: 'JavaScript' },
      { icon: 'assets/icons/tech/html-2026.svg', label: 'HTML' },
      { icon: 'assets/icons/tech/css-2026.svg', label: 'CSS' },
      { icon: 'assets/icons/tech/rest-api-2026.svg', label: 'REST API' }
    ]
  }
};
