import { repositories } from '../repositories/factory';
import { User, UserRole, AiChatMessage } from '../../shared/types';
import { GoogleGenAI } from '@google/genai';

export const authService = {
  async getAllUsers() {
    return repositories.userRepo.findAll();
  },
  async getUserById(id: string) {
    return repositories.userRepo.findById(id);
  },
  async login(emailOrId: string) {
    const user = (await repositories.userRepo.findByEmail(emailOrId)) || (await repositories.userRepo.findById(emailOrId));
    if (!user) {
      // Fallback to first user (Carlos)
      const users = await repositories.userRepo.findAll();
      return users[0];
    }
    await repositories.auditRepo.log({
      userId: user.id,
      userName: user.name,
      action: 'LOGIN',
      entity: 'USER',
      entityId: user.id,
      details: `Inicio de sesión como rol ${user.role}`
    });
    return user;
  },
  async switchRole(role: UserRole) {
    const users = await repositories.userRepo.findByRole(role);
    if (users.length > 0) {
      return users[0];
    }
    const all = await repositories.userRepo.findAll();
    return all[0];
  }
};

export const attendanceService = {
  async getTodayAttendance(userId: string) {
    const dateStr = new Date().toISOString().split('T')[0];
    return repositories.attendanceRepo.getTodayRecord(userId, dateStr);
  },
  async checkIn(userId: string, userName: string) {
    const res = await repositories.attendanceRepo.checkIn(userId, userName);
    await repositories.notificationRepo.addNotification({
      userId,
      title: res.isLate ? '⏱️ Check-in Registrado' : '🔥 ¡Llegaste puntual!',
      message: res.isLate
        ? `Entrada registrada con éxito (+${res.xpGranted} XP)`
        : `¡Puntualidad perfecta! +${res.xpGranted} XP otorgados a tu racha`,
      type: 'streak',
      xpAmount: res.xpGranted
    });
    await repositories.auditRepo.log({
      userId,
      userName,
      action: 'CHECK_IN',
      entity: 'ATTENDANCE',
      entityId: res.record.id,
      details: `Marcaje de entrada a las ${res.record.checkInTime} (${res.record.status})`
    });
    return res;
  },
  async checkOut(userId: string) {
    const res = await repositories.attendanceRepo.checkOut(userId);
    if (res) {
      await repositories.auditRepo.log({
        userId,
        userName: res.userName,
        action: 'CHECK_OUT',
        entity: 'ATTENDANCE',
        entityId: res.id,
        details: `Marcaje de salida a las ${res.checkOutTime}`
      });
    }
    return res;
  },
  async getAllAttendance() {
    return repositories.attendanceRepo.findAll();
  }
};

export const productionService = {
  async getLines() {
    return repositories.productionRepo.getLines();
  },
  async getLineByCode(code: string) {
    return repositories.productionRepo.getLineByCode(code);
  },
  async getOrders() {
    return repositories.productionRepo.getOrders();
  },
  async getRecentRecords(userId?: string) {
    return repositories.productionRepo.getRecentRecords(userId);
  },
  async logProduction(params: {
    orderId: string;
    lineCode: string;
    userId: string;
    userName: string;
    units: number;
    hourSlot: string;
  }) {
    const res = await repositories.productionRepo.logProduction(params);

    // Notify user
    await repositories.notificationRepo.addNotification({
      userId: params.userId,
      title: '⚡ Producción Registrada',
      message: `+${params.units} unidades registradas en ${params.lineCode} (+${res.xpEarned} XP)`,
      type: 'production',
      xpAmount: res.xpEarned
    });

    await repositories.auditRepo.log({
      userId: params.userId,
      userName: params.userName,
      action: 'LOG_PRODUCTION',
      entity: 'PRODUCTION_RECORD',
      entityId: res.record.id,
      details: `Registro de ${params.units} unidades en ${params.lineCode}`
    });

    return res;
  }
};

