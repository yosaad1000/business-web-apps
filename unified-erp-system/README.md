# Unified ERP System

A comprehensive Enterprise Resource Planning system that integrates multiple business modules:

- **HRMS (Human Resource Management System)** - Employee management and HR operations
- **Invoice Management** - Financial invoice processing and approval workflows
- **Training Platform** - Quiz-based employee training and certification
- **Recruitment System** - Job board and candidate management
- **General CRUD Operations** - Administrative data management

## Architecture

- **Frontend**: React 18.2+ with Material-UI
- **Backend**: Spring Boot 3.1+ microservices architecture
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth with role-based access control
- **Deployment**: Docker containerization

## Quick Start

```bash
# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# API Gateway: http://localhost:8080
```

## Project Structure

```
unified-erp-system/
├── client/                 # React frontend application
├── gateway/               # Spring Boot API Gateway
├── services/              # Microservices
│   ├── employee/         # HRMS service
│   ├── invoice/          # Invoice management service
│   ├── quiz/             # Training platform service
│   ├── job/              # Recruitment service
│   └── crud/             # General CRUD service
├── shared/               # Shared configurations and utilities
├── docker-compose.yml    # Container orchestration
├── .env                  # Environment configuration
└── package.json          # Root package management
```

## Development

See individual service README files for specific development instructions.