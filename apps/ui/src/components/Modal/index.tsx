import type { Component, JSXElement } from 'solid-js';
import { Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import './style.scss';

export const Modal: Component<{
  isOpen: boolean;
  children: JSXElement,
  onRequestClose?: () => void,
}> = (props) => {
  let containerEl: HTMLDivElement;
  const onBackgroundClicked = (e: MouseEvent) => {
    // avoid to close the modal when a child element clicked
    if (containerEl?.isEqualNode(e.target as HTMLElement)) {
      props.onRequestClose?.();
    }
  };

  // Due to current limitation of `solid-transition-group`,
  // Transition would not work correctly when using Portal.
  return (
    <Portal mount={document.body}>
      {/* <Transition name="fade"> */}
      <Show when={props.isOpen}>
        <div class="
            fixed inset-0 grid place-items-center z-9999
            w-screen h-screen bg-black bg-opacity-60
          "
        onClick={onBackgroundClicked}
        ref={containerEl}
        >
          {props.children}
        </div>
      </Show>
      {/* </Transition> */}
    </Portal>
  );
};
