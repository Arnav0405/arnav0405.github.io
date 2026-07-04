import type { Metadata } from "next";
import { Lora, Caveat } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: { default: "Arnav Waghdhare", template: "%s · Arnav Waghdhare" },
  description:
    "The collected works of Arnav Waghdhare — computer engineer, machine learning and full stack.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${caveat.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-desk font-serif text-ink">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="relative z-10 mx-auto w-full max-w-3xl px-4 py-10 sm:py-16">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
