import Link from "next/link";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/lease-up-services", label: "Lease-Up" },
  { href: "/buy-with-us", label: "Buy With Us" },
  { href: "/list-with-us", label: "List With Us" },
  { href: "/buy-with-us#property-search", label: "Property Search" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

const landSearchUrl = "https://kwland.com/";

function Brand() {
  return (
    <Link className="brand" href="/" aria-label="IVISION Realty home">
      <span className="brandMark">I</span>
      <span><strong>IVISION</strong><small>REALTY CORP</small></span>
    </Link>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="topBar">
        <div className="shell topBarInner">
          <span>Real estate solutions for California</span>
          <div><a href="tel:+18884519328;ext=701">(888) 451-9328 ext. 701</a><a href="mailto:info@ivisionrealtycorp.com">info@ivisionrealtycorp.com</a></div>
        </div>
      </div>
      <header className="siteHeader">
        <div className="shell headerInner">
          <Brand />
          <nav className="desktopNav" aria-label="Main navigation">
            {nav.filter((item) => !["Buy With Us", "List With Us"].includes(item.label)).map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
            <a href={landSearchUrl} rel="noopener noreferrer" target="_blank">Land Search</a>
          </nav>
          <Link className="headerCta" href="/appointment">Book appointment <span>↗</span></Link>
          <details className="mobileMenu">
            <summary aria-label="Open navigation">Menu</summary>
            <nav aria-label="Mobile navigation">
              {nav.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
              <a href={landSearchUrl} rel="noopener noreferrer" target="_blank">Land Search</a>
              <Link href="/appointment">Appointment Booking</Link>
            </nav>
          </details>
        </div>
      </header>
      {children}
      <footer className="siteFooter">
        <div className="shell footerMain">
          <div className="footerBrand">
            <Brand />
            <p>Real estate expertise, property support, and practical guidance for the move ahead.</p>
          </div>
          <div><h3>Explore</h3>{nav.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}<a href={landSearchUrl} rel="noopener noreferrer" target="_blank">Land Search</a><Link href="/appointment">Appointment Booking</Link></div>
          <div><h3>Visit</h3><address>2922 Crenshaw Boulevard<br />Los Angeles, CA 90016</address></div>
          <div><h3>Connect</h3><a href="tel:+18884519328;ext=701">(888) 451-9328 ext. 701</a><a href="mailto:info@ivisionrealtycorp.com">info@ivisionrealtycorp.com</a></div>
        </div>
        <div className="shell footerBottom">
          <span>© {new Date().getFullYear()} IVISION Realty Corp. All rights reserved.</span>
          <span><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link> · <Link href="/disclosures">Disclosures</Link><br />Services, availability, and terms are subject to change. Real estate funding information is provided by New Wide Lending and is subject to lender approval and eligibility.</span>
        </div>
      </footer>
    </>
  );
}
