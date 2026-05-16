'use client';

import { useEffect, useRef, useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

type Need = {
  id: string;
  tag: string;
  urgent?: boolean;
  title: string;
  description: string;
  need: string;
  raised?: string;
  location: string;
  image: string;
  imageCaption: string;
  variant: 'featured' | 'default' | 'tall' | 'wide';
};

// ── Data ───────────────────────────────────────────────────────────────────

const NEEDS: Need[] = [
  {
    id: '1',
    tag: 'Urgent · Surgery',
    urgent: true,
    title: 'A second autoclave for the surgical ward at Tenwek Hospital',
    description:
      'The current unit is 22 years old and failed twice this quarter. A backup sterilizer would let two operating rooms run in parallel — an estimated 400 additional surgeries per year.',
    need: '$8,400',
    raised: '$2,150',
    location: 'Kenya',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1400&q=85&auto=format&fit=crop',
    imageCaption: 'Surgical Ward · Tenwek',
    variant: 'featured',
  },
  {
    id: '2',
    tag: 'Pediatrics',
    title: 'Infant formula for the newborn ward',
    description:
      'Three months of supply for 18 abandoned and at-risk infants currently under hospital care.',
    need: '$1,200',
    location: 'Tanzania',
    image: 'https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?w=900&q=80&auto=format&fit=crop',
    imageCaption: 'Newborn Ward · Tanzania',
    variant: 'default',
  },
  {
    id: '3',
    tag: 'Infrastructure',
    title: 'Diesel for the backup generator',
    description:
      'Power outages average 6 hours per day during the dry season. Keeps the ICU, lab, and operating rooms running.',
    need: '$3,600',
    location: 'Malawi',
    image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=900&q=80&auto=format&fit=crop',
    imageCaption: 'Generator Room · Malawi',
    variant: 'default',
  },
  {
    id: '4',
    tag: 'Maternal Health',
    title: 'Fetal monitor for the maternity ward',
    description:
      "Replacing a unit that's been hand-repaired six times. Used in every high-risk delivery.",
    need: '$4,800',
    location: 'Kenya',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80&auto=format&fit=crop',
    imageCaption: 'Maternity · Kapsowar',
    variant: 'tall',
  },
  {
    id: '5',
    tag: 'Training',
    title: 'Tuition for two Kenyan nursing students',
    description:
      'Both students will return to serve at the hospital that sponsored them — a five-year commitment.',
    need: '$6,200',
    raised: '$4,900',
    location: 'Kenya',
    image: 'https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=900&q=80&auto=format&fit=crop',
    imageCaption: 'Nursing School · Nairobi',
    variant: 'wide',
  },
  {
    id: '6',
    tag: 'Equipment',
    title: 'Portable ultrasound for the rural outreach team',
    description: 'Used weekly on circuits to four villages without electricity.',
    need: '$11,500',
    location: 'Uganda',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=900&q=80&auto=format&fit=crop',
    imageCaption: 'Outreach Team · Uganda',
    variant: 'default',
  },
  {
    id: '7',
    tag: 'Pharmacy',
    title: "Six-month antibiotic stock for the children's ward",
    description: 'Covers the seasonal spike in pediatric pneumonia and typhoid cases.',
    need: '$2,900',
    location: 'Ethiopia',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=900&q=80&auto=format&fit=crop',
    imageCaption: "Children's Ward · Ethiopia",
    variant: 'default',
  },
  {
    id: '8',
    tag: 'Housing',
    title: "Roof repair for the doctors' residence",
    description: 'Two missionary families share the building. Leaks have damaged a third of the interior.',
    need: '$5,400',
    location: 'Zambia',
    image: 'https://images.unsplash.com/photo-1605098293559-d6e0afaf21d4?w=900&q=80&auto=format&fit=crop',
    imageCaption: "Doctors' Residence · Zambia",
    variant: 'default',
  },
];

// ── useScrollReveal ────────────────────────────────────────────────────────

function useScrollReveal() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, visible };
}

// ── NeedCard ───────────────────────────────────────────────────────────────

