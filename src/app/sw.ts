import type { Serwist } from 'serwist';
import { defaultCache } from '@serwist/next/worker';

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (string | { url: string; revision: string | null })[];
  serwist: Serwist;
};

import { Serwist as SerwistClass } from 'serwist';

const serwist = new SerwistClass({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
