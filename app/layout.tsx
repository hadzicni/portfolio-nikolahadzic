import type { Metadata } from 'next';
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from 'next/font/google';

import { BootScreen } from '@/components/boot-screen';
import { CommandPalette } from '@/components/command-palette';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { profile } from '@/lib/content';
import Script from 'next/script';
import './globals.css';
import { ReactNode } from 'react';

const sans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const display = Bricolage_Grotesque({
  variable: '--font-display',
  subsets: ['latin'],
});

const mono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

const title = `${profile.name} — ${profile.role}`;
const description = `${profile.role} in ${profile.location}. ${profile.intro}`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.website),
  title: {
    default: title,
    template: `%s — ${profile.name}`,
  },
  description,
  // The image itself comes from `app/opengraph-image.tsx`.
  openGraph: {
    type: 'website',
    url: '/',
    siteName: profile.name,
    locale: 'en_US',
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  keywords: [
    profile.name,
    'Software Developer',
    'Full Stack Developer',
    'TypeScript',
    'Next.js',
    'Spring Boot',
    'Basel',
    'Switzerland',
  ],
  authors: [{ name: profile.name, url: profile.website }],
  creator: profile.name,
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col pb-9">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <BootScreen />
          <TooltipProvider>{children}</TooltipProvider>
          <CommandPalette />
          <Toaster position="bottom-right" />
        </ThemeProvider>

        <Script
          src="https://analytics.nikolahadzic.dev/script.js"
          data-website-id="00a09483-5987-4444-97a4-cb3594379b90"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
