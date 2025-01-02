import type { Metadata } from "next";
import "./globals.css";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import ThemeProvider from '@/components/ThemeProvider';
import { TableContextProvider } from "@/components/contexts/TableContext";


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
        <ThemeProvider>
          <Notifications className="text-xl"/>
          <ModalsProvider>
          <TableContextProvider>
          {children}
          </TableContextProvider>
          </ModalsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}