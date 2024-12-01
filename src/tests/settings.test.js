import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TaggerSettings } from '../extension/settings';

// Mock browser.storage.local
const mockStorage = {
  get: vi.fn(),
  set: vi.fn()
};

global.browser = {
  storage: {
    local: mockStorage
  }
};

// Mock fetch
global.fetch = vi.fn();

describe('TaggerSettings', () => {
  let taggerSettings;
  let mockModels;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = '';
    
    // Mock models data
    mockModels = {
      models: [
        {
          name: "mistral",
          displayName: "Mistral 7B",
          description: "Fast model",
          recommended: true
        },
        {
          name: "llama2",
          displayName: "Llama 2",
          description: "Large model",
          recommended: false
        }
      ]
    };

    // Mock fetch response
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockModels)
    });

    // Mock storage
    mockStorage.get.mockResolvedValue({
      taggerSettings: {
        taggingMode: 'ai',
        ollamaModel: 'mistral',
        autoTag: true
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should load models on initialization', async () => {
    taggerSettings = new TaggerSettings();
    await vi.runAllTimersAsync();
    
    expect(global.fetch).toHaveBeenCalledWith('/config/models.json');
    expect(taggerSettings.models).toEqual(mockModels.models);
  });

  it('should create settings panel with correct model options', async () => {
    taggerSettings = new TaggerSettings();
    await vi.runAllTimersAsync();

    const modelSelect = document.querySelector('#ollamaModel');
    expect(modelSelect).toBeTruthy();
    expect(modelSelect.options.length).toBe(2);
    expect(modelSelect.options[0].value).toBe('mistral');
    expect(modelSelect.options[1].value).toBe('llama2');
  });

  it('should save settings when changed', async () => {
    taggerSettings = new TaggerSettings();
    await vi.runAllTimersAsync();

    const modelSelect = document.querySelector('#ollamaModel');
    modelSelect.value = 'llama2';
    modelSelect.dispatchEvent(new Event('change'));

    expect(mockStorage.set).toHaveBeenCalledWith({
      taggerSettings: expect.objectContaining({
        ollamaModel: 'llama2'
      })
    });
  });

  it('should handle model loading errors gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to load'));
    
    taggerSettings = new TaggerSettings();
    await vi.runAllTimersAsync();

    expect(taggerSettings.models).toEqual([]);
    const modelSelect = document.querySelector('#ollamaModel');
    expect(modelSelect.options.length).toBe(0);
  });
}); 