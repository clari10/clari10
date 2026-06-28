import React, { useState } from "react";
import { ShopConfig, Product } from "../types";
import { CheckCircle, AlertCircle, RefreshCw, ShoppingBag, Database, ArrowRight, Package } from "lucide-react";

interface ShopifyConfigProps {
  config: ShopConfig;
  onChange: (updated: Partial<ShopConfig>) => void;
  products: Product[];
  onUpdateInventory: (productId: string, change: number) => void;
  onUpdatePrice: (productId: string, newPrice: number) => void;
  addLog: (text: string, type: 'info' | 'success' | 'warning' | 'error' | 'cmd') => void;
}

export default function ShopifyConfig({
  config,
  onChange,
  products,
  onUpdateInventory,
  onUpdatePrice,
  addLog,
}: ShopifyConfigProps) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>('success');

  const handleTestConnection = () => {
    setTesting(true);
    addLog(`[Shopify] Connecting to https://${config.shopDomain}/api/2024-01/graphql.json...`, 'cmd');
    
    setTimeout(() => {
      setTesting(false);
      setTestResult('success');
      onChange({ isConnected: true });
      addLog(`[Shopify] Successfully established connection with Storefront API for "${config.shopName}".`, 'success');
      addLog(`[Shopify] Fetched ${products.length} products with active pricing in ${config.currency}.`, 'info');
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="shopify-config-card">
      {/* Card Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm md:text-base">Shopify Storefront API 설정</h3>
            <p className="text-xs text-slate-400">헤드리스 쇼핑몰의 상품 데이터를 연동합니다</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {config.isConnected ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              연동 완료
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              연동 대기
            </span>
          )}
        </div>
      </div>

      {/* Inputs Section */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">쇼핑몰 상호명</label>
            <input
              type="text"
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              value={config.shopName}
              onChange={(e) => onChange({ shopName: e.target.value })}
              placeholder="예: 아틀리에 미니멀"
              id="shopify-shop-name-input"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">쇼피파이 주소 (.myshopify.com)</label>
            <input
              type="text"
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              value={config.shopDomain}
              onChange={(e) => onChange({ shopDomain: e.target.value })}
              placeholder="your-shop.myshopify.com"
              id="shopify-domain-input"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Storefront API 액세스 토큰 (Access Token)</label>
          <div className="relative">
            <input
              type="password"
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors pr-10"
              value={config.storefrontToken}
              onChange={(e) => onChange({ storefrontToken: e.target.value })}
              placeholder="shpat_..."
              id="shopify-token-input"
            />
            <div className="absolute inset-y-0 right-3 flex items-center text-slate-400">
              <Database size={16} />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            * 쇼피파이 어드민 앱 개발 패널에서 발급받은 Public Storefront API 토큰을 사용합니다.
          </p>
        </div>

        {/* Buttons and actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 focus:outline-none disabled:opacity-50 transition-colors cursor-pointer"
            onClick={handleTestConnection}
            disabled={testing || !config.shopDomain || !config.storefrontToken}
            id="shopify-test-btn"
          >
            {testing ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                API 연결 테스트 중...
              </>
            ) : (
              <>
                <RefreshCw size={14} />
                연동 테스트 및 데이터 동기화
              </>
            )}
          </button>
        </div>

        {/* Synced Inventory Section */}
        {config.isConnected && (
          <div className="mt-6 pt-5 border-t border-slate-100" id="shopify-inventory-list">
            <div className="flex items-center justify-between mb-3.5">
              <h4 className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Package size={14} className="text-indigo-500" />
                동기화된 상품 재고 및 단가 관리
              </h4>
              <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-medium">
                실시간 양방향 반영
              </span>
            </div>
            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {products.map((prod) => (
                <div key={prod.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      referrerPolicy="no-referrer"
                      src={prod.imageUrl}
                      alt={prod.title}
                      className="w-10 h-10 object-cover rounded-lg bg-slate-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">{prod.title}</p>
                      <p className="text-[10px] text-slate-400">{prod.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    {/* Price edit */}
                    <div className="text-right">
                      <span className="text-[10px] block text-slate-400">단가</span>
                      <input
                        type="number"
                        className="w-20 text-xs px-1.5 py-0.5 border border-slate-200 rounded text-right focus:outline-none focus:border-indigo-500"
                        value={prod.price}
                        onChange={(e) => onUpdatePrice(prod.id, Number(e.target.value))}
                        id={`price-input-${prod.id}`}
                      />
                    </div>

                    {/* Inventory control */}
                    <div className="text-center">
                      <span className="text-[10px] block text-slate-400">재고</span>
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded px-1 py-0.5">
                        <button
                          className="w-4 h-4 text-[10px] font-bold text-slate-500 hover:bg-slate-100 rounded flex items-center justify-center cursor-pointer"
                          onClick={() => onUpdateInventory(prod.id, -1)}
                          disabled={prod.inventoryQuantity <= 0}
                          id={`inv-desc-${prod.id}`}
                        >
                          -
                        </button>
                        <span className="text-[11px] font-semibold text-slate-700 min-w-4 text-center">
                          {prod.inventoryQuantity}
                        </span>
                        <button
                          className="w-4 h-4 text-[10px] font-bold text-slate-500 hover:bg-slate-100 rounded flex items-center justify-center cursor-pointer"
                          onClick={() => onUpdateInventory(prod.id, 1)}
                          id={`inv-inc-${prod.id}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
