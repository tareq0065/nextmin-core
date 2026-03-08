'use client';

import { Footer } from 'nextra-theme-docs';

/**
 * Tailwind-based Footer (removed Mantine components)
 *
 * @since 1.0.1
 */
export const DocsFooter = () => {
  const year = new Date().getFullYear();
  return (
    <div className="relative">
      <Footer className="flex w-full justify-center items-center text-center gap-1 py-6">
        © {year}{' '}
        <a
          href="https://gscodes.dev"
          className="text-blue-600 underline decoration-blue-400 hover:no-underline"
        >
          GSCodes
        </a>
        <span className="mx-1">—</span>
        <a
          href="/docs/license"
          className="text-blue-600 underline decoration-blue-400 hover:no-underline"
        >
          Licensed under the GSCodes Proprietary License
        </a>
      </Footer>
    </div>
  );
};
