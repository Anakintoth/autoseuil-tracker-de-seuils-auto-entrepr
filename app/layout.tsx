import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Autoseuil Tracker De — La solution simple pour les pros',
  description: 'La solution simple pour les pros',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Autoseuil Tracker De',
    description: 'La solution simple pour les pros',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.className}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