function NeedCard({ need }: { need: Need }) {
  const { ref, visible } = useScrollReveal();

  const colSpan: Record<Need['variant'], string> = {
    featured: 'md:col-span-6',
    default: 'md:col-span-3',
    tall: 'md:col-span-2',
    wide: 'md:col-span-4',
  };

  const imgAspect: Record<Need['variant'], string> = {
    featured: 'aspect-[16/9]',
    default: 'aspect-[4/3]',
    tall: 'aspect-[3/4]',
    wide: 'aspect-[5/4]',
  };

  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className={`col-span-2 ${colSpan[need.variant]} transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      {/* Image */}
      <div
        className={`relative ${imgAspect[need.variant]} rounded-sm overflow-hidden`}
        style={{ background: '#2a221b', filter: 'saturate(.88) contrast(1.06)' }}
      >
        <img
          src={need.image}
          alt={need.imageCaption}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/45 pointer-events-none" />
        {need.imageCaption && (
          <div className="absolute left-3.5 bottom-3 text-[#f1ead9] text-[11px] tracking-[.1em] uppercase font-medium z-10">
            {need.imageCaption}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="pt-[18px]">
        <div className="text-[11px] tracking-[.14em] uppercase text-[#8a3a1f] font-semibold">
          {need.tag}
        </div>
        <h3
          className={`font-serif font-medium leading-snug tracking-tight mt-2 mb-2 ${
            need.variant === 'featured' ? 'text-3xl md:text-[36px] max-w-[22ch]' : 'text-[22px]'
          }`}
        >
          {need.title}
        </h3>
        <p className="text-[#3a342d] text-[15px] mb-3.5">{need.description}</p>
        <div className="flex gap-[18px] text-xs text-[#7a7167] border-t border-[#e7e1d8] pt-3">
          <span>
            Need <strong className="text-[#15110d] font-semibold">{need.need}</strong>
          </span>
          {need.raised && (
            <span>
              Raised <strong className="text-[#15110d] font-semibold">{need.raised}</strong>
            </span>
          )}
          <span>{need.location}</span>
        </div>
      </div>
    </article>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function MissionaryNeedsPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

        :root {
          --ink: #15110d;
          --ink-2: #3a342d;
          --muted: #7a7167;
          --line: #e7e1d8;
          --paper: #faf7f1;
          --paper-2: #f1ebe0;
          --accent: #8a3a1f;
          --accent-ink: #5a2510;
        }

        html, body { background: var(--paper); }

        .font-serif { font-family: 'Fraunces', Georgia, serif; }
        .font-sans  { font-family: 'Inter', -apple-system, system-ui, sans-serif; }

        .needs-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: clamp(20px, 2.4vw, 32px);
        }

        @media (max-width: 860px) {
          .needs-grid { grid-template-columns: repeat(2, 1fr); }
          .md\\:col-span-6,
          .md\\:col-span-4,
          .md\\:col-span-3,
          .md\\:col-span-2 { grid-column: span 2; }
        }
      `}</style>

      <div className="font-sans antialiased text-[#15110d] bg-[#faf7f1]">

        {/* ── Nav ── */}
        <header className="sticky top-0 z-50 border-b border-[#e7e1d8]"
          style={{ background: 'rgba(250,247,241,.85)', backdropFilter: 'saturate(140%) blur(12px)' }}>
          <div className="max-w-[1200px] mx-auto px-[clamp(20px,4vw,56px)] h-16 flex items-center justify-between">
            <a href="/" className="font-serif font-semibold tracking-[.2px] text-[18px] no-underline text-[#15110d]">
              MissionaryDoctors
            </a>
            <ul className="hidden md:flex gap-7 list-none m-0 p-0 text-sm text-[#3a342d]">
              {['Hospitals', 'Needs', 'Stories', 'About'].map((item) => (
                <li key={item}>
                  <a href="#" className="no-underline hover:text-[#8a3a1f] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="bg-[#15110d] text-[#faf7f1] px-4 py-2.5 rounded-full text-[13px] no-underline hover:bg-[#8a3a1f] transition-colors"
            >
              Give
            </a>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="py-[clamp(48px,8vw,96px)]">
          <div className="max-w-[1200px] mx-auto px-[clamp(20px,4vw,56px)]">
            <div className="text-xs tracking-[.16em] uppercase text-[#8a3a1f] font-medium">
              Field Report · Vol. 04
            </div>
            <div className="mt-4 grid md:grid-cols-[1.05fr_1fr] gap-[clamp(28px,4vw,64px)] items-end">
              {/* Copy */}
              <div>
                <h1 className="font-serif font-medium text-[clamp(40px,5.4vw,76px)] leading-[1.02] tracking-[-0.015em] mt-0 mb-5 text-[#15110d]">
                  The needs are{' '}
                  <em className="not-italic italic text-[#5a2510]">specific.</em>
                  <br />
                  So is the help.
                </h1>
                <p className="text-[clamp(16px,1.15vw,18px)] text-[#3a342d] max-w-[46ch] mb-7">
                  Twelve mission hospitals. Real requests, written by the people on the ground —
                  surgical tools, fuel for the generator, formula for a ward of newborns. Quiet work,
                  and it adds up.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <a
                    href="#needs"
                    className="inline-flex items-center gap-2 px-[22px] py-3 rounded-full text-[14px] font-medium no-underline bg-[#15110d] text-[#faf7f1] hover:-translate-y-px transition-transform"
                  >
                    See the needs
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 px-[22px] py-3 rounded-full text-[14px] font-medium no-underline border border-[#15110d] text-[#15110d] hover:bg-[#15110d] hover:text-[#faf7f1] transition-colors"
                  >
                    How it works
                  </a>
                </div>
              </div>

              {/* Hero image */}
              <figure className="m-0 relative rounded-sm overflow-hidden aspect-[4/5]"
                style={{ background: '#2a221b', filter: 'saturate(.9) contrast(1.05)' }}>
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1400&q=85&auto=format&fit=crop"
                  alt="Surgeon scrubbing in at Tenwek Hospital, before dawn"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[55%] to-black/55 pointer-events-none" />
                <figcaption className="absolute left-5 bottom-[18px] z-10 text-[#f3ede2] text-xs tracking-[.08em] uppercase font-medium">
                  Tenwek Hospital
                  <span className="block font-serif italic text-[14px] normal-case tracking-normal text-[#e8dfd0] mt-1 font-normal">
                    Bomet County, Kenya — March 2026
                  </span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ── Needs Section ── */}
        <section id="needs" className="py-[clamp(56px,8vw,112px)]">
          <div className="max-w-[1200px] mx-auto px-[clamp(20px,4vw,56px)]">
            {/* Section head */}
            <div className="grid md:grid-cols-[1fr_1.4fr] gap-12 items-end mb-12 border-t border-[#e7e1d8] pt-8">
              <h2 className="font-serif font-medium text-[clamp(28px,3vw,42px)] leading-[1.1] tracking-[-0.01em] mt-2 mb-0 max-w-[14ch]">
                Open requests, from the field
              </h2>
              <p className="text-[#3a342d] m-0 max-w-[52ch]">
                Each item below was submitted by a hospital administrator in the last 30 days. We verify
                every request, fund it in full or not at all, and publish the receipt. No overhead skim,
                no marketing budget.
              </p>
            </div>

            {/* Cards grid */}
            <div className="needs-grid">
              {NEEDS.slice(0, 5).map((need) => (
                <NeedCard key={need.id} need={need} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Interstitial ── */}
        <div className="max-w-[1200px] mx-auto px-[clamp(20px,4vw,56px)]">
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-[clamp(28px,4vw,64px)] items-center py-[clamp(48px,7vw,96px)] border-t border-b border-[#e7e1d8] my-[clamp(40px,6vw,72px)]">
            <div
              className="aspect-[5/4] rounded-sm overflow-hidden relative"
              style={{ background: '#2a221b', filter: 'saturate(.88) contrast(1.06)' }}
            >
              <img
                src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=900&q=80&auto=format&fit=crop"
                alt="Galmi Hospital"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div>
              <blockquote className="font-serif italic font-normal text-[clamp(22px,2.2vw,30px)] leading-[1.3] text-[#15110d] m-0 mb-5 tracking-[-0.005em]">
                "We don't need much. We need the right things — and we need them to actually arrive."
              </blockquote>
              <cite className="not-italic text-[13px] text-[#7a7167] tracking-[.06em] uppercase">
                — Dr. Mary Adeleke, Medical Director · Egbe Hospital, Nigeria
              </cite>
            </div>
          </div>
        </div>

        {/* ── More Needs ── */}
        <section className="pt-0 pb-[clamp(56px,8vw,112px)]">
          <div className="max-w-[1200px] mx-auto px-[clamp(20px,4vw,56px)]">
            <div className="needs-grid">
              {NEEDS.slice(5).map((need) => (
                <NeedCard key={need.id} need={need} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="bg-[#f1ebe0] py-12">
          <div className="max-w-[1200px] mx-auto px-[clamp(20px,4vw,56px)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { n: '12', l: 'Partner hospitals' },
                { n: '$1.4M', l: 'Funded in 2025' },
                { n: '100%', l: 'Of gifts to the field' },
                { n: '48 hrs', l: 'Avg. funds-to-field' },
              ].map(({ n, l }) => (
                <div key={l}>
                  <div className="font-serif text-[clamp(36px,4vw,52px)] leading-none text-[#15110d] font-medium">
                    {n}
                  </div>
                  <div className="text-[13px] text-[#3a342d] mt-2 tracking-[.02em]">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Closing CTA ── */}
        <section className="text-center py-[clamp(72px,10vw,140px)]">
          <div className="max-w-[1200px] mx-auto px-[clamp(20px,4vw,56px)]">
            <div className="text-xs tracking-[.16em] uppercase text-[#8a3a1f] font-medium mb-[18px]">
              Take part
            </div>
            <h2 className="font-serif font-medium text-[clamp(34px,4vw,56px)] leading-[1.05] tracking-[-0.015em] mx-auto mb-5 max-w-[18ch]">
              Pick one need. Fund it. We'll send you the receipt and the photo.
            </h2>
            <p className="text-[#3a342d] max-w-[48ch] mx-auto mb-7">
              That's the whole loop. No drip campaigns, no plaques, no swag. Just the work and the proof.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <a
                href="#needs"
                className="inline-flex items-center gap-2 px-[22px] py-3 rounded-full text-[14px] font-medium no-underline bg-[#15110d] text-[#faf7f1] hover:-translate-y-px transition-transform"
              >
                Browse needs
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-[22px] py-3 rounded-full text-[14px] font-medium no-underline border border-[#15110d] text-[#15110d] hover:bg-[#15110d] hover:text-[#faf7f1] transition-colors"
              >
                Give monthly
              </a>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#15110d] text-[#cdc4b6] pt-16 pb-8 text-[14px]">
          <div className="max-w-[1200px] mx-auto px-[clamp(20px,4vw,56px)]">
            <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12">
              <div>
                <div className="font-serif font-semibold text-[18px] text-[#f4ecdd] tracking-[.2px]">
                  MissionaryDoctors
                </div>
                <p className="mt-3 max-w-[36ch] text-[#cdc4b6]">
                  Direct support for mission hospitals serving the rural poor. A project of Giving Tree
                  Projects.
                </p>
              </div>
              {[
                {
                  heading: 'Discover',
                  links: ['Hospital tours', 'Missionary needs', 'News & field reports', 'About'],
                },
                {
                  heading: 'Take part',
                  links: ['Apply to serve', 'Give monthly', 'For hospitals', 'Newsletter'],
                },
                {
                  heading: 'Trust',
                  links: ['Financials', '501(c)(3) status', 'Privacy', 'Contact'],
                },
              ].map(({ heading, links }) => (
                <div key={heading}>
                  <h4 className="font-serif font-medium text-[#f4ecdd] text-[14px] tracking-[.04em] mb-4 mt-0">
                    {heading}
                  </h4>
                  <ul className="list-none p-0 m-0 grid gap-2.5">
                    {links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-[#cdc4b6] no-underline hover:text-white transition-colors">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-6 border-t border-[#2a221b] flex justify-between text-xs text-[#7a7167]">
              <span>© 2026 Giving Tree Projects · Shreveport, Louisiana</span>
              <span>Powered by Giving Tree Projects</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}