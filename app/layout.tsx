import './globals.css';
export const metadata = { title: 'autoseuil-tracker-de-seuils-auto-entrepr', description: 'AutoSeuil — Tracker de Seuils Auto-Entrepreneur' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-950 text-white min-h-screen">{children}</body>
    </html>
  );
}
