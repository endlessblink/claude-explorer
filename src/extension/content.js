console.log('Claude Tagger: Content script loaded');

// Utility to create tag elements
const createTagElement = (tagText) => {
  const tag = document.createElement('span');
  tag.className = 'claude-tag';
  tag.textContent = tagText;
  return tag;
};

// Add loading indicator
const showLoading = (conversationElement) => {
  const loadingSpan = document.createElement('span');
  loadingSpan.className = 'tag-loading';
  loadingSpan.textContent = '⌛ Analyzing...';
  loadingSpan.style.color = '#888';
  loadingSpan.style.marginLeft = '8px';
  conversationElement.appendChild(loadingSpan);
  return loadingSpan;
};

// Process a single conversation
async function processConversation(conversationElement) {
  console.log('Processing single conversation');
  
  // Skip if already processed
  if (conversationElement.querySelector('.claude-tag')) {
    console.log('Conversation already tagged, skipping');
    return;
  }

  // Try to find the title element using the exact path
  const titleElement = conversationElement.querySelector('div > div:first-child > div:first-child');
  console.log('Title element:', titleElement);
  
  if (!titleElement) {
    console.log('No title element found');
    return;
  }

  // Get the actual text content
  const title = titleElement.textContent.trim();
  console.log('Found title:', title);
  
  if (!title) {
    console.log('Empty title, skipping');
    return;
  }
  
  const loadingIndicator = showLoading(titleElement);

  try {
    console.log('Calling analyze endpoint...');
    const response = await fetch('http://localhost:3000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: title,
        model: 'llama3.2:3b'
      })
    });

    console.log('Got response:', response);
    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.status}`);
    }

    const { tags } = await response.json();
    console.log('Received tags:', tags);
    
    // Remove loading indicator
    loadingIndicator.remove();

    // Add tags
    const tagContainer = document.createElement('div');
    tagContainer.className = 'flex items-center gap-2';
    tagContainer.style.marginTop = '4px';
    tags.forEach(tag => {
      const tagElement = createTagElement(tag);
      tagContainer.appendChild(tagElement);
    });
    
    // Insert after the title
    titleElement.parentElement.appendChild(tagContainer);

  } catch (error) {
    console.error('Failed to analyze conversation:', error);
    loadingIndicator.textContent = '❌ Analysis failed';
    loadingIndicator.style.color = '#f44336';
  }
}

// Main function to process conversations
async function processConversations() {
  console.log('Starting to process conversations...');
  
  // Find all conversation links using the exact path
  const conversations = document.querySelectorAll('ul.flex > li > div > div > div > a');
  console.log('Found conversations:', conversations.length);
  
  const unprocessedConversations = Array.from(conversations)
    .filter(conv => !conv.querySelector('.claude-tag'))
    .slice(0, 10); // Process only first 10 untagged conversations
    
  console.log('Unprocessed conversations:', unprocessedConversations.length);

  if (unprocessedConversations.length === 0) {
    console.log('No new conversations to process');
    return;
  }

  // Process conversations sequentially
  for (const conversation of unprocessedConversations) {
    console.log('Processing conversation:', conversation);
    await processConversation(conversation);
    // Add a small delay between processing each conversation
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// Add the tag button
function addTagButton() {
  // Remove existing button if any
  const existingBtn = document.querySelector('.claude-tagger-container');
  if (existingBtn) {
    existingBtn.remove();
  }

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'claude-tagger-container';
  
  const button = document.createElement('button');
  button.className = 'claude-tagger-btn';
  button.innerHTML = '🏷️ Tag Conversations';
  button.onclick = processConversations;
  
  buttonContainer.appendChild(button);
  document.body.appendChild(buttonContainer);
}

// Initialize
function init() {
  console.log('Initializing Claude Tagger...');
  addTagButton();
}

// Run on page load
init();

// Watch for navigation/DOM changes
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      // Check if new conversations were added
      const hasNewConversations = Array.from(mutation.addedNodes).some(node => 
        node.nodeType === 1 && (
          node.matches?.('a[href^="/chat"]') || 
          node.matches?.('[role="listitem"]')
        )
      );
      
      if (hasNewConversations) {
        init();
      }
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
}); 