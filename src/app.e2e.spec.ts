import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './app.module';
import { DBType } from './database/schema/_schema';
import { decisionTrees } from './database/schema/decision-trees/decision-trees';
import { users } from './database/schema/users/users';
import { eq } from 'drizzle-orm';
import { sampleDecisionTree } from './lib/common/test/sample-decision-tree';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let db: DBType;

    // Test data:
    let authBearer;
    let treeId: string;

    const testUser = { username: 'MichaelJacksonTest', password: 'SmoothCriminal12345' };
    const treeName = 'Test Decision Tree';

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = testingModule.createNestApplication();
        await app.init();

        db = testingModule.get<DBType>('DB');
        expect(db).toBeDefined();
    });

    afterAll(async () => {
        const user = await db.query.users.findFirst({
            where: eq(users.username, testUser.username)
        });

        if (user === undefined) {
            return;
        }

        await db.delete(decisionTrees).where(eq(decisionTrees.userId, user.id));
        await db.delete(users).where(eq(users.id, user.id));
    });

    it('Registers a user', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(testUser);

        expect(response.status).toEqual(HttpStatus.CREATED);
        expect(response.body.bearer).toBeDefined();

        authBearer = response.body.bearer;
    });

    it('Allows user to create a decision tree', async () => {
        const response = await request(app.getHttpServer())
            .post('/decision-tree/create')
            .auth(authBearer, { type: 'bearer' })
            .send({
                name: treeName,
                tree: sampleDecisionTree
            });

        expect(response.status).toEqual(HttpStatus.CREATED);
        expect(response.body.id).toBeDefined();

        treeId = response.body.id;
    });

    it('Allows user to list decision trees to access a list of them', async () => {
        const response = await request(app.getHttpServer())
            .get('/decision-tree/list')
            .auth(authBearer, { type: 'bearer' });
        
        expect(response.body).toHaveLength(1);

        const foundTree = response.body[0];

        expect(foundTree.id).toEqual(treeId);
        expect(foundTree.name).toEqual(treeName);
    });

    it('Allows user to get a decision tree by id', async () => {
        const response = await request(app.getHttpServer())
            .get(`/decision-tree/get/${treeId}`)
            .auth(authBearer, { type: 'bearer' });
        
        expect(response.body.tree).toBeDefined();
        expect(response.body.name).toBeDefined();
    });
});
