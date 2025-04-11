interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

interface Ethereum {
  isMetaMask?: boolean;
  request: (args: RequestArguments) => Promise<unknown>;
  on: (eventName: string, listener: (...args: any[]) => void) => void;
  removeListener: (eventName: string, listener: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: Ethereum;
  }
}

export {}; 