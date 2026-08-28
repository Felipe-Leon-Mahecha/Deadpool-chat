export function renderChat() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <main class="chatApp">
      <header class="chatHeader">
        <h1 class="chatTitle">Deadpool</h1>
        <p class="chatSubtitle">Mercenario bocón · siempre regenerándose</p>
      </header>

      <section class="chatMessages" aria-label="Mensajes">
        <div class="message message--character">
          Oh mira, otro humano con preguntas. ¿Vienes por sabiduría o solo quieres ver si sangro cuando me insultan?
        </div>
      </section>

      <form class="chatComposer">
        <input class="chatInput" type="text" placeholder="Escribile algo a Deadpool…" aria-label="Escribe tu mensaje" />
        <button class="chatSend" type="submit">Enviar</button>
      </form>
    </main>
  `;
}