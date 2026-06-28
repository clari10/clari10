import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables.");
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI client:", error);
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!ai });
});

app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history, context } = req.body;

    if (!ai) {
      return res.status(500).json({
        error: "Gemini API client is not initialized. Please verify GEMINI_API_KEY in Settings > Secrets."
      });
    }

    // Set up a strong, contextual system instruction for Shopify + GitHub headless web design in Korean
    const systemInstruction = `
당신은 쇼피파이(Shopify)와 깃허브(GitHub) 헤드리스 프론트엔드 개발 전문 AI 코치입니다.
사용자가 자신만의 쇼핑몰 홈페이지를 제작하고, 쇼피파이 Storefront API 연동 및 깃허브 액션(CI/CD)을 통한 자동 배포를 학습하고 완료할 수 있도록 친절하고 전문적인 가이드를 한글로 제공합니다.

현재 사용자의 프로젝트 설정 상태:
- 쇼피파이 주소: ${context?.shopDomain || '설정 필요'}
- 쇼피파이 API 토큰: ${context?.storefrontToken ? '입력됨' : '설정 필요'}
- 쇼핑몰 이름: ${context?.shopName || '설정 필요'}
- 깃허브 사용자명: ${context?.githubUser || '설정 필요'}
- 깃허브 저장소명: ${context?.githubRepo || '설정 필요'}
- 배포 타겟: ${context?.deployTarget || 'GitHub Pages'}
- 비주얼 테마 스타일: ${context?.themeStyle || 'Minimal Slate'}
- 기본 테마 색상: ${context?.primaryColor || 'Blue'}

역할 및 스타일 지침:
1. 답변은 반드시 한국어로 작성하며 친절하고 명확하게 답변합니다.
2. 실질적인 쇼피파이 Storefront API 호출용 코드(React/TypeScript/HTML 등), 깃허브 액션 YAML, Tailwind CSS 스타일링 코드 예제를 즉각적이고 정확하게 생성해 줍니다.
3. 쇼피파이 관리자 콘솔에서 Storefront API 액세스 토큰을 얻는 방법이나 깃허브 시크릿(Secrets) 등록 절차 등도 알기 쉽게 설명해 줍니다.
4. 사용자가 요청한 테마 스타일과 브랜드 컬러에 걸맞은 UI 아이디어와 리액트 컴포넌트 마크업 코드를 Tailwind로 제공하세요.
5. 너무 긴 서론은 삼가고 바로 실무 코드를 위주로 보여줍니다.
`;

    // Map history elements into format expected by generateContent contents parameter
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "AI 엔진에서 오류가 발생했습니다." });
  }
});

// Start the server with Vite support
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
