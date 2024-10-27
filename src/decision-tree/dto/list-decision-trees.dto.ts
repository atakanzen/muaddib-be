import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ListDecisionTreesDTO {
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(50)
    "take"?: number;
    
    @IsOptional()
    @IsInt()
    @Min(0)
    "skip"?: number;
}
