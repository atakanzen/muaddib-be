import { DBType } from '@/database/schema/_schema';
import { decisionTrees } from '@/database/schema/decision-trees/decision-trees';
import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { RawDecisionTree } from './types/decision-tree.types';

@Injectable()
export class DecisionTreeService {
    constructor(@Inject('DB') private db: DBType) {}

    async get({ userId, treeId }: { userId: number; treeId: string }) {
        const tree = await this.db.query.decisionTrees.findFirst({
            where: and(
                eq(decisionTrees.id, treeId),
                eq(decisionTrees.userId, userId),
            ),
            columns: {
                createdAt: true,
                updatedAt: true,
                name: true,
                tree: true,
            },
        });

        if (tree === undefined) {
            throw new NotFoundException('Decision tree does not exist');
        }

        return tree;
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

        const affected = await this.db
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

        return Boolean(affected.length);
    }

    async delete({ userId, treeId }: { userId: number; treeId: string }) {
        const affected = await this.db
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

        return Boolean(affected.length);
    }
}
