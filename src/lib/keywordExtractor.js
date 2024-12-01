export class KeywordExtractor {
  constructor() {
    this.commonKeywords = new Set([
      'programming',
      'development',
      'analysis',
      'tutorial',
      'discussion',
      'question',
      'problem-solving',
      'debugging',
      'architecture',
      'design',
      'testing'
    ]);
  }

  extract(content) {
    const words = content.toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);

    const tags = new Set();
    
    for (const word of words) {
      if (this.commonKeywords.has(word)) {
        tags.add(word);
      }
    }

    return Array.from(tags).slice(0, 5);
  }
}