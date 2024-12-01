export class PromptBuilder {
  build(content) {
    return `Extract 3-5 relevant tags from this chat content. 
    Each tag should be a single word or hyphenated phrase.
    Focus on main topics, skills, and content type.
    
    Content: ${content}
    
    Respond in this format only:
    tags: tag1, tag2, tag3`;
  }

  buildCustom(content, options = {}) {
    const {
      minTags = 3,
      maxTags = 5,
      focus = ['topics', 'skills', 'type']
    } = options;

    return `Extract ${minTags}-${maxTags} relevant tags from this chat content.
    Each tag should be a single word or hyphenated phrase.
    Focus on: ${focus.join(', ')}.
    
    Content: ${content}
    
    Respond in this format only:
    tags: tag1, tag2, tag3`;
  }
}