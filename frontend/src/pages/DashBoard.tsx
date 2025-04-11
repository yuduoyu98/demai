import { useEffect, useState } from 'react';
import { getWalletAddress, logout, setupWalletListeners, removeWalletListeners } from '../utils/auth';
import ExploreTab from '../components/ExploreTab';
import MarketTab from '../components/MarketTab';
import AccountTab from '../components/AccountTab';
import AccountDropdown from '../components/AccountDropdown';

type TabType = 'explore' | 'market' | 'account';

const DashBoard = () => {
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [activeTab, setActiveTab] = useState<TabType>('explore');

    useEffect(() => {
        const address = getWalletAddress();
        if (address) {
            setWalletAddress(address);
            
            // Setup wallet listeners
            setupWalletListeners(() => {
                // This is called when wallet disconnects
                logout();
            });
        } else {
            // No wallet address, redirect to login
            window.location.href = '/login';
        }
        
        // Cleanup function to remove listeners when component unmounts
        return () => {
            removeWalletListeners();
        };
    }, []);

    const handleLogout = async () => {
        await logout();
    };

    const checkConnection = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_accounts'
                });
                
                if (!accounts || accounts.length === 0) {
                    console.log('No connected accounts found');
                    await logout();
                }
            } catch (error) {
                console.error('Error checking connection:', error);
            }
        }
    };

    // Periodically check if wallet is still connected
    useEffect(() => {
        // Check connection on load
        checkConnection();
        
        // Check connection every 30 seconds
        const intervalId = setInterval(checkConnection, 30000);
        
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'explore':
                return <ExploreTab />;
            case 'market':
                return <MarketTab />;
            case 'account':
                return <AccountTab />;
            default:
                return <ExploreTab />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">DeMai</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <AccountDropdown walletAddress={walletAddress} />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('explore')}
                            className={`${
                                activeTab === 'explore'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Explore
                        </button>
                        <button
                            onClick={() => setActiveTab('market')}
                            className={`${
                                activeTab === 'market'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Market
                        </button>
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`${
                                activeTab === 'account'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Account
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                {renderTabContent()}
            </main>
        </div>
    );
};

export default DashBoard;