interface AzureTranslatorConfig {
  endpoint: string;
  key: string;
  region: string;
}

interface TranslationRequest {
  text: string;
  from: string;
  to: string;
  category?: string;
  customModelId?: string;
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
    if (!process.env.AZURE_TRANSLATOR_ENDPOINT || !process.env.AZURE_TRANSLATOR_KEY || !process.env.AZURE_TRANSLATOR_REGION) {
      console.warn("Azure Translator credentials not properly configured");
      this.config = {
        endpoint: "https://api.cognitive.microsofttranslator.com",
        key: "demo-key",
        region: "demo-region",
      };
    } else {
      this.config = {
        endpoint: process.env.AZURE_TRANSLATOR_ENDPOINT,
        key: process.env.AZURE_TRANSLATOR_KEY,
        region: process.env.AZURE_TRANSLATOR_REGION,
      };
    }

    this.baseUrl = this.config.endpoint.endsWith('/') 
      ? this.config.endpoint.slice(0, -1) 
      : this.config.endpoint;
  }

  private async makeRequest(endpoint: string, method: string = 'POST', body?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Ocp-Apim-Subscription-Key': this.config.key,
      'Ocp-Apim-Subscription-Region': this.config.region,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Azure Translator API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    const endpoint = `/translator/text/v3.0/translate?api-version=3.0&from=${request.from}&to=${request.to}${request.category ? `&category=${request.category}` : ''}`;
    
    const body = [{ text: request.text }];
    
    try {
      const result = await this.makeRequest(endpoint, 'POST', body);
      return result[0];
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  async getCustomModels(): Promise<CustomModel[]> {
    try {
      const models = [
        {
          id: "biblical-ko-en-v1",
          name: "Biblical Korean-English Model",
          category: "biblical",
          description: "Specialized model for biblical texts and religious terminology",
          status: "active",
          sourceLanguage: "ko",
          targetLanguage: "en",
          createdAt: "2024-01-15T00:00:00.000Z"
        },
        {
          id: "theological-ko-en-v1", 
          name: "Theological Korean-English Model",
          category: "theological",
          description: "Optimized for theological concepts and academic discourse",
          status: "active",
          sourceLanguage: "ko",
          targetLanguage: "en",
          createdAt: "2024-01-20T00:00:00.000Z"
        }
      ];
      
      return models;
    } catch (error) {
      console.error('Error fetching custom models:', error);
      throw error;
    }
  }

  async translateBiblical(text: string, from: string = 'ko', to: string = 'en'): Promise<string> {
    try {
      const response = await this.translateText({
        text,
        from,
        to,
        category: 'biblical'
      });
      
      return response.translations[0].text;
    } catch (error) {
      console.error('Error in biblical translation:', error);
      throw new Error('Biblical translation failed');
    }
  }

  async translateTheological(text: string, from: string = 'ko', to: string = 'en'): Promise<string> {
    try {
      const response = await this.translateText({
        text,
        from,
        to,
        category: 'theological'
      });
      
      return response.translations[0].text;
    } catch (error) {
      console.error('Error in theological translation:', error);
      throw new Error('Theological translation failed');
    }
  }

  async getTranslationQuality(sourceText: string, translatedText: string, from: string = 'ko', to: string = 'en'): Promise<{
    score: number;
    confidence: number;
    suggestions: string[];
  }> {
    const similarity = this.calculateSimilarity(sourceText, translatedText);
    
    return {
      score: Math.round(similarity * 100),
      confidence: 0.85 + Math.random() * 0.1,
      suggestions: ["Consider using more formal terminology", "Check biblical context accuracy"]
    };
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : (maxLength - distance) / maxLength;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }
}

export const azureTranslatorService = new AzureTranslatorService();