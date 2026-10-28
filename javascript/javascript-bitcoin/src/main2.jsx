
import React from 'react';
import { createRoot } from 'react-dom/client';
import { TrustConnectProvider } from '@trustwallet/connect-react';
import { createBIP122, mainnet as bitcoinMainnet } from '@trustwallet/connect-bip122-react';
import { createWalletConnect } from '@trustwallet/connect-walletconnect';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';

const queryClient = new QueryClient();

const bip122 = createBIP122({
  chain: bitcoinMainnet,
});

const projectId = import.meta.env.VITE_WALLETCONNECT_ID;

const walletConnect = createWalletConnect({
  projectId,
  metadata: {
    name: 'Oxana Bitcoin Wallet Pro',
    description: 'Bitcoin wallet connection test',
    url: 'https://mkhn352-blip.github.io/Oxana-bitcoin-wallet/',
    icons: [],
  },
});

function Root() {
  return (
    <TrustConnectProvider
      config={{
        namespaces: [bip122],
        services: [walletConnect],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </TrustConnectProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
