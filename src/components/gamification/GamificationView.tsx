import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Achievement, Challenge, LeaderboardEntry } from '../../shared/types';
import { useAuth } from '../../context/AuthContext';
import {
  Trophy,
  Zap,
  Flame,
  Award,
  Target,
  Users,
  CheckCircle2,
  Lock,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { fireCelebrationConfetti } from '../../utils/confetti';

export const GamificationView: React.FC = () => {
  const { user, showXpToast } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [metricTab, setMetricTab] = useState<'xp' | 'quality' | 'punctuality'>('xp');
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    if (user) {
      api.getAchievements(user.id).then((data) => setAchievements(data));
      api.getChallenges().then((data) => setChallenges(data));
      api.getLeaderboard(metricTab).then((data) => setLeaderboard(data));
    }
  }, [user, metricTab]);

  const handleClaimBadge = async (code: string) => {
    if (!user) return;
    const res = await api.unlockAchievement(user.id, code);
    setAchievements((prev) =>
      prev.map((a) => (a.code === code ? { ...a, isUnlocked: true, unlockedAt: 'Hoy' } : a))
    );
    fireCelebrationConfetti();
    showXpToast(res.xpGranted, `¡Insignia ${res.achievement.title} Desbloqueada!`, res.achievement.icon);
  };

  if (!user) return null;

  const currentLevelMinXp = (user.level - 1) * 100;
  const nextLevelXp = user.level * 100;
  const currentXpProgress = user.xp % 100;

  const filteredBadges = achievements.filter((a) => {
    if (badgeFilter === 'unlocked') return a.isUnlocked;
    if (badgeFilter === 'locked') return !a.isUnlocked;
    return true;
  });

  return (
    <div className="space-y-4 pb-20 max-w-5xl mx-auto px-1 sm:px-2 pt-1">
      {/* 1. Player Level & Rank Card */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 p-0.5 shadow-sm border border-indigo-100 flex-shrink-0">
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-[14px] object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Nivel {user.level}
                </span>
                <span className="text-xs text-amber-600 font-black flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {user.currentStreak} días racha
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-heading mt-1.5">
                {user.rankTitle}
              </h2>
              <p className="text-xs text-gray-500">{user.name} • {user.department}</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-3xl font-black text-indigo-600 font-mono">
              {user.xp.toLocaleString()} <span className="text-base text-gray-400 font-normal">XP</span>
            </span>
            <p className="text-xs text-indigo-700 font-bold mt-0.5">
              Faltan {100 - currentXpProgress} XP para Nivel {user.level + 1}
            </p>
          </div>
        </div>

        {/* Level XP Progress */}
        <div className="mt-4 relative z-10">
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-500 shadow-sm"
              style={{ width: `${currentXpProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Balanced Leaderboard Section */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-black text-gray-900 font-heading">Tabla de Clasificación Equilibrada</h3>
            </div>
            <p className="text-xs text-gray-500">
              Incentivamos tanto la velocidad como la calidad y la puntualidad
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl border border-gray-200">
            <button
              onClick={() => setMetricTab('xp')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                metricTab === 'xp'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ⚡ Por XP
            </button>
            <button
              onClick={() => setMetricTab('quality')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                metricTab === 'quality'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🎯 Calidad %
            </button>
            <button
              onClick={() => setMetricTab('punctuality')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                metricTab === 'punctuality'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🔥 Racha / Puntualidad
            </button>
          </div>
        </div>

        {/* Podium Top 3 */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 my-4 pt-2">
          {leaderboard.slice(0, 3).map((item, idx) => {
            const isFirst = idx === 0;
            const isSecond = idx === 1;
            const isThird = idx === 2;

            return (
              <div
                key={item.userId}
                className={`p-3 sm:p-4 rounded-3xl border text-center relative flex flex-col items-center justify-between shadow-xs ${
                  isFirst
                    ? 'bg-amber-50/60 border-amber-200'
                    : isSecond
                    ? 'bg-slate-50 border-gray-200'
                    : 'bg-orange-50/50 border-orange-200'
                }`}
              >
                <div className="text-lg sm:text-xl font-bold mb-1">
                  {isFirst ? '🥇' : isSecond ? '🥈' : '🥉'}
                </div>
                <img
                  src={item.avatarUrl}
                  alt={item.userName}
                  className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-indigo-200 mb-2"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate max-w-[100px] sm:max-w-[140px]">
                    {item.userName}
                  </h4>
                  <p className="text-[10px] text-gray-500 truncate">{item.teamName}</p>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200/80 w-full">
                  <span className="font-mono font-bold text-xs sm:text-sm text-indigo-700">
                    {metricTab === 'xp'
                      ? `${item.xp.toLocaleString()} XP`
                      : metricTab === 'quality'
                      ? `${item.qualityScore}%`
                      : `${item.streakDays}d 🔥`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Remainder list */}
        <div className="divide-y divide-gray-100">
          {leaderboard.slice(3).map((item) => (
            <div key={item.userId} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="w-5 text-center font-bold text-gray-400 font-mono">#{item.rank}</span>
                <img src={item.avatarUrl} alt={item.userName} className="w-8 h-8 rounded-xl object-cover" />
                <div>
                  <span className="font-bold text-gray-900">{item.userName}</span>
                  <span className="text-gray-500 text-[11px] ml-1.5 font-medium">({item.teamName})</span>
                </div>
              </div>
              <div className="font-mono font-bold text-indigo-600">
                {metricTab === 'xp'
                  ? `${item.xp.toLocaleString()} XP`
                  : metricTab === 'quality'
                  ? `${item.qualityScore}% Calidad`
                  : `${item.streakDays} días racha`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Unlockable Badges & Achievements Grid */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-black text-gray-900 font-heading">Colección de Insignias y Trofeos</h3>
            </div>
            <p className="text-xs text-gray-500">
              Desbloquea recompensas por consistencia, calidad y trabajo colaborativo
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {(['all', 'unlocked', 'locked'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setBadgeFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                  badgeFilter === f ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'Todas' : f === 'unlocked' ? 'Desbloqueadas' : 'Por Desbloquear'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                badge.isUnlocked
                  ? 'bg-white border-indigo-200 shadow-xs'
                  : 'bg-gray-50/70 border-gray-200 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-xs ${
                    badge.isUnlocked
                      ? 'bg-indigo-50 border border-indigo-100 text-indigo-600'
                      : 'bg-gray-100 border border-gray-200 text-gray-400'
                  }`}
                >
                  {badge.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{badge.title}</h4>
                    <span className="text-[10px] font-black font-mono text-indigo-600">+{badge.xpReward} XP</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{badge.description}</p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                {badge.isUnlocked ? (
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Desbloqueada
                  </span>
                ) : (
                  <div className="flex-1 flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleClaimBadge(badge.code)}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg shadow-sm transition-colors"
                    >
                      Reclamar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Active Challenges List */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-base font-black text-gray-900 font-heading mb-4">Retos Activos de la Semana</h3>
        <div className="space-y-3.5">
          {challenges.map((c) => (
            <div key={c.id} className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{c.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      +{c.xpReward} XP
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{c.description}</p>
                </div>
                <div className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 self-start sm:self-auto">
                  {c.current} / {c.target} {c.unit}
                </div>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${Math.min(100, (c.current / c.target) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
