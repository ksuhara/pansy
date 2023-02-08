import {
  createSolidTable, flexRender, getCoreRowModel, getSortedRowModel,
  type ColumnDef, type SortingState
} from '@tanstack/solid-table';
import type Decimal from 'decimal.js';
import numeral from 'numeral';
import { FaSolidArrowDownLong, FaSolidArrowsUpDown, FaSolidArrowUpLong } from 'solid-icons/fa';
import { createSignal, For, Show, type Component } from 'solid-js';
import type { PairAssets } from 'src/types/asset';
import { isMobile } from 'src/utils/is-mobile';
import { CoinLogo } from './CoinLogo';

type RowData = {
  name: string[],
  balance: Decimal[],
  price: Decimal[],
  mktValue: Decimal,
  logoURI: string[]
};

export const LPTokenBalanceTable: Component<{
  assets: PairAssets[]
}> = (props) => {
  const [sorting, setSorting] = createSignal<SortingState>([{
    id: 'mktValue',
    desc: true
  }]);

  const createRowData = (data: PairAssets): RowData[] => {
    try {
      return [{
        name: data.name,
        balance: data.amount,
        price: data.price,
        mktValue: data.mktValue[0].add(data.mktValue[1]),
        logoURI: data.logoURI,
      }];
    } catch {
      console.log('err', data);
      return [];
    }
  };

  const columns: ColumnDef<RowData, RowData[keyof RowData]>[] = [
    {
      accessorKey: 'name',
      header: 'Asset',
      cell: info => {
        const { name, logoURI } = info.row.original;
        return (
          <div class='flex items-center justify-center w-48'>
            <CoinLogo
              logoURIs={logoURI}
              size={24}
            />
            <div class='pl-5'>
              {name[0]}-{name[1]}
            </div>
          </div>
        );
      },
      footer: props => props.column.id,
    },
    isMobile() ? [] : {
      accessorKey: 'balance',
      header: 'Balance',
      cell: info => {
        const { balance, name } = info.row.original;
        return (
          <div>
            <div class='flex items-center justify-center w-36'>
              {numeral(balance[0].toFixed()).format('0,0.00[00]').replaceAll(',', ' ')} {name[0]}
            </div>
            <div class='flex items-center justify-center w-36'>
              {numeral(balance[1].toFixed()).format('0,0.00[00]').replaceAll(',', ' ')} {name[1]}
            </div>
          </div>
        );
      },
      footer: props => props.column.id,
    },
    isMobile() ? [] : {
      accessorKey: 'price',
      header: 'Price',
      cell: info => {
        const { price } = info.row.original;
        return (
          <div>
            <div class='flex items-center justify-center w-36'>
              <Show when={price[0].isPositive()} fallback="-">
                ${numeral(
                  price[0].toPrecision(6)
                ).format('0,0.00[0000]').replaceAll(',', ' ')}
              </Show>
            </div>
            <div class='flex items-center justify-center w-36'>
              <Show when={price[1].isPositive()} fallback="-">
                ${numeral(
                  price[1].toPrecision(6)
                ).format('0,0.00[0000]').replaceAll(',', ' ')}
              </Show>
            </div>
          </div>
        );
      },
      footer: props => props.column.id,
    },
    {
      accessorKey: 'mktValue',
      header: 'Value',
      cell: info => {
        const { mktValue: value } = info.row.original;
        return (
          <div class='flex items-center justify-center w-36'>
            <Show when={value.isPositive()} fallback="-">
              ${numeral(
                value.toPrecision(6)
              ).format('0,0.00[0000]').replaceAll(',', ' ')}
            </Show>
          </div>
        );
      },
      footer: props => props.column.id,
    },
  ].flat();

  const sortAssets = (data: RowData[], state?: SortingState[0]) => {
    const assets = [...data];
    if (!state) return assets;

    const { id, desc } = state;

    return assets.sort((a, b) => {
      let compareResult = 0;
      if (id === 'name')
        compareResult = a.name > b.name ? 1 : -1;
      if (id === 'balance')
        compareResult = a.balance[0].sub(b.balance[0]).toNumber();
      if (id === 'price')
        compareResult = a.price[0].sub(b.price[0]).toNumber();
      if (id === 'mktValue')
        compareResult = a.mktValue.sub(b.mktValue).toNumber();
      if (desc) compareResult *= -1;

      return compareResult;
    });
  };

  const table = createSolidTable({
    get data() {
      const data = props.assets.flatMap(createRowData);
      const [sortingState] = sorting();

      return sortAssets(data, sortingState);
    },
    columns,
    state: {
      get sorting() {
        return sorting();
      },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    manualSorting: true,
  });

  return (
    <div class="p-5 bg-white dark:bg-sea-800 rounded-xl">
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
            {headerGroup => (
              <tr>
                <For each={headerGroup.headers}>
                  {header => (
                    <th class="text-base text-gray-700 dark:text-gray-500 font-light">
                      <Show when={!header.isPlaceholder}>
                        <div
                          class={
                            `flex items-center justify-center gap-3
                            ${header.column.getCanSort()
                      ? 'cursor-pointer select-none'
                      : undefined
                    }`
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <FaSolidArrowUpLong size={12} />,
                            desc: <FaSolidArrowDownLong size={12} />,
                          }[header.column.getIsSorted() as string] ?? (
                            <FaSolidArrowsUpDown size={12} />
                          )}
                        </div>
                      </Show>
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table.getRowModel().rows.slice(0, 10)}>
            {row => (
              <tr class='m-5 rouned-lg hover:bg-slate-100 dark:hover:bg-sea-500 transition duration-200'>
                <For each={row.getVisibleCells()}>
                  {cell => (
                    <td class="m-4 p-2 text-base text-black dark:text-gray-200 font-base">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
};

