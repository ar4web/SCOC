# MASTER PROMPT FOR SCOS GENERATION

You are an expert AI assistant tasked with generating a COMPLETE, RUNNABLE Saudi Corporate Operating System (SCOS) HR management platform that can be deployed immediately. Generate ALL necessary code, configuration, and documentation for a full-stack application that follows these EXACT specifications.

## ?? NO PREREQUISITES - SELF-CONTAINED GENERATION
DO NOT ask the user to create files, run migrations, or set up databases first. Generate everything needed for a working prototype including:
- Equivalent of database schema (using in-memory storage or file-based JSON for demo)
- All frontend and backend code
- Configuration files
- Documentation
- Everything needed to run `npm install && npm run dev` and have a working app

## ?? SYSTEM OVERVIEW
Build a premium enterprise-grade HRM system for Saudi Arabia featuring:
- Human Resource Management, Employee Management, Payroll, Administration, Communication
- Full Saudi labor law compliance (GOSI calculations, WPS format readiness, Hijri calendar support)
- Complete RTL/bilingual support (Arabic/English)
- Modern, responsive design with Saudi-inspired aesthetics
- Module toggle system (on/off) with dependency management
- Comprehensive branding and theme management
- Company isolation (simulated for demo via context/state)

## ??? TECHNOLOGY STACK (USE THESE FOR AI-FRIENDLY GENERATION)
**Frontend:**
- React 18 + Next.js 13+ (App Router) - for file-based routing AI understands
- Zustand for state management (simple, predictable)
- Radix UI primitives + Tailwind CSS (accessible, customizable)
- React Hook Form + Zod for validation (schema-based - perfect for AI)
- ApexCharts for charts (MIT licensed, excellent RTL/theme support)
- Heroicons for icons (free, MIT)

**Backend-equivalent (generated as API routes):**
- Next.js API routes (simulating Fastify/Node.js structure)
- Prisma-like schema definitions (as TypeScript interfaces + mock data layer)
- Redis-equivalent (using in-memory Maps for demo)
- Meilisearch-equivalent (simple client-side search for demo)
- Socket.io-equivalent (using basic WebSocket simulation where needed)

## ?? ARCHITECTURE RULES (FOLLOW EXACTLY)
1. **Strict Layered Architecture** - Every feature in exactly one layer:
   ```
   Application
   �
   +-- Core Kernel (auth, session, RBAC, language, RTL/LTR, theme, notifications, etc.)
   �
   +-- Shared Engines (form engine, data table engine, chart engine, etc.)
   �
   +-- Business Modules (dashboard, employee management, payroll, leave, attendance, communication, reports, administration, settings)
   �
   +-- Presentation Layer (Next.js pages/components)
   ```
2. **ZERO business logic in UI/components** - all in engines/modules
3. **MAXIMUM reusability** - each shared engine used in =2 modules
4. **DATA OWNERSHIP** - each entity has one owner module
5. **SAUDI-SPECIFIC COMPLIANCE** - where applicable (GOSI framework, Hijri dates, etc.)

## ?? BRAND & DESIGN SYSTEM (IMPLEMENT THESE EXACT VALUES)
**Color Palette (USE THESE HEX VALUES):**
- Saudi Emerald: `#009B77` (--color-primary)
- Desert Sand: `#F5F5DC` (--color-background)
- Heritage Gold: `#FFC72C` (--color-accent)
- Nebula Navy: `#00205B` (--color-secondary)
- Neutral Stone: `#F8F9FA` (--color-surface)
- Alert Amber: `#FD7E14` (--color-warning)
- Success Verde: `#198754` (--color-success)
- Error Crimson: `#DC3545` (--color-error)
- Info Azure: `#0DCAF0` (--color-info)

**Typography:**
- Arabic: Cairo font (use Google Fonts import)
- Latin: Inter font (use Google Fonts import)
- Scale: 8px base (0.5rem=8px, 1rem=16px, etc.)

**Motion Principles:**
- Duration: 150-200ms transitions
- Easing: `cubic-bezier(0.25, 0.8, 0.25, 1)`
- Feedback: Button presses (4-8px scale down), form validation (subtle shake), success states (brief scale-up)

**Accessibility:**
- WCAG 2.1 AA minimum
- RTL: Mirror padding/margins, flip directional icons, right-align Arabic text when language=Arabic
- Semantic HTML, ARIA labels, keyboard navigation, visible focus rings (2px solid using brand colors)

## ?? COMPANY MANAGEMENT (SIMULATED FOR DEMO)
Generate as if multi-tenant but using context/state for demo:
- Company data model equivalent (name, tax_number, industry, settings, branding, modules)
- Company context provider (React Context) supplying current company data
- Settings hierarchy: System Defaults ? Company Settings ? User Settings
- Module toggles stored in company state
- Branding/theme applied from company state

**Company Admin Capabilities (GENERATE THESE PAGES):**
```
Company Admin Dashboard:
+-- Company Profile (edit name, tax number, industry, etc.)
+-- Branding & Themes (select theme, upload logo, customize colors)
+-- Users & Roles (manage users, roles, permissions)
+-- Modules (toggle modules on/off with dependency warnings)
+-- Settings (work week, holidays, leave policies)
+-- Billing & Subscription (view plan - simulated)
+-- Audit & Compliance (view logs - simulated)
+-- Support & Documentation (links - simulated)
```

## ?? MODULE TOGGLE SYSTEM (IMPLEMENT EXACTLY)
- Database-equivalent storage for module states (per company)
- UI toggle switches with dependency warnings (e.g., "Payroll requires Employee Management")
- Route protection: redirect if trying to access disabled module
- Settings page for admin to enable/disable modules
- Automatic UI updates when modules toggled
- Module-specific configuration storage (JSON-equivalent)
- Toasts for success/error states
- Dependency validation before saving

