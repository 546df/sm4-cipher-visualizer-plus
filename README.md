
# SM4 算法可视化工具

这是一个基于纯 HTML、CSS 和 JavaScript 构建的 SM4 对称加密算法可视化演示工具，支持完整的加密和解密过程，并提供详细的算法步骤可视化。

## 功能特性

- 🔐 **完整的SM4算法实现** - 支持ECB和CBC模式
- 🔄 **加密和解密功能** - 可视化完整的双向过程
- 📊 **详细的算法可视化** - 轮函数、S盒变换、线性变换等
- 🛠️ **多种配置选项** - PKCS7/无填充、UTF8/ASCII编码、十六进制/Base64输出
- 🎯 **实时性能分析** - 执行时间、吞吐量等指标
- 📚 **内置教程系统** - 详细的算法原理说明
- 🎨 **现代化UI界面** - 响应式设计，支持移动设备

## 项目框架

本项目采用纯前端技术栈构建，无需后端服务器或框架依赖：

### 技术栈
- **HTML5** - 语义化标记和现代Web标准
- **CSS3** - 现代样式特性（Grid、Flexbox、CSS Variables）
- **JavaScript (ES6+)** - 原生JavaScript实现所有功能
- **响应式设计** - 支持桌面端和移动端设备

### 项目结构
```
sm4-cipher-visualizer/
├── index.html              # 主HTML文件
├── styles/                 # 样式文件目录
│   ├── main.css            # 主样式文件
│   └── components.css      # 组件样式文件
├── js/                     # JavaScript文件目录
│   ├── utils/              # 工具函数
│   │   ├── formatConverter.js    # 格式转换工具
│   │   └── paddingUtils.js       # 填充算法工具
│   ├── sm4/                # SM4算法实现
│   │   ├── sm4Constants.js       # SM4常量定义
│   │   ├── sm4Core.js            # SM4核心算法
│   │   ├── sm4Encrypt.js         # SM4加密实现
│   │   └── sm4Decrypt.js         # SM4解密实现
│   └── main.js             # 主应用逻辑
└── README.md               # 项目说明文档
```

## 本地部署指南

### 环境要求

- 现代Web浏览器（Chrome、Firefox、Safari、Edge）
- 本地Web服务器（可选，推荐用于开发）

### 快速开始

#### 方法一：直接打开（最简单）

1. **下载项目文件**
   ```bash
   # 克隆项目（如果使用Git）
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **直接打开**
   - 双击 `index.html` 文件
   - 或右键选择"使用浏览器打开"

#### 方法二：使用本地服务器（推荐）

1. **使用Python内置服务器**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

2. **使用Node.js服务器**
   ```bash
   # 安装全局服务器工具
   npm install -g http-server
   
   # 启动服务器
   http-server -p 8000
   ```

3. **使用Live Server（VS Code扩展）**
   - 安装 Live Server 扩展
   - 右键 `index.html` 选择 "Open with Live Server"

4. **访问应用**
   打开浏览器访问 `http://localhost:8000`

### 生产部署

将整个项目文件夹上传到任何静态文件服务器即可，如：
- Nginx
- Apache
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront

## 本地部署时的文件管理

### 必须保留的核心文件

以下文件是项目运行所必需的，**不能删除**：

```
index.html                  # 主HTML文件，应用入口
styles/main.css            # 主样式文件
styles/components.css       # 组件样式文件
js/utils/formatConverter.js # 格式转换工具
js/utils/paddingUtils.js    # 填充算法工具
js/sm4/sm4Constants.js      # SM4算法常量
js/sm4/sm4Core.js          # SM4核心算法
js/sm4/sm4Encrypt.js       # SM4加密实现
js/sm4/sm4Decrypt.js       # SM4解密实现
js/main.js                 # 主应用逻辑
```

### 可以安全删除的文件

为了减少项目大小，在本地部署时可以安全删除以下文件：

#### 开发配置文件
```
.gitignore                 # Git忽略文件配置
eslint.config.js          # ESLint代码检查配置
```

#### 构建工具配置
```
vite.config.ts            # Vite构建工具配置
tailwind.config.ts        # Tailwind CSS配置
postcss.config.js         # PostCSS配置
tsconfig.*.json           # TypeScript配置文件
```

#### Node.js相关文件
```
package.json              # Node.js项目配置
package-lock.json         # npm依赖锁定文件
bun.lockb                 # Bun包管理器锁定文件
node_modules/             # Node.js依赖目录（如果存在）
```

#### 框架相关文件
```
src/                      # React源代码目录
components.json           # shadcn/ui组件配置
public/                   # React public目录
```

#### 其他开发文件
```
.env*                     # 环境变量文件
*.log                     # 日志文件
.vscode/                  # VS Code配置目录
.idea/                    # IntelliJ IDEA配置目录
```

### 最小化部署版本

如果只需要最基本的功能，最小化部署只需要以下文件：

```
sm4-cipher-visualizer/
├── index.html
├── styles/
│   ├── main.css
│   └── components.css
└── js/
    ├── utils/
    │   ├── formatConverter.js
    │   └── paddingUtils.js
    ├── sm4/
    │   ├── sm4Constants.js
    │   ├── sm4Core.js
    │   ├── sm4Encrypt.js
    │   └── sm4Decrypt.js
    └── main.js
```

总文件大小约：**50-100KB**（未压缩）

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

## 浏览器兼容性

- **Chrome** 60+
- **Firefox** 55+
- **Safari** 12+
- **Edge** 79+
- **移动端浏览器** - iOS Safari 12+, Android Chrome 60+

## 安全说明

- 本工具仅用于学习和演示目的
- 请勿在生产环境中使用默认密钥
- 建议使用安全的随机数生成器生成密钥
- SM4算法已通过国家密码管理局认证

## 性能优化

- 所有计算在客户端执行，无需网络传输
- 使用原生JavaScript，无框架开销
- 响应式设计，适配各种设备
- 可视化数据按需生成，减少内存占用

## 贡献指南

欢迎提交问题报告和功能请求！本项目使用纯前端技术，贡献时请注意：

1. 保持代码的浏览器兼容性
2. 遵循现有的代码风格
3. 添加适当的注释和文档
4. 测试在不同浏览器中的兼容性

## 许可证

本项目采用 MIT 许可证。详见 LICENSE 文件。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 项目地址: https://github.com/your-username/sm4-cipher-visualizer
- 在线体验: 访问部署的应用链接

---

*本项目专注于教育目的，帮助理解SM4密码算法的工作原理。*
