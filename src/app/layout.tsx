import type { Metadata } from "next";
import { Inter, VT323, Jersey_10 } from "next/font/google";
import "./globals.css";
import { IPodShell } from "@/components/IPodShell";
import { TopBar } from "@/components/TopBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PlayerProvider } from "@/context/PlayerContext";
import { PlayerPopup } from "@/components/PlayerPopup";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
});

const jersey10 = Jersey_10({
  weight: "400",
  variable: "--font-jersey10",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vinyl - Retro Music Player",
  description: "A retro iPod style music player",
  manifest: "/manifest.json",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${vt323.variable} ${jersey10.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-retro-bg text-retro-text selection:bg-retro-accent selection:text-white">
        <ThemeProvider>
          <PlayerProvider>
            <ServiceWorkerRegister />
            <IPodShell>
              <div className="flex flex-col h-full relative">
                <TopBar />
                <div id="ipod-screen-scroll-container" className="flex-1 overflow-y-auto no-scrollbar relative">
                  {children}
                </div>
                <PlayerPopup />
              </div>
            </IPodShell>
          </PlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
