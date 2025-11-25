# CRM API - .NET 8 Core Backend

Enterprise-grade CRM Web API built with .NET 8, Entity Framework Core, and JWT authentication.

## Features

- **JWT Authentication** - Secure token-based authentication
- **Entity Framework Core** - Code-first database with SQL Server
- **Repository Pattern** - Clean architecture with service layer
- **Role-Based Access Control** - Admin, Manager, Sales roles
- **Swagger Documentation** - Interactive API documentation
- **CORS Support** - Configured for React frontend

## Project Structure

\`\`\`
dotnet-backend/
├── Controllers/          # API Controllers
├── Services/            # Business logic layer
├── Models/              # Entity models
├── DTOs/                # Data transfer objects
├── Data/                # Database context
├── Program.cs           # Application entry point
├── appsettings.json     # Configuration
└── CrmApi.csproj        # Project file
\`\`\`

## Prerequisites

- .NET 8 SDK
- SQL Server (LocalDB or full instance)
- Visual Studio 2022 or VS Code

## Getting Started

### 1. Clone and Navigate

\`\`\`bash
cd dotnet-backend
\`\`\`

### 2. Update Connection String

Edit `appsettings.json` and update the connection string:

\`\`\`json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=CrmDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
\`\`\`

### 3. Install Dependencies

\`\`\`bash
dotnet restore
\`\`\`

### 4. Create Database

\`\`\`bash
dotnet ef migrations add InitialCreate
dotnet ef database update
\`\`\`

### 5. Run the API

\`\`\`bash
dotnet run
\`\`\`

The API will start at `https://localhost:7000` (or `http://localhost:5000`)

### 6. Access Swagger

Open your browser and navigate to:
\`\`\`
https://localhost:7000/swagger
\`\`\`

## Default Users

The database is seeded with three test accounts:

| Email              | Password    | Role    |
|--------------------|-------------|---------|
| admin@crm.com      | admin123    | Admin   |
| manager@crm.com    | manager123  | Manager |
| sales@crm.com      | sales123    | Sales   |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Contacts
- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/{id}` - Get contact by ID
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/{id}` - Update contact
- `DELETE /api/contacts/{id}` - Delete contact

### Leads
- `GET /api/leads` - Get all leads
- `GET /api/leads/{id}` - Get lead by ID
- `POST /api/leads` - Create lead
- `PUT /api/leads/{id}` - Update lead
- `DELETE /api/leads/{id}` - Delete lead

### Opportunities
- `GET /api/opportunities` - Get all opportunities
- `GET /api/opportunities/{id}` - Get opportunity by ID
- `POST /api/opportunities` - Create opportunity
- `PUT /api/opportunities/{id}` - Update opportunity
- `DELETE /api/opportunities/{id}` - Delete opportunity

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/sales-data` - Get sales chart data
- `GET /api/dashboard/recent-activities` - Get recent activities

### Reports
- `GET /api/reports/sales?startDate=&endDate=` - Sales report
- `GET /api/reports/leads?startDate=&endDate=` - Leads report
- `GET /api/reports/activities?startDate=&endDate=` - Activities report

## Authentication

All endpoints except `/api/auth/login` require a valid JWT token.

### How to Authenticate:

1. **Login** to get a token:
\`\`\`bash
curl -X POST https://localhost:7000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crm.com","password":"admin123"}'
\`\`\`

2. **Use the token** in subsequent requests:
\`\`\`bash
curl -X GET https://localhost:7000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
\`\`\`

## Configuration

### JWT Settings (appsettings.json)

\`\`\`json
"JwtSettings": {
  "Secret": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
  "Issuer": "CrmApi",
  "Audience": "CrmClient",
  "ExpirationInHours": 24
}
\`\`\`

### CORS Settings

\`\`\`json
"Cors": {
  "AllowedOrigins": [
    "http://localhost:3000",
    "http://localhost:5173"
  ]
}
\`\`\`

## Entity Framework Commands

\`\`\`bash
# Create a new migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Remove last migration
dotnet ef migrations remove

# Drop database
dotnet ef database drop
\`\`\`

## Development Tips

1. **Hot Reload**: Use `dotnet watch run` for automatic recompilation
2. **Debug**: Set breakpoints in Visual Studio or VS Code
3. **Logging**: Check console output for request logs
4. **Database**: Use SQL Server Management Studio or Azure Data Studio to view data

## Connecting to React Frontend

Update the React frontend `.env` file:

\`\`\`env
VITE_API_BASE_URL=https://localhost:7000/api
\`\`\`

The backend is already configured with CORS to allow requests from `localhost:3000` and `localhost:5173`.

## Production Deployment

1. Update `appsettings.Production.json` with production database
2. Change JWT secret to a secure value
3. Update CORS allowed origins
4. Publish the application:

\`\`\`bash
dotnet publish -c Release -o ./publish
\`\`\`

## Troubleshooting

### Database Connection Issues
- Verify SQL Server is running
- Check connection string
- Ensure database exists

### CORS Errors
- Add frontend URL to `appsettings.json` CORS settings
- Restart the API after changes

### Authentication Errors
- Verify JWT secret is at least 32 characters
- Check token expiration time
- Ensure Authorization header format: `Bearer <token>`

## License

MIT License - See LICENSE file for details
