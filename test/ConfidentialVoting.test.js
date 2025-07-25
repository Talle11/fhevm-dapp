const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ConfidentialVoting", function () {
  let voting;
  let owner;
  let voter1;
  let voter2;
  let voter3;

  beforeEach(async function () {
    // 获取测试账户
    [owner, voter1, voter2, voter3] = await ethers.getSigners();

    // 部署合约
    const ConfidentialVoting = await ethers.getContractFactory("ConfidentialVoting");
    voting = await ConfidentialVoting.deploy();
    await voting.waitForDeployment();
  });

  describe("部署", function () {
    it("应该设置正确的所有者", async function () {
      expect(await voting.owner()).to.equal(owner.address);
    });

    it("应该初始化为非活跃状态", async function () {
      expect(await voting.votingActive()).to.equal(false);
    });

    it("应该初始化提案计数为0", async function () {
      expect(await voting.proposalCount()).to.equal(0);
    });

    it("应该初始化投票者计数为0", async function () {
      expect(await voting.voterCount()).to.equal(0);
    });
  });

  describe("提案管理", function () {
    it("所有者应该能够创建提案", async function () {
      await expect(
        voting.createProposal("测试提案", "这是一个测试提案")
      ).to.emit(voting, "ProposalCreated")
        .withArgs(0, "测试提案", "这是一个测试提案");

      expect(await voting.proposalCount()).to.equal(1);

      const proposal = await voting.getProposal(0);
      expect(proposal[0]).to.equal("测试提案");
      expect(proposal[1]).to.equal("这是一个测试提案");
      expect(proposal[2]).to.equal(true);
    });

    it("非所有者不应该能够创建提案", async function () {
      await expect(
        voting.connect(voter1).createProposal("测试提案", "这是一个测试提案")
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("投票期间不应该能够创建提案", async function () {
      // 先创建提案和注册投票者
      await voting.createProposal("测试提案", "这是一个测试提案");
      await voting.registerVoter(voter1.address);
      
      // 开始投票
      await voting.startVoting(3600);
      
      // 尝试创建新提案应该失败
      await expect(
        voting.createProposal("新提案", "这是一个新提案")
      ).to.be.revertedWith("Cannot create proposals during active voting");
    });

    it("应该能够创建多个提案", async function () {
      await voting.createProposal("提案1", "第一个提案");
      await voting.createProposal("提案2", "第二个提案");
      await voting.createProposal("提案3", "第三个提案");

      expect(await voting.proposalCount()).to.equal(3);

      const proposal1 = await voting.getProposal(0);
      const proposal2 = await voting.getProposal(1);
      const proposal3 = await voting.getProposal(2);

      expect(proposal1[0]).to.equal("提案1");
      expect(proposal2[0]).to.equal("提案2");
      expect(proposal3[0]).to.equal("提案3");
    });
  });

  describe("投票者管理", function () {
    it("所有者应该能够注册投票者", async function () {
      await expect(
        voting.registerVoter(voter1.address)
      ).to.emit(voting, "VoterRegistered")
        .withArgs(voter1.address);

      expect(await voting.voterCount()).to.equal(1);
      expect(await voting.isRegistered(voter1.address)).to.equal(true);
      expect(await voting.hasVoted(voter1.address)).to.equal(false);
    });

    it("非所有者不应该能够注册投票者", async function () {
      await expect(
        voting.connect(voter1).registerVoter(voter2.address)
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("不应该能够重复注册同一投票者", async function () {
      await voting.registerVoter(voter1.address);
      
      await expect(
        voting.registerVoter(voter1.address)
      ).to.be.revertedWith("Voter already registered");
    });

    it("投票期间不应该能够注册投票者", async function () {
      // 先创建提案和注册一个投票者
      await voting.createProposal("测试提案", "这是一个测试提案");
      await voting.registerVoter(voter1.address);
      
      // 开始投票
      await voting.startVoting(3600);
      
      // 尝试注册新投票者应该失败
      await expect(
        voting.registerVoter(voter2.address)
      ).to.be.revertedWith("Cannot register voters during active voting");
    });

    it("应该能够注册多个投票者", async function () {
      await voting.registerVoter(voter1.address);
      await voting.registerVoter(voter2.address);
      await voting.registerVoter(voter3.address);

      expect(await voting.voterCount()).to.equal(3);
      expect(await voting.isRegistered(voter1.address)).to.equal(true);
      expect(await voting.isRegistered(voter2.address)).to.equal(true);
      expect(await voting.isRegistered(voter3.address)).to.equal(true);

      const registeredVoters = await voting.getRegisteredVoters();
      expect(registeredVoters).to.include(voter1.address);
      expect(registeredVoters).to.include(voter2.address);
      expect(registeredVoters).to.include(voter3.address);
    });
  });

  describe("投票流程", function () {
    beforeEach(async function () {
      // 设置基本的投票环境
      await voting.createProposal("提案A", "第一个提案");
      await voting.createProposal("提案B", "第二个提案");
      await voting.registerVoter(voter1.address);
      await voting.registerVoter(voter2.address);
    });

    it("所有者应该能够开始投票", async function () {
      const duration = 3600; // 1小时
      
      await expect(
        voting.startVoting(duration)
      ).to.emit(voting, "VotingStarted");

      expect(await voting.votingActive()).to.equal(true);
      
      const status = await voting.getVotingStatus();
      expect(status[0]).to.equal(true); // active
      expect(status[2]).to.equal(2); // proposalCount
      expect(status[3]).to.equal(2); // voterCount
    });

    it("没有提案时不应该能够开始投票", async function () {
      // 部署新合约（没有提案）
      const ConfidentialVoting = await ethers.getContractFactory("ConfidentialVoting");
      const newVoting = await ConfidentialVoting.deploy();
      await newVoting.waitForDeployment();
      
      await newVoting.registerVoter(voter1.address);
      
      await expect(
        newVoting.startVoting(3600)
      ).to.be.revertedWith("No proposals available");
    });

    it("没有投票者时不应该能够开始投票", async function () {
      // 部署新合约（没有投票者）
      const ConfidentialVoting = await ethers.getContractFactory("ConfidentialVoting");
      const newVoting = await ConfidentialVoting.deploy();
      await newVoting.waitForDeployment();
      
      await newVoting.createProposal("测试提案", "这是一个测试提案");
      
      await expect(
        newVoting.startVoting(3600)
      ).to.be.revertedWith("No voters registered");
    });

    it("投票已开始时不应该能够重复开始", async function () {
      await voting.startVoting(3600);
      
      await expect(
        voting.startVoting(3600)
      ).to.be.revertedWith("Voting is already active");
    });

    it("所有者应该能够结束投票", async function () {
      await voting.startVoting(3600);
      
      await expect(
        voting.endVoting()
      ).to.emit(voting, "VotingEnded");

      expect(await voting.votingActive()).to.equal(false);
    });

    it("投票未开始时不应该能够结束投票", async function () {
      await expect(
        voting.endVoting()
      ).to.be.revertedWith("Voting is not active");
    });
  });

  describe("权限控制", function () {
    it("只有所有者能够调用管理员功能", async function () {
      // 测试创建提案
      await expect(
        voting.connect(voter1).createProposal("测试", "测试")
      ).to.be.revertedWith("Only owner can call this function");

      // 测试注册投票者
      await expect(
        voting.connect(voter1).registerVoter(voter2.address)
      ).to.be.revertedWith("Only owner can call this function");

      // 测试开始投票
      await expect(
        voting.connect(voter1).startVoting(3600)
      ).to.be.revertedWith("Only owner can call this function");

      // 测试结束投票
      await expect(
        voting.connect(voter1).endVoting()
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("只有注册的投票者能够投票", async function () {
      await voting.createProposal("测试提案", "这是一个测试提案");
      await voting.registerVoter(voter1.address);
      await voting.startVoting(3600);

      // 注意：这里我们无法完全测试投票功能，因为它需要 FHEVM 环境
      // 在实际的 FHEVM 环境中，未注册的投票者会被拒绝
    });
  });

  describe("状态查询", function () {
    beforeEach(async function () {
      await voting.createProposal("提案A", "第一个提案");
      await voting.createProposal("提案B", "第二个提案");
      await voting.registerVoter(voter1.address);
      await voting.registerVoter(voter2.address);
    });

    it("应该正确返回投票状态", async function () {
      let status = await voting.getVotingStatus();
      expect(status[0]).to.equal(false); // not active
      expect(status[2]).to.equal(2); // 2 proposals
      expect(status[3]).to.equal(2); // 2 voters

      await voting.startVoting(3600);
      
      status = await voting.getVotingStatus();
      expect(status[0]).to.equal(true); // active
    });

    it("应该正确返回提案信息", async function () {
      const proposal0 = await voting.getProposal(0);
      const proposal1 = await voting.getProposal(1);

      expect(proposal0[0]).to.equal("提案A");
      expect(proposal0[1]).to.equal("第一个提案");
      expect(proposal0[2]).to.equal(true);

      expect(proposal1[0]).to.equal("提案B");
      expect(proposal1[1]).to.equal("第二个提案");
      expect(proposal1[2]).to.equal(true);
    });

    it("查询无效提案ID应该失败", async function () {
      await expect(
        voting.getProposal(999)
      ).to.be.revertedWith("Invalid proposal ID");
    });

    it("应该正确返回投票者状态", async function () {
      expect(await voting.isRegistered(voter1.address)).to.equal(true);
      expect(await voting.isRegistered(voter3.address)).to.equal(false);
      expect(await voting.hasVoted(voter1.address)).to.equal(false);
    });

    it("应该正确返回注册投票者列表", async function () {
      const registeredVoters = await voting.getRegisteredVoters();
      expect(registeredVoters.length).to.equal(2);
      expect(registeredVoters).to.include(voter1.address);
      expect(registeredVoters).to.include(voter2.address);
    });
  });
});