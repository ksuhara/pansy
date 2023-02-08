/* @refresh reload */
import 'windi.css';

import { Router } from '@solidjs/router';
import { render } from 'solid-js/web';
import App from './app';

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById('root') as HTMLElement,
);

declare global {
  interface Window { aptos: any }
}
