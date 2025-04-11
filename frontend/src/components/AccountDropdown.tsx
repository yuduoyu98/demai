import React, { useRef, useEffect, useState } from 'react';
import { logout } from '../utils/auth';

interface AccountDropdownProps {
  walletAddress: string;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({ walletAddress }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);
  const [showAssetsMenu, setShowAssetsMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const networkMenuRef = useRef<HTMLDivElement>(null);
  const assetsMenuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Format wallet address for display (0x1234...5678)
  const formattedAddress = `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }

      if (
        (networkMenuRef.current && !networkMenuRef.current.contains(event.target as Node)) &&
        (assetsMenuRef.current && !assetsMenuRef.current.contains(event.target as Node))
      ) {
        // Don't close the side menus if clicking on the overlay (handled by overlay click)
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
    // Close other menus
    setShowNetworkMenu(false);
    setShowAssetsMenu(false);
  };

  const openNetworkMenu = () => {
    setShowNetworkMenu(true);
    setShowDropdown(false);
    setShowAssetsMenu(false);
    document.body.style.overflow = 'hidden'; // Prevent body scrolling
  };

  const openAssetsMenu = () => {
    setShowAssetsMenu(true);
    setShowDropdown(false);
    setShowNetworkMenu(false);
    document.body.style.overflow = 'hidden'; // Prevent body scrolling
  };

  const closeAllSideMenus = () => {
    setShowNetworkMenu(false);
    setShowAssetsMenu(false);
    document.body.style.overflow = ''; // Restore body scrolling
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Avatar Button */}
      <button 
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
        onClick={toggleDropdown}
      >
        <span className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
        <span>{formattedAddress}</span>
      </button>
      
      {/* Dropdown Menu */}
      {showDropdown && (
        <div 
          ref={dropdownRef} 
          className="absolute top-16 right-0 w-72 bg-white rounded-lg shadow-lg z-50 overflow-hidden"
        >
          {/* Dropdown Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div>
                <p className="font-medium text-gray-900">{formattedAddress}</p>
                <p className="text-sm text-gray-500">Connected</p>
              </div>
            </div>
          </div>
          
          {/* Dropdown Menu Items */}
          <div className="p-2">
            {/* Network Section */}
            <div className="p-2">
              <button 
                className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={openNetworkMenu}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Network</p>
                    <p className="text-sm text-gray-500">Ethereum Mainnet</p>
                  </div>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Assets Section */}
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
                  <div>
                    <p className="font-medium text-gray-900">Assets</p>
                    <p className="text-sm text-gray-500">HKDT & NFT</p>
                  </div>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Divider */}
            <div className="my-2 border-t border-gray-200"></div>
            
            {/* Logout Button */}
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

      {/* Side Menu Overlay */}
      {(showNetworkMenu || showAssetsMenu) && (
        <div 
          ref={overlayRef}
          className="fixed top-0 left-0 right-0 bottom-0 bg-transparent z-50"
          onClick={closeAllSideMenus}
        ></div>
      )}
      
      {/* Network Side Menu */}
      {showNetworkMenu && (
        <div 
          ref={networkMenuRef}
          className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-lg z-60 overflow-y-auto transform transition-transform duration-300"
          style={{ transform: showNetworkMenu ? 'translateX(0)' : 'translateX(100%)' }}
        >
          <div className="h-full flex flex-col">
            {/* Side Menu Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <h2 className="font-medium text-lg text-gray-900">Select Network</h2>
                </div>
                <button onClick={closeAllSideMenus} className="text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Network Options */}
            <div className="flex-1 p-4">
              <div className="space-y-2">
                <button className="w-full flex items-center p-3 rounded-md bg-blue-50 border border-blue-200">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">Ethereum Mainnet</p>
                    <p className="text-sm text-gray-500">Currently connected</p>
                  </div>
                </button>
                
                <button className="w-full flex items-center p-3 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-bold">P</span>
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">Polygon</p>
                    <p className="text-sm text-gray-500">Switch to Polygon network</p>
                  </div>
                </button>
                
                <button className="w-full flex items-center p-3 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 font-bold">O</span>
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">Optimism</p>
                    <p className="text-sm text-gray-500">Switch to Optimism network</p>
                  </div>
                </button>
                
                <button className="w-full flex items-center p-3 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold">A</span>
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">Arbitrum</p>
                    <p className="text-sm text-gray-500">Switch to Arbitrum network</p>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Side Menu Footer */}
            <div className="border-t border-gray-200 p-4">
              <p className="text-xs text-gray-500 text-center">Switching networks will reconnect your wallet</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Assets Side Menu */}
      {showAssetsMenu && (
        <div 
          ref={assetsMenuRef}
          className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-lg z-60 overflow-y-auto transform transition-transform duration-300"
          style={{ transform: showAssetsMenu ? 'translateX(0)' : 'translateX(100%)' }}
        >
          <div className="h-full flex flex-col">
            {/* Side Menu Header */}
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
            
            {/* Assets Balances */}
            <div className="flex-1 p-4">
              {/* HKDT Balance Card */}
              <div className="mb-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-4 text-white shadow-lg">
                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      <span className="text-green-600 font-bold text-lg">$</span>
                    </div>
                    <span className="font-medium">HKDT</span>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">1,250.00</div>
                <p className="text-sm opacity-80">Available for withdrawal</p>
              </div>
              
              {/* NFT Tickets Section */}
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">My NFT Tickets</h3>
                
                <div className="space-y-3">
                  {/* Ticket 1 */}
                  <div className="bg-white rounded-lg border border-gray-200 p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">Jay Chou Concert</h4>
                        <p className="text-sm text-gray-500">March 15, 2024</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">ID: #1234</span>
                      <button className="text-sm text-blue-600 font-medium hover:text-blue-800">View</button>
                    </div>
                  </div>
                  
                  {/* Ticket 2 */}
                  <div className="bg-white rounded-lg border border-gray-200 p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">Tech Conference</h4>
                        <p className="text-sm text-gray-500">April 20, 2024</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        For Sale
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">ID: #5678</span>
                      <button className="text-sm text-blue-600 font-medium hover:text-blue-800">View</button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Transaction History Section */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Recent Transactions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Tech Conference Ticket</p>
                      <p className="text-xs text-gray-500">Apr 5, 2024</p>
                    </div>
                    <span className="text-sm font-medium text-red-600">-150 HKDT</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Deposit from Bank</p>
                      <p className="text-xs text-gray-500">Apr 1, 2024</p>
                    </div>
                    <span className="text-sm font-medium text-green-600">+500 HKDT</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Jay Chou Concert Ticket</p>
                      <p className="text-xs text-gray-500">Mar 28, 2024</p>
                    </div>
                    <span className="text-sm font-medium text-red-600">-100 HKDT</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Side Menu Footer */}
            <div className="border-t border-gray-200 p-4 flex space-x-2">
              <button className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                Deposit
              </button>
              <button className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountDropdown; 