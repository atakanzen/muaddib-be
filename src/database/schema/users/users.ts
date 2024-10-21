import { serial, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { lower } from "../_utils";

export const users = pgTable('users', {
    id: serial().primaryKey(),
    username: text().notNull().unique(),
    passwordHash: text('password_hash').notNull()
},
    (table) => ({
        usernameUniqueIndex: uniqueIndex('username_unique_ind').on(lower(table.username))
    })
);
