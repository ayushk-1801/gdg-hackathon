import { varchar } from "drizzle-orm/mysql-core";
import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const playlists = pgTable("playlists", {
  id: text("id").primaryKey(),
  playlist_link: text("link").unique(),
  title: text("title").default(""),
  creator: text("creator").default(""),
  description: text("description").default(""),
  thumbnail: text("thumbnail").default(""),
  videoCount: integer("video_count").default(0),
  viewCount: integer("view_count").default(0),
  category: text("category").default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const videos = pgTable("videos", {
  id: text("id").primaryKey(),
  videoId: text("videoId").notNull().unique(),
  title: text("title").default(""),
  thumbnail: text("thumbnail").default(""),
  playlist_link: text("link")
    .notNull()
    .references(() => playlists.playlist_link, { onDelete: "cascade" }),
  summary: text("summary").default(""),
  quizzes: jsonb("quiz").default([]),
  refLink: jsonb("refLink").default([]),
});

export const enrollments = pgTable("enrollments", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  playlistLink: text("playlist_link")
    .notNull()
    .references(() => playlists.playlist_link, { onDelete: "cascade" }),
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  progress: integer("progress").default(0),
});

export const videoProgress = pgTable("video_progress", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  videoId: text("video_id")
    .notNull()
    .references(() => videos.id, { onDelete: "cascade" }),
  enrollmentId: text("enrollment_id")
    .notNull()
    .references(() => enrollments.id, { onDelete: "cascade" }),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
});

export const schema = {
  user,
  session,
  account,
  verification,
  playlists,
  videos,
  enrollments,
  videoProgress, // Add the new table to the schema
};
