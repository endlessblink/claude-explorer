export class RetryStrategy {
  constructor(maxAttempts = 3, delayMs = 1000) {
    this.maxAttempts = maxAttempts;
    this.delayMs = delayMs;
  }

  async execute(fn) {
    let lastError;

    for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (attempt < this.maxAttempts) {
          await this.delay(attempt);
        }
      }
    }

    throw lastError;
  }

  private async delay(attempt) {
    const backoffMs = this.delayMs * Math.pow(2, attempt - 1);
    await new Promise(resolve => setTimeout(resolve, backoffMs));
  }
}