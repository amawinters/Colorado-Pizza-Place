# Use official Java runtime
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# Compile Java source files
RUN javac $(find . -name "*.java")

# Expose Render's port
ENV PORT=8080
EXPOSE 8080

# Start your server
CMD ["java", "com.coloradopizza.PizzaServer"]
