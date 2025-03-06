CREATE TABLE IF NOT EXISTS "manager" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "technician_range" (
	"id" serial PRIMARY KEY NOT NULL,
	"technician_id" integer,
	"start_range" integer NOT NULL,
	"end_range" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "branch" ADD COLUMN "manager_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "branch" ADD CONSTRAINT "branch_manager_id_manager_id_fk" FOREIGN KEY ("manager_id") REFERENCES "manager"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "technician_range" ADD CONSTRAINT "technician_range_technician_id_technician_id_fk" FOREIGN KEY ("technician_id") REFERENCES "technician"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
