import { expect, test, vi } from 'vitest';
import { TagAnalyzer } from '../lib/tagAnalyzer.js';
import { config } from '../config/config.js';

test('analyzeChatContent returns tags in keyword mode', async () => {
  const analyzer = new TagAnalyzer({ ...config, taggingMode: 'keyword' });
  const content = 'This is a programming tutorial about debugging code';
  
  const tags = await analyzer.analyzeChatContent(content);
  
  expect(tags).toContain('programming');
  expect(tags).toContain('tutorial');
  expect(tags).toContain('debugging');
});

test('falls back to keyword extraction on AI failure', async () => {
  const analyzer = new TagAnalyzer({ ...config, taggingMode: 'ai' });
  const content = 'A programming discussion';
  
  // Mock AI failure
  vi.spyOn(analyzer, 'getAITags').mockRejectedValue(new Error('AI failed'));
  
  const tags = await analyzer.analyzeChatContent(content);
  
  expect(tags).toContain('programming');
  expect(tags).toContain('discussion');
});