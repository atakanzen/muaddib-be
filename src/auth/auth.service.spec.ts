import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '@/database/database.module';
import { users } from '@/database/schema/users/users';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';
import { DBType } from '@/database/schema/_schema';
import { ConfigModule } from '@nestjs/config';

describe('AuthService (Integration)', () => {
    let authService: AuthService;
    let db: DBType;

    let testUserId: number;
    const testUser = { username: 'GautamaSiddharthaTest', password: 'Enlightment12345' };

    beforeAll(async () => {
        const testingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true }), // Load .env
                DatabaseModule,
                JwtModule.register({
                    global: true,
                    secret: process.env.JWT_SECRET,
                    signOptions: {
                        expiresIn: '1w'
                    }
                })
            ],
            providers: [AuthService]
        }).compile();

        authService = testingModule.get<AuthService>(AuthService);
        db = testingModule.get<DBType>('DB');

        expect(db).toBeDefined();
        expect(db.insert).toBeDefined();
        expect(db.delete).toBeDefined();
    });

    afterAll(async () => {
        await db.delete(users).where(eq(users.username, testUser.username));
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const newUser = await authService.createUser(testUser.username, testUser.password);
            expect(newUser).toHaveProperty('id');
            expect(newUser.username).toBe(testUser.username);

            testUserId = newUser.id;
        });

        it('should throw an error if username already exists', async () => {
            await expect(authService.createUser(testUser.username, testUser.password)).rejects.toThrow();
        });
    });

    describe('loginUser', () => {
        it('should return user data if credentials are valid', async () => {
            const user = await authService.loginUser(testUser.username, testUser.password);
            expect(user.id).toBe(testUserId);
            expect(user.username).toBe(testUser.username);
        });

        it('should throw an error if username does not exist', async () => {
            await expect(authService.loginUser('wronguser', testUser.password)).rejects.toThrow();
        });

        it('should throw an error if password is incorrect', async () => {
            await expect(authService.loginUser(testUser.username, 'wrongpassword')).rejects.toThrow();
        });
    });

    describe('changePassword', () => {
        it('should change the user password', async () => {
            const newPassword = 'PeaceComesFromWithin';

            await authService.changePassword({
                userId: testUserId,
                currentPassword: testUser.password,
                newPassword: newPassword,
            });

            const updatedUser = await db.query.users.findFirst({
                where: eq(users.username, testUser.username),
            });

            expect(await argon2.verify(updatedUser!.passwordHash, newPassword)).toBeTruthy();
        });

        it('should throw an error if current password is incorrect', async () => {
            await expect(
                authService.changePassword({
                    userId: 1,
                    currentPassword: 'wrongPassword',
                    newPassword: 'newPassword123',
                }),
            ).rejects.toThrow();
        });
    });

    describe('deleteUser', () => {
        it('should delete a user', async () => {
            const foundUser = await db.query.users.findFirst({
                where: eq(users.username, testUser.username),
            });

            expect(foundUser).toBeDefined();

            await authService.deleteUser(foundUser!.id);

            const deletedUser = await db.query.users.findFirst({
                where: eq(users.username, testUser.username),
            });

            expect(deletedUser).toBeUndefined();
        });

        it('should throw an error if user does not exist', async () => {
            await expect(authService.deleteUser(9999)).rejects.toThrow();
        });
    });

    describe('generateJWT', () => {
        it('should generate a valid JWT', async () => {
            const token = await authService.generateJWT({ sub: testUserId, username: testUser.username });
            expect(typeof token).toBe('string');
        });
    });
});
