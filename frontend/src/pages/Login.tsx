import { useEffect } from 'react';
import MetaMaskIcon from '../assets/MetaMask_Fox.svg';
import '../styles/Login.css';
import { useAccount } from 'wagmi';
import { web3modal } from '../utils/web3modal';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { isConnected, isConnecting } = useAccount();
  const navigate = useNavigate();

  // 如果已连接，重定向到仪表板
  useEffect(() => {
    if (isConnected) {
      navigate('/dashboard');
    }
  }, [isConnected, navigate]);

  // 使用Web3Modal连接钱包
  const handleConnectWallet = () => {
    web3modal.open();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo-container">
          <div className="logo-placeholder"></div>
        </div>
        <h1 className="login-title">Welcome to DeMai</h1>
        <p className="login-subtitle">
          Connect your wallet to explore a new NFT ticketing experience. Secure, transparent, and convenient.
        </p>
        <button
          type="button"
          onClick={handleConnectWallet}
          disabled={isConnecting}
          className="connect-wallet-button"
        >
          <img src={MetaMaskIcon} alt="MetaMask" className="metamask-icon" />
          <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
      </div>
    </div>
  );
};

export default Login;

// Add global type definition for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, callback: (...args: any[]) => void) => void;
      removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}