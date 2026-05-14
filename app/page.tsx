"use client";
import { useMemo, useState } from "react";

import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Heart,
  Menu,
  Search,
  Shield,
  TrendingUp,
} from "lucide-react";



type Category = "Equipment" | "Construction" | "Training" | "Response";
type Filter = "All" | "Urgent" | "Equipment" | "Construction" | "Training";
type Sort = "urgent" | "almost" | "recent" | "largest";

interface Need {
  id: string;
  title: string;
  image: string;
  hospital: string;
  country: string;
  category: Category;
  description: string;
  raised: number;
  goal: number;
  daysLeft: number;
  urgent?: boolean;
}


const NEEDS: Need[] = [
  { id: "1", image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=900&q=80&auto=format&fit=crop", title: "Cholera response, eastern DRC", hospital: "Vanga", country: "DRC", category: "Response", description: "Thirty days of rehydration supplies and surge staff. Forty patients a day, treated outdoors.", raised: 28400, goal: 46000, daysLeft: 12, urgent: true },
  { id: "2", image: "https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?w=900&q=80&auto=format&fit=crop", title: "Solar power for the maternity ward", hospital: "Loma de Luz", country: "Honduras", category: "Construction", description: "A battery bank that holds the wards through monthly grid outages. Three to four a month.", raised: 71400, goal: 84000, daysLeft: 34 },
  { id: "3", image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=900&q=80&auto=format&fit=crop", title: "Second floor for the maternity ward", hospital: "Galmi", country: "Niger", category: "Construction", description: "Eight new delivery rooms. Volume has tripled in five years.", raised: 186000, goal: 215000, daysLeft: 48 },
  { id: "4", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80&auto=format&fit=crop", title: "Cardiac cath lab, expanded", hospital: "Tenwek", country: "Kenya", category: "Equipment", description: "A hemodynamic monitoring upgrade, replacing a 2018 system at end of life.", raised: 48200, goal: 78000, daysLeft: 22 },
  { id: "5", image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=900&q=80&auto=format&fit=crop", title: "Ultrasound the OB ward can rely on", hospital: "Kapsowar", country: "Kenya", category: "Equipment", description: "Refurbished, two probes. The current unit is fourteen years old and failing.", raised: 13800, goal: 14200, daysLeft: 8 },
  { id: "6", image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=900&q=80&auto=format&fit=crop", title: "NICU ventilator replacement", hospital: "CMC Vellore", country: "India", category: "Equipment", description: "One of three failed in February. The hospital is running on two; volume can't sustain that.", raised: 18400, goal: 34000, daysLeft: 9, urgent: true },
  { id: "7", image: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=900&q=80&auto=format&fit=crop", title: "Pediatric anesthesia training, two years", hospital: "Tenwek", country: "Kenya", category: "Training", description: "A Kenyan attending returns as the only pediatric anesthesiologist in the region.", raised: 22800, goal: 30000, daysLeft: 60 },
  { id: "8", image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=900&q=80&auto=format&fit=crop", title: "Two refurbished anesthesia machines", hospital: "Bongolo", country: "Gabon", category: "Equipment", description: "Replacing end-of-life Drager units in the main OR, with a one-year service contract.", raised: 31200, goal: 52000, daysLeft: 27 },
  { id: "9", image: "https://images.unsplash.com/photo-1612531385446-f7e6d131e1d0?w=900&q=80&auto=format&fit=crop", title: "Three surgical residents, one year", hospital: "Tenwek", country: "Kenya", category: "Training", description: "Tuition and supervision for PAACS-accredited residents in their final year.", raised: 11400, goal: 18000, daysLeft: 41 },
  { id: "10", image: "https://images.unsplash.com/photo-1605098293559-d6e0afaf21d4?w=900&q=80&auto=format&fit=crop", title: "Outpatient clinic expansion", hospital: "Hospital of Hope", country: "Togo", category: "Construction", description: "A 240-square-meter extension. Volume has doubled since 2020.", raised: 42000, goal: 124000, daysLeft: 72 },
  { id: "11", image: "https://images.unsplash.com/photo-1613377859989-c4cce16dc8df?w=900&q=80&auto=format&fit=crop", title: "Visiting surgeon support, four teams", hospital: "Tansen", country: "Nepal", category: "Training", description: "A year of quarterly subspecialty teams — ortho, urology, plastics, ENT.", raised: 8200, goal: 24000, daysLeft: 55 },
  { id: "12", image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=900&q=80&auto=format&fit=crop", title: "Working chemistry analyzer", hospital: "PCEA Chogoria", country: "Kenya", category: "Equipment", description: "Refurbished, eighteen months of reagent. Cuts sepsis turnaround from hours to minutes.", raised: 9800, goal: 22000, daysLeft: 18 },
];


const FILTERS: Filter[] = ["All", "Urgent", "Equipment", "Construction", "Training"];

const fmt = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
const fmtFull = (n: number) => `$${n.toLocaleString("en-US")}`;

function MissionaryNeedsPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [sort, setSort] = useState<Sort>("urgent");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = NEEDS.filter((n) => {
      if (filter === "All") return true;
      if (filter === "Urgent") return n.urgent;
      return n.category === filter;
    });
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.hospital.toLowerCase().includes(q) ||
          n.country.toLowerCase().includes(q),
      );
    }
    const sorted = [...list];
    sorted.sort((a, b) => {
      if (sort === "urgent") return Number(b.urgent ?? 0) - Number(a.urgent ?? 0) || a.daysLeft - b.daysLeft;
      if (sort === "almost") return b.raised / b.goal - a.raised / a.goal;
      if (sort === "recent") return Number(a.id) - Number(b.id);
      return b.goal - a.goal;
    });
    return sorted;
  }, [filter, sort, query]);

  const totals = useMemo(() => {
    const raised = NEEDS.reduce((s, n) => s + n.raised, 0);
    const goal = NEEDS.reduce((s, n) => s + n.goal, 0);
    return { raised, goal, remaining: goal - raised, count: NEEDS.length, urgent: NEEDS.filter((n) => n.urgent).length };
  }, []);

  const heroPct = Math.round((totals.raised / totals.goal) * 100);

  return (
    <div className="min-h-screen bg-background text-foreground">
     
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <a href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Heart className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-[15px]">MissionaryDoctors</span>
          </a>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {["About", "Hospitals", "Needs", "News"].map((l, i) => (
              <a
                key={l}
                href="#"
                className={`rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted ${i === 2 ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
                aria-current={i === 2 ? "page" : undefined}
              >
                {l}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href="#" className="hidden rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex">
              Sign in
            </a>
            <a href="#needs" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-all hover:opacity-90 hover:shadow-sm">
              Give now
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="grid h-9 w-9 place-items-center rounded-md border border-border md:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-border bg-background px-6 py-3 md:hidden" aria-label="Mobile">
            {["About", "Hospitals", "Needs", "News"].map((l) => (
              <a key={l} href="#" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted">
                {l}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main id="main">
     
        <section className="relative overflow-hidden border-b border-border">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.51_0.16_252_/_0.06),transparent_70%)]" />
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
            <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                  </span>
                  <span>{totals.urgent} urgent needs · live funding</span>
                </div>
                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Real medical needs.
                  <br />
                  <span className="text-primary">Transparently funded.</span>
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  Each hospital writes the project. We vet it. You fund a specific line item — equipment, construction, or training. Reports arrive at every milestone.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a href="#needs" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-px">
                    Browse open needs
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                  <a href="#" className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                    How it works
                  </a>
                </div>
                <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Trust">
                  {[
                    { icon: Shield, label: "501(c)(3) verified" },
                    { icon: CheckCircle2, label: "100% to project" },
                    { icon: Activity, label: "Milestone reports" },
                  ].map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Icon className="h-4 w-4 text-primary" aria-hidden />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="rounded-2xl border border-border bg-surface p-6 shadow-sm lg:p-7" aria-label="Live funding overview">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Global funding overview</p>
                    <p className="mt-1 text-sm text-muted-foreground">Across {totals.count} active projects</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                    <TrendingUp className="h-3 w-3" /> Live
                  </span>
                </div>

                <div className="mt-6">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{fmt(totals.raised)}</span>
                    <span className="text-sm text-muted-foreground">of {fmt(totals.goal)} goal</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${heroPct}%` }}
                      role="progressbar"
                      aria-valuenow={heroPct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>{heroPct}% funded</span>
                    <span>{fmt(totals.remaining)} remaining</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-background">
                  {[
                    { label: "Hospitals", value: "42" },
                    { label: "Countries", value: "18" },
                    { label: "Donors", value: "3.2k" },
                  ].map((s) => (
                    <div key={s.label} className="px-4 py-3 text-center">
                      <p className="font-mono text-xl font-semibold text-foreground">{s.value}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3 border-t border-border pt-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Recently funded</p>
                  {[
                    { who: "Anonymous", what: "Cholera response", amt: "$250" },
                    { who: "Marcus L.", what: "NICU ventilator", amt: "$1,000" },
                    { who: "Grace Foundation", what: "Solar maternity", amt: "$5,400" },
                  ].map((row) => (
                    <div key={row.what} className="flex items-center justify-between text-sm">
                      <div className="min-w-0">
                        <p className="truncate text-foreground">{row.who}</p>
                        <p className="truncate text-xs text-muted-foreground">{row.what}</p>
                      </div>
                      <span className="font-mono text-sm font-medium text-foreground">{row.amt}</span>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

      
        <div id="needs" className="sticky top-16 z-40 border-y border-border bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-3 lg:flex-row lg:items-center lg:px-10">
            <div className="flex flex-1 items-center gap-2 overflow-x-auto">
              <div role="tablist" aria-label="Filter needs" className="flex items-center gap-1">
                {FILTERS.map((f) => {
                  const active = f === filter;
                  return (
                    <button
                      key={f}
                      role="tab"
                      aria-selected={active}
                      onClick={() => setFilter(f)}
                      className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="relative flex items-center">
                <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" aria-hidden />
                <span className="sr-only">Search needs</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search hospital or country"
                  className="h-9 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 sm:w-64"
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <span className="sr-only">Sort by</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="h-9 rounded-md border border-border bg-surface px-3 text-sm focus:border-ring focus:ring-2 focus:ring-ring/20"
                >
                  <option value="urgent">Most urgent</option>
                  <option value="almost">Almost funded</option>
                  <option value="recent">Recently listed</option>
                  <option value="largest">Largest goal</option>
                </select>
              </label>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-6 pb-3 text-xs text-muted-foreground lg:px-10">
            Showing <span className="font-medium text-foreground">{filtered.length}</span> of {totals.count} needs
          </div>
        </div>

       
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((need) => {
              const pct = Math.min(100, Math.round((need.raised / need.goal) * 100));
              const urgent = need.urgent || need.daysLeft <= 10;
              const almost = pct >= 90;
              return (
                <article
                  key={need.id}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
  <img
    src={need.image}
    alt={need.title}
    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
  />
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                      {urgent && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-destructive/95 px-2 py-1 text-[11px] font-medium text-destructive-foreground shadow-sm backdrop-blur">
                          <Clock className="h-3 w-3" aria-hidden /> Urgent
                        </span>
                      )}
                      {almost && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-success/95 px-2 py-1 text-[11px] font-medium text-success-foreground shadow-sm backdrop-blur">
                          Almost funded
                        </span>
                      )}
                      <span className="inline-flex items-center rounded-md bg-background/90 px-2 py-1 text-[11px] font-medium text-foreground shadow-sm backdrop-blur">
                        {need.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5" aria-hidden />
                      <span className="font-medium text-foreground">{need.hospital}</span>
                      <span aria-hidden>·</span>
                      <span>{need.country}</span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold leading-snug tracking-tight text-foreground">
                      <a href="#" className="after:absolute after:inset-0 after:content-['']">
                        {need.title}
                      </a>
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{need.description}</p>

                    <div className="mt-5">
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="font-mono font-semibold text-foreground">{fmtFull(need.raised)}</span>
                        <span className="font-mono text-xs text-muted-foreground">of {fmtFull(need.goal)}</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${urgent ? "bg-destructive" : almost ? "bg-success" : "bg-primary"}`}
                          style={{ width: `${pct}%` }}
                          role="progressbar"
                          aria-valuenow={pct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${pct}% funded`}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs">
                      <div className="flex items-center gap-3">
                        <span className={`font-mono font-medium ${urgent ? "text-destructive" : "text-foreground"}`}>
                          {pct}% funded
                        </span>
                        <span className="text-muted-foreground">
                          <Clock className="mr-1 inline h-3 w-3" aria-hidden />
                          {need.daysLeft}d left
                        </span>
                      </div>
                      <span className="relative z-10 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Fund this <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
              <p className="text-muted-foreground">No needs match your filters.</p>
            </div>
          )}
        </section>

    
        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
            <div className="grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Fund a need monthly. See it through to delivery.
                </h2>
                <p className="mt-3 max-w-xl text-base text-muted-foreground">
                  Recurring giving lets us greenlight smaller projects faster — and ensures supplies arrive before they're critical.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <a href="#" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-px">
                  Give monthly <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#" className="inline-flex items-center rounded-md border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                  Talk to our team
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2 font-semibold tracking-tight">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <Heart className="h-4 w-4" aria-hidden />
                </span>
                MissionaryDoctors
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                A transparent funding platform for medical mission hospitals worldwide.
              </p>
            </div>
            {[
              { h: "Discover", l: ["Hospital tours", "Missionary needs", "News & field reports", "About"] },
              { h: "Take part", l: ["Apply to serve", "Give monthly", "For hospitals", "Newsletter"] },
              { h: "Trust", l: ["Financials", "501(c)(3) status", "Privacy", "Contact"] },
            ].map((c) => (
              <div key={c.h}>
                <h5 className="text-xs font-semibold uppercase tracking-wider text-foreground">{c.h}</h5>
                <ul className="mt-4 space-y-2.5">
                  {c.l.map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
            <p>© 2026 Giving Tree Projects · Shreveport, Louisiana</p>
            <p>501(c)(3) · EIN 00-0000000</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default MissionaryNeedsPage;