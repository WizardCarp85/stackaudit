import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StackAudit — Find Out If You're Overpaying for AI Tools",
  description:
    "StackAudit is the free AI spend auditor for startups. Benchmark your Cursor, Claude, ChatGPT, and other AI tool costs against companies like yours — and find savings in minutes.",
  openGraph: {
    title: "StackAudit — The Mint for AI Tool Spend",
    description:
      "Stop overpaying for AI tools. Get a free audit of your stack in under 5 minutes.",
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

