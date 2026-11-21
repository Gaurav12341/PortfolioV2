import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { BASE_URL, OG_IMAGE } from "@/lib/constants";
import LenisWrapper from "@/providers/lenis-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import FooterSection from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import StructuredData from "@/components/common/structured-data";
import Analytics from "@/components/common/analytics";
import ConsoleLog from "@/components/common/console-log";
import CustomCursor from "@/components/ui/custom-cursor";
import { IntroGate, introBootScript } from "@/components/common/intro-gate";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3e9e6" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a0d" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Gaurav Raj - Backend Software Engineer & Distributed Systems",
    template: "%s | Gaurav Raj",
  },
  description:
    "Backend Software Engineer building distributed systems and cloud platforms — with hands-on experience shipping production AI/RAG systems on top of them.",
  keywords: [
    "Gaurav Raj",
    "Backend Software Engineer",
    "Distributed Systems",
    "Cloud Platforms",
    "Applied AI",
    "RAG",
    "Microservices",
    "Kafka",
    "FastAPI",
    ".NET",
    "Software Engineer Bengaluru",
  ],
  authors: [{ name: "Gaurav Raj" }],
  creator: "Gaurav Raj",
  publisher: "Gaurav Raj",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    title: "Gaurav Raj - Backend Software Engineer & Distributed Systems",
    description:
      "Software Engineer at Honeywell building microservices, deployment platforms, and production AI/RAG systems across enterprise and air-gapped environments.",
    siteName: "Gaurav Raj",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Gaurav Raj - Portfolio preview",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaurav Raj - Backend Software Engineer & Distributed Systems",
    description:
      "Software Engineer at Honeywell building microservices, deployment platforms, and production AI/RAG systems across enterprise and air-gapped environments.",
    // TODO: add your Twitter/X handle here once you have one, e.g. creator: "@yourhandle"
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Gaurav Raj - Portfolio preview",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  // TODO: add Google Search Console verification once you register the site
  // verification: {
  //   google: "your-google-verification-code",
  // },
  alternates: {
    canonical: BASE_URL,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // suppressHydrationWarning: next-themes adds the `class="dark"` +
  // `color-scheme` style to <html> on the client, which the server can't know
  // about — this tells React to ignore that expected attribute mismatch.
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        {/* Decides before first paint whether the intro plays (once per session) */}
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
        <StructuredData />
        <Analytics />
      </head>
      <body className="antialiased" id="top">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-brand-fg"
        >
          Skip to content
        </a>
        <ConsoleLog />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CustomCursor />
          <IntroGate />
          <LenisWrapper>
            <Navbar />
            <main id="main">{children}</main>
            <FooterSection />
          </LenisWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
