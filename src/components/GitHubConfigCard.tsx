import React, { useState } from "react";
import { GitHubConfig } from "../types";
import { GitBranch, Github, Check, AlertTriangle, Play, HelpCircle, ExternalLink } from "lucide-react";

interface GitHubConfigCardProps {
  config: GitHubConfig;
  onChange: (updated: Partial<GitHubConfig>) => void;
  onDeploy: () => void;
  addLog: (text: string, type: 'info' | 'success' | 'warning' | 'error' | 'cmd') => void;
}

export default function GitHubConfigCard({
  config,
  onChange,
  onDeploy,
  addLog,
}: GitHubConfigCardProps) {
  const [loading, setLoading] = useState(false);

  const handleSimulatedDeploy = () => {
    setLoading(true);
    onChange({ deployStatus: 'building' });
    addLog(`[GitHub Actions] Triggered workflow run for commit: "${config.commitMessage}"`, 'cmd');
    addLog(`[GitHub Actions] Environment variables loaded: VITE_SHOPIFY_STORE_DOMAIN, VITE_SHOPIFY_STOREFRONT_TOKEN.`, 'info');
    addLog(`[GitHub Actions] Running build script: "npm run build" with Vite...`, 'info');

    setTimeout(() => {
      addLog(`[GitHub Actions] Static files built successfully inside ./dist/ (size: 1.4 MB).`, 'success');
      addLog(`[GitHub Actions] Deploying to secure GitHub Pages environment...`, 'info');
      
      setTimeout(() => {
        setLoading(false);
        onChange({ deployStatus: 'deployed' });
        addLog(`[GitHub Actions] Site deployed successfully! Live URL: https://${config.username}.github.io/${config.repository}/`, 'success');
        onDeploy();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="github-config-card">
      {/* Card Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
            <Github size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm md:text-base">GitHub 배포 파이프라인 (CI/CD)</h3>
            <p className="text-xs text-slate-400">정적 호스팅 사이트로 자동 빌드 및 배포</p>
          </div>
        </div>
        <div>
          {config.deployStatus === 'deployed' ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
              배포 완료
            </span>
          ) : config.deployStatus === 'building' ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
              빌드 및 배포 중
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              대기 중
            </span>
          )}
        </div>
      </div>

      {/* Content Form */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">GitHub Username / Org</label>
            <input
              type="text"
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              value={config.username}
              onChange={(e) => onChange({ username: e.target.value })}
              placeholder="username"
              id="github-username-input"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Repository Name</label>
            <input
              type="text"
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              value={config.repository}
              onChange={(e) => onChange({ repository: e.target.value })}
              placeholder="shopify-storefront"
              id="github-repo-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">배포 대상 브랜치</label>
            <div className="relative">
              <input
                type="text"
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors pl-8"
                value={config.branch}
                onChange={(e) => onChange({ branch: e.target.value })}
                placeholder="main"
                id="github-branch-input"
              />
              <div className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <GitBranch size={14} />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">배포 타겟 환경</label>
            <select
              className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white transition-colors cursor-pointer"
              value={config.deployTarget}
              onChange={(e) => onChange({ deployTarget: e.target.value as any })}
              id="github-target-select"
            >
              <option value="github-pages">GitHub Pages (추천 - 정적 웹 호스팅)</option>
              <option value="vercel">Vercel (SSR & Serverless)</option>
              <option value="netlify">Netlify (Edge Functions)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">최신 커밋 메시지 (Trigger Commit)</label>
          <input
            type="text"
            className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            value={config.commitMessage}
            onChange={(e) => onChange({ commitMessage: e.target.value })}
            placeholder="feat: updates"
            id="github-commit-input"
          />
        </div>

        {/* Deploy Actions */}
        <div className="pt-2">
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 focus:outline-none disabled:opacity-50 transition-colors cursor-pointer"
            onClick={handleSimulatedDeploy}
            disabled={loading || !config.username || !config.repository}
            id="github-deploy-btn"
          >
            {loading ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                GitHub Actions 빌드 실행 및 배포 중...
              </>
            ) : (
              <>
                <Play size={14} className="fill-current" />
                GitHub Pages 배포 워크플로우 실행
              </>
            )}
          </button>
        </div>

        {/* GitHub Secrets Helper Alert */}
        <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-start gap-2.5 text-xs text-amber-800" id="github-secrets-help">
          <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold block mb-0.5">보안 알림: 깃허브 리포지토리에 토큰을 직시하지 마세요!</span>
            깃허브 저장소의 <strong className="font-medium">Settings &gt; Secrets and variables &gt; Actions</strong> 메뉴에 
            <code className="bg-amber-100/80 px-1 py-0.5 rounded mx-1 font-mono text-[10px]">VITE_SHOPIFY_STORE_DOMAIN</code>과 
            <code className="bg-amber-100/80 px-1 py-0.5 rounded mx-1 font-mono text-[10px]">VITE_SHOPIFY_STOREFRONT_TOKEN</code>을 등록하는 것이 필수적입니다.
          </div>
        </div>
      </div>
    </div>
  );
}
