import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { ToastProvider } from "@/lib/toast";
import SmoothScroll from "@/components/SmoothScroll";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FloatingCart from "@/components/FloatingCart";
import RouteLoader from "@/components/RouteLoader";
import PullToRefresh from "@/components/PullToRefresh";
import { getCategories } from "@/lib/catalog";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://neosafetysupplies.com"),
  title: {
    default: "NEO Safety Supplies Ltd | PPE, Workwear & Uniforms in Kenya",
    template: "%s | NEO Safety Supplies Ltd",
  },
  description:
    "NEO Safety Supplies Ltd is Kenya's trusted supplier of certified PPE, workwear, branded uniforms, safety signs and embroidery/printing services. Delivering safety across Kenya.",
  keywords: [
    "PPE Kenya", "workwear Kenya", "safety equipment Kenya", "uniforms Kenya", "branded uniforms Nairobi",
    "safety boots Kenya", "hard hats Kenya", "reflective jackets Kenya", "coveralls Kenya", "industrial uniforms Kenya",
    "embroidery Kenya", "DTF printing Kenya", "screen printing Kenya", "safety signs Kenya", "corporate uniforms Kenya",
    "NEO Safety Supplies", "personal protective equipment Kenya", "construction safety Kenya", "mining PPE Kenya"
  ],
  openGraph: {
    title: "NEO Safety Supplies Ltd | PPE, Workwear & Uniforms in Kenya",
    description: "Kenya's trusted supplier of certified PPE, workwear, branded uniforms and safety signs. Your safety, Our responsibility.",
    type: "website",
    locale: "en_KE",
    siteName: "NEO Safety Supplies Ltd",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEO Safety Supplies Ltd | PPE, Workwear & Uniforms in Kenya",
    description: "Kenya's trusted supplier of certified PPE, workwear, branded uniforms and safety signs.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://neosafetysupplies.com",
  },
  icons: {
    icon: "/icon.png?v=3",
    shortcut: "/favicon.png?v=3",
    apple: "/apple-icon.png?v=3",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = (headers().get("x-pathname") || "").startsWith("/admin");
  const categories = isAdmin ? [] : await getCategories();
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <body className="font-sans">
        {isAdmin ? (
          children
        ) : (
          <ToastProvider>
          <CartProvider>
            <WishlistProvider>
            <RouteLoader />
            <Preloader />
            <SmoothScroll>
              <TopBar />
              <Header />
              <NavBar categories={categories} />
              <PullToRefresh>{children}</PullToRefresh>
              <Footer />
            </SmoothScroll>
            <AutoReveal />
            <FloatingWhatsApp />
            <FloatingCart />
            </WishlistProvider>
          </CartProvider>
          </ToastProvider>
        )}
      </body>
    </html>
  );
}
