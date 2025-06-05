import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication and role management
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").notNull().default("translator"), // admin, korean_transcriber, english_translator, regional_translator
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content table for Korean video transcriptions and source materials
export const contents = pgTable("contents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  event: text("event"), // e.g., "Weekly Forum", "Bible Study"
  topic: text("topic"), // e.g., "Romans 12:1-8"
  contentDate: timestamp("content_date"),
  videoUrl: text("video_url"),
  koreanTranscription: text("korean_transcription"),
  metadata: jsonb("metadata"), // Additional structured data
  uploadedBy: integer("uploaded_by").references(() => users.id),
  status: text("status").notNull().default("draft"), // draft, ready_for_translation, in_progress, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Translation projects for tracking translation work
export const translationProjects = pgTable("translation_projects", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").references(() => contents.id).notNull(),
  sourceLanguage: text("source_language").notNull().default("ko"),
  targetLanguage: text("target_language").notNull().default("en"),
  assignedTo: integer("assigned_to").references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, in_progress, review, completed
  priority: text("priority").default("medium"), // low, medium, high, urgent
  dueDate: timestamp("due_date"),
  progress: integer("progress").default(0), // 0-100 percentage
  translatedText: text("translated_text"),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Glossary terms for terminology management
export const glossaryTerms = pgTable("glossary_terms", {
  id: serial("id").primaryKey(),
  koreanTerm: text("korean_term").notNull(),
  englishTerm: text("english_term").notNull(),
  definition: text("definition"),
  usage: text("usage"),
  partOfSpeech: text("part_of_speech"), // noun, verb, adjective, etc.
  category: text("category"), // theological, general, technical
  tags: text("tags").array(),
  addedBy: integer("added_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Translation memory for auto-suggestions
export const translationMemory = pgTable("translation_memory", {
  id: serial("id").primaryKey(),
  sourceText: text("source_text").notNull(),
  targetText: text("target_text").notNull(),
  sourceLanguage: text("source_language").notNull().default("ko"),
  targetLanguage: text("target_language").notNull().default("en"),
  context: text("context"), // Event/topic/scripture reference
  event: text("event"), // Weekly Forum, Bible Study, etc.
  topic: text("topic"), // Scripture reference or topic
  similarity: integer("similarity").default(100), // 0-100 percentage match
  contentId: integer("content_id").references(() => contents.id),
  projectId: integer("project_id").references(() => translationProjects.id),
  translatedBy: integer("translated_by").references(() => users.id),
  usageCount: integer("usage_count").default(0),
  avgRating: integer("avg_rating"), // Average user rating (1-5)
  metadata: jsonb("metadata"), // Additional context data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// TM feedback for tracking suggestion usage and quality
export const tmFeedback = pgTable("tm_feedback", {
  id: serial("id").primaryKey(),
  tmSegmentId: integer("tm_segment_id").references(() => translationMemory.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(), // used, dismissed, rated, copied
  rating: integer("rating"), // 1-5 for quality rating
  feedback: text("feedback"), // Optional text feedback
  projectId: integer("project_id").references(() => translationProjects.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// TM versions for tracking changes over time
export const tmVersions = pgTable("tm_versions", {
  id: serial("id").primaryKey(),
  tmSegmentId: integer("tm_segment_id").references(() => translationMemory.id).notNull(),
  sourceText: text("source_text").notNull(),
  targetText: text("target_text").notNull(),
  changedBy: integer("changed_by").references(() => users.id).notNull(),
  changeReason: text("change_reason"),
  version: integer("version").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Activity log for tracking user actions
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(), // uploaded, translated, reviewed, exported, etc.
  entityType: text("entity_type").notNull(), // content, project, glossary, etc.
  entityId: integer("entity_id"),
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Export jobs for tracking export requests
export const exportJobs = pgTable("export_jobs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  projectId: integer("project_id").references(() => translationProjects.id),
  format: text("format").notNull(), // docx, pdf, txt, srt
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  fileUrl: text("file_url"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  contents: many(contents),
  translationProjects: many(translationProjects),
  glossaryTerms: many(glossaryTerms),
  translationMemory: many(translationMemory),
  activities: many(activities),
  exportJobs: many(exportJobs),
}));

export const contentsRelations = relations(contents, ({ one, many }) => ({
  uploadedBy: one(users, {
    fields: [contents.uploadedBy],
    references: [users.id],
  }),
  translationProjects: many(translationProjects),
  translationMemory: many(translationMemory),
}));

export const translationProjectsRelations = relations(translationProjects, ({ one, many }) => ({
  content: one(contents, {
    fields: [translationProjects.contentId],
    references: [contents.id],
  }),
  assignedTo: one(users, {
    fields: [translationProjects.assignedTo],
    references: [users.id],
  }),
  exportJobs: many(exportJobs),
}));

export const glossaryTermsRelations = relations(glossaryTerms, ({ one }) => ({
  addedBy: one(users, {
    fields: [glossaryTerms.addedBy],
    references: [users.id],
  }),
}));

export const translationMemoryRelations = relations(translationMemory, ({ one, many }) => ({
  content: one(contents, {
    fields: [translationMemory.contentId],
    references: [contents.id],
  }),
  project: one(translationProjects, {
    fields: [translationMemory.projectId],
    references: [translationProjects.id],
  }),
  translatedBy: one(users, {
    fields: [translationMemory.translatedBy],
    references: [users.id],
  }),
  feedback: many(tmFeedback),
  versions: many(tmVersions),
}));

export const tmFeedbackRelations = relations(tmFeedback, ({ one }) => ({
  tmSegment: one(translationMemory, {
    fields: [tmFeedback.tmSegmentId],
    references: [translationMemory.id],
  }),
  user: one(users, {
    fields: [tmFeedback.userId],
    references: [users.id],
  }),
  project: one(translationProjects, {
    fields: [tmFeedback.projectId],
    references: [translationProjects.id],
  }),
}));

export const tmVersionsRelations = relations(tmVersions, ({ one }) => ({
  tmSegment: one(translationMemory, {
    fields: [tmVersions.tmSegmentId],
    references: [translationMemory.id],
  }),
  changedBy: one(users, {
    fields: [tmVersions.changedBy],
    references: [users.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));

export const exportJobsRelations = relations(exportJobs, ({ one }) => ({
  user: one(users, {
    fields: [exportJobs.userId],
    references: [users.id],
  }),
  project: one(translationProjects, {
    fields: [exportJobs.projectId],
    references: [translationProjects.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentSchema = createInsertSchema(contents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTranslationProjectSchema = createInsertSchema(translationProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGlossaryTermSchema = createInsertSchema(glossaryTerms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTranslationMemorySchema = createInsertSchema(translationMemory).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertExportJobSchema = createInsertSchema(exportJobs).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertTmFeedbackSchema = createInsertSchema(tmFeedback).omit({
  id: true,
  createdAt: true,
});

export const insertTmVersionSchema = createInsertSchema(tmVersions).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Content = typeof contents.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;
export type TranslationProject = typeof translationProjects.$inferSelect;
export type InsertTranslationProject = z.infer<typeof insertTranslationProjectSchema>;
export type GlossaryTerm = typeof glossaryTerms.$inferSelect;
export type InsertGlossaryTerm = z.infer<typeof insertGlossaryTermSchema>;
export type TranslationMemory = typeof translationMemory.$inferSelect;
export type InsertTranslationMemory = z.infer<typeof insertTranslationMemorySchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type ExportJob = typeof exportJobs.$inferSelect;
export type InsertExportJob = z.infer<typeof insertExportJobSchema>;
export type TmFeedback = typeof tmFeedback.$inferSelect;
export type InsertTmFeedback = z.infer<typeof insertTmFeedbackSchema>;
export type TmVersion = typeof tmVersions.$inferSelect;
export type InsertTmVersion = z.infer<typeof insertTmVersionSchema>;
