import React, { useState } from "react";
import { ThemeConfig, Product, CartItem } from "../types";
import { ShoppingCart, Heart, Sparkles, Check, ArrowRight, X, ExternalLink, RefreshCw } from "lucide-react";

interface StorefrontPreviewProps {
  themeConfig: ThemeConfig;
  shopName: string;
  products: Product[];
  addLog: (text: string, type: 'info' | 'success' | 'warning' | 'error' | 'cmd') => void;
}

export default function StorefrontPreview({
  themeConfig,
  shopName,
  products,
  addLog,
}: StorefrontPreviewProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Helper colors mapping to Tailwind
  const colorMap: Record<string, { bg: string, text: string, hover: string, border: string, ring: string, badgeBg: string }> = {
    indigo: {
      bg: 'bg-indigo-600',
      text: 'text-indigo-600',
      hover: 'hover:bg-indigo-700',
      border: 'border-indigo-600',
      ring: 'focus:ring-indigo-500',
      badgeBg: 'bg-indigo-50 text-indigo-700'
    },
    emerald: {
      bg: 'bg-emerald-600',
      text: 'text-emerald-600',
      hover: 'hover:bg-emerald-700',
      border: 'border-emerald-600',
      ring: 'focus:ring-emerald-500',
      badgeBg: 'bg-emerald-50 text-emerald-700'
    },
    rose: {
      bg: 'bg-rose-600',
      text: 'text-rose-600',
      hover: 'hover:bg-rose-700',
      border: 'border-rose-600',
      ring: 'focus:ring-rose-500',
      badgeBg: 'bg-rose-50 text-rose-700'
    },
    amber: {
      bg: 'bg-amber-500',
      text: 'text-amber-600',
      hover: 'hover:bg-amber-600',
      border: 'border-amber-500',
      ring: 'focus:ring-amber-400',
      badgeBg: 'bg-amber-50 text-amber-800'
    },
    slate: {
      bg: 'bg-slate-700',
      text: 'text-slate-700',
      hover: 'hover:bg-slate-800',
      border: 'border-slate-700',
      ring: 'focus:ring-slate-500',
      badgeBg: 'bg-slate-100 text-slate-800'
    },
    violet: {
      bg: 'bg-violet-600',
      text: 'text-violet-600',
      hover: 'hover:bg-violet-700',
      border: 'border-violet-600',
      ring: 'focus:ring-violet-500',
      badgeBg: 'bg-violet-50 text-violet-700'
    }
  };

  const activeTheme = colorMap[themeConfig.primaryColor] || colorMap.indigo;

  // Typographies
  const fontClass = {
    sans: 'font-sans',
    display: 'font-serif tracking-tight',
    mono: 'font-mono'
  }[themeConfig.typography] || 'font-sans';

  const addToCart = (product: Product) => {
    if (product.inventoryQuantity <= 0) {
      addLog(`[Shopify Cart] 품절 상품 "${product.title}"은 추가할 수 없습니다.`, 'warning');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    addLog(`[Shopify Cart] "${product.title}" 상품이 장바구니에 담겼습니다.`, 'success');
  };

  const toggleFavorite = (id: string, name: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(id);
      if (isFav) {
        addLog(`[Wishlist] "${name}" 상품 찜 목록에서 해제`, 'info');
        return prev.filter(f => f !== id);
      } else {
        addLog(`[Wishlist] "${name}" 상품 찜 등록 완료!`, 'success');
        return [...prev, id];
      }
    });
  };

  const handleCheckout = () => {
    addLog(`[Shopify Checkout] Shopify Storefront API를 통한 리다이렉트가 시작됩니다...`, 'cmd');
    addLog(`[Shopify Checkout] Created checkoutUrl: https://${shopName.toLowerCase().replace(/\s+/g, '-')}.myshopify.com/checkout/c/12345`, 'success');
    alert("쇼피파이 결제창(Checkout) 연동 완료! 실제 환경에서는 Shopify Storefront API에서 생성된 checkoutUrl로 사용자를 리다이렉트하게 됩니다.");
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden relative shadow-md ${fontClass}`} id="storefront-preview-canvas">
      {/* Simulation Browser Banner */}
      <div className="bg-slate-900 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
        </div>
        <div className="bg-slate-800 text-slate-300 px-4 py-0.5 rounded-md w-1/2 text-center font-mono truncate">
          https://{shopName.toLowerCase().replace(/\s+/g, '-') || 'shopify'}.github.io/storefront
        </div>
        <div className="flex items-center gap-1 bg-slate-800 text-[10px] text-indigo-300 font-semibold px-2 py-0.5 rounded border border-indigo-900/40">
          <Sparkles size={10} className="animate-pulse" /> Live Preview
        </div>
      </div>

      {/* Promomtion Banner if enabled */}
      {themeConfig.showPromo && (
        <div className={`${activeTheme.bg} text-white text-center py-2 text-xs font-semibold tracking-wide transition-all`} id="storefront-promo-banner">
          {themeConfig.headerBannerText || '최대 20% 초특가 할인 코드 이벤트 진행 중!'}
        </div>
      )}

      {/* Store Header Navigation */}
      <nav className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between shadow-sm sticky top-0 z-10" id="storefront-nav">
        <div className="flex items-center gap-6">
          <span className="font-extrabold text-slate-900 tracking-tight text-lg flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-full ${activeTheme.bg}`}></span>
            {shopName || "아틀리에 미니멀"}
          </span>
          <div className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-500">
            <span className="text-slate-900 cursor-pointer">Shop All</span>
            <span className="hover:text-slate-900 cursor-pointer">Best Sellers</span>
            <span className="hover:text-slate-900 cursor-pointer">Collections</span>
            <span className="hover:text-slate-900 cursor-pointer">About Us</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            id="storefront-cart-toggle"
          >
            <ShoppingCart size={20} />
            {totalCartCount > 0 && (
              <span className={`absolute -top-1 -right-1 w-5 h-5 ${activeTheme.bg} text-white rounded-full text-[10px] font-bold flex items-center justify-center`}>
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Header Section */}
      <header className="bg-white border-b border-slate-100 py-12 px-8 relative overflow-hidden" id="storefront-hero">
        <div className="max-w-2xl text-left relative z-10">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase ${activeTheme.badgeBg} mb-3`}>
            Shopify Storefront Powered
          </span>
          <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 leading-tight mb-3">
            {themeConfig.heroTitle || "완벽한 워크스페이스 아이템"}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 leading-relaxed mb-6">
            {themeConfig.heroSubtitle || "최고의 디자이너와 가젯 큐레이터들이 검증한 명품 에센셜 셀렉트 숍."}
          </p>
          <div className="flex gap-3">
            <button className={`${activeTheme.bg} ${activeTheme.hover} text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1 cursor-pointer`}>
              제품 둘러보기 <ArrowRight size={14} />
            </button>
            <button className="bg-slate-50 hover:bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 transition-all cursor-pointer">
              신상품 보기
            </button>
          </div>
        </div>

        {/* Decorative ambient gradient matching theme color */}
        <div className={`absolute -top-10 -right-10 w-64 h-64 rounded-full bg-gradient-to-br from-${themeConfig.primaryColor}-300/10 to-transparent blur-3xl pointer-events-none`} />
      </header>

      {/* Products Display Section */}
      <section className="p-8 max-w-7xl mx-auto" id="storefront-products-grid">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-extrabold text-slate-800 tracking-tight uppercase flex items-center gap-1.5">
              <span>●</span> MD Recommended Items
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5">실시간으로 업데이트되는 Shopify 재고 관리 연동 제품군</p>
          </div>
          <span className="text-[10px] font-medium text-slate-400 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
            총 {products.length}개의 상품 노출 중
          </span>
        </div>

        {/* Layout styling mapping */}
        {themeConfig.layoutStyle === 'bento' ? (
          /* Bento-grid style layout */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.slice(0, 3).map((prod, index) => {
              const isLarge = index === 0;
              return (
                <div
                  key={prod.id}
                  className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-md hover:border-slate-200 ${
                    isLarge ? 'md:col-span-2' : 'md:col-span-1'
                  }`}
                  id={`product-card-${prod.id}`}
                >
                  <div className={`relative overflow-hidden ${isLarge ? 'h-64 md:h-80' : 'h-48'}`}>
                    <img
                      referrerPolicy="no-referrer"
                      src={prod.imageUrl}
                      alt={prod.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      {isLarge && (
                        <span className="bg-slate-950 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                          BEST SELLER
                        </span>
                      )}
                      {prod.inventoryQuantity <= 3 && prod.inventoryQuantity > 0 && (
                        <span className="bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                          품절 임박 ({prod.inventoryQuantity}개 남음)
                        </span>
                      )}
                      {prod.inventoryQuantity === 0 && (
                        <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                          일시 품절
                        </span>
                      )}
                    </div>
                    {/* Actions */}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(prod.id, prod.title)}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-slate-600 hover:text-rose-500 shadow-sm transition-colors cursor-pointer"
                      id={`fav-btn-${prod.id}`}
                    >
                      <Heart size={14} className={favorites.includes(prod.id) ? "fill-rose-500 text-rose-500" : ""} />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">{prod.category}</span>
                      <h3 className="font-extrabold text-slate-800 text-sm md:text-base mt-1 line-clamp-1 hover:text-indigo-600 cursor-pointer" onClick={() => setSelectedProduct(prod)}>
                        {prod.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{prod.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                      <div className="text-slate-800 font-black text-sm md:text-base">
                        ₩{prod.price.toLocaleString()}
                      </div>
                      <button
                        type="button"
                        onClick={() => addToCart(prod)}
                        disabled={prod.inventoryQuantity === 0}
                        className={`text-[11px] px-3.5 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                          prod.inventoryQuantity === 0
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : `${activeTheme.bg} text-white ${activeTheme.hover}`
                        }`}
                        id={`add-cart-btn-${prod.id}`}
                      >
                        {prod.inventoryQuantity === 0 ? '품절' : '장바구니 담기'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Display the rest smaller */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
              {products.slice(3).map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-md"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      referrerPolicy="no-referrer"
                      src={prod.imageUrl}
                      alt={prod.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={() => toggleFavorite(prod.id, prod.title)}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-slate-600 hover:text-rose-500 shadow-sm transition-colors cursor-pointer"
                    >
                      <Heart size={14} className={favorites.includes(prod.id) ? "fill-rose-500 text-rose-500" : ""} />
                    </button>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400">{prod.category}</span>
                      <h4 className="font-bold text-slate-800 text-xs mt-0.5 line-clamp-1 cursor-pointer" onClick={() => setSelectedProduct(prod)}>{prod.title}</h4>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-slate-800 font-bold text-xs">₩{prod.price.toLocaleString()}</span>
                      <button
                        type="button"
                        onClick={() => addToCart(prod)}
                        className={`${activeTheme.bg} ${activeTheme.hover} text-white text-[10px] px-2.5 py-1 rounded-lg font-bold cursor-pointer`}
                      >
                        담기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : themeConfig.layoutStyle === 'minimal' ? (
          /* Minimal Layout - text lists & pure whites */
          <div className="space-y-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between hover:border-slate-300 transition-all"
                id={`product-card-${prod.id}`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    referrerPolicy="no-referrer"
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-16 h-16 object-cover rounded-lg bg-slate-100 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-400 font-mono tracking-wider uppercase">{prod.category}</span>
                    <h3 className="font-bold text-slate-800 text-xs md:text-sm truncate hover:underline cursor-pointer" onClick={() => setSelectedProduct(prod)}>
                      {prod.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate hidden md:block max-w-lg">{prod.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0">
                  <span className="text-slate-900 font-bold text-xs md:text-sm">₩{prod.price.toLocaleString()}</span>
                  <button
                    type="button"
                    onClick={() => addToCart(prod)}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors"
                  >
                    장바구니 담기
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Regular Grid Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-md"
                id={`product-card-${prod.id}`}
              >
                <div className="relative h-48 overflow-hidden bg-slate-50">
                  <img
                    referrerPolicy="no-referrer"
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => toggleFavorite(prod.id, prod.title)}
                    className="absolute top-3 right-3 p-2 bg-white/95 rounded-full text-slate-600 hover:text-rose-500 shadow-sm transition-colors cursor-pointer"
                  >
                    <Heart size={14} className={favorites.includes(prod.id) ? "fill-rose-500 text-rose-500" : ""} />
                  </button>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{prod.category}</span>
                    <h3 className="font-bold text-slate-800 text-sm mt-0.5 line-clamp-1 cursor-pointer hover:text-indigo-600" onClick={() => setSelectedProduct(prod)}>{prod.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{prod.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-slate-800 font-black text-sm">₩{prod.price.toLocaleString()}</span>
                    <button
                      type="button"
                      onClick={() => addToCart(prod)}
                      className={`${activeTheme.bg} ${activeTheme.hover} text-white text-[10px] px-3.5 py-1.5 rounded-xl font-bold cursor-pointer`}
                    >
                      장바구니 담기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cart Drawer / Overlay */}
      {isCartOpen && (
        <div className="absolute inset-y-0 right-0 w-80 bg-white shadow-2xl z-20 flex flex-col border-l border-slate-100 transition-all duration-300" id="storefront-cart-drawer">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <ShoppingCart size={16} /> 쇼핑백 ({totalCartCount})
            </h3>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 hover:bg-slate-50 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
              id="close-cart-btn"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <ShoppingCart size={32} className="mx-auto text-slate-300" />
                <p className="text-xs">쇼핑백이 비어있습니다.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <img
                    referrerPolicy="no-referrer"
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="w-12 h-12 object-cover rounded bg-white flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{item.product.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">수량: {item.quantity}개</p>
                    <p className="text-xs font-semibold text-slate-800 mt-1">
                      ₩{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCart(prev => prev.filter(c => c.product.id !== item.product.id));
                      addLog(`[Shopify Cart] "${item.product.title}" 삭제 완료.`, 'info');
                    }}
                    className="text-[10px] text-slate-400 hover:text-slate-600 self-start p-1 cursor-pointer"
                    id={`remove-cart-${item.product.id}`}
                  >
                    삭제
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>합계 금액:</span>
                <span>₩{totalCartPrice.toLocaleString()}</span>
              </div>
              <button
                onClick={handleCheckout}
                className={`w-full ${activeTheme.bg} ${activeTheme.hover} text-white font-bold py-2.5 rounded-xl text-xs shadow transition-all cursor-pointer`}
                id="checkout-trigger-btn"
              >
                결제창으로 이동하기 (Shopify SDK)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 flex items-center justify-center p-4" id="storefront-product-modal">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-lg w-full overflow-hidden">
            <div className="relative h-64 bg-slate-50">
              <img
                referrerPolicy="no-referrer"
                src={selectedProduct.imageUrl}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full text-slate-500 hover:text-slate-800 shadow-sm cursor-pointer"
                id="close-prod-modal"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full">
                {selectedProduct.category}
              </span>
              <h3 className="font-extrabold text-slate-800 text-lg mt-2">{selectedProduct.title}</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{selectedProduct.description}</p>
              
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">판매가</span>
                  <span className="text-slate-900 font-black text-lg">₩{selectedProduct.price.toLocaleString()}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white ${activeTheme.bg} ${activeTheme.hover} cursor-pointer`}
                >
                  장바구니 담기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
