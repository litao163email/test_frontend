# 接口自动化测试平台 - 前端

基于 Vue 3 + Element Plus 开发的接口自动化测试平台前端应用。
<img width="1991" height="1077" alt="image" src="https://github.com/user-attachments/assets/abb15fa0-7864-41d7-8ced-cce13f01a287" />


## 技术栈

- Vue 3.2.13
- Vue Router 4.0.3
- Vuex 4.0.0
- Element Plus 1.0.2-beta.28
- Axios 0.27.2
- ECharts 5.3.2
- CodeMirror（代码编辑器）

## 快速开始

### 环境要求

- Node.js 14.0 或更高版本
- npm 6.0 或更高版本

### 安装依赖

```bash
cd test_frontend
npm install --legacy-peer-deps
```

**注意**：使用 `--legacy-peer-deps` 参数以解决依赖版本冲突问题。

### 启动开发服务器

#### 方式一：使用启动脚本（推荐）

```bash
cd test_frontend
./start.sh
```

启动脚本会自动：
- 检查 Node.js 环境
- 检查并安装依赖
- 启动开发服务器

#### 方式二：手动启动

```bash
cd test_frontend
npm run serve
```

### 访问地址

启动成功后，可通过以下地址访问：

- **前端应用**: http://localhost:8080
- **登录页面**: http://localhost:8080/#/login

**默认端口**: 8080（如果被占用，会自动使用其他端口）

### 构建生产版本

```bash
npm run build
```

构建后的文件将输出到 `dist/` 目录。

## 项目结构

```
test_frontend/
├── public/              # 静态资源
├── src/
│   ├── api/            # API 接口定义
│   ├── assets/         # 资源文件（CSS、图片、JS）
│   ├── chart/          # 图表配置
│   ├── components/     # 公共组件
│   │   └── common/     # 通用组件
│   ├── plugins/        # 插件配置
│   ├── router/         # 路由配置
│   ├── store/          # Vuex 状态管理
│   ├── views/          # 页面组件
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── package.json        # 项目配置
├── vue.config.js       # Vue CLI 配置
└── start.sh            # 启动脚本
```

## 常用命令

```bash
# 安装依赖
npm install --legacy-peer-deps

# 启动开发服务器
npm run serve

# 构建生产版本
npm run build

# 检查代码规范（如果有配置）
npm run lint
```

## 开发说明

### API 配置

API 基础地址配置在 `src/api/index.js` 中，可以根据实际情况修改：

```javascript
const service = axios.create({
  baseURL: 'http://localhost:8000',  // 后端 API 地址
  timeout: 5000
});
```

### 路由配置

路由配置在 `src/router/index.js` 中，包含以下主要页面：

- `/login` - 登录页
- `/allProject` - 所有项目
- `/project` - 项目管理
- `/interface` - 接口管理
- `/testPlan` - 测试计划
- `/testStep` - 测试步骤
- `/report` - 测试报告
- `/bug` - Bug 管理

### 状态管理

使用 Vuex 进行全局状态管理，主要存储：
- 用户登录信息
- 项目数据
- 测试数据

## Stagewise 开发工具集成

本项目已集成 Stagewise 开发工具，用于提升前端开发效率。

### 功能说明

- **自动加载**：Stagewise 工具栏会在开发环境（`npm run serve`）下自动加载
- **AI 辅助开发**：点击页面上的 UI 元素，通过自然语言提示与 AI 编码代理交互
- **精准上下文**：自动捕获 DOM 元素的屏幕截图和元数据，生成精准的上下文信息

### 使用方式

1. 启动开发服务器：
   ```bash
   npm run serve
   ```

2. 在浏览器中打开应用，页面右下角会显示 Stagewise 工具栏

3. 点击页面上的 UI 元素，输入自然语言提示（如："将此按钮改为红色"）

4. Stagewise 会将选中元素的上下文信息传递给 AI 代理（如 Cursor），生成相应的代码修改

### 注意事项

- Stagewise 仅在开发环境中启用，不会影响生产构建
- 如果工具栏未显示，请检查浏览器控制台是否有错误信息
- 更多信息请访问 [Stagewise 官方文档](https://stagewise.io/docs)

## 故障排除

### 1. 依赖安装失败

如果遇到依赖版本冲突，使用：

```bash
npm install --legacy-peer-deps
```

### 2. 端口被占用

如果 8080 端口被占用，Vue CLI 会自动使用其他端口，查看终端输出即可。

### 3. 后端 API 连接失败

- 检查后端服务是否启动（http://localhost:8000）
- 检查 `src/api/index.js` 中的 `baseURL` 配置
- 检查浏览器控制台的错误信息

### 4. 页面空白

- 检查浏览器控制台是否有 JavaScript 错误
- 确认所有依赖已正确安装
- 尝试清除浏览器缓存

## 开发建议

1. **代码规范**：遵循 Vue 3 官方代码风格指南
2. **组件复用**：将可复用的组件放在 `components/common/` 目录
3. **API 统一管理**：所有 API 请求统一在 `src/api/` 目录管理
4. **响应式设计**：确保页面在不同设备上正常显示

## 统一启动脚本

项目根目录提供了统一启动脚本 `start_all.sh`，可以同时启动前端和后端：

```bash
# 在项目根目录执行
./start_all.sh
```

这将同时启动：
- 后端服务：http://localhost:8000
- 前端服务：http://localhost:8080

按 `Ctrl+C` 可以同时停止所有服务。
