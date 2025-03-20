import { ScrollText, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  mode: 'Consultation' | 'Research';
  status?: 'loading' | 'error' | 'success' | 'streaming';
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.isUser) {
    return (
      <div className="flex justify-end group animate-fade-in">
        <div className="max-w-[70%] rounded-2xl p-4 bg-gradient-to-r from-[#B4924C] to-[#DAA520] text-black shadow-lg transition-all duration-200 group-hover:shadow-xl group-hover:scale-[1.02] origin-right">
          <div className="text-lg">{message.content}</div>
          <div className="text-xs text-black/80 mt-2 text-right flex items-center justify-end gap-2">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">You</span>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start group animate-fade-in">
      <div className="flex items-start gap-3 max-w-[70%]">
        <div className="flex-shrink-0 w-10 h-10 mt-2">
          <img 
            src="avatar.png"
            alt="Assistant Avatar"
            className="w-full h-full object-cover rounded-full shadow-md ring-2 ring-[#B4924C]/30"
          />
        </div>
        <div className={`rounded-2xl p-4 shadow-lg transition-all duration-200 group-hover:shadow-xl group-hover:scale-[1.013] origin-left ${
          message.status === 'error' 
            ? 'bg-red-900/20 text-red-100 border border-red-900/50' 
            : 'bg-[#1a1a1a] text-white border border-[#B4924C]/20'
        } text-right direction-rtl`}>
          {message.status === 'streaming' ? (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                {message.content === '' ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#B4924C] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#B4924C] rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-[#B4924C] rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span>جاري التحليل...</span>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-p:text-lg prose-p:leading-relaxed text-right">
                    <ReactMarkdown
                      components={{
                        div: ({ node, ...props }) => (
                          <div {...props} dir="rtl" style={{ direction: 'rtl' }} />
                        ),
                        p: ({ node, ...props }) => (
                          <p {...props} className="text-right my-3" style={{ direction: 'rtl' }} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol 
                            {...props} 
                            className="list-decimal pr-6 my-4 text-right"
                            style={{ direction: 'rtl'}}
                          />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul
                            {...props}
                            className="list-disc pr-6 my-4 text-right"
                            style={{ direction: 'rtl'}}
                          />
                        ),
                        li: ({ node, ...props }) => (
                          <li {...props} className="text-right py-1" style={{ direction: 'rtl' }} />
                        ),
                        h1: ({ node, ...props }) => <h1 {...props} className="text-3xl text-right mt-6 mb-3" />,
                        h2: ({ node, ...props }) => <h2 {...props} className="text-2xl text-right mt-5 mb-2" />,
                        h3: ({ node, ...props }) => <h3 {...props} className="text-xl text-right mt-4 mb-2" />,
                        strong: ({ node, ...props }) => (
                          <strong {...props} className="font-bold text-[#B4924C]" />
                        ),
                        em: ({ node, ...props }) => (
                          <em {...props} className="italic text-[#DAA520]" />
                        ),
                        blockquote: ({ node, ...props }) => (
                          <blockquote
                            {...props}
                            className="border-r-4 border-[#B4924C]/30 pr-4 my-4 py-2 text-gray-300 bg-black/30 rounded-lg"
                            style={{ direction: 'rtl' }}
                          />
                        ),
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            className="text-[#B4924C] hover:text-[#DAA520] underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        ),
                      }}
                    >{message.content}</ReactMarkdown>
                    <span className="animate-pulse text-[#B4924C]">|</span>
                  </div>
                )}
              </div>
              <MessageFooter mode={message.mode} timestamp={message.timestamp} />
            </div>
          ) : message.status === 'error' ? (
            <div className="text-lg">فشل في إنشاء الرد. يرجى المحاولة مرة أخرى.</div>
          ) : (
            <>
              <div className="prose prose-invert prose-p:text-lg prose-p:leading-relaxed text-right">
                <ReactMarkdown
                  components={{
                    div: ({ node, ...props }) => (
                      <div {...props} dir="rtl" style={{ direction: 'rtl' }} />
                    ),
                    p: ({ node, ...props }) => (
                      <p {...props} className="text-right my-3" style={{ direction: 'rtl' }} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol 
                        {...props} 
                        className="list-decimal pr-6 my-4 text-right"
                        style={{ direction: 'rtl'}}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        {...props}
                        className="list-disc pr-6 my-4 text-right"
                        style={{ direction: 'rtl'}}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li {...props} className="text-right py-1" style={{ direction: 'rtl' }} />
                    ),
                    h1: ({ node, ...props }) => <h1 {...props} className="text-3xl text-right mt-6 mb-3" />,
                    h2: ({ node, ...props }) => <h2 {...props} className="text-2xl text-right mt-5 mb-2" />,
                    h3: ({ node, ...props }) => <h3 {...props} className="text-xl text-right mt-4 mb-2" />,
                    strong: ({ node, ...props }) => (
                      <strong {...props} className="font-bold text-[#B4924C]" />
                    ),
                    em: ({ node, ...props }) => (
                      <em {...props} className="italic text-[#DAA520]" />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        {...props}
                        className="border-r-4 border-[#B4924C]/30 pr-4 my-4 py-2 text-gray-300 bg-black/30 rounded-lg"
                        style={{ direction: 'rtl' }}
                      />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className="text-[#B4924C] hover:text-[#DAA520] underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                >{message.content}</ReactMarkdown>
              </div>
              <MessageFooter mode={message.mode} timestamp={message.timestamp} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageFooter({ mode, timestamp }: { mode: string; timestamp: Date }) {
  return (
    <div className="flex items-center justify-between mt-3 border-t border-[#B4924C]/20 pt-2">
      <div className="text-xs text-gray-400 flex items-center gap-1.5">
        {mode === 'Consultation' ? (
          <Sparkles className="inline w-3 h-3 text-[#B4924C]" />
        ) : (
          <ScrollText className="inline w-3 h-3 text-[#B4924C]" />
        )}{' '}
        {mode} mode
      </div>
      <div className="text-xs text-gray-400 flex items-center gap-2">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">Assistant</span>
        {new Date(timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  );
}