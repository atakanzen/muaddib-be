# Stage 1: Build the application
FROM node:lts-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm install --production

# Expose the application port
EXPOSE 8080

# Start the application in production mode
CMD ["node", "dist/src/main"]
