import { pgTable, uuid, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { users } from "../users/users";
import { sql } from "drizzle-orm";
import { RawDecisionTree } from "@/decision-tree/types/decision-tree.types";

export const decisionTrees = pgTable('decision_trees', {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
    name: text().notNull(),
    tree: jsonb().notNull().$type<RawDecisionTree>(),  // TODO: Add $type
});
