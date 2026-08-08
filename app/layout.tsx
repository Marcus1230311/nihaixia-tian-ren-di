import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "中醫 · Traditional Chinese Medicine", template: "%s | 中醫知識圖譜" },
  description: "以經典、經絡、方藥與可追溯來源構成的中醫互動知識體驗。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body><SiteHeader /><main>{children}</main><footer className="site-footer">中醫 · TRADITIONAL CHINESE MEDICINE — 經典、課程與知識條目</footer></body></html>;
}
