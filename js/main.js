import {
  applyTheme,
  persistTheme,
  readStoredTheme,
  resolveInitialTheme,
  toggleTheme,
} from './theme.js';
import {
  loadContent,
  normalizeLang,
  persistLang,
  readStoredLang,
  renderContent,
} from './i18n.js';

function mountsFor(lang, theme) {
  return {
    lang,
    theme,
    htmlLang: document.documentElement,
    skipLink: document.getElementById('skip-link'),
    name: document.getElementById('site-name'),
    role: document.getElementById('site-role'),
    affiliations: document.getElementById('site-affiliations'),
    portrait: document.getElementById('portrait'),
    navAbout: document.getElementById('nav-about'),
    navResearch: document.getElementById('nav-research'),
    navNews: document.getElementById('nav-news'),
    navWork: document.getElementById('nav-work'),
    navContact: document.getElementById('nav-contact'),
    linkCv: document.getElementById('link-cv'),
    linkLinkedin: document.getElementById('link-linkedin'),
    linkEmail: document.getElementById('link-email'),
    linkUnibo: document.getElementById('link-unibo'),
    aboutTitle: document.getElementById('about-title'),
    aboutBody: document.getElementById('about-body'),
    researchTitle: document.getElementById('research-title'),
    researchBody: document.getElementById('research-body'),
    newsTitle: document.getElementById('news-title'),
    newsBody: document.getElementById('news-body'),
    workTitle: document.getElementById('work-title'),
    workBody: document.getElementById('work-body'),
    contactTitle: document.getElementById('contact-title'),
    contactBody: document.getElementById('contact-body'),
    btnEn: document.getElementById('btn-en'),
    btnIt: document.getElementById('btn-it'),
    themeToggle: document.getElementById('theme-toggle'),
  };
}

async function setLanguage(lang) {
  const normalized = normalizeLang(lang);
  const theme = document.documentElement.dataset.theme || 'light';
  const content = await loadContent(normalized);
  renderContent(content, mountsFor(normalized, theme));
  persistLang(normalized);
  document.title = content.meta.name;
}

function initTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = resolveInitialTheme({
    stored: readStoredTheme(),
    prefersDark,
  });
  applyTheme(theme);
  persistTheme(theme);
  return theme;
}

async function boot() {
  initTheme();
  const lang = readStoredLang() || 'en';
  await setLanguage(lang);

  document.getElementById('btn-en').addEventListener('click', () => setLanguage('en'));
  document.getElementById('btn-it').addEventListener('click', () => setLanguage('it'));
  document.getElementById('theme-toggle').addEventListener('click', async () => {
    const next = toggleTheme(document.documentElement.dataset.theme);
    applyTheme(next);
    persistTheme(next);
    const currentLang = readStoredLang() || 'en';
    const content = await loadContent(currentLang);
    renderContent(content, mountsFor(currentLang, next));
  });
}

boot().catch((err) => {
  console.error(err);
  document.getElementById('about-body').textContent =
    'Could not load site content. Please serve this folder over HTTP (python3 -m http.server).';
});
