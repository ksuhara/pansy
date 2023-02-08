
import { FaSolidHandHoldingHand } from 'solid-icons/fa';
import { Show, type Component } from 'solid-js';
import { BalanceTable } from 'src/components/BalanceTable';
import { useProfile } from 'src/contexts/Profile';
import { protocolBook } from 'umi-sdk';

export const LendingView: Component = () => {

  const { aptinBorrowings, aptinLendings } = useProfile();

  const aptin = protocolBook.aptin;

  const AptinView = () => (
    <div>
      <div class='flex items-center gap-3 text-lg font-medium mb-1so'>
        <img
          width={24}
          src={aptin.logoURI}
          class="rounded-full"
        />
        <div>{aptin.name}</div>
      </div>
      <div>
        <div>Supplied</div>
        <BalanceTable assets={aptinLendings()} />
        <div>Borrowed</div>
        <BalanceTable assets={aptinBorrowings()} />
      </div>
    </div>
  );

  return (
    <div class='box-balance-view-700'>
      <div class='flex items-center justify-between mb-1so'>
        <div class='header-balance-view'>
          <FaSolidHandHoldingHand size={24} />
          Lending / Borrowing
        </div>
      </div>
      <div class='flex justify-center'>
        <Show
          when={aptinLendings().length || aptinBorrowings().length}
          fallback={<div> Not found </div>}
        >
          <AptinView />
        </Show>
      </div>
    </div>
  );
};
