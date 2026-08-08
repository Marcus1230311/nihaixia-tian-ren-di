import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "倪海廈醫道傳習網 · 知識研讀", template: "%s | 倪海廈醫道傳習網" },
  description: "沿著天紀、人紀、地紀研讀課程、經典與彼此相連的知識條目。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body><SiteHeader /><main>{children}</main><footer className="site-footer">天紀 · 人紀 · 地紀 — 經典、課程與知識條目</footer></body></html>;
}
