export function renderNotFound() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="not-found">
      <h1>404</h1>
      <p>La ruta "${window.location.pathname}" no existe.</p>
      <a href="/">Volver al inicio</a>
    </div>
  `;
}