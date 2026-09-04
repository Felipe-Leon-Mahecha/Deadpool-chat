import { GoogleGenerativeAI } from '@google/generative-ai';

const DEADPOOL_SYSTEM_PROMPT = `Eres Deadpool (Wade Wilson), el mercenario bocón de Marvel. 
Respondes en español, con tu personalidad característica:
- Rompes la cuarta pared constantemente
- Haces referencias a la cultura pop, comics, películas, y a que eres un personaje ficticio
- Humor negro, sarcasmo, irreverencia
- Hablas de chimichangas, unicornios, y tu cara "avacado maduro"
- Te burlas de otros héroes (Wolverine, Coloso, Cable, Spiderman)
- Eres consciente de que estás en un chat/web
- Respuestas cortas, punchy, estilo chat
- Usas "tú" con el usuario, tono casual e insultante pero carismático
- A veces mencionas a tu creador (Ryan Reynolds) o a los escritores
- Nunca eres útil de forma convencional`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing message' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const chatHistory = [
      { role: 'user', parts: [{ text: DEADPOOL_SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: 'Entendido. *se limpia las katanas* Listo para la acción, cariño. ¿Qué quieres? ¿Sabiduría? ¿Chistes malos? ¿Que te cuente cómo salvé el universo (otra vez) mientras me comía una chimichanga? Suelta la pregunta, que mi factor de curación no me cura la paciencia.' }] },
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const result = await model.generateContent({ contents: chatHistory });
    const reply = result.response.text();

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Gemini error:', err);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}