# Stage 1: Build the application for development
FROM node:lts-alpine AS development

# Set working directory
WORKDIR /app

# Copy package files
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm ci

# Copy application source code
COPY --chown=node:node . .

USER node

# Build the application

FROM node:lts-alpine as build

WORKDIR /app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

RUN npm ci --only=production && npm cache clean --force

USER node

# Stage 2: Run the application
FROM node:lts-alpine as production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build app/node_modules ./node_modules
COPY --chown=node:node --from=build app/package.json ./package.json
COPY --chown=node:node --from=build app/dist ./dist
COPY --chown=node:node drizzle-*.config.ts ./
COPY --chown=node:node src/database/schema ./src/database/schema
COPY docker-entrypoint.sh ./

RUN chmod +x docker-entrypoint.sh

EXPOSE 8080

# Start the server using the production build
ENTRYPOINT [ "./docker-entrypoint.sh" ]
