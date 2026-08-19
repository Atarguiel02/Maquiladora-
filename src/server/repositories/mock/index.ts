import {
  User,
  Employee,
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
  Team,
  Recognition,
  AppNotification,
  AuditLog,
  UserRole
} from '../../../shared/types';
import {
  IUserRepository,
  IEmployeeRepository,
  IAttendanceRepository,
  IProductionRepository,
  IGamificationRepository,
  IInventoryRepository,
  IQualityRepository,
  IMaintenanceRepository,
  ITeamRepository,
  INotificationRepository,
  IRecognitionRepository,
  IAuditRepository
} from '../interfaces';
import {
  INITIAL_USERS,
  INITIAL_EMPLOYEES,
  INITIAL_PRODUCTION_LINES,
  INITIAL_MACHINES,
  INITIAL_ORDERS,
  INITIAL_INVENTORY,
  INITIAL_ACHIEVEMENTS,
  INITIAL_CHALLENGES,
  INITIAL_TEAMS,
  INITIAL_RECOGNITIONS,
  INITIAL_NOTIFICATIONS
} from '../../mock/initialData';

// Mutable in-memory store
class MockDataStore {
  users: User[] = JSON.parse(JSON.stringify(INITIAL_USERS));
  employees: Employee[] = JSON.parse(JSON.stringify(INITIAL_EMPLOYEES));
  lines: ProductionLine[] = JSON.parse(JSON.stringify(INITIAL_PRODUCTION_LINES));
  machines: Machine[] = JSON.parse(JSON.stringify(INITIAL_MACHINES));
  orders: ProductionOrder[] = JSON.parse(JSON.stringify(INITIAL_ORDERS));
  inventory: InventoryItem[] = JSON.parse(JSON.stringify(INITIAL_INVENTORY));
  movements: InventoryMovement[] = [
    {
      id: 'mov-1',
      itemId: 'inv-001',
      itemName: 'Tela Algodón Pima 100% Azul Royal (Rollos)',
      sku: 'MAT-TEL-01',
      type: 'entrada',
      quantity: 500,
      reason: 'Ingreso lote proveedor Textil Sur',
      userId: 'usr-marco',
      userName: 'Marco Antonio Ruiz',
      timestamp: '2026-08-18T08:15:00Z'
    }
  ];
  achievements: Achievement[] = JSON.parse(JSON.stringify(INITIAL_ACHIEVEMENTS));
  challenges: Challenge[] = JSON.parse(JSON.stringify(INITIAL_CHALLENGES));
  teams: Team[] = JSON.parse(JSON.stringify(INITIAL_TEAMS));
  recognitions: Recognition[] = JSON.parse(JSON.stringify(INITIAL_RECOGNITIONS));
  notifications: AppNotification[] = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
  attendance: AttendanceRecord[] = [
    {
      id: 'att-1',
      userId: 'usr-carlos',
      userName: 'Carlos López',
      date: '2026-08-18',
      checkInTime: '07:58:12',
      status: 'on_time',
      xpEarned: 10
    }
  ];
  productionRecords: ProductionRecord[] = [
    { id: 'prd-1', orderId: 'ORD-2026-083', lineCode: 'LINE-03', userId: 'usr-carlos', userName: 'Carlos López', units: 120, timestamp: '2026-08-18T08:30:00Z', hourSlot: '08:30', xpEarned: 15 },
    { id: 'prd-2', orderId: 'ORD-2026-083', lineCode: 'LINE-03', userId: 'usr-carlos', userName: 'Carlos López', units: 150, timestamp: '2026-08-18T10:15:00Z', hourSlot: '10:15', xpEarned: 20 },
    { id: 'prd-3', orderId: 'ORD-2026-083', lineCode: 'LINE-03', userId: 'usr-carlos', userName: 'Carlos López', units: 180, timestamp: '2026-08-18T12:00:00Z', hourSlot: '12:00', xpEarned: 25 },
    { id: 'prd-4', orderId: 'ORD-2026-083', lineCode: 'LINE-03', userId: 'usr-carlos', userName: 'Carlos López', units: 170, timestamp: '2026-08-18T14:30:00Z', hourSlot: '14:30', xpEarned: 25 },
    { id: 'prd-5', orderId: 'ORD-2026-083', lineCode: 'LINE-03', userId: 'usr-carlos', userName: 'Carlos López', units: 200, timestamp: '2026-08-18T16:00:00Z', hourSlot: '16:00', xpEarned: 35 }
  ];
  inspections: QualityInspection[] = [
    {
      id: 'insp-1',
      orderNumber: 'PO-88403',
      productName: 'Hoodie Fleece Heavyweight',
      lineCode: 'LINE-03',
      inspectorName: 'Diego Rivas',
      sampleSize: 100,
      passedUnits: 98,
      defectUnits: 2,
      defectRate: 2.0,
      defects: [
        { type: 'costura', label: 'Costura suelta', count: 1 },
        { type: 'mancha', label: 'Mancha leve', count: 1 }
      ],
      timestamp: '2026-08-18T09:45:00Z',
      status: 'passed'
    },
    {
      id: 'insp-2',
      orderNumber: 'PO-88401',
      productName: 'Polo Pima Oversized',
      lineCode: 'LINE-01',
      inspectorName: 'Diego Rivas',
      sampleSize: 150,
      passedUnits: 148,
      defectUnits: 2,
      defectRate: 1.3,
      defects: [
        { type: 'etiqueta', label: 'Etiqueta torcida', count: 2 }
      ],
      timestamp: '2026-08-18T11:00:00Z',
      status: 'passed'
    }
  ];
  tickets: MaintenanceTicket[] = [
    {
      id: 'tkt-1',
      machineCode: 'M-004',
      machineName: 'Cortadora Automática Gerber Cutter Z1',
      lineCode: 'LINE-05',
      reportedBy: 'Claudio Vargas',
      title: 'Falla en cabezal oscilante neumático',
      description: 'La cuchilla no desciende a la presión correcta causando corte irregular.',
      priority: 'urgent',
      status: 'in_progress',
      createdAt: '2026-08-18T08:20:00Z',
      technicianName: 'Roberto Valdés'
    },
    {
      id: 'tkt-2',
      machineCode: 'M-003',
      machineName: 'Bordadora Industrial Tajima 8 Cabezales',
      lineCode: 'LINE-01',
      reportedBy: 'José Morales',
      title: 'Calibración de sensor de hilo cabezal 3',
      description: 'Sensor activa falso positivo de corte de hilo.',
      priority: 'medium',
      status: 'open',
      createdAt: '2026-08-18T09:10:00Z'
    }
  ];
  auditLogs: AuditLog[] = [];
}

