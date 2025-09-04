# Invoice App

This document provides a comprehensive overview of the Invoice App, a full-stack application built with React and Spring Boot.

## Tech Stack

### Frontend

*   **React:** A JavaScript library for building user interfaces.
*   **Material-UI:** A popular React UI framework for faster and easier web development.
*   **Axios:** A promise-based HTTP client for the browser and Node.js, used for making API requests.
*   **React Scripts:** A set of scripts and configurations used by Create React App.

### Backend

*   **Spring Boot:** A Java-based framework used to create microservices.
*   **Spring Web:** Provides support for building web applications, including RESTful applications.
*   **Spring Data JPA:** Persists data in SQL stores with Java Persistence API using Spring Data and Hibernate.
*   **MySQL Connector/J:** The official JDBC driver for MySQL.
*   **Java 17:** The version of Java used for the backend.

## Dependencies

### Frontend (`package.json`)

*   `@emotion/react`: ^11.11.1
*   `@emotion/styled`: ^11.11.0
*   `@mui/material`: ^5.13.6
*   `@testing-library/jest-dom`: ^5.16.5
*   `@testing-library/react`: ^13.4.0
*   `@testing-library/user-event`: ^13.5.0
*   `axios`: ^1.4.0
*   `react`: ^18.2.0
*   `react-dom`: ^18.2.0
*   `react-scripts`: 5.0.1
*   `web-vitals`: ^2.1.4

### Backend (`pom.xml`)

*   `spring-boot-starter-data-jpa`
*   `spring-boot-starter-web`
*   `mysql-connector-j`
*   `spring-boot-starter-test`

## Files and Functions

### Frontend

*   **`src/App.js`**: The main component that renders the `Home` component.
*   **`src/pages/Home.jsx`**: The main page of the application. It manages the state of the invoices, fetches them from the API, and renders the `Header`, `AddInvoice`, and `Invoices` components.
*   **`src/components/Header.jsx`**: A simple header component.
*   **`src/components/AddInvoice.jsx`**: A form for adding new invoices. It has input fields for vendor, product, amount, and date. When the "Add Invoice" button is clicked, it calls the `saveInvoice` API to save the new invoice.
*   **`src/components/Invoices.jsx`**: A table that displays the list of invoices. It receives the invoices as props from the `Home` component and renders them in a table. It also has a "Mark Done" button for each invoice, which calls the `deleteInvoice` API to delete the invoice.
*   **`src/services/api.js`**: This file contains the API calls to the backend. It has three functions:
    *   `getAllInvoices()`: Fetches all the invoices from the backend.
    *   `saveInvoice(invoice)`: Saves a new invoice to the backend.
    *   `deleteInvoice(id)`: Deletes an invoice from the backend.

### Backend

*   **`src/main/java/com/invoiceprocessing/server/ServerApplication.java`**: The main entry point for the Spring Boot application.
*   **`src/main/java/com/invoiceprocessing/server/controller/InvoiceController.java`**: The REST controller that handles the API requests. It has three endpoints:
    *   `POST /invoice`: Adds a new invoice.
    *   `GET /invoice`: Gets all the invoices.
    *   `DELETE /invoice/{invoiceId}`: Deletes an invoice.
*   **`src/main/java/com/invoiceprocessing/server/model/Invoice.java`**: The entity class that represents an invoice. It has fields for id, vendor, product, amount, and date.
*   **`src/main/java/com/invoiceprocessing/server/services/InvoiceService.java`**: The service interface that defines the business logic for the application.
*   **`src/main/java/com/invoiceprocessing/server/services/InvoiceServiceImpl.java`**: The implementation of the `InvoiceService` interface. It uses the `InvoiceDao` to interact with the database.
*   **`src/main/java/com/invoiceprocessing/server/dao/InvoiceDao.java`**: The repository interface that extends `JpaRepository`. It provides the methods for CRUD operations on the `Invoice` entity.
*   **`src/main/resources/application.properties`**: The configuration file for the Spring Boot application. It contains the database connection properties.

## Uses

The Invoice App is a simple application for managing invoices. It allows users to:

*   Add new invoices.
*   View a list of all the invoices.
*   Mark invoices as "done", which deletes them from the list.

The application is divided into two parts: a React frontend and a Spring Boot backend. The frontend provides the user interface, and the backend provides the API for the frontend to interact with. The backend is connected to a MySQL database to store the invoices.

## How to Run

### Backend

1.  Navigate to the `server` directory.
2.  Run `mvn spring-boot:run` to start the backend server.

### Frontend

1.  Navigate to the `client` directory.
2.  Run `npm install` to install the dependencies.
3.  Run `npm start` to start the frontend development server.
