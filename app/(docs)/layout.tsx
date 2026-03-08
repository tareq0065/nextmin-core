import { Layout } from 'nextra-theme-docs';
import { Banner } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import config from '@/config';
import { DocsNavBar } from '@/components/DocsNavBar';
import { DocsFooter } from '@/components/DocsFooter';
import pack from '../../package.json';

import 'nextra-theme-docs/style.css';

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageMap = await getPageMap();
  const { nextraLayout } = config;

  return (
    <Layout
      banner={
        <Banner storageKey={`release-notes-${pack.version}`}>
          ✨ v{pack.version} Released -{' '}
          <a href="/docs/release-notes">See the release notes</a>
        </Banner>
      }
      navbar={<DocsNavBar />}
      pageMap={pageMap}
      docsRepositoryBase={nextraLayout.docsRepositoryBase}
      footer={<DocsFooter />}
      sidebar={nextraLayout.sidebar}
    >
      {children}
    </Layout>
  );
}
