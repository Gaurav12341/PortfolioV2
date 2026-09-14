import type { Metadata } from "next";
import { Poppins, Cormorant_Garamond } from "next/font/google";
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

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

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
  icons: {
    icon: [
      { url: "/icon" },
      { url: "/md-red-logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/md-red-logo.svg",
    apple: "/md-red-logo.svg",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ImageKit serves the 47 AboutScrollSection frames (crossOrigin) */}
        <link
          rel="preconnect"
          href="https://ik.imagekit.io"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />

        <StructuredData />
        <Analytics />
      </head>
      <body
        className={`${poppins.variable} ${cormorantGaramond.variable} antialiased  mx-auto `}
      >
        <CustomCursor />
        <ConsoleLog />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LenisWrapper>
            <Navbar />
            {children}
            <FooterSection />
            {/* <FloatingDockDemo /> */}
          </LenisWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
