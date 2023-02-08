import { createContextProvider } from '@solid-primitives/context';
import { createStorageSignal } from '@solid-primitives/storage';

type ColorMode = 'light' | 'dark';

export const [ColorModeProvider, useColorMode] = createContextProvider(() => {
  const [colorMode, storeColorMode] = createStorageSignal<ColorMode>('prefer-color-mode', 'light');

  if (colorMode() === 'dark') {
    document.documentElement.classList.add('dark');
  }

  const setColorMode = (mode: ColorMode) => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    storeColorMode(mode);
  };

  return {
    colorMode,
    setColorMode
  };
});
