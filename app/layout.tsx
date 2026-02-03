import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { SmoothScrollProvider } from "@/ui/providers/smooth-scroll-provider";
import { SoundProvider } from "@/ui/providers/sound-provider";
import { Nav } from "@/ui/nav";
import { BackgroundStars } from "@/ui/background";
import { Footer } from "@/ui/footer";
import { CustomCursor } from "@/ui/custom-cursor";
import { OpeningAnimation } from "@/ui/opening-animation";

export const metadata: Metadata = {
  title: "Bharat Gupta — Full‑Stack Developer Portfolio",
  description:
    "Cinematic, minimal portfolio of Bharat Gupta, a full‑stack developer crafting clean, performant web experiences.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Bharat Gupta — Full‑Stack Developer",
    description:
      "Cinematic, minimal portfolio of a full‑stack developer crafting clean, performant web experiences.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SmoothScrollProvider>
          <SoundProvider>
            <CustomCursor />
            <BackgroundStars />
            <OpeningAnimation>
              <Nav />
              {children}
              <Footer />
            </OpeningAnimation>
          </SoundProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

