import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { generateLegalResponse } from '../lib/gemini';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  mode: 'Consultation' | 'Research';
  status?: 'loading' | 'error' | 'success' | 'streaming';
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  importedChat: Message[];
}

interface ChatStore {
  chats: Chat[];
  activeChatId: string | null;
  isResponding: boolean;
  newChat: (mode: 'Consultation' | 'Research', firstMessage: string, isUser?: boolean) => void;
  deleteChat: (chatId: string) => void;
  sendMessage: (content: string, mode: 'Consultation' | 'Research') => void;
  generateAIResponse: (chatId: string) => Promise<void>;
  setActiveChatId: (chatId: string | null) => void;
  importChat: (chatId: string, messages: Message[]) => void;
  clearAllChats: () => void;
  updateChatTitle: (chatId: string, newTitle: string) => void;
}

const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChatId: null,
      isResponding: false,

      updateChatTitle: (chatId, newTitle) => {
        set({
          chats: get().chats.map(chat =>
            chat.id === chatId
              ? { ...chat, title: newTitle }
              : chat
          ),
        });
      },

      newChat: (mode, firstMessage, isUser = true) => {
        const newChat: Chat = {
          id: uuidv4(),
          title: firstMessage.substring(0, 50),
          messages: [
            {
              id: uuidv4(),
              content: firstMessage,
              isUser: isUser,
              timestamp: new Date(),
              mode,
            },
          ],
          importedChat: [],
        };
      
        set({
          chats: [newChat, ...get().chats],
          activeChatId: newChat.id,
        });
      },

      deleteChat: (chatId) =>
        set({
          chats: get().chats.filter((chat) => chat.id !== chatId),
          activeChatId: get().activeChatId === chatId ? null : get().activeChatId,
        }),

      sendMessage: (content, mode) =>
        set({
          chats: get().chats.map((chat) =>
            chat.id === get().activeChatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    {
                      id: uuidv4(),
                      content,
                      isUser: true,
                      timestamp: new Date(),
                      mode,
                    },
                  ],
                }
              : chat
          ),
        }),

      generateAIResponse: async (chatId) => {
        const chat = get().chats.find((c) => c.id === chatId);
        if (!chat || get().isResponding) return;
      
        set({ isResponding: true });
      
        const lastUserMessage = [...chat.messages].reverse().find((m) => m.isUser);
        const currentMode = lastUserMessage?.mode || 'Consultation';
      
        const streamingMessageId = uuidv4();
        set({
          chats: get().chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    {
                      id: streamingMessageId,
                      content: '',
                      isUser: false,
                      timestamp: new Date(),
                      status: 'streaming',
                      mode: currentMode,
                    },
                  ],
                }
              : c
          ),
        });
      
        try {
          await generateLegalResponse(
            currentMode,
            lastUserMessage?.content || '',
            chat,
            (chunk) => {
              set({
                chats: get().chats.map((c) => {
                  if (c.id === chatId) {
                    return {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === streamingMessageId
                          ? { ...m, content: m.content + chunk }
                          : m
                      ),
                    };
                  }
                  return c;
                }),
              });
            }
          );

          set({
            chats: get().chats.map((c) => {
              if (c.id === chatId) {
                return {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === streamingMessageId
                      ? { ...m, status: 'success' }
                      : m
                  ),
                };
              }
              return c;
            }),
          });

        } catch (error) {
          console.error('Error generating AI response:', error);
          set({
            chats: get().chats.map((c) =>
              c.id === chatId
                ? {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === streamingMessageId
                        ? {
                            ...m,
                            content: 'Failed to generate response. Please try again.',
                            status: 'error',
                          }
                        : m
                    ),
                  }
                : c
            ),
          });
        } finally {
          set({ isResponding: false });
        }
      },

      setActiveChatId: (chatId) => set({ activeChatId: chatId }),

      importChat: (chatId, messagesToImport) => {
        const chat = get().chats.find(c => c.id === chatId);
        if (!chat) return;
      
        const importMessage = {
          id: uuidv4(),
          content: "**تم استيراد المحادثة بنجاح**\n\nتم إضافة السياق من المحادثة السابقة. يمكنك الآن المحادثة مع الاحتفاظ بالسياق المستورد.",
          isUser: false,
          timestamp: new Date(),
          mode: chat.messages[0]?.mode || 'Consultation',
          status: 'success' as const
        };
      
        set({
          chats: get().chats.map(chat => 
            chat.id === chatId
              ? { 
                  ...chat,
                  importedChat: [...chat.importedChat, ...messagesToImport],
                  messages: [...chat.messages, importMessage]
                }
              : chat
          )
        });
      },
      
      clearAllChats: () => set({ chats: [], activeChatId: null }),
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useChatStore;