const store = new MockDataStore();

export class MockUserRepository implements IUserRepository {
  async findAll(): Promise<User[]> {
    return store.users;
  }
  async findById(id: string): Promise<User | null> {
    return store.users.find((u) => u.id === id) || null;
  }
  async findByEmail(email: string): Promise<User | null> {
    return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }
  async findByRole(role: UserRole): Promise<User[]> {
    return store.users.filter((u) => u.role === role);
  }
  async create(item: User): Promise<User> {
    store.users.push(item);
    return item;
  }
  async update(id: string, partial: Partial<User>): Promise<User | null> {
    const idx = store.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    store.users[idx] = { ...store.users[idx], ...partial };
    return store.users[idx];
  }
  async delete(id: string): Promise<boolean> {
    const idx = store.users.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    store.users.splice(idx, 1);
    return true;
  }
  async addXp(userId: string, xpAmount: number): Promise<{ user: User; leveledUp: boolean; newLevel: number }> {
    const user = store.users.find((u) => u.id === userId);
    if (!user) throw new Error('Usuario no encontrado');

    user.xp += xpAmount;
    // Level formula: each level takes (level * 150) XP
    const calculatedLevel = Math.max(1, Math.floor(Math.sqrt(user.xp / 10)) + 1);
    const leveledUp = calculatedLevel > user.level;
    if (leveledUp) {
      user.level = calculatedLevel;
      if (user.level >= 30) user.rankTitle = 'Master de Producción 👑';
      else if (user.level >= 20) user.rankTitle = 'Especialista Élite ⚡';
      else if (user.level >= 10) user.rankTitle = 'Operador Destacado ⭐';
      else if (user.level >= 5) user.rankTitle = 'Aprendiz Pro 🚀';
    }

    return { user, leveledUp, newLevel: user.level };
  }
  async updateStreak(userId: string, streak: number): Promise<User> {
    const user = store.users.find((u) => u.id === userId);
    if (!user) throw new Error('Usuario no encontrado');
    user.currentStreak = streak;
    if (streak > user.bestStreak) {
      user.bestStreak = streak;
    }
    return user;
  }
}

