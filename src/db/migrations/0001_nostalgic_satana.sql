CREATE TABLE IF NOT EXISTS "downtime" (
	"id" serial PRIMARY KEY NOT NULL,
	"branch_id" integer,
	"ip_type" "ip_type" NOT NULL,
	"start_time" timestamp DEFAULT now(),
	"end_time" timestamp,
	"status" "downtime_status" DEFAULT 'open'
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "downtime" ADD CONSTRAINT "downtime_branch_id_branch_id_fk" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
