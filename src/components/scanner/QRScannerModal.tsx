import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, Camera, Check, X, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const { showXpToast, setActiveTab } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [scannedMeta, setScannedMeta] = useState<{ title: string; desc: string; type: string } | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isOpen) {
      setScannedResult(null);
      setScannedMeta(null);

      // Attempt to access user media
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: 'environment' } })
          .then((s) => {
            stream = s;
            if (videoRef.current) {
              videoRef.current.srcObject = s;
              videoRef.current.play();
              setCameraActive(true);
            }
          })
          .catch((err) => {
            console.log('Camera access notice:', err.message);
            setCameraActive(false);
          });
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulatedScan = (code: string, meta: { title: string; desc: string; type: string }) => {
    setScannedResult(code);
    setScannedMeta(meta);
    showXpToast(15, `QR Escaneado: ${meta.title}`, '📷');
  };

  const handleAction = () => {
    if (!scannedMeta) return;
    if (scannedMeta.type === 'machine') setActiveTab('lines');
    else if (scannedMeta.type === 'inventory') setActiveTab('inventory');
    else if (scannedMeta.type === 'order') setActiveTab('production');
    else if (scannedMeta.type === 'attendance') setActiveTab('attendance');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl p-5 shadow-2xl z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center border border-cyan-200">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 font-heading">Escáner Industrial QR</h3>
                <p className="text-xs text-gray-500">Identifica máquinas, rollos de tela y órdenes</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scanner Viewfinder */}
          <div className="relative mt-4 h-56 rounded-2xl bg-gray-900 border border-gray-200 flex items-center justify-center overflow-hidden">
            {cameraActive ? (
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <Camera className="w-10 h-10 text-gray-600 mb-2 animate-pulse" />
                <p className="text-xs text-gray-300 font-medium">Cámara en espera o no disponible</p>
                <p className="text-[11px] text-indigo-400 mt-1">Usa los códigos de muestra abajo para probar</p>
              </div>
            )}

            {/* Target reticle animation */}
            <div className="absolute inset-8 border-2 border-dashed border-cyan-400/70 rounded-2xl pointer-events-none flex items-center justify-center">
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce opacity-75" />
            </div>

            {scannedResult && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm p-4 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 border border-emerald-200">
                  <Check className="w-6 h-6" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-1">
                  Código Verificado
                </span>
                <h4 className="text-sm font-black text-gray-900">{scannedMeta?.title}</h4>
                <p className="text-xs text-gray-600 mt-1 max-w-xs">{scannedMeta?.desc}</p>
                <button
                  onClick={handleAction}
                  className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 transition-all"
                >
                  Abrir Módulo de Información
                </button>
              </div>
            )}
          </div>

          {/* Quick Demo Test QR Barcodes */}
          <div className="mt-4">
            <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">
              Códigos de Prueba Rápidos (Simulación 1-Tap):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  handleSimulatedScan('M-004-GERBER', {
                    title: 'Máquina Cortadora CNC M-004',
                    desc: 'Línea 05 - Requiere calibración neumática (Ticket #1)',
                    type: 'machine'
                  })
                }
                className="p-2.5 rounded-xl bg-gray-50 hover:bg-amber-50/60 border border-gray-200 hover:border-amber-200 text-left text-xs transition-colors"
              >
                <span className="text-amber-700 font-bold block">⚙️ Máquina M-004</span>
                <span className="text-[10px] text-gray-500">Cortadora Gerber CNC</span>
              </button>

              <button
                onClick={() =>
                  handleSimulatedScan('MAT-TEL-01', {
                    title: 'Tela Pima Azul Royal (2,400m)',
                    desc: 'Pasillo A-04 - Rollo lote #88401 para orden Zara',
                    type: 'inventory'
                  })
                }
                className="p-2.5 rounded-xl bg-gray-50 hover:bg-cyan-50/60 border border-gray-200 hover:border-cyan-200 text-left text-xs transition-colors"
              >
                <span className="text-cyan-700 font-bold block">📦 Tela Pima Azul</span>
                <span className="text-[10px] text-gray-500">Stock Pasillo A-04</span>
              </button>

              <button
                onClick={() =>
                  handleSimulatedScan('ORD-2026-083', {
                    title: 'Orden Nike Sportswear Tech',
                    desc: 'PO-88403: 6,000 Hoodies Fleece Minimal',
                    type: 'order'
                  })
                }
                className="p-2.5 rounded-xl bg-gray-50 hover:bg-purple-50/60 border border-gray-200 hover:border-purple-200 text-left text-xs transition-colors"
              >
                <span className="text-purple-700 font-bold block">📋 Orden PO-88403</span>
                <span className="text-[10px] text-gray-500">Línea 03 (Nike Tech)</span>
              </button>

              <button
                onClick={() =>
                  handleSimulatedScan('EMP-OP-1042', {
                    title: 'Gafete: Carlos López',
                    desc: 'Operario Confección - Nivel 12 (1,240 XP)',
                    type: 'attendance'
                  })
                }
                className="p-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50/60 border border-gray-200 hover:border-emerald-200 text-left text-xs transition-colors"
              >
                <span className="text-emerald-700 font-bold block">👤 Gafete Operario</span>
                <span className="text-[10px] text-gray-500">Carlos López OP-1042</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
