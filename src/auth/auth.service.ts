import { DBType } from '@/database/schema/_schema';
import { lower } from '@/database/schema/_utils';
import { users } from '@/database/schema/users/users';
import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        @Inject('DB') private db: DBType,
        private jwtService: JwtService
    ) { }

    async createUser(username: string, password: string) {
        const foundUser = await this.db.query.users.findFirst({
            where: (users, { eq }) => eq(lower(users.username), username.toLowerCase()),
            columns: {
                id: true
            }
        });

        if (foundUser !== undefined) {
            throw new ConflictException('User already exists');
        }

        const passwordHash = await argon2.hash(password);

        const inserted = await this.db.insert(users).values({
            username: username,
            passwordHash: passwordHash
        }).returning();

        return inserted[0];
    }

    async loginUser(username: string, password: string) {
        const foundUser = await this.db.query.users.findFirst({
            where: (users, { eq }) => eq(lower(users.username), username.toLowerCase())
        });

        if (foundUser === undefined) {
            throw new NotFoundException('User does not exist');
        }

        const isValid = await argon2.verify(foundUser.passwordHash, password);

        if (!isValid) {
            throw new UnauthorizedException('Invalid password');
        }

        return foundUser;
    }

    async generateJWT(payload: {
        sub: number,
        username: string
    }) {
        return await this.jwtService.signAsync(payload);
    }
}
