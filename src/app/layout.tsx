import type { Metadata } from 'next';
import { Libre_Baskerville, Nunito } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import './globals.css';

const serifFont = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const sansFont = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Reading Journal',
  description: 'A whimsical journal to capture the feeling of your reading adventures',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${serifFont.variable} ${sansFont.variable} antialiased min-h-screen`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
