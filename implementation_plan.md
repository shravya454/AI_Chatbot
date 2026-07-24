# Implementation Plan - Mobile AI Chatbot (React Native + Expo)

Build a modern, feature-rich React Native mobile AI Chatbot application powered by the Google Gemini API, with local persistence via AsyncStorage, Dark Mode, Markdown formatting, Copy/Regenerate capabilities, Suggested Prompts, Message Search, and Chat Export.

## User Review Required

> [!IMPORTANT]
> **API Key Setup**: The app will support both a custom user-configurable Gemini API Key (stored locally in `AsyncStorage` via an in-app Settings modal) and an environment fallback (`EXPO_PUBLIC_GEMINI_API_KEY`).
>
> **Expo Web & Mobile Compatibility**: The app will be created using `create-expo-app` with React Native Web support enabled so it can be run and previewed seamlessly on Web as well as iOS/Android devices.

## Open Questions

> [!NOTE]
> 1. **Default Gemini Model**: We will use `gemini-1.5-flash` / `gemini-2.5-flash` endpoint via REST API (using standard `fetch` or `axios`). Users can also supply their API key directly in the app settings modal.
> 2. **Export Format**: Chat export will generate a `.txt` file containing timestamped conversation logs using React Native's Web/Native file downloading mechanisms.

---

## Proposed Architecture & Structure

The project structure will strictly adhere to the prompt requirements with extensions for full features:

```text
mobile-ai-chatbot/
├── assets/                  # App icons, avatars, sound/graphics
├── components/
│   ├── ChatBubble.js        # Message bubble with copy, markdown, timestamp
│   ├── ChatInput.js         # Input field with char counter, send button, actions
│   ├── Header.js            # App header with avatar, title, dark mode, clear, search & settings
│   ├── LoadingIndicator.js  # Animated typing bubble indicator
│   ├── SuggestedPrompts.js  # Quick prompt suggestion chips
│   ├── SearchModal.js       # Search bar & filtered list modal
│   └── SettingsModal.js     # API key configuration & theme options
├── screens/
│   └── ChatScreen.js        # Main conversational screen with FlatList & state management
├── services/
│   └── geminiApi.js         # Gemini API integration service with retry, error handling
├── storage/
│   └── storage.js           # AsyncStorage helper methods (load, save, clear, settings)
├── utils/
│   ├── constants.js        # Color palettes (Light & Dark), default suggestions, system prompt
│   └── formatters.js       # Date/timestamp and text export formatters
├── App.js                   # Root component with ThemeProvider & SafeAreaView
├── README.md                # Detailed project documentation & guide
└── package.json             # Expo dependencies
```

---

## Key Feature Implementation Strategy

### 1. Design System & Theme Support (Dark / Light Mode)
- Unified color palette in `utils/constants.js` supporting both Light Mode (soft blues/grays) and Dark Mode (sleek slate/midnight dark theme).
- Context or React State based theme switching so all components dynamically update background, text, card, and bubble styles.

### 2. Chat Interface & Animations
- `FlatList` with `inverted={false}` or `ref.scrollToEnd()` for automatic smooth scrolling to latest messages.
- User messages aligned to the right (primary accent gradient/color).
- AI messages aligned to the left with avatar icon, formatted timestamp, copy button, and markdown renderer.
- Animated typing indicator (`LoadingIndicator.js`) with pulse/bounce dots while awaiting API response.

### 3. Gemini API Integration (`services/geminiApi.js`)
- Standardized REST call to Google Gemini API (`v1beta/models/gemini-1.5-flash:generateContent`).
- Sends full conversation history context so the AI maintains multi-turn conversation memory.
- Error handling for invalid keys, network offline, rate limits, timeouts, and empty responses.

### 4. Storage & Persistence (`storage/storage.js`)
- Local persistence using `@react-native-async-storage/async-storage`.
- Async getters and setters for:
  - `MESSAGES`: Saved message array with timestamps, role (`user`/`model`), ID, status.
  - `SETTINGS`: Custom API Key, Dark Mode preference.

### 5. Advanced Features
- **Suggested Prompts**: Display pill cards for quick prompts (e.g. "Explain Quantum Physics simply", "Write a Python script", "Summarize key ideas").
- **Copy Response**: Clipboard copy action on AI response bubbles with visual feedback.
- **Regenerate Response**: Button to re-trigger the API for the last prompt.
- **Character Counter**: Input field display showing character usage (e.g. `24 / 1000`).
- **Clear Chat**: Header action with explicit confirmation alert before clearing storage.
- **Search Messages**: Real-time keyword filter across chat history.
- **Export Chat**: Download/Export formatted conversation text.

---

## Verification Plan

### Automated & Build Verification
1. Initialize Expo project in workspace: `npx create-expo-app ./ --template blank`
2. Install necessary packages: `@react-native-async-storage/async-storage`, `lucide-react-native` or `@expo/vector-icons`, `react-native-markdown-display` (or custom markdown renderer), `expo-clipboard`, `expo-sharing`, `expo-file-system`.
3. Verify project structure and code validity.

### Manual & Interactive Verification
1. Launch Expo web server (`npx expo start --web` or test runner) and verify responsive design on both mobile and web viewpoints.
2. Test message sending, Gemini API integration, typing animation state, error banners, dark/light mode toggle, suggested prompt clicks, message search, clear chat confirmation, export, and AsyncStorage persistence after browser refresh.
