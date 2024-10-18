import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginUserDTO {
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(32)
    "username": string;

    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(128)
    "password": string;
}
