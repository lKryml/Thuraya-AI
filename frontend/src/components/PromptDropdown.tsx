import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PromptCategory {
  name: string;
  subPrompts: string[];
}

interface PromptDropdownProps {
  categories?: PromptCategory[];
  onSelect: (prompt: string) => void;
}

interface PromptStore {
  customPrompts: string[];
  addCustomPrompt: (prompt: string) => void;
  removeCustomPrompt: (prompt: string) => void;
}

export const usePromptStore = create<PromptStore>()(
  persist(
    (set) => ({
      customPrompts: [],
      addCustomPrompt: (prompt) =>
        set((state) => ({
          customPrompts: [...state.customPrompts, prompt],
        })),
      removeCustomPrompt: (promptToRemove) =>
        set((state) => ({
          customPrompts: state.customPrompts.filter(prompt => prompt !== promptToRemove),
        })),
    }),
    {
      name: 'prompt-storage',
    }
  )
);

export const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    name: "نموذج استشارة عقد عمل",
    subPrompts: [
      " أنا موظف في شركة ، وتم حجب مستحقاتي المالية بحجة [السبب المُدَّعى، مثال: مخالفة لسياسة الشركة]. العقد ينص على [ذكر البند المُتعلق بالمرتبات/المستحقات]، ولكنني أشك في مشروعية هذا الإجراء. ما هي الإجراءات القانونية الفعَّالة لاسترداد حقوقي دون انتهاك بنود العقد؟"
    ]
  },
  {
    name: "نموذج انتهاك حقوق الموظف",
    subPrompts: [
      "تتعرض للإجبار على العمل لساعات إضافية دون مقابل في شركة [اسم الشركة]، بينما ينص قانون العمل على [المادة/البند]. كيف يمكنني إثبات هذه الانتهاكات وإبلاغ الجهات المختصة بشكل قانوني؟"
    ]
  },
  {
    name: "نموذج عيوب في عقار مُشتَرى",
    subPrompts: [
      "بعد شراء عقار في [الموقع]، اكتشفت وجود عيوب إنشائية [مثل: تشققات] لم يتم الإفصاح عنها وقت التعاقد. العقد يشير إلى [ذكر البند المتعلق بالضمان]. كيف أستطيع إلزام البائع أو المقاول بالإصلاحات وفق القانون؟"
    ]
  },
  {
    name: "نموذج توقيف للتحقيق دون سبب واضح",
    subPrompts: [
      "أوقفتني الشرطة للتحقيق في [الموقع] دون إبداء أسباب قانونية واضحة، ورفضت إظهار هوية الضابط أو مذكرة التوقيف. ما هي الإجراءات التي يجب اتباعها لحماية حقوقي خلال التوقيف؟ وما المواد القانونية التي تُلزم الشرطة بتوضيح سبب التوقيف (مثال: المادة ٣٦ من نظام الإجراءات الجزائية)؟"
    ]
  },
  {
    name: "نموذج استيلاء على ميراث",
    subPrompts: [
      "أفراد من عائلتي استولوا على ممتلكات عقارية مملوكة لي وفقاً لوثيقة الميراث [ذكر التفاصيل]. ما هي المستندات المطلوبة (مثال: صك ملكية، شهادة الورثة) لتقديم دعوى استرداد؟"
    ]
  }
    // {
  //   name: "Family Law",
  //   subPrompts: [
  //     "ما هي حقوقي في قضية حضانة الأطفال؟",
  //     "كيف يمكنني تقديم طلب نفقة؟",
  //     "ما هي إجراءات الطلاق في المحكمة؟"
  //   ]
  // },
  // {
  //   name: "Business Law",
  //   subPrompts: [
  //     "كيف أسجل شركة جديدة؟",
  //     "ما هي حقوقي في نزاع تجاري؟",
  //     "كيف أحمي علامتي التجارية؟"
  //   ]
  // },
  // {
  //   name: "Real Estate",
  //   subPrompts: [
  //     "ما هي خطوات شراء عقار؟",
  //     "كيف أتعامل مع نزاع إيجار؟",
  //     "ما هي حقوقي كمالك عقار؟"
  //   ]
  // },
  // {
  //   name: "Employment",
  //   subPrompts: [
  //     "ما هي حقوقي في حالة الفصل التعسفي؟",
  //     "كيف أقدم شكوى عمالية؟",
  //     "ما هي حقوقي في عقد العمل؟"
  //   ]
  // }
];

