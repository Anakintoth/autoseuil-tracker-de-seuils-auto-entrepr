import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SeuilNet — Maîtrisez vos seuils, pilotez votre activité.',
  description: 'Maîtrisez vos seuils, pilotez votre activité.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'SeuilNet',
    description: 'Maîtrisez vos seuils, pilotez votre activité.',
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
