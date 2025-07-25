require("@nomicfoundation/hardhat-toolbox");
require("fhevm/tasks");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // FHEVM 本地开发网络
    fhevm: {
      url: "http://localhost:8545",
      accounts: [
        // 这里应该使用环境变量，但为了演示目的使用默认私钥
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
      ],
      chainId: 9000,
    },
    // Zama 测试网
    zamaTestnet: {
      url: "https://devnet.zama.ai",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 8009,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};