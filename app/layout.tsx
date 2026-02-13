import "../styles/globals.css";
import { inter } from "./fonts";

export const metadata = {
  title: "BookMarkr",
  description: "Creative Bookmark Manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
