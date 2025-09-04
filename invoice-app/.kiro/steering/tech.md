# Technology Stack

## Frontend
- **React 18.2.0** - Main UI framework
- **Material-UI (MUI) 5.13.6** - Component library for consistent design
- **Axios 1.4.0** - HTTP client for API communication
- **Create React App** - Build tooling and development server

## Backend
- **Spring Boot 3.1.2** - Java application framework
- **Java 17** - Programming language version
- **Spring Data JPA** - Database abstraction layer
- **MySQL** - Primary database
- **Maven** - Build and dependency management

## Common Commands

### Frontend (client directory)
```bash
npm install          # Install dependencies
npm start           # Start development server (port 3000)
npm run build       # Create production build
npm test            # Run tests
```

### Backend (server directory)
```bash
mvn spring-boot:run  # Start Spring Boot application
mvn clean install   # Build and install dependencies
mvn test            # Run tests
```

## Development Setup
1. Ensure Java 17 and Node.js are installed
2. MySQL database should be running and configured in `application.properties`
3. Start backend first, then frontend
4. Frontend runs on port 3000, backend typically on port 8080