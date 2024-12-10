# Lumière (流光) - 优雅的图片管理系统

![Next.js](https://img.shields.io/badge/Next.js-13.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)

Lumière (流光) 是一个现代化的图片管理系统，专注于提供优雅的用户体验和强大的图片管理功能。项目名称 "流光" 寓意捕捉光影，珍存时光，完美契合其作为图片管理工具的核心理念。

## ✨ 特性

- 🖼️ 智能相册管理
  - 支持创建和管理多个相册
  - 图片分类和组织
  - 优雅的网格视图布局

- 🔍 强大的图片信息展示
  - EXIF 数据读取和展示
  - 图片详细信息查看
  - 缩略图自动生成

- 🎨 现代化用户界面
  - 响应式设计
  - 深色模式支持
  - 流畅的动画效果

- 🔐 安全的用户认证
  - 基于 NextAuth.js 的认证系统
  - JWT 会话管理
  - 安全的密码加密存储

## 🚀 技术栈

- **前端框架**: Next.js 13 (App Router)
- **样式方案**: Tailwind CSS
- **状态管理**: React Hooks
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: NextAuth.js
- **图片处理**: Sharp
- **开发语言**: TypeScript

## 📦 安装

1. 克隆仓库
```bash
git clone https://github.com/yourusername/lumiere.git
cd lumiere
```

2. 安装依赖
```bash
npm install
```

3. 环境配置
```bash
cp .env.example .env
```
编辑 .env 文件，配置必要的环境变量：
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL

4. 数据库迁移
```bash
npx prisma migrate dev
```

5. 启动开发服务器
```bash
npm run dev
```

## 🌟 使用指南

1. 注册/登录账户
2. 创建相册
3. 上传图片到相册
4. 查看和管理图片
5. 享受流畅的图片管理体验

## 📝 开发计划

- [ ] 多语言支持
- [ ] 高级搜索功能
- [ ] 图片编辑功能
- [ ] 批量操作
- [ ] 分享功能
- [ ] 移动端优化

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](LICENSE)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

## Image Upload System

一个基于 Next.js 13+ 开发的现代化图片上传和管理系统。

## 功能特点

- 🖼️ 图片管理
  - 支持图片上传、预览和删除
  - 自动生成缩略图
  - 提取并显示 EXIF 信息
  - 按日期自动分类存储
  - 支持批量上传

- 📁 相册管理
  - 查看所有相册列表
  - 显示相册封面和图片数量
  - 支持相册删除（保留图片）
  - 按名称搜索相册

- 👥 用户管理
  - 用户注册和登录
  - 基于角色的权限控制
  - 管理员可管理用户
  - 用户个人资料管理

- 🔍 搜索功能
  - 按文件名搜索
  - 按上传时间搜索
  - 按相册搜索
  - 支持分页加载

- 🛡️ 安全特性
  - 用户认证和授权
  - 文件类型验证
  - 文件大小限制
  - 安全的文件存储

## 技术栈

- **前端框架**: Next.js 13+ (App Router)
- **样式**: Tailwind CSS
- **UI 组件**: Headless UI
- **状态管理**: React Hooks
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: NextAuth.js
- **图片处理**: Sharp
- **文件存储**: 本地文件系统

## 目录结构

```
src/
├── app/                    # Next.js 13 App Router
│   ├── (admin)/           # 管理后台相关页面
│   │   └── admin/
│   │       ├── albums/    # 相册管理
│   │       ├── images/    # 图片管理
│   │       └── users/     # 用户管理
│   ├── api/               # API 路由
│   └── auth/              # 认证相关
├── components/            # React 组件
├── lib/                   # 工具库
│   ├── prisma.ts         # Prisma 客户端
│   └── storage.ts        # 存储工具
└── types/                # TypeScript 类型定义
```

## 开发环境设置

1. 克隆仓库：
```bash
git clone <repository-url>
cd image-upload
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量：
```bash
cp .env.example .env
```
编辑 `.env` 文件，填写必要的配置信息。

4. 初始化数据库：
```bash
npx prisma migrate dev
```

5. 启动开发服务器：
```bash
npm run dev
```

## 部署

1. 构建项目：
```bash
npm run build
```

2. 启动生产服务器：
```bash
npm start
```

## 文件存储结构

图片文件按照日期自动分类存储：

```
public/
├── uploads/              # 原始图片
│   ├── 2024/
│   │   ├── 12/
│   │   │   └── 10/      # 按日期分类
│   │   │       └── [timestamp]-[random].[ext]
│   └── ...
└── thumbnails/          # 缩略图
    ├── 2024/
    │   ├── 12/
    │   │   └── 10/
    │   │       └── [timestamp]-[random].[ext]
    └── ...
```

## 环境要求

- Node.js 16+
- PostgreSQL 12+
- 足够的磁盘空间用于存储图片

## 许可证

[MIT License](LICENSE)
