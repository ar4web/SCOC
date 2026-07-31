import {
  User,
  Company,
  Employee,
  LeaveRequest,
  ModuleDefinition,
  Notification,
} from '@/types';
import { generateId, formatEmployeeId } from './utils';

const demoCompany: Company = {
  id: 'demo-company',
  name: 'Saudi Corporation',
  nameAr: 'الشركة السعودية',
  taxNumber: '3101234567',
  industry: 'Technology',
  employeeCount: 0,
  establishedDate: '2020-01-01',
  settings: {
    workWeek: { startDay: 0, endDay: 4, hoursPerDay: 8, daysPerWeek: 5 },
    weekendDays: [5, 6],
    holidays: [
      { id: 'h1', name: 'Saudi National Day', nameAr: 'اليوم الوطني السعودي', date: '2024-09-23', isRecurring: true },
      { id: 'h2', name: 'Eid Al-Fitr', nameAr: 'عيد الفطر', date: '2024-04-10', isRecurring: false },
      { id: 'h3', name: 'Eid Al-Adha', nameAr: 'عيد الأضحى', date: '2024-06-16', isRecurring: false },
      { id: 'h4', name: 'Saudi Founding Day', nameAr: 'يوم التأسيس السعودي', date: '2024-02-22', isRecurring: true },
      { id: 'h5', name: 'National Flag Day', nameAr: 'يوم العلم', date: '2024-03-11', isRecurring: true },
    ],
    leavePolicies: [
      { type: 'annual', daysPerYear: 30, carryoverDays: 15, requiresApproval: true, paid: true },
      { type: 'sick', daysPerYear: 30, carryoverDays: 0, requiresApproval: true, paid: true },
      { type: 'personal', daysPerYear: 10, carryoverDays: 0, requiresApproval: true, paid: true },
      { type: 'emergency', daysPerYear: 5, carryoverDays: 0, requiresApproval: false, paid: true },
      { type: 'maternity', daysPerYear: 98, carryoverDays: 0, requiresApproval: false, paid: true },
      { type: 'paternity', daysPerYear: 3, carryoverDays: 0, requiresApproval: false, paid: true },
      { type: 'hajj', daysPerYear: 10, carryoverDays: 0, requiresApproval: true, paid: true },
      { type: 'unpaid', daysPerYear: 30, carryoverDays: 0, requiresApproval: true, paid: false },
    ],
    workingHours: { start: '09:00', end: '18:00' },
    overtimeRate: 1.5,
    gosiEnabled: true,
    wpsEnabled: true,
  },
  branding: {
    primaryColor: '#009B77',
    secondaryColor: '#00205B',
    accentColor: '#FFC72C',
    theme: 'light',
  },
  moduleStates: {
    'employee-management': true,
    'leave-management': true,
    'payroll': true,
    'attendance': true,
    'communication': true,
    'reports': true,
    'administration': true,
  },
  createdAt: '2020-01-01',
  updatedAt: '2024-01-01',
};

const demoAdmin: User = {
  id: 'user-1',
  email: 'admin@scos.sa',
  name: 'Admin User',
  nameAr: 'المدير',
  role: 'admin',
  companyId: 'demo-company',
  language: 'en',
};

const demoEmployee: User = {
  id: 'user-2',
  email: 'employee@scos.sa',
  name: 'Employee User',
  nameAr: 'موظف',
  role: 'employee',
  companyId: 'demo-company',
  language: 'en',
};

export let users: Map<string, User & { password: string }> = new Map([
  ['user-1', { ...demoAdmin, password: 'Password123!' }],
  ['user-2', { ...demoEmployee, password: 'Password123!' }],
]);

export let companies: Map<string, Company> = new Map([
  ['demo-company', demoCompany],
]);

export let employees: Map<string, Employee> = new Map();
let employeeCounter = 0;

export let leaves: Map<string, LeaveRequest> = new Map();

export let notifications: Map<string, Notification> = new Map();

