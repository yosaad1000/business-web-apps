# Project Structure

## Root Directory
```
/
├── client/          # React frontend application
├── server/          # Spring Boot backend application
└── agents.md        # Project documentation and overview
```

## Frontend Structure (client/)
```
client/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable React components
│   │   ├── AddInvoice.jsx    # Form for creating invoices
│   │   ├── Header.jsx        # Application header
│   │   └── Invoices.jsx      # Invoice list table
│   ├── pages/       # Page-level components
│   │   └── Home.jsx          # Main application page
│   ├── services/    # API and external service calls
│   │   └── api.js            # Backend API integration
│   ├── App.js       # Main application component
│   └── index.js     # Application entry point
└── package.json     # Dependencies and scripts
```

## Backend Structure (server/)
```
server/
├── src/main/java/com/invoiceprocessing/server/
│   ├── controller/  # REST API endpoints
│   │   └── InvoiceController.java
│   ├── dao/         # Data access layer (repositories)
│   │   └── InvoiceDao.java
│   ├── model/       # Entity classes
│   │   └── Invoice.java
│   ├── services/    # Business logic layer
│   │   ├── InvoiceService.java
│   │   └── InvoiceServiceImpl.java
│   └── ServerApplication.java  # Spring Boot main class
├── src/main/resources/
│   └── application.properties  # Configuration
└── pom.xml          # Maven dependencies and build config
```

## Architecture Patterns
- **Frontend**: Component-based architecture with separation of concerns (components, pages, services)
- **Backend**: Layered architecture (Controller → Service → DAO → Database)
- **API**: RESTful endpoints following standard HTTP methods
- **Database**: JPA entities with repository pattern for data access