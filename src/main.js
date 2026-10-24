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
  const done = getProgress();
  const active = courses.find(course => course.id === selected);
  const finishedCount = done.length;
  app.innerHTML = `
    <div class="dashboard">
      <aside class="sidebar">
        <div class="brand"><span class="brand-icon">✳</span> SMB AI<span class="brand-dot">.</span></div>
        <div class="nav-label">ESPACE ÉLÈVE</div>
        <a class="nav-link active" href="#parcours">▦ <span>Mon parcours</span></a>
        <div class="sidebar-bottom"><span class="avatar">S</span><div><strong>smb-ai</strong><small>Élève</small></div></div>
      </aside>
      <main class="main-content">
        <header class="topbar"><span>Plateforme de formation</span><button id="logout" class="ghost-button">Déconnexion ↗</button></header>
        <div class="page-body">
          <div class="eyebrow">VOTRE ESPACE D'APPRENTISSAGE</div>
          <h1 class="page-title">Apprenez l'IA. <span>Pas à pas.</span></h1>
          <p class="page-subtitle">Neuf niveaux pour comprendre, expérimenter et progresser à votre rythme.</p>
          <section class="hero-stats">
            <div><small>VOTRE PROGRESSION</small><strong>${finishedCount} <em>/ 4 leçons</em></strong><div class="progress-track"><span style="width:${Math.min(100, finishedCount * 25)}%"></span></div></div>
            <div><small>PARCOURS</small><strong>9 <em>niveaux</em></strong><p>Du premier prompt aux systèmes multimodèles.</p></div>
            <div><small>VOTRE OBJECTIF</small><strong>01 <em>/ 09</em></strong><p>Commencez par les fondamentaux.</p></div>
          </section>
          ${active ? renderLesson(active, done) : `
            <div class="section-heading"><h2>Les 9 niveaux</h2><span>01 disponible · 08 à venir</span></div>
            <section id="parcours" class="course-grid">
              ${courses.map(course => `
                <article class="course-card ${course.status === 'coming' ? 'muted-card' : ''}">
                  <div class="course-top"><span class="course-icon">${icons[course.icon]}</span><span class="course-number">NIVEAU ${String(course.id).padStart(2, '0')}</span></div>
                  <h3>${escapeHtml(course.title)}</h3>
                  <p>${escapeHtml(course.subtitle)}</p>
                  <div class="course-foot"><span>${course.lessons} leçons</span>
                    ${course.status === 'available' ? '<button class="course-action" data-open="1">Explorer →</button>' : '<span class="coming-tag">Bientôt</span>'}
                  </div>
                </article>`).join('')}
            </section>`}
        </div>
      </main>
    </div>`;
  document.querySelector('#logout').addEventListener('click', () => {
    sessionStorage.removeItem(AUTH_KEY);
    renderLogin();
  });
  document.querySelectorAll('[data-open]').forEach(button => {
    button.addEventListener('click', () => renderDashboard(Number(button.dataset.open)));
  });
  document.querySelector('#back')?.addEventListener('click', () => renderDashboard());
  document.querySelectorAll('[data-complete]').forEach(button => {
    button.addEventListener('click', () => {
      const n = Number(button.dataset.complete);
      const next = new Set(getProgress());
      next.has(n) ? next.delete(n) : next.add(n);
      localStorage.setItem(PROGRESS_KEY, JSON.stringify([...next]));
      renderDashboard(1);
    });
  });
}

function renderLesson(course, done) {
  return `<section class="lesson-panel">
    <button id="back" class="text-button">← Retour aux niveaux</button>
    <div class="eyebrow">NIVEAU 01 · LES BASES</div>
    <h2>${escapeHtml(course.title)}</h2>
    <p>${escapeHtml(course.subtitle)}</p>
    <div class="lesson-list">
      ${course.topics.map((topic, i) => `
        <div class="lesson-row"><span class="lesson-index">${String(i + 1).padStart(2,'0')}</span>
          <div><strong>${escapeHtml(topic)}</strong><small>Leçon ${i + 1} · Contenu en préparation</small></div>
          <button data-complete="${i + 1}" class="check-button ${done.includes(i + 1) ? 'checked' : ''}" aria-label="${done.includes(i + 1) ? 'Marquer comme non terminée' : 'Marquer comme terminée'}">${done.includes(i + 1) ? '✓ Terminée' : 'Marquer comme vue'}</button>
        </div>`).join('')}
    </div>
    <p class="lesson-disclaimer">Prototype : les leçons seront rédigées et illustrées progressivement. La progression est conservée dans ce navigateur.</p>
  </section>`;
}

if (isLoggedIn()) renderDashboard();
else renderLogin();
