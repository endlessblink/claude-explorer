import fetch from 'node-fetch';
import { PromptBuilder } from '../utils/promptBuilder.js';
import { TagParser } from '../utils/tagParser.js';

export class AIExtractor {
  constructor(config) {
    this.config = config;
    this.promptBuilder = new PromptBuilder();
    this.tagParser = new TagParser();
  }

  async extract(content) {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.config.ollamaModel,
        prompt: this.promptBuilder.build(content),
        temperature: 0.3,
        max_tokens: 100
      })
    });

    if (!response.ok) {
      throw new Error('AI tag generation failed');
    }

    const data = await response.json();
    return this.tagParser.parse(data.response);
  }
}