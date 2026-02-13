import "../styles/globals.css";
import { inter } from "./fonts";
import { ReactNode } from "react";

export const metadata = {
  title: "BookMarkr",
  description: "Creative Bookmark Manager",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

