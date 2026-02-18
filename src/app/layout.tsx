import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "adMaker — 카카오모먼트 AI 광고 배너 생성",
  description:
    "제품 사진을 업로드하면 카카오모먼트 광고 규격에 맞는 배너 이미지를 AI로 자동 생성합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <header className="border-b">
          <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
            <a href="/" className="text-lg font-bold tracking-tight">
              adMaker
            </a>
            <span className="ml-2 rounded bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
              AI
            </span>
            <nav className="ml-8 flex gap-4 text-sm text-muted-foreground">
              <a href="/bizboard" className="hover:text-foreground transition-colors">
                비즈보드
              </a>
              <a href="/display" className="hover:text-foreground transition-colors">
                디스플레이
              </a>
              <a href="/message" className="hover:text-foreground transition-colors">
                메시지
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
