import type { Metadata } from "next";

const siteUrl = `https://crowdchain-two.vercel.app/`;

export const appDescription =
  "Revolutionizing crowdfunding through blockchain technology. Empower creators, protect backers, and unlock new possibilities in decentralized fundraising.";

export const metadata: Metadata = {
  // metadataBase: new URL("https://www.crowdchain.xyz"),
  title: {
    default: "Decentralized Crowdfunding — Crowdchain",
    template: "%s | Crowdchain",
  },
  description: appDescription,
  keywords: [
    "Decentralized Crowdfunding",
    "Blockchain Funding",
    "Web3 Fundraising",
    "Creator Economy",
    "Smart Contract Crowdfunding",
    "Crypto Funding",
    "Transparent Fundraising",
    "Decentralized Finance",
  ],
  authors: [
    { name: "Blessing Olaleye", url: "https://www.blessingolaleye.xyz" },
  ],
  creator: "Blessing Olaleye",
  publisher: "Blessing Olaleye",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Decentralized Crowdfunding — Crowdchain",
    description: appDescription,
    siteName: "Crowdchain",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 1200,
        height: 630,
        alt: "Crowdchain - Decentralized Crowdfunding Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Decentralized Crowdfunding — Crowdchain",
    description: appDescription,
    creator: "@_jongbo",
    images: ["/android-chrome-512x512.png"],
  },

  icons: {
    other: [
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
};
