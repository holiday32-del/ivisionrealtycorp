import { CreditConsultation } from "../credit-consultation";
import type { Metadata } from "next";
import { AffiliateResourceCard, affiliateResources } from "../affiliate-resources";
import { NEW_WIDE_LENDING_URL } from "../new-wide-lending";
import { breadcrumbSchema, pageOpenGraph, pageTwitter, webPageSchema } from "../seo";
import { SiteShell } from "../site-shell";
import { StructuredData } from "../structured-data";

export const metadata: Metadata = {
  title: "Real Estate & Business Resources",
  description:
    "Mortgage and lending information through New Wide Lending, plus clearly disclosed third-party resources for property owners and business owners.",
  alternates: { canonical: "/resources" },
  openGraph: pageOpenGraph(
    "Real Estate & Business Resources | IVISION Realty Corp",
    "New Wide Lending mortgage and business-financing information plus professional third-party resources for property ownership and moving.",
    "/resources",
  ),
  twitter: pageTwitter(
    "Real Estate & Business Resources | IVISION Realty Corp",
    "New Wide Lending mortgage and business-financing information plus professional third-party resources for property ownership and moving.",
  ),
};

const affiliateResourceGroups = [
  {
    category: "Real-estate investor & retirement resource",
    intro: "Keep retirement and investment-account resources separate from mortgage and property-financing options.",
    resource: affiliateResources.iraFinancial,
  },
  {
    category: "Property owners & landlords",
    intro: "Managing rental property can involve software, maintenance coordination, vendors, and other operational tools.",
    resource: affiliateResources.buildium,
  },
  {
    category: "Homeowner resources",
    intro: "Explore third-party resources that may complement homeowner planning or access needs.",
    resource: affiliateResources.yaleHome,
  },
  {
    category: "Moving & relocation",
    intro: "Planning a move? Explore third-party moving and storage resources that may help with local or long-distance relocation.",
    resource: affiliateResources.goodGreek,
  },
  {
    category: "Service business tools",
    intro: "Explore operational resources for service professionals connected to property ownership and maintenance.",
    resource: affiliateResources.housecallPro,
  },
  {
    category: "Additional business financing options",
    intro: "Business owners can compare an optional third-party financing marketplace after reviewing New Wide Lending's business-funding resources.",
    resource: {
      ...affiliateResources.superMoneyBusiness,
      action: "Compare Additional Financing Options",
    },
  },
];

const newWideLendingResources = [
  {
    category: "Mortgage & Real Estate Financing",
    copy: "Explore mortgage and real-estate financing options through New Wide Lending, including homebuyer, refinance, home-equity, self-employed, and real-estate-investor lending programs.",
    action: "Explore Mortgage Options",
  },
  {
    category: "Business & Investment Financing",
    copy: "Business owners and real-estate investors can explore financing solutions through New Wide Lending, including business funding and investor-focused lending programs.",
    action: "Explore Business & Investor Financing",
  },
];

export default function ResourcesPage() {
  return (
    <SiteShell>
      <StructuredData data={[
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Resources", path: "/resources" }]),
        webPageSchema({ path: "/resources", name: "Real Estate & Business Resources", description: "New Wide Lending mortgage and business-financing information plus clearly disclosed third-party resources for homeowners, property owners, real-estate investors, and business owners.", type: "CollectionPage" }),
      ]} />
      <main>
        <section className="pageHero pageHeroResources">
          <div className="pageHeroShade" />
          <div className="shell">
            <p className="eyebrow light">Resources</p>
            <h1>Real Estate &<br /><em>Business Resources.</em></h1>
            <p>
              Start with New Wide Lending for mortgage and financing
              information, then explore clearly disclosed third-party resources
              for property ownership, moving, and business needs.
            </p>
          </div>
        </section>

        <section className="resourceIndex shell">
          <div className="resourceIndexGrid">
            {newWideLendingResources.map((resource) => (
              <section className="resourceIndexGroup preferredResourceGroup" key={resource.category}>
                <div>
                  <p className="eyebrow">{resource.category}</p>
                  <p>IVISION Realty&apos;s primary mortgage and lending resource.</p>
                </div>
                <article className="affiliateCard preferredResourceCard">
                  <div>
                    <h3>New Wide Lending</h3>
                    <p>{resource.copy}</p>
                  </div>
                  <a className="button buttonGold" href={NEW_WIDE_LENDING_URL} rel="noopener noreferrer" target="_blank">
                    {resource.action}
                  </a>
                </article>
              </section>
            ))}

            <section className="resourceIndexGroup preferredResourceGroup">
              <div><p className="eyebrow">New Wide Lending&apos;s own service</p></div>
              <article className="affiliateCard preferredResourceCard">
                <div>
                  <h3>New Wide Lending Credit Booster</h3>
                  <p>Get credit-ready for your next big move.</p>
                </div>
                <a className="button buttonGold" href="https://credit.newwidelending.com">EXPLORE CREDIT READINESS</a>
              </article>
            </section>

            <p className="resourceIndexDisclosure">
              Affiliate Disclosure: The third-party resources below use
              affiliate links. iVision Realty may receive compensation from
              qualifying purchases, applications, or other activity completed
              through these links, at no additional cost to you. New Wide
              Lending is presented separately as IVISION Realty&apos;s primary
              mortgage and lending resource and is not labeled as an affiliate.
            </p>

            <section className="resourceIndexGroup"><div><p className="eyebrow">Buyer &amp; relocation planning</p></div><CreditConsultation /></section>
            {affiliateResourceGroups.map((group) => (
              <section className="resourceIndexGroup" key={group.category}>
                <div>
                  <p className="eyebrow">{group.category}</p>
                  <p>{group.intro}</p>
                </div>
                <AffiliateResourceCard resource={group.resource} />
              </section>
            ))}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
