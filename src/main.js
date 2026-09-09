import { router } from './router.js';
import { setupLinkInterception } from './navigation.js';

// Aquí se escuchan los botones Back/Forward del navegador (evento popstate)
window.addEventListener('popstate', () => {
  router();
});

// Aquí se activa la intercepción de los links internos
setupLinkInterception();

// Aquí se hace el render inicial según la URL con la que se abrió la app
router();