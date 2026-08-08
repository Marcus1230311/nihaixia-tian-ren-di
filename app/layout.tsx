import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "倪海廈醫道傳習網 · V2 知識平台", template: "%s | 倪海廈醫道傳習網" },
  description: "從已驗收的天紀、人紀、地紀靜態內容逐步遷移而成的可搜尋、可交叉引用知識平台。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body><SiteHeader /><main>{children}</main><footer className="site-footer">V2 分批遷移中 · V1 內容基線保持可核對</footer></body></html>;
}
