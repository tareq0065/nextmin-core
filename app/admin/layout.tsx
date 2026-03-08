'use client';

import '@airoom/nextmin-react/styles.css';
import { NextMinProvider } from '@airoom/nextmin-react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-white text-neutral-900">
            <NextMinProvider
                apiUrl="/rest"
                apiKey={process.env.NEXT_PUBLIC_NEXTMIN_API_KEY || 'playground_key'}
                navigate={router.push}
            >
                {children}
            </NextMinProvider>
        </div>
    );
}
