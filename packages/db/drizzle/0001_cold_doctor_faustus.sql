CREATE TABLE "enrollments" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"playlist_link" text NOT NULL,
	"enrolled_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"progress" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "thumbnail" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_playlist_link_playlists_link_fk" FOREIGN KEY ("playlist_link") REFERENCES "public"."playlists"("link") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" DROP COLUMN "processed";--> statement-breakpoint
ALTER TABLE "videos" DROP COLUMN "priority";