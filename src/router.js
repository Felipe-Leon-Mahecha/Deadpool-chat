import { renderHome } from './views/home.js';
import { renderChat } from './views/chat.js';
import { renderAbout } from './views/about.js';
import { renderNotFound } from './views/notFound.js';

const routes = {
  '/': renderHome,
  '/chat': renderChat,
  '/about': renderAbout,
};

export function router() {
  const path = window.location.pathname;
  const render = routes[path] || renderNotFound;
  render();
}

export function navigateTo(path) {
  history.pushState(null, '', path);
  router(); // CRÍTICO: pushState NO dispara popstate solo, hay que llamar a mano
}