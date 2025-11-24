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

## Setup

### Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
NEXT_PUBLIC_API_BASE_URL=https://your-dotnet-api.com
\`\`\`

### Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`

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
- `GET /api/dashboard` - Dashboard statistics and charts
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

## License

MIT
