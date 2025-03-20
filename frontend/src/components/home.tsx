import { useState, useEffect, useRef } from 'react';
import useChatStore from '../store/chatStore';
import { ChatInput } from './home/chatInput';
import { ChatMessage } from './home/ChatMessage';
import { ChatTools } from './home/ChatTools';
import { WelcomeScreen } from './home/WelcomeScreen';
// import { Import } from 'lucide-react';

export function Home() {
  const [newMessage, setNewMessage] = useState('');
  const [localMode, setLocalMode] = useState<'Consultation' | 'Research'>('Consultation');
  // const [showImportSuccess, setShowImportSuccess] = useState(false);
  const { activeChatId, chats, sendMessage, newChat, generateAIResponse, isResponding, importChat } = useChatStore();

  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const messages = activeChat?.messages || [];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isResponding) return;

    if (!activeChatId) {
      newChat(localMode, newMessage);
    } else {
      sendMessage(newMessage, localMode);
    }

    setNewMessage('');
  };

  const handleImport = (chatToImport: any) => {
    if (activeChatId) {
      importChat(activeChatId, chatToImport.messages);
    } else {
      const botMessage = "**تم بدء جلسة جديدة بمحادثة مستوردة**";
      useChatStore.getState().newChat(localMode, botMessage, false);
      const newActiveChatId = useChatStore.getState().activeChatId;
      if (newActiveChatId) {
        useChatStore.getState().importChat(newActiveChatId, chatToImport.messages);
        useChatStore.getState().updateChatTitle(newActiveChatId, `Imported: ${chatToImport.title}`);
      }
    }
    // setShowImportSuccess(true);
    // setTimeout(() => setShowImportSuccess(false), 3000);
  };

  useEffect(() => {
    if (!activeChatId) setLocalMode('Consultation');
  }, [activeChatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (activeChatId && messages.length > 0 && messages[messages.length - 1].isUser) {
      generateAIResponse(activeChatId);
    }
  }, [messages.length]);

  const hasImported = (activeChat?.importedChat?.length ?? 0) > 0;

  if (!activeChatId) {
    return (
      <WelcomeScreen
        localMode={localMode}
        setLocalMode={setLocalMode}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleImport={handleImport}
        chats={chats}
        newChat={newChat}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-b from-black to-[#1a1a1a]">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-[#B4924C] scrollbar-track-transparent">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ChatMessage message={message} />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-[#B4924C]/30 bg-black/50 backdrop-blur-sm p-4 shadow-lg">
          <ChatTools
            hasImported={hasImported}
            handleImport={handleImport}
            chats={chats}
            activeChatId={activeChatId}
            localMode={localMode}
            setNewMessage={setNewMessage}
          />
          <ChatInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSubmit={handleSubmit}
            isResponding={isResponding}
            activeChatId={activeChatId}
            newChat={newChat}
            localMode={localMode}
            setLocalMode={setLocalMode}
          />
        </div>
      </div>
    </div>
  );
}