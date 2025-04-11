// Network utility functions and UI display information
import { 
  useChainId,
  useSwitchChain, 
  useAccount
} from 'wagmi';
import { 
  mainnet, 
  polygon, 
  avalanche, 
  bsc, 
  optimism, 
  arbitrum,
  // 测试网络
  sepolia,
  goerli,
  polygonMumbai,
  avalancheFuji,
  baseGoerli,
  type Chain 
} from 'viem/chains';
import { 
  web3modal, 
  chains, 
  isTestnet, 
  isLocalNetwork, 
  getNetworkTypeLabel,
  addCustomNetwork
} from './web3modal';

// 创建索引签名类型
type NetworksType = {
  [key: number]: {
    chainId: number;
    name: string;
    icon: string;
    iconColor: string;
    bgColor: string;
    testnet: boolean;
    isLocal?: boolean;
  }
};

// Network data - UI显示信息
export const NETWORKS: NetworksType = {
  // 主网络
  [mainnet.id]: {
    chainId: mainnet.id,
    name: mainnet.name,
    icon: 'E',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-100',
    testnet: false,
  },
  [polygon.id]: {
    chainId: polygon.id,
    name: polygon.name,
    icon: 'P',
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-100',
    testnet: false,
  },
  [bsc.id]: {
    chainId: bsc.id,
    name: bsc.name,
    icon: 'B',
    iconColor: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    testnet: false,
  },
  [avalanche.id]: {
    chainId: avalanche.id,
    name: avalanche.name,
    icon: 'A',
    iconColor: 'text-red-600',
    bgColor: 'bg-red-100',
    testnet: false,
  },
  [optimism.id]: {
    chainId: optimism.id,
    name: optimism.name,
    icon: 'O',
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
    testnet: false,
  },
  [arbitrum.id]: {
    chainId: arbitrum.id,
    name: arbitrum.name,
    icon: 'A',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    testnet: false,
  },
  
  // 测试网络
  [sepolia.id]: {
    chainId: sepolia.id,
    name: sepolia.name,
    icon: 'S',
    iconColor: 'text-gray-600',
    bgColor: 'bg-gray-100',
    testnet: true,
  },
  [goerli.id]: {
    chainId: goerli.id,
    name: goerli.name,
    icon: 'G',
    iconColor: 'text-gray-600',
    bgColor: 'bg-gray-100',
    testnet: true,
  },
  [polygonMumbai.id]: {
    chainId: polygonMumbai.id,
    name: polygonMumbai.name,
    icon: 'M',
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    testnet: true,
  },
  [avalancheFuji.id]: {
    chainId: avalancheFuji.id,
    name: avalancheFuji.name,
    icon: 'F',
    iconColor: 'text-red-600',
    bgColor: 'bg-red-50',
    testnet: true,
  },
  [baseGoerli.id]: {
    chainId: baseGoerli.id,
    name: baseGoerli.name,
    icon: 'B',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    testnet: true,
  },
  [97]: { // BSC Testnet
    chainId: 97,
    name: 'BNB Chain Testnet',
    icon: 'B',
    iconColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    testnet: true,
  },
  
  // 本地网络 - hardhat
  [31337]: {
    chainId: 31337,
    name: 'Localhost Hardhat',
    icon: 'H',
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    testnet: true,
    isLocal: true
  }
};

/**
 * 获取网络UI信息
 * @param chainId 链ID
 * @returns 网络UI信息
 */
export const getNetworkInfo = (chainId?: number) => {
  if (!chainId) return null;
  
  // 如果有预定义的网络信息，直接返回
  if (NETWORKS[chainId]) {
    return NETWORKS[chainId];
  }
  
  // 查找链信息
  const chain = chains.find(c => c.id === chainId);
  if (!chain) {
    return {
      chainId,
      name: `Unknown Network (${chainId})`,
      icon: '?',
      iconColor: 'text-gray-600',
      bgColor: 'bg-gray-100',
      testnet: false,
      isLocal: false
    };
  }
  
  const isLocal = isLocalNetwork(chainId);
  const isTest = isTestnet(chainId);
  
  // 为链创建默认信息
  return {
    chainId,
    name: chain.name,
    icon: chain.name.charAt(0).toUpperCase(),
    iconColor: isLocal ? 'text-yellow-500' : isTest ? 'text-gray-600' : 'text-blue-600',
    bgColor: isLocal ? 'bg-yellow-50' : isTest ? 'bg-gray-100' : 'bg-blue-100',
    testnet: isTest,
    isLocal
  };
};

/**
 * 使用Wagmi钩子处理网络相关操作
 */
export const useNetworkManager = () => {
  const { chain, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  
  /**
   * 切换网络
   */
  const switchNetwork = async (targetChainId: number) => {
    if (!targetChainId) return false;
    
    try {
      if (!isConnected) {
        // 未连接钱包，打开Web3Modal
        web3modal.open();
        return false;
      }
      
      await switchChainAsync({ chainId: targetChainId });
      return true;
    } catch (error) {
      console.error('Error switching network:', error);
      return false;
    }
  };
  
  /**
   * 获取当前网络信息
   */
  const getCurrentNetwork = () => {
    return getNetworkInfo(chainId);
  };
  
  /**
   * 获取网络类型标签 (Mainnet, Testnet, Local)
   */
  const getNetworkType = () => {
    return getNetworkTypeLabel(chainId);
  };
  
  /**
   * 添加自定义网络函数
   */
  const addNetwork = async (
    chainId: number,
    name: string,
    rpcUrl: string,
    symbol: string = 'ETH',
    currencyName: string = 'Ether',
    decimals: number = 18,
    explorerUrl?: string
  ) => {
    return addCustomNetwork(
      chainId,
      name,
      rpcUrl,
      symbol,
      currencyName,
      decimals,
      explorerUrl
    );
  };
  
  return {
    currentChainId: chainId,
    currentChain: chain,
    currentNetwork: getCurrentNetwork(),
    switchNetwork,
    addNetwork,
    networkType: getNetworkType(),
    isTestnet: chainId ? isTestnet(chainId) : false,
    isLocalNetwork: chainId ? isLocalNetwork(chainId) : false
  };
}; 