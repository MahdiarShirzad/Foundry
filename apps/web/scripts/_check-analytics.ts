/* Temporary authoring check — verifies demo-data consistency. Not shipped. */
import {
  DEMO_ANALYTICS_DATA,
  DEMO_ANALYTICS_PRODUCTS,
  getKpis,
  getSeriesSlice,
} from "../lib/founder-analytics/demo";
import { METRIC_CATALOG } from "../lib/founder-analytics/demo";

const problems: string[] = [];
const notes: string[] = [];
const num = (v: string) => Number(v.replace(/[^0-9.]/g, ""));
const pct = (a: number, b: number) => (((a - b) / b) * 100).toFixed(1);

for (const product of DEMO_ANALYTICS_PRODUCTS) {
  const ds = DEMO_ANALYTICS_DATA[product.id];
  if (!ds) {
    notes.push(`${product.name}: no dataset (expected empty states)`);
    continue;
  }
  const p = product.name;
  const weeks = ds.weeks;
  const totalSessions = weeks.reduce((s, x) => s + x.sessions, 0);
  const totalNew = weeks.reduce((s, x) => s + x.newUsers, 0);

  // 1. perUser vs sessions/active
  for (const x of weeks) {
    const calc = x.sessions / x.active;
    if (Math.abs(calc - x.perUser) > 0.011)
      problems.push(`${p} ${x.start}: perUser ${x.perUser} vs ${calc.toFixed(3)}`);
  }

  // 2. devices/channels totals
  const devSum = ds.devices.reduce((s, x) => s + x.value, 0);
  if (devSum !== totalSessions)
    problems.push(`${p}: devices sum ${devSum} != total sessions ${totalSessions}`);
  const chanSum = ds.channels.reduce((s, x) => s + x.value, 0);
  if (chanSum !== totalNew)
    problems.push(`${p}: channels sum ${chanSum} != total new ${totalNew}`);

  // 3. segments
  for (const seg of ds.segments) {
    if (seg.weeklySessions.length !== weeks.length)
      problems.push(`${p} ${seg.id}: weeklySessions length ${seg.weeklySessions.length} != ${weeks.length}`);
    if (seg.usage.length !== ds.featureAreas.length)
      problems.push(`${p} ${seg.id}: usage length mismatch`);
    const segSum = seg.weeklySessions.reduce((s, x) => s + x, 0);
    if (seg.id === "all" && segSum !== totalSessions)
      problems.push(`${p} all: weekly sum ${segSum} != total sessions ${totalSessions}`);
    if (seg.sessions !== segSum)
      problems.push(`${p} ${seg.id}: segment.sessions ${seg.sessions} != weekly sum ${segSum}`);
  }
  const newSeg = ds.segments.find((s) => s.id === "new");
  const retSeg = ds.segments.find((s) => s.id === "returning");
  const allSeg = ds.segments.find((s) => s.id === "all");
  if (newSeg && retSeg && allSeg) {
    for (let i = 0; i < weeks.length; i++) {
      if (newSeg.weeklySessions[i] + retSeg.weeklySessions[i] !== allSeg.weeklySessions[i])
        problems.push(`${p} week ${i}: new+returning != all`);
    }
    const usageMismatch = ds.featureAreas.map((_, i) =>
      (newSeg.usage[i] ?? 0) + (retSeg.usage[i] ?? 0) - (allSeg.usage[i] ?? 0),
    );
    if (usageMismatch.some((x) => x !== 0))
      problems.push(`${p}: feature usage new+returning != all (${usageMismatch.join(",")})`);
    // latest-week user counts
    const last = weeks[weeks.length - 1];
    if (allSeg.users !== last.active)
      problems.push(`${p} all.users ${allSeg.users} != latest active ${last.active}`);
    if (newSeg.users !== last.newUsers)
      problems.push(`${p} new.users ${newSeg.users} != latest new ${last.newUsers}`);
    if (retSeg.users !== last.active - last.newUsers)
      problems.push(`${p} returning.users ${retSeg.users} != ${last.active - last.newUsers}`);
  }

  // 4. desktop + mobile usage vs all usage
  const desk = ds.segments.find((s) => s.id === "desktop");
  const mob = ds.segments.find((s) => s.id === "mobile");
  if (desk && mob && allSeg) {
    const bad = ds.featureAreas.map(
      (_, i) => desk.usage[i] + mob.usage[i] - allSeg.usage[i],
    );
    if (bad.some((x) => x !== 0)) problems.push(`${p}: desktop+mobile usage != all (${bad.join(",")})`);
  }

  // 5. cohorts
  if (ds.cohorts) {
    for (const c of ds.cohorts) {
      const date = c.label.replace("Week of ", "");
      const match = weeks.find((x) => {
        const d = new Date(`${x.start}T00:00:00Z`);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }) === date;
      });
      if (!match) problems.push(`${p} cohort ${c.label}: no matching week`);
      else if (match.newUsers !== c.size) problems.push(`${p} cohort ${c.label}: size ${c.size} != newUsers ${match.newUsers}`);
      if (c.weeks.filter((x) => x !== null).length !== c.observed)
        problems.push(`${p} cohort ${c.label}: observed ${c.observed} != populated cells`);
      for (let i = 1; i < c.weeks.length; i++) {
        if (c.weeks[i] !== null && c.weeks[i - 1] !== null && (c.weeks[i] as number) > (c.weeks[i - 1] as number))
          problems.push(`${p} cohort ${c.label}: week ${i + 1} higher than week ${i}`);
      }
    }
  }

  // 6. KPI literals
  for (const range of [4, 12, 26]) {
    const cards = getKpis(ds, range);
    if (!cards) {
      notes.push(`${p}: no KPI cards for ${range}w (empty state expected)`);
      continue;
    }
    const slice = (key: "active" | "newUsers" | "sessions" | "avgMinutes") =>
      weeks.slice(-range).map((x) => x[key]);
    const prev = weeks.slice(-(range * 2), -range);
    const peak = Math.max(...slice("active"));
    const sumNew = slice("newUsers").reduce((s, x) => s + x, 0);
    const sumSessions = slice("sessions").reduce((s, x) => s + x, 0);
    const mean = (arr: number[]) => arr.reduce((s, x) => s + x, 0) / arr.length;
    const prevMean = prev.length ? mean(prev.map((x) => x.avgMinutes)) : null;
    const expected: Record<string, [string, string | null]> = {
      active: [String(peak), prev.length ? String(Math.max(...prev.map((x) => x.active))) : null],
      new: [String(sumNew), prev.length ? String(prev.reduce((s, x) => s + x.newUsers, 0)) : null],
      sessions: [String(sumSessions), prev.length ? String(prev.reduce((s, x) => s + x.sessions, 0)) : null],
      duration: [mean(slice("avgMinutes")).toFixed(1), prevMean === null ? null : prevMean.toFixed(1)],
    };
    for (const card of cards) {
      const exp = expected[card.id];
      if (!exp) continue;
      if (num(card.value) !== Number(exp[0]))
        problems.push(`${p} ${range}w KPI ${card.id}: literal ${card.value} != computed ${exp[0]}`);
      const deltaLine = exp[1] === null
        ? `${card.id}: delta should be null (no previous ${range}w)`
        : `${p} ${range}w ${card.id}: ${exp[0]} vs prev ${exp[1]} => ${pct(Number(exp[0]), Number(exp[1]))}% (literal: "${card.delta ? card.delta.text : "null"}")`;
      notes.push(deltaLine);
    }
  }

  // 7. metric details
  const last = weeks[weeks.length - 1];
  const prevWeek = weeks[weeks.length - 2];
  for (const metric of METRIC_CATALOG) {
    const detail = ds.metricDetails[metric.id];
    if (!detail) { problems.push(`${p}: no metric detail for ${metric.id}`); continue; }
    if (!metric.seriesKey) continue;
    const v = last[metric.seriesKey];
    const pv = prevWeek[metric.seriesKey];
    notes.push(`${p} detail ${metric.id}: value "${detail.value}" | computed latest ${v} prev ${pv} => ${pct(v, pv)}%`);
  }

  // 8. feature usage total
  const allUsage = ds.segments.find((s) => s.id === "all")!.usage.reduce((s, x) => s + x, 0);
  const fu = ds.metricDetails["feature-usage"];
  if (fu && num(fu.value) !== allUsage)
    problems.push(`${p}: feature-usage value ${fu.value} != total usage ${allUsage}`);
}

console.log("== PROBLEMS ==");
console.log(problems.length ? problems.join("\n") : "(none)");
console.log("\n== NOTES ==");
console.log(notes.join("\n"));
