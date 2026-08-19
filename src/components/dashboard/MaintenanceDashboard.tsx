import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Machine, MaintenanceTicket } from '../../shared/types';
import { useAuth } from '../../context/AuthContext';
import { Wrench, AlertTriangle, CheckCircle2, Plus, Clock, ShieldCheck, Sparkles } from 'lucide-react';

interface MaintenanceDashboardProps {
  onOpenScanner: () => void;
}

export const MaintenanceDashboard: React.FC<MaintenanceDashboardProps> = ({ onOpenScanner }) => {
  const { user, showXpToast } = useAuth();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const m = await api.getMachines();
    const t = await api.getMaintenanceTickets();
    setMachines(m);
    setTickets(t);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachine || !ticketTitle) return;

    await api.createMaintenanceTicket({
      machineCode: selectedMachine.code,
      machineName: selectedMachine.name,
      lineCode: selectedMachine.lineCode,
      reportedBy: user?.name || 'Roberto Valdés',
      title: ticketTitle,
      description: ticketDesc,
      priority
    });

    showXpToast(25, 'Ticket de Mantenimiento Creado (+25 XP)', '⚙️');
    setShowCreateModal(false);
    setTicketTitle('');
    setTicketDesc('');
    loadData();
  };

  const handleResolveTicket = async (ticketId: string) => {
    await api.resolveMaintenanceTicket(ticketId, user?.name || 'Roberto Valdés');
    showXpToast(50, '¡Ticket Resuelto y Máquina Habilitada! (+50 XP)', '🟢');
    loadData();
  };

  return (
    <div className="space-y-4 pb-20 max-w-5xl mx-auto px-1 sm:px-2 pt-1">
      {/* 1. Header KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold block">Total Máquinas</span>
          <p className="text-2xl font-black text-gray-900 font-mono mt-1">{machines.length}</p>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">15 Activas en Planta</span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold block">Salud Global</span>
          <p className="text-2xl font-black text-indigo-600 font-mono mt-1">94.8%</p>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">Índice MTBF Óptimo</span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold block">En Mantenimiento</span>
          <p className="text-2xl font-black text-amber-600 font-mono mt-1">
            {machines.filter((m) => m.status !== 'running').length}
          </p>
          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-0.5">1 Preventivo / 1 Paro</span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold block">Tickets Abiertos</span>
          <p className="text-2xl font-black text-rose-600 font-mono mt-1">
            {tickets.filter((t) => t.status !== 'resolved').length}
          </p>
          <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full inline-block mt-0.5">Tiempo resp. prom: 14 min</span>
        </div>
      </div>

      {/* 2. Machines Fleet Grid */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
          <div>
            <h3 className="text-base font-black text-gray-900 font-heading">Parque de Maquinaria Industrial (15 Equipos)</h3>
            <p className="text-xs text-gray-500">Estado en tiempo real de cortadoras, overlocks, rectas y ojaladoras</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenScanner}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-bold flex items-center gap-1.5 hover:bg-cyan-100 transition-colors"
            >
              📷 Escanear QR
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
          {machines.map((m) => {
            const isRunning = m.status === 'running';
            const isMaintenance = m.status === 'maintenance';
            const isStopped = m.status === 'stopped';

            return (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200 hover:border-indigo-300 hover:bg-white transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                      {m.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isRunning
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isMaintenance
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {isRunning ? '🟢 Operando' : isMaintenance ? '🟡 Preventivo' : '🔴 Paro'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-gray-900 leading-tight mt-1">{m.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Ubicación: <strong className="text-gray-800">{m.lineCode}</strong> • {m.type}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-xs font-mono mb-1 font-semibold">
                    <span className="text-gray-400 text-[11px]">Salud Equipo</span>
                    <span className="font-black text-gray-900">{m.healthScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3 p-0.5">
                    <div
                      className={`h-full rounded-full ${
                        m.healthScore > 85
                          ? 'bg-emerald-500'
                          : m.healthScore > 70
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${m.healthScore}%` }}
                    />
                  </div>

                  <button
                    onClick={() => {
                      setSelectedMachine(m);
                      setShowCreateModal(true);
                    }}
                    className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl border border-gray-200 transition-colors"
                  >
                    + Crear Ticket de Mtto
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Active Tickets */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-gray-900 font-heading">Tickets de Mantenimiento Activos</h3>
          <span className="text-xs text-gray-400 font-mono font-medium">Total {tickets.length}</span>
        </div>

        <div className="divide-y divide-gray-100">
          {tickets.map((t) => (
            <div key={t.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{t.title}</span>
                  <span
                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      t.priority === 'urgent'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {t.machineCode} ({t.lineCode}) • Reportado por {t.reportedBy} • {t.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {t.status === 'open' ? (
                  <button
                    onClick={() => handleResolveTicket(t.id)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    Marcar Resuelto (+50 XP)
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                    ✓ Resuelto por {t.technicianName}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Ticket */}
      {showCreateModal && selectedMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <form onSubmit={handleCreateTicket} className="bg-white border border-gray-200 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-black text-gray-900 font-heading">Reportar Falla en Máquina</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {selectedMachine.code} - {selectedMachine.name} ({selectedMachine.lineCode})
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-gray-700 font-bold block mb-1">Título del problema:</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Ruido en pistón o aguja trabada..."
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-700 font-bold block mb-1">Descripción detallada:</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre vibración, temperatura o código de error..."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-700 font-bold block mb-1">Prioridad:</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="low">Baja (Preventiva)</option>
                  <option value="medium">Media (Calibración)</option>
                  <option value="high">Alta (Riesgo de paro)</option>
                  <option value="urgent">Urgente (Línea detenida)</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all"
              >
                Crear Ticket (+25 XP)
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
