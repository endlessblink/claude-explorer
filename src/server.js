import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const DEFAULT_MODEL = 'llama3.2:3b';

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Tag analysis endpoint
app.post('/analyze', async (req, res) => {
  try {
    const { content, model = DEFAULT_MODEL } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Load prompt template
    const promptTemplate = await fetch(new URL('../prompts/tag_extraction.txt', import.meta.url))
      .then(res => res.text());
    
    const prompt = promptTemplate.replace('{content}', content);

    // Call Ollama API
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error('Ollama API request failed');
    }

    const data = await response.json();
    const tags = data.response
      .replace('tags:', '')
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);

    res.json({ tags });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze content' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});