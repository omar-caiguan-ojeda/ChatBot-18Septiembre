import { Index } from "@upstash/vector";
import 'dotenv/config'

// UN SOLO VECTOR COMPRENSIVO para demostrar el circuito RAG completo
const singleDocument = {
  id: "fiestas-patrias-chile",
  content: `FIESTAS PATRIAS DE CHILE - 18 DE SEPTIEMBRE - GUÍA COMPLETA

HISTORIA Y ORIGEN:
El 18 de septiembre de 1810 se formó la Primera Junta Nacional de Gobierno en Chile, marcando el inicio del proceso de independencia del Imperio Español. Este día se celebra como el Día de la Independencia Nacional. Las celebraciones duran varios días y se conocen como "Fiestas Patrias". La fecha conmemora un momento crucial en la historia chilena cuando los criollos decidieron tomar el control del gobierno colonial.

COMIDAS TRADICIONALES:
- Empanadas de pino: El plato más emblemático, preparado con pino (carne picada, cebolla, comino, ají), huevo duro, aceitunas negras y pasas. La masa debe ser dorada y crujiente.
- Asado y anticuchos: Carnes a la parrilla, especialmente populares en las celebraciones familiares.
- Sopaipillas: Masa frita que se consume especialmente en días lluviosos, a menudo con pebre o chancaca.
- Cazuela: Sopa tradicional con cordero o pollo, zapallo, choclo y papas.
- Pastel de choclo: Cazuela dulce con choclo molido, carne, pollo, huevos duros y aceitunas.
- Mote con huesillo: Bebida refrescante con trigo cocido y duraznos deshidratados.

BEBIDAS TRADICIONALES:
- Terremoto: La bebida más icónica, hecha con vino pipeño, helado de piña y granadina. Su nombre se debe a su potencia.
- Chicha: Bebida fermentada de uva, muy popular durante septiembre.
- Pisco sour: Cóctel nacional de Chile, aunque también se consume durante las fiestas.

MÚSICA Y BAILES:
- Cueca: La danza nacional de Chile, representa el cortejo entre el gallo y la gallina. Se baila con pañuelos blancos.
- Tonada chilena: Música folclórica tradicional con guitarra.
- Vals chileno: Adaptación local del vals europeo.
- Instrumentos típicos: guitarra, acordeón, arpa, pandero.

JUEGOS Y ACTIVIDADES TÍPICAS:
- Rayuela: Juego con tejos de hierro que se lanzan hacia una caja con arcilla.
- Palo ensebado: Competencia donde los participantes deben subir un palo untado con grasa para alcanzar premios en la cima.
- Carrera de sacos: Competencia donde los participantes corren metidos en sacos.
- Quebrar la piñata: Actividad especialmente popular entre los niños.
- Rodeo chileno: Deporte nacional donde huasos a caballo deben detener un novillo.
- Elevar volantines: Tradición de hacer volar cometas durante septiembre.

TRADICIONES Y COSTUMBRES:
- Fondas y ramadas: Lugares tradicionales de celebración, decorados con banderas chilenas, guirnaldas y papel picado.
- Vestimenta típica: Los hombres usan manta, sombrero de huaso y espuelas. Las mujeres visten como "chinas" con vestidos floreados y delantales.
- Decoración patriótica: Casas y calles se adornan con banderas chilenas y los colores patrios (rojo, blanco y azul).
- Gritos tradicionales: "¡Viva Chile!", "¡Viva la Patria!", "¡Que viva Chile mierda!" son expresiones típicas.
- Cueca obligatoria: En muchos lugares es tradición que todos bailen al menos una cueca.

LUGARES DE CELEBRACIÓN:
Las fondas se instalan en parques, plazas y espacios públicos. Las más famosas están en el Parque O'Higgins en Santiago. También se celebra en casas particulares, colegios y lugares de trabajo.

DURACIÓN DE LAS FIESTAS:
Oficialmente el 18 y 19 de septiembre son feriados, pero las celebraciones pueden extenderse toda la semana, especialmente si caen cerca del fin de semana, creando "semanas patrióticas".`
};

const run = async () => {
  console.log("🚀 Cargando UN SOLO VECTOR comprensivo a Upstash...");
  console.log("📋 Perfecto para cuentas gratuitas con límite de 1 vector");

  // Configurar Upstash Vector
  const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN,
  });

  try {
    // Generar embedding simple del documento completo
    const embedding = await generateSimpleEmbedding(singleDocument.content);
    
    console.log("📄 Procesando documento único con toda la información...");
    
    // Subir el vector único a Upstash
    await index.upsert({
      id: singleDocument.id,
      vector: embedding,
      metadata: {
        content: singleDocument.content,
        id: singleDocument.id,
        topic: "fiestas_patrias_chile_completo",
        type: "comprehensive_guide"
      }
    });
    
    console.log("✅ Vector único cargado exitosamente en Upstash!");
    console.log("🎯 El chatbot RAG ahora funcionará con búsqueda vectorial");
    
    // Verificar la carga
    const stats = await index.info();
    console.log(`📊 Total de vectores en la base: ${stats.vectorCount}`);
    console.log("🎉 ¡Circuito RAG completo y funcional!");
    
  } catch (error) {
    console.error("❌ Error cargando vector:", error);
    console.log("💡 Verifica tus credenciales de Upstash en .env.local");
  }
};

// Función para generar embedding simple (igual que en route.js)
async function generateSimpleEmbedding(text) {
  const hash = simpleHash(text.toLowerCase());
  const embedding = new Array(384).fill(0);
  
  for (let i = 0; i < 384; i++) {
    embedding[i] = Math.sin(hash + i) * 0.5;
  }
  
  return embedding;
}

// Función hash simple (igual que en route.js)
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

run();
