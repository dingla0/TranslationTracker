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
  getTranslationMemory(): Promise<(TranslationMemory & { translatedBy: User | null })[]>;
  searchTranslationMemory(params: {
    sourceText: string;
    sourceLanguage?: string;
    targetLanguage?: string;
    similarity?: number;
    event?: string;
    topic?: string;
    translatorId?: number;
    limit?: number;
  }): Promise<(TranslationMemory & { translatedBy: User | null; matchScore: number })[]>;
  createTranslationMemory(memory: InsertTranslationMemory): Promise<TranslationMemory>;
  updateTranslationMemory(id: number, memory: Partial<InsertTranslationMemory>): Promise<TranslationMemory>;
  deleteTranslationMemory(id: number): Promise<void>;
  
  // TM feedback operations
  createTmFeedback(feedback: InsertTmFeedback): Promise<TmFeedback>;
  getTmFeedback(tmSegmentId: number): Promise<TmFeedback[]>;
  
  // TM version operations
  createTmVersion(version: InsertTmVersion): Promise<TmVersion>;
  getTmVersions(tmSegmentId: number): Promise<(TmVersion & { changedBy: User })[]>;
  
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

  // Translation memory operations with advanced fuzzy matching
  async getTranslationMemory(): Promise<(TranslationMemory & { translatedBy: User | null })[]> {
    return await db
      .select()
      .from(translationMemory)
      .leftJoin(users, eq(translationMemory.translatedBy, users.id))
      .orderBy(desc(translationMemory.createdAt))
      .then(rows => rows.map(row => ({
        ...row.translation_memory,
        translatedBy: row.users,
      })));
  }

  // Advanced TM search with fuzzy matching using Levenshtein distance
  async searchTranslationMemory(params: {
    sourceText: string;
    sourceLanguage?: string;
    targetLanguage?: string;
    similarity?: number;
    event?: string;
    topic?: string;
    translatorId?: number;
    limit?: number;
  }): Promise<(TranslationMemory & { translatedBy: User | null; matchScore: number })[]> {
    const {
      sourceText,
      sourceLanguage = 'ko',
      targetLanguage = 'en',
      similarity = 70,
      event,
      topic,
      translatorId,
      limit = 10
    } = params;

    // First get exact matches
    let query = db
      .select()
      .from(translationMemory)
      .leftJoin(users, eq(translationMemory.translatedBy, users.id))
      .where(
        and(
          eq(translationMemory.sourceLanguage, sourceLanguage),
          eq(translationMemory.targetLanguage, targetLanguage),
          event ? eq(translationMemory.event, event) : undefined,
          topic ? eq(translationMemory.topic, topic) : undefined,
          translatorId ? eq(translationMemory.translatedBy, translatorId) : undefined
        )
      );

    const results = await query
      .orderBy(desc(translationMemory.usageCount), desc(translationMemory.createdAt))
      .limit(limit * 2); // Get more results for fuzzy matching

    // Calculate match scores using simplified string similarity
    const scoredResults = results
      .map(row => {
        const tmEntry = row.translation_memory;
        const matchScore = this.calculateSimilarity(sourceText, tmEntry.sourceText);
        
        // Context boost: same event or topic gets +10 points
        let contextBoost = 0;
        if (event && tmEntry.event === event) contextBoost += 10;
        if (topic && tmEntry.topic === topic) contextBoost += 10;
        if (translatorId && tmEntry.translatedBy === translatorId) contextBoost += 5;
        
        const finalScore = Math.min(100, matchScore + contextBoost);
        
        return {
          ...tmEntry,
          translatedBy: row.users,
          matchScore: finalScore
        };
      })
      .filter(result => result.matchScore >= similarity)
      .sort((a, b) => {
        // Sort by match score first, then by usage count, then by date
        if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
        if (b.usageCount !== a.usageCount) return b.usageCount - a.usageCount;
        return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
      })
      .slice(0, limit);

    return scoredResults;
  }

  // Simple similarity calculation (alternative to Levenshtein for better performance)
  private calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 100;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 100;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return Math.round(((longer.length - distance) / longer.length) * 100);
  }

  // Levenshtein distance algorithm for fuzzy matching
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  async createTranslationMemory(memory: InsertTranslationMemory): Promise<TranslationMemory> {
    const [newMemory] = await db
      .insert(translationMemory)
      .values(memory)
      .returning();
    return newMemory;
  }

  async updateTranslationMemory(id: number, memory: Partial<InsertTranslationMemory>): Promise<TranslationMemory> {
    const [updatedMemory] = await db
      .update(translationMemory)
      .set({ ...memory, updatedAt: new Date() })
      .where(eq(translationMemory.id, id))
      .returning();
    return updatedMemory;
  }

  async deleteTranslationMemory(id: number): Promise<void> {
    await db.delete(translationMemory).where(eq(translationMemory.id, id));
  }

  // TM feedback operations
  async createTmFeedback(feedback: InsertTmFeedback): Promise<TmFeedback> {
    const [newFeedback] = await db
      .insert(tmFeedback)
      .values(feedback)
      .returning();
    
    // Update usage count and rating when feedback is provided
    if (feedback.action === 'used') {
      await db
        .update(translationMemory)
        .set({ 
          usageCount: sql`${translationMemory.usageCount} + 1`,
          updatedAt: new Date()
        })
        .where(eq(translationMemory.id, feedback.tmSegmentId));
    }
    
    return newFeedback;
  }

  async getTmFeedback(tmSegmentId: number): Promise<TmFeedback[]> {
    return await db
      .select()
      .from(tmFeedback)
      .where(eq(tmFeedback.tmSegmentId, tmSegmentId))
      .orderBy(desc(tmFeedback.createdAt));
  }

  // TM version operations
  async createTmVersion(version: InsertTmVersion): Promise<TmVersion> {
    const [newVersion] = await db
      .insert(tmVersions)
      .values(version)
      .returning();
    return newVersion;
  }

  async getTmVersions(tmSegmentId: number): Promise<(TmVersion & { changedBy: User })[]> {
    return await db
      .select()
      .from(tmVersions)
      .leftJoin(users, eq(tmVersions.changedBy, users.id))
      .where(eq(tmVersions.tmSegmentId, tmSegmentId))
      .orderBy(desc(tmVersions.createdAt))
      .then(rows => rows.map(row => ({
        ...row.tm_versions,
        changedBy: row.users!,
      })));
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
