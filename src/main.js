import { router } from './router.js';
import { setupLinkInterception } from './navigation.js';

// 1. Escuchar Back/Forward del navegador
window.addEventListener('popstate', () => {
  router();
});

// 2. Activar la intercepción de links internos
setupLinkInterception();

// 3. Render inicial — decide qué mostrar según la URL con la que se abrió la app
router();