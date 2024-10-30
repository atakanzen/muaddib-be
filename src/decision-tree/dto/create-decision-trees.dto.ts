import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { RawDecisionTree } from '../types/decision-tree.types';

export class CreateDecisionTreeDTO {
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(128)
    "name": string;

    "tree": RawDecisionTree
}
