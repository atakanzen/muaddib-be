#!/bin/sh

# Check NODE_ENV
echo "NODE_ENV is set to: ${NODE_ENV}"

if [ "$NODE_ENV" = "production" ]; then
  echo "Running production database migrations..."
  npm run drizzle-gen:prod && npm run drizzle-mig:prod
elif [ "$NODE_ENV" = "development" ]; then 
  echo "Running development database migrations..."
  npm run drizzle-gen:dev && npm run drizzle-mig:dev
else 
  echo "NODE_ENV is not set to 'production' or 'development'. Skipping migrations."
fi

# Start application
echo "Starting application..."
node dist/src/main.js