import { makeClipboard } from '@solid-primitives/clipboard';
import { createStorageSignal } from '@solid-primitives/storage';
import { Link } from '@solidjs/router';
import Chance from 'chance';
import { AiOutlineClose } from 'solid-icons/ai';
import { ImTwitter } from 'solid-icons/im';
import { Match, onMount, Show, Switch, type Accessor, type Component, type Setter } from 'solid-js';
import logo from 'src/assets/logo.png';
import { useAptoWallet } from 'src/contexts/AptosWalletProvider';
import { useAptosWallet } from 'src/contexts/WalletProvider';
import { base58Letters } from 'src/utils/web3';
import { CopyButton } from './CopyButton';
import { IconButton } from './IconButton';
import { Modal } from './Modal';
import { SelectWallet } from './SelectWallet';
import { WalletButton } from './WalletButton';

const hash = (str: string) => Array.from(str).reduce((prev, current) => prev + current.charCodeAt(0), 0);
const isQualified = (s: string) => hash(s) % 256 === 1;

export const GateKeeperModal: Component<{
  show: Accessor<boolean>,
  setShow: Setter<boolean>;
}> = (props) => {
  const { account } = useAptosWallet();
  const { open, closeModal } = useAptoWallet();

  const [text, setText] = createStorageSignal<string>('invite-code', '',);
  const [write, read, newItem] = makeClipboard();

  const isI7 = () => text().includes('i') && text().includes('7');
  const isOk = () => isI7() || isQualified(text());

  const newInviteCode = () => {
    if (!account()) return '';
    const chance = new Chance(account().address);
    const genCode = () => {
      let a = chance.string({ length: 6, pool: base58Letters });
      while (!isQualified(a)) {
        a = chance.string({ length: 6, pool: base58Letters });
      }
      return a;
    };
    return genCode();
  };

  onMount(() => { if (isOk()) { props.setShow(false); } });

  return (
    <>
      <Modal isOpen={open()} onRequestClose={closeModal}>
        <SelectWallet />
      </Modal>
      <Modal
        isOpen={props.show()}
        onRequestClose={() => isOk() && props.setShow(false)}
      >
        <div class='flex justify-center text-white'>
          <div class='w-150 p-10 bg-sea-700 rounded-xl'>
            <div class='text-md text-gray-300'>
              <div class='flex items-begin mb-5'>
                <div class="flex-grow flex justify-center items-center gap-3">
                  <p class="mb-2"><img src={logo} width={48} /></p>
                  <p class="text-gray-300 text-xl">
                    Aptos<span class='text-white text-xl font-bold'>Umi</span> for
                    <span class='mx-2 font-medium text-greenblue-grad'>
                      early birds
                    </span>
                  </p>
                </div>
                <Show when={isOk()}>
                  <IconButton
                    onClick={() => { props.setShow(null); }}
                    children={<AiOutlineClose size={24} />}
                  />
                </Show>
              </div>
              <div>
                Currently only available to those with an invite code.
              </div>
              <div class='flex items-center gap-3 mt-8 mb-3'>
                <div class='text-gray-300'>
                  Enter invite code
                </div>
                <input
                  type='text'
                  class='text-lg bg-sea-800 p-3 rounded-lg w-48 disabled:bg-gray-800'
                  placeholder='xxxxxx'
                  value={text()}
                  onInput={(e) => {
                    setText((e.target as HTMLInputElement).value.replaceAll(' ', ''));
                  }} />
                <button
                  class='px-3 py-2 bg-green-500 hover:bg-green-400 rounded-xl'
                  onClick={() => {
                    console.log(text(), isOk());
                    if (isOk()) {
                      props.setShow(false);
                    }
                  }}>
                  Entry
                </button>
              </div>
              <Switch>
                <Match when={account() && isOk()}>
                  <div class='flex items-center gap-3'>
                    <div class='font-medium'>
                      Generated invite code.
                      Share your invite code with your friends.
                    </div>
                    <div>
                      <div class='bg-gray-700 px-5 py-2 w-34 rounded-xl flex items-center gap-2 text-white'>
                        {newInviteCode()}
                        <CopyButton text={newInviteCode()} />
                      </div>
                    </div>
                    <div>
                    </div>
                  </div>
                </Match>
                <Match when={isOk()}>
                  <div class='my-8'>
                    <div class='font-medium text-lg text-white my-1'>
                      🎯 <span class='ml-2'>How to generate an invite code? </span>
                    </div>
                    <div class='flex'>
                      <div class='text-gray-300'>
                        Connect your wallet to generate a new invitation code for you
                      </div>
                      <WalletButton />
                    </div>
                  </div>
                </Match>
              </Switch>
              <div class='my-8'>
                <div class='font-medium text-lg text-white my-1'>
                  👀 <span class='ml-2'>How to get an invite code? </span>
                </div>
                <div class='text-gray-300'>
                  We are giving out invitation codes only through referrals.
                  Please wait for public access.
                </div>
              </div>
              <div class='my-8'>
                <div class='font-medium text-lg my-1'>
                  🎁 <span class='ml-2 text-pinkblue-grad'>Giveaway Whitelists </span>
                </div>
                <div class='text-gray-300'>
                  We will giveaway our upcoming NFT Whitelist to active users on devnet and testnet.
                  Stay tuned for future announcements!
                </div>
              </div>
              <Link href="https://twitter.com/UmiProtocl" class='hover:underline'>
                <div class='flex items-center gap-2 text-lg'>
                  <ImTwitter class='text-blue-400' />
                  Twitter
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
