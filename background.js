// Initialize storage on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Initializing Claude Analyzer extension...');
  chrome.storage.local.set({ 
    conversations: [],
    tags: []
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request.type);
  
  if (request.type === 'getConversations') {
    chrome.storage.local.get(['conversations'], result => {
      console.log('Returning conversations:', result.conversations?.length || 0);
      sendResponse(result.conversations || []);
    });
    return true;
  }
  
  if (request.type === 'getTags') {
    chrome.storage.local.get(['tags'], result => {
      console.log('Returning tags:', result.tags?.length || 0);
      sendResponse(result.tags || []);
    });
    return true;
  }

  if (request.type === 'clearData') {
    chrome.storage.local.set({ 
      conversations: [],
      tags: []
    }, () => {
      console.log('Data cleared');
      sendResponse({ success: true });
    });
    return true;
  }
}); 