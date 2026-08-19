import {
  User,
  AttendanceRecord,
  ProductionLine,
  ProductionOrder,
  ProductionRecord,
  Machine,
  InventoryItem,
  InventoryMovement,
  QualityInspection,
  MaintenanceTicket,
  Achievement,
  Challenge,
  LeaderboardEntry,
  Recognition,
  AppNotification,
  AiChatMessage,
  UserRole
} from '../shared/types';

export const api = {
  // Auth
  async getUsers(): Promise<User[]> {
    const res = await fetch('/api/auth/users');
    const json = await res.json();
    return json.data;
  },

  async login(emailOrId: string): Promise<User> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrId })
    });
    const json = await res.json();
    return json.data;
  },

  async switchRole(role: UserRole): Promise<User> {
    const res = await fetch('/api/auth/switch-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    const json = await res.json();
    return json.data;
  },

  // Attendance
  async getTodayAttendance(userId: string): Promise<AttendanceRecord | null> {
    const res = await fetch(`/api/attendance/today?userId=${encodeURIComponent(userId)}`);
    const json = await res.json();
    return json.data;
  },

  async checkIn(userId: string, userName: string): Promise<{ record: AttendanceRecord; xpGranted: number; isLate: boolean }> {
    const res = await fetch('/api/attendance/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, userName })
    });
    const json = await res.json();
    return json.data;
  },

  async checkOut(userId: string): Promise<AttendanceRecord | null> {
    const res = await fetch('/api/attendance/check-out', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const json = await res.json();
    return json.data;
  },

  // Production
  async getLines(): Promise<ProductionLine[]> {
    const res = await fetch('/api/production/lines');
    const json = await res.json();
    return json.data;
  },

  async getOrders(): Promise<ProductionOrder[]> {
    const res = await fetch('/api/production/orders');
    const json = await res.json();
    return json.data;
  },

  async getRecentRecords(userId?: string): Promise<ProductionRecord[]> {
    const url = userId ? `/api/production/records?userId=${encodeURIComponent(userId)}` : '/api/production/records';
    const res = await fetch(url);
    const json = await res.json();
    return json.data;
  },

  async logProduction(data: {
    orderId?: string;
    lineCode?: string;
    userId: string;
    userName: string;
    units: number;
    hourSlot?: string;
  }): Promise<{ record: ProductionRecord; xpEarned: number; newTotalUnits: number }> {
    const res = await fetch('/api/production/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    return json.data;
  },

  // Gamification
  async getAchievements(userId: string): Promise<Achievement[]> {
    const res = await fetch(`/api/gamification/achievements?userId=${encodeURIComponent(userId)}`);
    const json = await res.json();
    return json.data;
  },

  async unlockAchievement(userId: string, code: string): Promise<{ achievement: Achievement; xpGranted: number }> {
    const res = await fetch('/api/gamification/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, code })
    });
    const json = await res.json();
    return json.data;
  },

  async getChallenges(): Promise<Challenge[]> {
    const res = await fetch('/api/gamification/challenges');
    const json = await res.json();
    return json.data;
  },

  async getLeaderboard(metric: 'xp' | 'quality' | 'punctuality' = 'xp'): Promise<LeaderboardEntry[]> {
    const res = await fetch(`/api/gamification/leaderboard?metric=${metric}`);
    const json = await res.json();
    return json.data;
  },

  // Inventory
  async getInventoryItems(): Promise<InventoryItem[]> {
    const res = await fetch('/api/inventory/items');
    const json = await res.json();
    return json.data;
  },

  async getInventoryMovements(): Promise<InventoryMovement[]> {
    const res = await fetch('/api/inventory/movements');
    const json = await res.json();
    return json.data;
  },

  async recordInventoryMovement(data: {
    itemId: string;
    sku: string;
    itemName: string;
    type: 'entrada' | 'salida' | 'ajuste';
    quantity: number;
    reason: string;
    userId: string;
    userName: string;
  }): Promise<{ movement: InventoryMovement; updatedItem: InventoryItem }> {
    const res = await fetch('/api/inventory/movement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    return json.data;
  },

  // Quality
  async getQualityInspections(): Promise<QualityInspection[]> {
    const res = await fetch('/api/quality/inspections');
    const json = await res.json();
    return json.data;
  },

  async getDefectPareto(): Promise<{ defectType: string; count: number; percentage: number }[]> {
    const res = await fetch('/api/quality/defects-pareto');
    const json = await res.json();
    return json.data;
  },

  async logQualityInspection(data: {
    orderNumber: string;
    productName: string;
    lineCode: string;
    inspectorName: string;
    sampleSize: number;
    passedUnits: number;
    defectUnits: number;
    defects: { type: string; label: string; count: number }[];
  }): Promise<QualityInspection> {
    const res = await fetch('/api/quality/inspect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    return json.data;
  },

  // Maintenance
  async getMachines(): Promise<Machine[]> {
    const res = await fetch('/api/maintenance/machines');
    const json = await res.json();
    return json.data;
  },

  async getMaintenanceTickets(): Promise<MaintenanceTicket[]> {
    const res = await fetch('/api/maintenance/tickets');
    const json = await res.json();
    return json.data;
  },

  async createMaintenanceTicket(data: {
    machineCode: string;
    machineName: string;
    lineCode: string;
    reportedBy: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }): Promise<MaintenanceTicket> {
    const res = await fetch('/api/maintenance/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    return json.data;
  },

  async resolveMaintenanceTicket(ticketId: string, technicianName: string): Promise<MaintenanceTicket> {
    const res = await fetch('/api/maintenance/tickets/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, technicianName })
    });
    const json = await res.json();
    return json.data;
  },

  // Social & Notifications
  async getRecognitions(): Promise<Recognition[]> {
    const res = await fetch('/api/social/recognitions');
    const json = await res.json();
    return json.data;
  },

  async createRecognition(data: {
    senderName: string;
    senderAvatar: string;
    senderRole: string;
    receiverId: string;
    receiverName: string;
    receiverAvatar: string;
    message: string;
    xpAwarded: number;
    category: 'quality' | 'speed' | 'teamwork' | 'safety';
  }): Promise<Recognition> {
    const res = await fetch('/api/social/recognitions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    return json.data;
  },

  async reactToRecognition(id: string, emoji: 'heart' | 'clap' | 'fire' | 'party', userId: string): Promise<Recognition> {
    const res = await fetch(`/api/social/recognitions/${id}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emoji, userId })
    });
    const json = await res.json();
    return json.data;
  },

  async getNotifications(userId?: string): Promise<AppNotification[]> {
    const url = userId ? `/api/social/notifications?userId=${encodeURIComponent(userId)}` : '/api/social/notifications';
    const res = await fetch(url);
    const json = await res.json();
    return json.data;
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`/api/social/notifications/${id}/read`, { method: 'POST' });
  },

  // Reports
  async getExecutiveKpis() {
    const res = await fetch('/api/reports/kpis');
    const json = await res.json();
    return json.data;
  },

  // AI Assistant
  async askAiAssistant(prompt: string): Promise<AiChatMessage> {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const json = await res.json();
    return json.data;
  }
};
