"use client";

import { useMemo, useState } from "react";
import { developerProspects, leadScore } from "../prospects-data";

export function ProspectDatabase() {
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("All");
  const [stage, setStage] = useState("All");
  const [minUnits, setMinUnits] = useState("0");

  const stages = useMemo(() => Array.from(new Set(developerProspects.map((p) => p.stage))).sort(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return developerProspects
      .filter((p) => priority === "All" || p.priority === priority)
      .filter((p) => stage === "All" || p.stage === stage)
      .filter((p) => p.units >= Number(minUnits || 0))
      .filter((p) => !q || [p.projectAddress, p.submarket, p.projectType, p.applicantDeveloper, p.representative, p.outreachAngle].join(" ").toLowerCase().includes(q))
      .sort((a, b) => leadScore(b) - leadScore(a) || b.units - a.units);
  }, [query, priority, stage, minUnits]);

  const totalUnits = filtered.reduce((sum, p) => sum + p.units, 0);
  const highPriority = filtered.filter((p) => p.priority === "High").length;

  return (
    <section className="section shell prospectWorkspace">
      <div className="prospectKpis">
        <article><span>Prospects</span><strong>{filtered.length}</strong></article>
        <article><span>Total units</span><strong>{totalUnits.toLocaleString()}</strong></article>
        <article><span>High priority</span><strong>{highPriority}</strong></article>
        <article><span>Top score</span><strong>{filtered.length ? Math.max(...filtered.map(leadScore)) : 0}</strong></article>
      </div>

      <div className="prospectFilters">
        <label>Search<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Address, developer, area, project type..." /></label>
        <label>Priority<select value={priority} onChange={(e) => setPriority(e.target.value)}><option>All</option><option>High</option><option>Medium</option><option>Low</option></select></label>
        <label>Stage<select value={stage} onChange={(e) => setStage(e.target.value)}><option>All</option>{stages.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label>Minimum units<select value={minUnits} onChange={(e) => setMinUnits(e.target.value)}><option value="0">Any</option><option value="25">25+</option><option value="50">50+</option><option value="100">100+</option></select></label>
      </div>

      <div className="prospectCards">
        {filtered.map((p) => (
          <article className="prospectCard" key={p.projectAddress}>
            <div className="prospectCardTop">
              <div>
                <span className={"priorityTag priority" + p.priority}>{p.priority} priority</span>
                <h3>{p.projectAddress}</h3>
                <p>{p.submarket} · {p.councilDistrict}</p>
              </div>
              <div className="leadScore"><span>Lead score</span><strong>{leadScore(p)}</strong></div>
            </div>
            <div className="prospectMetrics">
              <div><span>Units</span><strong>{p.units}</strong></div>
              <div><span>Stage</span><strong>{p.stage}</strong></div>
              <div><span>Fit</span><strong>{p.opportunityFit}</strong></div>
            </div>
            <dl className="prospectDetails">
              <div><dt>Project type</dt><dd>{p.projectType}</dd></div>
              <div><dt>Applicant / developer</dt><dd>{p.applicantDeveloper}</dd></div>
              <div><dt>Representative</dt><dd>{p.representative}</dd></div>
              <div><dt>Outreach angle</dt><dd>{p.outreachAngle}</dd></div>
              <div><dt>Next step</dt><dd>{p.nextStep}</dd></div>
            </dl>
            <a className="textLink" href={p.sourceUrl} target="_blank" rel="noopener noreferrer">Open planning source <span>↗</span></a>
          </article>
        ))}
      </div>

      {filtered.length === 0 && <div className="prospectEmpty"><h3>No prospects match those filters.</h3><p>Adjust the search, stage, priority, or minimum unit count.</p></div>}
      <p className="prospectDisclaimer">Internal business-development tool. Project information is sourced from public planning records and may change. Verify current ownership, entitlement status, construction stage, and contact information before outreach.</p>
    </section>
  );
}
