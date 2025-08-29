import Groq from "groq-sdk";
import { Index } from "@upstash/vector";

export async function POST(req) {
  const { question } = await req.json();

  // 1. Configurar modelo Groq
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  // 2. Configurar Upstash Vector
  const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN,
  });

  try {
    // 3. Generar embedding simple usando Groq (simulado con hash)
    const questionEmbedding = await generateSimpleEmbedding(question);

    // 4. Buscar en Upstash Vector
    let relevantContext = "";
    try {
      const searchResults = await index.query({
        vector: questionEmbedding,
        topK: 1,
        includeMetadata: true,
      });

      if (searchResults.length > 0) {
        relevantContext = searchResults[0].metadata?.content || "";
        console.log("✅ Vector encontrado en Upstash:", relevantContext.substring(0, 100) + "...");
      }
    } catch (vectorError) {
      console.log("⚠️ Vector search failed, using fallback:", vectorError.message);
    }

    // 5. Contexto de respaldo si no hay vector
    const fallbackContext = `
    FIESTAS PATRIAS DE CHILE - 18 DE SEPTIEMBRE:
    
    HISTORIA: El 18 de septiembre de 1810 se formó la Primera Junta Nacional de Gobierno en Chile, marcando el inicio del proceso de independencia del Imperio Español. Este día se celebra como el Día de la Independencia Nacional y las celebraciones duran varios días, conocidas como Fiestas Patrias.
    
    COMIDAS TRADICIONALES: Las empanadas de pino son el plato más emblemático, preparadas con carne, cebolla, huevo duro, aceitunas y pasas. También se preparan asados, anticuchos, sopaipillas, cazuela de cordero, pastel de choclo. Las bebidas incluyen chicha, terremoto (vino pipeño con helado de piña) y mote con huesillo.
    
    MÚSICA Y BAILES: La cueca es la danza nacional de Chile y se baila especialmente durante las Fiestas Patrias. La música tradicional incluye tonadas chilenas, vals chileno y música folclórica con guitarras, acordeón y arpa.
    
    JUEGOS TÍPICOS: Rayuela (juego con tejos), palo ensebado, carreras de sacos, quebrar la piñata, rodeo chileno y elevar volantines (cometas).
    
    TRADICIONES: Las fondas y ramadas son lugares de celebración decorados con banderas chilenas. La gente usa vestimenta típica como mantas, sombreros de huaso y vestidos de china.
    `;

    // 6. Usar contexto del vector o fallback
    const contextToUse = relevantContext.length > 50 ? relevantContext : fallbackContext;
    const sourceInfo = relevantContext.length > 50 ? "(Información desde base vectorial Upstash)" : "(Información desde contexto local)";
    
    // 7. Generar respuesta con Groq
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Eres un asistente experto en las tradiciones chilenas y las Fiestas Patrias del 18 de Septiembre. Responde con entusiasmo patriótico, usando emojis chilenos 🇨🇱 y expresiones típicas. Siempre saluda con '¡Viva Chile!' y termina con '¡Que vivan las Fiestas Patrias!'. Al final de tu respuesta, menciona brevemente la fuente de información."
        },
        {
          role: "user",
          content: `Contexto sobre las Fiestas Patrias de Chile: ${contextToUse}\n\nPregunta: ${question}\n\nFuente: ${sourceInfo}`
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.3,
      max_tokens: 1000,
    });

    const answer = completion.choices[0]?.message?.content || "¡Viva Chile! No pude generar una respuesta, pero ¡que vivan las Fiestas Patrias! 🇨🇱";

    return new Response(JSON.stringify({ answer }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Error procesando la consulta sobre las Fiestas Patrias 🇨🇱" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Función para generar embedding simple (simulado)
async function generateSimpleEmbedding(text) {
  // Crear un embedding simple de 384 dimensiones usando hash del texto
  const hash = simpleHash(text.toLowerCase());
  const embedding = new Array(384).fill(0);
  
  // Llenar el embedding con valores basados en el hash
  for (let i = 0; i < 384; i++) {
    embedding[i] = Math.sin(hash + i) * 0.5;
  }
  
  return embedding;
}

// Función hash simple
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
