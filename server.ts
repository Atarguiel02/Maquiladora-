import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  authService,
  attendanceService,
  productionService,
  gamificationService,
  inventoryService,
  qualityService,
  maintenanceService,
  socialService,
  reportService,
  aiAssistantService
} from './src/server/services/index';


dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    service: 'Maquila Hub API Gateway',
    dataProvider: process.env.DATA_PROVIDER || 'mock',
    timestamp: new Date().toISOString()
  });
});

// Swagger / OpenAPI documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'MAQUILA HUB Microservices API Gateway',
      version: '1.0.0',
      description: 'API REST para gestión integral de maquilas diseñada para la Generación Z con gamificación, producción en tiempo real y soporte para Supabase/PostgreSQL.'
    },
    servers: [{ url: '/api' }],
    dataProvider: process.env.DATA_PROVIDER || 'mock',
    endpoints: [
      { path: '/auth/login', methods: ['POST'], description: 'Autenticación y selección de usuario' },
      { path: '/auth/users', methods: ['GET'], description: 'Listado de usuarios de prueba' },
      { path: '/attendance/today', methods: ['GET'], description: 'Consultar estado de jornada actual' },
      { path: '/attendance/check-in', methods: ['POST'], description: 'Marcaje de entrada con cálculo de XP y racha' },
      { path: '/attendance/check-out', methods: ['POST'], description: 'Marcaje de salida de jornada' },
      { path: '/production/lines', methods: ['GET'], description: 'Monitoreo de líneas en tiempo real' },
      { path: '/production/orders', methods: ['GET'], description: 'Órdenes de producción activas' },
      { path: '/production/log', methods: ['POST'], description: 'Registro ultrarrápido de producción (<3s)' },
      { path: '/gamification/leaderboard', methods: ['GET'], description: 'Tabla de clasificación equilibrada' },
      { path: '/gamification/achievements', methods: ['GET'], description: 'Insignias y logros desbloqueables' },
      { path: '/inventory/items', methods: ['GET'], description: 'Catálogo de materias primas y stock' },
      { path: '/quality/inspect', methods: ['POST'], description: 'Registro de inspección y defectos' },
      { path: '/maintenance/machines', methods: ['GET'], description: 'Monitoreo de estado de 15 máquinas' },
      { path: '/social/recognitions', methods: ['GET', 'POST'], description: 'Muro de reconocimientos con reacciones y XP' },
      { path: '/ai/chat', methods: ['POST'], description: 'Asistente de planta MaquiBot AI' }
    ]
  });
});

// Auth
app.get('/api/auth/users', async (req, res) => {
  const users = await authService.getAllUsers();
  res.json({ success: true, data: users });
});

app.post('/api/auth/login', async (req, res) => {
  const { emailOrId } = req.body;
  const user = await authService.login(emailOrId || 'usr-carlos');
  res.json({ success: true, data: user });
});

app.post('/api/auth/switch-role', async (req, res) => {
  const { role } = req.body;
  const user = await authService.switchRole(role);
  res.json({ success: true, data: user });
});

// Attendance
app.get('/api/attendance/today', async (req, res) => {
  const userId = (req.query.userId as string) || 'usr-carlos';
  const record = await attendanceService.getTodayAttendance(userId);
  res.json({ success: true, data: record });
});

app.post('/api/attendance/check-in', async (req, res) => {
  const { userId, userName } = req.body;
  const result = await attendanceService.checkIn(userId || 'usr-carlos', userName || 'Carlos López');
  res.json({ success: true, data: result });
});

app.post('/api/attendance/check-out', async (req, res) => {
  const { userId } = req.body;
  const result = await attendanceService.checkOut(userId || 'usr-carlos');
  res.json({ success: true, data: result });
});

// Production
app.get('/api/production/lines', async (req, res) => {
  const lines = await productionService.getLines();
  res.json({ success: true, data: lines });
});

app.get('/api/production/orders', async (req, res) => {
  const orders = await productionService.getOrders();
  res.json({ success: true, data: orders });
});

app.get('/api/production/records', async (req, res) => {
  const userId = req.query.userId as string | undefined;
  const records = await productionService.getRecentRecords(userId);
  res.json({ success: true, data: records });
});

