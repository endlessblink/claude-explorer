export class TagParser {
  parse(response) {
    const match = response.match(/tags:\s*(.+)/);
    if (!match) return [];
    
    return match[1]
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }

  validate(tags) {
    return tags.filter(tag => 
      tag.length >= 2 && 
      tag.length <= 30 &&
      /^[a-z0-9-]+$/.test(tag)
    );
  }

  normalize(tags) {
    return tags.map(tag => 
      tag.toLowerCase()
         .replace(/\s+/g, '-')
         .replace(/[^a-z0-9-]/g, '')
    );
  }
}