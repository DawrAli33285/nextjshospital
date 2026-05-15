'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ── Types ──────────────────────────────────────────────────────────────────

type CardVariant = 'default' | 'featured' | 'tall' | 'wide';

interface Need {
  id: string;
  href: string;
  image: string;
  imageCaption: string;
  urgent?: string;
  location: string;
  title: string;
  description: string;
  raised: string;
  goal: string;
  percent: number;
  variant: CardVariant;
  category: 'Equipment' | 'Construction' | 'Training';
}

// ── Data ───────────────────────────────────────────────────────────────────

const NEEDS: Need[] = [
  {
    id: '1',
    href: '/project-page',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1400&q=85&auto=format&fit=crop',
    imageCaption: 'Vanga · Eastern DRC · Treatment tent, day 4',
    urgent: 'Urgent · 12d left',
    location: 'Vanga · DRC',
    title: 'Cholera response, eastern DRC',
    description: 'Thirty days of rehydration supplies and surge staff. Forty patients a day, treated outdoors.',
    raised: '$28,400',
    goal: '$46,000',
    percent: 0.62,
    variant: 'featured',
    category: 'Equipment',
  },
  {
    id: '2',
    href: '/project-page',
    image: 'https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?w=900&q=80&auto=format&fit=crop',
    imageCaption: 'Loma de Luz · Honduras',
    location: 'Loma de Luz · Honduras',
    title: 'Solar power for the maternity ward',
    description: 'A battery bank that holds the wards through monthly grid outages. Three to four a month.',
    raised: '$71,400',
    goal: '$84,000',
    percent: 0.85,
    variant: 'default',
    category: 'Equipment',
  },
  {
    id: '3',
    href: '/project-page',
    image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=900&q=80&auto=format&fit=crop',
    imageCaption: 'Galmi · Niger',
    location: 'Galmi · Niger',
    title: 'A second floor for the maternity ward',
    description: 'Eight new delivery rooms. Volume has tripled in five years.',
    raised: '$186,000',
    goal: '$215,000',
    percent: 0.87,
    variant: 'tall',
    category: 'Construction',
  },
  {
    id: '4',
    href: '/project-page',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80&auto=format&fit=crop',
    imageCaption: 'Tenwek · Kenya',
    location: 'Tenwek · Kenya',
    title: 'Cardiac cath lab, expanded',
    description: 'A hemodynamic monitoring upgrade, replacing a 2018 system at end of life.',
    raised: '$48,200',
    goal: '$78,000',
    percent: 0.62,
    variant: 'default',
    category: 'Equipment',
  },
  {
    id: '5',
    href: '/project-page',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=900&q=80&auto=format&fit=crop',
    imageCaption: 'Kapsowar · Kenya',
    location: 'Kapsowar · Kenya',
    title: 'An ultrasound the OB ward can rely on',
    description: 'Refurbished, two probes. The current unit is fourteen years old and failing.',
    raised: '$13,800',
    goal: '$14,200',
    percent: 0.97,
    variant: 'default',
    category: 'Equipment',
  },
  {
    id: '6',
    href: '/project-page',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=900&q=80&auto=format&fit=crop',
    imageCaption: 'CMC Vellore · India',
    urgent: 'Urgent',
    location: 'CMC Vellore · India',
    title: 'NICU ventilator replacement',
    description: 'One of three failed in February. The hospital is running on two; volume can\'t sustain that.',
    raised: '$18,400',
    goal: '$34,000',
    percent: 0.54,
    variant: 'default',
    category: 'Equipment',
  },
  {
    id: '7',
    href: '/project-page',
    image: 'https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=900&q=80&auto=format&fit=crop',
    imageCaption: 'Tenwek · Kenya',
    location: 'Tenwek · Kenya',
    title: 'Pediatric anesthesia training, two years',
    description: 'A Kenyan attending returns as the only pediatric anesthesiologist in the region.',
    raised: '$22,800',
    goal: '$30,000',
    percent: 0.76,
    variant: 'wide',
    category: 'Training',
  },
  {
    id: '8',
    href: '/project-page',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=900&q=80&auto=format&fit=crop',
    imageCaption: 'Bongolo · Gabon',
    location: 'Bongolo · Gabon',
    title: 'Two refurbished anesthesia machines',
    description: 'Replacing end-of-life Drager units in the main OR, with a one-year service contract.',
    raised: '$31,200',
    goal: '$52,000',
    percent: 0.60,
    variant: 'default',
    category: 'Equipment',
  },
  {
    id: '9',
    href: '/project-page',
    image: 'https://images.unsplash.com/photo-1612531385446-f7e6d131e1d0?w=900&q=80&auto=format&fit=crop',
    imageCaption: 'Tenwek · Kenya',
    location: 'Tenwek · Kenya',
    title: 'Three surgical residents, one year',
    description: 'Tuition and supervision for PAACS-accredited residents in their final year.',
    raised: '$11,400',
    goal: '$18,000',
    percent: 0.63,
    variant: 'default',
    category: 'Training',
  },
  {
    id: '10',
    href: '/project-page',
    image: 'https://images.unsplash.com/photo-1605098293559-d6e0afaf21d4?w=900&q=80&auto=format&fit=crop',
    imageCaption: 'Hospital of Hope · Togo',
    location: 'Hospital of Hope · Togo',
    title: 'Outpatient clinic expansion',
    description: 'A 240-square-meter extension. Volume has doubled since 2020.',
    raised: '$42,000',
    goal: '$124,000',
    percent: 0.34,
    variant: 'default',
    category: 'Construction',
  },
  {
    id: '11',
    href: '/project-page',
    image: 'https://images.unsplash.com/photo-1613377859989-c4cce16dc8df?w=900&q=80&auto=format&fit=crop',
    imageCaption: 'Tansen · Nepal',
    location: 'Tansen · Nepal',
    title: 'Visiting surgeon support, four teams',
    description: 'A year of quarterly subspecialty teams — ortho, urology, plastics, ENT.',
    raised: '$8,200',
    goal: '$24,000',
    percent: 0.34,
    variant: 'default',
    category: 'Training',
  },
  {
    id: '12',
    href: '/project-page',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=900&q=80&auto=format&fit=crop',
    imageCaption: 'PCEA Chogoria · Kenya',
    location: 'PCEA Chogoria · Kenya',
    title: 'A working chemistry analyzer',
    description: 'Refurbished, eighteen months of reagent. Cuts sepsis turnaround from hours to minutes.',
    raised: '$9,800',
    goal: '$22,000',
    percent: 0.45,
    variant: 'default',
    category: 'Equipment',
  },
];

