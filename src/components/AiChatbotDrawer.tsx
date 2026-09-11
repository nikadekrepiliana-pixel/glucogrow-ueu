import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  RotateCcw, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  ShieldCheck, 
  Zap, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AiChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProvider: 'gemini' | 'openai';
  onChangeProvider: (provider: 'gemini' | 'openai') => void;
  initialContext?: any;
}

const PRESET_PROMPTS = [
  "Vitamin itu ada di sayur apa saja?",
  "Contoh menu MPASI 8 bulan kaya zat besi",
  "Anak saya GTM (sulit makan), apa solusinya?",
  "Jika anak tidak suka ikan, bisa diganti apa?",
  "Apa tanda-tanda awal anak berisiko stunting?",
  "Jadwal vaksin wajib anak usia 9 bulan"
];

export const AiChatbotDrawer: React.FC<AiChatbotDrawerProps> = ({
  isOpen,
  onClose,
  selectedProvider,
  onChangeProvider,
  initialContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: 'Halo Ayah & Bunda! Saya **GlucoBot AI**, asisten nutrisi cerdas dan pencegahan stunting balita. Ada yang bisa saya bantu terkait makanan bergizi, grafik tumbuh kembang, atau tips MPASI hari ini?',
      provider: 'gemini',
      model: 'gemini-3.8-flash',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle incoming context from Calculator / Patient table
  useEffect(() => {
    if (initialContext && isOpen) {
      const contextPrompt = `Tolong berikan analisis gizi dan saran praktis untuk balita bernama ${initialContext.name || 'Anak'}, usia ${initialContext.age} bulan, tinggi ${initialContext.height} cm, berat ${initialContext.weight} kg dengan status ${initialContext.status}.`;
      handleSendMessage(contextPrompt, initialContext);
    }
  }, [initialContext]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      // Strip markdown asterisks and hash tags for natural speech
      const cleanText = text.replace(/[*_#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'id-ID';
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleResetChat = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: 'Percakapan telah direset. Silakan tanyakan seputar nutrisi balita, resep MPASI, pemantauan berat & tinggi badan, atau pencegahan stunting!',
        provider: selectedProvider,
        model: selectedProvider === 'gemini' ? 'gemini-3.8-flash' : 'gpt-4o-mini',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSendMessage = async (textToSend?: string, contextData?: any) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call server AI endpoint
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          provider: selectedProvider,
          context: contextData,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi layanan AI');
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Maaf, tidak dapat menghasilkan jawaban saat ini.',
        provider: data.provider || selectedProvider,
        model: data.model || (selectedProvider === 'gemini' ? 'gemini-3.8-flash' : 'gpt-4o-mini'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Mohon maaf, koneksi ke asisten AI sedang mengalami kendala. Anda dapat mencoba mengajukan pertanyaan kembali atau beralih antara Google Gemini dan OpenAI ChatGPT di bagian atas.',
        provider: 'offline-fallback',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full sm:w-[500px] h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 transition-all">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-emerald-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">GlucoBot AI</h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/25 text-white tracking-wide uppercase">
                  Online
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Pakar Nutrisi Anak & Pencegahan Stunting
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              title="Reset Percakapan"
              className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Tutup Chat"
              className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Engine Switcher Bar */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <CpuIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Mesin AI Terhubung:</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onChangeProvider('gemini')}
              className={`px-2.5 py-1 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-all ${
                selectedProvider === 'gemini'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
              Google Gemini
            </button>
            <button
              onClick={() => onChangeProvider('openai')}
              className={`px-2.5 py-1 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-all ${
                selectedProvider === 'openai'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-300"></span>
              ChatGPT (OpenAI)
            </button>
          </div>
        </div>

        {/* Chat Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mb-1 px-1">
                  {!isUser && (
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <Bot className="w-3 h-3" /> GlucoBot
                    </span>
                  )}
                  {msg.provider && (
                    <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                      {msg.provider === 'gemini' ? 'Gemini 3.8 Flash' : msg.provider === 'openai' ? 'GPT-4o mini' : 'Smart KB'}
                    </span>
                  )}
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-br-xs shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-700 shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2">
                    {formatMarkdownText(msg.content)}
                  </div>

                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-end gap-2 text-slate-400 dark:text-slate-500">
                      <button
                        onClick={() => handleSpeak(msg.content)}
                        className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-1"
                        title={isSpeaking ? 'Hentikan Suara' : 'Dengarkan Jawaban'}
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-1 flex items-center gap-1 text-[11px]"
                        title="Salin Teks"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600 text-[10px]">Tersalin</span>
                          </>
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 px-1">
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <Bot className="w-3 h-3" /> GlucoBot AI
                </span>
                <span>sedang menganalisis gizi...</span>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl rounded-bl-xs border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-2 text-sm text-slate-500">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span className="text-xs text-slate-500">Menyusun rekomendasi terbaik...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggestion Prompts */}
        <div className="p-2.5 bg-slate-100/70 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-1.5 px-1">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            <span>Rekomendasi Pertanyaan Cepat:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {PRESET_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tanyakan nutrisi, MPASI, pencegahan stunting..."
              disabled={isLoading}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white flex items-center justify-center shadow-sm transition-all shrink-0 cursor-pointer"
              title="Kirim Pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400 px-1">
            <span>Standar WHO & Kemenkes RI</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Respons Terverifikasi Gizi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function CpuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props} 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      viewBox="0 0 24 24" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="16" height="16" rx="2"/>
      <rect x="9" y="9" width="6" height="6"/>
      <path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2"/>
    </svg>
  );
}

// Simple parser to render basic markdown safely without heavy extra bundle
function formatMarkdownText(text: string) {
  // Split into paragraphs
  const paragraphs = text.split('\n\n');
  return paragraphs.map((para, i) => {
    // Check if bullet point list
    const lines = para.split('\n');
    const isList = lines.every((line) => line.trim().startsWith('- ') || line.trim().startsWith('* ') || /^\d+\.\s/.test(line.trim()));

    if (isList) {
      return (
        <ul key={i} className="list-disc list-inside space-y-1 my-1">
          {lines.map((line, j) => {
            const cleanLine = line.replace(/^[-*]\s+|\d+\.\s+/, '');
            return (
              <li key={j} className="pl-1">
                {renderInlineMarkdown(cleanLine)}
              </li>
            );
          })}
        </ul>
      );
    }

    return (
      <p key={i} className="my-1 leading-relaxed">
        {renderInlineMarkdown(para)}
      </p>
    );
  });
}

function renderInlineMarkdown(str: string) {
  // Handle bold **text**
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-slate-950 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
