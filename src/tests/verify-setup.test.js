import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { verifyInstallation } from '../lib/utils/verify-setup';

// Mock fetch
global.fetch = vi.fn();

describe('verifyInstallation', () => {
  beforeEach(() => {
    // Reset fetch mock
    global.fetch.mockReset();

    // Mock successful model config response
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          models: [
            { name: 'mistral' },
            { name: 'llama2' }
          ]
        })
      });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should check server, Ollama, and models status', async () => {
    // Mock successful responses
    global.fetch
      // Server check
      .mockResolvedValueOnce({ ok: true })
      // Ollama check
      .mockResolvedValueOnce({ ok: true })
      // Model checks
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: true });

    const result = await verifyInstallation();

    expect(result).toEqual({
      server: true,
      ollama: true,
      models: {
        mistral: true,
        llama2: true
      }
    });

    // Verify all endpoints were called
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/health');
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:11434/api/tags');
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:11434/api/show', {
      method: 'POST',
      body: JSON.stringify({ name: 'mistral' })
    });
  });

  it('should handle server failure', async () => {
    // Mock failed server response
    global.fetch
      .mockRejectedValueOnce(new Error('Server error'))
      // Other successful responses
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: true });

    const result = await verifyInstallation();

    expect(result.server).toBe(false);
    expect(result.ollama).toBe(true);
  });

  it('should handle Ollama failure', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true }) // Server
      .mockRejectedValueOnce(new Error('Ollama error')) // Ollama
      .mockResolvedValueOnce({ ok: true }) // Models
      .mockResolvedValueOnce({ ok: true });

    const result = await verifyInstallation();

    expect(result.server).toBe(true);
    expect(result.ollama).toBe(false);
  });

  it('should handle model check failures', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true }) // Server
      .mockResolvedValueOnce({ ok: true }) // Ollama
      .mockRejectedValueOnce(new Error('Model error')) // First model
      .mockResolvedValueOnce({ ok: true }); // Second model

    const result = await verifyInstallation();

    expect(result.models).toEqual({
      mistral: false,
      llama2: true
    });
  });

  it('should handle config loading failure', async () => {
    // Mock failed config loading
    global.fetch.mockRejectedValueOnce(new Error('Config error'));

    const result = await verifyInstallation();

    expect(result.models).toEqual({});
  });
}); 