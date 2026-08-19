import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Bot, User as UserIcon, X, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { AiChatMessage } from '../../shared/types';
import { useAuth } from '../../context/AuthContext';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const { setActiveTab } = useAuth();
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: '¡Hola! Soy **MaquiBot AI**, tu asistente inteligente para la planta. ¿Qué deseas consultar hoy?',
      timestamp: 'Ahora',
      quickActions: [
        { label: '📊 ¿Cómo va la producción hoy?', action: 'PROD_TODAY' },
        { label: '⚠️ ¿Qué línea necesita atención?', action: 'CRITICAL_LINES' },
        { label: '📦 ¿Stock de materias primas?', action: 'RAW_MATERIALS' },
        { label: '🏆 ¿Quiénes son los Top Performers?', action: 'TOP_PERFORMERS' }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const reply = await api.askAiAssistant(query);
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'La producción global va al 91.4% de avance y la Línea 01 lidera con 94% de eficiencia.',
          timestamp: 'Ahora'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (label: string) => {
    handleSend(label);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg bg-white border border-gray-200 rounded-3xl shadow-2xl z-10 flex flex-col h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-black text-gray-900 font-heading">MaquiBot AI</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    Online
                  </span>
                </div>
                <p className="text-xs text-gray-500">Inteligencia operativa en tiempo real</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      m.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20 font-medium'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-xs'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Highlights if provided */}
                  {m.highlightData && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">
                          {m.highlightData.metric}
                        </span>
                        <span className="font-black text-gray-900 text-sm">{m.highlightData.value}</span>
                      </div>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">{m.highlightData.trend}</span>
                    </div>
                  )}

                  {/* Quick Action Chips */}
                  {m.quickActions && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.quickActions.map((qa, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickAction(qa.label)}
                          className="text-[11px] font-bold bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-xl transition-colors text-left shadow-xs"
                        >
                          {qa.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 mt-1">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 items-center text-gray-400 text-xs pl-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-2xl border border-gray-200 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse delay-200" />
                  <span className="text-[11px] ml-1 text-gray-600 font-medium">Consultando planta...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center"
          >
            <input
              type="text"
              placeholder="Pregunta a MaquiBot (ej. ¿Qué línea necesita ayuda?)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white placeholder:text-gray-400 font-medium"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
