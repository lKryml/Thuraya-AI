import { useEffect, useState } from 'react';
import { useOnboardingStore } from '../store/onboardingStore';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  target: string;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
  beforeShow?: () => void;
}

export function Onboarding() {
  const { hasCompletedOnboarding, setHasCompletedOnboarding } = useOnboardingStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);

  const steps: OnboardingStep[] = [
    {
        title: 'مرحباً بك في المساعد القانوني',
        description: 'مساعدك القانوني المدعوم بالذكاء الاصطناعي. دعنا نأخذ جولة سريعة لمساعدتك في البدء مع ميزاتنا.',
        target: 'body',
        placement: 'center',
        beforeShow: () => {
          const chatsTab = document.querySelector('.chats-tab') as HTMLButtonElement;
          if (chatsTab && !chatsTab.classList.contains('active')) {
            chatsTab.click();
          }
        }
      },
      {
        title: 'أوضاع المحادثة',
        description: 'اختر بين وضع الاستشارة للحصول على مشورة قانونية تفاعلية أو وضع البحث للحصول على معلومات قانونية متعمقة.',
        target: '.mode-selector',
        placement: 'bottom',
        beforeShow: () => {
          const chatsTab = document.querySelector('.chats-tab') as HTMLButtonElement;
          if (chatsTab && !chatsTab.classList.contains('active')) {
            chatsTab.click();
          }
        }
      },
      {
        title: 'الاستفسارات السريعة',
        description: 'الوصول إلى استفسارات قانونية مكتوبة مسبقاً أو إنشاء استفساراتك المخصصة للحالات القانونية الشائعة.',
        target: '.prompts-button',
        placement: 'top',
        beforeShow: () => {
          const chatsTab = document.querySelector('.chats-tab') as HTMLButtonElement;
          if (chatsTab && !chatsTab.classList.contains('active')) {
            chatsTab.click();
          }
        }
      },
      {
        title: 'بدء محادثة جديدة',
        description: 'انقر هنا لبدء محادثة جديدة مع مساعدك القانوني.',
        target: '.new-chat-button',
        placement: 'right',
        beforeShow: () => {
          const chatsTab = document.querySelector('.chats-tab') as HTMLButtonElement;
          if (chatsTab) {
            chatsTab.click();
          }
        }
      },
    {
      title: 'تحليل المستندات',
      description: 'انتقل إلى تبويب المستندات لتحليل المستندات القانونية ومقارنة العقود أو استخراج النص من الصور.',
      target: '.docs-tab',
      placement: 'bottom',
      beforeShow: () => {
        const docsTab = document.querySelector('.docs-tab') as HTMLButtonElement;
        if (docsTab) {
          docsTab.click();
        }
      }
    },
    {
      title: 'تلخيص المستندات',
      description: 'قم بتحميل المستندات القانونية للحصول على ملخصات مدعومة بالذكاء الاصطناعي تسلط الضوء على النقاط الرئيسية والالتزامات والبنود المهمة.',
      target: '[data-onboarding="summarize"]',
      placement: 'right',
      beforeShow: () => {
        const summarizeBtn = document.querySelector('[data-onboarding="summarize"]') as HTMLButtonElement;
        if (summarizeBtn) {
          summarizeBtn.click();
        }
      }
    },
    {
      title: 'مقارنة المستندات',
      description: 'قارن بين مستندين قانونيين لتحديد الاختلافات والتغييرات والتعارضات المحتملة بين الإصدارات.',
      target: '[data-onboarding="compare"]',
      placement: 'right',
      beforeShow: () => {
        const compareBtn = document.querySelector('[data-onboarding="compare"]') as HTMLButtonElement;
        if (compareBtn) {
          compareBtn.click();
        }
      }
    },
    {
      title: 'تحويل الصور إلى نص',
      description: 'حول صور المستندات القانونية إلى نص قابل للبحث باستخدام تقنية التعرف الضوئي على الحروف المتقدمة.',
      target: '[data-onboarding="image-to-text"]',
      placement: 'right',
      beforeShow: () => {
        const imageToTextBtn = document.querySelector('[data-onboarding="image-to-text"]') as HTMLButtonElement;
        if (imageToTextBtn) {
          imageToTextBtn.click();
        }
      }
    },
    {
      title: 'تحميل المستندات',
      description: 'اسحب وأفلت مستنداتك هنا أو انقر للتصفح. نحن ندعم ملفات PDF والنصوص والصور.',
      target: '[data-onboarding="upload-area"]',
      placement: 'top'
    },
    {
        title: 'ابدأ الآن',
        description: 'أنت جاهز! ابدأ في استكشاف المساعد القانوني واستفد من ميزاتنا القوية.',
        target: 'body',
        placement: 'center',
        beforeShow: () => {
          const chatsTab = document.querySelector('.chats-tab') as HTMLButtonElement;
          if (chatsTab) {
            chatsTab.click();
          }
        }
      }
  ];

  useEffect(() => {
    if (!hasCompletedOnboarding) {
      setIsVisible(true);
    }
  }, [hasCompletedOnboarding]);

  useEffect(() => {
    if (isVisible) {
      const step = steps[currentStep];
      
      if (step.beforeShow) {
        step.beforeShow();
      }

      setTimeout(() => {
        if (step.target !== 'body') {
          const element = document.querySelector(step.target);
          if (element) {
            setHighlightedElement(element);
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          setHighlightedElement(null);
        }
      }, 100);
    }
  }, [currentStep, isVisible, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    const shouldSkip = window.confirm('هل أنت متأكد من تخطي الجولة؟.');
    if (shouldSkip) {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setHasCompletedOnboarding(true);
    // Switch back to chats tab
    const chatsTab = document.querySelector('.chats-tab') as HTMLButtonElement;
    if (chatsTab) {
      chatsTab.click();
    }
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const targetElement = step.target === 'body' ? document.body : document.querySelector(step.target);
  const rect = targetElement?.getBoundingClientRect();

  const getPopoverStyle = () => {
    if (step.placement === 'center') {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
      };
    }

    if (!rect) return {};

    const spacing = 20;
    const popoverWidth = 448; // max-w-md (448px)
    const popoverHeight = 300; // Approximate height
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const baseStyle = {
      position: 'fixed',
      zIndex: 1000,
    };

    let top, left, transform;

    switch (step.placement) {
      case 'top':
        top = Math.max(spacing, rect.top - popoverHeight - spacing);
        left = Math.min(
          Math.max(spacing, rect.left + rect.width / 2),
          viewportWidth - popoverWidth - spacing
        );
        transform = 'translateX(-50%)';
        break;
      case 'bottom':
        top = Math.min(rect.bottom + spacing, viewportHeight - popoverHeight - spacing);
        left = Math.min(
          Math.max(spacing, rect.left + rect.width / 2),
          viewportWidth - popoverWidth - spacing
        );
        transform = 'translateX(-50%)';
        break;
      case 'left':
        top = Math.min(
          Math.max(spacing, rect.top + rect.height / 2),
          viewportHeight - popoverHeight - spacing
        );
        left = Math.max(spacing, rect.left - popoverWidth - spacing);
        transform = 'translateY(-50%)';
        break;
      case 'right':
        top = Math.min(
          Math.max(spacing, rect.top + rect.height / 2),
          viewportHeight - popoverHeight - spacing
        );
        left = Math.min(rect.right + spacing, viewportWidth - popoverWidth - spacing);
        transform = 'translateY(-50%)';
        break;
      default:
        return baseStyle;
    }

    return {
      ...baseStyle,
      top: `${top}px`,
      left: `${left}px`,
      transform,
    };
  };

  return (
    <>
      {/* Semi-transparent overlay that excludes the current highlighted element */}
      <div className="fixed inset-0 bg-black/30 z-[60]" />
      
      {/* Create a clear area around the highlighted element */}
      {highlightedElement && rect && (
        <div
          className="fixed z-[61]"
          style={{
            top: rect.top - 8,
            left: rect.left - 8,
            width: rect.width + 16,
            height: rect.height + 16,
            background: 'transparent',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
          }}
        />
      )}
      
      {/* Highlighted element border */}
      {highlightedElement && rect && (
        <div
          className="fixed z-[62] pointer-events-none"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            border: '2px solid #B4924C',
            borderRadius: '8px',
            boxShadow: '0 0 0 4px rgba(180, 146, 76, 0.3)',
            animation: 'pulse 2s infinite'
          }}
        />
      )}

      {/* Popover content */}
      <div
        className="fixed z-[63] bg-[#1a1a1a] rounded-xl shadow-xl border border-[#B4924C]/20 max-w-md w-full mx-4 md:mx-0"
        style={getPopoverStyle() as React.CSSProperties}
        dir="rtl"
      >
        <div className="relative p-6">
          <button
            onClick={handleComplete}
            className="absolute top-4 left-4 p-2 text-gray-400 hover:text-[#B4924C] hover:bg-black/30 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#B4924C] mb-2">{step.title}</h2>
            <p className="text-gray-300 leading-relaxed">{step.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-400 hover:text-[#B4924C] transition-colors"
              >
                تخطي الجولة
              </button>
              <div className="px-3 py-1 bg-[#B4924C]/10 rounded-full text-[#B4924C] text-sm">
                {steps.length} من {currentStep + 1}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="p-2 text-gray-400 hover:text-[#B4924C] hover:bg-black/30 rounded-lg transition-all duration-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
                            <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#B4924C] to-[#DAA520] text-black rounded-lg hover:from-[#DAA520] hover:to-[#B4924C] transition-all duration-300 font-medium"
              >
                {currentStep === steps.length - 1 ? (
                  'ابدأ الآن'
                ) : (
                  <>
                    <ChevronLeft className="w-5 h-5" />
                    التالي
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="h-1 bg-black/30 rounded-b-xl overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#B4924C] to-[#DAA520] transition-all duration-300 ease-out"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </>
  );
}