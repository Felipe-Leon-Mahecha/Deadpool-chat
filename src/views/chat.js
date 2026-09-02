import { navbar } from '../components/navbar.js';

// Array en memoria — el "historial de conversación durante la sesión"
let messages = [
  { role: 'character', text: 'Oh mira, otro humano con preguntas. ¿Vienes por sabiduría o solo quieres ver si sangro cuando me insultan?' }
];

// Simula la respuesta de Gemini — esto se reemplaza por un fetch real más adelante
function fakeDeadpoolReply(userMessage) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Ah, ¿en serio me preguntás eso? Qué original.');
    }, 800);
  });
}

function renderMessages() {
  const container = document.querySelector('.chatMessages');
  if (!container) return;

  container.innerHTML = messages.map(m => `
    <div class="message message--${m.role}${m.loading ? ' message--loading' : ''}">${m.text}</div>
  `).join('');

  // Scroll automático al último mensaje
  container.scrollTop = container.scrollHeight;
}

async function handleSubmit(event) {
  event.preventDefault();
  const input = document.querySelector('.chatInput');
  const text = input.value.trim();
  if (!text) return; // no dispares nada con input vacío (edge case de la lecture 4)

  // 1. Mensaje del usuario, al instante
  messages.push({ role: 'user', text });
  input.value = '';
  renderMessages();

  // 2. Estado loading — burbuja de "escribiendo..."
  messages.push({ role: 'character', text: 'Deadpool está escribiendo...', loading: true });
  renderMessages();

  // 3. Esperar la respuesta (simulada por ahora)
  try {
    const reply = await fakeDeadpoolReply(text);
    messages = messages.filter(m => !m.loading); // saca la burbuja de loading
    messages.push({ role: 'character', text: reply });
  } catch (err) {
    messages = messages.filter(m => !m.loading);
    messages.push({ role: 'character', text: 'Algo salió mal. Intenta de nuevo.' });
  }
  renderMessages();
}

export function renderChat() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    ${navbar('/chat')}
    <main class="chatApp">
      <header class="chatHeader">
        <h1 class="chatTitle">Deadpool</h1>
        <p class="chatSubtitle">Mercenario bocón · siempre regenerándose</p>
      </header>

      <section class="chatMessages" aria-label="Mensajes"></section>

      <form class="chatComposer">
        <input class="chatInput" type="text" placeholder="Escribile algo a Deadpool…" aria-label="Escribe tu mensaje" />
        <button class="chatSend" type="submit">Enviar</button>
      </form>
    </main>
  `;

  renderMessages();

  const form = document.querySelector('.chatComposer');
  form.addEventListener('submit', handleSubmit);
}