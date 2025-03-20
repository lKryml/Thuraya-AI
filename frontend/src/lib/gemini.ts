interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  mode: 'Consultation' | 'Research' | 'active';
  status?: 'loading' | 'error' | 'success' | 'streaming';
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  importedChat: Message[];
}

export async function generateLegalResponse(
  mode: 'Consultation' | 'Research',
  message: string,
  currentChat: Chat,
  onChunk: (chunk: string) => void,
  typingSpeed: number = 0.001
) {
  console.log(
    'mode: ',
    mode,
    'message: ',
    message,
    'currentChat: ',
    currentChat,
  );
  try {
    const response = await fetch('http://localhost:8000/api/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userPrompt: message,
        mode: mode === 'Consultation' ? 'active' : 'research',
        chatHistory: [...currentChat.importedChat, ...currentChat.messages].map(
          (m) => ({
            content: m.content,
            isUser: m.isUser,
          }),
        ),
        typing_speed: typingSpeed,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch response');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to read stream');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      while (buffer.length > 0) {
        const char = buffer[0];
        onChunk(char);
        buffer = buffer.slice(1);
      }
    }

    if (buffer.length > 0) {
      onChunk(buffer);
    }
  } catch (error) {
    console.error('API Error:', error);
    onChunk('\n\n**خطأ:** تعذر توليد الرد. يرجى المحاولة مرة أخرى.');
  }
}
