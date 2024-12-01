export class KeywordDictionary {
  constructor() {
    this.keywords = new Set([
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

  hasKeyword(word) {
    return this.keywords.has(word.toLowerCase());
  }

  addKeyword(word) {
    this.keywords.add(word.toLowerCase());
  }

  removeKeyword(word) {
    this.keywords.delete(word.toLowerCase());
  }
}