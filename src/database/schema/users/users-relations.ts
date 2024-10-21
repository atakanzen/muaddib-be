import { relations } from "drizzle-orm";
import { decisionTrees } from "../decision-trees/decision-trees";

export const usersRelations = relations(decisionTrees, ({ many }) => ({
    decisionTrees: many(decisionTrees)
}));
