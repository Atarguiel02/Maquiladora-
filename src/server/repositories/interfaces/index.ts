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

export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(item: T): Promise<T>;
  update(id: string, partial: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByRole(role: UserRole): Promise<User[]>;
  addXp(userId: string, xpAmount: number): Promise<{ user: User; leveledUp: boolean; newLevel: number }>;
  updateStreak(userId: string, streak: number): Promise<User>;
}

export interface IEmployeeRepository extends IRepository<Employee> {
  findByLine(lineId: string): Promise<Employee[]>;
  findByDepartment(dept: string): Promise<Employee[]>;
  updateProduction(employeeId: string, unitsAdded: number): Promise<Employee | null>;
}

export interface IAttendanceRepository extends IRepository<AttendanceRecord> {
  findByUser(userId: string): Promise<AttendanceRecord[]>;
  getTodayRecord(userId: string, dateStr: string): Promise<AttendanceRecord | null>;
  checkIn(userId: string, userName: string): Promise<{ record: AttendanceRecord; xpGranted: number; isLate: boolean }>;
  checkOut(userId: string): Promise<AttendanceRecord | null>;
}

export interface IProductionRepository {
  getLines(): Promise<ProductionLine[]>;
  getLineByCode(code: string): Promise<ProductionLine | null>;
  updateLineStatus(lineCode: string, status: ProductionLine['status']): Promise<ProductionLine | null>;
  getOrders(): Promise<ProductionOrder[]>;
  getOrderById(id: string): Promise<ProductionOrder | null>;
  getRecentRecords(userId?: string, limit?: number): Promise<ProductionRecord[]>;
  logProduction(data: {
    orderId: string;
    lineCode: string;
    userId: string;
    userName: string;
    units: number;
    hourSlot: string;
  }): Promise<{ record: ProductionRecord; xpEarned: number; newTotalUnits: number }>;
}

export interface IGamificationRepository {
  getAchievements(userId: string): Promise<Achievement[]>;
  unlockAchievement(userId: string, achievementCode: string): Promise<{ achievement: Achievement; xpGranted: number }>;
  getChallenges(): Promise<Challenge[]>;
  getLeaderboard(metric?: 'xp' | 'quality' | 'punctuality'): Promise<LeaderboardEntry[]>;
}

export interface IInventoryRepository extends IRepository<InventoryItem> {
  findBySku(sku: string): Promise<InventoryItem | null>;
  findByCategory(category: InventoryItem['category']): Promise<InventoryItem[]>;
  getLowStockItems(): Promise<InventoryItem[]>;
  recordMovement(movement: Omit<InventoryMovement, 'id' | 'timestamp'>): Promise<{ movement: InventoryMovement; updatedItem: InventoryItem }>;
  getMovements(itemId?: string, limit?: number): Promise<InventoryMovement[]>;
}

export interface IQualityRepository extends IRepository<QualityInspection> {
  getInspections(limit?: number): Promise<QualityInspection[]>;
  getDefectPareto(): Promise<{ defectType: string; count: number; percentage: number }[]>;
  logInspection(inspection: Omit<QualityInspection, 'id' | 'timestamp' | 'defectRate' | 'status'>): Promise<QualityInspection>;
}

export interface IMaintenanceRepository extends IRepository<Machine> {
  getMachines(): Promise<Machine[]>;
  getMachineByCode(code: string): Promise<Machine | null>;
  updateMachineStatus(code: string, status: Machine['status']): Promise<Machine | null>;
  getTickets(): Promise<MaintenanceTicket[]>;
  createTicket(ticket: Omit<MaintenanceTicket, 'id' | 'createdAt' | 'status'>): Promise<MaintenanceTicket>;
  resolveTicket(ticketId: string, technicianName: string): Promise<MaintenanceTicket | null>;
}

export interface ITeamRepository extends IRepository<Team> {
  getTeams(): Promise<Team[]>;
  getTeamByLine(lineCode: string): Promise<Team | null>;
}

export interface INotificationRepository {
  getUserNotifications(userId?: string): Promise<AppNotification[]>;
  addNotification(notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>): Promise<AppNotification>;
  markAsRead(id: string): Promise<boolean>;
  markAllAsRead(userId?: string): Promise<boolean>;
}

export interface IRecognitionRepository {
  getRecognitions(limit?: number): Promise<Recognition[]>;
  createRecognition(recognition: Omit<Recognition, 'id' | 'createdAt' | 'reactions' | 'userReactions'>): Promise<Recognition>;
  reactToRecognition(recognitionId: string, emojiType: 'heart' | 'clap' | 'fire' | 'party', userId: string): Promise<Recognition | null>;
}

export interface IAuditRepository {
  log(entry: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog>;
  getLogs(limit?: number): Promise<AuditLog[]>;
}
