import { createWeb3Modal } from '@web3modal/wagmi';
import { createConfig } from 'wagmi';
import { http } from 'viem';
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

// 1. Define constants
const projectId = '459d401b51a9a477e2d784eebcb93f8d'; // 从 https://cloud.walletconnect.com 获取
const metadata = {
  name: 'DeMai',
  description: 'DeMai NFT Ticketing Platform',
  url: 'https://demai.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// 定义自定义网络（如需添加）
const localhardhat: Chain = {
  id: 31337,
  name: 'Localhost Hardhat',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
    public: { http: ['http://localhost:8545'] }
  }
};

// 自定义BNB测试网
const bnbTestnet: Chain = {
  id: 97,
  name: 'BNB Chain Testnet',
  nativeCurrency: { name: 'BNB', symbol: 'tBNB', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://data-seed-prebsc-1-s1.binance.org:8545'] },
    public: { http: ['https://data-seed-prebsc-1-s1.binance.org:8545'] }
  },
  testnet: true
};

// 2. 创建Wagmi配置 - 添加更多链支持
export const chains = [
  // 主网络
  mainnet, 
  polygon, 
  bsc, 
  avalanche, 
  optimism, 
  arbitrum,
  // 测试网络
  sepolia,
  goerli,
  polygonMumbai,
  avalancheFuji,
  baseGoerli,
  bnbTestnet,
  // 本地开发网络
  localhardhat
] as const;

// 分类网络
export const mainnetChains = [mainnet, polygon, bsc, avalanche, optimism, arbitrum];
export const testnetChains = [sepolia, goerli, polygonMumbai, avalancheFuji, baseGoerli, bnbTestnet];
export const localChains = [localhardhat];

// 创建transports对象
const transports: Record<number, any> = {};
chains.forEach(chain => {
  transports[chain.id] = http();
});

export const wagmiConfig = createConfig({
  chains,
  transports
});

// 3. 创建Web3Modal实例
export const web3modal = createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: true, // 可选的分析功能
  themeMode: 'light',
  featuredWalletIds: [], // 推荐的钱包（留空则使用默认）
  includeWalletIds: [], // 包含特定钱包（留空则包含所有）
  // 网络选择器的UI配置
  chainImages: {
    // 主网络
    [mainnet.id]: 'https://ethereum.org/favicon.ico',
    [polygon.id]: 'https://polygon.technology/favicon.ico',
    [bsc.id]: 'https://www.bnbchain.org/favicon.ico',
    [avalanche.id]: 'https://www.avax.com/favicon.ico',
    [optimism.id]: 'https://optimism.io/favicon.ico',
    [arbitrum.id]: 'https://arbitrum.io/favicon.ico',
    // 测试网络
    [sepolia.id]: 'https://ethereum.org/favicon.ico',
    [goerli.id]: 'https://ethereum.org/favicon.ico',
    [polygonMumbai.id]: 'https://polygon.technology/favicon.ico',
    [avalancheFuji.id]: 'https://www.avax.com/favicon.ico',
    [baseGoerli.id]: 'https://base.org/favicon.ico',
    [bnbTestnet.id]: 'https://www.bnbchain.org/favicon.ico',
    // 本地网络
    [localhardhat.id]: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E%3Cpath fill="%23f7b93e" d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16z"%3E%3C/path%3E%3Cpath fill="%23fff" d="M13.5 8.5h5v15h-5z"%3E%3C/path%3E%3C/svg%3E',
  },
  defaultChain: mainnet, // 默认选择的链
  themeVariables: {
    '--w3m-accent': '#3b82f6', // blue-500
    '--w3m-border-radius-master': '0.5rem',
  },
});

// 4. 导出工具函数
export const getChainName = (chainId: number): string => {
  const chain = chains.find(c => c.id === chainId);
  return chain?.name || 'Unknown Network';
};

// 获取链信息
export const getChainInfo = (chainId?: number) => {
  if (!chainId) return null;
  const chain = chains.find(c => c.id === chainId);
  return chain || null;
};

// 判断是否为测试网
export const isTestnet = (chainId?: number): boolean => {
  if (!chainId) return false;
  const chain = chains.find(c => c.id === chainId);
  return !!chain?.testnet;
};

// 判断是否为本地网络
export const isLocalNetwork = (chainId?: number): boolean => {
  if (!chainId) return false;
  return localChains.some(chain => chain.id === chainId);
};

// 获取网络类型标签
export const getNetworkTypeLabel = (chainId?: number): string => {
  if (!chainId) return '';
  
  if (isLocalNetwork(chainId)) return 'Local';
  if (isTestnet(chainId)) return 'Testnet';
  return 'Mainnet';
};

// 添加自定义网络
export const addCustomNetwork = async (
  chainId: number,
  chainName: string,
  rpcUrl: string,
  currencySymbol: string = 'ETH',
  currencyName: string = 'Ether',
  currencyDecimals: number = 18,
  blockExplorerUrl?: string
) => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${chainId.toString(16)}`,
          chainName,
          nativeCurrency: {
            name: currencyName,
            symbol: currencySymbol,
            decimals: currencyDecimals
          },
          rpcUrls: [rpcUrl],
          blockExplorerUrls: blockExplorerUrl ? [blockExplorerUrl] : undefined
        }]
      });
      
      // 刷新页面以应用新添加的网络
      window.location.reload();
      return true;
    } catch (error) {
      console.error('Error adding custom network:', error);
      return false;
    }
  } else {
    console.error('Ethereum provider not available');
    return false;
  }
};

export const formatAddress = (address?: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}; 