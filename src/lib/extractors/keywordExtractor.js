import { KeywordDictionary } from '../utils/keywordDictionary.js';
import { TextProcessor } from '../utils/textProcessor.js';

export class KeywordExtractor {
  constructor() {
    this.dictionary = new KeywordDictionary();
    this.textProcessor = new TextProcessor();
  }

  extract(content) {
    const words = this.textProcessor.processText(content);
    const tags = new Set();
    
    for (const word of words) {
      if (this.dictionary.hasKeyword(word)) {
        tags.add(word);
      }
    }

    return Array.from(tags).slice(0, 5);
  }
}