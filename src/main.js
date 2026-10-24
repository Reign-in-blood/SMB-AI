import { DEMO_ACCOUNT, APP_TITLE } from './config.js';
import { courses } from './data/courses.js';

const app = document.querySelector('#app');
const AUTH_KEY = 'smb-ai-demo-session';
const PROGRESS_KEY = 'smb-ai-demo-progress';

const icons = {
  sparkles: '✦', message: '◉', image: '▧', sliders: '☷', link: '⌁',
  zap: 'ϟ', bot: '◇', network: '✣', layers: '▤'
};

function isLoggedIn() {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

function getProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]'); }
  catch { return []; }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function renderLogin(error = '') {
  app.innerHTML = `
    <main class="login-screen">
      <div class="glow glow-one"></div><div class="glow glow-two"></div>
      <section class="login-layout">
        <div class="intro">
          <div class="brand"><span class="brand-icon">✳</span> ${APP_TITLE}<span class="brand-dot">.</span></div>
          <div class="eyebrow">VOTRE PARCOURS D'APPRENTISSAGE</div>
          <h1>Bienvenue dans<br />le monde de <span>l'IA.</span></h1>
          <p>Des premiers échanges avec un chatbot jusqu'aux systèmes les plus avancés. Avancez à votre rythme, une étape après l'autre.</p>
          <div class="intro-tags"><span>✦ 9 niveaux</span><span>◈ Cours illustrés</span><span>◎ À votre rythme</span></div>
        </div>
        <form id="login-form" class="login-card">
          <div class="card-icon">↗</div>
          <h2>Se connecter</h2>
          <p>Accédez à votre espace de formation.</p>
          <label for="username">Nom d'utilisateur</label>
          <input id="username" name="username" type="text" autocomplete="username" placeholder="Votre identifiant" required />
          <label for="password">Mot de passe</label>
          <input id="password" name="password" type="password" autocomplete="current-password" placeholder="Votre mot de passe" required />
          <div id="login-error" class="error" role="alert">${escapeHtml(error)}</div>
          <button class="primary-button" type="submit">Accéder aux cours <span>→</span></button>
          <div class="demo-note">Accès de démonstration · Aucun compte réel créé</div>
        </form>
      </section>
      <footer class="footer">SMB AI · Apprendre, comprendre, progresser.</footer>
    </main>`;
  document.querySelector('#login-form').addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('username') === DEMO_ACCOUNT.username && data.get('password') === DEMO_ACCOUNT.password) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      renderDashboard();
    } else {
      document.querySelector('#login-error').textContent = 'Identifiant ou mot de passe incorrect.';
    }
  });
}

function renderDashboard(selected = null) {
  if (!isLoggedIn()) return renderLogin();
  const active = courses.find(c => c.id === selected);
  app.innerHTML = `
    <div class="dashboard">
      <aside class="sidebar">
        <div class="brand"><span class="brand-icon">✳</span> SMB AI<span class="brand-dot">.</span></div>
        <div class="nav-label">SUPPORT DE COURS</div>
        <button class="nav-link active nav-button" id="home">▦ <span>Les 9 niveaux</span></button>
        <div class="sidebar-bottom"><span class="avatar">S</span><div><strong>smb-ai</strong><small>Présentation</small></div></div>
      </aside>
      <main class="main-content">
        <header class="topbar"><span>Support pédagogique · 9 niveaux de pratique de l'IA</span><button id="logout" class="ghost-button">Déconnexion ↗</button></header>
        <div class="page-body">
          ${active ? renderLevel(active) : renderStairs()}
        </div>
      </main>
    </div>`;
  document.querySelector('#logout').addEventListener('click', () => {
    sessionStorage.removeItem(AUTH_KEY);
    renderLogin();
  });
  document.querySelector('#home')?.addEventListener('click', () => renderDashboard());
  document.querySelector('#back')?.addEventListener('click', () => renderDashboard());
  document.querySelectorAll('[data-level]').forEach(button =>
    button.addEventListener('click', () => renderDashboard(Number(button.dataset.level)))
  );
  document.querySelector('#prev')?.addEventListener('click', () => renderDashboard(active.id - 1));
  document.querySelector('#next')?.addEventListener('click', () => renderDashboard(active.id + 1));
}
function renderStairs() {
  return `<div class="eyebrow">SUPPORT DE PRÉSENTATION · PARCOURS COMPLET</div>
    <h1 class="page-title">Les 9 marches <span>de l'IA</span></h1>
    <p class="page-subtitle">De la simple question à l'orchestration de plusieurs modèles. Sélectionnez une marche pour présenter le niveau.</p>
    <div class="stair-legend"><span>1 · Premiers pas</span><span>9 · Systèmes avancés</span></div>
    <section class="staircase" aria-label="Escalier des neuf niveaux d'IA">
      ${courses.map((c,i) => `
        <button class="stair" data-level="${c.id}" style="--n:${i}" aria-label="Niveau ${c.id} : ${escapeHtml(c.title)}">
          <span class="stair-number">${String(c.id).padStart(2,'0')}</span>
          <span class="stair-name">${escapeHtml(c.title)}</span>
          <span class="stair-arrow" aria-hidden="true">↗</span>
        </button>`).join('')}
    </section>
    <p class="stair-caption">Chaque marche représente une manière plus élaborée d'utiliser l'IA. Il s'agit d'un parcours pédagogique, pas d'une certification officielle.</p>`;
}
function renderLevel(c) {
  return `<div class="level-page">
    <button id="back" class="text-button">← Retour à l'escalier</button>
    <div class="level-hero"><div class="level-big-number">${String(c.id).padStart(2,'0')}</div>
      <div><div class="eyebrow">NIVEAU ${c.id} SUR 9 · PRATIQUE DE L'IA</div><h1>${escapeHtml(c.title)}</h1><p>${escapeHtml(c.subtitle)}</p></div>
    </div>
    <div class="level-sections">
      <section class="level-block"><div class="eyebrow">EN QUOI ÇA CONSISTE ?</div><h2>Comprendre le niveau</h2><p>${escapeHtml(c.description)}</p><div class="keyword">${escapeHtml(c.keyword)}</div></section>
      <section class="level-block"><div class="eyebrow">EXEMPLE À PROJETER</div><h2>En pratique</h2><blockquote>${escapeHtml(c.example)}</blockquote><div class="eyebrow">DÉMONSTRATION EN DIRECT</div><p>${escapeHtml(c.practice)}</p></section>
    </div>
    <nav class="level-navigation" aria-label="Navigation entre les niveaux">
      ${c.id > 1 ? '<button id="prev" class="ghost-button">← Niveau précédent</button>' : '<span></span>'}
      ${c.id < 9 ? '<button id="next" class="primary-button next-level">Niveau suivant →</button>' : '<span></span>'}
    </nav>
  </div>`;
}
if (isLoggedIn()) renderDashboard();
else renderLogin();
