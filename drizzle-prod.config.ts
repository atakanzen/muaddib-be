import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/database/schema/*',
    dbCredentials: {
        user: process.env.GCP_SQL_USER,
        password: process.env.GCP_SQL_PWD,
        database: process.env.GCP_SQL_DB_NAME,
        host: process.env.GCP_SQL_INSTANCE_CONNECTION,
    },
});
