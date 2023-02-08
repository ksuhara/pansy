import { defineConfig } from 'vite-plugin-windicss';

export default defineConfig({
  darkMode: 'class',
  theme: {
    screens: {
      'laptop': '1200px',

      // default
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        sea: {
          500: '#3B3D65',
          700: '#23264B',
          800: '#14163B',
          900: '#111827',
        },
        sun: {
          100: '#F497B6',
          300: '#E8749A',
          500: '#D12E64',
          700: '#87153B',
          900: '#5E0C27',
        },
        farm: {
          500: '#EBC56C',
        }
      },
      height: {
        '10v': '10vh',
        '20v': '20vh',
        '30v': '30vh',
        '40v': '40vh',
        '50v': '50vh',
        '60v': '60vh',
        '70v': '70vh',
        '80v': '80vh',
        '90v': '90vh',
        '100v': '100vh',
      },
    },
  },
});
