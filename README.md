# Enterprise CRM Application

A comprehensive Customer Relationship Management system built with Next.js 16 and designed to connect to a .NET 8 backend API.

## Features

### Core Modules
- **Dashboard** - KPI metrics, sales charts, activity feeds, and pipeline visualization
- **Contacts** - Complete contact management with tags, notes, and company associations
- **Leads** - Lead tracking with scoring, status management, and source attribution
- **Opportunities** - Deal pipeline with table and Kanban views, weighted forecasting
- **Tasks** - Task management with priorities, due dates, and entity relationships
- **Reports** - Sales performance, lead funnel, and team activity analytics

### Technical Features
- JWT-based authentication with role-based access control (RBAC)
- Permission-based UI rendering and API protection
- Responsive design with dark theme
- Sortable and filterable data tables
- Form validation with React Hook Form and Zod
- Real-time data updates
- Export functionality for reports
- **Mock Data Mode** - Complete in-memory database for testing without backend

## Setup

### Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
NEXT_PUBLIC_API_BASE_URL=https://your-dotnet-api.com

# Optional: Force mock data even when API URL is set
NEXT_PUBLIC_USE_MOCK_DATA=true
\`\`\`

**Note**: If `NEXT_PUBLIC_API_BASE_URL` is not set, the app automatically uses mock data mode.

### Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`

## Mock Data Mode

The application includes a complete mock data system for testing and development without requiring a backend API. This is perfect for frontend development, demos, and testing.

### Demo Credentials

Use these credentials to log in and explore different permission levels:

| Role | Username | Password | Permissions |
|------|----------|----------|-------------|
| **Admin** | `admin` | `admin123` | Full access to all modules (create, read, update, delete) |
| **Manager** | `manager` | `manager123` | Most operations except delete |
| **Sales Rep** | `sales` | `sales123` | Limited to sales operations (no delete, no reports) |

### What's Included

The mock database contains realistic sample data:

- **5 Contacts** - Including TechCorp Solutions, Innovate Labs, Startup Inc, MegaCorp International
- **5 Leads** - In various stages (New, Contacted, Qualified, Converted, Lost)
- **6 Opportunities** - Across all pipeline stages with values from $25k to $500k
- **6 Tasks** - With different priorities and statuses
- **Dashboard Metrics** - Revenue: $895k, Conversion Rate: 34.2%, Avg Deal Size: $133.5k
- **Activity Feed** - Recent CRM activities across all modules
- **Chart Data** - 6 months of sales trends and lead source analytics

### Mock Features

All CRUD operations work in mock mode:
- ✅ Create new records (persists during session)
- ✅ Update existing records
- ✅ Delete records
- ✅ Real-time dashboard updates
- ✅ Form validation
- ✅ Permission checks based on user role

**Note**: Mock data resets when you refresh the page.

## Backend API Requirements

Your .NET 8 backend should implement the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Contacts
- `GET /api/contacts` - List all contacts
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Leads
- `GET /api/leads` - List all leads
- `POST /api/leads` - Create lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Opportunities
- `GET /api/opportunities` - List all opportunities
- `POST /api/opportunities` - Create opportunity
- `PUT /api/opportunities/:id` - Update opportunity
- `PATCH /api/opportunities/:id` - Partial update (stage changes)
- `DELETE /api/opportunities/:id` - Delete opportunity

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Dashboard & Reports
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/activities` - Recent activity feed
- `GET /api/dashboard/sales-chart` - Sales trend data
- `GET /api/dashboard/leads-by-source` - Lead source breakdown
- `GET /api/reports?range=monthly` - Report data by time range

## Architecture

### Frontend Stack
- **Framework**: Next.js 16 with App Router
- **UI Library**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Date Handling**: date-fns
- **HTTP Client**: Native Fetch API with custom wrapper

### Project Structure
\`\`\`
app/
├── (app)/              # Protected application routes
│   ├── dashboard/
│   ├── contacts/
│   ├── leads/
│   ├── opportunities/
│   ├── tasks/
│   └── reports/
├── login/              # Public auth page
└── layout.tsx          # Root layout with auth provider

components/
├── auth/               # Authentication components
├── layout/             # Sidebar and header
├── contacts/           # Contact module components
├── leads/              # Lead module components
├── opportunities/      # Opportunity module components
├── tasks/              # Task module components
├── reports/            # Report charts and tables
└── ui/                 # shadcn/ui components

lib/
├── auth/               # Auth context and provider
├── api/                # API client
├── mock-data/          # Mock database and API
│   ├── mock-database.ts   # Sample data
│   └── mock-api.ts        # API implementation
└── utils.ts            # Utility functions

types/
├── auth.ts
├── contacts.ts
├── leads.ts
├── opportunities.ts
└── tasks.ts
\`\`\`

## User Permissions

The system supports role-based permissions:
- `dashboard.view`
- `contacts.view`, `contacts.create`, `contacts.update`, `contacts.delete`
- `leads.view`, `leads.create`, `leads.update`, `leads.delete`
- `opportunities.view`, `opportunities.create`, `opportunities.update`, `opportunities.delete`
- `tasks.view`, `tasks.create`, `tasks.update`, `tasks.delete`
- `reports.view`

## Deployment

This application can be deployed to Vercel:

\`\`\`bash
vercel deploy
\`\`\`

Ensure your backend API is accessible and CORS is configured to allow requests from your frontend domain.

**For demo deployments**: You can deploy with mock data mode by not setting `NEXT_PUBLIC_API_BASE_URL` or setting `NEXT_PUBLIC_USE_MOCK_DATA=true` in your Vercel environment variables.

## License

MIT
