/**
 * Root layout — Next.js 15 App Router.
 * Charge le store d'auth globalement et applique le dark mode Discord.
 */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nicecord',
  description: 'A Discord clone built with an agent-supervised architecture.',
  themeColor: '#2B2D31',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-bg-default text-text-primary antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
