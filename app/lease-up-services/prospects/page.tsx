import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "../../site-shell";

export const metadata: Metadata = {
  title: "Developer Lease-Up Application",
  description: "Apply for IVISION Lease-Up Services for a new apartment, multifamily, shared-living, co-living, or renovated rental project in Greater Los Angeles.",
  alternates: { canonical: "/lease-up-services/prospects" },
};

export default function DeveloperLeaseUpApplicationPage() {
  return (
    <SiteShell>
      <main className="prospectPage">
        <section className="prospectHeader">
          <div className="shell">
            <p className="eyebrow light">IVISION Lease-Up Services</p>
            <h1>Developer & Owner <em>Lease-Up Application.</em></h1>
            <p>
              This application is for developers, property owners, builders,
              shared-living operators, and property-management companies seeking
              professional lease-up support for a current or upcoming project.
            </p>
          </div>
        </section>

        <section className="appointmentPanel shell">
          <div className="notice">
            <strong>Developer use only</strong>
            <p>
              This form is not for prospective tenants or apartment-search
              inquiries. Renters should contact the property directly or use
              IVISION&apos;s general contact page.
            </p>
          </div>

          <p className="eyebrow">Tell us about your project</p>
          <h2>Request lease-up support.</h2>
          <p className="formNote">
            Complete the information below so IVISION can evaluate the project,
            leasing timeline, unit count, and scope of services you may need.
          </p>

          <form
            action="mailto:info@ivisionrealtycorp.com?subject=IVISION%20Lease-Up%20Developer%20Application"
            method="post"
            encType="text/plain"
          >
            <input type="hidden" name="Service" value="IVISION Lease-Up Services" />

            <div className="fieldRow">
              <label>First name<input name="First name" autoComplete="given-name" required /></label>
              <label>Last name<input name="Last name" autoComplete="family-name" required /></label>
            </div>

            <label>Company / ownership entity<input name="Company or ownership entity" required /></label>

            <div className="fieldRow">
              <label>Email address<input type="email" name="Email" autoComplete="email" required /></label>
              <label>Phone number<input type="tel" name="Phone" autoComplete="tel" required /></label>
            </div>

            <label>Your role
              <select name="Role" defaultValue="" required>
                <option value="" disabled>Select your role</option>
                <option>Developer / Builder</option>
                <option>Property Owner</option>
                <option>Asset Manager</option>
                <option>Property Management Company</option>
                <option>Shared-Living / Co-Living Operator</option>
                <option>General Contractor representing owner</option>
                <option>Other ownership representative</option>
              </select>
            </label>

            <label>Project address<input name="Project address" required /></label>

            <div className="fieldRow">
              <label>City<input name="Project city" required /></label>
              <label>ZIP code<input name="Project ZIP code" required /></label>
            </div>

            <div className="fieldRow">
              <label>Project type
                <select name="Project type" defaultValue="" required>
                  <option value="" disabled>Select project type</option>
                  <option>New construction apartments</option>
                  <option>New construction townhomes / rental homes</option>
                  <option>Shared living / co-living</option>
                  <option>Affordable / workforce housing</option>
                  <option>Senior housing</option>
                  <option>Renovated / repositioned multifamily</option>
                  <option>Mixed-use residential</option>
                  <option>Other rental housing</option>
                </select>
              </label>
              <label>Total rentable units / bedrooms<input type="number" min="1" name="Total rentable units or bedrooms" required /></label>
            </div>

            <div className="fieldRow">
              <label>Current project stage
                <select name="Project stage" defaultValue="" required>
                  <option value="" disabled>Select stage</option>
                  <option>Planning / entitlement</option>
                  <option>Under construction</option>
                  <option>60–120 days from completion</option>
                  <option>Completed / ready to lease</option>
                  <option>Partially leased</option>
                  <option>Existing property needing re-lease-up</option>
                </select>
              </label>
              <label>Target leasing start<input type="date" name="Target leasing start" /></label>
            </div>

            <label>Current occupancy, if applicable<input name="Current occupancy" placeholder="Example: 0%, 12 of 40 units leased, or N/A" /></label>

            <label>Services requested
              <select name="Primary service requested" defaultValue="" required>
                <option value="" disabled>Select primary need</option>
                <option>Full lease-up campaign</option>
                <option>Pre-leasing before completion</option>
                <option>Leasing agent / showing support</option>
                <option>Lead follow-up and application coordination</option>
                <option>Shared-living bedroom lease-up</option>
                <option>Overflow leasing for existing management team</option>
                <option>Pricing, positioning, and lease-up strategy</option>
                <option>Not sure — recommend a scope</option>
              </select>
            </label>

            <label>Do you already have a property-management company?
              <select name="Existing property management" defaultValue="" required>
                <option value="" disabled>Select one</option>
                <option>Yes</option>
                <option>No</option>
                <option>Currently selecting one</option>
                <option>Owner-managed</option>
              </select>
            </label>

            <label>Project website or listing URL<input type="url" name="Project website or listing URL" placeholder="https://" /></label>

            <label>Tell us about the project and your lease-up goals
              <textarea
                name="Project details and lease-up goals"
                rows={7}
                placeholder="Include anticipated completion date, unit mix, target rents, desired occupancy timeline, current marketing, concessions, or other important details."
                required
              />
            </label>

            <label>Authority to request services
              <select name="Authority confirmation" defaultValue="" required>
                <option value="" disabled>Select one</option>
                <option>I am the owner/developer or authorized representative</option>
                <option>I am evaluating IVISION on behalf of the ownership team</option>
              </select>
            </label>

            <button className="button buttonDark" type="submit">Submit developer application</button>

            <p className="formNote">
              Submitting opens your email application so you can review and send
              the completed request directly to IVISION Realty Corp. Submission
              does not create an agency, brokerage, management, or lease-up
              agreement. IVISION will review the project and contact you about
              next steps and any required written agreement.
            </p>
          </form>

          <p className="formNote">
            Looking for a different IVISION service? <Link href="/contact">Use our general contact page.</Link>
          </p>
        </section>
      </main>
    </SiteShell>
  );
}
