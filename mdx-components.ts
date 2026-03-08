import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs';
import dynamic from 'next/dynamic';

// Load the client-only CodeBlock; no `ssr:false` in a Server Component context
const CodeBlock = dynamic(() => import('@/components/CodeBlock'));
import { Version } from '@/components/Version';

const docsComponents = getDocsMDXComponents();

export const useMDXComponents = (components?: any): any => ({
  ...docsComponents,
  pre: CodeBlock,
  Version,
  ...components,
});
