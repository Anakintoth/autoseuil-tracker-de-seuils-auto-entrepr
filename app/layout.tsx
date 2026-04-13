import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SeuilNet — Vos seuils fiscaux, toujours sous contrôle',
  description: 'Vos seuils fiscaux, toujours sous contrôle',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'SeuilNet',
    description: 'Vos seuils fiscaux, toujours sous contrôle',
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
