import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#050505",
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://harsh-raj001.github.io/NEXUS-My-Product-Portfolio"),
  title: "Harsh Raj | Product Manager Portfolio",
  description: "An unforgettable 3D cinematic storytelling experience representing the career journey of aspiring Product Manager Harsh Raj. Google Doodle charm, Pixar storytelling, NASA space exploration, Unreal Engine 5 lighting, and Apple minimalism.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Harsh Raj | Product Manager Portfolio",
    description: "This person understands products, solves problems, and builds meaningful experiences.",
    type: "website",
    url: "https://harsh-raj001.github.io/NEXUS-My-Product-Portfolio",
    siteName: "Project Odyssey",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harsh Raj | Product Manager Portfolio",
    description: "An interactive 3D cinematic portfolio showcasing product management expertise.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Project Odyssey",
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} ${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-cyan-500 selection:text-black overflow-hidden">
        {/* Accessibility: Skip-to-content link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-cyan-500 focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}

