// HubLanding — pauldolden.com/code developer portfolio.
// All copy/data comes from src/content/code.ts (the in-code CMS).
import React from 'react';
import { Badge, Button, Icon } from '../../ds/index.js';
import { code } from '../../../content/code';

const HubIcon = Icon;
const ACCENTS = { magenta: 'var(--magenta-400)', cyan: 'var(--cyan-400)', purple: 'var(--purple-400)' };

function Eyebrow({ children, color = 'var(--magenta-400)' }) {
  return <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color, marginBottom: 10 }}>{children}</div>;
}
function SectionTitle({ children }) {
  return <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, letterSpacing: 0, color: 'var(--text-heading)', margin: 0 }}>{children}</h2>;
}

export function HubLanding() {
  const { brand, nav, wordsLink, resume, dev, socials, emailLabel, hero, about, experience, work, skills, contact, footer } = code;

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'var(--grad-glow)', pointerEvents: 'none', zIndex: 0 }} />

      {/* HEADER */}
      <header className="hub-header" style={{ position: 'sticky', top: 0, zIndex: 20, height: 'var(--header-h)', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 22, background: 'rgba(11,8,23,0.72)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid var(--border-faint)' }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
          <img src={brand.mark} alt="" style={{ width: 34, height: 34 }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, color: 'var(--text-strong)' }}>{brand.name} <span className="pd-grad-text">{brand.nameBold}</span></span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--text-faint)' }}>{brand.tag}</span>
        </a>
        <nav className="hub-nav" style={{ display: 'flex', gap: 2, marginLeft: 10 }}>
          {nav.map(([label, id]) => (
            <a key={id} href={`#${id}`} style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500, padding: '8px 11px', borderRadius: 'var(--r-sm)', color: 'var(--text-muted)', textDecoration: 'none' }}>{label}</a>
          ))}
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href={wordsLink.href} style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <HubIcon name="feather" size={14} color="var(--text-muted)" /> {wordsLink.label}
          </a>
          <a href={resume.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 38, padding: '0 16px', borderRadius: 'var(--r-pill)', background: 'var(--grad-sunset)', color: 'var(--text-on-neon)', fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 0 20px -6px rgba(255,46,151,0.6)' }}>
            <HubIcon name="download" size={15} color="#1a0a14" /> {resume.label}
          </a>
        </div>
      </header>

      <main id="top" style={{ position: 'relative', zIndex: 1, flex: 1 }}>
        {/* HERO */}
        <section style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border-faint)' }}>
          <img className="brand-splash" src="/assets/splash-bg.svg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.42 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,8,23,0.5), rgba(11,8,23,0.84) 72%, var(--bg-base))' }} />
          <div className="hub-hero" style={{ position: 'relative', maxWidth: 'var(--width-content)', margin: '0 auto', padding: '76px 28px 64px', display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: 40, alignItems: 'center' }}>
            <div>
              <div style={{ marginBottom: 18 }}><Badge tone="ongoing" dot>{dev.availability}</Badge></div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(40px,6vw,72px)', lineHeight: 1, color: 'var(--text-strong)', margin: 0 }}>{dev.name}</h1>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(16px,2vw,20px)', color: 'var(--cyan-400)', marginTop: 12, letterSpacing: '0.02em' }}>{dev.role}</div>
              <p style={{ marginTop: 20, maxWidth: 520, fontFamily: 'var(--font-ui)', fontSize: 18, lineHeight: 1.55, color: 'var(--text-muted)' }}>{dev.tagline}</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                <Button variant="neon" as="a" href="#work" iconRight={<HubIcon name="arrow-down" size={17} color="#1a0a14" />}>{hero.ctaPrimary}</Button>
                <Button variant="outline" as="a" href="#contact">{hero.ctaSecondary}</Button>
              </div>
              <div style={{ display: 'flex', gap: 18, marginTop: 26, flexWrap: 'wrap' }}>
                {socials.map((s) => (
                  <a key={s.id} href={s.href} title={s.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--text-faint)', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: 13 }}><HubIcon name={s.icon} size={16} color="var(--text-muted)" /> {s.label}</a>
                ))}
                <a href={`mailto:${dev.email}`} title={emailLabel} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--text-faint)', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: 13 }}><HubIcon name="mail" size={16} color="var(--text-muted)" /> {emailLabel}</a>
              </div>
            </div>
            <Terminal />
          </div>
        </section>

        <div style={{ maxWidth: 'var(--width-content)', margin: '0 auto', padding: '0 28px' }}>
          {/* ABOUT */}
          <section id="about" style={sectionStyle}>
            <Eyebrow color="var(--magenta-400)">{about.eyebrow}</Eyebrow>
            <div className="hub-about" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40, alignItems: 'start' }}>
              {/* trusted author bio (in-repo content), may contain an inline link */}
              <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontSize: 19, lineHeight: 1.65, color: 'var(--text-body)' }} dangerouslySetInnerHTML={{ __html: about.html }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {about.facts.map((f) => <Fact key={f.label} icon={f.icon} label={f.label} value={f.value} />)}
              </div>
            </div>
          </section>

          {/* EXPERIENCE */}
          <section id="experience" style={sectionStyle}>
            <Eyebrow color="var(--cyan-400)">{experience.eyebrow}</Eyebrow>
            <SectionTitle>{experience.title}</SectionTitle>
            <div style={{ marginTop: 32, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 7, top: 6, bottom: 6, width: 2, background: 'linear-gradient(180deg, var(--magenta-500), var(--purple-500), var(--cyan-500))', borderRadius: 2 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                {experience.roles.map((job, i) => <Role key={i} job={job} bullet={experience.bullet} />)}
              </div>
            </div>
          </section>

          {/* WORK */}
          <section id="work" style={sectionStyle}>
            <Eyebrow color="var(--magenta-400)">{work.eyebrow}</Eyebrow>
            <SectionTitle>{work.title}</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22, marginTop: 28 }}>
              {work.projects.map((p) => <ProjectCard key={p.name} p={p} sourceLabel={work.sourceLabel} visitLabel={work.visitLabel} />)}
            </div>
          </section>

          {/* SKILLS */}
          <section id="skills" style={sectionStyle}>
            <Eyebrow color="var(--cyan-400)">{skills.eyebrow}</Eyebrow>
            <SectionTitle>{skills.title}</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22, marginTop: 28 }}>
              {skills.groups.map((g) => (
                <div key={g.group} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '20px 22px', boxShadow: 'var(--edge-light)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 14 }}>{g.group}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {g.items.map((s) => <span key={s} style={chip}>{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" style={{ ...sectionStyle, paddingBottom: 0 }}>
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--r-xl)', border: '1px solid var(--glass-border)', background: 'var(--glass)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', padding: '44px', textAlign: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-glow)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative' }}>
                <Eyebrow color="var(--cyan-400)">{contact.eyebrow}</Eyebrow>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(30px,4vw,46px)', color: 'var(--text-strong)', margin: '0 auto 12px', maxWidth: 620 }}>
                  {contact.headingLead}<span className="pd-grad-text">{contact.headingAccent}</span>
                </h2>
                <p style={{ margin: '0 auto 26px', maxWidth: 460, fontFamily: 'var(--font-ui)', fontSize: 17, color: 'var(--text-muted)' }}>{contact.blurb}</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button variant="neon" as="a" href={`mailto:${dev.email}`} iconLeft={<HubIcon name="mail" size={16} color="#1a0a14" />}>{dev.email}</Button>
                  <Button variant="outline" as="a" href={resume.href}>{contact.resumeLabel}</Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 1, marginTop: 'var(--space-11)', borderTop: '1px solid var(--border-faint)', padding: '32px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <img src={brand.mark} alt="" style={{ width: 26, height: 26 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>{footer.domain}</span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-faint)' }}>
          <a href={wordsLink.href} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{footer.wordsLabel}</a>
          <span>{footer.copyright}</span>
        </div>
      </footer>
    </div>
  );
}

