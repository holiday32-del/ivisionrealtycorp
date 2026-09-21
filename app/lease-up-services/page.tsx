import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "../site-shell";

export const metadata: Metadata = {
  title: "Apartment Lease-Up Services",
  description: "Independent lease-up support for Los Angeles apartment developers, owners, shared-living operators, and multifamily projects.",
  alternates: { canonical: "/lease-up-services" },
};

export default function LeaseUpServicesPage() {
  return (
    <SiteShell>
      <main>
        <section className="leaseUpHero">
          <div className="leaseUpHeroShade" />
          <div className="shell leaseUpHeroInner">
            <p className="eyebrow light">IVISION Lease-Up Services</p>
            <h1>From construction completion to <em>occupied units.</em></h1>
            <p className="heroCopy">Independent lease-up support for new apartments, small multifamily developments, shared-living properties, and recently renovated communities throughout Greater Los Angeles.</p>
            <div className="buttonRow">
              <Link className="button buttonGold" href="/lease-up-services/prospects">Developer sign-up</Link>\n              <Link className="button buttonOutlineLight" href="/contact">Ask a question</Link>
            </div>
          </div>
        </section>

        <section className="section shell leaseUpIntro">
          <div>
            <p className="eyebrow">Specialized leasing support</p>
            <h2>Occupancy support without building a full in-house leasing team.</h2>
          </div>
          <div className="leaseUpIntroCopy">
            <p>IVISION can support pre-leasing, launch campaigns, inquiry management, tours, applications, lease execution coordination, weekly pipeline reporting, and stabilization strategy.</p>
            <p>Engagements can be tailored to small infill buildings, shared-living properties, renovated communities, and larger multifamily lease-ups.</p>
          </div>
        </section>

        <section className="section leaseUpBand">
          <div className="shell">
            <div className="sectionHeading">
              <div><p className="eyebrow">Ideal projects</p><h2>Where lease-up support creates value.</h2></div>
              <p>Focused support for owners and developers approaching delivery or needing temporary leasing capacity.</p>
            </div>
            <div className="leaseUpServiceGrid">
              <article><span>01</span><h3>New construction apartments</h3><p>Pre-leasing and opening-phase support for small and mid-sized developments.</p></article>
              <article><span>02</span><h3>Shared living & co-living</h3><p>Bedroom-by-bedroom leasing workflows where lead volume and turnover are higher.</p></article>
              <article><span>03</span><h3>Renovated multifamily</h3><p>Repositioned or recently vacated buildings that need a focused occupancy campaign.</p></article>
              <article><span>04</span><h3>Overflow lease-up</h3><p>Supplemental leasing capacity for developers and property managers during launch.</p></article>
            </div>
          </div>
        </section>

        <section className="section shell leaseUpProcess">
          <p className="eyebrow">How the engagement works</p>
          <h2>One leasing pipeline. Clear accountability.</h2>
          <div className="leaseUpSteps">
            <article><strong>01</strong><h3>Audit</h3><p>Review unit mix, rents, concessions, readiness, positioning, and target renter.</p></article>
            <article><strong>02</strong><h3>Launch</h3><p>Build listings, lead routing, follow-up, showing cadence, and reporting.</p></article>
            <article><strong>03</strong><h3>Convert</h3><p>Move qualified prospects from inquiry through tours, applications, and leases.</p></article>
            <article><strong>04</strong><h3>Stabilize</h3><p>Track occupancy, velocity, pricing friction, and remaining unit exposure.</p></article>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
