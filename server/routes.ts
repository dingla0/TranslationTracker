import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertContentSchema, 
  insertTranslationProjectSchema, 
  insertGlossaryTermSchema,
  insertTranslationMemorySchema,
  insertTmFeedbackSchema,
  insertActivitySchema,
  insertExportJobSchema
} from "@shared/schema";
import multer from "multer";
import { azureTranslatorService } from "./azure-translator";

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // User management routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid user data", errors: result.error.errors });
      }
      
      const user = await storage.createUser(result.data);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertUserSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid user data", errors: result.error.errors });
      }
      
      const user = await storage.updateUser(id, result.data);
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Content management routes
  app.get("/api/contents", async (req, res) => {
    try {
      const contents = await storage.getContents();
      res.json(contents);
    } catch (error) {
      console.error("Error fetching contents:", error);
      res.status(500).json({ message: "Failed to fetch contents" });
    }
  });

  app.get("/api/contents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const content = await storage.getContent(id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.post("/api/contents", async (req, res) => {
    try {
      const validatedData = insertContentSchema.parse(req.body);
      const content = await storage.createContent(validatedData);
      
      // Log activity
      await storage.createActivity({
        userId: validatedData.uploadedBy || null,
        action: "uploaded",
        entityType: "content",
        entityId: content.id,
        description: `Uploaded new content: ${content.title}`,
      });
      
      res.status(201).json(content);
    } catch (error) {
      console.error("Error creating content:", error);
      res.status(400).json({ message: "Failed to create content" });
    }
  });

  app.put("/api/contents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertContentSchema.partial().parse(req.body);
      const content = await storage.updateContent(id, validatedData);
      res.json(content);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(400).json({ message: "Failed to update content" });
    }
  });

  app.delete("/api/contents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteContent(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ message: "Failed to delete content" });
    }
  });

  // Translation project routes
  app.get("/api/translation-projects", async (req, res) => {
    try {
      const projects = await storage.getTranslationProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching translation projects:", error);
      res.status(500).json({ message: "Failed to fetch translation projects" });
    }
  });

  app.get("/api/translation-projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getTranslationProject(id);
      if (!project) {
        return res.status(404).json({ message: "Translation project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching translation project:", error);
      res.status(500).json({ message: "Failed to fetch translation project" });
    }
  });

  app.post("/api/translation-projects", async (req, res) => {
    try {
      const validatedData = insertTranslationProjectSchema.parse(req.body);
      const project = await storage.createTranslationProject(validatedData);
      
      // Log activity
      await storage.createActivity({
        userId: validatedData.assignedTo || null,
        action: "created",
        entityType: "project",
        entityId: project.id,
        description: `Created translation project for content ID ${project.contentId}`,
      });
      
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating translation project:", error);
      res.status(400).json({ message: "Failed to create translation project" });
    }
  });

  app.put("/api/translation-projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTranslationProjectSchema.partial().parse(req.body);
      const project = await storage.updateTranslationProject(id, validatedData);
      
      // Log activity for status changes
      if (validatedData.status) {
        await storage.createActivity({
          userId: project.assignedTo || null,
          action: "updated",
          entityType: "project",
          entityId: project.id,
          description: `Updated project status to ${validatedData.status}`,
        });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error updating translation project:", error);
      res.status(400).json({ message: "Failed to update translation project" });
    }
  });

  // Glossary routes
  app.get("/api/glossary", async (req, res) => {
    try {
      const terms = await storage.getGlossaryTerms();
      res.json(terms);
    } catch (error) {
      console.error("Error fetching glossary terms:", error);
      res.status(500).json({ message: "Failed to fetch glossary terms" });
    }
  });

  app.get("/api/glossary/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }
      const terms = await storage.searchGlossaryTerms(q);
      res.json(terms);
    } catch (error) {
      console.error("Error searching glossary terms:", error);
      res.status(500).json({ message: "Failed to search glossary terms" });
    }
  });

  app.post("/api/glossary", async (req, res) => {
    try {
      const validatedData = insertGlossaryTermSchema.parse(req.body);
      const term = await storage.createGlossaryTerm(validatedData);
      
      // Log activity
      await storage.createActivity({
        userId: validatedData.addedBy || null,
        action: "added",
        entityType: "glossary",
        entityId: term.id,
        description: `Added glossary term: ${term.koreanTerm} → ${term.englishTerm}`,
      });
      
      res.status(201).json(term);
    } catch (error) {
      console.error("Error creating glossary term:", error);
      res.status(400).json({ message: "Failed to create glossary term" });
    }
  });

  app.put("/api/glossary/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertGlossaryTermSchema.partial().parse(req.body);
      const term = await storage.updateGlossaryTerm(id, validatedData);
      res.json(term);
    } catch (error) {
      console.error("Error updating glossary term:", error);
      res.status(400).json({ message: "Failed to update glossary term" });
    }
  });

  app.delete("/api/glossary/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteGlossaryTerm(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting glossary term:", error);
      res.status(500).json({ message: "Failed to delete glossary term" });
    }
  });

  // Translation memory routes
  app.get("/api/translation-memory", async (req, res) => {
    try {
      const memory = await storage.getTranslationMemory();
      res.json(memory);
    } catch (error) {
      console.error("Error fetching translation memory:", error);
      res.status(500).json({ message: "Failed to fetch translation memory" });
    }
  });

  // Advanced TM search endpoint with fuzzy matching
  app.get("/api/translation-memory/search", async (req, res) => {
    try {
      const { 
        sourceText, 
        sourceLanguage, 
        targetLanguage, 
        similarity, 
        event, 
        topic, 
        translatorId, 
        limit 
      } = req.query;
      
      if (!sourceText || typeof sourceText !== 'string') {
        return res.status(400).json({ message: "Source text is required" });
      }

      const searchParams = {
        sourceText: sourceText as string,
        sourceLanguage: sourceLanguage as string || 'ko',
        targetLanguage: targetLanguage as string || 'en',
        similarity: similarity ? parseInt(similarity as string) : 70,
        event: event as string,
        topic: topic as string,
        translatorId: translatorId ? parseInt(translatorId as string) : undefined,
        limit: limit ? parseInt(limit as string) : 10
      };

      const matches = await storage.searchTranslationMemory(searchParams);
      res.json(matches);
    } catch (error) {
      console.error("Error searching translation memory:", error);
      res.status(500).json({ message: "Failed to search translation memory" });
    }
  });

  // TM feedback endpoint for tracking usage and quality
  app.post("/api/translation-memory/feedback", async (req, res) => {
    try {
      const validatedData = insertTmFeedbackSchema.parse(req.body);
      const feedback = await storage.createTmFeedback(validatedData);
      res.status(201).json(feedback);
    } catch (error) {
      console.error("Error creating TM feedback:", error);
      res.status(400).json({ message: "Failed to create TM feedback" });
    }
  });

  // TM segment versions endpoint
  app.get("/api/translation-memory/:id/versions", async (req, res) => {
    try {
      const tmSegmentId = parseInt(req.params.id);
      const versions = await storage.getTmVersions(tmSegmentId);
      res.json(versions);
    } catch (error) {
      console.error("Error fetching TM versions:", error);
      res.status(500).json({ message: "Failed to fetch TM versions" });
    }
  });

  app.post("/api/translation-memory", async (req, res) => {
    try {
      const validatedData = insertTranslationMemorySchema.parse(req.body);
      const memory = await storage.createTranslationMemory(validatedData);
      res.status(201).json(memory);
    } catch (error) {
      console.error("Error creating translation memory:", error);
      res.status(400).json({ message: "Failed to create translation memory" });
    }
  });

  // Activity routes
  app.get("/api/activities", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getActivities(limit);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Export routes
  app.get("/api/exports", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const exports = await storage.getExportJobs(userId);
      res.json(exports);
    } catch (error) {
      console.error("Error fetching export jobs:", error);
      res.status(500).json({ message: "Failed to fetch export jobs" });
    }
  });

  app.post("/api/exports", async (req, res) => {
    try {
      const validatedData = insertExportJobSchema.parse(req.body);
      const exportJob = await storage.createExportJob(validatedData);
      
      // In a real implementation, this would trigger the export process
      // For now, we'll just mark it as completed immediately
      setTimeout(async () => {
        try {
          await storage.updateExportJob(exportJob.id, {
            status: "completed",
            fileUrl: `/exports/${exportJob.id}.${exportJob.format}`,
            completedAt: new Date(),
          });
        } catch (error) {
          console.error("Error updating export job:", error);
        }
      }, 2000);
      
      res.status(201).json(exportJob);
    } catch (error) {
      console.error("Error creating export job:", error);
      res.status(400).json({ message: "Failed to create export job" });
    }
  });

  // Azure Custom Translator API endpoints
  
  // Get available custom models
  app.get("/api/azure-translator/models", async (req, res) => {
    try {
      const models = await azureTranslatorService.getCustomModels();
      res.json(models);
    } catch (error) {
      console.error("Error fetching custom models:", error);
      res.status(500).json({ message: "Failed to fetch custom models" });
    }
  });

  // Standard translation
  app.post("/api/azure-translator/translate", async (req, res) => {
    try {
      const { text, from = "ko", to = "en", category } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      const result = await azureTranslatorService.translateText({
        text,
        from,
        to,
        category,
      });

      res.json(result);
    } catch (error) {
      console.error("Error translating text:", error);
      res.status(500).json({ message: "Translation failed" });
    }
  });

  // Biblical domain-specific translation
  app.post("/api/azure-translator/translate/biblical", async (req, res) => {
    try {
      const { text, from = "ko", to = "en" } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      const translatedText = await azureTranslatorService.translateBiblical(text, from, to);
      
      res.json({ 
        translatedText,
        model: "biblical-ko-en-v1",
        category: "biblical"
      });
    } catch (error) {
      console.error("Error in biblical translation:", error);
      res.status(500).json({ message: "Biblical translation failed" });
    }
  });

  // Theological domain-specific translation
  app.post("/api/azure-translator/translate/theological", async (req, res) => {
    try {
      const { text, from = "ko", to = "en" } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      const translatedText = await azureTranslatorService.translateTheological(text, from, to);
      
      res.json({ 
        translatedText,
        model: "theological-ko-en-v1",
        category: "theological"
      });
    } catch (error) {
      console.error("Error in theological translation:", error);
      res.status(500).json({ message: "Theological translation failed" });
    }
  });

  // Batch translation with custom models
  app.post("/api/azure-translator/translate/batch", async (req, res) => {
    try {
      const { texts, category, from = "ko", to = "en" } = req.body;
      
      if (!texts || !Array.isArray(texts)) {
        return res.status(400).json({ message: "Texts array is required" });
      }

      const translations = await azureTranslatorService.translateBatch(texts, category, from, to);
      
      res.json({ 
        translations,
        category,
        count: translations.length
      });
    } catch (error) {
      console.error("Error in batch translation:", error);
      res.status(500).json({ message: "Batch translation failed" });
    }
  });

  // Translation quality assessment
  app.post("/api/azure-translator/quality", async (req, res) => {
    try {
      const { sourceText, translatedText, from = "ko", to = "en" } = req.body;
      
      if (!sourceText || !translatedText) {
        return res.status(400).json({ message: "Source and translated text are required" });
      }

      const quality = await azureTranslatorService.getTranslationQuality(sourceText, translatedText, from, to);
      
      res.json(quality);
    } catch (error) {
      console.error("Error assessing translation quality:", error);
      res.status(500).json({ message: "Quality assessment failed" });
    }
  });

  // Language detection
  app.post("/api/azure-translator/detect", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      const detection = await azureTranslatorService.detectLanguage(text);
      
      res.json(detection);
    } catch (error) {
      console.error("Error detecting language:", error);
      res.status(500).json({ message: "Language detection failed" });
    }
  });

  // Legacy translation endpoint for backward compatibility
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, from = "ko", to = "en" } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      const result = await azureTranslatorService.translateText({
        text,
        from,
        to,
      });

      res.json({ translatedText: result.translations[0]?.text || text });
    } catch (error) {
      console.error("Error in legacy translation:", error);
      res.status(500).json({ message: "Translation failed" });
    }
  });

  // File upload endpoint
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // In a real implementation, you would:
      // 1. Process the uploaded file (video/audio)
      // 2. Generate transcription using speech-to-text services
      // 3. Store the file and transcription
      
      res.json({
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        message: "File uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "File upload failed" });
    }
  });

  // User management routes
  app.get("/api/users", async (req, res) => {
    try {
      // In a real implementation, you'd have proper authentication
      // and only return user data for authorized requests
      res.json([]);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ message: "Failed to create user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
