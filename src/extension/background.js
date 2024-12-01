// Listen for installation
browser.runtime.onInstalled.addListener(() => {
  console.log('Claude Chat Tagger installed');
});

// Listen for messages from content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ANALYZE_CHAT') {
    // Handle chat analysis request
    console.log('Analyzing chat:', message.content);
    // TODO: Implement chat analysis
    sendResponse({ success: true });
  }
}); 