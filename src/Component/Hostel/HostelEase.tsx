import { useState } from "react";
import { Phone, Mail, MapPin, Clock, ArrowRight, Wifi, KeyRound, Users } from "lucide-react";

const COLORS = {
  ink: "#1E1B3A",
  indigoDeep: "#241F5C",
  indigo: "#4A3FB8",
  indigoSoft: "#8B80E8",
  lavender: "#F4F2FC",
  coral: "#F0663E",
  slate: "#6B6591",
  line: "rgba(30,27,58,0.12)",
};

type Page = "about" | "contact";

export default function HostEase() {
  const [page, setPage] = useState<Page>("about");

  return (
    <div
      style={{
        background: COLORS.lavender,
        color: COLORS.ink,
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        .he-display { font-family: 'Sora', sans-serif; }
        .he-mono { font-family: 'JetBrains Mono', monospace; }
        .he-nav-link { text-decoration: none; padding-bottom: 3px; border-bottom: 2px solid transparent; transition: border-color .2s, color .2s; cursor: pointer; background: none; border-top: none; border-left: none; border-right: none; }
        .he-nav-link:hover { border-bottom-color: ${COLORS.coral}; }
        .he-btn { transition: transform .15s, box-shadow .15s; cursor: pointer; }
        .he-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(74,63,184,0.28); }
        .he-card { transition: transform .2s, box-shadow .2s; }
        .he-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(30,27,58,0.08); }
        @media (prefers-reduced-motion: reduce) {
          .he-card, .he-btn { transition: none; }
        }
      `}</style>

      {/* soft indigo glow backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 12% 8%, rgba(139,128,232,0.16) 0, transparent 40%), radial-gradient(circle at 90% 70%, rgba(240,102,62,0.08) 0, transparent 45%)",
        }}
      />

      {/* HEADER */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(244,242,252,0.9)",
          backdropFilter: "blur(6px)",
          borderBottom: `1px solid ${COLORS.line}`,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "18px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="he-display" style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: "1.25rem", color: COLORS.indigoDeep }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: COLORS.indigo,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "0.9rem",
                fontWeight: 800,
              }}
            >
              H
            </span>
            HostEase
          </div>
          <nav style={{ display: "flex", gap: 28, fontSize: "0.92rem", fontWeight: 600 }}>
            <button
              className="he-nav-link"
              onClick={() => setPage("about")}
              style={{ color: page === "about" ? COLORS.indigoDeep : COLORS.slate, borderBottomColor: page === "about" ? COLORS.coral : "transparent" }}
            >
              About
            </button>
            <button
              className="he-nav-link"
              onClick={() => setPage("contact")}
              style={{ color: page === "contact" ? COLORS.indigoDeep : COLORS.slate, borderBottomColor: page === "contact" ? COLORS.coral : "transparent" }}
            >
              Contact
            </button>
          </nav>
        </div>
      </header>

      <main style={{ position: "relative", zIndex: 1 }}>
        {page === "about" ? <AboutView onGoContact={() => setPage("contact")} /> : <ContactView />}
      </main>

      <footer
        style={{
          borderTop: `1px solid ${COLORS.line}`,
          padding: "30px 28px",
          textAlign: "center",
          fontSize: "0.75rem",
          color: COLORS.slate,
        }}
        className="he-mono"
      >
        HostEase · Thamel, Kathmandu, Nepal
      </footer>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="he-mono"
      style={{
        fontSize: "0.72rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: COLORS.coral,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span style={{ width: 26, height: 2, background: COLORS.coral, borderRadius: 2, display: "inline-block" }} />
      {children}
    </span>
  );
}

function WaveDivider() {
  return (
    <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 40 }}>
      <path d="M0,30 C150,60 300,0 450,30 C600,60 750,0 900,30 C1050,60 1150,15 1200,30" fill="none" stroke={COLORS.indigoSoft} strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

function AboutView({ onGoContact }: { onGoContact: () => void }) {
  return (
    <>
      {/* HERO */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "80px 28px 40px",
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: 50,
          alignItems: "end",
        }}
      >
        <div>
          <Eyebrow>Thamel · Kathmandu</Eyebrow>
          <h1
            className="he-display"
            style={{
              fontWeight: 800,
              fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
              lineHeight: 1.08,
              margin: "18px 0 20px",
              color: COLORS.indigoDeep,
            }}
          >
            Travel light. We'll handle the <span style={{ color: COLORS.coral }}>logistics</span>.
          </h1>
          <p style={{ fontSize: "1.08rem", maxWidth: "44ch", color: COLORS.slate }}>
            HostEase is a hostel built around one idea: the best part of your trip shouldn't be the check-in
            desk. Tap in with your phone, drop your bag, and go — we'll be here when you're back.
          </p>
        </div>
        <div
          style={{
            justifySelf: "end",
            width: 160,
            height: 160,
            borderRadius: 28,
            background: `linear-gradient(145deg, ${COLORS.indigo}, ${COLORS.indigoDeep})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: "0 20px 40px rgba(74,63,184,0.28)",
            transform: "rotate(4deg)",
          }}
        >
          <KeyRound size={54} strokeWidth={1.5} />
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
        <WaveDivider />
      </div>

      {/* STORY */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 28px 60px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 50 }}>
        <h2 className="he-display" style={{ fontWeight: 700, fontSize: "1.9rem", color: COLORS.indigoDeep }}>
          Our story
        </h2>
        <div>
          <p style={{ marginBottom: 16, maxWidth: "62ch", color: COLORS.ink }}>
            HostEase started with a shared frustration: three friends who'd spent enough nights waiting at
            front desks for someone to find their reservation. So they built the hostel they wished existed —
            digital key, real people, zero paperwork.
          </p>
          <p style={{ marginBottom: 16, maxWidth: "62ch", color: COLORS.ink }}>
            Today, one house in Thamel holds 40 beds, a coworking corner that actually has decent wifi, and a
            rooftop where most of the friendships in our guestbook seem to have started.
          </p>
          <p style={{ maxWidth: "62ch", color: COLORS.ink }}>
            We're still small on purpose. Every guest gets a text from a real staff member before arrival —
            not a bot, just someone making sure you know how to get in.
          </p>
        </div>
      </section>

      {/* PRINCIPLES */}
      <div style={{ background: COLORS.indigoDeep, color: "#fff", borderRadius: 24, maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ padding: "60px 44px" }}>
          <Eyebrow>What ease means here</Eyebrow>
          <h2 className="he-display" style={{ fontWeight: 700, fontSize: "1.9rem", margin: "10px 0 0" }}>
            Three things we optimise for
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 40 }}>
            {[
              { icon: <KeyRound size={20} />, title: "Fast in, fast out", body: "Self check-in from 2pm, digital key on your phone. No queueing behind someone else's booking issue." },
              { icon: <Wifi size={20} />, title: "Actually works wifi", body: "Fibre backup on every floor, because half of you are working remotely between city stops." },
              { icon: <Users size={20} />, title: "A common room people use", body: "Free breakfast at a shared table, not a buffet line. Most nights someone's cooking something worth trying." },
            ].map((c) => (
              <div key={c.title} className="he-card" style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "26px 22px" }}>
                <div style={{ color: COLORS.coral, marginBottom: 12 }}>{c.icon}</div>
                <h3 className="he-display" style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: "0.92rem", color: "rgba(255,255,255,0.78)" }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "70px 28px 60px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 50 }}>
        <h2 className="he-display" style={{ fontWeight: 700, fontSize: "1.9rem", color: COLORS.indigoDeep }}>
          How we got here
        </h2>
        <div style={{ borderLeft: `2px solid ${COLORS.line}`, paddingLeft: 34, display: "flex", flexDirection: "column", gap: 34 }}>
          {[
            { year: "2020", title: "One rented floor", body: "Started with 12 beds and a homemade check-in app running off a spreadsheet." },
            { year: "2022", title: "Full house, 40 beds", body: "Took over the building, added the rooftop lounge and a proper coworking corner." },
            { year: "2024", title: "Self check-in goes live", body: "Rolled out phone-based digital keys across every room after guests kept asking for it." },
            { year: "2026", title: "Second location scouted", body: "Looking at a spot in Pokhara — same model, different view." },
          ].map((item) => (
            <div key={item.year} style={{ position: "relative" }}>
              <span
                className="he-mono"
                style={{
                  position: "absolute",
                  left: -34,
                  top: 0,
                  transform: "translateX(-100%)",
                  fontSize: "0.72rem",
                  color: COLORS.slate,
                  width: 56,
                  textAlign: "right",
                }}
              >
                {item.year}
              </span>
              <span
                style={{
                  position: "absolute",
                  left: -41,
                  top: 5,
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: COLORS.coral,
                  border: `2px solid ${COLORS.lavender}`,
                  outline: `1px solid ${COLORS.coral}`,
                }}
              />
              <h4 className="he-display" style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 4, color: COLORS.indigoDeep }}>
                {item.title}
              </h4>
              <p style={{ fontSize: "0.94rem", color: COLORS.slate, maxWidth: "52ch" }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto 80px",
          padding: "50px 40px",
          borderRadius: 24,
          background: "#fff",
          border: `1px solid ${COLORS.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <h3 className="he-display" style={{ fontSize: "1.5rem", fontWeight: 700, color: COLORS.indigoDeep }}>
          Ready to book your stay?
        </h3>
        <button
          className="he-btn"
          onClick={onGoContact}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "0.95rem",
            background: COLORS.indigo,
            color: "#fff",
            padding: "14px 28px",
            border: "none",
            borderRadius: 12,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Get in touch <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
}

function ContactView() {
  return (
    <>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 28px 40px" }}>
        <Eyebrow>Reach the front desk</Eyebrow>
        <h1
          className="he-display"
          style={{
            fontWeight: 800,
            fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)",
            lineHeight: 1.1,
            margin: "18px 0 16px",
            color: COLORS.indigoDeep,
          }}
        >
          Questions before you book? Skip the bot, talk to us.
        </h1>
        <p style={{ fontSize: "1.05rem", maxWidth: "56ch", color: COLORS.slate }}>
          No call centre, no automated queue — just whoever's on shift at the desk. Reach out any time and
          we'll get back to you the same day.
        </p>
      </div>

      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "20px 28px 70px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
      >
        <ContactCard icon={<Phone size={20} />} tag="01 — Call or text" title="Phone">
          <a href="tel:+9779800000000" style={{ color: COLORS.ink, textDecoration: "none", fontWeight: 700, fontSize: "1.15rem" }} className="he-mono">
            +977 980-000-0000
          </a>
          <p style={{ fontSize: "0.88rem", color: COLORS.slate, marginTop: 6 }}>Best for same-day questions and last-minute arrivals.</p>
        </ContactCard>

        <ContactCard icon={<Mail size={20} />} tag="02 — Write to us" title="Email">
          <a href="mailto:test@gmail.com" style={{ color: COLORS.ink, textDecoration: "none", fontWeight: 700, fontSize: "1.15rem" }} className="he-mono">
            test@gmail.com
          </a>
          <p style={{ fontSize: "0.88rem", color: COLORS.slate, marginTop: 6 }}>Best for bookings, group stays, and longer questions.</p>
        </ContactCard>

        <ContactCard icon={<MapPin size={20} />} tag="03 — Find us" title="Address">
          <p style={{ fontWeight: 700, fontSize: "1rem" }}>Jyatha Road, Thamel</p>
          <p style={{ fontWeight: 700, fontSize: "1rem" }}>Kathmandu, Nepal</p>
          <p style={{ fontSize: "0.88rem", color: COLORS.slate, marginTop: 6 }}>Two minutes' walk from Thamel Chowk.</p>
        </ContactCard>

        <ContactCard icon={<Clock size={20} />} tag="04 — Front desk hours" title="Hours">
          <p style={{ fontWeight: 700, fontSize: "1rem" }}>24 hours, every day</p>
          <p style={{ fontSize: "0.88rem", color: COLORS.slate, marginTop: 6 }}>Self check-in means someone's always effectively "in."</p>
        </ContactCard>
      </section>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
        <WaveDivider />
      </div>

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 28px 90px", textAlign: "center" }}>
        <p className="he-mono" style={{ fontSize: "0.78rem", color: COLORS.slate, letterSpacing: "0.06em" }}>
          WE TYPICALLY REPLY WITHIN A FEW HOURS, KATHMANDU TIME (NPT, UTC+5:45)
        </p>
      </section>
    </>
  );
}

function ContactCard({
  icon,
  tag,
  title,
  children,
}: {
  icon: React.ReactNode;
  tag: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="he-card"
      style={{
        border: `1px solid ${COLORS.line}`,
        borderRadius: 18,
        padding: "28px 26px",
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, color: COLORS.indigo }}>
        {icon}
        <span className="he-mono" style={{ fontSize: "0.68rem", color: COLORS.coral, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {tag}
        </span>
      </div>
      <h3 className="he-display" style={{ fontWeight: 700, fontSize: "1.15rem", marginBottom: 10, color: COLORS.indigoDeep }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
