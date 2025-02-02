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
import { DecisionTreeEdgeType, DecisionTreeNodeType, RawDecisionTree } from './types/decision-tree.types';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '@/auth/auth.service';
import { users } from '@/database/schema/users/users';

describe('DecisionTreeService (Integration)', () => {
    let decisionTreeService: DecisionTreeService;
    let authService: AuthService;
    let db: DBType;

    // Test data:
    let testTreeId: string;
    let testUserId: number;

    const testUser = { username: 'ElvisPresleyTest', password: 'BurningLove12345' };
    const testTreeName = 'Test Decision Tree';
    const sampleTree: RawDecisionTree = {
        "nodes": [
            {
                "id": "03ce62ee-99b3-415c-bcfc-ed70a78cfcda",
                "data": {
                    "isRoot": true,
                    "ev": 480
                },
                "type": DecisionTreeNodeType.decisionNode,
                "position": {
                    "x": 155,
                    "y": 304
                },
                "measured": {
                    "width": 32,
                    "height": 32
                }
            },
            {
                "id": "99ad8026-50a3-43c5-8e2a-2241d408ea9d",
                "data": {
                    "isRoot": false,
                    "ev": 480
                },
                "type": DecisionTreeNodeType.decisionNode,
                "position": {
                    "x": 294,
                    "y": 227
                },
                "measured": {
                    "width": 32,
                    "height": 32
                }
            },
            {
                "id": "ffbf4b3e-9009-467b-9c47-ab0fd36bcec0",
                "data": {
                    "isRoot": false,
                    "ev": 440
                },
                "type": DecisionTreeNodeType.decisionNode,
                "position": {
                    "x": 297,
                    "y": 370
                },
                "measured": {
                    "width": 32,
                    "height": 32
                }
            },
            {
                "id": "5d1910f0-9db1-4660-bce0-c77400e5621c",
                "data": {
                    "ev": 440
                },
                "type": DecisionTreeNodeType.chanceNode,
                "position": {
                    "x": 444,
                    "y": 366
                },
                "measured": {
                    "width": 33,
                    "height": 33
                }
            },
            {
                "id": "54bbefe8-79f7-4435-bf08-8afa80e0a1c5",
                "data": {
                    "ev": 480
                },
                "type": DecisionTreeNodeType.chanceNode,
                "position": {
                    "x": 461,
                    "y": 192
                },
                "measured": {
                    "width": 33,
                    "height": 33
                }
            },
            {
                "id": "670b1d06-ecc0-48e8-8551-bb1b64296a34",
                "data": {
                    "isRoot": false,
                    "ev": 800
                },
                "type": DecisionTreeNodeType.decisionNode,
                "position": {
                    "x": 591,
                    "y": 308
                },
                "measured": {
                    "width": 32,
                    "height": 32
                }
            },
            {
                "id": "03d4a088-181d-4dfd-b741-718a24a4beea",
                "data": {
                    "isRoot": false,
                    "ev": 200
                },
                "type": DecisionTreeNodeType.decisionNode,
                "position": {
                    "x": 591,
                    "y": 427
                },
                "measured": {
                    "width": 32,
                    "height": 32
                }
            },
            {
                "id": "63d3bee0-acdd-4dc7-b4b8-16e977620daf",
                "data": {
                    "isRoot": false,
                    "ev": 2000
                },
                "type": DecisionTreeNodeType.decisionNode,
                "position": {
                    "x": 588,
                    "y": 126
                },
                "measured": {
                    "width": 32,
                    "height": 32
                }
            },
            {
                "id": "50a41c44-fab6-4604-88a6-6609908301be",
                "data": {
                    "isRoot": false,
                    "ev": 100
                },
                "type": DecisionTreeNodeType.decisionNode,
                "position": {
                    "x": 590,
                    "y": 227
                },
                "measured": {
                    "width": 32,
                    "height": 32
                }
            },
            {
                "id": "0478aabd-5986-42b2-8fa5-c51fe9447570",
                "data": {
                    "calculatedPayoff": 2000
                },
                "type": DecisionTreeNodeType.endpointNode,
                "position": {
                    "x": 760,
                    "y": 131
                },
                "measured": {
                    "width": 16,
                    "height": 16
                }
            },
            {
                "id": "914df962-0738-4c17-803f-5edfdb40d01a",
                "data": {
                    "calculatedPayoff": 100
                },
                "type": DecisionTreeNodeType.endpointNode,
                "position": {
                    "x": 767,
                    "y": 236
                },
                "measured": {
                    "width": 16,
                    "height": 16
                }
            },
            {
                "id": "642e21a1-a041-474b-8d17-22cb19a48910",
                "data": {
                    "calculatedPayoff": 800
                },
                "type": DecisionTreeNodeType.endpointNode,
                "position": {
                    "x": 773,
                    "y": 313
                },
                "measured": {
                    "width": 16,
                    "height": 16
                }
            },
            {
                "id": "94d5637f-9cb1-4521-afe9-250eac2ee99a",
                "data": {
                    "calculatedPayoff": 200
                },
                "type": DecisionTreeNodeType.endpointNode,
                "position": {
                    "x": 777,
                    "y": 437
                },
                "measured": {
                    "width": 16,
                    "height": 16
                }
            },
            {
                "id": "28fc193e-e588-4d41-be0d-2ffbe5cf47ef",
                "data": {
                    "text": "Here is a comment"
                },
                "type": DecisionTreeNodeType.textNode,
                "position": {
                    "x": 30,
                    "y": 165
                },
                "measured": {
                    "width": 127,
                    "height": 26
                }
            }
        ],
        "edges": [
            {
                "type": DecisionTreeEdgeType.decisionEdge,
                "data": {
                    "payoff": 0,
                    "isHighlighted": true
                },
                "source": "03ce62ee-99b3-415c-bcfc-ed70a78cfcda",
                "sourceHandle": "03ce62ee-99b3-415c-bcfc-ed70a78cfcda",
                "target": "99ad8026-50a3-43c5-8e2a-2241d408ea9d",
                "targetHandle": "99ad8026-50a3-43c5-8e2a-2241d408ea9d",
                "id": "xy-edge__03ce62ee-99b3-415c-bcfc-ed70a78cfcda03ce62ee-99b3-415c-bcfc-ed70a78cfcda-99ad8026-50a3-43c5-8e2a-2241d408ea9d99ad8026-50a3-43c5-8e2a-2241d408ea9d"
            },
            {
                "type": DecisionTreeEdgeType.decisionEdge,
                "data": {
                    "payoff": 0,
                    "isHighlighted": false
                },
                "source": "03ce62ee-99b3-415c-bcfc-ed70a78cfcda",
                "sourceHandle": "03ce62ee-99b3-415c-bcfc-ed70a78cfcda",
                "target": "ffbf4b3e-9009-467b-9c47-ab0fd36bcec0",
                "targetHandle": "ffbf4b3e-9009-467b-9c47-ab0fd36bcec0",
                "id": "xy-edge__03ce62ee-99b3-415c-bcfc-ed70a78cfcda03ce62ee-99b3-415c-bcfc-ed70a78cfcda-ffbf4b3e-9009-467b-9c47-ab0fd36bcec0ffbf4b3e-9009-467b-9c47-ab0fd36bcec0"
            },
            {
                "type": DecisionTreeEdgeType.decisionEdge,
                "data": {
                    "payoff": 0,
                    "isHighlighted": true
                },
                "source": "ffbf4b3e-9009-467b-9c47-ab0fd36bcec0",
                "sourceHandle": "ffbf4b3e-9009-467b-9c47-ab0fd36bcec0",
                "target": "5d1910f0-9db1-4660-bce0-c77400e5621c",
                "id": "xy-edge__ffbf4b3e-9009-467b-9c47-ab0fd36bcec0ffbf4b3e-9009-467b-9c47-ab0fd36bcec0-5d1910f0-9db1-4660-bce0-c77400e5621c"
            },
            {
                "type": DecisionTreeEdgeType.decisionEdge,
                "data": {
                    "payoff": 0,
                    "isHighlighted": true
                },
                "source": "99ad8026-50a3-43c5-8e2a-2241d408ea9d",
                "sourceHandle": "99ad8026-50a3-43c5-8e2a-2241d408ea9d",
                "target": "54bbefe8-79f7-4435-bf08-8afa80e0a1c5",
                "id": "xy-edge__99ad8026-50a3-43c5-8e2a-2241d408ea9d99ad8026-50a3-43c5-8e2a-2241d408ea9d-54bbefe8-79f7-4435-bf08-8afa80e0a1c5"
            },
            {
                "type": DecisionTreeEdgeType.chanceToChanceEdge,
                "data": {
                    "probability": 40,
                    "isSetByUser": true,
                    "isFaulty": false
                },
                "source": "5d1910f0-9db1-4660-bce0-c77400e5621c",
                "target": "670b1d06-ecc0-48e8-8551-bb1b64296a34",
                "targetHandle": "670b1d06-ecc0-48e8-8551-bb1b64296a34",
                "id": "xy-edge__5d1910f0-9db1-4660-bce0-c77400e5621c-670b1d06-ecc0-48e8-8551-bb1b64296a34670b1d06-ecc0-48e8-8551-bb1b64296a34"
            },
            {
                "type": DecisionTreeEdgeType.chanceToChanceEdge,
                "data": {
                    "probability": 60,
                    "isSetByUser": false,
                    "isFaulty": false
                },
                "source": "5d1910f0-9db1-4660-bce0-c77400e5621c",
                "target": "03d4a088-181d-4dfd-b741-718a24a4beea",
                "targetHandle": "03d4a088-181d-4dfd-b741-718a24a4beea",
                "id": "xy-edge__5d1910f0-9db1-4660-bce0-c77400e5621c-03d4a088-181d-4dfd-b741-718a24a4beea03d4a088-181d-4dfd-b741-718a24a4beea"
            },
            {
                "type": DecisionTreeEdgeType.chanceToChanceEdge,
                "data": {
                    "probability": 20,
                    "isSetByUser": true,
                    "isFaulty": false
                },
                "source": "54bbefe8-79f7-4435-bf08-8afa80e0a1c5",
                "target": "63d3bee0-acdd-4dc7-b4b8-16e977620daf",
                "targetHandle": "63d3bee0-acdd-4dc7-b4b8-16e977620daf",
                "id": "xy-edge__54bbefe8-79f7-4435-bf08-8afa80e0a1c5-63d3bee0-acdd-4dc7-b4b8-16e977620daf63d3bee0-acdd-4dc7-b4b8-16e977620daf"
            },
            {
                "type": DecisionTreeEdgeType.chanceToChanceEdge,
                "data": {
                    "probability": 80,
                    "isSetByUser": true,
                    "isFaulty": false
                },
                "source": "54bbefe8-79f7-4435-bf08-8afa80e0a1c5",
                "target": "50a41c44-fab6-4604-88a6-6609908301be",
                "targetHandle": "50a41c44-fab6-4604-88a6-6609908301be",
                "id": "xy-edge__54bbefe8-79f7-4435-bf08-8afa80e0a1c5-50a41c44-fab6-4604-88a6-6609908301be50a41c44-fab6-4604-88a6-6609908301be"
            },
            {
                "type": DecisionTreeEdgeType.decisionEdge,
                "data": {
                    "payoff": 2000,
                    "isHighlighted": true,
                    "payoffType": "profit"
                },
                "source": "63d3bee0-acdd-4dc7-b4b8-16e977620daf",
                "sourceHandle": "63d3bee0-acdd-4dc7-b4b8-16e977620daf",
                "target": "0478aabd-5986-42b2-8fa5-c51fe9447570",
                "id": "xy-edge__63d3bee0-acdd-4dc7-b4b8-16e977620daf63d3bee0-acdd-4dc7-b4b8-16e977620daf-0478aabd-5986-42b2-8fa5-c51fe9447570"
            },
            {
                "type": DecisionTreeEdgeType.decisionEdge,
                "data": {
                    "payoff": 100,
                    "isHighlighted": true,
                    "payoffType": "profit"
                },
                "source": "50a41c44-fab6-4604-88a6-6609908301be",
                "sourceHandle": "50a41c44-fab6-4604-88a6-6609908301be",
                "target": "914df962-0738-4c17-803f-5edfdb40d01a",
                "id": "xy-edge__50a41c44-fab6-4604-88a6-6609908301be50a41c44-fab6-4604-88a6-6609908301be-914df962-0738-4c17-803f-5edfdb40d01a"
            },
            {
                "type": DecisionTreeEdgeType.decisionEdge,
                "data": {
                    "payoff": 800,
                    "isHighlighted": true,
                    "payoffType": "profit"
                },
                "source": "670b1d06-ecc0-48e8-8551-bb1b64296a34",
                "sourceHandle": "670b1d06-ecc0-48e8-8551-bb1b64296a34",
                "target": "642e21a1-a041-474b-8d17-22cb19a48910",
                "id": "xy-edge__670b1d06-ecc0-48e8-8551-bb1b64296a34670b1d06-ecc0-48e8-8551-bb1b64296a34-642e21a1-a041-474b-8d17-22cb19a48910"
            },
            {
                "type": DecisionTreeEdgeType.decisionEdge,
                "data": {
                    "payoff": 200,
                    "payoffType": "profit",
                    "isHighlighted": true
                },
                "source": "03d4a088-181d-4dfd-b741-718a24a4beea",
                "sourceHandle": "03d4a088-181d-4dfd-b741-718a24a4beea",
                "target": "94d5637f-9cb1-4521-afe9-250eac2ee99a",
                "id": "xy-edge__03d4a088-181d-4dfd-b741-718a24a4beea03d4a088-181d-4dfd-b741-718a24a4beea-94d5637f-9cb1-4521-afe9-250eac2ee99a"
            }
        ],
        "viewport": {
            "x": 54.3,
            "y": 60.7,
            "zoom": 0.83
        }
    };

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
                tree: sampleTree,
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
                tree: sampleTree,
            });
            await decisionTreeService.insert({
                userId: testUserId,
                name: 'List Tree 2',
                tree: sampleTree,
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
            const newTree = { ...sampleTree, updated: true };
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
