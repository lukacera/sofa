'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth') || pathname === '/login';

  return (
    <>
      {!isAuthPage && <Header />}
      <main className={`flex-grow ${!isAuthPage ? 'pb-16' : ''}`}>{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}