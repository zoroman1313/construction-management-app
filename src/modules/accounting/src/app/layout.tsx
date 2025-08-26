import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contractor Accounting",
  description: "Standalone accounting module.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
