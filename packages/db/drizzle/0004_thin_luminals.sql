ALTER TABLE "playlists" ADD COLUMN "creator" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "playlists" ADD COLUMN "description" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "playlists" ADD COLUMN "thumbnail" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "playlists" ADD COLUMN "video_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "playlists" ADD COLUMN "view_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "playlists" ADD COLUMN "category" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "playlists" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "playlists" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "video_progress" DROP COLUMN "watch_time_seconds";--> statement-breakpoint
ALTER TABLE "video_progress" DROP COLUMN "last_position";