import nodePolyfills from 'rollup-plugin-node-polyfills';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import WindiCSS from 'vite-plugin-windicss';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [solidPlugin(), WindiCSS(), tsconfigPaths()],
  resolve: {
    alias: {
      process: 'process/browser',
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      events: 'rollup-plugin-node-polyfills/polyfills/events',
    },
  },
  define: {
    'process.env': process.env ?? {},
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        // entryFileNames: `[name].js`,
        // chunkFileNames: `[name].js`,
        assetFileNames: '[name].[hash].[ext]',
      },
      plugins: [
        nodePolyfills({ crypto: true }),
      ],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
});
