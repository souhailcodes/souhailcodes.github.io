import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - Souhail Benlhachemi",
    default: "Souhail Benlhachemi",
  },
  description: "Souhail Benlhachemi's personal portfolio showcasing projects, skills, and contact information.",
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
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <head>
        <meta name="google-site-verification" content="0lj7KAPWRdFLw2tAiZd6rQfk9ZnUd4HIuL25ej_mgIc" />
      </head>
      <body className="max-w-5xl mx-auto flex flex-col min-h-screen bg-background text-foreground px-4">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 w-full py-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
