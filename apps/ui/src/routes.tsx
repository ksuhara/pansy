import type { RouteDefinition } from '@solidjs/router';
import { Navigate } from '@solidjs/router';
import { lazy } from 'solid-js';

import Profile from './pages/profile';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: () => <Navigate href={() => '/profile'} />,
  },
  {
    path: '/profile',
    component: Profile,
  },
  {
    path: '/profile/:address',
    component: Profile,
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];
