
# SM4 算法可视化工具

这是一个基于 React 的 SM4 对称加密算法可视化演示工具，支持完整的加密和解密过程，并提供详细的算法步骤可视化。

## 功能特性

- 🔐 **完整的SM4算法实现** - 支持ECB和CBC模式
- 🔄 **加密和解密功能** - 可视化完整的双向过程
- 📊 **详细的算法可视化** - 轮函数、S盒变换、线性变换等
- 🛠️ **多种配置选项** - PKCS7/无填充、UTF8/ASCII编码、十六进制/Base64输出
- 🎯 **实时性能分析** - 执行时间、吞吐量等指标
- 📚 **内置教程系统** - 详细的算法原理说明
- 🎨 **现代化UI界面** - 基于Tailwind CSS和shadcn/ui

## 本地部署指南

### 环境要求

- Node.js 18.0+ 和 npm
- 或者使用 [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) 安装

### 快速开始

1. **克隆项目**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
打开浏览器访问 `http://localhost:5173`

### 生产部署

1. **构建项目**
```bash
npm run build
```

2. **预览构建结果**
```bash
npm run preview
```

构建后的文件将位于 `dist/` 目录中，可以部署到任何静态文件服务器。

## 本地部署时可删除的文件

为了减少项目大小和复杂度，在本地部署时可以安全删除以下文件和目录：

### 开发配置文件
```
eslint.config.js          # ESLint配置（如果不需要代码检查）
.gitignore                # Git忽略文件（如果不使用Git）
```

### 文档和元数据
```
README.md                 # 项目说明文档
components.json           # shadcn/ui组件配置
```

### 构建工具配置（谨慎删除）
```
vite.config.ts           # Vite构建配置
tailwind.config.ts       # Tailwind CSS配置
postcss.config.js        # PostCSS配置
tsconfig.*.json          # TypeScript配置
```

### 锁定文件（根据包管理器选择保留一个）
```
package-lock.json        # npm锁定文件
bun.lockb               # bun锁定文件
```

### 不建议删除的核心文件
- `package.json` - 项目依赖和脚本配置
- `index.html` - 应用入口HTML
- `src/` 目录 - 所有源代码
- `public/` 目录 - 静态资源文件

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI框架**: Tailwind CSS + shadcn/ui
- **状态管理**: React Hooks
- **路由**: React Router DOM
- **数据获取**: TanStack Query
- **图标**: Lucide React

## 项目结构

```
src/
├── components/          # React组件
│   ├── sm4/            # SM4相关组件
│   └── ui/             # UI基础组件
├── utils/              # 工具函数
│   ├── sm4/           # SM4算法实现
│   └── ...            # 其他工具
├── types/              # TypeScript类型定义
├── hooks/              # 自定义React Hooks
└── pages/              # 页面组件
```

## SM4算法实现

本项目完整实现了SM4国密算法标准，包括：

- **密钥扩展算法** - 从128位主密钥生成32个轮密钥
- **轮函数实现** - T变换（非线性变换 + 线性变换）
- **分组模式** - ECB（电子密码本）和CBC（密码分组链接）
- **填充方案** - PKCS7填充和无填充
- **可视化展示** - 每轮运算的详细过程

## 使用说明

1. **选择操作模式** - 加密或解密
2. **配置算法参数** - 选择分组模式、填充方案、输出格式等
3. **输入数据** - 明文/密文、密钥、初始向量（CBC模式）
4. **执行运算** - 点击加密/解密按钮
5. **查看结果** - 在可视化面板观看详细过程，在输出面板查看结果

## 安全说明

- 本工具仅用于学习和演示目的
- 请勿在生产环境中使用默认密钥
- 建议使用安全的随机数生成器生成密钥
- SM4算法已通过国家密码管理局认证

## 贡献指南

欢迎提交问题报告和功能请求！如需贡献代码，请：

1. Fork 本项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 许可证

本项目采用 MIT 许可证。详见 LICENSE 文件。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 项目地址: https://lovable.dev/projects/384715cb-101e-42b6-854b-0fe0d98e4fd7
- 在线体验: 访问部署的应用链接

---

*本项目基于 Lovable 平台开发，感谢提供的优秀开发环境。*
