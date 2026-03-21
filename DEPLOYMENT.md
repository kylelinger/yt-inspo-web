# Deployment Guide

## 环境概览

| 环境 | 域名 | 分支 | 本地目录 | Vercel 项目 |
|---|---|---|---|---|
| **Prod** | clawpips.vercel.app | `main` | `yt_inspo_web_repo/` | yt_inspo_web_repo |
| **Dev** | ytinspowebdev.vercel.app | `dev` | `yt_inspo_web_dev/` (worktree) | yt_inspo_web_dev |

> `admin` 分支已归档为 `archive/admin`，不再使用。

---

## 数据流（Pipeline → Prod）

Pipeline 日常采集完成后，数据直接写入 prod：

```
Pipeline 跑完
  → 写入 yt_inspo_web_repo/public/data/videos.json
  → cd yt_inspo_web_repo
  → git add public/data/videos.json
  → git commit -m "data: add N videos (YYYY-MM-DD)"
  → git push origin main
  → npx vercel --prod          # 部署到 clawpips.vercel.app
```

数据不经过 dev 分支，直接进 prod。

---

## UI 开发流（Dev → Prod）

### 1. 在 dev 分支开发

```bash
cd yt_inspo_web_dev/           # dev worktree
# 修改 UI 代码...
git add -A
git commit -m "feat: description"
git push origin dev
npx vercel --prod              # 部署到 ytinspowebdev.vercel.app 预览
```

### 2. dev 同步最新数据（可选）

如果需要用最新数据预览 UI：

```bash
cd yt_inspo_web_dev/
git merge main                 # 从 prod 同步数据
```

### 3. 合并到 prod

确认 dev 预览 OK 后：

```bash
cd yt_inspo_web_repo/          # main worktree
git merge dev                  # 合并 UI 改动
git push origin main
npx vercel --prod              # 部署到 clawpips.vercel.app
```

如果只想选择性合并部分文件：

```bash
cd yt_inspo_web_repo/
git checkout dev -- src/components/SomeComponent.tsx
git commit -m "feat: cherry-pick component from dev"
git push origin main
npx vercel --prod
```

---

## Vercel 域名别名

dev 环境使用 Vercel 自动分配的域名 `ytinspowebdev.vercel.app`，每次 `vercel --prod` 后自动生效，无需额外配置。

---

## 分支管理

```
main          ← 生产分支（UI + 数据）
dev           ← 开发分支（UI 开发预览）
archive/admin ← 已归档，不使用
```

### 注意事项

- **不要直接在 main 上改 UI**，UI 改动走 dev → merge 流程
- **数据（videos.json）直接写 main**，不走 dev
- 两个 worktree 目录物理独立，互不影响
- `git worktree list` 可查看所有 worktree 状态
