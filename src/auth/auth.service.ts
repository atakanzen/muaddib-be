import { DBType } from '@/database/schema/_schema';
import { lower } from '@/database/schema/_utils';
import { users } from '@/database/schema/users/users';
import {
    BadRequestException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
    constructor(
        @Inject('DB') private db: DBType,
        private jwtService: JwtService,
    ) {}

    async createUser(username: string, password: string) {
        const foundUser = await this.db.query.users.findFirst({
            where: (users, { eq }) =>
                eq(lower(users.username), username.toLowerCase()),
            columns: {
                id: true,
            },
        });

        if (foundUser !== undefined) {
            throw new BadRequestException(
                'The provided credentials are not valid.',
            );
        }

        const passwordHash = await argon2.hash(password);

        const inserted = await this.db
            .insert(users)
            .values({
                username: username,
                passwordHash: passwordHash,
            })
            .returning();

        return inserted[0];
    }

    async loginUser(username: string, password: string) {
        const foundUser = await this.db.query.users.findFirst({
            where: eq(lower(users.username), username.toLowerCase()),
        });

        if (foundUser === undefined) {
            throw new UnauthorizedException(
                'The provided credentials are not valid.',
            );
        }

        const isValid = await argon2.verify(foundUser.passwordHash, password);

        if (!isValid) {
            throw new UnauthorizedException(
                'The provided credentials are not valid.',
            );
        }

        return foundUser;
    }

    async changePassword({
        userId,
        currentPassword,
        newPassword,
    }: {
        userId: number;
        currentPassword: string;
        newPassword: string;
    }) {
        const foundUser = await this.db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: {
                passwordHash: true,
            },
        });

        if (foundUser === undefined) {
            throw new UnauthorizedException(
                'The provided credentials are not valid.',
            );
        }

        const isValid = await argon2.verify(
            foundUser.passwordHash,
            currentPassword,
        );

        if (!isValid) {
            throw new UnauthorizedException(
                'The provided credentials are not valid.',
            );
        }

        const newHash = await argon2.hash(newPassword);

        await this.db
            .update(users)
            .set({ passwordHash: newHash })
            .where(eq(users.id, userId));
    }

    async generateJWT(payload: { sub: number; username: string }) {
        return await this.jwtService.signAsync(payload);
    }
}