export class MockEmployeeRepository implements IEmployeeRepository {
  async findAll(): Promise<Employee[]> {
    return store.employees;
  }
  async findById(id: string): Promise<Employee | null> {
    return store.employees.find((e) => e.id === id || e.userId === id) || null;
  }
  async findByLine(lineId: string): Promise<Employee[]> {
    return store.employees.filter((e) => e.productionLineId === lineId);
  }
  async findByDepartment(dept: string): Promise<Employee[]> {
    return store.employees.filter((e) => e.department.toLowerCase() === dept.toLowerCase());
  }
  async create(item: Employee): Promise<Employee> {
    store.employees.push(item);
    return item;
  }
  async update(id: string, partial: Partial<Employee>): Promise<Employee | null> {
    const idx = store.employees.findIndex((e) => e.id === id || e.userId === id);
    if (idx === -1) return null;
    store.employees[idx] = { ...store.employees[idx], ...partial };
    return store.employees[idx];
  }
  async updateProduction(employeeId: string, unitsAdded: number): Promise<Employee | null> {
    const emp = store.employees.find((e) => e.id === employeeId || e.userId === employeeId);
    if (!emp) return null;
    emp.todayProduction += unitsAdded;
    return emp;
  }
  async delete(id: string): Promise<boolean> {
    const idx = store.employees.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    store.employees.splice(idx, 1);
    return true;
  }
}

export class MockAttendanceRepository implements IAttendanceRepository {
  async findAll(): Promise<AttendanceRecord[]> {
    return store.attendance;
  }
  async findById(id: string): Promise<AttendanceRecord | null> {
    return store.attendance.find((a) => a.id === id) || null;
  }
  async findByUser(userId: string): Promise<AttendanceRecord[]> {
    return store.attendance.filter((a) => a.userId === userId);
  }
  async getTodayRecord(userId: string, dateStr: string): Promise<AttendanceRecord | null> {
    return store.attendance.find((a) => a.userId === userId && a.date === dateStr) || null;
  }
  async checkIn(userId: string, userName: string): Promise<{ record: AttendanceRecord; xpGranted: number; isLate: boolean }> {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];
    
    // Check if already checked in today
    let existing = store.attendance.find((a) => a.userId === userId && a.date === dateStr);
    if (existing) {
      return { record: existing, xpGranted: 0, isLate: false };
    }

    const hour = now.getHours();
    const isLate = hour > 8 || (hour === 8 && now.getMinutes() > 15);
    const xpGranted = isLate ? 5 : 20;

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      userId,
      userName,
      date: dateStr,
      checkInTime: timeStr,
      status: isLate ? 'late' : 'on_time',
      xpEarned: xpGranted
    };
    store.attendance.unshift(newRecord);

    // Update user streak
    const user = store.users.find((u) => u.id === userId);
    if (user) {
      user.currentStreak = (user.currentStreak || 0) + 1;
      user.xp += xpGranted;
    }

    return { record: newRecord, xpGranted, isLate };
  }
  async checkOut(userId: string): Promise<AttendanceRecord | null> {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];

    const record = store.attendance.find((a) => a.userId === userId && a.date === dateStr && !a.checkOutTime);
    if (record) {
      record.checkOutTime = timeStr;
      return record;
    }
    return null;
  }
  async create(item: AttendanceRecord): Promise<AttendanceRecord> {
    store.attendance.push(item);
    return item;
  }
  async update(id: string, partial: Partial<AttendanceRecord>): Promise<AttendanceRecord | null> {
    const idx = store.attendance.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    store.attendance[idx] = { ...store.attendance[idx], ...partial };
    return store.attendance[idx];
  }
  async delete(id: string): Promise<boolean> {
    const idx = store.attendance.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    store.attendance.splice(idx, 1);
    return true;
  }
}

