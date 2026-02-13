import { Fredoka, Inter } from "next/font/google";
import { Playfair_Display } from "next/font/google";
export const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const inter = Inter({
  subsets: ["latin"],
});


export const vintageFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});
