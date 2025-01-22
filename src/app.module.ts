import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Load .env before everything
const envModule = ConfigModule.forRoot({
  isGlobal: true,
  cache: true
})

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { DecisionTreeModule } from './decision-tree/decision-tree.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    envModule,
    DatabaseModule,
    AuthModule,
    DecisionTreeModule,
    HealthModule
  ]
})
export class AppModule { }
