import { navbar } from '../components/navbar.js';

// Aquí se guarda el historial de conversación de la sesión (array en memoria)
let messages = [
  { role: 'character', text: 'Oh mira, otro humano con preguntas. ¿Vienes por sabiduría o solo quieres ver si sangro cuando me insultan?' }
];

// Aquí se cumple la función de obtener la respuesta de Deadpool desde la API (fetch a la serverless function)
async function getDeadpoolReply(userMessage) {
  // Aquí se arma el historial que se manda a Gemini, sin el mensaje de loading
  const history = messages
    .filter(m => !m.loading)
    .map(m => ({ role: m.role, text: m.text }));

  const response = await fetch('/api/functions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage, history }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.reply;
}

function renderMessages() {
  const container = document.querySelector('.chatMessages');
  if (!container) return;

  container.innerHTML = messages.map(m => `
    <div class="message message--${m.role}${m.loading ? ' message--loading' : ''}">${m.text}</div>
  `).join('');

  // Aquí se hace scroll automático al último mensaje
  container.scrollTop = container.scrollHeight;
}

async function handleSubmit(event) {
  event.preventDefault();
  const input = document.querySelector('.chatInput');
  const text = input.value.trim();
  if (!text) return; // aquí se descarta el input vacío

  // Aquí se agrega el mensaje del usuario al historial, al instante
  messages.push({ role: 'user', text });
  input.value = '';
  renderMessages();

  // Aquí se muestra el estado loading (burbuja de "escribiendo...")
  messages.push({ role: 'character', text: 'Deadpool está escribiendo...', loading: true });
  renderMessages();

  // Aquí se espera la respuesta de la API
  try {
    const reply = await getDeadpoolReply(text);
    messages = messages.filter(m => !m.loading); // aquí se saca la burbuja de loading
    messages.push({ role: 'character', text: reply });
  } catch (err) {
    messages = messages.filter(m => !m.loading); // aquí se saca la burbuja de loading
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