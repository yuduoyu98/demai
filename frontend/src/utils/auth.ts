// Authentication utility functions

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
 * Revoke wallet permissions
 */
export const revokeWalletPermissions = async (): Promise<void> => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }]
      });
      console.log('Wallet permissions revoked');
    } catch (error) {
      console.error('Error revoking wallet permissions:', error);
    }
  }
};

/**
 * Setup listeners for wallet connection events
 * @param onDisconnect Callback to run when wallet is disconnected
 */
export const setupWalletListeners = (onDisconnect: () => void): void => {
  if (window.ethereum) {
    // Listen for account changes
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      console.log('Accounts changed:', accounts);
      if (!accounts.length) {
        // No accounts - user disconnected
        onDisconnect();
      } else {
        // Update the stored wallet address
        setWalletAddress(accounts[0]);
      }
    });

    // Listen for chain changes
    window.ethereum.on('chainChanged', () => {
      console.log('Chain changed, refreshing...');
      window.location.reload();
    });

    // Listen for disconnect events
    window.ethereum.on('disconnect', () => {
      console.log('Wallet disconnected');
      onDisconnect();
    });
  }
};

/**
 * Remove wallet event listeners
 */
export const removeWalletListeners = (): void => {
  if (window.ethereum) {
    window.ethereum.removeListener('accountsChanged', () => {});
    window.ethereum.removeListener('chainChanged', () => {});
    window.ethereum.removeListener('disconnect', () => {});
  }
};

/**
 * Complete logout process:
 * 1. Revoke wallet permissions
 * 2. Clear local storage
 * 3. Redirect to login page
 */
export const logout = async (): Promise<void> => {
  try {
    // Revoke wallet permissions
    await revokeWalletPermissions();
    // Clear local storage
    clearWalletAddress();
    // Remove event listeners
    removeWalletListeners();
    // Redirect to login page
    window.location.href = '/login';
  } catch (error) {
    console.error('Error during logout:', error);
    // Ensure redirect happens even if revoke fails
    clearWalletAddress();
    window.location.href = '/login';
  }
}; 