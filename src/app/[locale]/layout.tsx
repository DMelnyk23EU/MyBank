import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.scss";
import TopNav from "../components/TopNav/TopNav";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ReduxProvider } from "@/store/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyBank",
  description: "Manage your accounts with ease",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {

  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextIntlClientProvider>
          <ReduxProvider>
            <TopNav isLoggedIn={false} />
            {children}
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html >
  );
}
