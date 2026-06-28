export interface ShopConfig {
  shopName: string;
  shopDomain: string;
  storefrontToken: string;
  currency: string;
  isConnected: boolean;
}

export interface GitHubConfig {
  username: string;
  repository: string;
  branch: string;
  deployTarget: 'github-pages' | 'vercel' | 'netlify';
  commitMessage: string;
  deployStatus: 'idle' | 'building' | 'deployed' | 'failed';
}

export interface ThemeConfig {
  heroTitle: string;
  heroSubtitle: string;
  layoutStyle: 'grid' | 'bento' | 'minimal';
  primaryColor: string; // Tailwind color name like 'indigo', 'emerald', 'sky', 'rose', 'amber'
  typography: 'sans' | 'display' | 'mono';
  headerBannerText: string;
  showPromo: boolean;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inventoryQuantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface LogLine {
  text: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'cmd';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
