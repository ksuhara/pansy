
import { type Component } from 'solid-js';
import { AssetAllocationPie } from 'src/components/BalancePie';
import { useProfile } from 'src/contexts/Profile';

export const PieView: Component = () => {
  const { assetsByCoin, assetsByProtocol } = useProfile();

  return (
    <div class='flex flex-wrap justify-between items-begin gap-3 md:gap-6'>
      <div class='box-balance-view-700 flex-grow'>
        <div class='header-balance-view'>Coin Allocation</div>
        <AssetAllocationPie balance={assetsByCoin()} />
      </div>
      <div class='box-balance-view-700 flex-grow'>
        <div class='header-balance-view'>Protocol Allocation</div>
        <AssetAllocationPie balance={assetsByProtocol()} />
      </div>
    </div>
  );
};