export const moduleDefinitions: ModuleDefinition[] = [
  {
    id: 'employee-management',
    name: 'Employee Management',
    nameAr: 'إدارة الموظفين',
    description: 'Manage employee records, contracts, and documents',
    descriptionAr: 'إدارة سجلات الموظفين والعقود والمستندات',
    icon: 'Users',
    dependencies: [],
    enabled: true,
    route: '/employees',
  },
  {
    id: 'leave-management',
    name: 'Leave Management',
    nameAr: 'إدارة الإجازات',
    description: 'Manage leave requests, approvals, and calendar',
    descriptionAr: 'إدارة طلبات الإجازات والموافقات والتقويم',
    icon: 'Calendar',
    dependencies: ['employee-management'],
    enabled: true,
    route: '/leaves',
  },
  {
    id: 'payroll',
    name: 'Payroll',
    nameAr: 'الرواتب',
    description: 'Process payroll, GOSI contributions, and WPS files',
    descriptionAr: 'معالجة الرواتب واشتراكات التأمينات الاجتماعية وملفات WPS',
    icon: 'DollarSign',
    dependencies: ['employee-management'],
    enabled: true,
    route: '/payroll',
  },
  {
    id: 'attendance',
    name: 'Attendance',
    nameAr: 'الحضور والانصراف',
    description: 'Track employee attendance and working hours',
    descriptionAr: 'تتبع حضور وانصراف الموظفين وساعات العمل',
    icon: 'Clock',
    dependencies: ['employee-management'],
    enabled: true,
    route: '/attendance',
  },
  {
    id: 'communication',
    name: 'Communication',
    nameAr: 'التواصل',
    description: 'Internal messaging and announcements',
    descriptionAr: 'الرسائل الداخلية والإعلانات',
    icon: 'MessageSquare',
    dependencies: [],
    enabled: true,
    route: '/communication',
  },
  {
    id: 'reports',
    name: 'Reports & Analytics',
    nameAr: 'التقارير والتحليلات',
    description: 'HR analytics and report generation',
    descriptionAr: 'تحليلات الموارد البشرية وإعداد التقارير',
    icon: 'BarChart',
    dependencies: ['employee-management', 'leave-management'],
    enabled: true,
    route: '/reports',
  },
  {
    id: 'administration',
    name: 'Administration',
    nameAr: 'الإدارة',
    description: 'User management, roles, and system settings',
    descriptionAr: 'إدارة المستخدمين والأدوار وإعدادات النظام',
    icon: 'Settings',
    dependencies: [],
    enabled: true,
    route: '/administration',
  },
];

