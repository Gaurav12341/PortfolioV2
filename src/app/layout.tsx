import type { Metadata, Viewport } from "next";
import { brandMono, brandSans, noteFont } from "./fonts";
import "./globals.css";
import { BASE_URL } from "@/lib/constants";
import LenisWrapper from "@/providers/lenis-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { AppToaster } from "@/components/common/app-toaster";
import FooterSection from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import StructuredData from "@/components/common/structured-data";
import Analytics from "@/components/common/analytics";
import ConsoleLog from "@/components/common/console-log";
import CustomCursor from "@/components/ui/custom-cursor";
import { IntroGate, introBootScript } from "@/components/common/intro-gate";

/** Dark is the default theme, so the browser UI matches the dark background everywhere. */
export const viewport: Viewport = {
  themeColor: "#0b0a0d",
};

/** PHASES.md Phase 8. "·" instead of an em-dash: none in visible copy. */
const TITLE = "Gaurav Raj · Backend & AI Engineer";
const DESCRIPTION =
  "Backend & AI Engineer at Honeywell, Bengaluru. I build distributed systems and RAG pipelines that hold up under load: .NET, Kafka, Kubernetes, PostgreSQL.";

/**
 * Share images come from app/opengraph-image.tsx and app/twitter-image.tsx
 * (next/og, 1200×630); Next adds the og:image / twitter:image tags itself.
 */
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: TITLE, template: "%s · Gaurav Raj" },
  description: DESCRIPTION,
  applicationName: "Gaurav Raj",
  keywords: [
    "Gaurav Raj",
    "Backend Engineer",
    "AI Engineer",
    "Full-stack Engineer",
    "Software Engineer Bengaluru",
    "Distributed Systems",
    "RAG",
    "Kafka",
    "Kubernetes",
    ".NET",
    "Honeywell",
  ],
  authors: [{ name: "Gaurav Raj", url: BASE_URL }],
  creator: "Gaurav Raj",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "profile",
    firstName: "Gaurav",
    lastName: "Raj",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Gaurav Raj",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  alternates: { canonical: "/" },
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
      className={`${brandSans.variable} ${brandMono.variable} ${noteFont.variable}`}
    >
      <head>
        {/* Decides before first paint whether the intro plays (once per session) */}
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
        <StructuredData />
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
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <CustomCursor />
          <IntroGate />
          <LenisWrapper>
            <Navbar />
            <main id="main">{children}</main>
            <FooterSection />
          </LenisWrapper>
          <AppToaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
