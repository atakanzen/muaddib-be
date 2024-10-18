import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Load .env before everything
const envModule = ConfigModule.forRoot({
  isGlobal: true,
  cache: true
})

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    envModule,
    DatabaseModule,
    AuthModule
  ]
})
export class AppModule { }
