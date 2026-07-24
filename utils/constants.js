// App Configuration & Theme Constants

export const LIGHT_THEME = {
  mode: 'light',
  primary: '#2563EB',        // Royal Blue
  primaryLight: '#EFF6FF',
  background: '#F8FAFC',     // Clean slate
  surface: '#FFFFFF',        // Card background
  surfaceVariant: '#F1F5F9',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  userBubble: '#2563EB',
  userBubbleText: '#FFFFFF',
  aiBubble: '#F1F5F9',
  aiBubbleText: '#0F172A',
  inputBg: '#FFFFFF',
  accent: '#8B5CF6',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  shadow: '#00000010',
};

export const DARK_THEME = {
  mode: 'dark',
  primary: '#3B82F6',        // Vibrant Blue
  primaryLight: '#1E293B',
  background: '#0F172A',     // Deep Slate
  surface: '#1E293B',        // Dark Card
  surfaceVariant: '#334155',
  border: '#334155',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  userBubble: '#2563EB',
  userBubbleText: '#FFFFFF',
  aiBubble: '#1E293B',
  aiBubbleText: '#F8FAFC',
  inputBg: '#1E293B',
  accent: '#A78BFA',
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24',
  shadow: '#00000050',
};

export const DEFAULT_SUGGESTIONS = [
  { id: '1', icon: 'sparkles', label: 'Explain Quantum Computing' },
  { id: '2', icon: 'code-slash', label: 'Write a React Native Hook' },
  { id: '3', icon: 'bulb', label: 'Brainstorm Startup Ideas' },
  { id: '4', icon: 'fitness', label: 'Create a 7-day workout plan' },
  { id: '5', icon: 'mail', label: 'Draft a polite follow-up email' },
];

export const MAX_INPUT_LENGTH = 1000;
export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
