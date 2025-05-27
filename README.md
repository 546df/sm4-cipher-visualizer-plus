
# SM4 密码算法可视化工具

一个完整的SM4（国密算法）可视化工具，采用纯HTML、CSS和JavaScript构建，支持ECB和CBC加密模式，包含完整的算法步骤可视化功能。

## 项目框架

本项目采用**纯前端技术栈**构建：

- **HTML5**: 页面结构和语义化标记
- **CSS3**: 现代化响应式样式设计，包含动画和可视化效果
- **Vanilla JavaScript (ES6+)**: 核心算法实现和交互逻辑
- **无框架依赖**: 纯原生Web技术，无需Node.js或构建工具

## 功能特性

### 🔐 完整的SM4算法实现
- ✅ 标准SM4加密/解密算法
- ✅ ECB和CBC工作模式
- ✅ PKCS7和无填充模式
- ✅ 支持十六进制和Base64输出格式

### 🎯 可视化功能
- ✅ **32轮加密过程动态展示**
- ✅ 轮密钥生成可视化
- ✅ S盒变换过程展示
- ✅ 线性变换步骤可视化
- ✅ 分步播放控制（上一步/下一步/自动播放）
- ✅ 可调节播放速度
- ✅ 实时状态数据展示

### 📱 用户体验
- ✅ 响应式设计，支持移动端
- ✅ 现代化UI界面
- ✅ 实时输入验证
- ✅ 错误提示和成功反馈
- ✅ 一键复制结果
- ✅ 随机密钥生成

## 本地部署指南

### 方式一：直接打开（推荐）

1. **下载项目文件**
   ```bash
   # 如果有git
   git clone [项目地址]
   
   # 或直接下载ZIP文件并解压
   ```

2. **打开主页面**
   - 直接双击 `index.html` 文件
   - 或在浏览器中打开 `file:///path/to/project/index.html`

### 方式二：本地服务器

如果需要更好的开发体验，可以启动本地服务器：

```bash
# 使用Python（推荐）
python -m http.server 8000
# 或
python3 -m http.server 8000

# 使用Node.js
npx serve .

# 使用PHP
php -S localhost:8000
```

然后访问 `http://localhost:8000`

## 文件管理指南

### 📁 核心文件（必须保留）

以下文件是项目运行必需的，**不能删除**：

```
项目根目录/
├── index.html                 # 主页面
├── styles/
│   ├── main.css              # 主样式文件
│   └── components.css        # 组件样式
├── js/
│   ├── main.js               # 主应用逻辑
│   ├── utils/
│   │   ├── formatConverter.js # 格式转换工具
│   │   └── paddingUtils.js   # 填充工具
│   └── sm4/
│       ├── sm4Constants.js   # SM4算法常量
│       └── sm4Core.js        # SM4核心算法
└── README.md                 # 项目说明（可选）
```

### 🗑️ 可删除文件

以下文件/文件夹是React版本的残留，可以安全删除：

```bash
# Node.js相关文件
package.json
package-lock.json
bun.lockb
node_modules/

# TypeScript配置
tsconfig.json
tsconfig.app.json
tsconfig.node.json

# Vite构建工具
vite.config.ts
postcss.config.js

# React相关
src/
components.json

# 其他配置文件
eslint.config.js
tailwind.config.ts
.gitignore
```

### 删除命令示例

```bash
# 在项目根目录执行
rm -rf node_modules/
rm -rf src/
rm package.json package-lock.json bun.lockb
rm tsconfig*.json vite.config.ts postcss.config.js
rm eslint.config.js tailwind.config.ts components.json
rm .gitignore
```

## 项目结构说明

```
SM4-Visualizer/
├── index.html              # 主页面，包含完整的HTML结构
├── styles/                 # 样式文件目录
│   ├── main.css           # 主样式：布局、组件、响应式设计
│   └── components.css     # 组件专用样式：卡片、按钮、表单等
├── js/                    # JavaScript文件目录
│   ├── main.js           # 主应用逻辑：UI交互、事件处理、可视化控制
│   ├── utils/            # 工具函数目录
│   │   ├── formatConverter.js # 格式转换：hex↔bytes、base64等
│   │   └── paddingUtils.js    # 填充算法：PKCS7、无填充
│   └── sm4/              # SM4算法核心
│       ├── sm4Constants.js    # 算法常量：S盒、FK、CK参数
│       └── sm4Core.js         # 核心算法：加密、解密、密钥扩展
└── README.md             # 项目文档
```

## 使用说明

1. **配置设置**：选择加密/解密模式、工作模式（ECB/CBC）、填充方式等
2. **输入数据**：输入明文/密文和128位密钥（32个十六进制字符）
3. **执行算法**：点击"开始加密"或"开始解密"按钮
4. **查看结果**：在输出面板查看结果，在可视化面板观看算法执行过程
5. **步骤控制**：使用可视化控制面板逐步查看或自动播放32轮加密过程

## 技术特点

- **零依赖**：无需安装任何依赖包或构建工具
- **标准实现**：严格按照SM4国密标准实现
- **教育导向**：详细的算法步骤可视化，适合学习和教学
- **跨平台**：支持所有现代浏览器，兼容移动设备
- **高性能**：纯JavaScript实现，执行效率高

## 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ 移动端浏览器

## 开发说明

本项目采用模块化设计，易于扩展和维护：

- `main.js`：负责UI交互和应用状态管理
- `sm4Core.js`：实现SM4算法核心逻辑
- `formatConverter.js`：处理各种数据格式转换
- `paddingUtils.js`：实现填充算法
- `main.css`：提供完整的UI样式和动画效果

如需修改或扩展功能，只需编辑对应的JavaScript文件即可。

## 许可证

本项目仅供学习和研究使用。

---

**注意**：本工具仅用于教育和学习目的，请勿用于生产环境的加密需求。实际应用中应使用经过安全认证的密码库。
