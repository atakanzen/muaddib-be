import { pgTable, uuid, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { users } from "../users/users";

export const decisionTrees = pgTable('decision_trees', {
    id: uuid().primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow().$onUpdate(() => new Date()),
    name: text().notNull(),
    tree: jsonb().notNull(),
});