function Terminal() {
  const { terminal, dev } = code;
  return (
    <div style={{ borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', background: 'rgba(13,10,24,0.85)', boxShadow: 'var(--shadow-lg), var(--glow-purple)', overflow: 'hidden', fontFamily: 'var(--font-mono)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--magenta-500)' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--gold-500)' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: 'var(--cyan-500)' }} />
        <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-faint)' }}>{terminal.title}</span>
      </div>
      <pre style={{ margin: 0, padding: '16px 16px 20px', fontSize: 13, lineHeight: 1.8, color: 'var(--text-body)' }}>
<span style={{ color: 'var(--cyan-400)' }}>$</span> whoami{'\n'}
<span style={{ color: 'var(--paper-100)' }}>{terminal.whoamiName}</span> — {terminal.whoamiRole}{'\n'}
<span style={{ color: 'var(--cyan-400)' }}>$</span> cat stack.txt{'\n'}
<span style={{ color: 'var(--magenta-300)' }}>{dev.stackLine}</span>{'\n'}
<span style={{ color: 'var(--cyan-400)' }}>$</span> cat now.txt{'\n'}
<span style={{ color: 'var(--purple-300)' }}>{terminal.now}</span>{'\n'}
<span style={{ color: 'var(--cyan-400)' }}>$</span> <span style={{ color: 'var(--text-faint)' }}>_</span></pre>
    </div>
  );
}

