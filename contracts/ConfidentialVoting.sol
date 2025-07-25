// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import "fhevm/gateway/GatewayCaller.sol";

/**
 * @title ConfidentialVoting
 * @dev 使用 FHEVM 实现的保密投票智能合约
 * @notice 这个合约允许用户进行保密投票，投票内容完全加密
 */
contract ConfidentialVoting is GatewayCaller {
    using TFHE for euint32;
    using TFHE for ebool;

    // 投票提案结构
    struct Proposal {
        string name;
        string description;
        euint32 voteCount; // 加密的投票计数
        bool active;
    }

    // 投票者结构
    struct Voter {
        bool hasVoted;
        bool isRegistered;
        euint32 votedProposal; // 加密的投票选择
    }

    address public owner;
    uint256 public proposalCount;
    uint256 public voterCount;
    bool public votingActive;
    uint256 public votingEndTime;

    // 存储提案
    mapping(uint256 => Proposal) public proposals;
    
    // 存储投票者信息
    mapping(address => Voter) public voters;
    
    // 注册的投票者地址列表
    address[] public registeredVoters;

    // 事件
    event ProposalCreated(uint256 indexed proposalId, string name, string description);
    event VoterRegistered(address indexed voter);
    event VoteCast(address indexed voter);
    event VotingStarted(uint256 endTime);
    event VotingEnded();
    event ResultsRevealed(uint256 indexed proposalId, uint32 voteCount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyRegisteredVoter() {
        require(voters[msg.sender].isRegistered, "Voter not registered");
        _;
    }

    modifier votingIsActive() {
        require(votingActive && block.timestamp < votingEndTime, "Voting is not active");
        _;
    }

    constructor() {
        owner = msg.sender;
        votingActive = false;
    }

    /**
     * @dev 创建新的投票提案
     * @param _name 提案名称
     * @param _description 提案描述
     */
    function createProposal(string memory _name, string memory _description) external onlyOwner {
        require(!votingActive, "Cannot create proposals during active voting");
        
        proposals[proposalCount] = Proposal({
            name: _name,
            description: _description,
            voteCount: TFHE.asEuint32(0), // 初始化为加密的0
            active: true
        });
        
        emit ProposalCreated(proposalCount, _name, _description);
        proposalCount++;
    }

    /**
     * @dev 注册投票者
     * @param _voter 投票者地址
     */
    function registerVoter(address _voter) external onlyOwner {
        require(!voters[_voter].isRegistered, "Voter already registered");
        require(!votingActive, "Cannot register voters during active voting");
        
        voters[_voter] = Voter({
            hasVoted: false,
            isRegistered: true,
            votedProposal: TFHE.asEuint32(0)
        });
        
        registeredVoters.push(_voter);
        voterCount++;
        
        emit VoterRegistered(_voter);
    }

    /**
     * @dev 开始投票
     * @param _duration 投票持续时间（秒）
     */
    function startVoting(uint256 _duration) external onlyOwner {
        require(!votingActive, "Voting is already active");
        require(proposalCount > 0, "No proposals available");
        require(voterCount > 0, "No voters registered");
        
        votingActive = true;
        votingEndTime = block.timestamp + _duration;
        
        emit VotingStarted(votingEndTime);
    }

    /**
     * @dev 投票函数 - 接受加密的投票选择
     * @param encryptedVote 加密的投票选择（提案ID）
     */
    function vote(einput encryptedVote, bytes calldata inputProof) external onlyRegisteredVoter votingIsActive {
        require(!voters[msg.sender].hasVoted, "Voter has already voted");
        
        // 将加密输入转换为 euint32
        euint32 vote = TFHE.asEuint32(encryptedVote, inputProof);
        
        // 验证投票选择是否有效（0 到 proposalCount-1）
        ebool validVote = TFHE.lt(vote, TFHE.asEuint32(proposalCount));
        require(TFHE.decrypt(validVote), "Invalid proposal ID");
        
        // 记录投票者的选择
        voters[msg.sender].votedProposal = vote;
        voters[msg.sender].hasVoted = true;
        
        // 为每个提案增加投票计数（只有匹配的提案会增加1）
        for (uint256 i = 0; i < proposalCount; i++) {
            ebool isMatch = TFHE.eq(vote, TFHE.asEuint32(i));
            euint32 increment = TFHE.select(isMatch, TFHE.asEuint32(1), TFHE.asEuint32(0));
            proposals[i].voteCount = TFHE.add(proposals[i].voteCount, increment);
        }
        
        emit VoteCast(msg.sender);
    }

    /**
     * @dev 结束投票
     */
    function endVoting() external onlyOwner {
        require(votingActive, "Voting is not active");
        
        votingActive = false;
        emit VotingEnded();
    }

    /**
     * @dev 请求解密投票结果
     * @param proposalId 提案ID
     */
    function requestDecryptResult(uint256 proposalId) external onlyOwner {
        require(!votingActive, "Voting must be ended first");
        require(proposalId < proposalCount, "Invalid proposal ID");
        
        uint256[] memory cts = new uint256[](1);
        cts[0] = Gateway.toUint256(proposals[proposalId].voteCount);
        
        Gateway.requestDecryption(cts, this.callbackDecryptResult.selector, 0, block.timestamp + 100, false);
    }

    /**
     * @dev 解密结果回调函数
     */
    function callbackDecryptResult(uint256 /*requestID*/, uint32 decryptedResult) external onlyGateway {
        // 这里可以存储解密后的结果或触发事件
        // 为了演示，我们触发一个事件
        emit ResultsRevealed(0, decryptedResult); // 简化版本，实际应该传递正确的 proposalId
    }

    /**
     * @dev 获取提案信息
     */
    function getProposal(uint256 proposalId) external view returns (string memory name, string memory description, bool active) {
        require(proposalId < proposalCount, "Invalid proposal ID");
        Proposal memory proposal = proposals[proposalId];
        return (proposal.name, proposal.description, proposal.active);
    }

    /**
     * @dev 检查投票者是否已投票
     */
    function hasVoted(address voter) external view returns (bool) {
        return voters[voter].hasVoted;
    }

    /**
     * @dev 检查投票者是否已注册
     */
    function isRegistered(address voter) external view returns (bool) {
        return voters[voter].isRegistered;
    }

    /**
     * @dev 获取投票状态
     */
    function getVotingStatus() external view returns (bool active, uint256 endTime, uint256 proposalCount_, uint256 voterCount_) {
        return (votingActive, votingEndTime, proposalCount, voterCount);
    }

    /**
     * @dev 获取所有注册投票者
     */
    function getRegisteredVoters() external view returns (address[] memory) {
        return registeredVoters;
    }
}