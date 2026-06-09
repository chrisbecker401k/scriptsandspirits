import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scripts & Spirits | Men's Bible Study",
  description:
    "A men's Bible study gathering in cocktail bars for honest conversation about Scripture, theology, and the Christian life.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
