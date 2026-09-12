FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy everything
COPY . .

# Compile Java files into /app (root), preserving package structure
RUN mkdir -p /app/classes \
    && javac -d /app/classes $(find src -name "*.java")

# Expose Render's port
ENV PORT=8080
EXPOSE 8080

# Run the server using the compiled classes
CMD ["java", "-cp", "/app/classes", "com.coloradopizza.PizzaServer"]
