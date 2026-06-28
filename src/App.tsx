import React, { useState } from "react";
import { Product, ShopConfig, GitHubConfig, ThemeConfig, LogLine } from "./types";
import {
  DEFAULT_PRODUCTS,
  DEFAULT_SHOP_CONFIG,
  DEFAULT_GITHUB_CONFIG,
  DEFAULT_THEME_CONFIG,
  getShopifyQuerySnippet,
  getGitHubActionSnippet
} from "./data";
import ShopifyConfig from "./components/ShopifyConfig";
import GitHubConfigCard from "./components/GitHubConfigCard";
import ThemeCustomizer from "./components/ThemeCustomizer";
import StorefrontPreview from "./components/StorefrontPreview";
import DocsTabs from "./components/DocsTabs";
import AICoachChat from "./components/AICoachChat";
import {
  Sparkles,
  ShoppingBag,
  Github,
  CheckCircle2,
  Terminal,
  FileCode,
  LayoutGrid,
  HelpCircle,
  Copy,
  Check
} from "lucide-react";

export default function App() {
  const [shopConfig, setShopConfig] = useState<ShopConfig>(DEFAULT_SHOP_CONFIG);
  const [githubConfig, setGithubConfig] = useState<GitHubConfig>(DEFAULT_GITHUB_CONFIG);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(DEFAULT_THEME_CONFIG);
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [copiedShopify, setCopiedShopify] = useState(false);
  const [copiedGitHub, setCopiedGitHub] = useState(false);

  // Simulation activity logs state
  const [logs, setLogs] = useState<LogLine[]>([
    {
      text: "Shopify & GitHub Headless Storefront Creator Initialized.",
      type: "success",
      timestamp: new Date().toLocaleTimeString()
    },
    {
      text: "Mock inventory synced from atelier-minimal.myshopify.com storefront API.",
      type: "info",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const addLog = (text: string, type: 'info' | 'success' | 'warning' | 'error' | 'cmd') => {
    setLogs((prev) => [
      ...prev,
      {
        text,
        type,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const updateShopConfig = (updated: Partial<ShopConfig>) => {
    setShopConfig((prev) => ({ ...prev, ...updated }));
  };

  const updateGithubConfig = (updated: Partial<GitHubConfig>) => {
    setGithubConfig((prev) => ({ ...prev, ...updated }));
  };

  const updateThemeConfig = (updated: Partial<ThemeConfig>) => {
    setThemeConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateInventory = (productId: string, change: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newQty = Math.max(0, p.inventoryQuantity + change);
          addLog(`[Inventory Status] "${p.title}" stock level changed to ${newQty} units.`, 'info');
          return { ...p, inventoryQuantity: newQty };
        }
        return p;
      })
    );
  };

  const handleUpdatePrice = (productId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          addLog(`[Price Update] "${p.title}" pricing updated to ₩${newPrice.toLocaleString()}`, 'info');
          return { ...p, price: newPrice };
        }
        return p;
      })
    );
  };

  const handleCopyToClipboard = (text: string, type: 'shopify' | 'github') => {
    navigator.clipboard.writeText(text);
    if (type === 'shopify') {
      setCopiedShopify(true);
      setTimeout(() => setCopiedShopify(false), 2000);
    } else {
      setCopiedGitHub(true);
      setTimeout(() => setCopiedGitHub(false), 2000);
    }
    addLog(`[System] Code snippet copied to clipboard!`, 'success');
  };

  const activeColorThemeText = {
    indigo: 'text-indigo-600 border-indigo-100 bg-indigo-50',
    emerald: 'text-emerald-600 border-emerald-100 bg-emerald-50',
    rose: 'text-rose-600 border-rose-100 bg-rose-50',
    amber: 'text-amber-700 border-amber-100 bg-amber-50',
    slate: 'text-slate-700 border-slate-200 bg-slate-50',
    violet: 'text-violet-600 border-violet-100 bg-violet-50',
  }[themeConfig.primaryColor] || 'text-indigo-600 border-indigo-100 bg-indigo-50';

  const shopifyCode = getShopifyQuerySnippet(shopConfig.shopDomain, shopConfig.storefrontToken);
  const gitHubCode = getGitHubActionSnippet(githubConfig.username, githubConfig.repository, githubConfig.deployTarget);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 text-slate-800" id="headless-builder-root">
      {/* Top Banner & Title Bar */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 rounded-xl text-white">
              <ShoppingBag size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  Shopify & GitHub Headless Storefront Creator
                </h1>
                <span className="bg-indigo-600 text-white text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full animate-pulse">
                  AI Partner Build
                </span>
              </div>
              <p className="text-xs text-slate-400">쇼피파이 Storefront API와 GitHub Actions 자동 배포를 결합한 최고의 무지개빛 쇼핑몰 구축 파트너</p>
            </div>
          </div>

          {/* Top Info Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${activeColorThemeText}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              테마 색상: <span className="font-bold uppercase">{themeConfig.primaryColor}</span>
            </div>
            <div className="px-2.5 py-1 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center gap-1.5">
              레이아웃: <span className="font-bold uppercase text-slate-800">{themeConfig.layoutStyle}</span>
            </div>
            <div className="px-2.5 py-1 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 flex items-center gap-1">
              <CheckCircle2 size={12} /> Live Sync
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Configurations & Theme Customizers (lg:span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <ThemeCustomizer
            config={themeConfig}
            onChange={updateThemeConfig}
            addLog={addLog}
          />

          <ShopifyConfig
            config={shopConfig}
            onChange={updateShopConfig}
            products={products}
            onUpdateInventory={handleUpdateInventory}
            onUpdatePrice={handleUpdatePrice}
            addLog={addLog}
          />

          <GitHubConfigCard
            config={githubConfig}
            onChange={updateGithubConfig}
            onDeploy={() => addLog("[System] Triggered final code production assembly. Site preview updated.", "success")}
            addLog={addLog}
          />

          {/* Real-time Simulated Log Monitor */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden" id="system-logs-card">
            <div className="px-4 py-2.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono font-bold">
                <Terminal size={14} className="text-emerald-400" />
                <span>SYSTEM CONSOLE LOGS</span>
              </div>
              <button
                onClick={() => setLogs([])}
                className="text-[9px] text-slate-500 hover:text-slate-300 font-mono"
              >
                CLEAR
              </button>
            </div>
            <div className="p-4 h-40 overflow-y-auto font-mono text-[11px] space-y-1.5" id="logs-container">
              {logs.length === 0 ? (
                <div className="text-slate-500 text-center py-6">No new activity log lines.</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-slate-500 select-none">[{log.timestamp}]</span>
                    <span
                      className={
                        log.type === 'success'
                          ? 'text-emerald-400'
                          : log.type === 'warning'
                          ? 'text-amber-400'
                          : log.type === 'error'
                          ? 'text-rose-400'
                          : log.type === 'cmd'
                          ? 'text-sky-400 font-bold'
                          : 'text-slate-300'
                      }
                    >
                      {log.type === 'cmd' && '$ '}
                      {log.text}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Previews, Manual Tabs, AI Coach (lg:span-7) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section: Live Simulation Storefront Preview */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <LayoutGrid size={14} /> LIVE STOREFRONT HOMEPAGE PREVIEW
            </h3>
            <StorefrontPreview
              themeConfig={themeConfig}
              shopName={shopConfig.shopName}
              products={products}
              addLog={addLog}
            />
          </div>

          {/* Section: Interactive Educational Docs Tabs */}
          <DocsTabs />

          {/* Section: Dynamic Code Snippets Explorer */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="code-snippets-card">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm md:text-base flex items-center gap-2">
                <FileCode size={18} className="text-indigo-600" />
                자동 생성된 Shopify 및 GitHub 연동 핵심 코드
              </h3>
              <p className="text-xs text-slate-400">설정값에 따라 실시간 구성되는 프론트엔드 API 호출 스크립트 및 배포 YAML입니다</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Shopify Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">1. Shopify API GraphQL Fetch Helper (React/JS)</span>
                  <button
                    onClick={() => handleCopyToClipboard(shopifyCode, 'shopify')}
                    className="text-[11px] text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedShopify ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    {copiedShopify ? '복사 완료' : '코드 복사'}
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-200 text-[10px] md:text-xs p-4 rounded-xl overflow-x-auto font-mono max-h-56">
                  {shopifyCode}
                </pre>
              </div>

              {/* GitHub Pipeline Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">2. GitHub Actions 자동 빌드 및 배포 워크플로우 (.github/workflows/deploy.yml)</span>
                  <button
                    onClick={() => handleCopyToClipboard(gitHubCode, 'github')}
                    className="text-[11px] text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedGitHub ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    {copiedGitHub ? '복사 완료' : '코드 복사'}
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-200 text-[10px] md:text-xs p-4 rounded-xl overflow-x-auto font-mono max-h-56">
                  {gitHubCode}
                </pre>
              </div>
            </div>
          </div>

          {/* Section: AI Coach Chat Box with Gemini */}
          <AICoachChat
            shopConfig={shopConfig}
            githubConfig={githubConfig}
            themeConfig={themeConfig}
            addLog={addLog}
          />

        </div>
      </main>
    </div>
  );
}
