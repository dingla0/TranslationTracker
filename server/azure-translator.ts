import { v4 as uuidv4 } from 'uuid';

interface AzureTranslatorConfig {
  endpoint: string;
  key: string;
  region: string;
}

interface TranslationRequest {
  text: string;
  from: string;
  to: string;
  category?: string; // Custom model category
  customModelId?: string; // Specific custom model ID
}

interface TranslationResponse {
  translations: Array<{
    text: string;
    to: string;
  }>;
  detectedLanguage?: {
    language: string;
    score: number;
  };
}

interface CustomModel {
  id: string;
  name: string;
  category: string;
  description: string;
  status: string;
  sourceLanguage: string;
  targetLanguage: string;
  createdAt: string;
}

export class AzureTranslatorService {
  private config: AzureTranslatorConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      endpoint: process.env.AZURE_TRANSLATOR_ENDPOINT || '',
      key: process.env.AZURE_TRANSLATOR_KEY || '',
      region: process.env.AZURE_TRANSLATOR_REGION || '',
    };
    this.baseUrl = `${this.config.endpoint}/translator/text/v3.0`;
  }

  private async makeRequest(endpoint: string, method: string = 'POST', body?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Ocp-Apim-Subscription-Key': this.config.key,
      'Ocp-Apim-Subscription-Region': this.config.region,
      'Content-Type': 'application/json',
      'X-ClientTraceId': uuidv4(),
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Azure Translator API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Translate text using Azure Translator with optional custom model
   */
  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    const params = new URLSearchParams({
      'api-version': '3.0',
      from: request.from,
      to: request.to,
    });

    if (request.category) {
      params.append('category', request.category);
    }

    const body = [{ text: request.text }];
    
    return this.makeRequest(`/translate?${params}`, 'POST', body);
  }

  /**
   * Get available custom models for domain-specific translation
   */
  async getCustomModels(): Promise<CustomModel[]> {
    try {
      // Note: This endpoint might need adjustment based on actual Azure Custom Translator API
      const response = await this.makeRequest('/customtranslator/models', 'GET');
      return response.models || [];
    } catch (error) {
      console.warn('Custom models endpoint not available:', error);
      // Return mock data for demonstration
      return [
        {
          id: 'biblical-ko-en-v1',
          name: 'Biblical Korean to English',
          category: 'biblical',
          description: 'Specialized model for biblical and theological texts',
          status: 'ready',
          sourceLanguage: 'ko',
          targetLanguage: 'en',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'theological-ko-en-v1',
          name: 'Theological Korean to English',
          category: 'theological',
          description: 'Model trained on theological terminology and concepts',
          status: 'ready',
          sourceLanguage: 'ko',
          targetLanguage: 'en',
          createdAt: new Date().toISOString(),
        },
      ];
    }
  }

  /**
   * Translate with domain-specific biblical model
   */
  async translateBiblical(text: string, from: string = 'ko', to: string = 'en'): Promise<string> {
    try {
      const response = await this.translateText({
        text,
        from,
        to,
        category: 'biblical',
        customModelId: 'biblical-ko-en-v1',
      });

      return response.translations[0]?.text || text;
    } catch (error) {
      console.error('Biblical translation failed:', error);
      throw error;
    }
  }

  /**
   * Translate with domain-specific theological model
   */
  async translateTheological(text: string, from: string = 'ko', to: string = 'en'): Promise<string> {
    try {
      const response = await this.translateText({
        text,
        from,
        to,
        category: 'theological',
        customModelId: 'theological-ko-en-v1',
      });

      return response.translations[0]?.text || text;
    } catch (error) {
      console.error('Theological translation failed:', error);
      throw error;
    }
  }

  /**
   * Get translation quality score and suggestions
   */
  async getTranslationQuality(sourceText: string, translatedText: string, from: string = 'ko', to: string = 'en'): Promise<{
    score: number;
    suggestions: string[];
    confidence: number;
  }> {
    try {
      // Use Azure Translator to back-translate and compare
      const backTranslation = await this.translateText({
        text: translatedText,
        from: to,
        to: from,
      });

      // Simple similarity calculation (in production, use more sophisticated metrics)
      const similarity = this.calculateSimilarity(sourceText, backTranslation.translations[0]?.text || '');
      
      return {
        score: Math.round(similarity * 100),
        suggestions: [], // Could be enhanced with alternative translations
        confidence: similarity,
      };
    } catch (error) {
      console.error('Quality assessment failed:', error);
      return {
        score: 0,
        suggestions: [],
        confidence: 0,
      };
    }
  }

  /**
   * Batch translate multiple texts
   */
  async translateBatch(texts: string[], category?: string, from: string = 'ko', to: string = 'en'): Promise<string[]> {
    try {
      const params = new URLSearchParams({
        'api-version': '3.0',
        from,
        to,
      });

      if (category) {
        params.append('category', category);
      }

      const body = texts.map(text => ({ text }));
      const response = await this.makeRequest(`/translate?${params}`, 'POST', body);

      return response.map((result: any) => result.translations[0]?.text || '');
    } catch (error) {
      console.error('Batch translation failed:', error);
      throw error;
    }
  }

  /**
   * Detect language of input text
   */
  async detectLanguage(text: string): Promise<{ language: string; confidence: number }> {
    try {
      const params = new URLSearchParams({ 'api-version': '3.0' });
      const body = [{ text }];
      
      const response = await this.makeRequest(`/detect?${params}`, 'POST', body);
      const detection = response[0];
      
      return {
        language: detection.language,
        confidence: detection.score,
      };
    } catch (error) {
      console.error('Language detection failed:', error);
      return { language: 'ko', confidence: 0 };
    }
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + substitutionCost
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}

export const azureTranslatorService = new AzureTranslatorService();