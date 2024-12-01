import { TaggerSettings } from './settings.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    // Initialize settings
    const settings = new TaggerSettings();
    
    // Check connection status on load
    settings.checkConnection();

    // Setup test interface handlers
    const analyzeBtn = document.getElementById('analyzeBtn');
    const testContent = document.getElementById('testContent');
    const tagsOutput = document.getElementById('tagsOutput');

    analyzeBtn.addEventListener('click', async () => {
      const content = testContent.value.trim();
      if (!content) {
        tagsOutput.innerHTML = '<p style="color: #f44336;">Please enter some text to analyze</p>';
        return;
      }

      try {
        // Get current model from settings
        const modelSelect = document.getElementById('ollamaModel');
        const model = modelSelect ? modelSelect.value : 'llama3.2:3b';

        // Show loading state
        analyzeBtn.disabled = true;
        tagsOutput.innerHTML = '<p>Analyzing...</p>';

        // Call analyze endpoint
        const response = await fetch('http://localhost:3000/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content,
            model
          })
        });

        if (!response.ok) {
          throw new Error('Analysis failed');
        }

        const { tags } = await response.json();
        
        // Display tags
        tagsOutput.innerHTML = tags.length > 0
          ? tags.map(tag => `<span class="tag">${tag}</span>`).join('')
          : '<p>No tags generated</p>';

      } catch (error) {
        console.error('Analysis error:', error);
        tagsOutput.innerHTML = `<p style="color: #f44336;">Error: ${error.message}</p>`;
      } finally {
        analyzeBtn.disabled = false;
      }
    });
  }
}); 