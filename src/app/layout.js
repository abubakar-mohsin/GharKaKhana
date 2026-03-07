import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { SessionProvider } from 'next-auth/react';

export const metadata = {
  title: 'Ghar Ka Khana',
  description: 'Family meal planner with role-based access control',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
