import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const rounded = localFont({
  src: [
    {
      path: "../reference/fonts/SF-Pro-Rounded-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../reference/fonts/SF-Pro-Rounded-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../reference/fonts/SF-Pro-Rounded-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../reference/fonts/SF-Pro-Rounded-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../reference/fonts/SF-Pro-Rounded-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../reference/fonts/SF-Pro-Rounded-Heavy.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-rounded",
});

export const metadata: Metadata = {
  title: "BCM Daily Confessions",
  description: "A Believers' Camp Meeting confession experience about the blood of Jesus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={rounded.variable}>
      <body>{children}</body>
    </html>
  );
}
