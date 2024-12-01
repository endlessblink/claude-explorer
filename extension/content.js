// Content script for Claude Chat Tagger
console.log('Claude Tagger: Content script loaded');

class ClaudeAnalyzer {
  constructor() {
    console.log('Initializing ClaudeAnalyzer...');
    this.conversations = [];
    this.tags = new Set();
    this.setupMutationObserver();
    
    // Initial scan with retries
    this.retryAnalysis(10, 2000); // Try 10 times, 2 second intervals
  }

  retryAnalysis(maxAttempts, interval) {
    let attempts = 0;
    const retry = () => {
      attempts++;
      console.log(`Attempt ${attempts} to analyze conversations...`);
      
      this.analyzeConversations().then(found => {
        if (!found && attempts < maxAttempts) {
          setTimeout(retry, interval);
        }
      });
    };
    retry();
  }

  setupMutationObserver() {
    console.log('Setting up MutationObserver...');
    const observer = new MutationObserver((mutations) => {
      // Only trigger on relevant changes
      const shouldAnalyze = mutations.some(mutation => {
        const target = mutation.target;
        return target.classList?.contains('overflow-y-auto') ||
               target.classList?.contains('h-full') ||
               target.tagName === 'A' ||
               target.closest('a[href^="/chat/"]');
      });
      
      if (shouldAnalyze) {
        console.log('Relevant DOM mutation detected');
        this.analyzeConversations();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'href']
    });
  }

  async analyzeConversations() {
    // Find all conversation links in the sidebar
    const conversationLinks = document.querySelectorAll('a[href^="/chat/"]');
    console.log('Found conversation links:', conversationLinks.length);
    
    if (conversationLinks.length === 0) {
      console.log('No conversations found yet');
      return false;
    }

    let processedCount = 0;
    for (const link of conversationLinks) {
      try {
        const conversationId = link.href.split('/').pop();
        if (this.conversations.some(c => c.id === conversationId)) {
          continue;
        }

        // Get conversation title
        const titleElement = link.querySelector('[class*="truncate"]') || link;
        const title = titleElement.textContent.trim();
        
        // Get timestamp
        const timeElement = link.querySelector('time') || link.querySelector('span:last-child');
        const timestamp = timeElement?.textContent || new Date().toISOString();

        // Create conversation object
        const conversation = {
          id: conversationId,
          title: title || 'Untitled Conversation',
          timestamp: timestamp,
          tags: this.generateInitialTags(title)
        };

        console.log('Processing conversation:', {
          id: conversation.id,
          title: conversation.title
        });

        this.conversations.push(conversation);
        conversation.tags.forEach(tag => this.tags.add(tag));
        processedCount++;

      } catch (error) {
        console.error('Error processing conversation:', error);
      }
    }

    if (processedCount > 0) {
      console.log(`Processed ${processedCount} new conversations`);
      await this.saveToStorage();
      return true;
    }

    return false;
  }

  generateInitialTags(title) {
    const tags = new Set();
    const content = title.toLowerCase();

    // Topic detection from title
    const topics = {
      'coding': ['python', 'javascript', 'code', 'programming', 'function', 'api', 'database'],
      'math': ['calculation', 'equation', 'math', 'solve', 'number'],
      'writing': ['essay', 'story', 'write', 'draft', 'edit', 'content'],
      'analysis': ['analyze', 'review', 'evaluate', 'assess'],
      'ai': ['machine learning', 'ai', 'model', 'neural', 'train'],
      'chat': ['conversation', 'discussion', 'help', 'question']
    };

    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some(keyword => content.includes(keyword))) {
        tags.add(topic);
      }
    }

    // Add default tag if none found
    if (tags.size === 0) {
      tags.add('general');
    }

    return Array.from(tags);
  }

  async saveToStorage() {
    try {
      await chrome.storage.local.set({
        conversations: this.conversations,
        tags: Array.from(this.tags)
      });
      console.log('Saved to storage:', {
        conversationCount: this.conversations.length,
        tagCount: this.tags.size,
        lastSaved: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }
}

// Initialize the analyzer
console.log('Starting Claude Analyzer...');
const analyzer = new ClaudeAnalyzer();