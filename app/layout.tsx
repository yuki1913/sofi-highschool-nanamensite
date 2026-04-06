import type { Metadata } from "next";
import {
  Noto_Sans_JP,
  Zen_Maru_Gothic,
  Montserrat,
} from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const zenMaruGothic = Zen_Maru_Gothic({
  variable: "--font-zen-maru-gothic",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});


export const metadata: Metadata = {
  title: "ナナメン紹介 | SOFI高等学院",
  description:
    "SOFI高等学院のナナメン（スタッフ・教員）を紹介するページです。兵庫県の新しい高校、SOFI高等学院。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} ${zenMaruGothic.variable} ${montserrat.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