export class MockProductionRepository implements IProductionRepository {
  async getLines(): Promise<ProductionLine[]> {
    return store.lines;
  }
  async getLineByCode(code: string): Promise<ProductionLine | null> {
    return store.lines.find((l) => l.code === code) || null;
  }
  async updateLineStatus(lineCode: string, status: ProductionLine['status']): Promise<ProductionLine | null> {
    const line = store.lines.find((l) => l.code === lineCode);
    if (!line) return null;
    line.status = status;
    return line;
  }
  async getOrders(): Promise<ProductionOrder[]> {
    return store.orders;
  }
  async getOrderById(id: string): Promise<ProductionOrder | null> {
    return store.orders.find((o) => o.id === id || o.orderNumber === id) || null;
  }
  async getRecentRecords(userId?: string, limit = 20): Promise<ProductionRecord[]> {
    let list = store.productionRecords;
    if (userId) {
      list = list.filter((r) => r.userId === userId);
    }
    return list.slice(0, limit);
  }
  async logProduction(data: {
    orderId: string;
    lineCode: string;
    userId: string;
    userName: string;
    units: number;
    hourSlot: string;
  }): Promise<{ record: ProductionRecord; xpEarned: number; newTotalUnits: number }> {
    // XP Calculation: 1 XP per 5 units + 10 bonus
    const xpEarned = Math.max(10, Math.floor(data.units / 5));

    const newRecord: ProductionRecord = {
      id: `prd-${Date.now()}`,
      orderId: data.orderId,
      lineCode: data.lineCode,
      userId: data.userId,
      userName: data.userName,
      units: data.units,
      timestamp: new Date().toISOString(),
      hourSlot: data.hourSlot,
      xpEarned
    };

    store.productionRecords.unshift(newRecord);

    // Update line counters
    const line = store.lines.find((l) => l.code === data.lineCode);
    if (line) {
      line.currentDailyUnits += data.units;
      line.efficiencyPercentage = Math.min(100, Math.round((line.currentDailyUnits / line.targetDailyUnits) * 100));
    }

    // Update order counters
    const order = store.orders.find((o) => o.id === data.orderId || o.lineCode === data.lineCode);
    if (order) {
      order.completedUnits += data.units;
      if (order.completedUnits >= order.targetUnits) {
        order.status = 'completed';
      }
    }

    // Update employee production
    const emp = store.employees.find((e) => e.userId === data.userId || e.name === data.userName);
    if (emp) {
      emp.todayProduction += data.units;
      emp.xp += xpEarned;
    }

    // Update user XP
    const user = store.users.find((u) => u.id === data.userId);
    if (user) {
      user.xp += xpEarned;
    }

    const currentTotal = emp ? emp.todayProduction : 820 + data.units;
    return { record: newRecord, xpEarned, newTotalUnits: currentTotal };
  }
}

export class MockGamificationRepository implements IGamificationRepository {
  async getAchievements(userId: string): Promise<Achievement[]> {
    return store.achievements;
  }
  async unlockAchievement(userId: string, achievementCode: string): Promise<{ achievement: Achievement; xpGranted: number }> {
    const ach = store.achievements.find((a) => a.code === achievementCode);
    if (!ach) throw new Error('Logro no encontrado');
    ach.unlocked = true;
    ach.progress = ach.targetValue;

    const user = store.users.find((u) => u.id === userId);
    if (user) {
      user.xp += ach.xpReward;
    }

    return { achievement: ach, xpGranted: ach.xpReward };
  }
  async getChallenges(): Promise<Challenge[]> {
    return store.challenges;
  }
  async getLeaderboard(metric: 'xp' | 'quality' | 'punctuality' = 'xp'): Promise<LeaderboardEntry[]> {
    const employees = store.employees;
    
    // Balanced ranking calculation
    const list: LeaderboardEntry[] = employees.map((emp) => ({
      rank: 0,
      userId: emp.userId,
      name: emp.name,
      avatarUrl: emp.photoUrl,
      role: emp.position,
      department: emp.department,
      xp: emp.xp,
      level: emp.level,
      qualityScore: emp.qualityRate,
      punctualityScore: emp.punctualityRate,
      streak: emp.currentStreak,
      badgeCount: 4
    }));

    if (metric === 'quality') {
      list.sort((a, b) => b.qualityScore - a.qualityScore || b.xp - a.xp);
    } else if (metric === 'punctuality') {
      list.sort((a, b) => b.punctualityScore - a.punctualityScore || b.streak - a.streak);
    } else {
      list.sort((a, b) => b.xp - a.xp);
    }

    return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }
}

