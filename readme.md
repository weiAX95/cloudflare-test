# Cloudflare Worker API Demo

一个基于 Cloudflare Workers 构建的简单 API 服务，演示了 KV 存储、数据管理和基本的 CRUD 操作。

## 功能特性

- ✨ 基于 Cloudflare Workers 的无服务器架构
- 📦 使用 Cloudflare KV 进行数据存储
- 🔒 内置 CORS 支持和错误处理
- 🚀 支持用户和产品数据管理
- 📝 完整的 API 文档和示例

## API 端点

### 测试端点

- `GET /api/test-kv` - 测试 KV 存储连接
- `GET /api/status` - 检查服务状态

### 数据管理

- `POST /api/init-demo-data` - 初始化示例数据
- `GET /api/data` - 获取所有数据
- `POST /api/clear-data` - 清除所有数据
- `GET /api/list-keys` - 列出所有 KV 键

## 快速开始

### 前置要求

- Node.js 16+
- Wrangler CLI
- Cloudflare 账号

### 安装

```bash
# 克隆仓库
git clone [repository-url]
cd [repository-name]

# 安装依赖
npm install

# 登录到 Cloudflare
wrangler login
```

### 配置

1. 创建 KV 命名空间：

```bash
wrangler kv:namespace create "MY_KV"
```

2. 更新 `wrangler.toml`：

```toml
name = "my-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[[kv_namespaces]]
binding = "MY_KV"
id = "your-kv-namespace-id"
```

### 本地开发

```bash
# 启动开发服务器
npm run dev

# 或使用 wrangler
wrangler dev
```

### 部署

```bash
# 部署到 Cloudflare
npm run deploy

# 或使用 wrangler
wrangler deploy
```

## API 使用示例

### 测试 KV 连接

```bash
curl https://your-worker.workers.dev/api/test-kv
```

### 初始化示例数据

```bash
curl -X POST https://your-worker.workers.dev/api/init-demo-data
```

### 获取所有数据

```bash
curl https://your-worker.workers.dev/api/data
```

### 清除数据

```bash
curl -X POST https://your-worker.workers.dev/api/clear-data
```

## 项目结构

```
.
├── src/
│   └── index.ts        # 主要应用代码
├── wrangler.toml       # Wrangler 配置文件
├── package.json
├── tsconfig.json
└── README.md
```

## 环境变量

项目使用以下环境变量：

- `API_KEY` - API 密钥 (可选)
- `ENVIRONMENT` - 环境标识 (development/production)

## 本地开发

1. 创建 `.dev.vars` 文件：

```
API_KEY=your_api_key_here
ENVIRONMENT=development
```

2. 启动开发服务器：

```bash
npm run dev
```

## 部署说明

1. 确保已经设置了正确的 KV 命名空间
2. 更新 `wrangler.toml` 配置
3. 运行部署命令：

```bash
npm run deploy
```

## 安全注意事项

- 不要在代码中硬编码敏感信息
- 使用环境变量和 Cloudflare Secrets 管理敏感数据
- 定期更新依赖包
- 实现适当的访问控制和速率限制

## 监控和日志

查看 Worker 日志：

```bash
wrangler tail
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

[MIT License](LICENSE)

## 支持

如果你有任何问题或建议，请创建一个 issue。

## 致谢

- Cloudflare Workers 平台
- Cloudflare KV 存储服务
- Wrangler CLI 工具
