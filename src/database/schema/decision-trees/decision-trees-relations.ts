import { relations } from "drizzle-orm";
import { decisionTrees } from "./decision-trees";
import { users } from "../users/users";

export const decisionTreesRelations = relations(decisionTrees, ({ one }) => ({
    user: one(users, {
        fields: [decisionTrees.userId],
        references: [users.id]
    })
}));
