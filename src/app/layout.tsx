import './globals.css';
import '@integration-app/react/styles.css'
import { IntegrationWrapper } from '@/components/IntegrationWrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'CRM Integration Demo' };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex items-center justify-center">
        <IntegrationWrapper>{children}</IntegrationWrapper>
      </body>
    </html>
  );
}
