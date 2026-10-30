# Free lead capture — REVIEW ONLY; NOT DEPLOYED

## One-time owner setup (James)
1. Sign in to the Google account that should own the lead sheet and send notifications.
2. Create a blank Google Sheet called **Website Lead Inbox**. Add exactly two tabs named **New Wide Lending** and **iVision Realty**. Both receive precisely eight visible columns: Date/time | Name | Phone | Email | Site/page it came from | Program or interest | Message/notes | Status.
3. Open **Extensions → Apps Script**. Paste the content of `docs/google-leads-app-script.js` into Code.gs. Save.
4. In **Project Settings → Script properties**, add `LEAD_WEBHOOK_SECRET`, using a unique securely generated random string of at least 32 characters. Do not put this secret in GitHub or in frontend source.
5. Choose **Deploy → New deployment → Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Authorize required Google Sheets and email permissions. Copy the `/exec` URL. It is publicly reachable, but payload authentication happens inside the script.
6. Configure secret environment variables on BOTH sites' existing server runtimes: `LEADS_APPS_SCRIPT_URL` = web app /exec URL, `LEADS_APPS_SCRIPT_SECRET` = same script-property secret. Do not configure a `VITE_` or `NEXT_PUBLIC_` version; do not commit values.
7. Pepper and James should validate preview/development deployments first and approve any production configuration changes separately.
8. When the Apps Script source changes later, deploy a **new web-app version**, otherwise the old script continues running.

Google Apps Script's MailApp quota and Apps Script request limits apply. If limits or permissions stop delivery, the form returns an error; do not promise unlimited free sends. For sensitive mortgage details, only intake routine contact information here; never request SSNs, DOB, or bank documents via these forms.

## Form-by-form verification (Pepper / James)
1. On a safe review preview, send one unique fictional test lead from NWL /contact.
2. Send one from the mobilehomes.newwidelending.com eligibility form.
3. Send one from iVision /contact.
4. Send one from iVision /appointment (ensure preferred date/time is in notes).
5. Send one from iVision /lease-up-services/prospects (ensure project details in notes).
6. For each, confirm **both** one email to the exact approved recipient **and** exactly one row in the corresponding tab with correct origin, interest and New status. Record a screenshot or message ID and the row number. No live tests before approval.
7. Test honeypot rejection, empty/invalid email, mismatched origin, missing script variables, and Apps Script failure. Ensure no false success state.
8. Confirm unrelated footer mailto links, Credit People / s1 tracking, Tradeline links, pricing, affiliate pages and loan application pages are unchanged.
9. Execute each repo's usual lint, build and unit tests on the review branch. Review and fix failures before merge.

## Safety / status
Work is based on each repository's `main`; no dependency on any unpushed Codex `nwl-forms` or `iv-forms` branch. The seven draft HTML landing pages and Credit Booster are excluded. The existing visitor-facing copy and confirmation should be visually checked; only form mechanism copy is meant to change. Do not merge this branch together with a resurrected Codex version. No PR authorizes live deployment.
