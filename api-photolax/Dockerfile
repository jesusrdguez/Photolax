FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
COPY api-photolax/pom.xml .
COPY api-photolax/src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-slim
WORKDIR /app
COPY --from=build /app/target/api-photolax-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"] 