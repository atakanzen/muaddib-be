import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/database/schema/*',
    dbCredentials: {
        url: process.env.POSTGRES_URL
    }
});
