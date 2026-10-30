/**
 * Paste this FUNCTION ONLY beneath the already deployed Code.gs in Google Apps Script,
 * run pepperTestLeadDelivery from the editor, then remove the function.
 * No secrets or URLs need to be typed. Do not redeploy the web app.
 * Uses the existing Script Property; each test sends a real notification.
 */
function pepperTestLeadDelivery() {
  const secret = PropertiesService.getScriptProperties().getProperty("LEAD_WEBHOOK_SECRET");
  if (!secret) throw Error("Missing existing Script Property.");
  const cases = [
    {site:"New Wide Lending",recipient:"info@newwidelending.com",page:"/contact",interest:"other"},
    {site:"New Wide Lending",recipient:"info@newwidelending.com",page:"mobilehomes.newwidelending.com/",interest:"mobile home"},
    {site:"IVISION Realty Corp",recipient:"info@ivisionrealtycorp.com",page:"/contact",interest:"buyer"},
    {site:"IVISION Realty Corp",recipient:"info@ivisionrealtycorp.com",page:"/appointment",interest:"seller"},
    {site:"IVISION Realty Corp",recipient:"info@ivisionrealtycorp.com",page:"/lease-up-services/prospects",interest:"other"}
  ];
  cases.forEach((lead, i) => {
    const id = Utilities.getUuid();
    const data = {...lead,id,secret,name:"PEPPER TEST ONLY "+(i+1),phone:"555-0100",email:"pepper-test@example.test",message:"Synthetic test lead; do not contact. Preferred date/time (appointment test only): 2026-11-15 10:00."};
    const response = JSON.parse(doPost({postData:{contents:JSON.stringify(data)}}).getContent());
    if (response.success !== true) throw Error("Delivery failed for "+lead.site+" "+lead.page);
    console.log("PASS",lead.site,lead.page,id);
  });
  // Unauthorized test must neither append nor email.
  const forbidden=JSON.parse(doPost({postData:{contents:JSON.stringify({site:"New Wide Lending",recipient:"info@newwidelending.com",page:"/contact",id:Utilities.getUuid(),secret:"INVALID_TEST_ONLY",name:"REJECT",email:"invalid@example.test"})}}).getContent());
  if (forbidden.success !== false) throw Error("Unauthorized payload was accepted");
  console.log("PASS unauthorized test");
}
