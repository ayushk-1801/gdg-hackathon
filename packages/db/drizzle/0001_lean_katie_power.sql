CREATE TABLE "playlists" (
	"link" text PRIMARY KEY NOT NULL,
	"title" text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" text PRIMARY KEY NOT NULL,
	"videoId" text NOT NULL,
	"link" text NOT NULL,
	"summary" text DEFAULT '',
	"quiz" jsonb DEFAULT '[]'::jsonb,
	"refLink" jsonb DEFAULT '[]'::jsonb,
	"processed" boolean DEFAULT false,
	"priority" integer DEFAULT 0,
	"title" text DEFAULT ''
);
--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_link_playlists_link_fk" FOREIGN KEY ("link") REFERENCES "public"."playlists"("link") ON DELETE cascade ON UPDATE no action;