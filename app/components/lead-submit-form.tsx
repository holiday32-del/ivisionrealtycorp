"use client";
import { useState, type FormEvent, type ReactNode } from "react";

export function LeadSubmitForm({ page, children, button, note }: { page: string; children: ReactNode; button: string; note: string }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;
    setState("loading");
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form).entries());
    const name = [fields["First name"], fields["Last name"]].filter(Boolean).join(" ");
    const interest = String(fields.Interest || fields.Topic || fields["Primary service requested"] || "other");
    const excluded = new Set(["First name", "Last name", "Email", "Phone", "Interest", "Topic", "Message", "Notes", "website"]);
    const details = Object.entries(fields).filter(([key, val]) => !excluded.has(key) && String(val).trim()).map(([key, val]) => key + ": " + val);
    const message = [fields.Message || fields.Notes || "", ...details].filter(Boolean).join("\n");
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ page, name, email: fields.Email, phone: fields.Phone, interest, message: message || interest, website: fields.website }) });
      const result = await response.json();
      if (!response.ok || !result.success) throw Error("Delivery failed");
      setState("success");
      form.reset();
    } catch { setState("error"); }
  }
  return <form onSubmit={submit}>
    <input name="website" type="text" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ position: "absolute", left: "-10000px", opacity: 0 }} />
    {children}
    <button className="button buttonDark" type="submit" disabled={state === "loading"}>{state === "loading" ? "Sending..." : button}</button>
    {state === "success" ? <p className="formNote" role="status">Your request has been received. The IVISION Realty team will follow up. {page === "/appointment" ? "Your preferred time is not confirmed until the IVISION Realty team responds." : ""}</p> : <p className="formNote">{note}</p>}
    {state === "error" && <p className="formNote" role="alert">We could not submit your request. Please try again or email info@ivisionrealtycorp.com.</p>}
  </form>;
}
