import { Head } from 'nextra/components';
import './globals.css';
import config from '@/config';

export const metadata = config.metadata;

const jsonLdWebsite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NextMin',
    url: 'https://nextmin.gscodes.dev',
    description:
        'Next.js Admin Panel & Schema-Driven REST API Framework for Node.js and React',
    publisher: {
        '@type': 'Organization',
        name: 'GS Codes AI',
        url: 'https://gscodes.dev',
        logo: {
            '@type': 'ImageObject',
            url: 'https://nextmin.gscodes.dev/logo.svg',
        },
    },
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate:
                'https://nextmin.gscodes.dev/docs?search={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
    },
};

const jsonLdSoftware = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'NextMin',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Node.js, Browser, Linux, macOS, Windows',
    softwareVersion: '2.0.3',
    description:
        'Lightweight, extensible framework for auto-generating admin panels, CRUD UIs, and production-ready REST APIs from TypeScript schemas.',
    url: 'https://nextmin.gscodes.dev',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    license: 'https://opensource.org/licenses/MIT',
    author: {
        '@type': 'Organization',
        name: 'GS Codes AI',
        url: 'https://gscodes.dev',
    },
    keywords:
        'Next.js admin panel, React admin dashboard framework, REST API generator, Node.js CRUD, schema to API, Refine alternative, React Admin alternative, multi-database admin',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" dir="ltr">
            <Head>
                <link rel="shortcut icon" href="/favicon.svg" />
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
                />
            </Head>
            <body className="antialiased">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLdWebsite),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLdSoftware),
                    }}
                />
                {children}
            </body>
        </html>
    );
}
