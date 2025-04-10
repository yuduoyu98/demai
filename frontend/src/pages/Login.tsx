import { useState } from 'react';
import { Button } from "keep-react";
import MetaMaskIcon from '../assets/MetaMask_Fox.svg';
import '../styles/Login.css';
import * as React from "react";
import { setWalletAddress } from '../utils/auth';

const Login: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Check if MetaMask is installed
      if (window.ethereum) {
        try {
          // First request account access - this will prompt the user to connect
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          
          if (accounts && accounts.length > 0) {
            const walletAddress = accounts[0];
            
            // Request explicit permissions for a temporary session
            await window.ethereum.request({
              method: 'wallet_requestPermissions',
              params: [{ eth_accounts: {} }]
            });
            
            console.log('Connected to MetaMask with account:', walletAddress);
            
            // Save wallet address
            setWalletAddress(walletAddress);
            
            // Redirect to dashboard after successful connection
            window.location.href = '/dashboard';
          } else {
            setError('No accounts found. Please connect to MetaMask.');
          }
        } catch (connectionError: any) {
          // User rejected the connection request
          if (connectionError.code === 4001) {
            setError('Connection request rejected. Please approve MetaMask connection to proceed.');
          } else {
            setError(connectionError.message || 'Failed to connect to wallet');
          }
          console.error('Error connecting to MetaMask:', connectionError);
        }
      } else {
        setError('MetaMask is not installed. Please install the MetaMask extension and try again.');
      }
    } catch (error: any) {
      console.error('Error connecting to wallet:', error);
      setError(error.message || 'Failed to connect to wallet');
    } finally {
      setIsConnecting(false);
    }
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
        <Button
          size="md"
          type="button"
          onClick={handleConnectWallet}
          disabled={isConnecting}
          className="connect-wallet-button"
        >
          <img src={MetaMaskIcon} alt="MetaMask" className="metamask-icon" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
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