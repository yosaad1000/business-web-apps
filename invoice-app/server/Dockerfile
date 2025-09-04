# Multi-stage build for Spring Boot application
FROM openjdk:17-jdk-slim as build

WORKDIR /app
COPY . .

# Make mvnw executable and build the application
RUN chmod +x ./mvnw && \
    ./mvnw clean package -DskipTests

# Runtime stage
FROM openjdk:17-jre-slim

WORKDIR /app

# Copy the built jar file
COPY --from=build /app/target/server-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Run the application with Supabase profile
CMD ["java", "-jar", "-Dspring.profiles.active=supabase", "app.jar"]