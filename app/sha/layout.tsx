import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SHA | LockBox",
};

export default function SHALayout({ children }: { children: React.ReactNode }) {
  return children;
}
