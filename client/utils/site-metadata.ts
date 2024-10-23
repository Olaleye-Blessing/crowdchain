import type { Metadata } from "next";

export const appDescription =
  "Infrastructure designed to open new opportunities for creators, backers, and the entire crowdfunding ecosystem.";

export const metadata: Metadata = {
  title: "Decentralized Crowdfunding — Crowdchain",
  description: appDescription,
  keywords: ["Decentralized", "Crowdfunding"],
  authors: [
    { name: "Olaleye Blessing" },
    { name: "Olaleye Blessing", url: "https://www.blessingolaleye.xyz" },
  ],
  creator: "Olaleye Blessing",
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
