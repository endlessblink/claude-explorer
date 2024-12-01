export class TaggerSettings {
  constructor() {
    this.loadModels();
    this.createSettingsPanel();
    this.loadSettings();
  }

  async loadModels() {
    try {
      const response = await fetch('/config/models.json');
      const config = await response.json();
      this.models = config.models;
    } catch (error) {
      console.error('Failed to load models:', error);
      this.models = [];
    }
  }

  createSettingsPanel() {
    const template = `
      <div class="tagger-settings">
        <h3>Tagging Settings</h3>
        
        <!-- Tagging Mode -->
        <div class="setting-group">
          <label>Tagging Mode:</label>
          <select id="taggingMode">
            <option value="ai">AI (Ollama)</option>
            <option value="keyword">Keyword Only</option>
            <option value="hybrid">Hybrid (AI + Keyword)</option>
          </select>
        </div>

        <!-- Model Selection -->
        <div class="setting-group" id="modelSettings">
          <label>Ollama Model:</label>
          <select id="ollamaModel">
            ${this.models.map(model => `
              <option value="${model.name}" 
                      ${model.recommended ? 'selected' : ''}>
                ${model.displayName} - ${model.description}
              </option>
            `).join('')}
          </select>
        </div>

        <!-- Auto-tag Settings -->
        <div class="setting-group">
          <label>
            <input type="checkbox" id="autoTag" checked>
            Auto-tag new messages
          </label>
        </div>

        <!-- Connection Status -->
        <div class="status-group">
          <div>Ollama Status: <span id="ollamaStatus">Checking...</span></div>
          <button id="checkConnection">Check Connection</button>
        </div>
      </div>
    `;

    this.panel = document.createElement('div');
    this.panel.innerHTML = template;
    document.body.appendChild(this.panel);
    this.attachEventListeners();
  }

  async loadSettings() {
    const settings = await browser.storage.local.get('taggerSettings');
    if (settings.taggerSettings) {
      this.applySettings(settings.taggerSettings);
    }
  }

  attachEventListeners() {
    const checkBtn = this.panel.querySelector('#checkConnection');
    checkBtn.addEventListener('click', () => this.checkConnection());

    ['taggingMode', 'ollamaModel', 'autoTag'].forEach(id => {
      const element = this.panel.querySelector(`#${id}`);
      element.addEventListener('change', () => this.saveSettings());
    });
  }

  async checkConnection() {
    const statusElement = this.panel.querySelector('#ollamaStatus');
    statusElement.textContent = 'Checking...';

    try {
      const checks = await import('../lib/utils/verify-setup.js')
        .then(module => module.verifyInstallation());

      statusElement.textContent = checks.ollama ? 'Connected' : 'Disconnected';
      statusElement.style.color = checks.ollama ? '#4CAF50' : '#f44336';
    } catch (error) {
      statusElement.textContent = 'Error';
      statusElement.style.color = '#f44336';
      console.error('Connection check failed:', error);
    }
  }

  async saveSettings() {
    const settings = {
      taggingMode: this.panel.querySelector('#taggingMode').value,
      ollamaModel: this.panel.querySelector('#ollamaModel').value,
      autoTag: this.panel.querySelector('#autoTag').checked
    };

    await browser.storage.local.set({ taggerSettings: settings });
  }

  applySettings(settings) {
    Object.entries(settings).forEach(([key, value]) => {
      const element = this.panel.querySelector(`#${key}`);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = value;
        } else {
          element.value = value;
        }
      }
    });
  }
} 