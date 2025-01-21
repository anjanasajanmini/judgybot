import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import Navigation from '@/components/Navigation';
import { inter } from '@/lib/fonts';

export const metadata = {
  title: 'JudgyBot - Your Personal Judgment Zone',
  description: 'When you need more than a gut feeling',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1">
                {children}
              </main>
            </div>
            <Toaster 
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
