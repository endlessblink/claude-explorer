export class TagCache {
  constructor(maxSize = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  async getOrCompute(content, computeFn) {
    const hash = await this.hashContent(content);
    
    if (this.cache.has(hash)) {
      return this.cache.get(hash);
    }

    const result = await computeFn(content);
    
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(hash, result);
    return result;
  }

  async hashContent(content) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}