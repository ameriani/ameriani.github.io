export const LANG_STORAGE_KEY = 'am-lang';

export function normalizeLang(value) {
  const v = String(value || '').toLowerCase();
  return v === 'it' ? 'it' : 'en';
}

export function contentUrl(lang) {
  return normalizeLang(lang) === 'it' ? 'data/content-it.json' : 'data/content-en.json';
}

export function persistLang(lang, storage = globalThis.localStorage) {
  storage?.setItem(LANG_STORAGE_KEY, normalizeLang(lang));
}

export function readStoredLang(storage = globalThis.localStorage) {
  const value = storage?.getItem(LANG_STORAGE_KEY);
  if (value === 'en' || value === 'it') return value;
  return null;
}

export function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function buildWorkCardHtml(item, pdfLabel) {
  const pdf =
    item.pdf && String(item.pdf).trim()
      ? `<p class="work-card__actions"><a class="btn" href="${escapeHtml(item.pdf)}" target="_blank" rel="noopener">${escapeHtml(pdfLabel)}</a></p>`
      : '';
  return `<article class="work-card">
  <p class="work-card__kind">${escapeHtml(item.kind)}</p>
  <h3 class="work-card__title">${escapeHtml(item.title)}</h3>
  <p class="work-card__meta">${escapeHtml(item.meta)}</p>
  ${pdf}
</article>`;
}

/**
 * mounts: {
 *   htmlLang, skipLink, name, role, affiliations, portrait,
 *   navAbout, navResearch, navNews, navWork, navContact,
 *   linkCv, linkLinkedin, linkEmail, linkUnibo,
 *   aboutTitle, aboutBody,
 *   researchTitle, researchBody,
 *   newsTitle, newsBody,
 *   workTitle, workBody,
 *   contactTitle, contactBody,
 *   btnEn, btnIt, themeToggle
 * }
 * Nodes need textContent / innerHTML / setAttribute / hidden as appropriate.
 */
export function renderContent(content, mounts) {
  const { meta, ui, about, research, news, work, contact } = content;

  if (mounts.htmlLang) mounts.htmlLang.setAttribute('lang', mounts.lang || 'en');
  if (mounts.skipLink) mounts.skipLink.textContent = ui.skipToContent;
  if (mounts.name) mounts.name.textContent = meta.name;
  if (mounts.role) mounts.role.textContent = meta.role;
  if (mounts.affiliations) mounts.affiliations.textContent = meta.affiliations;
  if (mounts.portrait) {
    mounts.portrait.setAttribute('src', meta.profileImage);
    mounts.portrait.setAttribute('alt', meta.name);
  }

  if (mounts.navAbout) mounts.navAbout.textContent = ui.nav.about;
  if (mounts.navResearch) mounts.navResearch.textContent = ui.nav.research;
  if (mounts.navNews) mounts.navNews.textContent = ui.nav.news;
  if (mounts.navWork) mounts.navWork.textContent = ui.nav.work;
  if (mounts.navContact) mounts.navContact.textContent = ui.nav.contact;

  const setLink = (el, href, label) => {
    if (!el) return;
    if (!href) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.setAttribute('href', href);
    el.textContent = label;
  };
  setLink(mounts.linkCv, meta.links.cv, ui.linkCv);
  setLink(mounts.linkLinkedin, meta.links.linkedin, ui.linkLinkedin);
  setLink(mounts.linkEmail, meta.links.emailHref, ui.linkEmail);
  setLink(mounts.linkUnibo, meta.links.unibo, ui.linkUnibo);

  if (mounts.aboutTitle) mounts.aboutTitle.textContent = about.title;
  if (mounts.aboutBody) {
    mounts.aboutBody.innerHTML = about.paragraphs
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join('');
  }

  if (mounts.researchTitle) mounts.researchTitle.textContent = research.title;
  if (mounts.researchBody) {
    mounts.researchBody.innerHTML = research.items
      .map(
        (item) =>
          `<div class="interest"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></div>`
      )
      .join('');
  }

  if (mounts.newsTitle) mounts.newsTitle.textContent = news.title;
  if (mounts.newsBody) {
    mounts.newsBody.innerHTML = `<ul class="news-list">${news.items
      .map(
        (item) =>
          `<li><span class="news-date">[${escapeHtml(item.date)}]</span> ${escapeHtml(item.text)}</li>`
      )
      .join('')}</ul>`;
  }

  if (mounts.workTitle) mounts.workTitle.textContent = work.title;
  if (mounts.workBody) {
    mounts.workBody.innerHTML = work.items
      .map((item) => buildWorkCardHtml(item, ui.pdfLabel))
      .join('');
  }

  if (mounts.contactTitle) mounts.contactTitle.textContent = contact.title;
  if (mounts.contactBody) {
    mounts.contactBody.innerHTML = `<p><a href="${escapeHtml(meta.links.emailHref)}">${escapeHtml(contact.email)}</a></p>
<p>${escapeHtml(contact.department)}</p>`;
  }

  if (mounts.btnEn) mounts.btnEn.setAttribute('aria-pressed', String(mounts.lang === 'en'));
  if (mounts.btnIt) mounts.btnIt.setAttribute('aria-pressed', String(mounts.lang === 'it'));
  if (mounts.themeToggle && mounts.theme === 'dark') {
    mounts.themeToggle.setAttribute('aria-label', ui.themeLight);
  } else if (mounts.themeToggle) {
    mounts.themeToggle.setAttribute('aria-label', ui.themeDark);
  }
}

export async function loadContent(lang, fetchImpl = fetch) {
  const res = await fetchImpl(contentUrl(lang));
  if (!res.ok) throw new Error(`Failed to load ${contentUrl(lang)}`);
  return res.json();
}
