// Authentication utility functions
import { web3modal } from './web3modal';
import { useDisconnect, useAccount } from 'wagmi';

/**
 * Wagmi钩子: 处理钱包连接和断开
 * 返回账户状态和相关函数
 */
export const useWalletAuth = () => {
  const { address, isConnected, status, chain, chainId } = useAccount();
  const { disconnectAsync } = useDisconnect();
  
  // 连接钱包 - 打开Web3Modal
  const connectWallet = () => {
    web3modal.open();
  };
  
  // 断开钱包连接
  const disconnectWallet = async () => {
    await disconnectAsync();
    clearWalletAddress();
  };
  
  return {
    address, 
    isConnected,
    status,
    chain,
    chainId,
    connectWallet,
    disconnectWallet
  };
};

/**
 * Save the wallet address to localStorage
 * @param address The wallet address to save
 */
export const setWalletAddress = (address: string): void => {
  localStorage.setItem('walletAddress', address);
};

/**
 * Get the wallet address from localStorage
 * @returns The wallet address or null if not set
 */
export const getWalletAddress = (): string | null => {
  return localStorage.getItem('walletAddress');
};

/**
 * Clear the wallet address from localStorage
 */
export const clearWalletAddress = (): void => {
  localStorage.removeItem('walletAddress');
};

/**
 * Check if the user is authenticated
 * @returns True if the user is authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  return getWalletAddress() !== null;
};

/**
 * Complete logout process:
 * Clear local storage only
 * 
 * Note: For disconnecting the wallet, use the disconnectWallet method 
 * from useWalletAuth hook inside components.
 */
export const logout = (): void => {
  clearWalletAddress();
}; 