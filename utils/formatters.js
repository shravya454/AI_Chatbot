// Formatting and helper utilities

/**
 * Formats a Date object or timestamp into a readable string (e.g. 10:45 AM)
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Formats full date string (e.g. Jul 24, 2026 at 10:45 AM)
 */
export const formatFullDateTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Generates plain-text export format of the chat history
 */
export const generateChatExportText = (messages) => {
  if (!messages || messages.length === 0) {
    return 'No conversation messages to export.';
  }

  let exportStr = `=======================================\n`;
  exportStr += `       AI CHATBOT CONVERSATION EXPORT   \n`;
  exportStr += `       Exported: ${new Date().toLocaleString()}\n`;
  exportStr += `=======================================\n\n`;

  messages.forEach((msg, idx) => {
    const sender = msg.sender === 'user' ? 'USER' : 'AI ASSISTANT';
    const time = formatFullDateTime(msg.timestamp);
    exportStr += `[${time}] ${sender}:\n${msg.text}\n\n`;
    exportStr += `---------------------------------------\n\n`;
  });

  return exportStr;
};

/**
 * Unique ID generator for messages
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
};
