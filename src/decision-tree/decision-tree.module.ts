import { Module } from '@nestjs/common';
import { DecisionTreeService } from './decision-tree.service';
import { DecisionTreeController } from './decision-tree.controller';

@Module({
  providers: [DecisionTreeService],
  controllers: [DecisionTreeController]
})
export class DecisionTreeModule {}
