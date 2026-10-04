export default {
  /**
   * Nextra metadata configuration
   * @see https://nextra.vercel.app/docs/metadata
   */
  metadata: {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nextmin.gscodes.dev'),
    title: {
      default: 'NextMin — Next.js Admin Panel & Schema-Driven REST API Framework',
      template: '%s | NextMin',
    },
    description:
      'Turn your JSON schema into a production-ready REST API and an instant, reactive React admin dashboard. Features multi-database NMAdapter (PostgreSQL, MySQL, SQLite, MongoDB), real-time Socket.io events, and granular RBAC.',
    keywords: [
      // Primary High-Volume Search Terms
      'Next.js admin panel',
      'Next js admin dashboard',
      'React admin panel',
      'React admin dashboard',
      'React admin framework',
      'schema to REST API',
      'schema-driven UI',
      'JSON schema REST API generator',
      'headless admin framework',
      'Node.js REST API generator',
      'React CRUD framework',
      'Next.js CRUD generator',
      'auto-generated admin panel',
      'self-hosted admin dashboard',

      // Alternative & Comparison Queries
      'Refine alternative',
      'react-admin alternative',
      'Strapi alternative for Next.js',
      'Directus alternative React',
      'PocketBase Next.js alternative',
      'Payload CMS alternative',

      // Core Technologies & Features
      '@airoom/nextmin-react',
      '@airoom/nextmin-node',
      'NextMin',
      'Next.js 15',
      'React 19',
      'TypeScript',
      'NMAdapter',
      'Socket.io real-time admin',
      'Real-time dashboard',
      'Role based access control Next.js',
      'RBAC schema policy',
      'PostgreSQL admin panel',
      'MongoDB admin panel',
      'MySQL admin panel',
      'SQLite admin panel',
      'HeroUI admin template',
      'Tailwind CSS admin',
      'Dynamic theming Next.js',
      'Tiptap rich text editor Next.js',
      'S3 file upload proxy',
      'Sharp image optimization WebP',
    ],
    authors: [{ name: 'NextMin Team', url: 'https://nextmin.gscodes.dev' }],
    creator: 'NextMin',
    publisher: 'NextMin',
    generator: 'Next.js',
    applicationName: 'NextMin',
    appleWebApp: {
      title: 'NextMin',
      statusBarStyle: 'default',
    },
    openGraph: {
      title: 'NextMin — Next.js Admin Panel & Schema-Driven REST API Framework',
      description:
        'Turn your JSON schema into a production-ready REST API and an instant, reactive React admin dashboard with real-time Socket.io and multi-database support.',
      url: 'https://nextmin.gscodes.dev',
      siteName: 'NextMin',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'NextMin — Next.js Admin Panel & Schema-Driven REST API Framework',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'NextMin — Next.js Admin Panel & Schema-Driven REST API Framework',
      description:
        'Turn your JSON schema into a production-ready REST API and an instant, reactive React admin dashboard.',
      site: 'https://nextmin.gscodes.dev',
      creator: '@nextmin',
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: 'https://nextmin.gscodes.dev',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'msapplication-TileColor': '#0b0f17',
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
