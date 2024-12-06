import './globals.css';
import Header from './components/header';
import Footer from './components/footer';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Votre Application',
  description: 'Description de votre application',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
