import type { Metadata } from 'next';
import { Geist, Geist_Mono, DM_Sans, Raleway } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/hooks/auth-provider';
import { Toaster } from '@/components/ui/sonner';
import { Suspense } from 'react';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar/navbar';
import { ThemeProvider } from '@/components/theme-provider';
const ralewayHeading = Raleway({
  subsets: ['latin'],
  variable: '--font-heading',
});

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export const metadata: Metadata = {
  title: {
    default: 'APPLI-TRACT | Smart Job Application Tracker',
    template: '%s | APPLI-TRACT',
  },
  description:
    'Track your job applications, automate interview updates with AI inbox monitoring, and streamline your career growth with APPLI-TRACT.',

  keywords: [
    'Job Tracker',
    'Application Tracking System',
    'AI Job Assistant',
    'Gmail Monitoring',
    'Interview Scheduler',
    'Career Dashboard',
    'APPLI-TRACT',
  ],

  authors: [{ name: 'Md. Forhad Reza', url: APP_URL }],
  creator: 'Md. Forhad Reza',
  publisher: 'APPLI-TRACT',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    title: 'APPLI-TRACT | Smart Job Application Tracker',
    description:
      'Track your job applications, automate interview updates with AI inbox monitoring, and streamline your career growth.',
    siteName: 'APPLI-TRACT',
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'APPLI-TRACT Dashboard Preview',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'APPLI-TRACT | Smart Job Application Tracker',
    description:
      'Track your job applications, automate interview updates with AI inbox monitoring.',
    images: [`${APP_URL}/og-image.png`],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: 'S-64WbJYBCx7CWlAd0rG5t1YYE24ow4AL1W-gOdZoQA',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        dmSans.variable,
        ralewayHeading.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-zinc-100 dark:bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <Navbar /> */}
          <AuthProvider>
            <TooltipProvider>
              <Toaster position="top-center" />
              <main className="flex-1 flex flex-col">
                <Suspense fallback={<h1>Loading...</h1>}>
                  <Navbar />
                </Suspense>
                {children}
                <Suspense fallback={<h1>Loading...</h1>}>
                  <Footer />
                </Suspense>
              </main>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
