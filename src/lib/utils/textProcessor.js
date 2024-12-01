export class TextProcessor {
  processText(content) {
    return content.toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);
  }

  sanitizeText(content) {
    return content.trim().replace(/[\n\r]+/g, ' ');
  }

  truncateText(content, maxLength = 1000) {
    return content.length > maxLength 
      ? content.slice(0, maxLength) + '...'
      : content;
  }
}