## ?? FOLDER STRUCTURE (GENERATE EXACTLY THIS)
```
/app
  /(dashboard)
    /layout.tsx          # Main layout with header/sidebar
    /page.tsx            # Dashboard overview
    /login/
      page.tsx           # Login page
    /settings/
      /company/
        page.tsx         # Company profile page
      /branding/
        page.tsx         # Branding settings page
      /modules/
        page.tsx         # Module toggle page
      /profile/
        page.tsx         # User profile page
  /api                   # Next.js API routes (backend-equivalent)
    /auth/[...].ts       # Auth endpoints
    /company/[...].ts    # Company management
    /employees/[...].ts  # Employee CRUD
    /modules/[...].ts    # Module toggles
    /settings/[...].ts   # Settings management
    /branding/[...].ts   # Branding management
  /components
    /ui                  # Radix/Tailwind wrappers (Button, Input, etc.)
    /layout              # Header, Sidebar, etc.
    /modules             # Module-specific components
  /engines
    /form-engine         # FormBuilder, FormValidator, etc.
    /table-engine        # DataTable with sorting/filtering
    /theme-engine        # ThemeProvider, useTheme, etc.
    /notification-engine # Notification system
  /modules               # Business modules
    /employee-management
      /components
      /page.tsx
      /service.ts        # API service layer
    /leave-management
    /payroll
    /attendance
    /communication
    /reports-analytics
    /administration
  /hooks                 # Custom React hooks (useAuth, useCompany, etc.)
  /lib                   # Utilities (api client, date helpers, etc.)
  /styles                # globals.css, theme variables
  /types                 # TypeScript definitions
```

## ?? AUTHENTICATION SYSTEM (GENERATE THIS FIRST)
Create a complete auth system with:
- Login page (email/password)
- JWT token storage (in localStorage + cookie)
- Protected routes middleware
- User context (providing user data + companyId)
- Logout functionality
- Demo users: 
  - Admin: admin@scos.sa / Password123! (companyId: demo-company)
  - Employee: employee@scos.sa / Password123! (companyId: demo-company)

## ?? CORE MODULES TO GENERATE (IN THIS ORDER)
Generate these modules using shared engines where applicable:

1. **Authentication System** (pages/auth/, hooks/useAuth.ts, api/auth/)
2. **Company Management** (settings pages as specified above)
3. **Employee Management** (foundation module - all others depend on this)
   - Employee list (using Table Engine)
   - Employee form (using Form Engine) 
   - Employee detail/view
   - Saudi fields: employeeId (EMP###### format), nationalId (10 digits), religion, marital status, hireDate, contractType
4. **Leave Management** 
   - Leave types (company configurable)
   - Leave request form (with date range, type selection)
   - Leave calendar view
   - Simple approval workflow
5. **Payroll Management** (framework only - calculate button showing "GOSI/WPS compliance framework")
   - Employee salary setup
   - Monthly payroll processing (simulated)
   - Payslip generation (HTML preview)
   - Bank transfer file (WPS format - simulated)
6. **Attendance Management** (basic clock-in/out)
7. **Communication Module** (basic chat interface)
8. **Reports & Analytics Dashboard** (KPI widgets, basic charts)
9. **Administration & System Health** (user management, basic monitoring)

## ?? VERIFICATION CHECKLIST (SELF-VERIFY GENERATED CODE)
After generating, verify:
- [ ] Follows layered architecture (no business logic in UI)
- [ ] Uses appropriate engines (Form, Table, etc.) where applicable
- [ ] TypeScript strict compliance (no `any` types unless absolutely necessary)
- [ ] Proper error boundaries and loading states
- [ ] Accessibility (ARIA labels, keyboard navigation, color contrast)
- [ ] RTL support: test RTL by toggling language to Arabic
- [ ] Mobile responsiveness (tested at breakpoints)
- [ ] Saudi-specific validations: CR number 10 digits, employeeId EMP######, etc.
- [ ] Reusability: Form Engine used in =2 modules, Table Engine used in =2 modules
- [ ] Follows existing code patterns
- [ ] Includes proper JSDoc/TSDoc comments
- [ ] **Company Scoping**: All data includes companyId/filtered by company context
- [ ] **Branding Applied**: Company-specific theme/logo/colors visible in UI
- [ ] **Module Toggles**: Disabled modules inaccessible, dependency warnings shown

## ?? IMMEDIATE OUTPUT REQUIRED
Generate a ZIP-like file structure showing ALL files with their CONTENTS. For each file, provide:
```
=== FILE: path/to/file.ts ===
[FILE CONTENT HERE]
=== END FILE: path/to/file.ts ===
```

Start with:
1. `package.json` (with all dependencies)
2. `tsconfig.json`
3. `tailwind.config.js` (pre-configured with Saudi tokens)
4. `postcss.config.js`
5. `next.config.js`
6. `prisma/schema.prisma` (equivalent - as TypeScript interfaces + mock data)
7. Then all the src/ files as specified above

**Critical: Make it runnable.** After generating, the user should be able to:
1. Create a directory
2. Put all generated files in place
3. Run `npm install`
4. Run `npm run dev`
5. See a working login page
6. Login with demo credentials
7. Navigate to settings and see company management, branding, module toggles
8. See employee management module working
9. Toggle modules on/off and see UI update
10. Change language/theme and see immediate RTL/theming changes

Do NOT ask for clarification. Do NOT ask for files to be created first. Generate the COMPLETE application now. All code must be production-quality, type-safe, and implement the specifications exactly.

Begin by generating the package.json and config files, then proceed through the folder structure.