# Deadpool Chat

Single Page Application que permite chatear con Deadpool usando inteligencia artificial (Google Gemini). Proyecto Integrador — Módulo 3, Soy Henry.

🔗 **App en producción:** [https://deadpoolchat.vercel.app/](https://deadpoolchat.vercel.app/)

---

## Sobre el personaje

Elegí a **Deadpool (Wade Wilson)** por su personalidad distintiva: mercenario bocón, con regeneración acelerada, que rompe la cuarta pared y tiene un humor negro muy característico dirigido casi siempre hacia sí mismo (su propia inmortalidad, su mala suerte).

El system prompt se diseñó con estas reglas explícitas:
- Tono sarcástico e irreverente, con humor negro **sobre sí mismo** (nunca insultos reales hacia el usuario ni temas sensibles de verdad)
- Respuestas cortas (2-3 frases), apropiadas para un formato de chat
- Sin groserías explícitas fuertes
- Nunca rompe el personaje, aunque se le pida

El prompt se probó primero en el Playground de Google AI Studio antes de integrarlo al código, iterando sobre el tono hasta que las respuestas se sintieran consistentemente "Deadpool" sin cruzar líneas de contenido inapropiado.

---

## Stack técnico

- **Frontend:** JavaScript vanilla (sin frameworks), HTML, CSS mobile-first
- **Routing:** SPA con History API (`pushState`, `popstate`), sin librerías
- **IA:** Google Gemini (`gemini-3.6-flash`) vía SDK `@google/genai`
- **Backend:** Vercel Serverless Function (proxy seguro, la API key nunca se expone al cliente)
- **Testing:** Vitest
- **Deploy:** Vercel, con auto-deploy en cada push a `main`

---

## Estructura del proyecto

```
Deadpool-chat/
├── api/
│   └── functions.js        # Serverless function: proxy a Gemini
├── src/
│   ├── index.html
│   ├── styles.css           # Mobile-first + media queries 768px/1024px
│   ├── main.js               # Entry point: listeners + render inicial
│   ├── router.js             # Tabla de rutas + router() + navigateTo()
│   ├── navigation.js          # Intercepción de links internos
│   ├── utils.js               # Funciones puras (testeadas con Vitest)
│   ├── components/
│   │   └── navbar.js
│   └── views/
│       ├── home.js
│       ├── chat.js
│       ├── about.js
│       └── notFound.js
├── tests/
│   └── utils.test.js         # 8 tests unitarios
├── .env.example
├── .gitignore
├── package.json
├── vercel.json                # Rewrite para rutas SPA + output directory
└── README.md
```

---

## Cómo correr el proyecto en local

### Requisitos
- Node.js instalado
- Una API key de [Google AI Studio](https://aistudio.google.com/apikey) (gratis)
- [Vercel CLI](https://vercel.com/docs/cli) instalado globalmente: `npm install -g vercel`

### Pasos

1. Cloná el repositorio y entrá a la carpeta:
```bash
git clone https://github.com/Felipe-Leon-Mahecha/Deadpool-chat.git
cd Deadpool-chat
```

2. Instalá las dependencias:
```bash
npm install
```

3. Creá tu archivo `.env` en la raíz (basado en `.env.example`) con tu API key:
```
GEMINI_API_KEY=tu_api_key_aqui
```

4. Levantá el entorno con Vercel (necesario para que la serverless function funcione local, no alcanza con un Live Server normal):
```bash
vercel dev
```

5. Abrí la URL que te muestre la terminal (usualmente `http://localhost:3000`)

> **Nota:** no uses Live Server ni otro servidor estático simple para probar el chat con IA — solo `vercel dev` puede ejecutar la serverless function de `api/functions.js`.

---

## Cómo ejecutar los tests

```bash
npm run test
```

Corre 8 tests unitarios con Vitest sobre las funciones puras de `src/utils.js`:
- `isValidMessage` — validación de mensajes vacíos/con espacios
- `removeLoadingMessages` — filtrado de burbujas de "escribiendo..."
- `buildGeminiHistory` — conversión del historial al formato que espera Gemini
- `extractReplyText` — extracción segura del texto de respuesta (maneja respuestas vacías o rotas)

---

## Cómo desplegar a Vercel

1. Conectá el repositorio de GitHub a un proyecto nuevo en [Vercel](https://vercel.com)
2. En **Settings → Environment Variables**, agregá `GEMINI_API_KEY` con tu key real (entorno Production y Preview)
3. Verificá que `vercel.json` esté en la raíz del proyecto con esta configuración:
```json
{
  "outputDirectory": "src",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
4. Cada push a `main` dispara un deploy automático (ya viene conectado así desde el setup inicial)

---

## Capturas de pantalla

_(Agregar acá las capturas de: vista Home, vista Chat con conversación real, vista About, y la app funcionando en mobile/tablet/desktop)_

---

## Registro del uso de IA en el proyecto

Se usó IA como apoyo durante todo el desarrollo, principalmente para acompañamiento técnico paso a paso (explicación de conceptos, debugging guiado) y para resolver un bug puntual de integración con la API de Gemini.

### 1. Diseño del system prompt de Deadpool

**Prompt usado:**
> "Elegí a Deadpool como personaje para mi chat de IA. Ayúdame a diseñar un system prompt que capture su personalidad sarcástica y su humor negro, pero que sea apropiado para un chat y no cruce líneas de contenido ofensivo real."

**Cómo influyó:** se generó un system prompt estructurado con tono, reglas de contenido (humor negro solo autodirigido, nunca insultos reales) y restricción de longitud de respuesta. Se probó en el Playground de AI Studio antes de integrarlo al código, iterando sobre el resultado hasta validar que el tono se sostenía en preguntas variadas (casuales y técnicas).

**Decisión tomada:** el prompt final quedó fijo en `api/functions.js`, del lado del servidor, para que nunca sea visible en el frontend.

### 2. Debugging del error 404 al conectar con Gemini

**Contexto del problema:** la serverless function devolvía siempre error 500, con el mensaje real (visto en los logs de Vercel) `GoogleGenerativeAIFetchError: [404 Not Found]` al intentar usar el modelo `gemini-1.5-flash` con el SDK `@google/generative-ai`.

**Cómo se resolvió:** con ayuda de una IA (opencode + Gemini) se diagnosticó que el modelo y el SDK estaban deprecados. Se migró la integración completa a:
```js
import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey });
await ai.models.generateContent({ model: 'gemini-3.6-flash', contents });
```

**Decisión tomada:** se mantuvo el system prompt de Deadpool y el manejo de historial sin cambios — el fix fue exclusivamente la capa de conexión con la API (SDK + nombre del modelo). Se verificó el fix probando el chat en el deploy real de Vercel antes de darlo por cerrado.

### 3. Acompañamiento general del desarrollo

Se usó IA como tutor durante todo el proceso: explicación de conceptos de la cursada (mobile-first, History API, Promises/async-await, patrón ViewModel), revisión de código paso a paso, y guía para resolver errores de configuración (Vercel CLI, variables de entorno, estructura de carpetas). Las decisiones de arquitectura (separación en `router.js`/`navigation.js`/`views/`, extracción de funciones puras a `utils.js` para testing) se tomaron de forma guiada, entendiendo el porqué de cada patrón antes de aplicarlo.
