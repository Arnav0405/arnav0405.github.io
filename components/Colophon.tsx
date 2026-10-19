import { site } from "@/content/site";
export function Colophon() {
  return <footer className="site-footer">
    <p className="micro">DRAWN WITH CODE. FILLED WITH CURIOSITY.<br />{site.location}, India · {site.edition}</p>
    <div className="footer-credit"><p>Set in Newsreader &amp; Caveat. Bound with Next.js.</p><p style={{ marginTop: 5 }}>Music: <a href={site.music}>Bluerose (Twilight Ver.) — Hoshimachi Suisei ↗</a></p></div>
  </footer>;
}
