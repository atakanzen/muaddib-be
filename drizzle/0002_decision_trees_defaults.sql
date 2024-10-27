ALTER TABLE "decision_trees" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "decision_trees" ALTER COLUMN "updatedAt" SET NOT NULL;