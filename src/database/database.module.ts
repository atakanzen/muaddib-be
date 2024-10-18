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
                    connectionString: ['development', 'test'].some(e => e === process.env.NODE_ENV)
                        ? process.env.POSTGRES_URL_DEV
                        : process.env.POSTGRES_URL
                },
            },
            config: { schema: dbSchema }
        })
    ]
})
export class DatabaseModule { }
