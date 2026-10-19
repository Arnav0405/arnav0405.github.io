import type { Metadata } from "next";
import Link from "next/link";
import { Newsreader, Caveat } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BookmarkNav } from "@/components/BookmarkNav";
import { Colophon } from "@/components/Colophon";
import { MusicToggle } from "@/components/MusicToggle";
import { NotebookMotion } from "@/components/NotebookMotion";
import { AnimatedA } from "@/components/AnimatedA";
const newsreader = Newsreader({ subsets: ["latin"], axes: ["opsz"], style: ["normal", "italic"], variable: "--font-newsreader" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
export const metadata: Metadata = {
  title: { default: "Arnav Waghdhare — Field Notes", template: "%s · Arnav Waghdhare" },
  description: "The field notes of Arnav Waghdhare — computer engineer, machine learning and full stack. A notebook of things observed, learned, and built.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth" className={`${newsreader.variable} ${caveat.variable} antialiased`} suppressHydrationWarning>
    <body className="font-serif">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <NotebookMotion>
          <a className="skip-link" href="#main-content">Skip to notebook</a>
          <header className="site-header">
            <Link href="/" className="wordmark" aria-label="Arnav Waghdhare, notebook cover"><span className="wordmark-mark" aria-hidden="true"><AnimatedA loop size={48} /></span><span className="micro">THE PERSONAL NOTEBOOK<br />OF ARNAV WAGHDHARE</span></Link>
            <div className="toolbar" role="group" aria-label="Notebook settings"><MusicToggle /><ThemeToggle /></div>
          </header>
          <div className="notebook-shell"><BookmarkNav /><main id="main-content" tabIndex={-1}>{children}</main><Colophon /></div>
        </NotebookMotion>
      </ThemeProvider>
    </body>
  </html>;
}
