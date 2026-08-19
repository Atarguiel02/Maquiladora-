import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Recognition, User } from '../../shared/types';
import { useAuth } from '../../context/AuthContext';
import { HeartHandshake, Plus, Heart, Sparkles, Send, Award, Flame, Zap } from 'lucide-react';
import { fireCelebrationConfetti } from '../../utils/confetti';

export const SocialView: React.FC = () => {
  const { user, availableUsers, showXpToast } = useAuth();
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReceiverId, setSelectedReceiverId] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<'quality' | 'speed' | 'teamwork' | 'safety'>('teamwork');
  const [xpAward, setXpAward] = useState(25);

  useEffect(() => {
    loadRecognitions();
  }, []);

  const loadRecognitions = async () => {
    const data = await api.getRecognitions();
    setRecognitions(data);
  };

  const handleReact = async (id: string, emoji: 'heart' | 'clap' | 'fire' | 'party') => {
    if (!user) return;
    const updated = await api.reactToRecognition(id, emoji, user.id);
    setRecognitions((prev) => prev.map((r) => (r.id === id ? updated : r)));
  };

  const handleSendRecognition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedReceiverId || !message.trim()) return;

    const receiver = availableUsers.find((u) => u.id === selectedReceiverId);
    if (!receiver) return;

    await api.createRecognition({
      senderName: user.name,
      senderAvatar: user.avatarUrl,
      senderRole: user.role,
      receiverId: receiver.id,
      receiverName: receiver.name,
      receiverAvatar: receiver.avatarUrl,
      message,
      xpAwarded: xpAward,
      category
    });

    fireCelebrationConfetti();
    showXpToast(15, `¡Reconocimiento enviado a ${receiver.name}! (+15 XP para ti)`, '🤝');
    setShowModal(false);
    setMessage('');
    loadRecognitions();
  };

  const getCategoryBadge = (cat: Recognition['category']) => {
    switch (cat) {
      case 'quality':
        return { label: '🎯 Calidad Impecable', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      case 'speed':
        return { label: '⚡ Velocidad Extrema', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'safety':
        return { label: '🛡️ Seguridad Primero', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'teamwork':
      default:
        return { label: '🤝 Gran Compañerismo', color: 'bg-pink-50 text-pink-700 border-pink-200' };
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-4xl mx-auto px-1 sm:px-2 pt-1">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div>
          <span className="text-xs uppercase font-black tracking-wider text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200 inline-flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5" /> Muro de Reconocimientos
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-heading mt-2">
            Comunidad Maquila Hub
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Celebra el esfuerzo de tus compañeros y gana XP por fomentar una cultura positiva
          </p>
        </div>

        <button
          onClick={() => {
            if (availableUsers.length > 0) {
              const defaultReceiver = availableUsers.find((u) => u.id !== user?.id) || availableUsers[0];
              setSelectedReceiverId(defaultReceiver.id);
            }
            setShowModal(true);
          }}
          className="w-full sm:w-auto px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-pink-600/25 transition-transform active:scale-95 flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          + Dar Reconocimiento
        </button>
      </div>

      {/* 2. Feed of Recognitions */}
      <div className="space-y-3">
        {recognitions.map((rec) => {
          const badge = getCategoryBadge(rec.category);

          return (
            <div
              key={rec.id}
              className="bg-white border border-gray-200/80 rounded-3xl p-5 shadow-sm space-y-3.5"
            >
              {/* Sender & Receiver Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rec.senderAvatar}
                    alt={rec.senderName}
                    className="w-10 h-10 rounded-2xl object-cover ring-2 ring-gray-100"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black text-gray-900 text-xs sm:text-sm">{rec.senderName}</span>
                      <span className="text-gray-400 text-xs font-medium">reconoció a</span>
                      <span className="font-black text-indigo-600 text-xs sm:text-sm">{rec.receiverName}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">{rec.createdAt}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                    {badge.label}
                  </span>
                  <div className="flex items-center justify-end gap-1 text-[11px] font-black text-indigo-600 mt-1">
                    <Zap className="w-3 h-3 fill-indigo-600" />
                    +{rec.xpAwarded} XP
                  </div>
                </div>
              </div>

              {/* Message text */}
              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200/70 font-medium">
                "{rec.message}"
              </p>

              {/* Emoji Reactions Bar */}
              <div className="flex items-center gap-2 pt-0.5">
                {[
                  { key: 'heart', emoji: '❤️', count: rec.reactions.heart },
                  { key: 'clap', emoji: '👏', count: rec.reactions.clap },
                  { key: 'fire', emoji: '🔥', count: rec.reactions.fire },
                  { key: 'party', emoji: '🎉', count: rec.reactions.party }
                ].map((r) => (
                  <button
                    key={r.key}
                    onClick={() => handleReact(rec.id, r.key as any)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs text-gray-700 transition-all active:scale-95"
                  >
                    <span>{r.emoji}</span>
                    <span className="font-mono text-[11px] font-bold text-gray-600">{r.count}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to Give Recognition */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <form
            onSubmit={handleSendRecognition}
            className="bg-white border border-gray-200 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <h3 className="text-base font-black text-gray-900 font-heading">Enviar Reconocimiento</h3>
            <p className="text-xs text-gray-500 mt-0.5">Destaca el talento de tus compañeros de planta</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-gray-700 font-bold block mb-1">¿A quién quieres reconocer?</label>
                <select
                  value={selectedReceiverId}
                  onChange={(e) => setSelectedReceiverId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white"
                >
                  {availableUsers
                    .filter((u) => u.id !== user?.id)
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role} - {u.department})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-700 font-bold block mb-1">Categoría:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'teamwork', label: '🤝 Compañerismo' },
                    { id: 'quality', label: '🎯 Calidad' },
                    { id: 'speed', label: '⚡ Velocidad' },
                    { id: 'safety', label: '🛡️ Seguridad' }
                  ].map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setCategory(c.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-bold text-left transition-colors border ${
                        category === c.id
                          ? 'bg-pink-50 border-pink-300 text-pink-700'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-700 font-bold block mb-1">Mensaje de reconocimiento:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="¡Excelente trabajo hoy sacando la orden de lino a tiempo!..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-700 font-bold block mb-1">XP a regalar:</label>
                <div className="flex gap-2">
                  {[25, 50, 100].map((xp) => (
                    <button
                      type="button"
                      key={xp}
                      onClick={() => setXpAward(xp)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold font-mono transition-colors border ${
                        xpAward === xp
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      +{xp} XP
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-lg shadow-pink-600/25 transition-all"
              >
                Publicar Reconocimiento
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
