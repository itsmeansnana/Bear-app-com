// apps/web/app/layout.tsx
import "../styles/globals.css";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Bear App" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Script Telegram WebApp */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}

