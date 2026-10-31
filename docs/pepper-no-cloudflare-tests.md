# Pepper's no-Cloudflare review plan

**Do not merge, deploy, or change production configuration. No Cloudflare dashboard actions.** Original Google Sheet and deployed Apps Script remain as-is.

## A. Code checks (no secrets, no Cloudflare)
- NWL: from repo checkout, run `node --test tests/free-lead-handler.test.mjs`; tests emulate the upstream web app and assert payload, recipient, attribution, missing-settings 503, invalid input 400, and upstream failure 502. Run normal `npm run build --prefix apps/web` separately.
- iVision: run `node --test tests/lead-form-contract.test.mjs` to check static source contracts; run `npm test` for framework build/render checks. Static contracts are NOT an end-to-end handler execution test.
- Test email / Google Sheet delivery is **not** asserted by these code tests.

## B. Google delivery (no Cloudflare)
A Google-account operator with edit access to the existing Sheet/Apps Script, such as Pepper if granted access, can paste ONLY `docs/pepper-apps-script-delivery-test.js` below the existing Code.gs and run `pepperTestLeadDelivery` in Apps Script. The helper reads the ALREADY PRESENT Script Property internally. No credentials or /exec URL are pasted or displayed. No redeploy is needed because testing invokes doPost directly. Remove helper after tests if desired.

Expected: five synthetic rows total, two in New Wide Lending and three in iVision Realty, each with eight columns, status New, correct originating page and interest. Check corresponding notification emails (two to info@newwidelending.com, three to info@ivisionrealtycorp.com). Check the execution log for five PASS statements and one rejected unauthorized request. Unauthorized request must not add a row or send email. Record results privately without lead data.

**NOTE:** This test does not prove the publicly deployed Apps Script /exec URL accepts the request, and it does not prove either Cloudflare preview connects to Google. Also confirm script's current Code.gs matches the PR's documented code before interpreting test results; there is no need to rebuild the existing sheet.

## C. Safe preview UX check
Known historical NWL preview alias: https://review-free-lead-form-wiring.newidelending.pages.dev
Do not treat this alias as a verified build of the *latest* review commits. The alias and iVision preview are not confirmed current. With no server credentials, a valid preview form should display a clear error (503 / "Lead processing is unavailable") rather than show "received" success. No email / sheet row is expected. Pepper may use fictional data only.

## D. Remaining integration boundary
The actual public site-to-Apps-Script server handoff still needs the private server-side URL and credential securely configured by an authorized deployment operator, plus one controlled integration test. That cannot be inferred from a successful local handler test and Google-side doPost test. Production configuration must be a separate James-approved activity. An authorized operator can configure it through a secure API/CLI using already authenticated credentials; **do not ask James for the secret in chat, GitHub, or a frontend file**. If no authorized operator/credential exists, the production link remains blocked.

Scope excludes seven draft HTML pages, Credit Booster, all Codex unpushed branches, Credit People/s1, Tradeline, pricing, and loan application pages. No GoHighLevel restoration.
