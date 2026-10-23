// Swap the partner copy and URL here when another approved program takes this slot.
export const creditConsultation = {
  copy: "Your credit score shapes your buying power. The Credit People offers a free consultation to map out your next steps.",
  button: "Free Consultation →",
  url: "https://thecreditpeople.net/?a=17685&c=1&s1=ivision",
  disclosure: "Partner link: iVision Realty Corp may earn a commission if you sign up through this link — it costs you nothing extra.",
} as const;

export function CreditConsultation() {
  return (
    <aside className="affiliateCard creditConsultation" aria-label="The Credit People partner resource" data-affiliate="creditRepair">
      <p>{creditConsultation.copy}</p>
      <div>
        <a className="button buttonDark" href={creditConsultation.url} rel="sponsored noopener noreferrer" target="_blank">{creditConsultation.button}</a>
        <p className="creditConsultationDisclosure">{creditConsultation.disclosure}</p>
      </div>
    </aside>
  );
}
