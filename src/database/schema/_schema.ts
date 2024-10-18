// Define database schema as a single module

import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { users } from './users';

export const dbSchema = { users };
export type DBType = NodePgDatabase<typeof dbSchema>;