app.post('/api/production/log', async (req, res) => {
  const { orderId, lineCode, userId, userName, units, hourSlot } = req.body;
  const result = await productionService.logProduction({
    orderId: orderId || 'ORD-2026-083',
    lineCode: lineCode || 'LINE-03',
    userId: userId || 'usr-carlos',
    userName: userName || 'Carlos López',
    units: Number(units) || 50,
    hourSlot: hourSlot || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  res.json({ success: true, data: result });
});

// Gamification
app.get('/api/gamification/achievements', async (req, res) => {
  const userId = (req.query.userId as string) || 'usr-carlos';
  const achievements = await gamificationService.getAchievements(userId);
  res.json({ success: true, data: achievements });
});

app.post('/api/gamification/unlock', async (req, res) => {
  const { userId, code } = req.body;
  const result = await gamificationService.unlockAchievement(userId || 'usr-carlos', code);
  res.json({ success: true, data: result });
});

app.get('/api/gamification/challenges', async (req, res) => {
  const challenges = await gamificationService.getChallenges();
  res.json({ success: true, data: challenges });
});

app.get('/api/gamification/leaderboard', async (req, res) => {
  const metric = (req.query.metric as 'xp' | 'quality' | 'punctuality') || 'xp';
  const leaderboard = await gamificationService.getLeaderboard(metric);
  res.json({ success: true, data: leaderboard });
});

// Inventory
app.get('/api/inventory/items', async (req, res) => {
  const items = await inventoryService.getItems();
  res.json({ success: true, data: items });
});

app.get('/api/inventory/low-stock', async (req, res) => {
  const low = await inventoryService.getLowStock();
  res.json({ success: true, data: low });
});

app.get('/api/inventory/movements', async (req, res) => {
  const movements = await inventoryService.getMovements();
  res.json({ success: true, data: movements });
});

app.post('/api/inventory/movement', async (req, res) => {
  const result = await inventoryService.recordMovement(req.body);
  res.json({ success: true, data: result });
});

// Quality
app.get('/api/quality/inspections', async (req, res) => {
  const inspections = await qualityService.getInspections();
  res.json({ success: true, data: inspections });
});

app.get('/api/quality/defects-pareto', async (req, res) => {
  const pareto = await qualityService.getDefectPareto();
  res.json({ success: true, data: pareto });
});

app.post('/api/quality/inspect', async (req, res) => {
  const result = await qualityService.logInspection(req.body);
  res.json({ success: true, data: result });
});

// Maintenance
app.get('/api/maintenance/machines', async (req, res) => {
  const machines = await maintenanceService.getMachines();
  res.json({ success: true, data: machines });
});

app.get('/api/maintenance/tickets', async (req, res) => {
  const tickets = await maintenanceService.getTickets();
  res.json({ success: true, data: tickets });
});

app.post('/api/maintenance/tickets', async (req, res) => {
  const ticket = await maintenanceService.createTicket(req.body);
  res.json({ success: true, data: ticket });
});

app.post('/api/maintenance/tickets/resolve', async (req, res) => {
  const { ticketId, technicianName } = req.body;
  const ticket = await maintenanceService.resolveTicket(ticketId, technicianName || 'Roberto Valdés');
  res.json({ success: true, data: ticket });
});

// Social & Notifications
app.get('/api/social/recognitions', async (req, res) => {
  const recognitions = await socialService.getRecognitions();
  res.json({ success: true, data: recognitions });
});

app.post('/api/social/recognitions', async (req, res) => {
  const rec = await socialService.createRecognition(req.body);
  res.json({ success: true, data: rec });
});

app.post('/api/social/recognitions/:id/react', async (req, res) => {
  const { id } = req.params;
  const { emoji, userId } = req.body;
  const rec = await socialService.reactToRecognition(id, emoji, userId || 'usr-carlos');
  res.json({ success: true, data: rec });
});

app.get('/api/social/notifications', async (req, res) => {
  const userId = req.query.userId as string | undefined;
  const notifs = await socialService.getNotifications(userId);
  res.json({ success: true, data: notifs });
});

app.post('/api/social/notifications/:id/read', async (req, res) => {
  const { id } = req.params;
  await socialService.markNotificationRead(id);
  res.json({ success: true });
});

app.post('/api/social/notifications/read-all', async (req, res) => {
  const { userId } = req.body;
  await socialService.markAllNotificationsRead(userId);
  res.json({ success: true });
});

// Reports
app.get('/api/reports/kpis', async (req, res) => {
  const kpis = await reportService.getExecutiveKpis();
  res.json({ success: true, data: kpis });
});

// AI Plant Assistant
app.post('/api/ai/chat', async (req, res) => {
  const { prompt } = req.body;
  const reply = await aiAssistantService.askPlantAssistant(prompt || '¿Cómo estuvo la producción hoy?');
  res.json({ success: true, data: reply });
});

// Vite Middleware for SPA Frontend
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 MAQUILA HUB Server running on http://localhost:${PORT} [Provider: ${process.env.DATA_PROVIDER || 'mock'}]`);
  });
}

start();
