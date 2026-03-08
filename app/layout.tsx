import { Head } from 'nextra/components';
import './globals.css';
import config from '@/config';

export const metadata = config.metadata;

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
                {children}
            </body>
        </html>
    );
}
