// Define database schema as a single module

import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { users } from './users/users';
import { decisionTrees } from './decision-trees/decision-trees';

export const dbSchema = { users, decisionTrees };
export type DBType = NodePgDatabase<typeof dbSchema>;
