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
} from './interfaces';
import {
  MockUserRepository,
  MockEmployeeRepository,
  MockAttendanceRepository,
  MockProductionRepository,
  MockGamificationRepository,
  MockInventoryRepository,
  MockQualityRepository,
  MockMaintenanceRepository,
  MockTeamRepository,
  MockNotificationRepository,
  MockRecognitionRepository,
  MockAuditRepository
} from './mock';
import {
  SupabaseUserRepository,
  SupabaseEmployeeRepository,
  SupabaseAttendanceRepository,
  SupabaseProductionRepository,
  SupabaseGamificationRepository,
  SupabaseInventoryRepository,
  SupabaseQualityRepository,
  SupabaseMaintenanceRepository,
  SupabaseTeamRepository,
  SupabaseNotificationRepository,
  SupabaseRecognitionRepository,
  SupabaseAuditRepository
} from './supabase';

class RepositoryContainer {
  public userRepo: IUserRepository;
  public employeeRepo: IEmployeeRepository;
  public attendanceRepo: IAttendanceRepository;
  public productionRepo: IProductionRepository;
  public gamificationRepo: IGamificationRepository;
  public inventoryRepo: IInventoryRepository;
  public qualityRepo: IQualityRepository;
  public maintenanceRepo: IMaintenanceRepository;
  public teamRepo: ITeamRepository;
  public notificationRepo: INotificationRepository;
  public recognitionRepo: IRecognitionRepository;
  public auditRepo: IAuditRepository;

  constructor() {
    const isSupabase = process.env.DATA_PROVIDER === 'supabase';

    if (isSupabase) {
      this.userRepo = new SupabaseUserRepository();
      this.employeeRepo = new SupabaseEmployeeRepository();
      this.attendanceRepo = new SupabaseAttendanceRepository();
      this.productionRepo = new SupabaseProductionRepository();
      this.gamificationRepo = new SupabaseGamificationRepository();
      this.inventoryRepo = new SupabaseInventoryRepository();
      this.qualityRepo = new SupabaseQualityRepository();
      this.maintenanceRepo = new SupabaseMaintenanceRepository();
      this.teamRepo = new SupabaseTeamRepository();
      this.notificationRepo = new SupabaseNotificationRepository();
      this.recognitionRepo = new SupabaseRecognitionRepository();
      this.auditRepo = new SupabaseAuditRepository();
    } else {
      this.userRepo = new MockUserRepository();
      this.employeeRepo = new MockEmployeeRepository();
      this.attendanceRepo = new MockAttendanceRepository();
      this.productionRepo = new MockProductionRepository();
      this.gamificationRepo = new MockGamificationRepository();
      this.inventoryRepo = new MockInventoryRepository();
      this.qualityRepo = new MockQualityRepository();
      this.maintenanceRepo = new MockMaintenanceRepository();
      this.teamRepo = new MockTeamRepository();
      this.notificationRepo = new MockNotificationRepository();
      this.recognitionRepo = new MockRecognitionRepository();
      this.auditRepo = new MockAuditRepository();
    }
  }
}

export const repositories = new RepositoryContainer();
