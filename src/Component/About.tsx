import { useEffect, useRef, useState } from "react";
import { KeyRound, Wifi, Users } from "lucide-react";

// Reveals an element once it scrolls into view, then stays revealed.
function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

const features = [
  {
    icon: KeyRound,
    title: "Fast in, fast out",
    body: "Self check-in from 2pm with a digital key on your phone. No queueing behind someone else's booking issue.",
  },
  {
    icon: Wifi,
    title: "Wifi that works",
    body: "Fibre backup on every floor, because plenty of guests are working remotely between city stops.",
  },
  {
    icon: Users,
    title: "A common room people use",
    body: "Free breakfast at a shared table, not a buffet line. Most nights someone's cooking something worth trying.",
  },
];

const milestones = [
  { year: "2020", text: "One rented floor, 12 beds, and a check-in app running off a spreadsheet." },
  { year: "2022", text: "Took over the full building — rooftop lounge and a proper coworking corner." },
  { year: "2024", text: "Rolled out phone-based digital keys across every room." },
];

function FeatureCard({ icon: Icon, title, body, index }: { icon: typeof KeyRound; title: string; body: string; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: inView ? `${index * 120}ms` : "0ms" }}
      className={`bg-slate-900 border border-slate-700 rounded-xl p-6 transition-all duration-700 ease-out hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-indigo-400" />
      </div>
      <h2 className="text-sm font-semibold !text-white mb-1">{title}</h2>
      <p className="text-slate-400 text-sm">{body}</p>
    </div>
  );
}

function TimelineItem({ year, text, index }: { year: string; text: string; index: number }) {
  const { ref, inView } = useInView<HTMLLIElement>();
  return (
    <li
      ref={ref}
      style={{ transitionDelay: inView ? `${index * 150}ms` : "0ms" }}
      className={`flex gap-4 transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      }`}
    >
      <span className="text-indigo-400 font-mono w-14 flex-shrink-0">{year}</span>
      <span className="text-slate-400">{text}</span>
    </li>
  );
}

const About = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <style>{`
        @keyframes floatGlow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(12px, -16px); }
        }
        .glow-orb {
          animation: floatGlow 9s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .glow-orb { animation: none; }
        }
      `}</style>

      {/* ambient background glow */}
      <div
        className="glow-orb pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto relative">
        <p
          className={`text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-3 transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          About us
        </p>
        <h1
          className={`text-3xl sm:text-4xl !text-white font-bold mb-4 transition-all duration-700 ease-out delay-100 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Travel light. We'll handle the logistics.
        </h1>
        <p
          className={`text-slate-400   mx-auto max-w-4xl pt-8 mb-12 transition-all duration-700 pb-5 ease-out delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          HostelEase started with a shared frustration: too many nights spent waiting at a
          front desk for someone to find a reservation. So we built the hostel we wished
          existed — digital key, real people, zero paperwork.
        </p>

        <div className="grid sm:grid-cols-3 gap-5 mb-14 pt-10">
          {features.map((f, i) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} body={f.body} index={i} />
          ))}
        </div>

        <div className="border-t border-slate-800 pt-10">
          <h2 className="text-lg font-semibold !text-white mb-4">How we got here</h2>
          <ul className="space-y-4 text-sm">
            {milestones.map((m, i) => (
              <TimelineItem key={m.year} year={m.year} text={m.text} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