export const gamificationService = {
  async getAchievements(userId: string) {
    return repositories.gamificationRepo.getAchievements(userId);
  },
  async unlockAchievement(userId: string, code: string) {
    const res = await repositories.gamificationRepo.unlockAchievement(userId, code);
    await repositories.notificationRepo.addNotification({
      userId,
      title: '🏆 ¡Nueva Insignia!',
      message: `Has desbloqueado "${res.achievement.title}" (+${res.xpGranted} XP)`,
      type: 'badge',
      xpAmount: res.xpGranted
    });
    return res;
  },
  async getChallenges() {
    return repositories.gamificationRepo.getChallenges();
  },
  async getLeaderboard(metric: 'xp' | 'quality' | 'punctuality' = 'xp') {
    return repositories.gamificationRepo.getLeaderboard(metric);
  }
};

export const inventoryService = {
  async getItems() {
    return repositories.inventoryRepo.findAll();
  },
  async getBySku(sku: string) {
    return repositories.inventoryRepo.findBySku(sku);
  },
  async getLowStock() {
    return repositories.inventoryRepo.getLowStockItems();
  },
  async getMovements(itemId?: string) {
    return repositories.inventoryRepo.getMovements(itemId);
  },
  async recordMovement(data: {
    itemId: string;
    sku: string;
    itemName: string;
    type: 'entrada' | 'salida' | 'ajuste';
    quantity: number;
    reason: string;
    userId: string;
    userName: string;
  }) {
    const res = await repositories.inventoryRepo.recordMovement(data);
    await repositories.auditRepo.log({
      userId: data.userId,
      userName: data.userName,
      action: 'INVENTORY_MOVEMENT',
      entity: 'INVENTORY_ITEM',
      entityId: data.itemId,
      details: `${data.type.toUpperCase()}: ${data.quantity} un de ${data.sku} (${data.reason})`
    });
    return res;
  }
};

export const qualityService = {
  async getInspections() {
    return repositories.qualityRepo.getInspections();
  },
  async getDefectPareto() {
    return repositories.qualityRepo.getDefectPareto();
  },
  async logInspection(data: Parameters<typeof repositories.qualityRepo.logInspection>[0]) {
    const res = await repositories.qualityRepo.logInspection(data);
    await repositories.auditRepo.log({
      userId: 'qa-inspector',
      userName: data.inspectorName,
      action: 'QUALITY_INSPECTION',
      entity: 'QUALITY_INSPECTION',
      entityId: res.id,
      details: `Inspección ${res.orderNumber}: ${res.defectUnits}/${res.sampleSize} defectos (${res.defectRate}%) - Estado ${res.status}`
    });
    return res;
  }
};

export const maintenanceService = {
  async getMachines() {
    return repositories.maintenanceRepo.getMachines();
  },
  async getMachineByCode(code: string) {
    return repositories.maintenanceRepo.getMachineByCode(code);
  },
  async updateStatus(code: string, status: any) {
    return repositories.maintenanceRepo.updateMachineStatus(code, status);
  },
  async getTickets() {
    return repositories.maintenanceRepo.getTickets();
  },
  async createTicket(data: Parameters<typeof repositories.maintenanceRepo.createTicket>[0]) {
    const res = await repositories.maintenanceRepo.createTicket(data);
    await repositories.auditRepo.log({
      userId: 'mtto-requester',
      userName: data.reportedBy,
      action: 'CREATE_MAINTENANCE_TICKET',
      entity: 'MAINTENANCE_TICKET',
      entityId: res.id,
      details: `Ticket máquina ${data.machineCode}: ${data.title} (${data.priority})`
    });
    return res;
  },
  async resolveTicket(ticketId: string, technicianName: string) {
    return repositories.maintenanceRepo.resolveTicket(ticketId, technicianName);
  }
};