export const PromptDropdown = ({ 
  categories = PROMPT_CATEGORIES, 
  onSelect 
}: PromptDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { customPrompts, addCustomPrompt, removeCustomPrompt } = usePromptStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPrompt.trim()) {
      addCustomPrompt(newPrompt.trim());
      setNewPrompt('');
      setIsAdding(false);
      setExpandedCategory('Custom');
    }
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const allCategories = [
    ...categories,
    ...(customPrompts.length > 0 ? [{ name: 'Custom', subPrompts: customPrompts }] : [])
  ].filter(category => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      category.name.toLowerCase().includes(lowerSearchTerm) ||
      category.subPrompts.some(prompt => 
        prompt.toLowerCase().includes(lowerSearchTerm)
      )
    );
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#242424] text-gray-300 transition-all duration-200 border border-[#B4924C]/20 hover:border-[#B4924C]/30"
      >
        <Plus className="w-5 h-5 text-[#B4924C]" />
        <span>Prompts</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-[#1a1a1a] rounded-xl p-3 w-[300px] shadow-xl border border-[#B4924C]/20 z-10">
          <div className="relative mb-3">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search prompts..."
              className="w-full pl-4 pr-10 py-2.5 bg-black/30 rounded-lg text-white placeholder-gray-500 outline-none text-right border border-[#B4924C]/10 focus:border-[#B4924C]/30 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[#363636] rounded-md"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {isAdding ? (
            <form onSubmit={handleAddPrompt} className="mb-3">
              <input
                ref={inputRef}
                type="text"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="Type your custom prompt..."
                className="w-full px-4 py-2.5 bg-black/30 rounded-lg text-white placeholder-gray-500 outline-none mb-2 border border-[#B4924C]/10 focus:border-[#B4924C]/30 transition-colors"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewPrompt('');
                  }}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:bg-[#363636] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-[#B4924C] to-[#DAA520] text-black rounded-lg hover:from-[#DAA520] hover:to-[#B4924C] transition-all duration-300 font-medium"
                >
                  Add Prompt
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 w-full px-3 py-2.5 mb-3 text-sm text-gray-400 hover:bg-[#363636] rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Prompt</span>
            </button>
          )}

          <div className="max-h-[400px] overflow-y-auto pr-2 -mr-2 space-y-2 scrollbar-thin scrollbar-thumb-[#B4924C] scrollbar-track-transparent">
            {allCategories.map((category) => (
              <div key={category.name} className="bg-black/30 rounded-lg overflow-hidden border border-[#B4924C]/10">
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-[#363636] transition-colors"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    expandedCategory === category.name ? 'rotate-180' : ''
                  }`} />
                  <span>{category.name}</span>
                </button>
                {expandedCategory === category.name && (
                  <div className="border-t border-[#B4924C]/10">
                    {category.subPrompts.map((prompt, index) => (
                      <div
                        key={index}
                        className="group flex items-center justify-between px-3 py-2.5 hover:bg-[#363636] transition-colors"
                      >
                        {category.name === 'Custom' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCustomPrompt(prompt);
                            }}
                            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-[#404040] rounded-md transition-all"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            onSelect(prompt);
                            setIsOpen(false);
                            setSearchTerm('');
                          }}
                          className="flex-1 text-sm text-white text-right hover:translate-x-1 transition-transform duration-200"
                        >
                          {prompt}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};