import { LeadSubmitForm } from "../components/lead-submit-form";
import type { Metadata } from "next";
import { breadcrumbSchema, pageOpenGraph, pageTwitter, webPageSchema } from "../seo";
import { SiteShell } from "../site-shell";
import { StructuredData } from "../structured-data";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Our Los Angeles Real Estate Team",
  description: "Contact IVISION Realty Corp in Los Angeles about real estate representation, property management, property searches, or funding resources.",
  alternates: { canonical: "/contact" },
  openGraph: pageOpenGraph(
    "Contact IVISION Realty Corp",
    "Start a conversation with our Los Angeles real estate and property-management team.",
    "/contact",
  ),
  twitter: pageTwitter(
    "Contact IVISION Realty Corp",
    "Start a conversation with our Los Angeles real estate and property-management team.",
  ),
};

export default function ContactPage() {
  return (
    <SiteShell>
      <StructuredData data={[
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]),
        webPageSchema({ path: "/contact", name: "Contact IVISION Realty Corp", description: "Contact the Los Angeles office about California real estate representation, property management, property searches, and funding resources.", type: "ContactPage", mainEntityId: "https://ivisionrealtycorp.com/#organization" }),
      ]} />
      <main className="contactPage">
        <section className="contactIntro shell">
          <div><p className="eyebrow">Start a conversation</p><h1>Tell us where you want to go next.</h1><p>Whether you’re planning a purchase, preparing to sell, managing a property, or exploring funding options, we’re ready to listen.</p></div>
          <div className="contactDetails">
            <div><span>Call</span><a href="tel:+18884519328;ext=701">(888) 451-9328 ext. 701</a></div>
            <div><span>Email</span><a href="mailto:info@ivisionrealtycorp.com">info@ivisionrealtycorp.com</a></div>
            <div><span>Visit</span><address>2922 Crenshaw Boulevard<br />Los Angeles, CA 90016</address></div>
            <div><span>Appointment</span><Link href="/appointment">Request a day and time</Link></div>
          </div>
        </section>
        <section className="contactPanel">
          <div className="contactImage" role="img" aria-label="Modern real estate consultation office" />
          <div className="contactFormWrap">
            <p className="eyebrow">Your inquiry</p><h2>How can we help?</h2>
            <LeadSubmitForm page="/contact" button="Send inquiry" note="Your inquiry has been sent.">
              <div className="fieldRow"><label>First name<input name="First name" autoComplete="given-name" required /></label><label>Last name<input name="Last name" autoComplete="family-name" required /></label></div>
              <label>Email address<input type="email" name="Email" autoComplete="email" required /></label>
              <label>Phone number<input type="tel" name="Phone" autoComplete="tel" /></label>
              <label>I’m interested in<select name="Interest" defaultValue=""><option value="" disabled>Select a service</option><option>Buying or selling real estate</option><option>Property management</option><option>Property or land search</option><option>Real estate funding through New Wide Lending</option><option>Business solutions</option><option>Something else</option></select></label>
              <label>Tell us a little more<textarea name="Message" rows={5} required /></label>
              
              </LeadSubmitForm>
          </div>
        </section>
        <section className="serviceArea shell"><p className="eyebrow">Service area</p><h2>California knowledge with a Greater Los Angeles focus.</h2><div><article><strong>Greater Los Angeles</strong><p>Los Angeles, West Los Angeles, Culver City, Beverly Hills, Glendale, West Hollywood, and surrounding communities.</p></article><article><strong>Southern California</strong><p>San Bernardino County and select California markets based on service availability.</p></article></div></section>
      </main>
    </SiteShell>
  );
}
