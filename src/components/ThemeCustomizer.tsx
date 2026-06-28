import React from "react";
import { ThemeConfig } from "../types";
import { Sliders, Palette, Type, Layout, Sparkles } from "lucide-react";

interface ThemeCustomizerProps {
  config: ThemeConfig;
  onChange: (updated: Partial<ThemeConfig>) => void;
  addLog: (text: string, type: 'info' | 'success' | 'warning' | 'error' | 'cmd') => void;
}

export default function ThemeCustomizer({
  config,
  onChange,
  addLog,
}: ThemeCustomizerProps) {

  const colorOptions = [
    { name: 'Indigo (인디고 블루)', value: 'indigo', hex: 'bg-indigo-600 hover:ring-indigo-300' },
    { name: 'Emerald (네이처 그린)', value: 'emerald', hex: 'bg-emerald-600 hover:ring-emerald-300' },
    { name: 'Rose (우아한 핑크)', value: 'rose', hex: 'bg-rose-600 hover:ring-rose-300' },
    { name: 'Amber (따뜻한 오렌지)', value: 'amber', hex: 'bg-amber-500 hover:ring-amber-200' },
    { name: 'Slate (시크한 그레이)', value: 'slate', hex: 'bg-slate-700 hover:ring-slate-400' },
    { name: 'Violet (풍부한 보라색)', value: 'violet', hex: 'bg-violet-600 hover:ring-violet-300' },
  ];

  const handleColorSelect = (colorValue: string, name: string) => {
    onChange({ primaryColor: colorValue });
    addLog(`[Theme] Brand primary color updated to ${name}. Preview re-rendered.`, 'info');
  };

  const handleLayoutSelect = (layoutValue: 'grid' | 'bento' | 'minimal') => {
    onChange({ layoutStyle: layoutValue });
    addLog(`[Theme] Homepage layout structure changed to "${layoutValue}".`, 'info');
  };

  const handleTypographySelect = (fontValue: 'sans' | 'display' | 'mono') => {
    onChange({ typography: fontValue });
    addLog(`[Theme] Typography font family updated to "${fontValue}".`, 'info');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="theme-customizer-card">
      {/* Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <Sliders size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 text-sm md:text-base">Headless 테마 비주얼 에디터</h3>
          <p className="text-xs text-slate-400">쇼핑몰 홈페이지의 레이아웃 및 스타일을 실시간 구성합니다</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Color Palette Choice */}
        <div>
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-2.5">
            <Palette size={14} className="text-indigo-500" />
            브랜드 주요 색상 (Primary Color)
          </label>
          <div className="flex flex-wrap gap-2.5">
            {colorOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleColorSelect(opt.value, opt.name)}
                className={`w-7 h-7 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-110 ${opt.hex} ${
                  config.primaryColor === opt.value
                    ? 'ring-4 ring-slate-200 border-2 border-white scale-110'
                    : 'border border-slate-200'
                }`}
                title={opt.name}
                id={`color-opt-${opt.value}`}
              />
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">선택한 색상은 버튼, 배너, 포인트 라벨의 테마 색상으로 반영됩니다.</p>
        </div>

        {/* Layout Pattern Select */}
        <div>
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-2.5">
            <Layout size={14} className="text-indigo-500" />
            홈페이지 메인 레이아웃 패턴
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'grid', label: '정형 그리드', desc: '안정적인 정렬' },
              { id: 'bento', label: 'bento 그리드', desc: '감각적인 비대칭' },
              { id: 'minimal', label: '미니멀 리스트', desc: '텍스트와 여백 중심' },
            ].map((lay) => (
              <button
                key={lay.id}
                type="button"
                onClick={() => handleLayoutSelect(lay.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  config.layoutStyle === lay.id
                    ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500'
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                }`}
                id={`layout-opt-${lay.id}`}
              >
                <span className="text-xs font-medium block text-slate-700">{lay.label}</span>
                <span className="text-[9px] text-slate-400 block mt-0.5 leading-tight">{lay.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Pairings */}
        <div>
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-2.5">
            <Type size={14} className="text-indigo-500" />
            웹 폰트 타이포그래피 스타일
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'sans', label: 'Sans-Serif', desc: '미디엄 고딕' },
              { id: 'display', label: 'Elegant Display', desc: '세련된 명조/세리프' },
              { id: 'mono', label: 'Tech Mono', desc: '시크한 고정폭' },
            ].map((font) => (
              <button
                key={font.id}
                type="button"
                onClick={() => handleTypographySelect(font.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  config.typography === font.id
                    ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500'
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                }`}
                id={`font-opt-${font.id}`}
              >
                <span className="text-xs font-medium block text-slate-700">{font.label}</span>
                <span className="text-[9px] text-slate-400 block mt-0.5 leading-tight">{font.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Customization Inputs */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">메인 히어로 타이틀 (Hero Title)</label>
            <input
              type="text"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              value={config.heroTitle}
              onChange={(e) => onChange({ heroTitle: e.target.value })}
              placeholder="히어로 헤드라인"
              id="theme-hero-title"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">메인 히어로 설명문 (Hero Subtitle)</label>
            <textarea
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-colors h-14 resize-none"
              value={config.heroSubtitle}
              onChange={(e) => onChange({ heroSubtitle: e.target.value })}
              placeholder="히어로 서브 설명문"
              id="theme-hero-subtitle"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">상단 긴급 프로모션 공지 배너 문구</label>
            <input
              type="text"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              value={config.headerBannerText}
              onChange={(e) => onChange({ headerBannerText: e.target.value })}
              placeholder="예: 무료 배송 혜택!"
              id="theme-banner-text"
            />
          </div>

          {/* Promo Toggle */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-500 animate-pulse" />
              <div className="text-[11px] font-medium text-slate-600">프로모션 섹션 항상 노출</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={config.showPromo}
                onChange={(e) => onChange({ showPromo: e.target.checked })}
                id="promo-toggle-input"
              />
              <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
