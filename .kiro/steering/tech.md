# Technology Stack

## Frontend Stack
- **React 18.2+**: Main UI framework
- **Material-UI (@mui/material)**: Component library for consistent design
- **Axios**: HTTP client for API communication
- **Create React App**: Build tooling and development server
- **Emotion**: CSS-in-JS styling solution

## Backend Stack
- **Spring Boot 3.1+**: Java web framework
- **Java 17**: Programming language version
- **Spring Data JPA**: Database abstraction layer
- **Spring Web**: RESTful web services
- **Maven**: Build and dependency management

## Database Options
- **PostgreSQL**: Primary database (Supabase integration)
- **MySQL**: Alternative database option
- **Supabase**: Backend-as-a-Service platform

## Development Tools
- **Docker**: Containerization for both frontend and backend
- **Docker Compose**: Multi-container orchestration
- **Maven Wrapper**: Consistent Maven builds across environments
- **npm/Node.js**: Frontend package management

## Common Commands

### Frontend (React)
```bash
cd client
npm install          # Install dependencies
npm start            # Start development server (port 3000)
npm run build        # Create production build
npm test             # Run tests
```

### Backend (Spring Boot)
```bash
cd server
./mvnw spring-boot:run    # Start development server (port 8080)
./mvnw clean install     # Build and run tests
./mvnw test              # Run tests only
```

### Docker Operations
```bash
docker-compose up --build    # Build and start all services
docker-compose down          # Stop all services
docker build -t app-name .   # Build individual container
```

### Database Setup
```bash
node setup-database.js      # Initialize database schema
```

## Port Conventions
- Frontend: 3000 (React dev server)
- Backend: 8080 (Spring Boot)
- Database: 5432 (PostgreSQL) / 3306 (MySQL)