const FILTERS = ['All', 'Urgent', 'Equipment', 'Construction', 'Training'] as const;
type Filter = typeof FILTERS[number];

// ── useScrollReveal hook ────────────────────────────────────────────────────

function useScrollReveal() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

// ── Sub-components ─────────────────────────────────────────────────────────

function NeedCard({ need }: { need: Need }) {
  const { ref, visible } = useScrollReveal();
  const isUrgent = !!need.urgent;

  const imageAspect: Record<CardVariant, string> = {
    featured: 'aspect-[16/10]',
    tall:     'aspect-[3/4]',
    wide:     'aspect-[5/4]',
    default:  'aspect-[4/3]',
  };

  return (
    <Link
      href={need.href}
      ref={ref as React.Ref<HTMLAnchorElement>}
      className={[
        'block group',
        need.variant === 'featured' ? 'col-span-2 max-[600px]:col-span-1' : '',
        'transition-[opacity,transform] duration-[600ms] ease-out',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[14px]',
      ].join(' ')}
    >
      {/* Image */}
      <div
        className={[
          'relative overflow-hidden rounded-[10px] mb-[18px]',
          '[background:#2a241c]',
          imageAspect[need.variant],
        ].join(' ')}
        style={{ filter: 'saturate(0.88) contrast(1.05)' }}
      >
        <Image
          src={need.image}
          alt={need.imageCaption}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 980px) 50vw, 33vw"
          className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.015]"
          style={{ filter: 'saturate(0.95) contrast(1.05)' }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(20,16,10,0.35)] pointer-events-none" />

        {need.urgent && (
          <span className="absolute top-[14px] left-[14px] px-[12px] py-[6px] bg-[#FBF8F2] text-[#B14A2C] rounded-full font-mono text-[13px] tracking-[.12em] uppercase z-10">
            {need.urgent}
          </span>
        )}
        <div className="absolute left-[14px] bottom-[12px] right-[14px] text-[#FBF8F2] font-mono text-[11.5px] tracking-[.12em] uppercase opacity-90 z-10">
          {need.imageCaption}
        </div>
      </div>

      {/* Text */}
      <div className="font-mono text-[13px] tracking-[.1em] uppercase text-[#7A7468] mb-[10px]">
        {need.location}
      </div>
      <h3
        className={[
          "font-['Fraunces'] font-normal leading-[1.18] tracking-[-0.01em] text-[#1F1B14] mb-[10px]",
          need.variant === 'featured' ? 'text-[34px] max-w-[22ch]' : 'text-[25px]',
        ].join(' ')}
      >
        {need.title}
      </h3>
      <p
        className={[
          'leading-[1.55] text-[#43392E] mb-[22px]',
          need.variant === 'featured' ? 'text-[17.5px] max-w-[54ch]' : 'text-[16.5px]',
        ].join(' ')}
      >
        {need.description}
      </p>

      {/* Progress */}
      <div className="flex justify-between items-baseline text-[14.5px] text-[#43392E] mb-[8px]">
        <span>
          <strong className="font-medium text-[#1F1B14]">{need.raised}</strong> of {need.goal}
        </span>
        <span className={`font-mono text-[13px] ${isUrgent ? 'text-[#B14A2C]' : 'text-[#3F5E48]'}`}>
          {Math.round(need.percent * 100)}%
        </span>
      </div>
      <div className="h-[3px] bg-[#D8CFBE] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full origin-left ${isUrgent ? 'bg-[#B14A2C]' : 'bg-[#3F5E48]'}`}
          style={{ transform: `scaleX(${need.percent})` }}
        />
      </div>
    </Link>
  );
}

