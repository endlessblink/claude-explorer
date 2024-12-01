# Claude Conversation Analyzer - Working State Documentation

## Current Working State (December 1, 2023)
- Successfully detecting 632 conversations
- Generating tags correctly (7 unique tags)
- Working tag categories: general, ai, coding, analysis, chat, math, writing
- Popup interface showing statistics and filterable tags

## Key Components

### 1. File Structure
```
dist/
  ├── manifest.json
  ├── content.js
  ├── content.css
  ├── popup.html
  ├── popup.js
  └── background.js
```

### 2. Critical Selectors
- Conversation links: `a[href^="/chat/"]`
- Conversation titles: `[class*="truncate"]`
- Message containers: `.group.relative`
- Content text: `.whitespace-pre-wrap`

### 3. Working Features
- Real-time conversation detection
- Automatic tag generation
- Tag filtering and search
- Conversation statistics
- Persistent storage

## Implementation Details

### Content Script Strategy
1. Initial load with retry mechanism (10 attempts, 2s intervals)
2. MutationObserver watching for:
   - Class changes
   - Href attribute changes
   - New conversation links
3. Tag generation from conversation titles
4. Storage sync after each update

### Tag Generation Rules
```javascript
const topics = {
  'coding': ['python', 'javascript', 'code', 'programming', 'function', 'api', 'database'],
  'math': ['calculation', 'equation', 'math', 'solve', 'number'],
  'writing': ['essay', 'story', 'write', 'draft', 'edit', 'content'],
  'analysis': ['analyze', 'review', 'evaluate', 'assess'],
  'ai': ['machine learning', 'ai', 'model', 'neural', 'train'],
  'chat': ['conversation', 'discussion', 'help', 'question']
};
```

## Build Process
```bash
# Windows PowerShell build command
Remove-Item -Path dist -Recurse -Force; npm run build
```

## Testing Steps
1. Load unpacked extension from dist folder
2. Open claude.ai
3. Check console for initialization logs
4. Verify conversation detection
5. Test tag generation and filtering

## Known Working State
- Chrome Version: Latest (As of Dec 2023)
- Claude.ai DOM Structure: Current as of Dec 2023
- Extension Manifest: V3
- Storage: Chrome Local Storage

## Debugging Tips
1. Watch for console logs:
   - "Claude Tagger: Content script loaded"
   - "Initializing ClaudeAnalyzer..."
   - "Found conversation links: X"
2. Check storage in Chrome DevTools
3. Verify mutation observer triggers

## Future Improvements
1. Add full conversation content analysis
2. Implement custom tag creation
3. Add export/import functionality
4. Add tag statistics and trends
5. Implement search by conversation content 