import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth.context";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { DataProvider } from "@/contexts/data.context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CorretaMAIS",
  description: "Plataforma administrativa de imóveis",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">

      <head>
        <link rel="icon" href='/favicon.ico' sizes="any" />
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body className={inter.className}>
        <main>
          <AuthProvider>
            <DataProvider>
              <SpeedInsights />
              {children}
            </DataProvider>

          </AuthProvider>

          <Toaster />
        </main>
      </body>
    </html>
  );
}