export const socialService = {
  async getRecognitions() {
    return repositories.recognitionRepo.getRecognitions();
  },
  async createRecognition(data: Parameters<typeof repositories.recognitionRepo.createRecognition>[0]) {
    const res = await repositories.recognitionRepo.createRecognition(data);
    await repositories.notificationRepo.addNotification({
      userId: data.receiverId,
      title: `👏 ${data.senderName} te reconoció`,
      message: `"${data.message}" (+${data.xpAwarded} XP)`,
      type: 'xp',
      xpAmount: data.xpAwarded
    });
    return res;
  },
  async reactToRecognition(recId: string, emoji: 'heart' | 'clap' | 'fire' | 'party', userId: string) {
    return repositories.recognitionRepo.reactToRecognition(recId, emoji, userId);
  },
  async getNotifications(userId?: string) {
    return repositories.notificationRepo.getUserNotifications(userId);
  },
  async markNotificationRead(id: string) {
    return repositories.notificationRepo.markAsRead(id);
  },
  async markAllNotificationsRead(userId?: string) {
    return repositories.notificationRepo.markAllAsRead(userId);
  }
};

export const reportService = {
  async getExecutiveKpis() {
    const lines = await repositories.productionRepo.getLines();
    const totalDailyTarget = lines.reduce((a, b) => a + b.targetDailyUnits, 0);
    const totalDailyProduced = lines.reduce((a, b) => a + b.currentDailyUnits, 0);
    const avgEfficiency = Math.round(lines.reduce((a, b) => a + b.efficiencyPercentage, 0) / lines.length);
    const avgQuality = parseFloat((lines.reduce((a, b) => a + b.qualityPercentage, 0) / lines.length).toFixed(1));
    const activeWorkers = lines.reduce((a, b) => a + b.activeWorkers, 0);
    const tardyWorkers = lines.reduce((a, b) => a + b.tardyWorkers, 0);
    const absentWorkers = lines.reduce((a, b) => a + b.absentWorkers, 0);

    return {
      oee: 88.4,
      avgEfficiency,
      avgQuality,
      totalDailyTarget,
      totalDailyProduced,
      dailyProgressPercent: Math.round((totalDailyProduced / totalDailyTarget) * 100),
      workforce: {
        active: activeWorkers,
        tardy: tardyWorkers,
        absent: absentWorkers,
        total: activeWorkers + tardyWorkers + absentWorkers
      },
      topLine: lines[0],
      criticalLine: lines[lines.length - 1]
    };
  }
};

let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    try {
      genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn('Gemini client init skipped or failed:', err);
    }
  }
  return genAI;
}

