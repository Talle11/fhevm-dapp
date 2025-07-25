# FHEVM 保密投票系统

一个基于 FHEVM（全同态加密虚拟机）的去中心化保密投票应用，展示了如何使用全同态加密技术在区块链上实现完全隐私保护的投票系统。

## 🌟 特性

- **完全隐私保护**: 使用全同态加密（FHE）技术，投票内容在整个过程中保持加密状态
- **去中心化**: 基于区块链技术，无需中心化服务器
- **透明可验证**: 智能合约代码公开，投票过程透明可审计
- **用户友好**: 现代化的 Web 界面，支持 MetaMask 钱包连接
- **实时状态**: 实时显示投票状态、提案信息和用户状态

## 🏗️ 技术架构

### 后端（智能合约）
- **FHEVM**: Zama 的全同态加密虚拟机
- **Solidity**: 智能合约开发语言
- **Hardhat**: 开发框架和测试环境

### 前端
- **Next.js**: React 框架
- **Material-UI**: UI 组件库
- **ethers.js**: 以太坊交互库
- **fhevmjs**: FHEVM 客户端库

## 📋 系统要求

- Node.js 18+ 
- npm 或 yarn
- MetaMask 浏览器扩展
- Git

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd fhevm-voting-dapp
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动 FHEVM 本地节点

使用 Docker 启动 FHEVM 开发节点：

```bash
docker run -i -p 8545:8545 -p 8546:8546 --rm --name fhevm ghcr.io/zama-ai/ethermint-dev-node:v0.2.4
```

### 4. 编译智能合约

```bash
npm run compile
```

### 5. 部署智能合约

```bash
npm run deploy
```

### 6. 启动前端应用

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

## 📖 使用指南

### 管理员操作

1. **连接钱包**: 使用 MetaMask 连接到 FHEVM 网络
2. **创建提案**: 在管理员面板中创建投票提案
3. **注册投票者**: 添加有权投票的用户地址
4. **开始投票**: 设置投票持续时间并开始投票
5. **结束投票**: 在投票期结束后手动结束投票

### 投票者操作

1. **连接钱包**: 确保使用已注册的地址连接钱包
2. **查看提案**: 浏览所有可用的投票提案
3. **投票**: 选择提案并进行加密投票
4. **查看状态**: 实时查看投票状态和个人投票记录

## 🔒 隐私保护机制

### 全同态加密（FHE）

本系统使用 Zama 的 FHEVM 技术实现以下隐私保护：

- **投票内容加密**: 用户的投票选择在客户端加密，在区块链上始终保持加密状态
- **计算保密性**: 智能合约可以在不解密的情况下对加密数据进行计算
- **结果准确性**: 即使数据加密，投票统计结果仍然准确
- **防止操纵**: 任何人都无法在投票过程中看到中间结果

### 安全特性

- **量子抗性**: 底层 FHE 密码学方案具有量子抗性
- **多方计算**: 密钥管理使用多方计算（MPC）确保安全
- **访问控制**: 智能合约内置访问控制逻辑

## 📁 项目结构

```
fhevm-voting-dapp/
├── contracts/                 # 智能合约
│   └── ConfidentialVoting.sol # 主投票合约
├── scripts/                   # 部署脚本
│   └── deploy.js             # 合约部署脚本
├── pages/                     # Next.js 页面
│   ├── _app.js               # 应用配置
│   ├── _document.js          # 文档配置
│   └── index.js              # 主页面
├── src/                       # 源代码
│   └── createEmotionCache.js # 样式缓存
├── hardhat.config.js         # Hardhat 配置
├── next.config.js            # Next.js 配置
└── package.json              # 项目依赖
```

## 🔧 配置说明

### 网络配置

在 `hardhat.config.js` 中配置了以下网络：

- **fhevm**: 本地 FHEVM 开发网络（端口 8545）
- **zamaTestnet**: Zama 官方测试网

### 环境变量

创建 `.env.local` 文件配置环境变量：

```env
PRIVATE_KEY=your_private_key_here
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
```

## 🧪 测试

运行智能合约测试：

```bash
npm run test
```

## 📚 核心概念

### FHEVM 工作原理

1. **客户端加密**: 用户在前端使用 fhevmjs 加密投票数据
2. **链上计算**: 智能合约在加密数据上直接进行计算
3. **结果解密**: 只有在投票结束后，管理员才能请求解密最终结果

### 智能合约功能

- `createProposal()`: 创建新的投票提案
- `registerVoter()`: 注册投票者
- `vote()`: 进行加密投票
- `startVoting()` / `endVoting()`: 控制投票流程
- `requestDecryptResult()`: 请求解密投票结果

## 🌐 部署到测试网

### 连接 Zama 测试网

1. 在 MetaMask 中添加 Zama 测试网络：
   - 网络名称: Zama Testnet
   - RPC URL: https://devnet.zama.ai
   - 链 ID: 8009
   - 货币符号: ZAMA

2. 获取测试代币（如果需要）

3. 部署到测试网：

```bash
npm run deploy -- --network zamaTestnet
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [FHEVM 官方文档](https://docs.zama.ai/fhevm)
- [Zama 官网](https://www.zama.ai/)
- [FHEVM GitHub](https://github.com/zama-ai/fhevm)
- [全同态加密介绍](https://www.zama.ai/post/private-smart-contracts-using-homomorphic-encryption)

## ❓ 常见问题

### Q: 为什么需要 FHEVM？
A: 传统区块链上的数据是公开的，FHEVM 允许在保持数据加密的同时进行计算，实现真正的隐私保护。

### Q: 投票结果如何验证？
A: 虽然投票过程是私密的，但智能合约逻辑是公开的，任何人都可以验证计算过程的正确性。

### Q: 性能如何？
A: FHE 计算比普通计算慢，但 FHEVM 使用符号执行优化，将实际计算异步处理，提高了性能。

### Q: 是否支持移动端？
A: 前端使用响应式设计，支持移动端浏览器，但需要支持 Web3 的浏览器或钱包应用。

## 🆘 支持

如果您遇到问题或有疑问，请：

1. 查看 [Issues](../../issues) 页面
2. 创建新的 Issue
3. 联系项目维护者

---

**注意**: 这是一个演示项目，用于展示 FHEVM 技术。在生产环境中使用前，请进行充分的安全审计和测试。