export default {
  /**
   * Nextra metadata configuration
   * @see https://nextra.vercel.app/docs/metadata
   */
  metadata: {
    title: {
      default: 'NextMin | The Unified Admin + REST API Framework',
      template: '%s | NextMin',
    },
    description:
      'Turn your JSON schema into a production-ready REST API and an elegant Admin Panel. Built with NMAdapter, Socket.io, and React.',
    // metadataBase can be set to your production docs URL when available
    // metadataBase: new URL('https://nextmin.airoom.dev/'),
    keywords: [
      // Branding & packages
      'Nextmin',
      '@airoom/nextmin-react',
      '@airoom/nextmin-node',
      'next js react',
      'next js admin',
      'react admin',
      'save time with next js',
      'next js admin template',

      // Ecosystem
      'React',
      'Next.js',
      'Node.js',
      'TypeScript',
      'Monorepo',
      'Open Source',

      // Docs & site
      'Documentation',
      'MDX',
      'Nextra',

      // React package (UI)
      'UI Components',
      'Component Library',
      'React Components',
      'UI Kit',
      'Tailwind CSS',
      'HeroUI',
      'Framer Motion',
      'Animations',
      'Google Maps',
      'Infinite Scroll',
      'Redux Toolkit',
      'React Redux',
      'Hooks',
      'Forms',
      'Tables',
      'Modals',

      // Node package (server)
      'SDK',
      'Node SDK',
      'API SDK',
      'Socket.io',
      'WebSocket',
      'Real-time',
      'Authentication',
      'Authorization',
      'JWT',
      'JWT Auth',
      'MongoDB',
      'Mongoose',
      'Schemas',
      'File Upload',
      'Multer',
      'AWS S3',
      'S3 Upload',
      'Presigned URL',
    ],
    generator: 'Next.js',
    applicationName: 'Nextmin',
    appleWebApp: {
      title: 'Nextmin',
    },
    openGraph: {
      // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
      url: './',
      siteName: 'Nextmin',
      locale: 'en_US',
      type: 'website',
    },
    other: {
      'msapplication-TileColor': '#fff',
    },
    twitter: {
      site: 'https://nextmin.gscodes.dev',
    },
    alternates: {
      // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
      canonical: './',
    },
  },
  /**
   * Nextra Layout component configuration
   */
  nextraLayout: {
    docsRepositoryBase: 'https://github.com/tareq0065/nextmin-core/tree/main/docs/',
    sidebar: {
      defaultMenuCollapseLevel: 1,
    },
  },
  /**
   * Main Layout head configuration
   */
  head: {
    mantine: {
      defaultColorScheme: 'dark',
      nonce: '8IBTHwOdqNKAWeKl7plt8g==',
    },
  },

  /**
   * Search configuration (for pagefind)
   * This is used to configure the search engine API.
   * @see /app/api/search/route.ts
   */
  search: {
    queryKeyword: 'q',
    minQueryLength: 3,
    limitKeyword: 'limit',
    defaultMaxResults: 5,
    excerptLengthKeyword: 'excerptLength',
    defaultExcerptLength: 30,
    defaultLanguage: 'en',
  },
} as const;
