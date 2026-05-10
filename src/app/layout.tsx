import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StackAudit",
  description:
    "Free AI spend auditor for startups. Benchmark your stack and find savings in minutes.",
  openGraph: {
    title: "StackAudit",
    description:
      "Free AI spend auditor for startups. Benchmark your stack and find savings in minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white">{children}</body>
    </html>
  );
}

