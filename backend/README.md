# Backend MVC Architecture

This backend has been restructured following the Model-View-Controller (MVC) architectural pattern for better organization, maintainability, and scalability.

## Directory Structure

```
backend/
├── config/                 # Configuration files
│   ├── database.js        # Database connection configuration
│   └── constants.js       # Application constants and environment variables
├── controllers/           # Controllers (handle HTTP requests/responses)
│   ├── authController.js
│   ├── graduationController.js
│   ├── identityController.js
│   └── internshipController.js
├── middleware/            # Custom middleware
│   └── auth.js           # Authentication middleware
├── models/               # Data models (MongoDB schemas)
│   └── collections/      # Database collection models
├── routes/               # Route definitions
│   ├── authRoutes.js
│   ├── graduationRoutes.js
│   ├── identityRoutes.js
│   ├── internshipRoutes.js
│   └── index.js          # Main routes aggregator
├── services/             # Business logic layer
│   ├── authService.js
│   ├── graduationService.js
│   ├── identityService.js
│   └── internshipService.js
├── utils/                # Utility functions
│   └── seedData.js       # Database seeding utilities
├── data/                 # JSON data files for seeding
├── app.js                # Express app configuration
└── index.js              # Application entry point
```

## API Endpoints

All API endpoints are now prefixed with `/api`:

### Authentication
- `POST /api/auth/login` - Admin login

### Graduation Records
- `GET /api/graduation` - Get all graduation records
- `GET /api/graduation/:id` - Get graduation record by ID
- `POST /api/graduation` - Create new graduation record (requires auth)
- `PUT /api/graduation/:id` - Update graduation record (requires auth)
- `DELETE /api/graduation/:id` - Delete graduation record (requires auth)

### Internships
- `GET /api/internships` - Get all internship records

### Identity
- `GET /api/identity` - Get all identity records

## Architecture Benefits

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Maintainability**: Code is organized logically and easy to modify
3. **Scalability**: Easy to add new features without affecting existing code
4. **Testability**: Each layer can be tested independently
5. **Reusability**: Services can be reused across different controllers

## Layer Responsibilities

- **Models**: Define data structure and database operations
- **Services**: Contain business logic and data processing
- **Controllers**: Handle HTTP requests and responses
- **Routes**: Define API endpoints and middleware
- **Middleware**: Handle cross-cutting concerns like authentication
- **Config**: Application configuration and constants
- **Utils**: Helper functions and utilities
