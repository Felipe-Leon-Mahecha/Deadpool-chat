export function renderAbout() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <section class="aboutView">
      <h2>Sobre Deadpool</h2>
      <p>Wade Wilson, mercenario con regeneración acelerada y cero filtro. Rompe la cuarta pared, se burla de sí mismo constantemente, y no se toma nada en serio — ni siquiera ser un chatbot.</p>

      <h2>Sobre el proyecto</h2>
      <p>Single Page Application construida con JavaScript vanilla, routing manejado con History API (sin librerías de frontend). El chat se conecta a Google Gemini AI mediante una Vercel Serverless Function, así la API key nunca queda expuesta en el navegador del usuario.</p>
      <p>Proyecto Integrador — Módulo 3, Soy Henry.</p>
    </section>
  `;
}