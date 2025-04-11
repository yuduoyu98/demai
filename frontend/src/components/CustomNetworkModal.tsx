import React, { useState } from 'react';
import { useNetworkManager } from '../utils/network';

interface CustomNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomNetworkModal: React.FC<CustomNetworkModalProps> = ({ isOpen, onClose }) => {
  const { addNetwork } = useNetworkManager();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // 表单字段
  const [networkName, setNetworkName] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [chainId, setChainId] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('ETH');
  const [currencyName, setCurrencyName] = useState('Ether');
  const [explorerUrl, setExplorerUrl] = useState('');
  
  const resetForm = () => {
    setNetworkName('');
    setRpcUrl('');
    setChainId('');
    setCurrencySymbol('ETH');
    setCurrencyName('Ether');
    setExplorerUrl('');
    setError(null);
    setSuccess(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      // 验证Chain ID
      const chainIdNumber = parseInt(chainId, 10);
      if (isNaN(chainIdNumber)) {
        throw new Error('Chain ID must be a valid number');
      }
      
      // 验证RPC URL格式
      if (!rpcUrl.startsWith('http://') && !rpcUrl.startsWith('https://')) {
        throw new Error('RPC URL must start with http:// or https://');
      }
      
      // 添加网络
      const result = await addNetwork(
        chainIdNumber,
        networkName,
        rpcUrl,
        currencySymbol,
        currencyName,
        18, // 默认18位小数
        explorerUrl || undefined
      );
      
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          resetForm();
        }, 2000);
      } else {
        throw new Error('Failed to add network. User may have rejected the request.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add network');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* 背景遮罩 */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>
        
        {/* 模态框内容 */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                {/* 网络图标 */}
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Add Custom Network
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Configure a custom network to connect to your blockchain.
                  </p>
                </div>
                
                {/* 表单 */}
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {/* 网络名称 */}
                  <div>
                    <label htmlFor="network-name" className="block text-sm font-medium text-gray-700">
                      Network Name*
                    </label>
                    <input
                      type="text"
                      id="network-name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g. My Custom Network"
                      value={networkName}
                      onChange={(e) => setNetworkName(e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* RPC URL */}
                  <div>
                    <label htmlFor="rpc-url" className="block text-sm font-medium text-gray-700">
                      RPC URL*
                    </label>
                    <input
                      type="text"
                      id="rpc-url"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g. https://my-network-rpc.example.com"
                      value={rpcUrl}
                      onChange={(e) => setRpcUrl(e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* Chain ID */}
                  <div>
                    <label htmlFor="chain-id" className="block text-sm font-medium text-gray-700">
                      Chain ID*
                    </label>
                    <input
                      type="text"
                      id="chain-id"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g. 1337"
                      value={chainId}
                      onChange={(e) => setChainId(e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* 货币符号 */}
                  <div>
                    <label htmlFor="currency-symbol" className="block text-sm font-medium text-gray-700">
                      Currency Symbol
                    </label>
                    <input
                      type="text"
                      id="currency-symbol"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g. ETH"
                      value={currencySymbol}
                      onChange={(e) => setCurrencySymbol(e.target.value)}
                    />
                  </div>
                  
                  {/* 货币名称 */}
                  <div>
                    <label htmlFor="currency-name" className="block text-sm font-medium text-gray-700">
                      Currency Name
                    </label>
                    <input
                      type="text"
                      id="currency-name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g. Ether"
                      value={currencyName}
                      onChange={(e) => setCurrencyName(e.target.value)}
                    />
                  </div>
                  
                  {/* 区块浏览器URL */}
                  <div>
                    <label htmlFor="explorer-url" className="block text-sm font-medium text-gray-700">
                      Block Explorer URL (Optional)
                    </label>
                    <input
                      type="text"
                      id="explorer-url"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g. https://explorer.example.com"
                      value={explorerUrl}
                      onChange={(e) => setExplorerUrl(e.target.value)}
                    />
                  </div>
                  
                  {/* 错误消息 */}
                  {error && (
                    <div className="text-sm text-red-600 mt-2">
                      {error}
                    </div>
                  )}
                  
                  {/* 成功消息 */}
                  {success && (
                    <div className="text-sm text-green-600 mt-2">
                      Network added successfully!
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
          
          {/* 按钮区域 */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Adding...' : 'Add Network'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomNetworkModal; 