export const aiAssistantService = {
  async askPlantAssistant(prompt: string): Promise<AiChatMessage> {
    const cleanPrompt = prompt.toLowerCase();
    const client = getGeminiClient();

    // Prepare contextual plant data for the AI
    const lines = await repositories.productionRepo.getLines();
    const topPerformer = (await repositories.gamificationRepo.getLeaderboard())[0];
    const lowStock = await repositories.inventoryRepo.getLowStockItems();
    const pareto = await repositories.qualityRepo.getDefectPareto();

    if (client && process.env.GEMINI_API_KEY) {
      try {
        const systemPrompt = `Eres MaquiBot, el asistente inteligente de operaciones para MAQUILA HUB en español.
Tono: Moderno, directo, ágil, diseñado para trabajadores y supervisores de la Generación Z. Sé conciso y da respuestas de alto valor con datos numéricos.
Datos actuales de la planta:
- Producción general: ${lines.map(l => `${l.name}: ${l.currentDailyUnits}/${l.targetDailyUnits} (${l.efficiencyPercentage}%), calidad ${l.qualityPercentage}%`).join('; ')}
- Top Performer: ${topPerformer.name} con ${topPerformer.xp} XP (${topPerformer.qualityScore}% calidad)
- Materiales críticos: ${lowStock.map(s => `${s.name} (${s.currentStock} ${s.unit})`).join(', ')}
- Principales defectos: ${pareto.map(p => `${p.defectType}: ${p.percentage}%`).join(', ')}
Responde de manera estructurada y breve en 2-4 oraciones o viñetas.`;

        const response = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction: systemPrompt
          }
        });

        const text = response.text || 'Sin respuesta disponible';
        return {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } catch (e) {
        console.warn('Gemini generation error, falling back to smart heuristic:', e);
      }
    }

    // Smart contextual heuristic assistant fallback
    if (cleanPrompt.includes('producción') || cleanPrompt.includes('hoy') || cleanPrompt.includes('rendimiento')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `📊 **Estado de Producción:** La planta va al **91.4%** de la meta diaria (7,520 de 8,900 prendas).
- 🥇 **Línea 01 (Polos):** Mejor rendimiento con **94%** de avance.
- ⚠️ **Línea 05 (Deportiva):** Requiere soporte urgente (**62%** de avance por corte CNC).
- 🔥 El turno matutino va **12% más rápido** que el promedio de la semana.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        highlightData: { metric: 'Meta Global', value: '91.4%', trend: '+12% vs ayer' },
        quickActions: [
          { label: 'Ver Línea 01', action: 'VIEW_LINE_1' },
          { label: 'Ver Línea 05', action: 'VIEW_LINE_5' }
        ]
      };
    }

    if (cleanPrompt.includes('linea') || cleanPrompt.includes('atención') || cleanPrompt.includes('problema') || cleanPrompt.includes('cuello de botella')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ **Líneas que requieren atención prioritaria:**
1. **Línea 05 (Activewear):** Máquina de corte *M-004* detenida por falla neumática (Tkt #1 en progreso con Roberto Valdés).
2. **Línea 04 (Denim):** Tasa de defectos en 5.2% en remaches y pretinas.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        highlightData: { metric: 'Línea Crítica', value: 'Línea 05', trend: 'M-004 Parada' },
        quickActions: [
          { label: 'Ver Máquinas Mantenimiento', action: 'VIEW_MAINTENANCE' },
          { label: 'Inspeccionar Calidad', action: 'VIEW_QUALITY' }
        ]
      };
    }

    if (cleanPrompt.includes('inventario') || cleanPrompt.includes('tela') || cleanPrompt.includes('stock') || cleanPrompt.includes('material')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `📦 **Auditoría de Inventario Rápida:**
- 🟢 **Tela Pima Azul:** 2,400m disponibles (Óptimo para orden Zara).
- 🟡 **Hilo Coats Negro:** 320 conos (Nivel de advertencia).
- 🔴 **Botones Corozo 18L:** 80 gruesas (Stock Crítico, se recomienda orden de compra urgente).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        highlightData: { metric: 'Ítems Críticos', value: '1 Alerta Roja', trend: 'Botones Corozo' },
        quickActions: [
          { label: 'Abrir Inventario', action: 'VIEW_INVENTORY' },
          { label: 'Escanear QR Material', action: 'SCAN_QR' }
        ]
      };
    }

    if (cleanPrompt.includes('defecto') || cleanPrompt.includes('calidad')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `🎯 **Reporte de Calidad:**
- Calidad promedio de planta: **96.8%**.
- Principales defectos del día: **Costura suelta (42%)** y **Manchas de aceite (21%)**.
- La Línea 01 mantiene el récord de 0 defectos en el lote actual de exportación.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        highlightData: { metric: 'Calidad Global', value: '96.8%', trend: 'Costura #1' }
      };
    }

    if (cleanPrompt.includes('mejor') || cleanPrompt.includes('ranking') || cleanPrompt.includes('top')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `🏆 **Top Performers del Día:**
1. 🥇 **Ana María Gómez** (Línea 03) — 1,840 XP (99.4% calidad, 940 unidades).
2. 🥈 **Carlos López** (Línea 03) — 1,720 XP (98.2% calidad, 820 unidades).
3. 🥉 **José Morales** (Línea 01) — 1,640 XP (96.8% calidad, 780 unidades).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        highlightData: { metric: 'Top 1 XP', value: 'Ana María G.', trend: '1,840 XP' }
      };
    }

    // Generic friendly answer
    return {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: `Hola! Soy MaquiBot. Puedo ayudarte a consultar el avance de producción en tiempo real, alertas de máquinas, inventario crítico, inspecciones de calidad o los rankings de gamificación del equipo. ¿Qué necesitas revisar?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickActions: [
        { label: '¿Cómo va la producción?', action: 'ASK_PROD' },
        { label: '¿Qué línea necesita atención?', action: 'ASK_LINES' },
        { label: 'Stock crítico de materiales', action: 'ASK_STOCK' }
      ]
    };
  }
};
