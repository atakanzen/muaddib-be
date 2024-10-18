export declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV?: 'development' | 'test' | 'production';
            POSTGRES_URL: string;
            POSTGRES_URL_DEV: string;
            JWT_SECRET: string;
        }
    }
}
