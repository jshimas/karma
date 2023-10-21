FROM maven:3.8.4-openjdk-17-slim AS build
RUN mkdir /app
WORKDIR /app

COPY pom.xml .
COPY src src
RUN mvn package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jdk-jammy
RUN groupadd javauser && useradd -m -g javauser javauser
WORKDIR /app
COPY --from=build /app/target/karma-api-0.0.1.jar /app/app.jar
EXPOSE 8080
RUN chown -R javauser:javauser /app
USER javauser
RUN echo "$SPRING_PROFILES_ACTIVE"
CMD ["java", "-jar", "app.jar"]
