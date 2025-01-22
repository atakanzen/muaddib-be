export declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV?: 'development' | 'test' | 'production';
            POSTGRES_URL_LOCAL: string;
            JWT_SECRET: string;
            GCP_SQL_INSTANCE_CONNECTION: string;
            GCP_SQL_USER: string;
            GCP_SQL_PWD: string;
            GCP_SQL_DB_NAME: string;
        }
    }
}
