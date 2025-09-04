# Business Web Applications

A collection of full-stack web applications demonstrating modern business solutions built with React and Spring Boot.

## 🚀 Applications

### 📊 Invoice Management System
Complete invoice processing application with vendor management and tracking capabilities.
- **Frontend**: React 18 + Material-UI
- **Backend**: Spring Boot 3.1 + JPA
- **Features**: Invoice CRUD, vendor management, payment tracking

### 👥 Employee Management System
HR management application for employee records and organizational data.
- **Frontend**: React 18 + Material-UI
- **Backend**: Spring Boot 3.1 + JPA
- **Features**: Employee profiles, department management, role assignments

### 🎯 Quiz Application
Interactive quiz platform for creating and taking assessments.
- **Frontend**: React 18 + Material-UI
- **Backend**: Spring Boot 3.1 + JPA
- **Features**: Quiz creation, question management, scoring system

### 💼 Indeed Clone
Job board application with posting and application management.
- **Frontend**: React 18 + Material-UI
- **Backend**: Spring Boot 3.1 + JPA
- **Features**: Job listings, application tracking, employer dashboard

### 🔧 CRUD Application
Generic CRUD operations demonstration with best practices.
- **Frontend**: React 18 + Material-UI
- **Backend**: Spring Boot 3.1 + JPA
- **Features**: Standard CRUD operations, data validation

### 🏢 Unified ERP System
Enterprise resource planning system with multiple business modules.
- **Frontend**: React 18 + TypeScript + Material-UI
- **Backend**: Microservices architecture with Spring Boot
- **Features**: Employee management, department organization, modular design

## 🛠️ Technology Stack

### Frontend
- **React 18.2+** - Modern UI framework
- **Material-UI** - Component library
- **Axios** - HTTP client
- **TypeScript** - Type safety (ERP system)
- **Emotion** - CSS-in-JS styling

### Backend
- **Spring Boot 3.1+** - Java web framework
- **Java 17** - Programming language
- **Spring Data JPA** - Database abstraction
- **Maven** - Build management
- **PostgreSQL/MySQL** - Database options

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Supabase** - Backend-as-a-Service integration

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Java 17+
- Maven 3.6+
- Docker (optional)

### Running an Application

1. **Clone the repository**
   ```bash
   git clone https://github.com/yosaad1000/business-web-apps.git
   cd business-web-apps
   ```

2. **Choose an application** (e.g., invoice-app)
   ```bash
   cd invoice-app
   ```

3. **Start the backend**
   ```bash
   cd server
   ./mvnw spring-boot:run
   ```

4. **Start the frontend** (in a new terminal)
   ```bash
   cd client
   npm install
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

### Using Docker

```bash
cd [application-name]
docker-compose up --build
```

## 📁 Project Structure

Each application follows a consistent structure:

```
application-name/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page-level components
│   │   └── services/      # API service layer
│   └── package.json
├── server/                # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/[domain]/
│   │       ├── controller/ # REST controllers
│   │       ├── model/     # JPA entities
│   │       ├── service/   # Business logic
│   │       └── repository/ # Data access
│   └── pom.xml
├── docker-compose.yml     # Container orchestration
└── README.md             # Application-specific docs
```

## 🔧 Development

### Common Commands

**Frontend (React)**
```bash
npm install          # Install dependencies
npm start            # Development server (port 3000)
npm run build        # Production build
npm test             # Run tests
```

**Backend (Spring Boot)**
```bash
./mvnw spring-boot:run    # Development server (port 8080)
./mvnw clean install     # Build and test
./mvnw test              # Run tests only
```

### Port Conventions
- Frontend: 3000 (React dev server)
- Backend: 8080 (Spring Boot)
- Database: 5432 (PostgreSQL) / 3306 (MySQL)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Learning Objectives

These applications demonstrate:
- Full-stack development patterns
- RESTful API design
- Modern React development
- Spring Boot best practices
- Database integration
- Docker containerization
- Microservices architecture (ERP system)

Perfect for developers learning modern web application development or teams needing reference implementations.