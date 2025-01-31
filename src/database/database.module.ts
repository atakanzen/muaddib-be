import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { Module } from '@nestjs/common';
import { dbSchema } from './schema/_schema';

@Module({
    imports: [
        DrizzlePGModule.registerAsync({
            tag: 'DB',
            useFactory() {
                if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
                    return {
                        pg: {
                            connection: 'client',
                            config: {
                                connectionString:
                                    process.env.POSTGRES_URL_LOCAL,
                            },
                        },
                        config: { schema: dbSchema },
                    };
                } else {
                    return {
                        pg: {
                            connection: 'client',
                            config: {
                                user: process.env.GCP_SQL_USER,
                                password: process.env.GCP_SQL_PWD,
                                database: process.env.GCP_SQL_DB_NAME,
                                host: process.env.GCP_SQL_INSTANCE_CONNECTION,
                            },
                        },
                        config: { schema: dbSchema },
                    };
                }
            },
        }),
    ],
})
export class DatabaseModule {}
