import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, ShopConfig, GitHubConfig, ThemeConfig } from "../types";
import { Send, Sparkles, MessageSquare, RefreshCw, ChevronRight, HelpCircle } from "lucide-react";

interface AICoachChatProps {
  shopConfig: ShopConfig;
  githubConfig: GitHubConfig;
  themeConfig: ThemeConfig;
  addLog: (text: string, type: 'info' | 'success' | 'warning' | 'error' | 'cmd') => void;
}

export default function AICoachChat({
  shopConfig,
  githubConfig,
  themeConfig,
  addLog,
}: AICoachChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome_01",
      role: "model",
      text: "안녕하세요! 쇼피파이와 깃허브를 이용한 헤드리스 홈페이지 공동 제작 전문가 AI 코치입니다. \n\n쇼핑몰 앱 확장 전략, 쇼피파이 액션 연동, 깃허브 자동 배포 가이드, 테마 커스터마이징 등 궁금한 점이 있으시다면 무엇이든 물어보세요! 아래 추천 추천 질문을 클릭하셔도 즉각 심층 답변을 보실 수 있습니다. 👇",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterPrompts = [
    { text: "쇼피파이 확장 앱(Klaviyo, Judge.me)의 연동 실례 알려줘", label: "📦 확장 앱 정밀 파헤치기" },
    { text: "Dawn 테마와 Prestige 테마의 디자인과 로딩 속도 비교해줘", label: "🎨 공식 테마 속도/디자인 비교" },
    { text: "Vite 배포 환경에서 Shopify API 토큰 안전 주입 가이드 만들어줘", label: "🔒 API 토큰 보안 주입법" },
    { text: "Bento 그리드 레이아웃을 React + Tailwind로 구현하는 컴포넌트 코드 짜줘", label: "💻 React/Tailwind 벤토 코드" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || sending) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setSending(true);
    addLog(`[AI Coach] Generating detailed response...`, 'cmd');

    try {
      // Collect state variables to pass as high fidelity context
      const context = {
        shopDomain: shopConfig.shopDomain,
        storefrontToken: shopConfig.storefrontToken ? "주입됨" : "미정",
        shopName: shopConfig.shopName,
        githubUser: githubConfig.username,
        githubRepo: githubConfig.repository,
        deployTarget: githubConfig.deployTarget,
        themeStyle: themeConfig.layoutStyle,
        primaryColor: themeConfig.primaryColor,
      };

      // Compile history (excluding welcome message for simpler processing, or formatting cleanly)
      const chatHistory = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory,
          context
        })
      });

      if (!response.ok) {
        throw new Error("AI 엔진 서버 연결에 실패했습니다.");
      }

      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: "model",
        text: data.text || "답변을 가져오지 못했습니다.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
      addLog(`[AI Coach] Success - custom guidance response generated!`, 'success');
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: "model",
        text: `죄송합니다. 오류가 발생했습니다: ${err.message || '인터넷 연결을 확인하고 다시 시도해 주세요.'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
      addLog(`[AI Coach] Error generating model output`, 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[650px] overflow-hidden" id="ai-coach-chat-card">
      {/* Chat Header */}
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles size={16} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Shopify & GitHub 공동 개발 AI 코치</h3>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              24/7 양방향 연동 솔루션 실시간 가이드 (Gemini)
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setMessages([
              {
                id: "welcome_01",
                role: "model",
                text: "대화를 새로 시작했습니다. 무엇이든 편하게 물어보세요!",
                timestamp: new Date()
              }
            ]);
            addLog("[AI Coach] Chat conversation history cleared.", "info");
          }}
          className="text-slate-400 hover:text-white transition-colors p-1.5 rounded bg-slate-800 text-xs flex items-center gap-1 cursor-pointer"
          id="clear-chat-btn"
        >
          <RefreshCw size={12} /> 초기화
        </button>
      </div>

      {/* Messages Board */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50" id="chat-messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
            }`}
            id={`chat-msg-bubble-${msg.id}`}
          >
            <div
              className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none"
                  : "bg-white text-slate-800 border border-slate-100 shadow-sm rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[9px] text-slate-400 mt-1 px-1">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {sending && (
          <div className="mr-auto items-start max-w-[85%] flex flex-col gap-1.5" id="chat-loading-bubble">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span className="text-xs text-slate-400 font-medium">AI 코치가 최적의 연동 코드를 연산 중입니다...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Recommended Starter Prompts Panel */}
      <div className="px-6 py-3 bg-white border-t border-slate-100" id="chat-starters">
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-2 flex items-center gap-1">
          <HelpCircle size={10} /> 추천 바로 물어보기 (클릭)
        </span>
        <div className="flex flex-wrap gap-1.5">
          {starterPrompts.map((st, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(st.text)}
              disabled={sending}
              className="text-[10px] md:text-[11px] px-3 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 text-slate-600 hover:text-indigo-700 transition-all font-medium text-left cursor-pointer flex items-center gap-1 max-w-full truncate"
              id={`starter-btn-${idx}`}
            >
              <span>{st.label}</span>
              <ChevronRight size={10} className="text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-4 bg-white border-t border-slate-100 flex gap-2"
        id="chat-input-form"
      >
        <input
          type="text"
          className="flex-1 text-xs md:text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          placeholder="AI 코치에게 깃허브 배포 및 쇼피파이 연동에 대해 질문하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
          id="chat-text-input"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white p-2.5 rounded-xl cursor-pointer transition-colors"
          id="chat-submit-btn"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
