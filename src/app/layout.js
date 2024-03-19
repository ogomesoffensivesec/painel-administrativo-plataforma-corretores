import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth.context";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { DataProvider } from "@/contexts/data.context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
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
