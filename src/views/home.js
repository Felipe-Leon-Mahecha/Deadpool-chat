import { navbar } from '../components/navbar.js';

export function renderHome() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    ${navbar('/')}
    <div class="homeView">
      <h1>Deadpool</h1>
      <p>El mercenario bocón, inmortal (más o menos) y con el filtro roto. Pregúntale lo que sea, si sobrevive te responde.</p>
      <a href="/chat" class="btn btn--primary">Empezar a chatear</a>
    </div>
  `;
}