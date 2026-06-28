import React, { useState } from "react";
import { BookOpen, ShoppingBag, Globe, Zap, ExternalLink, HelpCircle, Code, Layers } from "lucide-react";

export default function DocsTabs() {
  const [activeTab, setActiveTab] = useState<'apps' | 'themes' | 'headless'>('apps');

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="docs-tab-card">
      {/* Tabs list */}
      <div className="bg-slate-50 border-b border-slate-100 flex overflow-x-auto">
        <button
          onClick={() => setActiveTab('apps')}
          className={`flex-1 min-w-[150px] px-5 py-3 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'apps'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          id="tab-btn-apps"
        >
          <Zap size={14} /> 쇼피파이 추천 확장 앱 & 연동법
        </button>
        <button
          onClick={() => setActiveTab('themes')}
          className={`flex-1 min-w-[150px] px-5 py-3 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'themes'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          id="tab-btn-themes"
        >
          <ShoppingBag size={14} /> 공식 테마 추천 & 커스텀 가이드
        </button>
        <button
          onClick={() => setActiveTab('headless')}
          className={`flex-1 min-w-[150px] px-5 py-3 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'headless'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          id="tab-btn-headless"
        >
          <Code size={14} /> 헤드리스 연동 기술 가이드
        </button>
      </div>

      <div className="p-6">
        {/* TAB 1: SHOPPING APPS & HEADLESS COMPATIBILITY */}
        {activeTab === 'apps' && (
          <div className="space-y-6" id="tab-content-apps">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
                <span className="w-1.5 h-3 bg-indigo-600 rounded-full inline-block"></span>
                Shopify 기능 확장을 위한 4가지 핵심 앱 추천
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                쇼피파이 스토어를 고도화할 때 많이 사용하는 최고 수준의 확장 애플리케이션들입니다. 헤드리스 프론트엔드(GitHub Pages 배포 환경)에서 어떻게 데이터를 API로 가져오고 연동하는지 실제 비즈니스 유스케이스와 함께 자세히 안내해 드립니다.
              </p>
            </div>

            {/* App 1 */}
            <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-mono">1. Klaviyo (이메일 & 마케팅 자동화)</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">100% 연동 가능</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                주요 기능: 구매자의 행동 데이터(장바구니 이탈, 결제 완료, 선호 태그)를 추적하여 개인화 이메일 및 문자 캠페인을 실시간 발송합니다.
              </p>
              <div className="text-[11px] text-slate-500 space-y-1 pl-2 border-l border-slate-200">
                <p><strong>• GitHub Pages 연동법:</strong> Klaviyo가 제공하는 정적 JavaScript 추적 스크립트(Klaviyo JS SDK)를 Vite 프로젝트 <code className="bg-slate-100 text-rose-600 px-1 py-0.2 rounded font-mono text-[10px]">index.html</code>에 간편하게 심은 뒤, 프론트엔드 클릭 이벤트를 통해 고객 이메일 정보를 전송합니다.</p>
                <p><strong>• 활용 유스케이스:</strong> 고객이 특정 데스크 가젯 상품 페이지를 보고 구매하지 않은 채 퇴장 시, 3시간 내 10% 웰컴 할인 쿠폰을 자동 발송하여 재방문을 유도합니다.</p>
              </div>
            </div>

            {/* App 2 */}
            <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-mono">2. Judge.me (고객 리뷰 및 소셜 평점)</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">API / 위젯 연동 가능</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                주요 기능: 상품 상세 페이지에 우아한 고객 리뷰 창을 생성하고, 포토 리뷰 등록 유도 이메일을 발송하며 소셜 미디어 평점을 구축합니다.
              </p>
              <div className="text-[11px] text-slate-500 space-y-1 pl-2 border-l border-slate-200">
                <p><strong>• GitHub Pages 연동법:</strong> Judge.me가 제공하는 공식 REST / GraphQL Metafields API 또는 Widget JS Embed API를 사용합니다. 헤드리스 쇼핑몰에서는 Shopify Storefront API의 <code className="bg-slate-100 text-rose-600 px-1 py-0.2 rounded font-mono text-[10px]">metafields</code> 필드를 활용하여 리뷰 리스트와 별점 데이터를 실시간 랜더링합니다.</p>
                <p><strong>• 활용 유스케이스:</strong> "Minimalist Mechanical Keyboard" 하단에 실제 고객들이 등록한 타건감 포토 리뷰 4.8 평점을 커스텀 컴포넌트로 깔끔하게 노출해 구매 신뢰도를 강화합니다.</p>
              </div>
            </div>

            {/* App 3 */}
            <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-mono">3. Recharge Subscriptions (정기 정기구독 결제)</span>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold">헤드리스 전용 SDK 지원</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                주요 기능: 일회성 구매가 아닌 매월 일정한 날짜에 결제 및 정기 배송이 반복되도록 설계하는 구독형 이커머스 솔루션입니다.
              </p>
              <div className="text-[11px] text-slate-500 space-y-1 pl-2 border-l border-slate-200">
                <p><strong>• GitHub Pages 연동법:</strong> Recharge API와 React용 Recharge SDK를 활용합니다. 장바구니에 담긴 상품의 결제 수단 유형에 구독 메타 데이터를 덧붙여 Shopify Checkout으로 전송하여 결제창을 안전하게 구독 모드로 변경시킵니다.</p>
                <p><strong>• 활용 유스케이스:</strong> 친환경 데스크 오거나이저 세트나 주기적으로 교체가 필요한 마우스 패드/소모품을 30일 간격으로 정기 구독 신청하여 15% 할인된 가격에 정기 배송받는 시스템을 구축합니다.</p>
              </div>
            </div>

            {/* App 4 */}
            <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-mono">4. Smile.io (포인트 및 로열티 고객 보상)</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">REST / Webhook 연동 가능</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                주요 기능: 구매 금액에 따른 마일리지 포인트 적립, 지인 추천 리퍼럴 링크 제공, 생일 축하 전용 마일리지를 통해 장기 우수 고객층을 형성합니다.
              </p>
              <div className="text-[11px] text-slate-500 space-y-1 pl-2 border-l border-slate-200">
                <p><strong>• GitHub Pages 연동법:</strong> Smile.io의 Web API 또는 전용 팝업 임베드 코드를 활용합니다. 깃허브 페이지의 우측 하단에 Smile 임베딩 위젯을 장착하여 사용자가 별도의 로그인 없이 스토어 멤버십 포인트를 즉각 확인하도록 만듭니다.</p>
                <p><strong>• 활용 유스케이스:</strong> 회원이 가입 시 기본 1,000 포인트를 증정하고, 지인에게 링크 공유를 통해 구매 성사 시 두 유저 모두에게 5,000 할인 쿠폰을 자동 발급해 고객 유치 비용을 절감합니다.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OFFICAL THEMES RECOMMENDATION & CUSTOM MANUAL */}
        {activeTab === 'themes' && (
          <div className="space-y-6" id="tab-content-themes">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
                <span className="w-1.5 h-3 bg-indigo-600 rounded-full inline-block"></span>
                Shopify 최고 인기 공식 테마 추천
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                쇼피파이 공식 테마 스토어에서 제공하는 대표적인 프리미엄 및 무료 Liquid 테마의 특성과 선택 가이드를 제시합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Theme 1 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800">1. Dawn (무료 공식 기본 테마)</h4>
                  <span className="text-[9px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">무료 / 필수</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>특징:</strong> 쇼피파이가 "Online Store 2.0" 아키텍처를 도입하며 구축한 레퍼런스 테마입니다. 매우 빠르고 불필요한 스크립트가 없어 첫 로딩 속도가 탑티어입니다.
                </p>
                <div className="text-[10px] text-slate-500 space-y-1">
                  <p className="text-emerald-700 font-semibold">• 장점: 극도의 빠른 속도, 풍부한 무료 유지보수, 기본에 충실한 직관적 레이아웃.</p>
                  <p className="text-rose-700 font-semibold">• 단점: 다소 심플하고 평범하여 독창적인 대규모 기획 스토어 구현에는 밋밋함.</p>
                </div>
              </div>

              {/* Theme 2 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800">2. Prestige (럭셔리 프리미엄 테마)</h4>
                  <span className="text-[9px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-mono">유료 (Premium)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>특징:</strong> 고품질의 고해상도 브랜드 화보, 대형 배너, 스토리텔링 인터랙션을 중심으로 설계된 미적인 극치에 도달한 프리미엄 테마입니다.
                </p>
                <div className="text-[10px] text-slate-500 space-y-1">
                  <p className="text-emerald-700 font-semibold">• 장점: 럭셔리 패션 및 라이프스타일에 걸맞은 우아한 마진 설계와 패러랙스 애니메이션.</p>
                  <p className="text-rose-700 font-semibold">• 단점: 이미지가 무거울 경우 성능 최적화가 필요하며, 상대적으로 높은 비용($300+).</p>
                </div>
              </div>

              {/* Theme 3 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800">3. Impulse (대규모 카탈로그 테마)</h4>
                  <span className="text-[9px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">유료 (Premium)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>특징:</strong> 상품 가짓수가 대단히 많고 카테고리 필터링이 복잡한 메가 쇼핑몰에 아주 최적화되어 있는 고성능 테마입니다.
                </p>
                <div className="text-[10px] text-slate-500 space-y-1">
                  <p className="text-emerald-700 font-semibold">• 장점: 고도화된 메가 메뉴, 상세한 멀티필터링, 프로모션 팝업의 자체 제어 기능 풍부.</p>
                  <p className="text-rose-700 font-semibold">• 단점: 너무 복잡한 카테고리 설정이 필요해 초보자가 초기에 세팅하기 까다로움.</p>
                </div>
              </div>

              {/* Theme 4 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800">4. Refresh (산뜻한 큐레이션 테마)</h4>
                  <span className="text-[9px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">무료 / 산뜻함</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>특징:</strong> 소규모 웰니스, 유기농 식품, 독점 패키지 상품을 파는 브랜드에 잘 어울리는 깨끗하고 볼드한 서체를 지닌 신선한 느낌의 무료 테마입니다.
                </p>
                <div className="text-[10px] text-slate-500 space-y-1">
                  <p className="text-emerald-700 font-semibold">• 장점: 볼드한 외곽선과 미니멀 패널 디자인으로 젊은 MZ세대 트렌디 스토어 적합.</p>
                  <p className="text-rose-700 font-semibold">• 단점: 대형 화보 위주의 스토리 빌딩 기능은 부족함.</p>
                </div>
              </div>
            </div>

            {/* Practical Customization Guide */}
            <div className="bg-indigo-50/40 rounded-xl p-5 border border-indigo-100/50 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Layers size={14} className="text-indigo-600" />
                기본 커스터마이징 실무 로드맵 (색상, 폰트, 로고 등)
              </h4>
              <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                <div>
                  <strong className="text-slate-800 block mb-0.5">1단계: 로고 등록 및 브랜드 에셋 수립</strong>
                  <p>Shopify 어드민의 <code className="bg-white/80 px-1 py-0.2 rounded font-mono text-[11px]">온라인 스토어 &gt; 테마 &gt; 사용자 정의(Customize)</code>로 들어갑니다. 사이드바의 헤더 섹션에서 브랜드 대표 투명 PNG 로고(권장 너비 200px 미만)를 등록하고 파비콘(Favicon)을 일괄 설정합니다.</p>
                </div>
                <div>
                  <strong className="text-slate-800 block mb-0.5">2단계: 브랜드 테마 컬러 설정</strong>
                  <p>테마 설정(톱니바퀴 아이콘) &gt; <code className="bg-white/80 px-1 py-0.2 rounded font-mono text-[11px]">Colors</code> 메뉴로 이동합니다. 브랜드의 대표 아이덴티티가 담긴 Primary Accent(일반적으로 브랜드 메인 컬러), 배경색(깔끔한 미디엄 아이보리나 오프화이트 추천), 본문 텍스트 색상(깊은 챠콜 또는 소프트 블랙)을 조합합니다.</p>
                </div>
                <div>
                  <strong className="text-slate-800 block mb-0.5">3단계: 타이포그래피(Typography) 매핑</strong>
                  <p>사용자 정의 설정 &gt; Typography 탭에서 본문과 제목용 시스템 폰트를 설정합니다. 한국어 브랜드의 경우 한글 가독성이 높은 <strong className="font-semibold">Noto Sans KR</strong> 또는 명조 계열의 고급스러움을 더하는 <strong className="font-semibold">Noto Serif KR</strong>을 매핑하면 세련된 느낌을 완성합니다.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HEADLESS STOREFRONT DETAILED INFO */}
        {activeTab === 'headless' && (
          <div className="space-y-4" id="tab-content-headless">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
                <span className="w-1.5 h-3 bg-indigo-600 rounded-full inline-block"></span>
                헤드리스 커머스: 왜 쇼피파이 + 깃허브를 조합할까요?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                이 조합은 벡엔드(재고, 결제, 정기 구독 등 강력한 쇼피파이 인프라)와 프론트엔드(자유롭고 빠른 배포를 자랑하는 GitHub Pages 및 React/Vite 환경)를 완벽히 분리하는 헤드리스 커머스를 가장 저렴하고 유연하게 구현하는 이상적인 솔루션입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-xs font-bold text-slate-800 mb-1">⚡ 극강의 로딩 속도</span>
                <span className="block text-[11px] text-slate-500">
                  전 세계에 분산된 깃허브 CDN 서버망을 이용하여 일반적인 무거운 쇼피파이 테마보다 최대 5~10배 빠른 첫 페이지 로딩 속도를 달성합니다.
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-xs font-bold text-slate-800 mb-1">🛠️ 독창적인 UI 자유도</span>
                <span className="block text-[11px] text-slate-500">
                  쇼피파이 전용 언어인 Liquid에 한정되지 않고, React, Tailwind, Framer Motion, 3D Canvas 등 최신 자바스크립트 기술을 제약 없이 사용합니다.
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-xs font-bold text-slate-800 mb-1">📉 저렴한 유지보수 비용</span>
                <span className="block text-[11px] text-slate-500">
                  서버 구동 비용 없이 깃허브 정적 웹 호스팅을 무료로 누리면서, 데이터 수정 및 결제 프로세스는 보안이 보장된 Shopify가 처리하게 합니다.
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100/60 text-xs text-emerald-800">
              <strong>💡 팁:</strong> 헤드리스 결제 시 사용자가 카드를 등록하는 Checkout 구간은 Shopify Storefront API가 발급하는 고유 세션 도메인으로 자동 전환되어 처리되므로 결제 보안에 대한 걱정이 전혀 필요 없습니다!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
