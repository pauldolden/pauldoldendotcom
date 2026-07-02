// HubLanding — pauldolden.com/code developer portfolio.
// All copy/data comes from src/content/code.ts (the in-code CMS).
import React from 'react';
import { Badge, Button, Icon } from '../../ds/index.js';
import { MobileDrawer } from '../MobileDrawer.jsx';
import { code } from '../../../content/code';

const HubIcon = Icon;
const ACCENTS = { magenta: 'var(--magenta-400)', cyan: 'var(--cyan-400)', purple: 'var(--purple-400)' };

const SECTION = 'pt-20 scroll-mt-20';
const DRAWER_ROW = 'flex items-center gap-[11px] rounded-md px-3 py-[13px] font-sans text-base font-medium text-body no-underline';
const CHIP = 'rounded-sm border border-line px-2.5 py-1 font-code text-xs text-mist-300 whitespace-nowrap';

function Eyebrow({ children, color = 'var(--magenta-400)' }) {
  return <div className="mb-2.5 font-code text-xs uppercase tracking-[0.18em]" style={{ color }}>{children}</div>;
}
function SectionTitle({ children }) {
  return <h2 className="m-0 font-heading text-[32px] font-bold text-heading">{children}</h2>;
}

export function HubLanding() {
  const { brand, nav, wordsLink, resume, dev, socials, emailLabel, hero, about, experience, work, skills, contact, footer } = code;
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-full flex-col bg-canvas">
      <div className="pointer-events-none fixed inset-0 z-0 bg-grad-glow" />

      {/* HEADER */}
      <header className="sticky top-0 z-20 flex h-[var(--header-h)] items-center gap-[22px] border-b border-line-faint bg-[rgba(11,8,23,0.72)] px-7 backdrop-blur-[14px]">
        <a href="#top" className="flex items-center gap-[11px] no-underline">
          <img src={brand.mark} alt="" className="h-[34px] w-[34px]" />
          {/* Dual-voice wordmark: mono "paul" + serif-italic "dolden" in --accent (pink). */}
          <span className="inline-flex items-baseline">
            <span className="font-code text-[17px] font-medium tracking-[-0.01em] text-strong">{brand.codeWord}</span>
            <span className="ml-px font-serif text-[21px] font-medium italic text-accent">{brand.wordsWord}</span>
          </span>
          <span className="font-code text-[11px] tracking-[0.12em] text-faint">{brand.tag}</span>
        </a>
        <nav className="ml-2.5 flex gap-0.5 max-[900px]:hidden">
          {nav.map(([label, id]) => (
            <a key={id} href={`#${id}`} className="rounded-sm px-[11px] py-2 font-sans text-sm font-medium text-muted no-underline">{label}</a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3 max-[900px]:hidden">
          <a href={wordsLink.href} className="inline-flex items-center gap-1.5 font-code text-[13px] text-muted no-underline">
            <HubIcon name="feather" size={14} color="var(--text-muted)" /> {wordsLink.label}
          </a>
          <a href={resume.href} className="inline-flex h-[38px] items-center gap-[7px] bg-grad-sunset px-[18px] font-heading text-sm font-bold uppercase tracking-[0.09em] text-on-neon no-underline [clip-path:polygon(9px_0,100%_0,100%_calc(100%-9px),calc(100%-9px)_100%,0_100%,0_9px)] [filter:drop-shadow(0_0_16px_rgba(255,46,151,0.55))]">
            <HubIcon name="download" size={15} color="#1a0a14" /> {resume.label}
          </a>
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          title="Menu"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className="hidden h-[38px] w-[38px] place-items-center rounded-sm border border-transparent bg-transparent cursor-pointer max-[900px]:grid"
        >
          <HubIcon name="menu" color="var(--text-strong)" />
        </button>
      </header>

      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} label="Menu">
        {nav.map(([label, id]) => (
          <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} className={DRAWER_ROW}>{label}</a>
        ))}
        <span className="mx-1 my-2 h-px bg-line-faint" />
        <a href={wordsLink.href} className={DRAWER_ROW}>
          <HubIcon name="feather" size={17} color="var(--text-muted)" /> {wordsLink.label}
        </a>
        <a href={resume.href} onClick={() => setMenuOpen(false)} className={`${DRAWER_ROW} text-magenta-300`}>
          <HubIcon name="download" size={17} color="var(--magenta-400)" /> {resume.label}
        </a>
      </MobileDrawer>

      <main id="top" className="relative z-[1] flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-line-faint">
          <img className="brand-splash absolute inset-0 h-full w-full object-cover opacity-[0.42]" src="/assets/splash-bg.svg" alt="" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,8,23,0.5),rgba(11,8,23,0.84)_72%,var(--bg-base))]" />
          <div className="relative mx-auto grid max-w-content grid-cols-[1.25fr_0.75fr] items-center gap-10 px-7 pb-16 pt-[76px] max-[860px]:grid-cols-1">
            <div>
              <div className="mb-[18px]"><Badge tone="ongoing" dot>{dev.availability}</Badge></div>
              <h1 className="m-0 font-heading text-[clamp(40px,6vw,72px)] font-bold leading-none text-strong">{dev.name}</h1>
              <div className="mt-3 font-code text-[clamp(16px,2vw,20px)] tracking-[0.02em] text-cyan-400">{dev.role}</div>
              <p className="mt-5 max-w-[520px] font-sans text-[18px] leading-[1.55] text-muted">{dev.tagline}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button variant="neon" tech as="a" href="#work" iconRight={<HubIcon name="arrow-down" size={17} color="#1a0a14" />}>{hero.ctaPrimary}</Button>
                <Button variant="outline" tech as="a" href="#contact">{hero.ctaSecondary}</Button>
              </div>
              <div className="mt-[26px] flex flex-wrap gap-[18px]">
                {socials.map((s) => (
                  <a key={s.id} href={s.href} title={s.label} className="inline-flex items-center gap-[7px] font-sans text-[13px] text-faint no-underline"><HubIcon name={s.icon} size={16} color="var(--text-muted)" /> {s.label}</a>
                ))}
                <a href={`mailto:${dev.email}`} title={emailLabel} className="inline-flex items-center gap-[7px] font-sans text-[13px] text-faint no-underline"><HubIcon name="mail" size={16} color="var(--text-muted)" /> {emailLabel}</a>
              </div>
            </div>
            <Terminal />
          </div>
        </section>

        <div className="mx-auto max-w-content px-7">
          {/* ABOUT */}
          <section id="about" className={SECTION}>
            <Eyebrow color="var(--magenta-400)">{about.eyebrow}</Eyebrow>
            <div className="grid grid-cols-[1.4fr_1fr] items-start gap-10 max-[860px]:grid-cols-1">
              {/* trusted author bio (in-repo content), may contain an inline link */}
              <p className="m-0 font-sans text-[19px] leading-[1.65] text-body" dangerouslySetInnerHTML={{ __html: about.html }} />
              <div className="flex flex-col gap-3">
                {about.facts.map((f) => <Fact key={f.label} icon={f.icon} label={f.label} value={f.value} />)}
              </div>
            </div>
          </section>

          {/* EXPERIENCE */}
          <section id="experience" className={SECTION}>
            <Eyebrow color="var(--cyan-400)">{experience.eyebrow}</Eyebrow>
            <SectionTitle>{experience.title}</SectionTitle>
            <div className="relative mt-8">
              <div className="absolute bottom-1.5 left-[7px] top-1.5 w-0.5 rounded-[2px] bg-accent" />
              <div className="flex flex-col gap-[30px]">
                {experience.roles.map((job, i) => <Role key={i} job={job} bullet={experience.bullet} />)}
              </div>
            </div>
          </section>

          {/* WORK */}
          <section id="work" className={SECTION}>
            <Eyebrow color="var(--magenta-400)">{work.eyebrow}</Eyebrow>
            <SectionTitle>{work.title}</SectionTitle>
            <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[22px]">
              {work.projects.map((p) => <ProjectCard key={p.name} p={p} sourceLabel={work.sourceLabel} visitLabel={work.visitLabel} />)}
            </div>
          </section>

          {/* SKILLS */}
          <section id="skills" className={SECTION}>
            <Eyebrow color="var(--cyan-400)">{skills.eyebrow}</Eyebrow>
            <SectionTitle>{skills.title}</SectionTitle>
            <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[22px]">
              {skills.groups.map((g) => (
                <div key={g.group} className="rounded-lg border border-line bg-raised px-[22px] py-5 shadow-edge">
                  <div className="mb-3.5 font-code text-xs uppercase tracking-[0.1em] text-faint">{g.group}</div>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((s) => <span key={s} className={CHIP}>{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" className={`${SECTION} pb-0`}>
            <div className="relative overflow-hidden rounded-xl border border-glass-line bg-glass p-11 text-center backdrop-blur-[14px]">
              <div className="pointer-events-none absolute inset-0 bg-grad-glow" />
              <div className="relative">
                <Eyebrow color="var(--cyan-400)">{contact.eyebrow}</Eyebrow>
                <h2 className="mx-auto mb-3 max-w-[620px] font-heading text-[clamp(30px,4vw,46px)] font-bold text-strong">
                  {contact.headingLead}<span className="pd-grad-text">{contact.headingAccent}</span>
                </h2>
                <p className="mx-auto mb-[26px] max-w-[460px] font-sans text-[17px] text-muted">{contact.blurb}</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button variant="neon" as="a" href={`mailto:${dev.email}`} iconLeft={<HubIcon name="mail" size={16} color="#1a0a14" />}>{dev.email}</Button>
                  <Button variant="outline" tech as="a" href={resume.href}>{contact.resumeLabel}</Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-[1] mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-line-faint px-7 py-8">
        <div className="flex items-center gap-[11px]">
          <img src={brand.mark} alt="" className="h-[26px] w-[26px]" />
          <span className="font-code text-xs uppercase tracking-wider text-faint">{footer.domain}</span>
        </div>
        <div className="flex items-center gap-4 font-sans text-[13px] text-faint">
          <a href={wordsLink.href} className="text-muted no-underline">{footer.wordsLabel}</a>
          <span>{footer.copyright}</span>
        </div>
      </footer>
    </div>
  );
}

function Terminal() {
  const { terminal, dev } = code;
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-[rgba(13,10,24,0.85)] font-code shadow-[var(--shadow-lg),var(--glow-purple)]">
      <div className="flex items-center gap-[7px] border-b border-line px-[14px] py-2.5">
        <span className="h-[11px] w-[11px] rounded-full bg-magenta-500" />
        <span className="h-[11px] w-[11px] rounded-full bg-gold-500" />
        <span className="h-[11px] w-[11px] rounded-full bg-cyan-500" />
        <span className="ml-2 text-xs text-faint">{terminal.title}</span>
      </div>
      <pre className="m-0 px-4 pb-5 pt-4 text-[13px] leading-[1.8] text-body">
<span className="text-cyan-400">$</span> whoami{'\n'}
<span className="text-paper-100">{terminal.whoamiName}</span> — {terminal.whoamiRole}{'\n'}
<span className="text-cyan-400">$</span> cat stack.txt{'\n'}
<span className="text-magenta-300">{dev.stackLine}</span>{'\n'}
<span className="text-cyan-400">$</span> cat now.txt{'\n'}
<span className="text-purple-300">{terminal.now}</span>{'\n'}
<span className="text-cyan-400">$</span> <span className="text-faint">_</span></pre>
    </div>
  );
}

function Fact({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-md border border-line bg-surface text-cyan-400"><HubIcon name={icon} size={16} color="var(--cyan-400)" /></span>
      <div>
        <div className="font-code text-[11px] uppercase tracking-[0.1em] text-faint">{label}</div>
        <div className="mt-0.5 font-sans text-[15px] text-body">{value}</div>
      </div>
    </div>
  );
}

function Role({ job, bullet }) {
  return (
    <div className="relative pl-9">
      <span className={`absolute left-0 top-[5px] h-4 w-4 rounded-full border-[2.5px] bg-canvas ${job.current ? 'border-magenta-500 shadow-[0_0_12px_-2px_var(--magenta-500)]' : 'border-purple-500'}`} />
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="m-0 font-heading text-[21px] font-bold text-strong">
          {job.role} <span className="text-magenta-300">@ {job.company}</span>
        </h3>
        <span className="font-code text-[13px] text-faint">{job.period}</span>
      </div>
      <div className="mt-1 font-code text-xs text-faint">{job.location}</div>
      <p className="mb-2.5 mt-3 font-sans text-[15.5px] leading-[1.55] text-body">{job.summary}</p>
      <ul className="mb-3.5 mt-0 flex list-none flex-col gap-[7px] pl-0">
        {job.bullets.map((b, i) => (
          <li key={i} className="flex gap-2.5 font-sans text-[14.5px] leading-[1.5] text-muted">
            <span className="shrink-0 text-cyan-400">{bullet}</span> {b}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-[7px]">
        {job.tech.map((t) => <span key={t} className={CHIP}>{t}</span>)}
      </div>
    </div>
  );
}

function ProjectCard({ p, sourceLabel, visitLabel }) {
  const c = ACCENTS[p.accent];
  return (
    <div className="flex flex-col rounded-lg border border-line bg-raised p-6 shadow-[var(--shadow-md),var(--edge-light)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="m-0 font-heading text-[22px] font-bold text-strong">{p.name}</h3>
        <Badge tone={p.tone} dot>{p.status}</Badge>
      </div>
      <p className="mb-4 mt-0 flex-1 font-sans text-[15px] leading-[1.55] text-muted">{p.blurb}</p>
      <div className="mb-4 flex flex-wrap gap-[7px]">
        {p.stack.map((s) => <span key={s} className={CHIP}>{s}</span>)}
      </div>
      <div className="flex gap-4 border-t border-line-faint pt-3.5">
        <a href={p.source || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-sans text-[13px] font-medium text-muted no-underline"><HubIcon name="github" size={15} color="var(--text-muted)" /> {sourceLabel}</a>
        <a href={p.visit || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-sans text-[13px] font-semibold no-underline" style={{ color: c }}><HubIcon name="external-link" size={14} color={c} /> {visitLabel}</a>
      </div>
    </div>
  );
}
