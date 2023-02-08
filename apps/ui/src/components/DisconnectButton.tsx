
import { useNavigate } from '@solidjs/router';
import { VsDebugDisconnect } from 'solid-icons/vs';
import { Show } from 'solid-js';
import { useNetwork } from 'src/contexts/Network';

export const DisconnectButton = () => {
  const { disconnect, connected } = useNetwork();
  const navigate = useNavigate();

  return (
    <Show when={connected()}>
      <button
        class='flex items-center gap-1 px-3 py-2 text-black dark:text-gray-700 bg-red-300 hover:bg-red-400 rounded-xl'
        onClick={() => {
          disconnect();
          navigate('/profile');
        }}
      >
        <VsDebugDisconnect size={24} />
        Disconnect wallet
      </button>
    </Show>
  );
};
