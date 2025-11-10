import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { NavBar } from "@/components/NavBar";
import { Attribution } from "@/components/Attribution";

export const metadata: Metadata = {
  title: "AI Travel Itinerary Generator",
  description: "Generate personalized travel itineraries with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow">
              {children}
            </main>
            <Attribution />
          </div>
        </Providers>
      </body>
    </html>
  );
}

