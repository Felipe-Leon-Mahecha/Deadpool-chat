// Aquí se valida que el mensaje no esté vacío (ni solo espacios)
export function isValidMessage(text) {
  return typeof text === 'string' && text.trim().length > 0;
}

// Aquí se sacan las burbujas de "escribiendo..." antes de mandar el historial a Gemini
export function removeLoadingMessages(messages) {
  return messages.filter(m => !m.loading);
}

// Aquí se convierte el array de mensajes en memoria al formato que espera la API de Gemini
export function buildGeminiHistory(messages) {
  return removeLoadingMessages(messages).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    text: m.text,
  }));
}

// Aquí se extrae el texto de la respuesta de Gemini, o null si viene vacía/rota
export function extractReplyText(apiResponse) {
  return apiResponse?.reply?.trim() || null;
}