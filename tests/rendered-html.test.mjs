import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function request(
  path = "/",
  host = "ivisionrealtycorp.com",
  assetFetch = async () => new Response("Not found", { status: 404 }),
) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${host}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://${host}${path}`, {
      headers: { accept: "text/html", host },
    }),
    {
      ASSETS: { fetch: assetFetch },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("serves the original visual stylesheet through the Worker asset binding", async () => {
  const stylesheet = "body { background: #fffdf9; color: #102733; }";
  const response = await request(
    "/assets/original-ivision-design.css",
    "ivisionrealtycorp.com",
    async (assetRequest) => {
      assert.equal(new URL(assetRequest.url).pathname, "/assets/original-ivision-design.css");
      return new Response(stylesheet, {
        status: 200,
        headers: { "content-type": "text/css; charset=utf-8" },
      });
    },
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/css\b/i);
  assert.equal(await response.text(), stylesheet);
});

async function render(path = "/") {
  return request(path);
}

test("server-renders the primary routes", async () => {
  const routes = [
    ["/", /Real estate\./i],
    ["/services", /Services built around/i],
    ["/buy-with-us", /Buy With Us/i],
    ["/list-with-us", /List With Us/i],
    ["/appointment", /Choose a preferred day and time/i],
    ["/resources", /Real Estate &amp; Business Resources/i],
    ["/about", /Real estate is personal/i],
    ["/contact", /Tell us where you want to go next/i],
    ["/privacy", /Privacy Policy/i],
    ["/terms", /Website Terms/i],
    ["/disclosures", /Keller Williams search resources/i],
  ];

  for (const [path, marker] of routes) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    assert.match(await response.text(), marker);
  }
});

