import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(@Body() { username, password }: CreateUserDTO) {
        const { id } = await this.authService.createUser(username, password);

        return {
            bearer: await this.authService.generateJWT({
                sub: id,
                username: username
            })
        };
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() { username, password }: LoginUserDTO) {
        const { id } = await this.authService.loginUser(username, password);

        return {
            bearer: await this.authService.generateJWT({
                sub: id,
                username: username
            })
        };
    }
}