function Fact({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ width: 34, height: 34, flexShrink: 0, display: 'grid', placeItems: 'center', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--cyan-400)' }}><HubIcon name={icon} size={16} color="var(--cyan-400)" /></span>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-body)', marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}

function Role({ job, bullet }) {
  return (
    <div style={{ position: 'relative', paddingLeft: 36 }}>
      <span style={{ position: 'absolute', left: 0, top: 5, width: 16, height: 16, borderRadius: '50%', background: 'var(--bg-base)', border: `2.5px solid ${job.current ? 'var(--magenta-500)' : 'var(--purple-500)'}`, boxShadow: job.current ? '0 0 12px -2px var(--magenta-500)' : 'none' }} />
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, color: 'var(--text-strong)', margin: 0 }}>
          {job.role} <span style={{ color: 'var(--magenta-300)' }}>@ {job.company}</span>
        </h3>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-faint)' }}>{job.period}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-faint)', marginTop: 4 }}>{job.location}</div>
      <p style={{ margin: '12px 0 10px', fontFamily: 'var(--font-ui)', fontSize: 15.5, lineHeight: 1.55, color: 'var(--text-body)' }}>{job.summary}</p>
      <ul style={{ margin: '0 0 14px', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {job.bullets.map((b, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, fontFamily: 'var(--font-ui)', fontSize: 14.5, lineHeight: 1.5, color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--cyan-400)', flexShrink: 0 }}>{bullet}</span> {b}
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {job.tech.map((t) => <span key={t} style={chip}>{t}</span>)}
      </div>
    </div>
  );
}

function ProjectCard({ p, sourceLabel, visitLabel }) {
  const c = ACCENTS[p.accent];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', background: 'var(--bg-raised)', padding: '24px', boxShadow: 'var(--shadow-md), var(--edge-light)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--text-strong)', margin: 0 }}>{p.name}</h3>
        <Badge tone={p.tone} dot>{p.status}</Badge>
      </div>
      <p style={{ margin: '0 0 16px', fontFamily: 'var(--font-ui)', fontSize: 15, lineHeight: 1.55, color: 'var(--text-muted)', flex: 1 }}>{p.blurb}</p>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 16 }}>
        {p.stack.map((s) => <span key={s} style={chip}>{s}</span>)}
      </div>
      <div style={{ display: 'flex', gap: 16, paddingTop: 14, borderTop: '1px solid var(--border-faint)' }}>
        <a href={p.source || '#'} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500 }}><HubIcon name="github" size={15} color="var(--text-muted)" /> {sourceLabel}</a>
        <a href={p.visit || '#'} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: c, textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600 }}><HubIcon name="external-link" size={14} color={c} /> {visitLabel}</a>
      </div>
    </div>
  );
}

const sectionStyle = { paddingTop: 'var(--space-11)', scrollMarginTop: '80px' };
const chip = { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--mist-300)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '4px 10px', whiteSpace: 'nowrap' };
