import { Product, ShopConfig, GitHubConfig, ThemeConfig } from "./types";

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod_01",
    title: "Minimalist Mechanical Keyboard",
    handle: "minimal-mechanical-keyboard",
    description: "65% 레이아웃, 저소음 갈축 스위치, 윤활 완료, 알루미늄 하우징으로 미니멀한 데스크테리어를 완성합니다.",
    price: 189000,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600",
    category: "데스크 가제트",
    inventoryQuantity: 12
  },
  {
    id: "prod_02",
    title: "Premium Leather Desk Mat",
    handle: "leather-desk-mat",
    description: "이탈리아 풀그레인 천연 가죽 소재, 방수 코팅 및 미끄럼 방지 처리로 데스크의 품격을 높여줍니다.",
    price: 65000,
    imageUrl: "https://images.unsplash.com/photo-1632292224971-0d45778bd364?auto=format&fit=crop&q=80&w=600",
    category: "사무용품",
    inventoryQuantity: 25
  },
  {
    id: "prod_03",
    title: "Aesthetic Wooden Desk Lamp",
    handle: "wooden-desk-lamp",
    description: "친환경 오크 원목 바디와 패브릭 쉐이드, 3단계 밝기 조절 및 C타입 고속 충전 포트 내장형 스탠드.",
    price: 98000,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600",
    category: "조명",
    inventoryQuantity: 8
  },
  {
    id: "prod_04",
    title: "Active Noise Cancelling Headset",
    handle: "anc-headset",
    description: "하이브리드 액티브 노이즈 캔슬링, 최대 40시간 연속 재생, 초경량 메모리폼 이어컵의 고해상도 무선 헤드폰.",
    price: 329000,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
    category: "음향기기",
    inventoryQuantity: 15
  },
  {
    id: "prod_05",
    title: "Titanium Travel Water Bottle",
    handle: "titanium-bottle",
    description: "의료 등급 무독성 순수 티타늄으로 제작된 초경량 이중 벽 구조 보온 보냉병, 진공 설계.",
    price: 89000,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600",
    category: "라이프스타일",
    inventoryQuantity: 40
  },
  {
    id: "prod_06",
    title: "Ergonomic Memory Foam Cushion",
    handle: "memory-foam-cushion",
    description: "골반 지지형 인체공학적 디자인, 통기성 3D 매시 커버, 고밀도 메모리폼으로 장시간 작업에도 안락함을 제공합니다.",
    price: 49000,
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600",
    category: "사무용품",
    inventoryQuantity: 30
  }
];

export const DEFAULT_SHOP_CONFIG: ShopConfig = {
  shopName: "아틀리에 미니멀",
  shopDomain: "atelier-minimal.myshopify.com",
  storefrontToken: "shpat_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  currency: "KRW",
  isConnected: true
};

export const DEFAULT_GITHUB_CONFIG: GitHubConfig = {
  username: "minimal-dev",
  repository: "shopify-headless-storefront",
  branch: "main",
  deployTarget: "github-pages",
  commitMessage: "feat: 쇼피파이 헤드리스 스토어프론트 초기 빌드 연동 완료",
  deployStatus: "idle"
};

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  heroTitle: "미니멀 가제트 & 사무용품 셀렉트 숍",
  heroSubtitle: "당신의 완벽한 원격 업무 데스크를 디자인하고 품격을 채워줄 라이프스타일 가젯을 만나보세요.",
  layoutStyle: "bento",
  primaryColor: "indigo",
  typography: "sans",
  headerBannerText: "🚚 첫 가입 시 전 제품 무료 배송 혜택 + Shopify API 연동 기념 10% 추가 할인!",
  showPromo: true
};

// Returns a realistic Storefront API query snippet customized to the user's config
export const getShopifyQuerySnippet = (domain: string, token: string) => {
  return `/**
 * Shopify Storefront API Fetch Helper
 * File: src/lib/shopify.js
 */

const SHOPIFY_STORE_DOMAIN = "${domain || 'your-store.myshopify.com'}";
const STOREFRONT_ACCESS_TOKEN = "${token || 'your-access-token'}";

export async function shopifyFetch({ query, variables = {} }) {
  try {
    const response = await fetch(\`https://\${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const result = await response.json();
    if (result.errors) {
      console.error("GraphQL Errors:", result.errors);
      throw new Error("GraphQL Error in Shopify Fetch");
    }

    return result.data;
  } catch (error) {
    console.error("Shopify Connection Error:", error);
    throw error;
  }
}

// 1. 상품 리스트 조회용 GraphQL Query
export const GET_PRODUCTS_QUERY = \`
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
\`;
`;
};

// Returns a realistic GitHub Actions deploy.yml file
export const getGitHubActionSnippet = (user: string, repo: string, target: string) => {
  const secretToken = target === 'github-pages' ? 'GITHUB_TOKEN' : 'VERCEL_TOKEN';
  
  return `# GitHub Actions Workflow - 헤드리스 쇼핑몰 빌드 및 배포 자동화
# File: .github/workflows/deploy.yml

name: Deploy Headless Shopify Storefront

on:
  push:
    branches:
      - main
  # 쇼피파이 웹훅(Webhook) 트리거: 상품 정보/재고 수정 시 배포 재시작 가능
  repository_dispatch:
    types: [shopify_inventory_update]

permissions:
  contents: write
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Static Site
        run: npm run build
        env:
          VITE_SHOPIFY_STORE_DOMAIN: \${{ secrets.VITE_SHOPIFY_STORE_DOMAIN }}
          VITE_SHOPIFY_STOREFRONT_TOKEN: \${{ secrets.VITE_SHOPIFY_STOREFRONT_TOKEN }}

      - name: Upload Build Artifacts
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
        env:
          GITHUB_TOKEN: \${{ secrets.${secretToken} }}
`;
};
