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
import { MockUserRepository, MockEmployeeRepository, MockAttendanceRepository, MockProductionRepository, MockGamificationRepository, MockInventoryRepository, MockQualityRepository, MockMaintenanceRepository, MockTeamRepository, MockNotificationRepository, MockRecognitionRepository, MockAuditRepository } from '../mock';

/**
 * Supabase Repository implementations.
 * When DATA_PROVIDER='supabase', these classes will connect to the PostgreSQL tables
 * (via @supabase/supabase-js or postgres client).
 * Currently fallback-wrapped around mock instances to ensure complete type safety and testability.
 */

export class SupabaseUserRepository extends MockUserRepository implements IUserRepository {
  // Ready for Supabase client:
  // private supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export class SupabaseEmployeeRepository extends MockEmployeeRepository implements IEmployeeRepository {}
export class SupabaseAttendanceRepository extends MockAttendanceRepository implements IAttendanceRepository {}
export class SupabaseProductionRepository extends MockProductionRepository implements IProductionRepository {}
export class SupabaseGamificationRepository extends MockGamificationRepository implements IGamificationRepository {}
export class SupabaseInventoryRepository extends MockInventoryRepository implements IInventoryRepository {}
export class SupabaseQualityRepository extends MockQualityRepository implements IQualityRepository {}
export class SupabaseMaintenanceRepository extends MockMaintenanceRepository implements IMaintenanceRepository {}
export class SupabaseTeamRepository extends MockTeamRepository implements ITeamRepository {}
export class SupabaseNotificationRepository extends MockNotificationRepository implements INotificationRepository {}
export class SupabaseRecognitionRepository extends MockRecognitionRepository implements IRecognitionRepository {}
export class SupabaseAuditRepository extends MockAuditRepository implements IAuditRepository {}
