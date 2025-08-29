"use client";
import { useState, useEffect, useRef } from "react";

// Componente de confetti cayendo
const ConfettiPiece = ({ delay, duration, startX }) => {
  const colors = ['#DC2626', '#1D4ED8', '#FFFFFF'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <div
      style={{
        position: 'fixed',
        top: '-10px',
        left: `${startX}%`,
        width: '8px',
        height: '8px',
        backgroundColor: color,
        borderRadius: '50%',
        animation: `fall ${duration}s linear ${delay}s infinite`,
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll al final cuando hay nuevos mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();

      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error al procesar tu consulta. ¡Inténtalo de nuevo!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generar confetti
  const confettiPieces = Array.from({ length: 50 }, (_, i) => (
    <ConfettiPiece
      key={i}
      delay={Math.random() * 10}
      duration={3 + Math.random() * 4}
      startX={Math.random() * 100}
    />
  ));

  return (
    <>
      <style jsx global>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        .message-enter {
          animation: slideIn 0.5s ease-out;
        }
        
        .loading-dots {
          animation: bounce 1.4s infinite;
        }
        
        .loading-dots:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .loading-dots:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>
      
      {/* Confetti de fondo */}
      {confettiPieces}
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #3B82F6 0%, #FFFFFF 50%, #EF4444 100%)',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '30px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)',
            border: '4px solid #3B82F6',
            width: '100%',
            backdropFilter: 'blur(10px)',
            animation: 'pulse 3s infinite'
          }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#DC2626',
              marginBottom: '15px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              background: 'linear-gradient(45deg, #DC2626, #EF4444)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🇨🇱 Fiestas Patrias Chile 🇨🇱
            </h1>
            <h2 style={{
              fontSize: '2rem',
              color: '#1D4ED8',
              fontWeight: '600',
              marginBottom: '10px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}>
              ¡Celebremos el 18 de Septiembre!
            </h2>
            <p style={{
              color: '#374151',
              fontSize: '1.2rem',
              fontWeight: '500'
            }}>
              🎉 Pregúntame sobre comidas, historia, música y juegos tradicionales 🎉
            </p>
          </div>

          {/* Chat Container */}
          <div style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '20px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            border: '4px solid #DC2626',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)'
          }}>
            {/* Messages Area */}
            <div style={{
              height: '400px',
              overflowY: 'auto',
              padding: '25px',
              background: 'linear-gradient(180deg, #DBEAFE 0%, #FFFFFF 50%, #FEE2E2 100%)',
              position: 'relative'
            }}>
              {messages.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  marginTop: '80px'
                }}>
                  <div style={{ 
                    fontSize: '5rem', 
                    marginBottom: '20px',
                    animation: 'bounce 2s infinite'
                  }}>🇨🇱</div>
                  <p style={{
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    color: '#1D4ED8',
                    marginBottom: '15px',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                  }}>¡Viva Chile!</p>
                  <p style={{
                    fontSize: '1.3rem',
                    color: '#DC2626',
                    marginBottom: '20px'
                  }}>Pregúntame sobre las Fiestas Patrias</p>
                  <div style={{
                    background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                    padding: '20px',
                    borderRadius: '15px',
                    border: '2px solid #F59E0B',
                    maxWidth: '500px',
                    margin: '0 auto',
                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                  }}>
                    <p style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '10px'
                    }}>Ejemplos de preguntas:</p>
                    <p style={{ color: '#1D4ED8', margin: '5px 0' }}>"¿Qué comidas típicas hay?" 🥟</p>
                    <p style={{ color: '#DC2626', margin: '5px 0' }}>"¿Cómo se baila cueca?" 💃</p>
                    <p style={{ color: '#1D4ED8', margin: '5px 0' }}>"¿Qué juegos hay en las fondas?" 🎯</p>
                  </div>
                </div>
              )}
              
              {messages.map((m, i) => (
                <div key={i} style={{
                  marginBottom: '20px',
                  textAlign: m.role === "user" ? 'right' : 'left'
                }} className="message-enter">
                  <div style={{
                    display: 'inline-block',
                    maxWidth: '70%',
                    padding: '15px 20px',
                    borderRadius: '20px',
                    boxShadow: m.role === "user" 
                      ? '0 8px 25px rgba(220, 38, 38, 0.3), 0 3px 10px rgba(0, 0, 0, 0.1)' 
                      : '0 8px 25px rgba(29, 78, 216, 0.3), 0 3px 10px rgba(0, 0, 0, 0.1)',
                    background: m.role === "user" 
                      ? 'linear-gradient(135deg, #DC2626, #B91C1C, #991B1B)' 
                      : 'linear-gradient(135deg, #1D4ED8, #1E40AF, #1E3A8A)',
                    color: 'white',
                    borderBottomRightRadius: m.role === "user" ? '5px' : '20px',
                    borderBottomLeftRadius: m.role === "user" ? '20px' : '5px',
                    transform: 'translateZ(0)',
                    transition: 'transform 0.2s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.02) translateZ(0)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1) translateZ(0)'}
                  >
                    <div style={{
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      marginBottom: '8px',
                      opacity: '0.9'
                    }}>
                      {m.role === "user" ? "🙋‍♂️ Tú" : "🇨🇱 Asistente Patriótico"}
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap'
                    }}>{m.content}</div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div style={{
                  textAlign: 'left',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '15px 20px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #6B7280, #4B5563)',
                    color: 'white',
                    borderBottomLeftRadius: '5px'
                  }}>
                    <div style={{
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      marginBottom: '8px',
                      opacity: '0.9'
                    }}>
                      🇨🇱 Asistente Patriótico
                    </div>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span>Escribiendo</span>
                      <span className="loading-dots">.</span>
                      <span className="loading-dots">.</span>
                      <span className="loading-dots">.</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
              padding: '25px',
              background: 'linear-gradient(90deg, #1D4ED8, #DC2626, #1D4ED8)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input
                  style={{
                    flex: '1',
                    padding: '15px 20px',
                    borderRadius: '15px',
                    border: '3px solid white',
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.95)'
                  }}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
                  onFocus={(e) => e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15), 0 0 0 3px rgba(59, 130, 246, 0.3)'}
                  onBlur={(e) => e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'}
                  placeholder="¿Qué quieres saber sobre las Fiestas Patrias? 🇨🇱"
                  disabled={isLoading}
                />
                <button
                  style={{
                    background: isLoading 
                      ? 'linear-gradient(135deg, #9CA3AF, #6B7280)' 
                      : 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                    color: isLoading ? '#374151' : '#7C2D12',
                    fontWeight: 'bold',
                    padding: '15px 25px',
                    borderRadius: '15px',
                    border: '3px solid white',
                    fontSize: '1.1rem',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    transform: (input.trim() && !isLoading) ? 'scale(1)' : 'scale(0.95)',
                    opacity: (input.trim() && !isLoading) ? '1' : '0.7'
                  }}
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  onMouseEnter={(e) => {
                    if (!isLoading && input.trim()) {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = input.trim() ? 'scale(1)' : 'scale(0.95)';
                      e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                >
                  {isLoading ? '⏳ Pensando...' : '🎉 Enviar'}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '30px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            padding: '25px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)',
            width: '100%',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ 
              fontSize: '4rem', 
              marginBottom: '15px',
              animation: 'bounce 3s infinite'
            }}>🎊 🇨🇱 🎊</div>
            <p style={{
              color: '#DC2626',
              fontWeight: 'bold',
              fontSize: '1.8rem',
              marginBottom: '10px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}>
              ¡Que vivan las Fiestas Patrias!
            </p>
            <p style={{
              color: '#1D4ED8',
              fontWeight: '600',
              fontSize: '1.2rem'
            }}>
              Celebrando 214 años de independencia 🎆
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
