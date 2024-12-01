document.addEventListener('DOMContentLoaded', async () => {
  const { conversations = [], tags = [] } = await chrome.storage.local.get(['conversations', 'tags']);
  
  const tagList = document.getElementById('tagList');
  const conversationList = document.getElementById('conversationList');
  const stats = document.getElementById('stats');
  const searchBox = document.getElementById('searchBox');
  
  let activeTag = null;
  let searchQuery = '';

  // Show statistics
  updateStats(conversations, tags);

  // Create tag filters
  createTagFilters(tags);

  // Initial display
  displayConversations(filterConversations(conversations));

  // Setup search
  searchBox.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    displayConversations(filterConversations(conversations));
  });

  function updateStats(conversations, tags) {
    const now = new Date();
    const recentCount = conversations.filter(c => {
      const convDate = new Date(c.timestamp);
      return (now - convDate) < 24 * 60 * 60 * 1000; // Last 24 hours
    }).length;

    const tagCounts = {};
    conversations.forEach(conv => {
      conv.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag, count]) => `${tag} (${count})`);

    stats.innerHTML = `
      <div><strong>${conversations.length}</strong> total conversations</div>
      <div><strong>${recentCount}</strong> in the last 24 hours</div>
      <div><strong>${tags.length}</strong> unique tags</div>
      ${topTags.length ? `<div>Top tags: ${topTags.join(', ')}</div>` : ''}
    `;
  }

  function createTagFilters(tags) {
    tagList.innerHTML = '';
    const sortedTags = Array.from(tags).sort((a, b) => a.localeCompare(b));
    sortedTags.forEach(tag => {
      const tagElement = document.createElement('div');
      tagElement.className = 'tag';
      tagElement.textContent = tag;
      tagElement.addEventListener('click', () => {
        if (activeTag === tag) {
          activeTag = null;
          tagElement.classList.remove('active');
        } else {
          document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
          activeTag = tag;
          tagElement.classList.add('active');
        }
        displayConversations(filterConversations(conversations));
      });
      tagList.appendChild(tagElement);
    });
  }

  function filterConversations(conversations) {
    return conversations.filter(conv => {
      const matchesTag = !activeTag || conv.tags.includes(activeTag);
      const matchesSearch = !searchQuery || 
        conv.title.toLowerCase().includes(searchQuery) ||
        conv.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
        conv.messages.some(msg => msg.content.toLowerCase().includes(searchQuery));
      return matchesTag && matchesSearch;
    });
  }

  function displayConversations(convs) {
    if (convs.length === 0) {
      conversationList.innerHTML = `
        <div class="empty-state">
          ${searchQuery || activeTag ? 'No matching conversations found' : 'No conversations yet'}
        </div>
      `;
      return;
    }

    conversationList.innerHTML = '';
    convs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .forEach(conv => {
        const item = document.createElement('div');
        item.className = 'conversation-item';
        
        const date = new Date(conv.timestamp);
        const timeString = date.toLocaleString();
        
        const preview = conv.messages[0]?.content?.slice(0, 100) + '...' || 'No content';
        
        item.innerHTML = `
          <div class="conversation-title">${conv.title}</div>
          <div class="conversation-time">${timeString}</div>
          <div class="conversation-preview"><small>${preview}</small></div>
          <div class="conversation-tags">
            ${conv.tags.map(tag => `<span class="conversation-tag">${tag}</span>`).join('')}
          </div>
        `;
        
        item.addEventListener('click', () => {
          chrome.tabs.create({
            url: `https://claude.ai/chat/${conv.id}`
          });
        });
        
        conversationList.appendChild(item);
      });
  }
}); 