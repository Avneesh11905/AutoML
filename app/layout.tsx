import type { Metadata } from "next";
import "./globals.css";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';


export const metadata : Metadata  = {
  title: 'AutoML',
  description: 'I have followed setup instructions carefully',
};

export default function RootLayout({children,}: { children: React.ReactNode;}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
          <MantineProvider defaultColorScheme='dark' >
            <Notifications className="text-xl"/>
            <ModalsProvider>
              {children}
            </ModalsProvider>
          </MantineProvider>
      </body>
    </html>
  );
}