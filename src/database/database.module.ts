import { Module } from '@nestjs/common';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { dbSchema } from './schema/_schema';

@Module({
    imports: [
        DrizzlePGModule.register({
            tag: 'DB',
            pg: {
                connection: 'client',
                config: {
                    connectionString: process.env.NODE_ENV === 'test'
                        ? process.env.POSTGRES_URL_TEST
                        : process.env.POSTGRES_URL
                },
            },
            config: { schema: dbSchema }
        })
    ]
})
export class DatabaseModule { }
