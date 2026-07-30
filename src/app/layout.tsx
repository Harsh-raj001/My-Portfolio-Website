import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
  title: "Harsh Raj | Product Manager Portfolio",
  description: "An unforgettable 3D cinematic storytelling experience representing the career journey of aspiring Product Manager Harsh Raj. Google Doodle charm, Pixar storytelling, NASA space exploration, Unreal Engine 5 lighting, and Apple minimalism.",
  openGraph: {
    title: "Product Manager Portfolio",
    description: "This person understands products, solves problems, and builds meaningful experiences.",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Project Odyssey",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-cyan-500 selection:text-black overflow-hidden">{children}</body>
    </html>
  );
}
