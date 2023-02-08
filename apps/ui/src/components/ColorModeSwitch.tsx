import { FaSolidMoon } from 'solid-icons/fa';
import { HiSolidSun } from 'solid-icons/hi';
import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import { useColorMode } from 'src/contexts/ColorMode';
import { IconButton } from './IconButton';

export const ColorModeSwitchButton: Component = () => {
  const { colorMode, setColorMode } = useColorMode();

  const toggle = () => {
    if (colorMode() === 'dark') setColorMode('light');
    else setColorMode('dark');
  };

  const size = 18;

  return (
    <div
      class='
      dark:text-white
      bg-slate-50 hover:bg-gray-20
      dark:bg-sea-700 dark:hover:bg-sea-500
      border border-lightdark
      text-lg flex justify-between items-center rounded-lg
     '
    >
      <IconButton onClick={toggle}>
        <Show when={colorMode() === 'dark'}>
          <FaSolidMoon size={size} />
        </Show>
        <Show when={colorMode() === 'light'}>
          <HiSolidSun size={size * 1.2} />
        </Show>
      </IconButton>
    </div>
  );
};
