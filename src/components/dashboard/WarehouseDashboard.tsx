import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { InventoryItem, InventoryMovement } from '../../shared/types';
import { useAuth } from '../../context/AuthContext';
import { Package, Search, Plus, ArrowDownRight, ArrowUpRight, Filter, AlertTriangle, Check } from 'lucide-react';

interface WarehouseDashboardProps {
  onOpenScanner: () => void;
}

export const WarehouseDashboard: React.FC<WarehouseDashboardProps> = ({ onOpenScanner }) => {
  const { user, showXpToast } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [moveQty, setMoveQty] = useState(10);
  const [moveType, setMoveType] = useState<'entrada' | 'salida'>('entrada');
  const [moveReason, setMoveReason] = useState('Recepción de proveedor');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const itms = await api.getInventoryItems();
    const movs = await api.getInventoryMovements();
    setItems(itms);
    setMovements(movs);
  };

  const filteredItems = items.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleRecordMovement = async () => {
    if (!selectedItem) return;

    await api.recordInventoryMovement({
      itemId: selectedItem.id,
      sku: selectedItem.sku,
      itemName: selectedItem.name,
      type: moveType,
      quantity: moveQty,
      reason: moveReason,
      userId: user?.id || 'usr-marco',
      userName: user?.name || 'Marco Almacén'
    });

    showXpToast(20, `Movimiento registrado: ${moveType === 'entrada' ? '+' : '-'}${moveQty} ${selectedItem.unit}`, '📦');
    setSelectedItem(null);
    loadData();
  };

  return (
    <div className="space-y-4 pb-20 max-w-5xl mx-auto px-1 sm:px-2 pt-1">
      {/* 1. Header Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold block">Total SKUs</span>
          <p className="text-2xl font-black text-gray-900 font-mono mt-1">{items.length}</p>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">100% Trazables</span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold block">Stock Crítico</span>
          <p className="text-2xl font-black text-rose-600 font-mono mt-1">
            {items.filter((i) => i.status === 'critical').length}
          </p>
          <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full inline-block mt-0.5">Requerimiento urgente</span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold block">Stock Bajo</span>
          <p className="text-2xl font-black text-amber-600 font-mono mt-1">
            {items.filter((i) => i.status === 'low').length}
          </p>
          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-0.5">Por reordenar</span>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-3xl p-4 shadow-sm">
          <span className="text-xs text-gray-500 font-semibold block">Movimientos Hoy</span>
          <p className="text-2xl font-black text-indigo-600 font-mono mt-1">{movements.length}</p>
          <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-0.5">Entradas y despachos</span>
        </div>
      </div>

      {/* 2. Search & Category Filters */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pb-4 border-b border-gray-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar SKU, material o pasillo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto scrollbar-none">
            {['ALL', 'Telas', 'Hilos', 'Cierres', 'Empaque'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                {cat === 'ALL' ? 'Todos' : cat}
              </button>
            ))}

            <button
              onClick={onOpenScanner}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 hover:bg-cyan-100 transition-colors"
            >
              📷 Escanear QR
            </button>
          </div>
        </div>

        {/* Inventory Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200 hover:border-indigo-300 hover:bg-white transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    {item.sku}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      item.status === 'optimal'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : item.status === 'low'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {item.status === 'optimal' ? '🟢 Óptimo' : item.status === 'low' ? '🟡 Bajo' : '🔴 Crítico'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-gray-900 leading-tight mt-1">{item.name}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Ubicación: <strong className="text-gray-800">{item.location}</strong> • {item.category}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold block uppercase">Stock Actual</span>
                  <p className="text-base font-black text-gray-900 font-mono">
                    {item.currentStock.toLocaleString()}{' '}
                    <span className="text-xs text-gray-500 font-medium">{item.unit}</span>
                  </p>
                </div>

                <button
                  onClick={() => setSelectedItem(item)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                >
                  Movimiento
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Movement Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-black text-gray-900 font-heading">Registrar Entrada / Salida</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {selectedItem.sku} - {selectedItem.name}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => setMoveType('entrada')}
                className={`py-2.5 rounded-2xl text-xs font-bold transition-colors ${
                  moveType === 'entrada'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                + Entrada (Recepción)
              </button>
              <button
                onClick={() => setMoveType('salida')}
                className={`py-2.5 rounded-2xl text-xs font-bold transition-colors ${
                  moveType === 'salida'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                - Salida (Despacho)
              </button>
            </div>

            <div className="mt-3 space-y-1.5">
              <label className="text-xs text-gray-700 font-bold block">Cantidad ({selectedItem.unit}):</label>
              <input
                type="number"
                value={moveQty}
                onChange={(e) => setMoveQty(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div className="mt-3 space-y-1.5">
              <label className="text-xs text-gray-700 font-bold block">Motivo / Orden:</label>
              <input
                type="text"
                value={moveReason}
                onChange={(e) => setMoveReason(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 py-2.5 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRecordMovement}
                className="flex-1 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all"
              >
                Confirmar (+20 XP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
