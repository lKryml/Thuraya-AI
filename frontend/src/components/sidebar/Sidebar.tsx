import { Trash2, Plus, MessageSquareText, UserRound, LogOut, BookText } from 'lucide-react';
import useChatStore from '../../store/chatStore';
import { useDocsStore } from '../../store/docStore';

interface SidebarProps {
  selectedTab: 'chats' | 'docs';
  setSelectedTab: (tab: 'chats' | 'docs') => void;
}

export function Sidebar({ selectedTab, setSelectedTab }: SidebarProps) {
  const { chats, activeChatId, deleteChat, clearAllChats } = useChatStore();
  const { selectedOp, setSelectedOp } = useDocsStore();

  return (
    <div className="h-screen bg-black border-r border-[#B4924C]/30 text-white w-full md:w-80 flex flex-col">
      <div className="p-3 border-b border-[#B4924C]/30">
        <div className="flex bg-[#1a1a1a] p-1 rounded-lg">
          <button
            onClick={() => setSelectedTab('chats')}
            className={`chats-tab flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md transition-all duration-200 ${
              selectedTab === 'chats'
                ? 'bg-gradient-to-r from-[#B4924C] to-[#DAA520] text-black shadow-lg'
                : 'text-gray-400 hover:text-[#B4924C] hover:bg-black/50'
            }`}
          >
            <MessageSquareText size={18} />
            <span className="font-medium">Chats</span>
          </button>
          <button
            onClick={() => setSelectedTab('docs')}
            className={`docs-tab flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md transition-all duration-200 ${
              selectedTab === 'docs'
                ? 'bg-gradient-to-r from-[#B4924C] to-[#DAA520] text-black shadow-lg'
                : 'text-gray-400 hover:text-[#B4924C] hover:bg-black/50'
            }`}
          >
            <BookText size={18} />
            <span className="font-medium">Docs</span>
          </button>
        </div>
      </div>

      {selectedTab === 'chats' ? (
        <>
          <div className="p-3 border-b border-[#B4924C]/30">
            <button
              onClick={() => useChatStore.getState().setActiveChatId(null)}
              className="new-chat-button w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-[#B4924C] to-[#DAA520] rounded-lg text-black hover:from-[#DAA520] hover:to-[#B4924C] transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              <span>New Chat</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-1 p-2">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => useChatStore.setState({ activeChatId: chat.id })}
                  className={`w-full p-3 text-left rounded-lg transition-all duration-200 group relative ${
                    activeChatId === chat.id
                      ? 'bg-[#B4924C]/10 shadow-md border border-[#B4924C]/20'
                      : 'hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="flex items-center w-full">
                    <MessageSquareText className={`flex-shrink-0 w-5 h-5 ${
                      activeChatId === chat.id ? 'text-[#B4924C]' : 'text-gray-400'
                    }`} />
                    <div className="ml-3 font-medium truncate pr-8 transition-transform duration-300 group-hover:translate-x-1">
                      {chat.title}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg hover:bg-black/30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <button
            data-onboarding="summarize"
            onClick={() => setSelectedOp('summarize')}
            className={`w-full h-12 flex items-center justify-center gap-2 rounded-lg transition-all duration-200 font-medium ${
              selectedOp === 'summarize'
                ? 'bg-gradient-to-r from-[#B4924C] to-[#DAA520] text-black shadow-lg'
                : 'bg-[#1a1a1a] text-white hover:bg-[#242424] border border-[#B4924C]/20'
            }`}
          >
            <span>Summarize</span>
          </button>
          <button
            data-onboarding="compare"
            onClick={() => setSelectedOp('compare')}
            className={`w-full h-12 flex items-center justify-center gap-2 rounded-lg transition-all duration-200 font-medium ${
              selectedOp === 'compare'
                ? 'bg-gradient-to-r from-[#B4924C] to-[#DAA520] text-black shadow-lg'
                : 'bg-[#1a1a1a] text-white hover:bg-[#242424] border border-[#B4924C]/20'
            }`}
          >
            <span>Compare</span>
          </button>
            <button
            disabled
            data-onboarding="image-to-text"
            onClick={() => setSelectedOp('image-to-text')}
            className={`w-full h-12 flex items-center justify-center gap-2 rounded-lg transition-all duration-200 font-medium ${
              selectedOp === 'image-to-text'
                ? 'bg-gradient-to-r from-[#B4924C] to-[#DAA520] text-black shadow-lg'
                : 'bg-[#1a1a1a] text-white hover:bg-[#242424] border border-[#B4924C]/20'
            }`}
          >
            <span>Image to Text</span>
          </button>
        </div>
      )}

      <div className="border-t border-[#B4924C]/30 p-2 space-y-1 mt-auto bg-black">
        <button
          onClick={clearAllChats}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1a1a1a] transition-colors duration-200 text-gray-400 hover:text-white group"
        >
          <Trash2 size={20} className="group-hover:text-red-400" />
          <span>Clear all data</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1a1a1a] transition-colors duration-200 text-gray-400 hover:text-white">
          <UserRound size={20} />
          <span>My account</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1a1a1a] transition-colors duration-200 text-gray-400 hover:text-white group">
          <LogOut size={20} className="group-hover:text-orange-400" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}