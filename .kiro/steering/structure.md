# Project Structure

## Repository Organization

This is a multi-project repository containing several independent full-stack applications:

```
/
├── crud-application/           # Generic CRUD demo
├── employee-management-system/ # HR management app
├── indeed-clone/              # Job board application
├── invoice-app/               # Invoice management system
└── quiz-application/          # Quiz platform
```

## Standard Project Layout

Each application follows a consistent structure:

```
project-name/
├── client/                    # React frontend
│   ├── public/               # Static assets
│   ├── src/                  # React source code
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── services/        # API service layer
│   │   └── App.js           # Main application component
│   ├── package.json         # Frontend dependencies
│   ├── Dockerfile           # Frontend container config
│   └── nginx.conf           # Production web server config
├── server/                   # Spring Boot backend
│   ├── src/main/java/       # Java source code
│   │   └── com/[domain]/    # Package structure
│   │       ├── controller/  # REST controllers
│   │       ├── model/       # JPA entities
│   │       ├── service/     # Business logic
│   │       └── dao/         # Data access layer
│   ├── src/main/resources/  # Configuration files
│   ├── pom.xml             # Maven dependencies
│   └── Dockerfile          # Backend container config
├── docker-compose.yml       # Multi-container setup
├── .env                     # Environment variables
└── README.md               # Project documentation
```

## Frontend Architecture

- **Components**: Reusable UI elements in `/src/components/`
- **Pages**: Route-level components in `/src/pages/`
- **Services**: API communication layer in `/src/services/`
- **Material-UI**: Consistent component library usage
- **Axios**: Centralized HTTP client configuration

## Backend Architecture

- **Controller Layer**: REST endpoints handling HTTP requests
- **Service Layer**: Business logic and transaction management
- **DAO/Repository Layer**: Data access using Spring Data JPA
- **Model Layer**: JPA entities representing database tables
- **Configuration**: Application properties and database settings

## Naming Conventions

- **Packages**: Lowercase with domain-based structure (`com.invoiceprocessing.server`)
- **Classes**: PascalCase (`InvoiceController`, `InvoiceService`)
- **Methods**: camelCase (`getAllInvoices`, `saveInvoice`)
- **REST Endpoints**: Lowercase with hyphens (`/api/invoices`)
- **Database Tables**: Snake_case (handled by JPA naming strategy)

## Configuration Files

- **Frontend**: `package.json`, `.env`, `nginx.conf`
- **Backend**: `pom.xml`, `application.properties`
- **Docker**: `Dockerfile`, `docker-compose.yml`
- **Database**: `setup-database.js` for initialization