import { useRoutes } from '@solidjs/router';
import { createSignal, type Component } from 'solid-js';
import { Toaster } from 'solid-toast';
import { AppBar } from './components/AppBar';
import { GateKeeperModal } from './components/GateKeeperModal';
import { wallets } from './config/walletList';
import { AptosBalanceProvider } from './contexts/AptosBalance';
import { AptosWalletProvider } from './contexts/AptosWalletProvider';
import { BalanceProvider } from './contexts/Balance';
import { ColorModeProvider } from './contexts/ColorMode';
import { NetworkProvider } from './contexts/Network';
import { PoolProvider } from './contexts/Pool';
import { ProfileProvider } from './contexts/Profile';
import { WalletProvider } from './contexts/WalletProvider';
import { FirebaseProvider } from './plugins/firebase';
import { routes } from './routes';
import './styles/index.scss';
import { isMobile } from './utils/is-mobile';

const [openGateKeep, setOpenGateKeep] = createSignal(false);

const App: Component = () => {
  const Route = useRoutes(routes);

  return (
    <>
      <ColorModeProvider>
        <FirebaseProvider>
          <WalletProvider
            wallets={wallets()}
            onError={(error: Error) => {
              console.log('wallet errors: ', error);
            }}
          >
            <AptosWalletProvider>
              <div class='flex justify-center gap-3'>
                <GateKeeperModal show={openGateKeep} setShow={setOpenGateKeep} />
              </div>
              <NetworkProvider>
                <PoolProvider>
                  <AptosBalanceProvider>
                    <ProfileProvider>
                      <BalanceProvider>
                        <div class={`min-h-screen bg-slate-100 dark:bg-sea-900 transition duration-200 ${isMobile() ? 'overflow-hidden' : ''}`}>
                          <AppBar setOpenGateKeep={setOpenGateKeep} />
                          <main>
                            <Route />
                          </main>
                        </div>
                      </BalanceProvider>
                    </ProfileProvider>
                  </AptosBalanceProvider>
                </PoolProvider>
              </NetworkProvider>
            </AptosWalletProvider>
          </WalletProvider >
        </FirebaseProvider>
      </ColorModeProvider>
      <Toaster />
    </>
  );
};

export default App;
