import React, { useRef } from 'react';
import { Image, SendHorizonal, Sparkles, ScrollText } from 'lucide-react';
import { Input } from '../ui/input';
// import VoiceCall from '../VoiceCall';

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isResponding: boolean;
  activeChatId: string | null;
  newChat?: (mode: 'Consultation' | 'Research', message: string) => void;
  localMode: 'Consultation' | 'Research';
  setLocalMode: (mode: 'Consultation' | 'Research') => void;
}

export function ChatInput({
  newMessage,
  setNewMessage,
  handleSubmit,
  isResponding,
  activeChatId,
  newChat,
  localMode,
  setLocalMode,
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // const handleTranscript = (transcript: string) => {
  //   setNewMessage(transcript);
  // };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="flex items-center bg-[#1a1a1a] w-full h-[60px] rounded-xl px-3 gap-2 shadow-lg transition-all duration-300 group-focus-within:shadow-xl group-focus-within:bg-[#242424] group-hover:bg-[#242424] border border-[#B4924C]/20">
        <div className="flex items-center gap-1">
          {/* <VoiceCall onTranscript={handleTranscript} /> */}
          <button
            type="button"
            className="p-2 hover:bg-[#B4924C]/10 rounded-lg text-gray-400 hover:text-[#B4924C] transition-all duration-200"
            title="Attach image"
          >
            <Image className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-1 bg-black/30 rounded-lg p-1 ml-2">
          <button
            type="button"
            onClick={() => setLocalMode('Consultation')}
            className={`p-2 rounded-md transition-all duration-200 ${
              localMode === 'Consultation'
                ? 'bg-gradient-to-r from-[#B4924C] to-[#DAA520] text-black'
                : 'text-gray-400 hover:bg-[#B4924C]/10 hover:text-[#B4924C]'
            }`}
            title="ConsultationMode"
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setLocalMode('Research')}
            className={`p-2 rounded-md transition-all duration-200 ${
              localMode === 'Research'
                ? 'bg-gradient-to-r from-[#B4924C] to-[#DAA520] text-black'
                : 'text-gray-400 hover:bg-[#B4924C]/10 hover:text-[#B4924C]'
            }`}
            title="Research Mode"
          >
            <ScrollText className="w-5 h-5" />
          </button>
        </div>

        <Input
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={
            activeChatId 
              ? "Type your message..." 
              : "Type your message to start a new chat..."
          }
          className="flex-1 border-0 bg-transparent text-white placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 text-lg"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !activeChatId && newChat) {
              e.preventDefault();
              newChat(localMode, newMessage);
              setNewMessage('');
            }
          }}
        />

        <button 
          type="submit" 
          className={`p-2 rounded-lg ml-2 transition-all duration-200 ${
            isResponding 
              ? 'text-gray-600 cursor-not-allowed' 
              : 'text-gray-400 hover:bg-[#B4924C]/10 hover:text-[#B4924C]'
          }`}
          disabled={isResponding}
          title="Send message"
        >
          <SendHorizonal className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}