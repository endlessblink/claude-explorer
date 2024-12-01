import fetch from 'node-fetch';
import { KeywordExtractor } from './extractors/keywordExtractor.js';
import { AIExtractor } from './extractors/aiExtractor.js';
import { RetryStrategy } from './utils/retryStrategy.js';
import { PromptBuilder } from './utils/promptBuilder.js';

export class TagAnalyzer {
  constructor(config) {
    this.config = config;
    this.keywordExtractor = new KeywordExtractor();
    this.aiExtractor = new AIExtractor(config);
    this.retryStrategy = new RetryStrategy(config.retryAttempts, config.retryDelay);
  }

  async analyzeChatContent(content) {
    try {
      const mode = this.config.taggingMode;
      
      if (mode === 'keyword') {
        return this.keywordExtractor.extract(content);
      }

      if (mode === 'ai' || mode === 'hybrid') {
        const aiTags = await this.retryStrategy.execute(() => 
          this.aiExtractor.extract(content)
        );
        
        if (mode === 'hybrid') {
          const keywordTags = this.keywordExtractor.extract(content);
          return [...new Set([...aiTags, ...keywordTags])];
        }
        
        return aiTags;
      }

      throw new Error('Invalid tagging mode');
    } catch (error) {
      console.error('Tag analysis failed:', error);
      return this.keywordExtractor.extract(content);
    }
  }
}