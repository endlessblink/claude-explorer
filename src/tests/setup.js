import { vi } from 'vitest';

// Mock browser API
global.browser = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn()
    }
  }
};

// Mock fetch
global.fetch = vi.fn();

// Mock DOM APIs that might not be in jsdom
global.HTMLElement.prototype.scrollIntoView = vi.fn();

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = '';
}); 