# Use a Render-compatible Java image
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy everything into the container
COPY . .

# Compile all Java files
RUN javac $(find . -name "*.java")

# Expose Render's port
ENV PORT=8080
EXPOSE 8080

# Start your server
CMD ["java", "com.coloradopizza.PizzaServer"]
