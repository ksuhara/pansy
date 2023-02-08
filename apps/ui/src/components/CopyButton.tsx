import { makeClipboard } from '@solid-primitives/clipboard';
import { FaRegularCopy } from 'solid-icons/fa';
import { createSignal, Show, type Component } from 'solid-js';

export const CopyButton: Component<{
  displayText: string
  copyText: string
  class?: string
}> = (props) => {
  const [showCopied, setShowCopied] = createSignal(false);
  const [write] = makeClipboard();

  return (
    <button
      class={props.class}
      onClick={() => {
        write(props.copyText);
        setShowCopied(true);
        console.log(showCopied());
      }}>
      <div class='flex items-center'>
        {props.displayText}
        <span class='ml-1'>
          <Show
            fallback={<FaRegularCopy />}
            when={showCopied()}
          >
            <div
              class="text-green-400"
              onMouseLeave={() => { setShowCopied(false); }}
            >
              copied
            </div>
          </Show>
        </span>
      </div>
    </button>
  );
};
