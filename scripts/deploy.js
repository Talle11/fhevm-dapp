const { ethers } = require("hardhat");

async function main() {
  console.log("开始部署 ConfidentialVoting 合约...");

  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  console.log("部署账户:", deployer.address);

  // 获取账户余额
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("账户余额:", ethers.formatEther(balance), "ETH");

  // 部署合约
  const ConfidentialVoting = await ethers.getContractFactory("ConfidentialVoting");
  const voting = await ConfidentialVoting.deploy();
  
  await voting.waitForDeployment();
  const contractAddress = await voting.getAddress();
  
  console.log("ConfidentialVoting 合约已部署到:", contractAddress);

  // 创建一些示例提案
  console.log("\n创建示例提案...");
  
  const proposals = [
    {
      name: "提案A: 增加社区资金",
      description: "提议增加社区发展资金，用于基础设施建设和项目支持。"
    },
    {
      name: "提案B: 技术升级",
      description: "提议进行系统技术升级，提高平台性能和安全性。"
    },
    {
      name: "提案C: 治理改革",
      description: "提议改革现有治理机制，增加社区参与度和透明度。"
    }
  ];

  for (let i = 0; i < proposals.length; i++) {
    const tx = await voting.createProposal(proposals[i].name, proposals[i].description);
    await tx.wait();
    console.log(`✓ 创建提案 ${i}: ${proposals[i].name}`);
  }

  // 注册一些示例投票者（在实际应用中，这些应该是真实的用户地址）
  console.log("\n注册示例投票者...");
  
  // 生成一些示例地址
  const sampleVoters = [
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
  ];

  for (let i = 0; i < sampleVoters.length; i++) {
    try {
      const tx = await voting.registerVoter(sampleVoters[i]);
      await tx.wait();
      console.log(`✓ 注册投票者: ${sampleVoters[i]}`);
    } catch (error) {
      console.log(`⚠ 投票者 ${sampleVoters[i]} 可能已经注册`);
    }
  }

  console.log("\n部署完成!");
  console.log("合约地址:", contractAddress);
  console.log("\n下一步:");
  console.log("1. 启动前端应用: npm run dev");
  console.log("2. 在前端界面中开始投票");
  console.log("3. 使用 FHEVM 进行保密投票");

  // 保存合约地址到文件，供前端使用
  const fs = require('fs');
  const contractInfo = {
    address: contractAddress,
    network: "fhevm",
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(
    './contract-address.json', 
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("\n合约地址已保存到 contract-address.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("部署失败:", error);
    process.exit(1);
  });