DO $$ BEGIN
 CREATE TYPE "downtime_status" AS ENUM('open', 'closed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "ip_type" AS ENUM('switch', 'ata');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "operator_type" AS ENUM('ALT', 'ACT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "branch" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"branch_number" integer NOT NULL,
	"switch_ip" varchar(15) NOT NULL,
	"ata_ip" varchar(15) NOT NULL,
	"operator" "operator_type" NOT NULL,
	"technician_id" integer,
	CONSTRAINT "branch_name_unique" UNIQUE("name"),
	CONSTRAINT "branch_branch_number_unique" UNIQUE("branch_number"),
	CONSTRAINT "branch_switch_ip_unique" UNIQUE("switch_ip"),
	CONSTRAINT "branch_ata_ip_unique" UNIQUE("ata_ip")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "technician" (
	"id" serial PRIMARY KEY NOT NULL,
	"discord_user_id" varchar(255) NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "technician_discord_user_id_unique" UNIQUE("discord_user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "branch" ADD CONSTRAINT "branch_technician_id_technician_id_fk" FOREIGN KEY ("technician_id") REFERENCES "technician"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
