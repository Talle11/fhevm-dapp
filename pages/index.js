import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Material-UI 主题配置
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h3: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
});

export default function Home() {
  // 状态管理
  const [account, setAccount] = useState('');
  const [proposals, setProposals] = useState([
    { id: 0, title: '提案 A：增加社区资金', description: '为社区发展分配更多资金', active: true },
    { id: 1, title: '提案 B：改进治理机制', description: '优化投票和决策流程', active: true },
    { id: 2, title: '提案 C：技术升级计划', description: '升级系统基础设施', active: true }
  ]);
  const [votingStatus, setVotingStatus] = useState({
    active: true,
    endTime: Math.floor(Date.now() / 1000) + 3600, // 1小时后结束
    proposalCount: 3,
    voterCount: 5
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userStatus, setUserStatus] = useState({
    isRegistered: true,
    hasVoted: false,
    isOwner: false
  });
  
  // 对话框状态
  const [openProposalDialog, setOpenProposalDialog] = useState(false);
  const [openVoteDialog, setOpenVoteDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  
  // 表单状态
  const [proposalForm, setProposalForm] = useState({ title: '', description: '' });
  const [selectedProposal, setSelectedProposal] = useState('');
  const [voterAddress, setVoterAddress] = useState('');
  const [votingDuration, setVotingDuration] = useState(3600);

  // 模拟连接钱包
  const connectWallet = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 模拟钱包连接
      setTimeout(() => {
        setAccount('0x1234567890123456789012345678901234567890');
        setSuccess('钱包连接成功！（演示模式）');
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('连接钱包失败:', err);
      setError('连接钱包失败: ' + err.message);
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (selectedProposal === '') {
      setError('请选择一个提案');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // 模拟投票过程
      setTimeout(() => {
        setSuccess(`成功投票给提案 ${selectedProposal}！（演示模式）`);
        setOpenVoteDialog(false);
        setSelectedProposal('');
        setUserStatus(prev => ({ ...prev, hasVoted: true }));
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('投票失败: ' + err.message);
      setLoading(false);
    }
  };

  const handleCreateProposal = async () => {
    if (!proposalForm.title || !proposalForm.description) {
      setError('请填写完整的提案信息');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // 模拟创建提案
      setTimeout(() => {
        const newProposal = {
          id: proposals.length,
          title: proposalForm.title,
          description: proposalForm.description,
          active: true
        };
        setProposals(prev => [...prev, newProposal]);
        setVotingStatus(prev => ({ ...prev, proposalCount: prev.proposalCount + 1 }));
        
        setSuccess('提案创建成功！（演示模式）');
        setOpenProposalDialog(false);
        setProposalForm({ title: '', description: '' });
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('创建提案失败:', err);
      setError('创建提案失败: ' + err.message);
      setLoading(false);
    }
  };

  const handleRegisterVoter = async () => {
    if (!voterAddress) {
      setError('请输入有效的投票者地址');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // 模拟注册投票者
      setTimeout(() => {
        setVotingStatus(prev => ({ ...prev, voterCount: prev.voterCount + 1 }));
        setSuccess('投票者注册成功！（演示模式）');
        setOpenRegisterDialog(false);
        setVoterAddress('');
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('注册投票者失败:', err);
      setError('注册投票者失败: ' + err.message);
      setLoading(false);
    }
  };

  const handleStartVoting = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 模拟开始投票
      setTimeout(() => {
        setVotingStatus(prev => ({ ...prev, active: true, endTime: Date.now() + votingDuration * 1000 }));
        setSuccess('投票已开始！（演示模式）');
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('开始投票失败:', err);
      setError('开始投票失败: ' + err.message);
      setLoading(false);
    }
  };

  const handleEndVoting = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 模拟结束投票
      setTimeout(() => {
        setVotingStatus(prev => ({ ...prev, active: false }));
        setSuccess('投票已结束！（演示模式）');
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('结束投票失败:', err);
      setError('结束投票失败: ' + err.message);
      setLoading(false);
    }
  };

  const formatTimeRemaining = (endTime) => {
    const now = Date.now();
    const remaining = endTime - now;
    
    if (remaining <= 0) return '已结束';
    
    const hours = Math.floor(remaining / (1000 * 3600));
    const minutes = Math.floor((remaining % (1000 * 3600)) / (1000 * 60));
    
    return `${hours}小时${minutes}分钟`;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 头部 */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <SecurityIcon fontSize="large" color="primary" />
            FHEVM 保密投票系统
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            基于全同态加密的去中心化投票平台
          </Typography>
          
          {account ? (
            <Chip 
              label={`已连接: ${account.slice(0, 6)}...${account.slice(-4)}`} 
              color="success" 
              sx={{ mt: 2 }}
            />
          ) : (
            <Button 
              variant="contained" 
              onClick={connectWallet}
              sx={{ mt: 2 }}
              disabled={loading}
            >
              连接钱包
            </Button>
          )}
        </Box>

        {/* 错误和成功消息 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* 加载指示器 */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {account && votingStatus && (
          <>
            {/* 投票状态卡片 */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon />
                  投票状态
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">状态</Typography>
                    <Chip 
                      label={votingStatus.active ? '进行中' : '未开始/已结束'} 
                      color={votingStatus.active ? 'success' : 'default'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">提案数量</Typography>
                    <Typography variant="h6">{votingStatus.proposalCount}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">注册投票者</Typography>
                    <Typography variant="h6">{votingStatus.voterCount}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" color="text.secondary">剩余时间</Typography>
                    <Typography variant="h6">
                      {votingStatus.active ? formatTimeRemaining(votingStatus.endTime) : '-'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* 用户状态 */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>您的状态</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {userStatus.isRegistered ? <CheckCircleIcon color="success" /> : <CheckCircleIcon color="disabled" />}
                      <Typography>注册状态: {userStatus.isRegistered ? '已注册' : '未注册'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {userStatus.hasVoted ? <CheckCircleIcon color="success" /> : <CheckCircleIcon color="disabled" />}
                      <Typography>投票状态: {userStatus.hasVoted ? '已投票' : '未投票'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {userStatus.isOwner ? <CheckCircleIcon color="primary" /> : <CheckCircleIcon color="disabled" />}
                      <Typography>管理员: {userStatus.isOwner ? '是' : '否'}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* 提案列表 */}
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HowToVoteIcon />
              投票提案
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {proposals.map((proposal) => (
                <Grid item xs={12} md={6} key={proposal.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {proposal.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {proposal.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip 
                          label={proposal.active ? '活跃' : '非活跃'} 
                          color={proposal.active ? 'success' : 'default'}
                          size="small"
                        />
                        {userStatus.isRegistered && !userStatus.hasVoted && votingStatus.active && (
                          <Button 
                            variant="contained" 
                            size="small"
                            onClick={() => {
                              setSelectedProposal(proposal.id.toString());
                              setOpenVoteDialog(true);
                            }}
                          >
                            投票
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* 管理员功能 */}
            {userStatus.isOwner && (
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>管理员功能</Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button 
                      variant="outlined" 
                      onClick={() => setOpenProposalDialog(true)}
                      disabled={votingStatus.active}
                    >
                      创建提案
                    </Button>
                    <Button 
                      variant="outlined" 
                      onClick={() => setOpenRegisterDialog(true)}
                      disabled={votingStatus.active}
                    >
                      注册投票者
                    </Button>
                    <Button 
                      variant="contained" 
                      onClick={handleStartVoting}
                      disabled={votingStatus.active || votingStatus.proposalCount === 0}
                    >
                      开始投票
                    </Button>
                    <Button 
                      variant="contained" 
                      color="secondary"
                      onClick={handleEndVoting}
                      disabled={!votingStatus.active}
                    >
                      结束投票
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* 投票对话框 */}
        <Dialog open={openVoteDialog} onClose={() => setOpenVoteDialog(false)}>
          <DialogTitle>确认投票</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              您即将为以下提案投票。投票将使用全同态加密技术保护您的隐私。
            </Typography>
            {selectedProposal !== '' && proposals[parseInt(selectedProposal)] && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="h6">{proposals[parseInt(selectedProposal)].title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {proposals[parseInt(selectedProposal)].description}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenVoteDialog(false)}>取消</Button>
            <Button onClick={handleVote} variant="contained" disabled={loading}>
              确认投票
            </Button>
          </DialogActions>
        </Dialog>

        {/* 创建提案对话框 */}
        <Dialog open={openProposalDialog} onClose={() => setOpenProposalDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>创建新提案</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="提案标题"
              value={proposalForm.title}
              onChange={(e) => setProposalForm(prev => ({ ...prev, title: e.target.value }))}
              sx={{ mb: 2, mt: 1 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="提案描述"
              value={proposalForm.description}
              onChange={(e) => setProposalForm(prev => ({ ...prev, description: e.target.value }))}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenProposalDialog(false)}>取消</Button>
            <Button onClick={handleCreateProposal} variant="contained" disabled={loading}>
              创建提案
            </Button>
          </DialogActions>
        </Dialog>

        {/* 注册投票者对话框 */}
        <Dialog open={openRegisterDialog} onClose={() => setOpenRegisterDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>注册投票者</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="投票者地址"
              value={voterAddress}
              onChange={(e) => setVoterAddress(e.target.value)}
              sx={{ mb: 2, mt: 1 }}
            />
            <TextField
              fullWidth
              type="number"
              label="投票持续时间（秒）"
              value={votingDuration}
              onChange={(e) => setVotingDuration(parseInt(e.target.value))}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRegisterDialog(false)}>取消</Button>
            <Button onClick={handleRegisterVoter} variant="contained" disabled={loading}>
              注册投票者
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}