function Interstitial() {
  const { ref, visible } = useScrollReveal();

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={[
        'col-span-full my-[24px_0_8px] grid gap-[32px] items-end',
        'grid-cols-[1.4fr_1fr] max-[780px]:grid-cols-1',
        'transition-[opacity,transform] duration-[600ms] ease-out',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[14px]',
      ].join(' ')}
    >
      {/* Wide photo */}
      <div
        className="relative aspect-[21/9] rounded-[10px] overflow-hidden"
        style={{ background: '#241e16', filter: 'saturate(0.9) contrast(1.05)' }}
      >
        <Image
          src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1400&q=85&auto=format&fit=crop"
          alt="Galmi Hospital, second shift"
          fill
          sizes="(max-width: 780px) 100vw, 58vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(20,16,10,0.4)] pointer-events-none" />
        <div className="absolute left-[14px] bottom-[12px] right-[14px] text-[#FBF8F2] font-mono text-[12px] tracking-[.12em] uppercase opacity-90 z-10">
          Galmi · Niger · 04:12, second shift
        </div>
      </div>

      {/* Quote */}
      <div className="pb-[10px]">
        <p className="font-['Fraunces'] font-light italic text-[26px] leading-[1.35] text-[#1F1B14] max-w-[28ch]">
          &ldquo;Volume tripled in five years. We deliver in the corridor when the rooms are full.&rdquo;
        </p>
        <small className="block mt-[14px] font-mono text-[12px] tracking-[.12em] uppercase text-[#7A7468]">
          Dr. Hama, Galmi Hospital
        </small>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function MissionaryNeedsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  const filtered = NEEDS.filter((n) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Urgent') return !!n.urgent;
    return n.category === activeFilter;
  });

  // Split at index 5 to insert interstitial between card 5 and 6
  const before = filtered.slice(0, 5);
  const after  = filtered.slice(5);

  return (
    <>
      {/* ── Fonts (add to your next/font or global CSS instead) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..900,30..100&family=Geist:wght@300..600&family=JetBrains+Mono:wght@400&display=swap');
        :root {
          --paper:#F4EFE6;--bone:#FBF8F2;--ink:#1F1B14;--ink-2:#43392E;--mute:#7A7468;
          --hair:#D8CFBE;--terra:#B14A2C;--moss:#3F5E48;
        }
        html { scroll-behavior: smooth; }
        body { background: var(--paper); }
        .hero-image-parallax { background-attachment: fixed; }
        @media (max-width: 900px) { .hero-image-parallax { background-attachment: scroll; } }
      `}</style>

      <div className="font-['Geist',system-ui,sans-serif] text-[18px] leading-[1.7] text-[#1F1B14] bg-[#F4EFE6] antialiased">

        {/* ── Header ── */}
        <header className="px-[clamp(24px,5vw,80px)] py-[28px] flex items-center justify-between max-w-[1240px] mx-auto">
          <Link href="/" className="font-['Fraunces'] font-normal text-[24px] tracking-[-0.01em] leading-none">
            MissionaryDoctors
          </Link>
          <nav className="flex gap-[36px] items-center">
            <Link href="#" className="hidden sm:block text-[15.5px] text-[#43392E] hover:text-[#1F1B14] transition-colors">About</Link>
            <Link href="/hospitals-page" className="hidden sm:block text-[15.5px] text-[#43392E] hover:text-[#1F1B14] transition-colors">Hospital Tours</Link>
            <Link href="#" className="hidden sm:block text-[15.5px] text-[#1F1B14] transition-colors">Missionary Needs</Link>
            <Link href="#" className="hidden sm:block text-[15.5px] text-[#43392E] hover:text-[#1F1B14] transition-colors">News</Link>
            <Link href="#" className="px-[22px] py-[11px] bg-[#1F1B14] text-[#FBF8F2] rounded-full text-[14.5px] font-medium hover:bg-[#B14A2C] transition-colors">
              Give
            </Link>
          </nav>
        </header>

        {/* ── Hero — split layout ── */}
        <section className="border-b border-[#D8CFBE]">
          <div className="grid grid-cols-[1.05fr_1fr] max-[900px]:grid-cols-1 min-h-[min(78vh,720px)] max-[900px]:min-h-0">

            {/* Copy */}
            <div className="flex flex-col justify-center px-[clamp(24px,5vw,80px)] py-[96px] max-[900px]:py-[56px] max-w-[720px] ml-auto">
              <div className="font-mono text-[13px] tracking-[.18em] uppercase text-[#7A7468] mb-[24px]">
                Missionary Needs · Updated weekly
              </div>
              <h1 className="font-['Fraunces'] font-light text-[clamp(40px,5.5vw,80px)] leading-[1.05] tracking-[-0.03em] max-w-[18ch]">
                Real needs. Real hospitals.{' '}
                <em className="italic text-[#B14A2C]">You see it through.</em>
              </h1>
              <p className="mt-[28px] text-[20px] leading-[1.55] text-[#43392E] max-w-[50ch]">
                Each hospital writes the project. We vet it. You fund a specific line item. Reports come at every milestone.
              </p>
              <div className="mt-[28px] flex flex-wrap font-mono text-[13px] tracking-[.12em] uppercase text-[#43392E] max-[680px]:flex-col max-[680px]:gap-[8px]">
                {['Tax-deductible 501(c)(3)', '100% to the project', 'Reports at every milestone'].map((t, i, arr) => (
                  <span
                    key={t}
                    className={i < arr.length - 1 ? 'pr-[18px] mr-[18px] border-r border-[#D8CFBE]' : ''}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-[44px] pt-[28px] border-t border-[#D8CFBE] grid grid-cols-3 max-[680px]:grid-cols-1 max-[680px]:gap-[20px]">
                {[
                  { value: '15',    label: 'Active needs' },
                  { value: '$982k', label: 'Raised so far' },
                  { value: '$1.84M',label: 'Still to raise' },
                ].map(({ value, label }, i) => (
                  <div
                    key={label}
                    className={[
                      i < 2 ? 'pr-[32px] border-r border-[#D8CFBE] max-[680px]:border-r-0 max-[680px]:border-b max-[680px]:pb-[20px]' : '',
                      i > 0 ? 'pl-[32px] max-[680px]:pl-0' : '',
                    ].join(' ')}
                  >
                    <strong className="block font-['Fraunces'] font-normal italic text-[38px] text-[#1F1B14] mb-[8px] tracking-[-0.02em] leading-none">
                      {value}
                    </strong>
                    <span className="font-mono text-[13px] tracking-[.1em] uppercase text-[#7A7468]">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero photo */}
            <div
              className="relative bg-[#241e16] max-[900px]:aspect-[4/3] max-[900px]:order-first hero-image-parallax"
              role="img"
              aria-label="Surgeon scrubbing in at Tenwek Hospital, before dawn."
            >
              <Image
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1400&q=85&auto=format&fit=crop"
                alt="Surgeon scrubbing in at Tenwek Hospital, before dawn"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
                className="object-cover"
                style={{ filter: 'saturate(0.92) contrast(1.04)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[55%] to-[rgba(20,16,10,0.55)] pointer-events-none" />
              <div className="absolute left-[28px] right-[28px] bottom-[24px] flex justify-between gap-[16px] text-[#FBF8F2] font-mono text-[12px] tracking-[.14em] uppercase opacity-85 z-10">
                <span>Tenwek Hospital · Bomet, Kenya</span>
                <span>05:42</span>
              </div>
            </div>

          </div>
        </section>

        {/* ── Filters ── */}
        <div className="py-[18px] border-b border-[#D8CFBE] sticky top-0 bg-[#F4EFE6] z-30">
          <div className="max-w-[1240px] mx-auto px-[clamp(24px,5vw,80px)] flex items-center gap-[20px] flex-wrap">
            <div className="flex gap-[8px] flex-wrap">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={[
                    'px-[18px] py-[9px] text-[14.5px] rounded-full transition-all',
                    activeFilter === f
                      ? 'bg-[#1F1B14] text-[#FBF8F2]'
                      : 'text-[#43392E] hover:text-[#1F1B14]',
                  ].join(' ')}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-[10px] text-[14.5px] text-[#7A7468]">
              <span>Sort</span>
              <select className="px-[12px] py-[8px] pr-[28px] border border-[#D8CFBE] rounded-[6px] bg-[#FBF8F2] text-[14.5px] text-[#1F1B14] cursor-pointer appearance-none">
                <option>Most urgent</option>
                <option>Almost funded</option>
                <option>Recently listed</option>
                <option>Largest goal</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Grid ── */}
        <section className="max-w-[1240px] mx-auto px-[clamp(24px,5vw,80px)] py-[56px_0_80px]">
          <div
            className="grid gap-x-[32px] gap-y-[44px]"
            style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
          >
            {/* Responsive column override via CSS */}
            <style>{`
              @media (max-width: 980px) { .needs-grid { grid-template-columns: repeat(2,1fr) !important; } }
              @media (max-width: 600px) { .needs-grid { grid-template-columns: 1fr !important; gap: 44px 0 !important; } }
            `}</style>

            <div className="col-span-full text-[14.5px] text-[#7A7468] -mb-[14px]">
              Showing {filtered.length} of {NEEDS.length} needs
            </div>

            {/* Cards before interstitial */}
            {before.map((need) => (
              <NeedCard key={need.id} need={need} />
            ))}

            {/* Interstitial — only shown when showing enough cards */}
            {filtered.length > 5 && <Interstitial />}

            {/* Cards after interstitial */}
            {after.map((need) => (
              <NeedCard key={need.id} need={need} />
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="pt-[72px] pb-[40px] border-t border-[#D8CFBE]">
          <div className="max-w-[1240px] mx-auto px-[clamp(24px,5vw,80px)]">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] max-[780px]:grid-cols-2 max-[480px]:grid-cols-1 gap-[48px] max-[780px]:gap-[32px] pb-[56px]">
              <div>
                <div className="font-['Fraunces'] font-normal text-[24px] tracking-[-0.01em] mb-[16px]">MissionaryDoctors</div>
                <p className="font-['Fraunces'] font-light italic text-[24px] text-[#1F1B14] leading-[1.3] max-w-[24ch]">
                  A catalog of medical mission hospitals worldwide.
                </p>
              </div>
              {[
                {
                  heading: 'Discover',
                  links: [
                    { label: 'Hospital tours', href: '/hospitals-page' },
                    { label: 'Missionary needs', href: '#' },
                    { label: 'News & field reports', href: '#' },
                    { label: 'About', href: '#' },
                  ],
                },
                {
                  heading: 'Take part',
                  links: [
                    { label: 'Apply to serve', href: '#' },
                    { label: 'Give monthly', href: '#' },
                    { label: 'For hospitals', href: '#' },
                    { label: 'Newsletter', href: '#' },
                  ],
                },
                {
                  heading: 'Trust',
                  links: [
                    { label: 'Financials', href: '#' },
                    { label: '501(c)(3) status', href: '#' },
                    { label: 'Privacy', href: '#' },
                    { label: 'Contact', href: '#' },
                  ],
                },
              ].map(({ heading, links }) => (
                <div key={heading}>
                  <h5 className="font-mono text-[13px] tracking-[.14em] uppercase text-[#7A7468] mb-[18px] font-normal">
                    {heading}
                  </h5>
                  {links.map(({ label, href }) => (
                    <Link key={label} href={href} className="block py-[6px] text-[15.5px] text-[#43392E] hover:text-[#1F1B14]">
                      {label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            <div className="pt-[28px] border-t border-[#D8CFBE] flex justify-between items-center text-[13.5px] text-[#7A7468]">
              <div>© 2026 Giving Tree Projects · Shreveport, Louisiana</div>
              <div>Powered by Giving Tree Projects</div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}