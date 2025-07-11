# ---- Build Stage ----
FROM eclipse-temurin:17-jdk-jammy AS build

WORKDIR /app

# Copy Maven files and download dependencies first for better cache
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the rest of the source code
COPY . .

# Build the application
RUN mvn clean package -DskipTests

# ---- Runtime Stage ----
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Create a non-root user
RUN groupadd -r spring && useradd -r -g spring spring

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

RUN mkdir -p /app/data && chown -R spring:spring /app
USER spring

EXPOSE 8081

ENV JAVA_OPTS="-Xmx512m -Xms256m"

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8081/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"] 