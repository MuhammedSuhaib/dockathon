import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpecKit-Plus Auth Server",
  description: "Authentication server for SpecKit-Plus project",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialias">
        {children}
      </body>
    </html>
  );
}

export const runtime = "nodejs";