test("ships branded metadata and no starter preview", async () => {
  const response = await render();
  const html = await response.text();
  const [layout, packageJson] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(html, /IVISION Realty/i);
  assert.match(html, /https:\/\/ivisionrealtycorp\.com\/og\.png/i);
  assert.match(html, /<link[^>]+rel="canonical"[^>]+href="https:\/\/ivisionrealtycorp\.com\/"/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
  assert.doesNotMatch(layout, /Starter Project|codex-preview|_sites-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});

test("redirects every alternate production hostname to the canonical domain", async () => {
  for (const host of ["ivisionrealty.com", "www.ivisionrealty.com", "www.ivisionrealtycorp.com"]) {
    const response = await request("/services?source=legacy", host);
    assert.equal(response.status, 301, host);
    assert.equal(response.headers.get("location"), "https://ivisionrealtycorp.com/services?source=legacy");
  }
});

test("publishes route-specific canonical URLs and social URLs", async () => {
  const routes = ["/", "/services", "/buy-with-us", "/list-with-us", "/appointment", "/resources", "/about", "/contact", "/privacy", "/terms", "/disclosures"];

  for (const path of routes) {
    const response = await render(path);
    const html = await response.text();
    const canonical = `https://ivisionrealtycorp.com${path === "/" ? "/" : path}`;
    assert.match(html, new RegExp(`<link[^>]+rel="canonical"[^>]+href="${canonical.replaceAll("/", "\\/")}"`, "i"), path);
    const socialUrl = path === "/" ? "https:\\/\\/ivisionrealtycorp\\.com\\/?" : canonical.replaceAll("/", "\\/");
    assert.match(html, new RegExp(`<meta[^>]+property="og:url"[^>]+content="${socialUrl}"`, "i"), path);
    assert.match(html, /<meta[^>]+property="og:image"[^>]+content="https:\/\/ivisionrealtycorp\.com\/og\.png"/i, path);
    assert.doesNotMatch(html, /https:\/\/(?:www\.)?ivisionrealty\.com/i, path);
  }
});

test("ships answer-engine schemas aligned with visible business information", async () => {
  const home = await render();
  const services = await render("/services");
  const homeHtml = await home.text();
  const servicesHtml = await services.text();

  assert.match(homeHtml, /"@type":\["RealEstateAgent","LocalBusiness"\]/i);
  assert.match(homeHtml, /"@type":"WebSite"/i);
  assert.match(homeHtml, /"alternateName":"IVISION Realty"/i);
  assert.match(homeHtml, /"foundingDate":"2010"/i);
  assert.match(homeHtml, /"@id":"https:\/\/ivisionrealtycorp\.com\/#organization"/i);
  assert.match(homeHtml, /"@type":"FAQPage"/i);
  assert.match(homeHtml, /"@type":"WebPage"/i);
  assert.match(homeHtml, /What areas does IVISION Realty serve\?/i);
  assert.match(homeHtml, /Greater Los Angeles, San Bernardino County, and select California markets based on service availability\./i);
  assert.match(homeHtml, /info@ivisionrealtycorp\.com/i);
  assert.match(homeHtml, /2922 Crenshaw Boulevard/i);
  assert.match(servicesHtml, /"@type":"BreadcrumbList"/i);
  assert.match(servicesHtml, /"@type":"ItemList"/i);
  assert.match(servicesHtml, /"@type":"CollectionPage"/i);
  assert.match(servicesHtml, /"mainEntity":\{"@id":"https:\/\/ivisionrealtycorp\.com\/services#service-list"\}/i);
});

test("connects every public route to the canonical entity graph", async () => {
  const routes = ["/buy-with-us", "/list-with-us", "/appointment", "/resources", "/about", "/contact", "/privacy", "/terms", "/disclosures"];

  for (const path of routes) {
    const response = await render(path);
    const html = await response.text();
    assert.match(html, /"isPartOf":\{"@id":"https:\/\/ivisionrealtycorp\.com\/#website"\}/i, path);
    assert.match(html, /"about":\{"@id":"https:\/\/ivisionrealtycorp\.com\/#organization"\}/i, path);
    assert.match(html, /"publisher":\{"@id":"https:\/\/ivisionrealtycorp\.com\/#organization"\}/i, path);
    assert.match(html, /"@type":"BreadcrumbList"/i, path);
    assert.match(html, /<meta[^>]+name="twitter:card"[^>]+content="summary_large_image"/i, path);
  }

  const buyerHtml = await (await render("/buy-with-us")).text();
  const sellerHtml = await (await render("/list-with-us")).text();
  assert.match(buyerHtml, /"serviceType":"Real estate buyer representation"/i);
  assert.match(sellerHtml, /"serviceType":"Real estate seller representation"/i);
  assert.match(buyerHtml, /"areaServed":\{"@type":"State","name":"California"\}/i);
  assert.match(sellerHtml, /"areaServed":\{"@type":"State","name":"California"\}/i);
});

test("publishes canonical robots, sitemap, and llms resources", async () => {
  const [robots, sitemap, llms] = await Promise.all([
    request("/robots.txt"),
    request("/sitemap.xml"),
    request("/llms.txt"),
  ]);
  const [robotsText, sitemapText, llmsText] = await Promise.all([
    robots.text(), sitemap.text(), llms.text(),
  ]);

  assert.equal(robots.status, 200);
  assert.match(robotsText, /Sitemap: https:\/\/ivisionrealtycorp\.com\/sitemap\.xml/i);
  assert.doesNotMatch(robotsText, /ivisionrealty\.com/i);
  assert.equal(sitemap.status, 200);
  assert.match(sitemapText, /<loc>https:\/\/ivisionrealtycorp\.com\/services<\/loc>/i);
  assert.match(sitemapText, /<loc>https:\/\/ivisionrealtycorp\.com\/resources<\/loc>/i);
  assert.match(sitemapText, /<loc>https:\/\/ivisionrealtycorp\.com\/buy-with-us<\/loc>/i);
  assert.match(sitemapText, /<loc>https:\/\/ivisionrealtycorp\.com\/list-with-us<\/loc>/i);
  assert.match(sitemapText, /<loc>https:\/\/ivisionrealtycorp\.com\/appointment<\/loc>/i);
  assert.doesNotMatch(sitemapText, /https:\/\/(?:www\.)?ivisionrealty\.com/i);
  assert.equal(llms.status, 200);
  assert.match(llms.headers.get("content-type") ?? "", /^text\/plain\b/i);
  assert.match(llmsText, /info@ivisionrealtycorp\.com/i);
  assert.match(llmsText, /New Wide Lending/i);
  assert.match(llmsText, /Canonical organization identifier: https:\/\/ivisionrealtycorp\.com\/#organization/i);
  assert.match(llmsText, /Keller Williams Property Search and Land Search are third-party resources and are not affiliate links/i);
});

test("loads the Zotabox widgets script from the document head", async () => {
  const response = await render();
  const html = await response.text();
  const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? "";

  assert.match(head, /<script[^>]+async[^>]+src="\/\/static\.zotabox\.com\/r\/z\/rzxfdfseby5r3kauq8yq9c00cbobgw3v\/widgets\.js"/i);
});

test("uses California-only service language and the approved search resources", async () => {
  const responses = await Promise.all([
    render("/"),
    render("/services"),
    render("/about"),
    render("/contact"),
  ]);
  const html = (await Promise.all(responses.map((response) => response.text()))).join("\n");

  assert.doesNotMatch(html, /Nevada|Las Vegas|CA \+ NV/i);
  assert.match(html, /https:\/\/kwland\.com\//i);
  assert.match(html, /https:\/\/kwsela\.yourkwoffice\.com\/search\/sale\?viewport=33\.97252465497983%2C-118\.09295567700195%2C33\.93051816126121%2C-118\.15853032299805/i);
  assert.match(html, /https:\/\/www\.newwidelending\.com\/investment-property-loans/i);
  assert.match(html, /New Wide Lending/i);
});

test("publishes buyer, seller, appointment, and non-affiliate property resources", async () => {
  const responses = await Promise.all([render("/buy-with-us"), render("/list-with-us"), render("/appointment"), render("/disclosures")]);
  const html = (await Promise.all(responses.map((response) => response.text()))).join("\n");

  assert.match(html, /free Keller Williams property search/i);
  assert.match(html, /jamesholidayhaven\.officialpropertyvalue\.com\/analysis\?p=d4def49d-d37b-4241-b556-4b4d95e77a94/i);
  assert.match(html, /mailto:info@ivisionrealtycorp\.com/i);
  assert.match(html, /not an affiliate link/i);
  assert.match(html, /not an appraisal/i);
  assert.doesNotMatch(html, /ext\. 704|Sacramento|Yahoo/i);
});

test("publishes the disclosed Empower affiliate resource", async () => {
  const response = await render("/");
  const html = await response.text();

  assert.match(html, /Empower Dashboard/i);
  assert.match(html, /track\.flexlinkspro\.com\/g\.ashx\?foid=156074\.13439\.1187369&amp;trid=1187318\.157618&amp;foc=16&amp;fot=9999&amp;fos=6/i);
  assert.match(html, /rel="sponsored noopener noreferrer"/i);
  assert.match(html, /IVISION Realty Corp may receive compensation if you use the Empower\s+or ABC Carpet &amp; Home links/i);
  assert.match(html, /this does not affect the price you pay/i);
  assert.doesNotMatch(html, /Earn \$160/i);
});

test("publishes the disclosed ABC Carpet and Home affiliate resource", async () => {
  const response = await render("/");
  const html = await response.text();

  assert.match(html, /ABC Carpet &amp; Home/i);
  assert.match(html, /track\.flexlinkspro\.com\/g\.ashx\?foid=156052\.9992&amp;trid=1187318\.189434&amp;foc=17&amp;fot=9999&amp;fos=6&amp;url=https%3a%2f%2fabchome\.com%2f/i);
  assert.match(html, /rel="sponsored noopener noreferrer"/i);
  assert.match(html, /may receive compensation if you use the Empower\s+or ABC Carpet &amp; Home links/i);
  assert.match(html, /this does not affect the price you\s+pay/i);
  assert.doesNotMatch(html, /8% of sales/i);
});

test("publishes approved FlexOffers resources with disclosures and safe links", async () => {
  const responses = await Promise.all([render("/services"), render("/resources")]);
  const [servicesHtml, resourcesHtml] = await Promise.all(responses.map((response) => response.text()));
  const html = `${servicesHtml}\n${resourcesHtml}`;
  const approvedLinks = [
    ["Housecall Pro", "https://fxo.co/JEtC"],
    ["SuperMoney Business Financing", "https://fxo.co/JEtF"],
    ["Yale Home", "https://fxo.co/JEtG"],
    ["Good Greek Moving &amp; Storage", "https://fxo.co/JEtH"],
    ["Buildium", "https://fxo.co/JEtI"],
  ];

  for (const [name, url] of approvedLinks) {
    assert.match(html, new RegExp(name, "i"));
    assert.match(html, new RegExp(`href="${url.replaceAll("/", "\\/")}"[^>]+rel="sponsored noopener noreferrer"[^>]+target="_blank"`, "i"));
  }

  assert.match(servicesHtml, /Property Owner &amp; Service Professional Resources/i);
  assert.match(servicesHtml, /Moving &amp; Relocation Resources/i);
  assert.match(servicesHtml, /Compare Business Financing Options/i);
  assert.match(servicesHtml, /Homeowner Resources/i);
  assert.match(html, /Affiliate Disclosure:/i);
  assert.match(html, /Approval is not guaranteed\./i);
  assert.doesNotMatch(html, /cheapest|lowest|best|#1|guaranteed approval|guaranteed funding/i);
});

test("publishes IRA Financial as a separate retirement and investment resource", async () => {
  const response = await render("/resources");
  const html = await response.text();

  assert.match(html, /Real-estate investor &amp; retirement resource/i);
  assert.match(html, /IRA Financial/i);
  assert.match(html, /href="https:\/\/fxo\.co\/JEtD"[^>]+rel="sponsored noopener noreferrer"[^>]+target="_blank"/i);
  assert.match(html, /self-directed retirement-account information and investment resources/i);
});

test("positions New Wide Lending as the primary financing resource without affiliate labeling", async () => {
  const responses = await Promise.all([render("/resources"), render("/services"), render("/buy-with-us")]);
  const [resourcesHtml, servicesHtml, buyHtml] = await Promise.all(responses.map((response) => response.text()));
  const combined = `${resourcesHtml}\n${servicesHtml}\n${buyHtml}`;

  assert.match(resourcesHtml, /Mortgage &amp; Real Estate Financing/i);
  assert.match(resourcesHtml, /Business &amp; Investment Financing/i);
  assert.match(resourcesHtml, /Explore Mortgage Options/i);
  assert.match(resourcesHtml, /Explore Business &amp; Investor Financing/i);
  assert.ok(resourcesHtml.indexOf("Mortgage &amp; Real Estate Financing") < resourcesHtml.indexOf("IRA Financial"));
  assert.ok(resourcesHtml.indexOf("Business &amp; Investment Financing") < resourcesHtml.indexOf("IRA Financial"));

  assert.match(buyHtml, /Need Financing Before You Buy\?/i);
  assert.match(buyHtml, /Explore Home Financing/i);

  for (const label of ["Homebuyer Financing", "Refinance &amp; Home Equity", "Investor Financing Resources", "Business Funding"]) {
    assert.match(servicesHtml, new RegExp(label, "i"));
  }

  assert.match(servicesHtml, /href="https:\/\/www\.newwidelending\.com\/investment-property-loans"[^>]+rel="noopener noreferrer"[^>]+target="_blank"/i);
  assert.match(combined, /href="https:\/\/www\.newwidelending\.com\/"[^>]+rel="noopener noreferrer"[^>]+target="_blank"/i);
  assert.doesNotMatch(combined, /href="https:\/\/www\.newwidelending\.com\/(?:investment-property-loans)?"[^>]+rel="sponsored/i);
});

test("keeps New Wide Lending primary and SuperMoney secondary for business financing", async () => {
  const responses = await Promise.all([render("/resources"), render("/services")]);
  const [resourcesHtml, servicesHtml] = await Promise.all(responses.map((response) => response.text()));

  assert.match(servicesHtml, /Business owners can explore financing through New Wide Lending or compare additional third-party financing options through SuperMoney/i);
  assert.match(servicesHtml, /Explore Business Funding/i);
  assert.match(servicesHtml, /Compare Additional Financing Options/i);
  assert.ok(servicesHtml.indexOf("New Wide Lending") < servicesHtml.lastIndexOf("SuperMoney Business Financing"));
  assert.ok(resourcesHtml.indexOf("Business &amp; Investment Financing") < resourcesHtml.indexOf("SuperMoney Business Financing"));
  assert.match(`${resourcesHtml}\n${servicesHtml}`, /href="https:\/\/fxo\.co\/JEtF"[^>]+rel="sponsored noopener noreferrer"[^>]+target="_blank"/i);
  assert.match(`${resourcesHtml}\n${servicesHtml}`, /Affiliate Disclosure:/i);
});

test("publishes the current phone number and office address", async () => {
  const responses = await Promise.all([render("/"), render("/contact")]);
  const html = (await Promise.all(responses.map((response) => response.text()))).join("\n");

  assert.match(html, /\(888\) 451-9328 ext\. 701/i);
  assert.match(html, /tel:\+18884519328;ext=701/i);
  assert.match(html, /2922 Crenshaw Boulevard/i);
  assert.match(html, /Los Angeles, CA 90016/i);
  assert.doesNotMatch(html, /214-8474|272-7124|Jefferson|90066/i);
});

test("publishes the current contact email address", async () => {
  const responses = await Promise.all([render("/"), render("/contact")]);
  const html = (await Promise.all(responses.map((response) => response.text()))).join("\n");

  assert.match(html, /info@ivisionrealtycorp\.com/i);
  assert.match(html, /mailto:info@ivisionrealtycorp\.com/i);
  assert.doesNotMatch(html, /info@ivisionrealty\.com/i);
});

test("uses the refreshed hero photography", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const assets = [
    "services-hero-v2.png",
    "about-hero-v2.png",
    "property-search-hero-v2.png",
  ];

  for (const asset of assets) {
    await access(new URL(`../public/${asset}`, import.meta.url));
    assert.match(css, new RegExp(asset.replaceAll(".", "\\.")));
  }
});

test("uses distinct modern photography in the requested content sections", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const requestedAssets = [
    "about-relationship-v3.jpg",
    "services-business-v3.jpg",
    "contact-office-v3.jpg",
  ];
  const publicDirectory = new URL("../public/", import.meta.url);
  const imageNames = (await readdir(publicDirectory)).filter((name) => /\.(?:jpe?g|png|webp)$/i.test(name));
  const imageBuffers = new Map(
    await Promise.all(imageNames.map(async (name) => [name, await readFile(new URL(name, publicDirectory))])),
  );

  for (const asset of requestedAssets) {
    await access(new URL(asset, publicDirectory));
    assert.match(css, new RegExp(asset.replaceAll(".", "\\.")));

    for (const [otherName, otherBuffer] of imageBuffers) {
      if (otherName !== asset) {
        assert.equal(imageBuffers.get(asset)?.equals(otherBuffer), false, `${asset} duplicates ${otherName}`);
      }
    }
  }
});


test("credit consultation is disclosed beside the tracked link only on buyer and relocation resources", async () => {
  for (const path of ["/buy-with-us", "/resources"]) {
    const html = await (await render(path)).text();
    const block = html.match(/<aside[^>]*data-affiliate="creditRepair"[^>]*>[\s\S]*?<\/aside>/)?.[0];
    assert.ok(block, path);
    assert.match(block, /Your credit score shapes your buying power\. The Credit People offers a free consultation to map out your next steps\./);
    assert.match(block, /https:\/\/thecreditpeople\.net\/\?a=17685&amp;c=1&amp;s1=ivision/);
    assert.match(block, /rel="sponsored noopener noreferrer"/);
    assert.match(block, /Free Consultation →/);
    assert.match(block, /<\/a><p[^>]*>Partner link: iVision Realty Corp may earn a commission if you sign up through this link — it costs you nothing extra\.<\/p>/);
    assert.equal((html.match(/<aside[^>]*data-affiliate="creditRepair"/g) || []).length, 1);
  }
  for (const path of ["/", "/contact", "/appointment", "/lease-up-services/prospects"]) {
    const html = await (await render(path)).text();
    assert.doesNotMatch(html, /thecreditpeople\.net/);
  }
});
