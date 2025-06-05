import {
  users,
  contents,
  translationProjects,
  glossaryTerms,
  translationMemory,
  tmFeedback,
  tmVersions,
  activities,
  exportJobs,
  type User,
  type InsertUser,
  type Content,
  type InsertContent,
  type TranslationProject,
  type InsertTranslationProject,
  type GlossaryTerm,
  type InsertGlossaryTerm,
  type TranslationMemory,
  type InsertTranslationMemory,
  type TmFeedback,
  type InsertTmFeedback,
  type TmVersion,
  type InsertTmVersion,
  type Activity,
  type InsertActivity,
  type ExportJob,
  type InsertExportJob,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  
  // Content operations
  getContents(): Promise<Content[]>;
  getContent(id: number): Promise<Content | undefined>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, content: Partial<InsertContent>): Promise<Content>;
  deleteContent(id: number): Promise<void>;
  
  // Translation project operations
  getTranslationProjects(): Promise<(TranslationProject & { content: Content; assignedTo: User | null })[]>;
  getTranslationProject(id: number): Promise<(TranslationProject & { content: Content; assignedTo: User | null }) | undefined>;
  createTranslationProject(project: InsertTranslationProject): Promise<TranslationProject>;
  updateTranslationProject(id: number, project: Partial<InsertTranslationProject>): Promise<TranslationProject>;
  deleteTranslationProject(id: number): Promise<void>;
  
  // Glossary operations
  getGlossaryTerms(): Promise<(GlossaryTerm & { addedBy: User | null })[]>;
  getGlossaryTerm(id: number): Promise<GlossaryTerm | undefined>;
  createGlossaryTerm(term: InsertGlossaryTerm): Promise<GlossaryTerm>;
  updateGlossaryTerm(id: number, term: Partial<InsertGlossaryTerm>): Promise<GlossaryTerm>;
  deleteGlossaryTerm(id: number): Promise<void>;
  searchGlossaryTerms(query: string): Promise<GlossaryTerm[]>;
  
  // Translation memory operations
  getTranslationMemory(): Promise<TranslationMemory[]>;
  searchTranslationMemory(sourceText: string, similarity?: number): Promise<TranslationMemory[]>;
  createTranslationMemory(memory: InsertTranslationMemory): Promise<TranslationMemory>;
  
  // Activity operations
  getActivities(limit?: number): Promise<(Activity & { user: User | null })[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Export operations
  getExportJobs(userId?: number): Promise<(ExportJob & { user: User | null; project: TranslationProject & { content: Content } | null })[]>;
  createExportJob(job: InsertExportJob): Promise<ExportJob>;
  updateExportJob(id: number, job: Partial<InsertExportJob>): Promise<ExportJob>;
  
  // Dashboard stats
  getDashboardStats(): Promise<{
    activeProjects: number;
    completedTranslations: number;
    pendingReview: number;
    activeTranslators: number;
    tmEntries: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Content operations
  async getContents(): Promise<Content[]> {
    return await db
      .select()
      .from(contents)
      .orderBy(desc(contents.createdAt));
  }

  async getContent(id: number): Promise<Content | undefined> {
    const [content] = await db.select().from(contents).where(eq(contents.id, id));
    return content || undefined;
  }

  async createContent(content: InsertContent): Promise<Content> {
    const [newContent] = await db
      .insert(contents)
      .values(content)
      .returning();
    return newContent;
  }

  async updateContent(id: number, content: Partial<InsertContent>): Promise<Content> {
    const [updatedContent] = await db
      .update(contents)
      .set({ ...content, updatedAt: new Date() })
      .where(eq(contents.id, id))
      .returning();
    return updatedContent;
  }

  async deleteContent(id: number): Promise<void> {
    await db.delete(contents).where(eq(contents.id, id));
  }

  // Translation project operations
  async getTranslationProjects(): Promise<(TranslationProject & { content: Content; assignedTo: User | null })[]> {
    return await db
      .select()
      .from(translationProjects)
      .leftJoin(contents, eq(translationProjects.contentId, contents.id))
      .leftJoin(users, eq(translationProjects.assignedTo, users.id))
      .orderBy(desc(translationProjects.createdAt))
      .then(rows => rows.map(row => ({
        ...row.translation_projects,
        content: row.contents!,
        assignedTo: row.users,
      })));
  }

  async getTranslationProject(id: number): Promise<(TranslationProject & { content: Content; assignedTo: User | null }) | undefined> {
    const [row] = await db
      .select()
      .from(translationProjects)
      .leftJoin(contents, eq(translationProjects.contentId, contents.id))
      .leftJoin(users, eq(translationProjects.assignedTo, users.id))
      .where(eq(translationProjects.id, id));
      
    if (!row) return undefined;
    
    return {
      ...row.translation_projects,
      content: row.contents!,
      assignedTo: row.users,
    };
  }

  async createTranslationProject(project: InsertTranslationProject): Promise<TranslationProject> {
    const [newProject] = await db
      .insert(translationProjects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateTranslationProject(id: number, project: Partial<InsertTranslationProject>): Promise<TranslationProject> {
    const [updatedProject] = await db
      .update(translationProjects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(translationProjects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteTranslationProject(id: number): Promise<void> {
    await db.delete(translationProjects).where(eq(translationProjects.id, id));
  }

  // Glossary operations
  async getGlossaryTerms(): Promise<(GlossaryTerm & { addedBy: User | null })[]> {
    return await db
      .select()
      .from(glossaryTerms)
      .leftJoin(users, eq(glossaryTerms.addedBy, users.id))
      .orderBy(desc(glossaryTerms.createdAt))
      .then(rows => rows.map(row => ({
        ...row.glossary_terms,
        addedBy: row.users,
      })));
  }

  async getGlossaryTerm(id: number): Promise<GlossaryTerm | undefined> {
    const [term] = await db.select().from(glossaryTerms).where(eq(glossaryTerms.id, id));
    return term || undefined;
  }

  async createGlossaryTerm(term: InsertGlossaryTerm): Promise<GlossaryTerm> {
    const [newTerm] = await db
      .insert(glossaryTerms)
      .values(term)
      .returning();
    return newTerm;
  }

  async updateGlossaryTerm(id: number, term: Partial<InsertGlossaryTerm>): Promise<GlossaryTerm> {
    const [updatedTerm] = await db
      .update(glossaryTerms)
      .set({ ...term, updatedAt: new Date() })
      .where(eq(glossaryTerms.id, id))
      .returning();
    return updatedTerm;
  }

  async deleteGlossaryTerm(id: number): Promise<void> {
    await db.delete(glossaryTerms).where(eq(glossaryTerms.id, id));
  }

  async searchGlossaryTerms(query: string): Promise<GlossaryTerm[]> {
    return await db
      .select()
      .from(glossaryTerms)
      .where(
        sql`${glossaryTerms.koreanTerm} ILIKE ${`%${query}%`} OR ${glossaryTerms.englishTerm} ILIKE ${`%${query}%`}`
      );
  }

  // Translation memory operations
  async getTranslationMemory(): Promise<TranslationMemory[]> {
    return await db
      .select()
      .from(translationMemory)
      .orderBy(desc(translationMemory.createdAt));
  }

  async searchTranslationMemory(sourceText: string, similarity = 70): Promise<TranslationMemory[]> {
    return await db
      .select()
      .from(translationMemory)
      .where(
        and(
          sql`${translationMemory.sourceText} ILIKE ${`%${sourceText}%`}`,
          sql`${translationMemory.similarity} >= ${similarity}`
        )
      )
      .orderBy(desc(translationMemory.similarity));
  }

  async createTranslationMemory(memory: InsertTranslationMemory): Promise<TranslationMemory> {
    const [newMemory] = await db
      .insert(translationMemory)
      .values(memory)
      .returning();
    return newMemory;
  }

  // Activity operations
  async getActivities(limit = 10): Promise<(Activity & { user: User | null })[]> {
    return await db
      .select()
      .from(activities)
      .leftJoin(users, eq(activities.userId, users.id))
      .orderBy(desc(activities.createdAt))
      .limit(limit)
      .then(rows => rows.map(row => ({
        ...row.activities,
        user: row.users,
      })));
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db
      .insert(activities)
      .values(activity)
      .returning();
    return newActivity;
  }

  // Export operations
  async getExportJobs(userId?: number): Promise<(ExportJob & { user: User | null; project: TranslationProject & { content: Content } | null })[]> {
    let query = db
      .select()
      .from(exportJobs)
      .leftJoin(users, eq(exportJobs.userId, users.id))
      .leftJoin(translationProjects, eq(exportJobs.projectId, translationProjects.id))
      .leftJoin(contents, eq(translationProjects.contentId, contents.id));

    if (userId) {
      query = query.where(eq(exportJobs.userId, userId));
    }

    return await query
      .orderBy(desc(exportJobs.createdAt))
      .then(rows => rows.map(row => ({
        ...row.export_jobs,
        user: row.users,
        project: row.translation_projects ? {
          ...row.translation_projects,
          content: row.contents!,
        } : null,
      })));
  }

  async createExportJob(job: InsertExportJob): Promise<ExportJob> {
    const [newJob] = await db
      .insert(exportJobs)
      .values(job)
      .returning();
    return newJob;
  }

  async updateExportJob(id: number, job: Partial<InsertExportJob>): Promise<ExportJob> {
    const [updatedJob] = await db
      .update(exportJobs)
      .set(job)
      .where(eq(exportJobs.id, id))
      .returning();
    return updatedJob;
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    activeProjects: number;
    completedTranslations: number;
    pendingReview: number;
    activeTranslators: number;
    tmEntries: number;
  }> {
    const [activeProjects] = await db
      .select({ count: sql<number>`count(*)` })
      .from(translationProjects)
      .where(sql`${translationProjects.status} IN ('pending', 'in_progress')`);

    const [completedTranslations] = await db
      .select({ count: sql<number>`count(*)` })
      .from(translationProjects)
      .where(eq(translationProjects.status, 'completed'));

    const [pendingReview] = await db
      .select({ count: sql<number>`count(*)` })
      .from(translationProjects)
      .where(eq(translationProjects.status, 'review'));

    const [activeTranslators] = await db
      .select({ count: sql<number>`count(DISTINCT ${translationProjects.assignedTo})` })
      .from(translationProjects)
      .where(sql`${translationProjects.status} IN ('in_progress', 'review')`);

    const [tmEntries] = await db
      .select({ count: sql<number>`count(*)` })
      .from(translationMemory);

    return {
      activeProjects: activeProjects?.count || 0,
      completedTranslations: completedTranslations?.count || 0,
      pendingReview: pendingReview?.count || 0,
      activeTranslators: activeTranslators?.count || 0,
      tmEntries: tmEntries?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
