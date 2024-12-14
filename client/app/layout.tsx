import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/footer";
import Providers from "@/components/providers";
import WrongNetworkAlert from "./wrong-network-alert";

const inter = Inter({ subsets: ["latin"] });

export { metadata } from "@/utils/site-metadata";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <WrongNetworkAlert />
          {children}
          <Toaster />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
