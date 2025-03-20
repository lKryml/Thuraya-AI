import { useState, useEffect, useRef } from 'react';
import { Image, Import, ScrollText, SendHorizonal, Sparkles, Plus, Download } from 'lucide-react';
import { Input } from '../ui/input';
// import VoiceCall from '../VoiceCall';
import { PromptDropdown } from '../PromptDropdown';

interface WelcomeScreenProps {
  localMode: 'Consultation' | 'Research';
  setLocalMode: (mode: 'Consultation' | 'Research') => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleImport: (chat: any) => void;
  chats: any[];
  newChat: (mode: 'Consultation' | 'Research', message: string) => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPromptGlobal: BeforeInstallPromptEvent | null = null;

export function WelcomeScreen({
  localMode,
  setLocalMode,
  newMessage,
  setNewMessage,
  handleImport,
  chats,
  newChat
}: WelcomeScreenProps) {
  const [isImportingHome, setIsImportingHome] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      deferredPromptGlobal = promptEvent;
      deferredPrompt.current = promptEvent;
      setShowInstall(true);
    };

    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      const isIOSInstalled = isIOS && (navigator as any).standalone;
      setIsInstalled(isStandalone || isIOSInstalled);
    };

    // Initialize from global reference
    deferredPrompt.current = deferredPromptGlobal;
    setShowInstall(!!deferredPromptGlobal && !isInstalled);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    checkInstallStatus();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkInstallStatus);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      mediaQuery.removeEventListener('change', checkInstallStatus);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt.current) return;

    try {
      await deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;
      
      if (outcome === 'accepted') {
        deferredPromptGlobal = null;
        deferredPrompt.current = null;
        setShowInstall(false);
        setIsInstalled(true);
      }
    } catch (error) {
      console.error('Error handling install prompt:', error);
    }
  };

  // const handleTranscript = (transcript: string) => {
  //   setNewMessage(transcript);
  // };

  return (
    <div className="flex-1 flex flex-col items-center justify-between min-h-screen bg-gradient-to-b from-black to-[#1a1a1a] p-8">
              {showInstall && !isInstalled &&(
          <button
            onClick={handleInstall}
            className="absolute top-4 right-4 mb-8 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B4924C] to-[#DAA520] text-black rounded-xl hover:from-[#DAA520] hover:to-[#B4924C] transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Download className="w-5 h-5" />
            Install App
          </button>
        )}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
        <div className="w-28 h-28 md:w-36 md:h-36 mb-12">
          <img src="avatar.png" alt="Logo" className="w-full h-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-12 mode-selector">
          <div 
            onClick={() => setLocalMode('Consultation')}
            className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
              localMode === 'Consultation' 
                ? 'border-2 border-[#B4924C]' 
                : 'bg-[#1a1a1a] border-2 border-transparent hover:border-[#B4924C]/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className={`w-6 h-6 ${localMode === 'Consultation' ? 'text-[#B4924C]' : 'text-gray-400'}`} />
              <h2 className={`text-2xl font-semibold ${localMode === 'Consultation' ? 'text-[#B4924C]' : 'text-gray-200'}`}>
                Consultation
              </h2>
            </div>
            <div className="space-y-3">
              <p className="text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B4924C]"></span>
                Asks follow-up questions to understand case details
              </p>
              <p className="text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B4924C]"></span>
                Suggests possible legal actions based on the situation
              </p>
              <p className="text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B4924C]"></span>
                Provides steps for action and evidence gathering
              </p>
            </div>
          </div>

          <div 
            onClick={() => setLocalMode('Research')}
            className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
              localMode === 'Research' 
                ? 'border-2 border-[#B4924C]' 
                : 'bg-[#1a1a1a] border-2 border-transparent hover:border-[#B4924C]/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <ScrollText className={`w-6 h-6 ${localMode === 'Research' ? 'text-[#B4924C]' : 'text-gray-400'}`} />
              <h2 className={`text-2xl font-semibold ${localMode === 'Research' ? 'text-[#B4924C]' : 'text-gray-200'}`}>
                Research
              </h2>
            </div>
            <div className="space-y-3">
              <p className="text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B4924C]"></span>
                Explains legal principles related to the case
              </p>
              <p className="text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B4924C]"></span>
                Provides information about relevant laws and rights
              </p>
              <p className="text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B4924C]"></span>
                Offers general guidance without follow-ups
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="relative">
            <button
              onClick={() => setIsImportingHome(!isImportingHome)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#242424] text-gray-300 transition-all duration-200 border border-[#B4924C]/20 hover:border-[#B4924C]/30"
            >
              <Import className="w-5 h-5 text-[#B4924C]" />
              <span>Import Chat</span>
              <Plus className="w-4 h-4 text-[#B4924C]" />
            </button>
            {isImportingHome && (
              <div className="absolute bottom-full left-0 mb-2 bg-[#1a1a1a] rounded-xl p-3 min-w-[200px] max-h-48 overflow-y-auto shadow-xl border border-[#B4924C]/20 z-10 transform-none">
                {chats.length > 0 ? (
                  chats.map(chat => (
                    <div
                      key={chat.id}
                      onClick={() => {
                        handleImport(chat);
                        setIsImportingHome(false);
                      }}
                      className="px-4 py-2.5 hover:bg-[#242424] rounded-lg cursor-pointer text-gray-300 transition-all duration-200 hover:text-[#B4924C]"
                    >
                      {chat.title}
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
          <div className="prompts-button">
            <PromptDropdown onSelect={(prompt) => setNewMessage(prompt)} />
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#1a1a1a] p-3 rounded-xl border border-[#B4924C]/20">
          <div className="flex items-center gap-2">
            {/* <VoiceCall onTranscript={handleTranscript} /> */}
            <button className="p-2 text-gray-400 hover:text-[#B4924C] hover:bg-[#242424] rounded-lg transition-all duration-200">
              <Image className="w-5 h-5" />
            </button>
          </div>
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message to start a new chat..."
            className="flex-1 bg-transparent border-0 text-white placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newMessage.trim()) {
                e.preventDefault();
                newChat(localMode, newMessage);
                setNewMessage('');
              }
            }}
          />
          <button
            onClick={() => {
              if (newMessage.trim()) {
                newChat(localMode, newMessage);
                setNewMessage('');
              }
            }}
            className="p-2 text-gray-400 hover:text-[#B4924C] hover:bg-[#242424] rounded-lg transition-all duration-200"
          >
            <SendHorizonal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}