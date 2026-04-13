import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'SeuilNet — Maîtrisez vos seuils, pilotez votre activité',
  description: 'SeuilNet surveille automatiquement vos seuils de TVA et de chiffre d\'affaires pour auto-entrepreneurs. Alertes intelligentes, projections annuelles, export comptable. Seuils 2026 intégrés.',
  keywords: ['auto-entrepreneur', 'seuil TVA', 'chiffre d\'affaires', 'micro-BNC', 'micro-BIC', 'franchise TVA', 'gestion fiscale'],
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'SeuilNet — Maîtrisez vos seuils fiscaux',
    description: 'Surveillez automatiquement vos seuils de TVA et CA en tant qu\'auto-entrepreneur. Alertes, projections, export. Gratuit pour commencer.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'SeuilNet',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SeuilNet — Tracker de seuils auto-entrepreneur',
    description: 'Ne dépassez plus jamais un seuil fiscal sans le savoir.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className={`${inter.className} min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
