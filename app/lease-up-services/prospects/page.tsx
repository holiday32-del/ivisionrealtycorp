import type { Metadata } from "next";
import { SiteShell } from "../../site-shell";
import { ProspectDatabase } from "./prospect-database";

export const metadata: Metadata = {
  title: "Los Angeles Developer Prospect Database",
  description: "Internal prospecting database for IVISION Lease-Up Services.",
  robots: { index: false, follow: false },
};

export default function DeveloperProspectsPage() {
  return (
    <SiteShell>
      <main className="prospectPage">
        <section className="prospectHeader">
          <div className="shell">
            <p className="eyebrow light">Internal Business Development</p>
            <h1>Los Angeles Developer <em>Prospect Database.</em></h1>
            <p>Search, filter, and prioritize apartment-development prospects compiled from public planning records. Verify project status and decision-maker information before outreach.</p>
          </div>
        </section>
        <ProspectDatabase />
      </main>
    </SiteShell>
  );
}
