import { Link } from '@solidjs/router';
import { AiOutlineSearch } from 'solid-icons/ai';
import type { Component } from 'solid-js';
import { createSignal, Show } from 'solid-js';
import { isValidAccountAddress } from 'umi-sdk';

export const AddressInput: Component<{
  onEnter?: (address: string) => void;
}> = (props) => {
  const [address, setAddress] = createSignal('');
  const [showSuggestions, setShowSuggestions] = createSignal(false);

  const handleInput = (e: InputEvent) => {
    const { value } = e.currentTarget as HTMLInputElement;

    setAddress(value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code !== 'Enter') return;
    if (!isValidAccountAddress(address())) return;

    const { value } = e.currentTarget as HTMLInputElement;
    props.onEnter?.(value);
  };

  let parentEl: HTMLDivElement;
  const handleOnBlur = (e: FocusEvent) => {
    if (e.relatedTarget === parentEl.querySelector('a')) return;

    setShowSuggestions(false);
  };

  const handleSuggestionClick = () => {
    // props.onEnter?.(address());
    setShowSuggestions(false);
  };

  // createEffect(() => {
  //   const currentAddress = () => window.location.href.split('/').slice(-1)[0];
  //   setAddress(currentAddress());
  // });

  return (
    <div class="relative text-gray-700 dark:text-gray-300" ref={parentEl} tabindex="0">
      <AiOutlineSearch class="absolute inset-0 text-3xl top-1/2 left-4 transform -translate-y-1/2" />

      <input
        type="text"
        class="text-lg bg-white dark:bg-gray-900 px-5 py-3 pl-12 rounded-full w-full border border-2 border-gray-500 dark:border-gray-400 disabled:bg-gray-800"
        placeholder='Account Address'
        value={address()}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        onBlur={handleOnBlur}
      />

      <Show when={showSuggestions() && isValidAccountAddress(address())}>
        <div
          class="absolute top-[calc(100%_+_1px)] w-full px-4 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800"
          onClick={() => handleSuggestionClick()}
        >
          <Link href={`/profile/${address()}`}>
            <p class="py-6 text-gray-400 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white duration-200 cursor-pointer">
              Account {address()}
            </p>
          </Link>
        </div>
      </Show>
    </div>
  );
};
