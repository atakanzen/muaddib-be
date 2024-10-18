import { serial, pgTable, varchar, uniqueIndex } from "drizzle-orm/pg-core";
import { lower } from "./_utils";

export const users = pgTable('users', {
    id: serial().primaryKey(),
    username: varchar().notNull().unique(),
    passwordHash: varchar().notNull()
},
    (table) => ({
        usernameUniqueIndex: uniqueIndex('usernameUniqueIndex').on(lower(table.username))
    })
);
