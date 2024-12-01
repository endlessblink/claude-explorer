# Claude Conversation Analyzer

A Chrome extension that automatically analyzes and tags Claude.ai conversations for better organization and searchability.

## Features

- 🏷️ Automatic conversation tagging
- 🔍 Real-time analysis
- 📊 Conversation statistics
- 🔎 Search and filter by tags
- 💾 Persistent storage
- 🎯 Topic detection

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/claude-conversation-analyzer.git
cd claude-conversation-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load in Chrome:
- Open Chrome and go to `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `dist` folder

## Development

### Project Structure
```
├── extension/          # Extension source files
│   ├── content.js     # Content script
│   ├── content.css    # Styles
│   ├── popup.html     # Extension popup
│   ├── popup.js       # Popup logic
│   └── background.js  # Service worker
├── dist/              # Built extension
└── src/              # Source code
```

### Build Commands
```bash
# Build extension
npm run build

# Clean and rebuild
Remove-Item -Path dist -Recurse -Force; npm run build
```

### Tag Categories
- Coding (python, javascript, programming)
- Math (calculations, equations)
- Writing (essays, content)
- Analysis (reviews, evaluations)
- AI (machine learning, models)
- General discussions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for Claude.ai by Anthropic
- Uses Chrome Extension Manifest V3 