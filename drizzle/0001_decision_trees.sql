CREATE TABLE IF NOT EXISTS "decision_trees" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"tree" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "passwordHash" TO "password_hash";--> statement-breakpoint
DROP INDEX IF EXISTS "usernameUniqueIndex";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" SET DATA TYPE text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "decision_trees" ADD CONSTRAINT "decision_trees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "username_unique_ind" ON "users" USING btree (lower("username"));