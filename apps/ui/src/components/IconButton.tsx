import { type Component, type JSXElement } from 'solid-js';

export const IconButton: Component<{
  disabled?: boolean;
  onClick?: () => void;
  children: JSXElement;
}> = (props) => {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      class="
        grid place-items-center origin-center w-8 h-8 rounded hover:bg-opacity-50 duration-200
        text-gray-900 hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-700
      "
    >
      {props.children}
    </button>
  );
};
