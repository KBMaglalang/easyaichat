import type { Metadata } from 'next';
import './globals.css';
import { getServerSession } from 'next-auth';
import { Roboto } from 'next/font/google';

// components
import SessionProvider from '@/providers/SessionProvider';
import { ClientProvider } from '@/providers';
import { StateProvider } from '@/context/stateContext';

// context or store

// constants or functions
import { authOptions } from '@/config/auth/auth';
import { WEBSITE_TITLE, WEBSITE_DESCRIPTION } from '@/constants';

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: WEBSITE_TITLE,
  description: WEBSITE_DESCRIPTION,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${roboto.variable}  font-sans`}>
        <SessionProvider>
          <StateProvider>
            <div className="flex h-screen w-screen flex-col">
              {/* client provider - notification  */}
              <ClientProvider />

              {children}
            </div>
          </StateProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

/*
  ! note: getServerSession is still experimental
*/
