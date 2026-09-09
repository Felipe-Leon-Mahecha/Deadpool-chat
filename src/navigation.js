import { navigateTo } from './router.js';

export function setupLinkInterception() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Aquí se descartan los casos que no se interceptan: Ctrl/Cmd-click, target=_blank, links externos o rutas que no empiezan con /
    const isModified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    const isNewTab = link.target === '_blank';
    const isExternal = link.origin !== window.location.origin;

    if (isModified || isNewTab || isExternal) return;
    if (!href.startsWith('/')) return;

    event.preventDefault();
    navigateTo(href);
  });
}