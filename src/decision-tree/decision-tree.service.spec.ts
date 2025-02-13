import { Test, TestingModule } from '@nestjs/testing';
import { DecisionTreeService } from './decision-tree.service';
import { DatabaseModule } from '@/database/database.module';
import { DBType } from '@/database/schema/_schema';
import { decisionTrees } from '@/database/schema/decision-trees/decision-trees';
import { eq } from 'drizzle-orm';
import {
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '@/auth/auth.service';
import { users } from '@/database/schema/users/users';
import { sampleDecisionTree } from '@/lib/common/test/sample-decision-tree';

describe('DecisionTreeService (Integration)', () => {
    let decisionTreeService: DecisionTreeService;
    let authService: AuthService;
    let db: DBType;

    // Test data:
    let testTreeId: string;
    let testUserId: number;

    const testUser = { username: 'ElvisPresleyTest', password: 'BurningLove12345' };
    const testTreeName = 'Test Decision Tree';

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
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
            providers: [AuthService, DecisionTreeService],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        decisionTreeService = module.get<DecisionTreeService>(DecisionTreeService);
        db = module.get<DBType>('DB');

        expect(db).toBeDefined();

        // Create the test user
        const createdUser = await authService.createUser(testUser.username, testUser.password);
        testUserId = createdUser.id;
    });

    afterAll(async () => {
        await db.delete(decisionTrees).where(eq(decisionTrees.userId, testUserId));
        await db.delete(users).where(eq(users.id, testUserId));
    });

    describe('insert', () => {
        it('should insert a new decision tree and return its id', async () => {
            const result = await decisionTreeService.insert({
                userId: testUserId,
                name: testTreeName,
                tree: sampleDecisionTree,
            });
            expect(result).toHaveProperty('id');
            testTreeId = result.id;
        });
    });

    describe('get', () => {
        it('should retrieve the decision tree for the given user and tree id', async () => {
            const tree = await decisionTreeService.get({
                userId: testUserId,
                treeId: testTreeId,
            });

            expect(tree).toBeDefined();
            expect(tree.name).toEqual(testTreeName);
            expect(tree.userId).toEqual(testUserId);

            // Check for tree "equality"
            expect(tree.tree.nodes.length).toEqual(14);
            expect(tree.tree.edges.length).toEqual(12);
            expect(tree.tree.viewport.x).toBeCloseTo(54.3);
            expect(tree.tree.viewport.y).toBeCloseTo(60.7);
            expect(tree.tree.viewport.zoom).toBeCloseTo(0.83);
        });

        it('should throw NotFoundException if decision tree does not exist', async () => {
            await expect(
                decisionTreeService.get({
                    userId: testUserId,
                    treeId: 'non-existent-id',
                }),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException if user does not own the decision tree', async () => {
            await expect(
                decisionTreeService.get({
                    userId: 999,
                    treeId: testTreeId,
                }),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('list', () => {
        beforeAll(async () => {
            // Insert additional trees for testing list functionality.
            await decisionTreeService.insert({
                userId: testUserId,
                name: 'List Tree 1',
                tree: sampleDecisionTree,
            });
            await decisionTreeService.insert({
                userId: testUserId,
                name: 'List Tree 2',
                tree: sampleDecisionTree,
            });
        });

        it('should list decision trees for the given user', async () => {
            const trees = await decisionTreeService.list({ userId: testUserId });
            expect(Array.isArray(trees)).toBe(true);
            trees.forEach((tree) => {
                expect(tree).toHaveProperty('id');
                expect(tree).toHaveProperty('name');
                expect(tree).toHaveProperty('createdAt');
                expect(tree).toHaveProperty('updatedAt');
            });
        });

        it('should apply skip and take parameters', async () => {
            const trees = await decisionTreeService.list({
                userId: testUserId,
                skip: 1,
                take: 1,
            });
            expect(trees).toHaveLength(1);
        });
    });

    describe('update', () => {
        it('should update the decision tree name and tree content', async () => {
            const newName = 'Updated Decision Tree';
            const newTree = { ...sampleDecisionTree, updated: true };
            await decisionTreeService.update({
                userId: testUserId,
                treeId: testTreeId,
                values: { name: newName, tree: newTree },
            });

            // Retrieve the tree to verify the update.
            const tree = await decisionTreeService.get({
                userId: testUserId,
                treeId: testTreeId,
            });
            expect(tree.name).toEqual(newName);
        });

        it('should throw BadRequestException if no update values are provided', async () => {
            await expect(
                decisionTreeService.update({
                    userId: testUserId,
                    treeId: testTreeId,
                    values: {},
                }),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('delete', () => {
        it('should delete the decision tree', async () => {
            // Verify the tree exists before deletion.
            const treeBefore = await decisionTreeService.get({
                userId: testUserId,
                treeId: testTreeId,
            });
            expect(treeBefore).toBeDefined();

            await decisionTreeService.delete({
                userId: testUserId,
                treeId: testTreeId,
            });

            // After deletion, getting the tree should throw a NotFoundException.
            await expect(
                decisionTreeService.get({
                    userId: testUserId,
                    treeId: testTreeId,
                }),
            ).rejects.toThrow(NotFoundException);
        });

        it('should return false when trying to delete a non-existent tree', async () => {
            await expect(
                decisionTreeService.delete({
                    userId: testUserId,
                    treeId: 'non-existent-id',
                })
            ).rejects.toThrow(NotFoundException);
        });
    });
});
