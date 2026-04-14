import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "LockBox",
    template: "%s",
  },
  description: "Encrypt and hash text using common algorithms with LockBox.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
