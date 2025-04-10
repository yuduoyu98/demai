import { useEffect, useState } from 'react';
import { getWalletAddress, logout, setupWalletListeners, removeWalletListeners } from '../utils/auth';

const DashBoard = () => {
    const [walletAddress, setWalletAddress] = useState<string>('');

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

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <p>Connected Wallet: {walletAddress}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default DashBoard;