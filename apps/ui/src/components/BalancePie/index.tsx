import { type ApexOptions } from 'apexcharts';
import Decimal from 'decimal.js';
import numeral from 'numeral';
import { SolidApexCharts } from 'solid-apexcharts';
import { BiSolidWalletAlt } from 'solid-icons/bi';
import { createEffect, createSignal, For, Show, type Component, type Setter } from 'solid-js';
import type { Asset } from 'src/types/asset';
import { isMobile } from 'src/utils/is-mobile';

import './style.scss';

const BalancePie: Component<{
  width?: number,
  height?: number,
  labels: string[],
  series: number[],
  setSeriesIndex: Setter<number>
}> = (props) => {

  const [options] = createSignal<ApexOptions>({
    chart: {
      type: 'donut',
    },
    labels: props.labels,
    legend: {
      show: false,
      onItemHover: {
        highlightDataSeries: false
      }
    },
    tooltip: {
      custom: (options) => {
        const series = options.series;
        const seriesIndex = options.seriesIndex;
        props.setSeriesIndex(seriesIndex);

        const label = props.labels[seriesIndex];
        const value = series[seriesIndex];
        const ratio = numeral(value).format('0.00%');
        return `${label}<br/>${ratio}`;
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: 0,
          minAngleToShowLabel: 360
        },
        donut: {
          background: 'transparent'
        }
      }
    }
  });

  return (
    <SolidApexCharts
      width={props.width}
      height={props.height}
      type='donut'
      options={options()}
      series={props.series}
    />
  );
};

export const AssetAllocationPie: Component<{
  balance: Asset[]
}> = (props) => {
  const [labels, setLabels] = createSignal<string[]>([]);
  const [series, setSeries] = createSignal<number[]>([]);

  const [assetBasket, setAssetBasket] = createSignal<
    { major: Asset[], minority: Asset[] }
  >({ major: [], minority: [] });

  const [totalAssets, setTotalAssets] = createSignal({
    sum: new Decimal(0),
    major: new Decimal(0),
    minority: new Decimal(0)
  });

  const limit = 5;

  createEffect(() => {
    const coinAssets = props.balance
      .sort((a, b) => b.mktValue.sub(a.mktValue).toNumber())
      .filter((asset) => asset.mktValue.gte(0));
    const major = coinAssets.slice(0, limit);
    const minority = coinAssets.slice(limit);

    const totalMajor = major.reduce(
      (acc, asset) => acc.add(asset.mktValue),
      new Decimal(0)
    );

    const totalMinority = minority.reduce(
      (acc, asset) => acc.add(asset.mktValue),
      new Decimal(0)
    );
    const total = totalMajor.add(totalMinority);
    const labels = major.map((asset) => asset.name);
    const series = major.map((asset) => asset.mktValue.div(total).toNumber());

    setAssetBasket({ major: major, minority: minority });
    setTotalAssets({ sum: total, major: totalMajor, minority: totalMinority });

    if (minority) {
      setLabels([...labels, 'others']);
      setSeries([...series, totalMinority.div(total).toNumber()]);
    } else {
      setLabels(labels);
      setSeries(series);
    }
  });

  const [seriesIndex, setSeriesIndex] = createSignal(-1);

  const LegendDisplay = () => (
    <div class="text-sm flex flex-col gap-2">
      <For each={assetBasket().major}>
        {(asset, i) => (
          <div class='flex items-center w-40 gap-3'>
            <div class='flex-grow flex items-center gap-2'>
              <Show
                fallback={<BiSolidWalletAlt size={20} />}
                when={asset.logoURI}
              >
                <img
                  src={asset.logoURI}
                  width={20}
                  class='rounded-full'
                />
              </Show>
              <span class='text-black dark:text-white font-semibold'>
                {asset.name}
              </span>
            </div>
            <div class='text-gray-700 dark:text-gray-200'>
              {numeral(asset.mktValue.div(totalAssets().sum).toFixed()).format('0.00%')}
            </div>
          </div>
        )}
      </For>
      <Show when={!totalAssets().minority.isZero()}>
        <div class='flex items-center w-40 gap-3'>
          <div class='flex-grow flex items-center ml-7 gap-2'>
            <span class='text-black dark:text-white font-semibold'> others </span>
          </div>
          <div class='text-gray-700 dark:text-gray-200'>
            {numeral(totalAssets().minority.div(totalAssets().sum).toFixed()).format('0.00%')}
          </div>
        </div>
      </Show>
    </div>

  );

  const size = () => isMobile() ? 100 : 200;

  return (
    <div
      class='relative flex items-center justify-around'
      onmouseleave={() => {
        setSeriesIndex(-1);
      }}
    >
      <BalancePie
        height={size()}
        width={size()}
        labels={labels()}
        series={series()}
        setSeriesIndex={setSeriesIndex}
      />
      <LegendDisplay />
    </div>
  );
};
