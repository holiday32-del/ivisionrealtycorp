import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateResourceCard, affiliateResources } from "../affiliate-resources";
import { NEW_WIDE_LENDING_INVESTOR_URL, NEW_WIDE_LENDING_URL } from "../new-wide-lending";
import { SearchFundingResources } from "../search-funding-resources";
import { absoluteUrl, breadcrumbSchema, pageOpenGraph, pageTwitter, SITE_URL, webPageSchema } from "../seo";
import { SiteShell } from "../site-shell";
import { StructuredData } from "../structured-data";

export const metadata: Metadata = {
  title: "Real Estate & Property Management Services",
  description: "Explore residential and commercial real estate representation, property management, property search, and funding resources from IVISION Realty Corp.",
  alternates: { canonical: "/services" },
  openGraph: pageOpenGraph(
    "Real Estate & Property Management Services | IVISION Realty Corp",
    "Connected real estate, property management, property search, and funding resources for California clients.",
    "/services",
  ),
  twitter: pageTwitter(
    "Real Estate & Property Management Services | IVISION Realty Corp",
    "Connected real estate, property management, property search, and funding resources for California clients.",
  ),
};

const groups = [
  {
    id: "real-estate", number: "01", kicker: "Real estate", title: "Buy, sell, and invest with a plan.", image: "serviceImage realEstateImage",
    copy: "From a first home to an income-producing asset, we help clients understand the market, weigh the options, and move through the transaction with clarity.",
    points: ["Residential buyer and seller representation", "Commercial and investment property support", "Rental and lease search guidance", "Offer, negotiation, and closing coordination"],
  },
  {
    id: "management", number: "02", kicker: "Property management", title: "Protect the property. Strengthen the experience.", image: "serviceImage managementImage",
    copy: "Our team supports owners of single-family homes, condominiums, apartment buildings, and commercial spaces throughout Greater Los Angeles.",
    points: ["Marketing and tenant placement coordination", "Rent collection and owner reporting", "Maintenance and vendor oversight", "Day-to-day tenant communication"],
  },
  {
    id: "lease-up", number: "03", kicker: "Lease-up services", title: "Turn newly delivered units into occupied homes.", image: "serviceImage leaseUpImage",
    copy: "IVISION Lease-Up Services supports apartment developers, small multifamily owners, shared-living operators, and property managers that need focused leasing capacity during launch and stabilization.",
    points: ["Pre-leasing and launch strategy", "Lead follow-up, tours, and application coordination", "Shared-living and bedroom-by-bedroom leasing support", "Weekly occupancy and leasing pipeline reporting"],
  },
  {
    id: "funding", number: "04", kicker: "Real estate funding", title: "Connect with a dedicated real estate funding source.", image: "serviceImage fundingImage",
    copy: "New Wide Lending provides real estate funding information for home purchases, commercial property, and investment real estate. IVISION clients can explore available paths directly with its funding team.",
    points: ["Residential real estate funding information", "Commercial and investment property programs", "Program and documentation review", "Credit-readiness planning resources"],
    externalHref: NEW_WIDE_LENDING_URL,
    externalLabel: "Explore funding at New Wide Lending",
  },
  {
    id: "business", number: "05", kicker: "Business solutions", title: "Build a stronger foundation for what comes next.", image: "serviceImage businessImage",
    copy: "For entrepreneurs and property investors, we provide structured guidance around business readiness, financing conversations, and growth planning.",
    points: ["Business structure and readiness guidance", "Commercial funding preparation", "Business credit education", "Professional partner connections"],
  },
];

const propertyManagementResources = [
  affiliateResources.buildium,
  affiliateResources.housecallPro,
];