export class MockInventoryRepository implements IInventoryRepository {
  async findAll(): Promise<InventoryItem[]> {
    return store.inventory;
  }
  async findById(id: string): Promise<InventoryItem | null> {
    return store.inventory.find((i) => i.id === id) || null;
  }
  async findBySku(sku: string): Promise<InventoryItem | null> {
    return store.inventory.find((i) => i.sku.toLowerCase() === sku.toLowerCase()) || null;
  }
  async findByCategory(category: InventoryItem['category']): Promise<InventoryItem[]> {
    return store.inventory.filter((i) => i.category === category);
  }
  async getLowStockItems(): Promise<InventoryItem[]> {
    return store.inventory.filter((i) => i.status === 'warning' || i.status === 'critical');
  }
  async recordMovement(movement: Omit<InventoryMovement, 'id' | 'timestamp'>): Promise<{ movement: InventoryMovement; updatedItem: InventoryItem }> {
    const item = store.inventory.find((i) => i.id === movement.itemId || i.sku === movement.sku);
    if (!item) throw new Error('Ítem de inventario no encontrado');

    if (movement.type === 'entrada') {
      item.currentStock += movement.quantity;
    } else if (movement.type === 'salida') {
      item.currentStock = Math.max(0, item.currentStock - movement.quantity);
    } else if (movement.type === 'ajuste') {
      item.currentStock = movement.quantity;
    }

    // Update status
    if (item.currentStock <= item.minStock * 0.5) {
      item.status = 'critical';
    } else if (item.currentStock <= item.minStock) {
      item.status = 'warning';
    } else {
      item.status = 'optimal';
    }
    item.lastUpdated = new Date().toISOString().split('T')[0];

    const newMovement: InventoryMovement = {
      ...movement,
      id: `mov-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    store.movements.unshift(newMovement);

    return { movement: newMovement, updatedItem: item };
  }
  async getMovements(itemId?: string, limit = 20): Promise<InventoryMovement[]> {
    let list = store.movements;
    if (itemId) {
      list = list.filter((m) => m.itemId === itemId);
    }
    return list.slice(0, limit);
  }
  async create(item: InventoryItem): Promise<InventoryItem> {
    store.inventory.push(item);
    return item;
  }
  async update(id: string, partial: Partial<InventoryItem>): Promise<InventoryItem | null> {
    const idx = store.inventory.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    store.inventory[idx] = { ...store.inventory[idx], ...partial };
    return store.inventory[idx];
  }
  async delete(id: string): Promise<boolean> {
    const idx = store.inventory.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    store.inventory.splice(idx, 1);
    return true;
  }
}

export class MockQualityRepository implements IQualityRepository {
  async findAll(): Promise<QualityInspection[]> {
    return store.inspections;
  }
  async findById(id: string): Promise<QualityInspection | null> {
    return store.inspections.find((i) => i.id === id) || null;
  }
  async getInspections(limit = 20): Promise<QualityInspection[]> {
    return store.inspections.slice(0, limit);
  }
  async getDefectPareto(): Promise<{ defectType: string; count: number; percentage: number }[]> {
    const tally: Record<string, number> = {
      Costura: 18,
      Mancha: 9,
      Medida: 6,
      Etiqueta: 5,
      Color: 3,
      Rotura: 2
    };
    const total = Object.values(tally).reduce((a, b) => a + b, 0);
    return Object.entries(tally).map(([defectType, count]) => ({
      defectType,
      count,
      percentage: Math.round((count / total) * 100)
    }));
  }
  async logInspection(inspection: Omit<QualityInspection, 'id' | 'timestamp' | 'defectRate' | 'status'>): Promise<QualityInspection> {
    const defectRate = parseFloat(((inspection.defectUnits / inspection.sampleSize) * 100).toFixed(1));
    let status: QualityInspection['status'] = 'passed';
    if (defectRate > 5) status = 'rejected';
    else if (defectRate > 2) status = 'warning';

    const newInsp: QualityInspection = {
      ...inspection,
      id: `insp-${Date.now()}`,
      defectRate,
      status,
      timestamp: new Date().toISOString()
    };
    store.inspections.unshift(newInsp);
    return newInsp;
  }
  async create(item: QualityInspection): Promise<QualityInspection> {
    store.inspections.push(item);
    return item;
  }
  async update(id: string, partial: Partial<QualityInspection>): Promise<QualityInspection | null> {
    const idx = store.inspections.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    store.inspections[idx] = { ...store.inspections[idx], ...partial };
    return store.inspections[idx];
  }
  async delete(id: string): Promise<boolean> {
    const idx = store.inspections.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    store.inspections.splice(idx, 1);
    return true;
  }
}

export class MockMaintenanceRepository implements IMaintenanceRepository {
  async findAll(): Promise<Machine[]> {
    return store.machines;
  }
  async findById(id: string): Promise<Machine | null> {
    return store.machines.find((m) => m.id === id || m.code === id) || null;
  }
  async getMachines(): Promise<Machine[]> {
    return store.machines;
  }
  async getMachineByCode(code: string): Promise<Machine | null> {
    return store.machines.find((m) => m.code === code) || null;
  }
  async updateMachineStatus(code: string, status: Machine['status']): Promise<Machine | null> {
    const machine = store.machines.find((m) => m.code === code);
    if (!machine) return null;
    machine.status = status;
    return machine;
  }
  async getTickets(): Promise<MaintenanceTicket[]> {
    return store.tickets;
  }
  async createTicket(ticket: Omit<MaintenanceTicket, 'id' | 'createdAt' | 'status'>): Promise<MaintenanceTicket> {
    const newTicket: MaintenanceTicket = {
      ...ticket,
      id: `tkt-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    store.tickets.unshift(newTicket);
    return newTicket;
  }
  async resolveTicket(ticketId: string, technicianName: string): Promise<MaintenanceTicket | null> {
    const tkt = store.tickets.find((t) => t.id === ticketId);
    if (!tkt) return null;
    tkt.status = 'resolved';
    tkt.resolvedAt = new Date().toISOString();
    tkt.technicianName = technicianName;
    return tkt;
  }
  async create(item: Machine): Promise<Machine> {
    store.machines.push(item);
    return item;
  }
  async update(id: string, partial: Partial<Machine>): Promise<Machine | null> {
    const idx = store.machines.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    store.machines[idx] = { ...store.machines[idx], ...partial };
    return store.machines[idx];
  }
  async delete(id: string): Promise<boolean> {
    const idx = store.machines.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    store.machines.splice(idx, 1);
    return true;
  }
}

export class MockTeamRepository implements ITeamRepository {
  async findAll(): Promise<Team[]> {
    return store.teams;
  }
  async findById(id: string): Promise<Team | null> {
    return store.teams.find((t) => t.id === id) || null;
  }
  async getTeams(): Promise<Team[]> {
    return store.teams;
  }
  async getTeamByLine(lineCode: string): Promise<Team | null> {
    return store.teams.find((t) => t.lineCode === lineCode) || null;
  }
  async create(item: Team): Promise<Team> {
    store.teams.push(item);
    return item;
  }
  async update(id: string, partial: Partial<Team>): Promise<Team | null> {
    const idx = store.teams.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    store.teams[idx] = { ...store.teams[idx], ...partial };
    return store.teams[idx];
  }
  async delete(id: string): Promise<boolean> {
    const idx = store.teams.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    store.teams.splice(idx, 1);
    return true;
  }
}

export class MockNotificationRepository implements INotificationRepository {
  async getUserNotifications(userId?: string): Promise<AppNotification[]> {
    return store.notifications;
  }
  async addNotification(notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>): Promise<AppNotification> {
    const newNotif: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: 'Justo ahora'
    };
    store.notifications.unshift(newNotif);
    return newNotif;
  }
  async markAsRead(id: string): Promise<boolean> {
    const notif = store.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      return true;
    }
    return false;
  }
  async markAllAsRead(userId?: string): Promise<boolean> {
    store.notifications.forEach((n) => {
      n.isRead = true;
    });
    return true;
  }
}

