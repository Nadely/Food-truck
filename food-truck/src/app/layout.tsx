import './globals.css';
import Header from './components/header';
import Footer from './components/footer';
import CategorieNav from './components/categorienav';
import Nav from './components/nav';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Votre Application',
  description: 'Description de votre application',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen">
        <header>
          <Header />
        </header>
        
        <div className="flex flex-row">
          <aside className="flex flex-col items-center justify-center left-0 w-[200px] h-full mt-20">
            <CategorieNav />
          </aside>

          <main className="flex-grow">
            <Nav />
            {children}
          </main>
        </div>

        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
