import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDTO {
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(128)
    "currentPassword": string;

    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(128)
    "newPassword": string;
}
