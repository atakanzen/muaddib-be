import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { DecisionTree } from '../types/decision-tree.types';

export class CreateDecisionTreeDTO {
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(128)
    "name": string;

    "tree": DecisionTree
}
