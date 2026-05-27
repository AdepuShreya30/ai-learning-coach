import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Learning Coach',
  description: 'Personalized learning system powered by AI',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-dark text-white antialiased">
        {children}
      </body>
    </html>
  );
}
