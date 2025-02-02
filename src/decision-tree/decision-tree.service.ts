import { DBType } from '@/database/schema/_schema';
import { decisionTrees } from '@/database/schema/decision-trees/decision-trees';
import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { RawDecisionTree } from './types/decision-tree.types';

@Injectable()
export class DecisionTreeService {
    constructor(@Inject('DB') private db: DBType) { }

    private async getTreeOrThrow({ userId, treeId, retreiveData = true }: { userId: number; treeId: string; retreiveData?: boolean }) {
        try {
            var tree = await this.db.query.decisionTrees.findFirst({
                where: eq(decisionTrees.id, treeId),
                columns: retreiveData ? {
                    createdAt: true,
                    updatedAt: true,
                    tree: true,
                    name: true,
                    userId: true
                } : { userId: true }
            });
        }
        catch (e) {
            if ((e as Error).message.includes('non-existent-id')) {
                throw new NotFoundException();
            }
            throw new InternalServerErrorException();
        }

        if (!tree || tree.userId !== userId) {
            throw new NotFoundException('Decision tree with given id is not found');
        }

        return tree;
    }

    async get({ userId, treeId }: { userId: number; treeId: string }) {
        return await this.getTreeOrThrow({ userId, treeId }) as {
            userId: number;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tree: RawDecisionTree;
        };
    }

    async list({
        userId,
        skip,
        take,
    }: {
        userId: number;
        skip?: number;
        take?: number;
    }) {
        return await this.db
            .select({
                id: decisionTrees.id,
                name: decisionTrees.name,
                createdAt: decisionTrees.createdAt,
                updatedAt: decisionTrees.updatedAt,
            })
            .from(decisionTrees)
            .where(eq(decisionTrees.userId, userId))
            .offset(skip ?? 0)
            .limit(take ?? 20)
            .orderBy(desc(decisionTrees.updatedAt));
    }

    async insert(values: {
        userId: number;
        name: string;
        tree: RawDecisionTree;
    }) {
        const trees = await this.db
            .insert(decisionTrees)
            .values(values)
            .returning({
                id: decisionTrees.id,
            });

        return trees[0];
    }

    async update({
        userId,
        treeId,
        values,
    }: {
        userId: number;
        treeId: string;
        values: {
            name?: string;
            tree?: RawDecisionTree;
        };
    }) {
        if (values.name === undefined && values.tree === undefined) {
            throw new BadRequestException(
                'Request must contain at least one of values: ["name", "tree"]',
            );
        }

        await this.getTreeOrThrow({ userId, treeId, retreiveData: false });

        await this.db
            .update(decisionTrees)
            .set(values)
            .where(
                and(
                    eq(decisionTrees.userId, userId),
                    eq(decisionTrees.id, treeId),
                ),
            )
            .returning({
                id: decisionTrees.id,
                tree: decisionTrees.tree,
            });
    }

    async delete({ userId, treeId }: { userId: number; treeId: string }) {
        await this.getTreeOrThrow({ userId, treeId, retreiveData: false });

        await this.db
            .delete(decisionTrees)
            .where(
                and(
                    eq(decisionTrees.userId, userId),
                    eq(decisionTrees.id, treeId),
                ),
            )
            .returning({
                id: decisionTrees.id,
            });
    }
}
