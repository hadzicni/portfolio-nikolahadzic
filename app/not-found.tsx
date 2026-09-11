import type { Metadata } from 'next';

import { NotFoundTerminal } from '@/components/not-found-terminal';

export const metadata: Metadata = {
  title: 'Not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundTerminal />;
}
