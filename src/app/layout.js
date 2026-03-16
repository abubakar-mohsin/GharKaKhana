import './globals.css';
import { Plus_Jakarta_Sans, Noto_Nastaliq_Urdu } from 'next/font/google';
import QueryProvider from '@/providers/QueryProvider';
import { SessionProvider } from 'next-auth/react';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '600'],
  variable: '--font-urdu',
  display: 'swap',
});

export const metadata = {
  title: 'Ghar Ka Khana',
  description: 'Family meal planner with role-based access control',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${notoNastaliq.variable}`}>
      <body className="font-sans">
        <SessionProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
