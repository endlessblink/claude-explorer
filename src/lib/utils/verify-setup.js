async function loadModels() {
  try {
    const response = await fetch('/config/models.json');
    const config = await response.json();
    return config.models.map(model => model.name);
  } catch (error) {
    console.error('Failed to load models config:', error);
    return [];
  }
}

export async function verifyInstallation() {
  const checks = {
    ollama: false,
    server: false,
    models: {}
  };

  // Check local server
  try {
    const response = await fetch('http://localhost:3000/health');
    checks.server = response.ok;
  } catch (e) {
    console.error('Local server check failed:', e);
  }

  // Check Ollama
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    checks.ollama = response.ok;
  } catch (e) {
    console.error('Ollama check failed:', e);
  }

  // Check models
  const modelList = await loadModels();
  for (const modelName of modelList) {
    try {
      const response = await fetch('http://localhost:11434/api/show', {
        method: 'POST',
        body: JSON.stringify({ name: modelName })
      });
      checks.models[modelName] = response.ok;
    } catch (e) {
      console.error(`Model ${modelName} check failed:`, e);
      checks.models[modelName] = false;
    }
  }

  return checks;
} 