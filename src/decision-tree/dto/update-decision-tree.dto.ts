import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { DecisionTree } from '../types/decision-tree.types';


export class UpdateDecisionTreeDTO {
    @IsOptional()
    @MinLength(1)
    @MaxLength(128)
    "name": string;

    @IsOptional()
    "tree": DecisionTree
}