import React, { useRef, useState, useEffect } from 'react';
import { useAccount, useDisconnect, useChainId } from 'wagmi';
import { getNetworkInfo } from '../utils/network';
import { web3modal, getNetworkTypeLabel } from '../utils/web3modal';
import { formatAddress } from '../utils/web3modal';
import CustomNetworkModal from './CustomNetworkModal';

const AccountDropdown: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAssetsMenu, setShowAssetsMenu] = useState(false);
  const [showCustomNetworkModal, setShowCustomNetworkModal] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const assetsMenuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // 格式化钱包地址显示 (0x1234...5678)
  const formattedAddress = formatAddress(address);

  // 更新当前网络信息
  useEffect(() => {
    if (chainId) {
      setCurrentNetwork(getNetworkInfo(chainId));
    } else {
      setCurrentNetwork(null);
    }
  }, [chainId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }

      if (assetsMenuRef.current && !assetsMenuRef.current.contains(event.target as Node)) {
        // 点击在覆盖层上不关闭侧边菜单(由覆盖层点击处理)
        if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
          return;
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(prev => !prev);
    // 关闭其他菜单
    setShowAssetsMenu(false);
  };

  const openNetworkMenu = () => {
    // 使用Web3Modal内置的网络选择器
    web3modal.open({ view: 'Networks' });
    setShowDropdown(false);
  };

  const openAssetsMenu = () => {
    setShowAssetsMenu(true);
    setShowDropdown(false);
    document.body.style.overflow = 'hidden'; // 防止背景滚动
  };

  const openCustomNetworkModal = () => {
    setShowCustomNetworkModal(true);
    setShowDropdown(false);
  };

  const closeAllSideMenus = () => {
    setShowAssetsMenu(false);
    document.body.style.overflow = ''; // 恢复背景滚动
  };

  const handleLogout = async () => {
    disconnect();
  };

  // 连接钱包方法
  const connectWallet = () => {
    web3modal.open();
  };

  // 获取当前网络名称和UI信息
  const getCurrentNetworkName = () => {
    return currentNetwork?.name || 'Not Connected';
  };

  const getNetworkIcon = () => {
    return currentNetwork?.icon || '?';
  };

  const getNetworkColors = () => {
    return {
      bgColor: currentNetwork?.bgColor || 'bg-gray-100',
      textColor: currentNetwork?.iconColor || 'text-gray-600'
    };
  };

  const getNetworkBadge = () => {
    if (!currentNetwork) return null;
    
    const networkType = getNetworkTypeLabel(chainId);
    
    // 根据网络类型显示不同标记
    if (networkType === 'Local') {
      return (
        <span className="ml-1 px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
          Local
        </span>
      );
    } else if (networkType === 'Testnet') {
      return (
        <span className="ml-1 px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
          Testnet
        </span>
      );
    }
    return null;
  };

  // 未连接状态显示连接按钮
  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        className="inline-flex items-center justify-center p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center justify-center p-2 rounded-md bg-white border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        id="user-menu-button"
        aria-expanded={showDropdown}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <span className="font-medium text-gray-900 hidden sm:inline">{formattedAddress}</span>
      </button>

      {/* 下拉菜单 */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          tabIndex={-1}
        >
          <div className="p-2">
            {/* 网络部分 */}
            <div className="p-2">
              <button 
                className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={openNetworkMenu}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full ${getNetworkColors().bgColor} flex items-center justify-center ${getNetworkColors().textColor} mr-3`}>
                    <span className="font-bold">{getNetworkIcon()}</span>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-900">Network</p>
                      {getNetworkBadge()}
                    </div>
                    <p className="text-sm text-gray-500">{getCurrentNetworkName()}</p>
                  </div>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* 自定义网络按钮 */}
            <div className="p-2">
              <button 
                className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={openCustomNetworkModal}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Add Custom Network</p>
                    <p className="text-sm text-gray-500">Configure your own network</p>
                  </div>
                </div>
              </button>
            </div>
            
            {/* 资产部分 */}
            <div className="p-2">
              <button 
                className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={openAssetsMenu}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Assets</p>
                    <p className="text-sm text-gray-500">HKDT & Tickets</p>
                  </div>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* 登出按钮 */}
            <div className="p-2">
              <button 
                className="w-full flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={handleLogout}
              >
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className="font-medium text-gray-900">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 侧边菜单遮罩层 */}
      {showAssetsMenu && (
        <div 
          ref={overlayRef}
          className="fixed top-0 left-0 right-0 bottom-0 bg-transparent z-50"
          onClick={closeAllSideMenus}
        ></div>
      )}
      
      {/* 资产侧边菜单 */}
      {showAssetsMenu && (
        <div 
          ref={assetsMenuRef}
          className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-lg z-60 overflow-y-auto transform transition-transform duration-300"
          style={{ transform: showAssetsMenu ? 'translateX(0)' : 'translateX(100%)' }}
        >
          <div className="h-full flex flex-col">
            {/* 侧边菜单头部 */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="font-medium text-lg text-gray-900">My Assets</h2>
                </div>
                <button onClick={closeAllSideMenus} className="text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* 资产余额 */}
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">TOKENS</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                      <span className="font-bold">$</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-gray-900">HKDT</p>
                        <p className="font-medium text-gray-900">1,500.00</p>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-gray-500">Hong Kong Dollar Token</p>
                        <p className="text-xs text-gray-500">≈ $1,500.00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">MY TICKETS</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium text-gray-900">Hong Kong Tech Conference 2023</p>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-gray-500">General Admission</p>
                          <p className="text-xs text-gray-700 font-medium">Seat A-12</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium text-gray-900">Blockchain Summit 2023</p>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-gray-500">VIP Access</p>
                          <p className="text-xs text-gray-700 font-medium">Seat VIP-04</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 自定义网络弹窗 */}
      <CustomNetworkModal 
        isOpen={showCustomNetworkModal} 
        onClose={() => setShowCustomNetworkModal(false)} 
      />
    </div>
  );
};

export default AccountDropdown; 