import Groq from "groq-sdk";

export async function POST(req) {
  const { question } = await req.json();

  // 1. Configurar modelo Groq
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    // Contenido sobre las Fiestas Patrias de Chile - 18 de Septiembre
    const chileContext = `
    HISTORIA DEL 18 DE SEPTIEMBRE:
    - El 18 de septiembre de 1810 se formó la Primera Junta Nacional de Gobierno en Chile
    - Marca el inicio del proceso de independencia de Chile del Imperio Español
    - Se celebra como el Día de la Independencia Nacional
    - Las celebraciones duran varios días, conocidas como "Fiestas Patrias"

    COMIDAS TRADICIONALES:
    - Empanadas de pino (carne, cebolla, huevo duro, aceitunas, pasas)
    - Asado y anticuchos
    - Sopaipillas (especialmente en días lluviosos)
    - Cazuela de cordero o pollo
    - Pastel de choclo
    - Chicha y terremoto (bebidas tradicionales)
    - Mote con huesillo

    MÚSICA TRADICIONAL:
    - Cueca (danza nacional de Chile)
    - Tonada chilena
    - Vals chileno
    - Música folclórica con guitarras, acordeón y arpa

    JUEGOS Y ACTIVIDADES TÍPICAS:
    - Rayuela (juego con tejos)
    - Palo ensebado (subir un palo con grasa para alcanzar premios)
    - Carrera de sacos
    - Quebrar la piñata
    - Competencias de cueca
    - Rodeo chileno
    - Volantín (elevar cometas/volantines)

    TRADICIONES:
    - Fondas y ramadas (lugares de celebración)
    - Decoración con banderas chilenas
    - Vestimenta típica: manta, sombrero de huaso, vestidos de china
    - Grito de "¡Viva Chile!" y "¡Viva la Patria!"
    `;
    
    // Generar respuesta con Groq
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Eres un asistente experto en las tradiciones chilenas y las Fiestas Patrias del 18 de Septiembre. Responde con entusiasmo patriótico, usando emojis chilenos 🇨🇱 y expresiones típicas. Siempre saluda con '¡Viva Chile!' y termina con '¡Que vivan las Fiestas Patrias!'. Responde basándote en el contexto proporcionado sobre la cultura chilena."
        },
        {
          role: "user",
          content: `Contexto sobre las Fiestas Patrias de Chile: ${chileContext}\n\nPregunta: ${question}`
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