export function addEmployee(data: Omit<Employee, 'id' | 'employeeId' | 'createdAt' | 'updatedAt'>): Employee {
  employeeCounter++;
  const employee: Employee = {
    ...data,
    id: generateId(),
    employeeId: formatEmployeeId(employeeCounter),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  employees.set(employee.id, employee);
  const company = companies.get(data.companyId);
  if (company) {
    company.employeeCount = employees.size;
  }
  return employee;
}

export function addLeave(data: Omit<LeaveRequest, 'id' | 'createdAt' | 'updatedAt'>): LeaveRequest {
  const leave: LeaveRequest = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  leaves.set(leave.id, leave);
  return leave;
}

export function addNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Notification {
  const n: Notification = {
    ...notification,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  notifications.set(n.id, n);
  return n;
}

export function seedDemoData() {
  if (employees.size > 0) return;

  const departments = ['Engineering', 'Marketing', 'Finance', 'HR', 'Operations', 'Sales'];
  const positions = ['Manager', 'Senior Specialist', 'Specialist', 'Coordinator', 'Analyst', 'Associate'];

  const demoEmployees = [
    { fullName: 'Ahmed Al-Saud', fullNameAr: 'أحمد آل سعود', email: 'ahmed@scos.sa', phone: '+966501234561', nationalId: '1012345678', department: 'Engineering', position: 'Senior Manager', contractType: 'permanent' as const, basic: 25000, housing: 10000, transport: 3000 },
    { fullName: 'Sara Al-Qahtani', fullNameAr: 'سارة القحطاني', email: 'sara@scos.sa', phone: '+966501234562', nationalId: '1023456789', department: 'Marketing', position: 'Marketing Manager', contractType: 'permanent' as const, basic: 20000, housing: 8000, transport: 2500 },
    { fullName: 'Mohammed Al-Otaibi', fullNameAr: 'محمد العتيبي', email: 'mohammed@scos.sa', phone: '+966501234563', nationalId: '1034567890', department: 'Finance', position: 'Financial Analyst', contractType: 'fixed_term' as const, basic: 15000, housing: 6000, transport: 2000 },
    { fullName: 'Nora Al-Harbi', fullNameAr: 'نورة الحربي', email: 'nora@scos.sa', phone: '+966501234564', nationalId: '1045678901', department: 'HR', position: 'HR Specialist', contractType: 'permanent' as const, basic: 14000, housing: 5000, transport: 2000 },
    { fullName: 'Fahad Al-Dosari', fullNameAr: 'فهد الدوسري', email: 'fahad@scos.sa', phone: '+966501234565', nationalId: '1056789012', department: 'Operations', position: 'Operations Coordinator', contractType: 'probation' as const, basic: 10000, housing: 4000, transport: 1500 },
    { fullName: 'Lama Al-Shammari', fullNameAr: 'لمى الشمري', email: 'lama@scos.sa', phone: '+966501234566', nationalId: '1067890123', department: 'Sales', position: 'Sales Executive', contractType: 'permanent' as const, basic: 12000, housing: 5000, transport: 2000 },
    { fullName: 'Khalid Al-Ghamdi', fullNameAr: 'خالد الغامدي', email: 'khalid@scos.sa', phone: '+966501234567', nationalId: '1078901234', department: 'Engineering', position: 'Software Engineer', contractType: 'fixed_term' as const, basic: 18000, housing: 7000, transport: 2500 },
    { fullName: 'Hessa Al-Zahrani', fullNameAr: 'حصه الزهراني', email: 'hessa@scos.sa', phone: '+966501234568', nationalId: '1089012345', department: 'Marketing', position: 'Content Specialist', contractType: 'permanent' as const, basic: 11000, housing: 4000, transport: 1500 },
  ];

  for (const emp of demoEmployees) {
    addEmployee({
      companyId: 'demo-company',
      fullName: emp.fullName,
      fullNameAr: emp.fullNameAr,
      email: emp.email,
      phone: emp.phone,
      nationalId: emp.nationalId,
      nationality: 'Saudi',
      religion: 'muslim',
      gender: emp.fullName.includes('Sara') || emp.fullName.includes('Nora') || emp.fullName.includes('Lama') || emp.fullName.includes('Hessa') ? 'female' : 'male',
      maritalStatus: 'single',
      dateOfBirth: '1990-06-15',
      hireDate: '2022-01-01',
      contractType: emp.contractType,
      department: emp.department,
      position: emp.position,
      salary: {
        basic: emp.basic,
        housing: emp.housing,
        transportation: emp.transport,
        otherAllowances: 0,
        total: emp.basic + emp.housing + emp.transport,
        bankName: 'Al Rajhi Bank',
        bankAccount: 'SA0123456789001234567890',
        iban: 'SA0123456789001234567890',
      },
      address: { street: 'King Fahd Road', city: 'Riyadh', region: 'Riyadh', postalCode: '12345', country: 'Saudi Arabia' },
      emergencyContact: { name: 'Family Member', relation: 'Spouse', phone: '+966501234569' },
      status: 'active',
      documents: [],
    });
  }

  // Seed some leave requests
  const empEntries = Array.from(employees.values());
  if (empEntries.length >= 2) {
    addLeave({
      employeeId: empEntries[0].id,
      companyId: 'demo-company',
      type: 'annual',
      startDate: '2024-07-01',
      endDate: '2024-07-10',
      daysCount: 10,
      reason: 'Family vacation',
      status: 'approved',
      approvedBy: 'user-1',
      approvedAt: '2024-06-20',
      attachments: [],
    });
    addLeave({
      employeeId: empEntries[1].id,
      companyId: 'demo-company',
      type: 'sick',
      startDate: '2024-07-15',
      endDate: '2024-07-16',
      daysCount: 2,
      reason: 'Medical appointment',
      status: 'pending',
      attachments: [],
    });
  }

  // Seed sample notifications
  addNotification({ companyId: 'demo-company', userId: 'user-1', title: 'Welcome to SCOS', titleAr: 'مرحباً بك في SCOS', message: 'Your account has been created successfully.', messageAr: 'تم إنشاء حسابك بنجاح.', type: 'success', read: false, link: '/' });
  addNotification({ companyId: 'demo-company', userId: 'user-1', title: 'New Leave Request', titleAr: 'طلب إجازة جديد', message: 'Sara Al-Qahtani has submitted a sick leave request.', messageAr: 'قامت سارة القحطاني بتقديم طلب إجازة مرضية.', type: 'info', read: false, link: '/leaves' });
  addNotification({ companyId: 'demo-company', userId: 'user-1', title: 'Payroll Complete', titleAr: 'اكتمال معالجة الرواتب', message: 'July payroll has been processed successfully.', messageAr: 'تمت معالجة رواتب يوليو بنجاح.', type: 'success', read: false, link: '/payroll' });
}

// Seed data on module import
seedDemoData();
