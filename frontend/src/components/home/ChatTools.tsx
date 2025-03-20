import { useState, useRef, useEffect } from 'react';
import { Import, MessageSquareText, Sparkles, Plus, ScrollText } from 'lucide-react';
import { PromptDropdown } from '../PromptDropdown';

interface ChatToolsProps {
  hasImported: boolean;
  handleImport: (chat: any) => void;
  chats: any[];
  activeChatId: string | null;
  localMode: 'Consultation' | 'Research';
  setNewMessage: (message: string) => void;
}

export function ChatTools({ 
  hasImported, 
  handleImport, 
  chats, 
  activeChatId,
  localMode,
  setNewMessage
}: ChatToolsProps) {
  const [isImporting, setIsImporting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsImporting(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsImporting(false);
  }, [activeChatId]);

  return (
    <div className="flex items-center justify-between mb-4 px-2">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <MessageSquareText className="w-5 h-5 text-[#B4924C]" />
          Chat Tools
        </h2>
        <div className="h-4 w-px bg-[#B4924C]/20"></div>
        <div className="flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsImporting(!isImporting)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                hasImported
                  ? 'bg-[#1a1a1a] text-gray-600 cursor-not-allowed border border-[#B4924C]/10'
                  : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#242424] border border-[#B4924C]/20 hover:border-[#B4924C]/30'
              }`}
              disabled={hasImported}
            >
              <Import className="w-5 h-5 text-[#B4924C]" />
              <span>Import Chat</span>
              <Plus className="w-4 h-4 text-[#B4924C]" />
            </button>
            {isImporting && (
              <div className="absolute bottom-full left-0 mb-2 bg-[#1a1a1a] rounded-xl p-3 min-w-[200px] max-h-48 overflow-y-auto shadow-xl border border-[#B4924C]/20 z-10 transform-none">
                {chats.filter(chat => chat.id !== activeChatId).length > 0 ? (
                  chats
                    .filter(chat => chat.id !== activeChatId)
                    .map(chat => (
                      <div
                        key={chat.id}
                        onClick={() => {
                          handleImport(chat);
                          setIsImporting(false);
                        }}
                        className="px-4 py-2.5 hover:bg-[#242424] rounded-lg cursor-pointer text-gray-300 transition-all duration-200 hover:text-[#B4924C]"
                      >
                        <div className="flex items-center gap-2">
                          <MessageSquareText className="w-4 h-4" />
                          <span className="truncate">{chat.title}</span>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="px-4 py-2.5 text-gray-500 italic">
                    No chats available to import
                  </div>
                )}
              </div>
            )}
          </div>
          <PromptDropdown onSelect={(prompt) => setNewMessage(prompt)} />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-300 bg-[#1a1a1a] px-4 py-2.5 rounded-xl border border-[#B4924C]/20">
        {localMode === 'Consultation' ? (
          <Sparkles className="w-4 h-4 text-[#B4924C]" />
        ) : (
          <ScrollText className="w-4 h-4 text-[#B4924C]" />
        )}
        <span>{localMode.charAt(0).toUpperCase() + localMode.slice(1)} Mode</span>
      </div>
    </div>
  );
}