export class MockRecognitionRepository implements IRecognitionRepository {
  async getRecognitions(limit = 20): Promise<Recognition[]> {
    return store.recognitions.slice(0, limit);
  }
  async createRecognition(recognition: Omit<Recognition, 'id' | 'createdAt' | 'reactions' | 'userReactions'>): Promise<Recognition> {
    const newRec: Recognition = {
      ...recognition,
      id: `rec-${Date.now()}`,
      reactions: { heart: 0, clap: 1, fire: 1, party: 0 },
      userReactions: ['fire'],
      createdAt: new Date().toISOString()
    };
    store.recognitions.unshift(newRec);

    // Grant XP to receiver
    const receiver = store.users.find((u) => u.id === recognition.receiverId);
    if (receiver) {
      receiver.xp += recognition.xpAwarded;
    }

    return newRec;
  }
  async reactToRecognition(recognitionId: string, emojiType: 'heart' | 'clap' | 'fire' | 'party', userId: string): Promise<Recognition | null> {
    const rec = store.recognitions.find((r) => r.id === recognitionId);
    if (!rec) return null;
    rec.reactions[emojiType] = (rec.reactions[emojiType] || 0) + 1;
    if (!rec.userReactions) rec.userReactions = [];
    if (!rec.userReactions.includes(emojiType)) {
      rec.userReactions.push(emojiType);
    }
    return rec;
  }
}

export class MockAuditRepository implements IAuditRepository {
  async log(entry: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const item: AuditLog = {
      ...entry,
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    store.auditLogs.unshift(item);
    return item;
  }
  async getLogs(limit = 50): Promise<AuditLog[]> {
    return store.auditLogs.slice(0, limit);
  }
}
