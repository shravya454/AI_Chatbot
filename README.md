# Mobile AI Chatbot (React Native + Expo)

A modern, feature-rich Mobile AI Chatbot application built using **React Native**, **Expo**, and the **Google Gemini API**. The application allows users to interact with an intelligent AI assistant through a sleek, responsive chat interface with local chat persistence, dark mode support, message searching, and chat export options.

---

## Features

### 💬 Core Chat Experience
- **Interactive Chat Interface**: User messages on the right, AI assistant responses on the left.
- **Auto-Scrolling**: Automatically scrolls to the latest incoming message.
- **Timestamps**: Display formatted timestamps for every message.
- **Avatar & Header**: Custom AI assistant header with online status indicator.

### 🤖 Gemini AI Integration
- **Google Gemini API Integration**: Multi-turn conversation context memory powered by `gemini-2.5-flash`.
- **Custom & Fallback API Key Support**: In-app settings modal to input personal Gemini API key or use environment key (`EXPO_PUBLIC_GEMINI_API_KEY`).
- **Error Handling**: Graceful error handling for missing keys, network issues, rate limits, and server timeouts.
- **Empty Message Prevention**: Prevents sending empty or whitespace-only inputs.

### 💾 Local Chat Persistence
- **AsyncStorage Integration**: Save and load conversation history automatically across app sessions.
- **Clear Chat History**: Easily wipe conversation history with confirmation dialogs.

### 🎨 Modern UI & Customization
- **Dark Mode / Light Mode**: Dynamic theme switcher with polished color palettes.
- **Responsive Layout**: Designed for optimal viewing on iOS, Android, and Web screens.
- **Animated Typing Indicator**: Bouncing dot loading animation when awaiting AI responses.
- **Suggested Prompt Chips**: One-tap quick suggestion cards to jumpstart conversations.

### 🛠️ Advanced Tools & Controls
- **Copy AI Response**: One-tap clipboard copy with visual feedback toast.
- **Regenerate Response**: Re-trigger AI response generation for the last prompt.
- **Character Counter**: Live character counter (`X / 1000`) for input field.
- **Message Search**: Modal search bar to filter and search past chat history in real-time.
- **Export Chat History**: Export conversation history into a formatted `.txt` file (download on web, share sheet on mobile).

---

## Project Folder Structure

```text
mobile-ai-chatbot/
├── assets/                    # Static assets & icons
├── components/                # Reusable UI components
│   ├── ChatBubble.js          # Chat bubble (Markdown, timestamps, copy, regenerate)
│   ├── ChatInput.js           # Fixed bottom input bar with character counter
│   ├── Header.js              # Top bar with AI avatar, title & action icons
│   ├── LoadingIndicator.js    # Animated typing indicator
│   ├── SuggestedPrompts.js    # Quick action prompt pills
│   ├── SearchModal.js         # Real-time search modal for chat history
│   └── SettingsModal.js       # Gemini API key configuration & model info
├── screens/
│   └── ChatScreen.js          # Main chat view managing state & layout
├── services/
│   └── geminiApi.js           # Gemini API client & error handler
├── storage/
│   └── storage.js             # AsyncStorage helpers (messages & settings)
├── utils/
│   ├── constants.js           # Light & Dark themes, defaults & configurations
│   └── formatters.js          # Timestamp & export formatters
├── App.js                     # Root entry point wrapped in SafeAreaProvider
├── app.json                   # Expo configuration
├── README.md                  # Project documentation
└── package.json               # Dependencies and scripts
```

---

## Technologies Used

- **React Native** (v0.86.0)
- **Expo Framework** (v57.0.8)
- **JavaScript (ES6+)**
- **Google Gemini API** (`v1beta/models/gemini-2.5-flash`)
- **AsyncStorage** (`@react-native-async-storage/async-storage`)
- **Expo Vector Icons** (`@expo/vector-icons`)
- **Expo Clipboard** (`expo-clipboard`)
- **Expo FileSystem & Sharing** (`expo-file-system`, `expo-sharing`)
- **React Native Safe Area Context** (`react-native-safe-area-context`)

---

## Installation & Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Expo Go App](https://expo.dev/go) on iOS/Android or web browser

### 1. Clone & Install Dependencies

```bash
cd AI_Chat
npm install
```

### 2. Configure Gemini API Key

You can configure your Google Gemini API Key in two ways:

#### Option A: In-App Settings (Recommended)
1. Launch the app.
2. Tap the **Settings icon** (⚙️) in the top-right header.
3. Paste your **Gemini API Key** obtained from [Google AI Studio](https://aistudio.google.com/).
4. Tap **Save**.

#### Option B: Environment Variable
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

---

## Running the Application

### Start Expo Development Server
```bash
npx expo start
```

- Press `w` to open in **Web Browser**.
- Scan the QR code using **Expo Go** on Android / iOS.
- Press `a` for Android Emulator or `i` for iOS Simulator.

---

## License & Author

Developed for Mobile AI Assistant Coding Challenge.
Released under the MIT License.
