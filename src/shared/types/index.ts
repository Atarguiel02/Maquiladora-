export type UserRole =
  | 'ADMIN'
  | 'MANAGER'
  | 'SUPERVISOR'
  | 'OPERATOR'
  | 'QUALITY'
  | 'WAREHOUSE'
  | 'MAINTENANCE'
  | 'HR';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
  department: string;
  lineId?: string;
  shiftId: string;
  level: number;
  xp: number;
  currentStreak: number;
  bestStreak: number;
  createdAt: string;
  rankTitle: string;
}

export interface Employee {
  id: string;
  userId: string;
  employeeCode: string;
  name: string;
  role: UserRole;
  position: string;
  department: string;
  productionLineId: string;
  shiftName: string;
  photoUrl: string;
  status: 'active' | 'break' | 'absent' | 'offline';
  todayProduction: number;
  dailyGoal: number;
  qualityRate: number;
  punctualityRate: number;
  level: number;
  xp: number;
  currentStreak: number;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  days: string[];
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'on_time' | 'late' | 'excused' | 'absent';
  xpEarned: number;
  durationHours?: number;
}

export interface ProductionLine {
  id: string;
  code: string;
  name: string;
  supervisorName: string;
  status: 'active' | 'warning' | 'critical' | 'idle';
  activeWorkers: number;
  tardyWorkers: number;
  absentWorkers: number;
  targetDailyUnits: number;
  currentDailyUnits: number;
  efficiencyPercentage: number;
  qualityPercentage: number;
  defectPercentage: number;
  currentProduct: string;
  currentOrderId: string;
}

export interface Machine {
  id: string;
  code: string;
  name: string;
  type: string;
  lineCode: string;
  status: 'operational' | 'maintenance_needed' | 'out_of_service';
  healthScore: number; // 0-100%
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  runtimeHours: number;
  operatorName?: string;
}

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  clientName: string;
  productName: string;
  sku: string;
  targetUnits: number;
  completedUnits: number;
  status: 'in_progress' | 'completed' | 'pending' | 'paused';
  lineCode: string;
  startDate: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ProductionRecord {
  id: string;
  orderId: string;
  lineCode: string;
  userId: string;
  userName: string;
  units: number;
  timestamp: string;
  hourSlot: string;
  xpEarned: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'textil' | 'avios' | 'empaque' | 'repuestos';
  unit: string;
  currentStock: number;
  minStock: number;
  optimalStock: number;
  location: string;
  status: 'optimal' | 'warning' | 'critical';
  unitCost: number;
  lastUpdated: string;
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  itemName: string;
  sku: string;
  type: 'entrada' | 'salida' | 'ajuste';
  quantity: number;
  reason: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export type DefectType = 'costura' | 'mancha' | 'medida' | 'color' | 'rotura' | 'etiqueta';

export interface DefectItem {
  type: DefectType;
  label: string;
  count: number;
}

export interface QualityInspection {
  id: string;
  orderNumber: string;
  productName: string;
  lineCode: string;
  inspectorName: string;
  sampleSize: number;
  passedUnits: number;
  defectUnits: number;
  defectRate: number;
  defects: DefectItem[];
  timestamp: string;
  status: 'passed' | 'warning' | 'rejected';
}

export interface MaintenanceTicket {
  id: string;
  machineCode: string;
  machineName: string;
  lineCode: string;
  reportedBy: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  technicianName?: string;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'production' | 'quality' | 'punctuality' | 'teamwork' | 'milestone';
  icon: string;
  xpReward: number;
  targetValue: number;
  unlocked: boolean;
  progress: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'team';
  rewardXp: number;
  targetMetric: string;
  targetValue: number;
  currentProgress: number;
  daysRemaining: number;
  icon: string;
  badgeCode?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatarUrl: string;
  role: string;
  department: string;
  xp: number;
  level: number;
  qualityScore: number;
  punctualityScore: number;
  streak: number;
  badgeCount: number;
  isCurrentUser?: boolean;
}

export interface Team {
  id: string;
  name: string;
  lineCode: string;
  leaderName: string;
  memberCount: number;
  efficiency: number;
  quality: number;
  attendance: number;
  totalXp: number;
  rank: number;
}

export interface Recognition {
  id: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  message: string;
  xpAwarded: number;
  category: 'quality' | 'speed' | 'teamwork' | 'safety';
  reactions: {
    heart: number;
    clap: number;
    fire: number;
    party: number;
  };
  userReactions?: string[];
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'xp' | 'badge' | 'streak' | 'production' | 'announcement' | 'alert';
  xpAmount?: number;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  details: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
  highlightData?: {
    metric: string;
    value: string;
    trend: string;
  };
}