function InlineAffiliateSection({
  className = "",
  heading,
  intro,
  resources,
  disclosure,
}: {
  className?: string;
  heading: string;
  intro: string;
  resources: Array<Parameters<typeof AffiliateResourceCard>[0]["resource"]>;
  disclosure: string;
}) {
  return (
    <section className={`affiliateSection shell ${className}`}>
      <div className="affiliateIntro">
        <p className="eyebrow">Third-party resources</p>
        <h2>{heading}</h2>
        <p>{intro}</p>
      </div>
      <div className="affiliateGrid">
        {resources.map((resource) => (
          <AffiliateResourceCard key={resource.name} resource={resource} />
        ))}
      </div>
      <p className="affiliateDisclosure">{disclosure}</p>
    </section>
  );
}

function ServiceResourceSections({ groupId }: { groupId: string }) {
  if (groupId === "real-estate") {
    return (
      <>
        <InlineAffiliateSection
          className="affiliateSectionCompact"
          disclosure="Affiliate Disclosure: iVision Realty may receive compensation from qualifying purchases made through this affiliate link, at no additional cost to you."
          heading="Homeowner Resources"
          intro="Explore third-party resources that may complement homeownership, buyer planning, or access needs."
          resources={[affiliateResources.yaleHome]}
        />
        <InlineAffiliateSection
          className="affiliateSectionCompact"
          disclosure="Affiliate Disclosure: iVision Realty may receive compensation from qualifying activity through this third-party affiliate link, at no additional cost to you."
          heading="Moving & Relocation Resources"
          intro={affiliateResources.goodGreek.copy}
          resources={[affiliateResources.goodGreek]}
        />
      </>
    );
  }

  if (groupId === "management") {
    return (
      <InlineAffiliateSection
        disclosure="Affiliate Disclosure: Some links on this page are affiliate links. iVision Realty may receive compensation from qualifying activity through these links, at no additional cost to you."
        heading="Property Owner & Service Professional Resources"
        intro="Managing rental property can involve software, maintenance coordination, vendors, and other operational tools. The following third-party resources may be useful to property owners, landlords, property managers, and service professionals."
        resources={propertyManagementResources}
      />
    );
  }

  if (groupId === "funding") {
    const financingResources = [
      {
        title: "Homebuyer Financing",
        copy: "Prospective buyers can review New Wide Lending mortgage options and prepare for a financing conversation.",
        action: "Explore Homebuyer Financing",
        href: NEW_WIDE_LENDING_URL,
      },
      {
        title: "Refinance & Home Equity",
        copy: "Homeowners can explore refinance and home-equity options through New Wide Lending.",
        action: "Explore Homeowner Financing",
        href: NEW_WIDE_LENDING_URL,
      },
      {
        title: "Investor Financing Resources",
        copy: "Real-estate investors can explore financing options through New Wide Lending for investment-property and other investor-focused scenarios.",
        action: "Explore Investor Financing",
        href: NEW_WIDE_LENDING_INVESTOR_URL,
      },
      {
        title: "Business Funding",
        copy: "Business owners can explore business funding options through New Wide Lending.",
        action: "Explore Business Funding",
        href: NEW_WIDE_LENDING_URL,
      },
    ];

    return (
      <section className="affiliateSection shell preferredFinancingSection">
        <div className="affiliateIntro">
          <div><p className="eyebrow">Primary mortgage and lending resource</p><h2>Financing options through New Wide Lending</h2></div>
          <p>Explore contextual financing resources for homebuyers, homeowners, real-estate investors, and business owners.</p>
        </div>
        <div className="affiliateGrid">
          {financingResources.map((resource) => (
            <article className="affiliateCard preferredResourceCard" key={resource.title}>
              <div><h3>{resource.title}</h3><p>{resource.copy}</p></div>
              <a className="button buttonGold" href={resource.href} rel="noopener noreferrer" target="_blank">{resource.action}</a>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (groupId === "business") {
    return (
      <section className="affiliateSection shell">
        <div className="affiliateIntro">
          <div><p className="eyebrow">Business financing</p><h2>Primary and additional financing resources</h2></div>
          <p>Business owners can explore financing through New Wide Lending or compare additional third-party financing options through SuperMoney.</p>
        </div>
        <div className="affiliateGrid">
          <article className="affiliateCard preferredResourceCard">
            <div><h3>New Wide Lending</h3><p>Explore business funding options through IVISION Realty&apos;s primary lending resource.</p></div>
            <a className="button buttonGold" href={NEW_WIDE_LENDING_URL} rel="noopener noreferrer" target="_blank">Explore Business Funding</a>
          </article>
          <AffiliateResourceCard resource={{ ...affiliateResources.superMoneyBusiness, action: "Compare Additional Financing Options" }} />
        </div>
        <p className="affiliateDisclosure">Affiliate Disclosure: SuperMoney Business Financing is a third-party affiliate resource. iVision Realty may receive compensation from qualifying activity through that link. New Wide Lending is not labeled as an affiliate. Financing is subject to each provider&apos;s eligibility requirements, underwriting, rates, fees, and terms. Approval is not guaranteed.</p>
      </section>
    );
  }

  return null;
}

export default function ServicesPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/services#service-list`,
    name: "IVISION Realty services",
    itemListElement: groups.map((group, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: group.title,
        description: group.copy,
        url: absoluteUrl(`/services#${group.id}`),
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: "California",
      },
    })),
  };

  return (
    <SiteShell>
      <StructuredData data={[
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]),
        webPageSchema({ path: "/services", name: "Real Estate & Property Management Services", description: "Residential and commercial representation, property management, property search, and funding resources for California clients.", type: "CollectionPage", mainEntityId: `${SITE_URL}/services#service-list` }),
        serviceSchema,
      ]} />
      <main>
        <section className="pageHero pageHeroServices"><div className="pageHeroShade" /><div className="shell"><p className="eyebrow light">How we help</p><h1>Services built around<br /><em>the whole picture.</em></h1><p>Real estate is rarely just one decision. We connect the people, information, and next steps that keep your plans moving.</p></div></section>
        <nav className="anchorNav shell" aria-label="Service sections">
          {groups.map((group) => <a href={`#${group.id}`} key={group.id}>{group.number} {group.kicker}</a>)}
        </nav>
        <section className="pathwayStrip shell" aria-label="Buyer and seller services">
          <Link href="/buy-with-us"><strong>Buy With Us</strong><span>Search California properties and plan your purchase →</span></Link>
          <Link href="/list-with-us"><strong>List With Us</strong><span>Prepare your property and start a selling conversation →</span></Link>
        </section>
        <div className="serviceDetails">
          {groups.map((group, index) => (
            <div key={group.id}>
            <section className={`serviceDetail ${index % 2 ? "reverse" : ""}`} id={group.id}>
              <div className={group.image} role="img" aria-label={group.title} />
              <div className="serviceDetailContent">
                <span className="largeNumber">{group.number}</span>
                <p className="eyebrow">{group.kicker}</p>
                <h2>{group.title}</h2>
                <p>{group.copy}</p>
                <ul>{group.points.map((point) => <li key={point}><span>→</span>{point}</li>)}</ul>
                {group.id === "lease-up" ? (
                  <Link className="textLink" href="/lease-up-services">Explore lease-up services <span>↗</span></Link>
                ) : group.externalHref ? (
                  <a className="textLink" href={group.externalHref} rel="noopener noreferrer" target="_blank">
                    {group.externalLabel} <span>↗</span>
                  </a>
                ) : (
                  <Link className="textLink" href="/contact">Discuss your goals <span>↗</span></Link>
                )}
              </div>
            </section>
            <ServiceResourceSections groupId={group.id} />
            </div>
          ))}
        </div>
        <SearchFundingResources />
        <section className="notice shell"><strong>Good to know</strong><p>Financing programs, terms, and availability vary. All applications are subject to lender requirements, underwriting, and approval. IVISION does not guarantee financing, credit outcomes, property performance, or transaction timelines.</p></section>
        <section className="ctaSection"><div className="shell ctaInner"><div><p className="eyebrow light">Your next step</p><h2>Tell us what you’re working toward.</h2></div><Link className="button buttonGold" href="/contact">Start a conversation</Link></div></section>
      </main>
    </SiteShell>
  );
}
