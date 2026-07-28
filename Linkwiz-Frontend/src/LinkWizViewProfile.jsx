import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userService from "./services/userService";
import reviewService from "./services/reviewService";
import exchangeService from "./services/exchangeService";


/* ─────────────── SVG ICON SYSTEM ─────────────── */
const Icons = {
  Zap: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  Brain: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  ),
  Chat: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth="2"/>
    </svg>
  ),
  Shield: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  Star: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Search: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="8" y1="11" x2="14" y2="11"/>
      <line x1="11" y1="8" x2="11" y2="14"/>
    </svg>
  ),
  Grid: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <path d="M14 17.5h7M17.5 14v7"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Play: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  Check: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Exchange: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  ),
  Sparkle: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.727 12.727.707.707M3 12h1m16 0h1M4.22 19.78l.707-.707m12.727-12.727.707-.707M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  StarFill: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#f59e0b">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Pen: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
};

/* ─────────────── PARTICLE CANVAS ─────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const ptRef = useRef([]);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    let W = c.width = window.innerWidth;
    let H = c.height = window.innerHeight;

    const onResize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    const onMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);

    ptRef.current = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.4 + .4,
      a: Math.random() * .45 + .08,
      hue: Math.random() > .55 ? 215 : 255,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      const pts = ptRef.current;
      const { x: mx, y: my } = mouseRef.current;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const dx = mx - p.x, dy = my - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 110) { p.vx -= dx / d * .055; p.vy -= dy / d * .055; }
        p.vx *= .982; p.vy *= .982;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},75%,68%,${p.a})`;
        ctx.fill();

        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dd = Math.hypot(p.x - q.x, p.y - q.y);
          if (dd < 95) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(79,124,255,${.13 * (1 - dd / 95)})`;
            ctx.lineWidth = .5;
            ctx.stroke();
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

/* ─────────────── MAGNETIC BUTTON ─────────────── */
function MagneticBtn({ children, className, style, onClick, strength = 0.38 }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    ref.current.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
  };
  const onLeave = () => { ref.current.style.transform = "translate(0,0) scale(1)"; };
  return (
    <button ref={ref} className={className} style={{ ...style, transition: "transform .4s cubic-bezier(.34,1.56,.64,1), box-shadow .3s" }}
      onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}>
      {children}
    </button>
  );
}

/* ─────────────── SCROLL REVEAL ─────────────── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

/* ─────────────── ANIMATED COUNTER ─────────────── */
function Counter({ to }) {
  const [n, setN] = useState(0);
  const [ref, vis] = useReveal(0.3);
  const num = parseInt(to.replace(/\D/g, "")) || 0;
  const suffix = to.replace(/[0-9]/g, "");
  useEffect(() => {
    if (!vis || !num) return;
    let cur = 0;
    const step = Math.ceil(num / 90);
    const t = setInterval(() => { cur = Math.min(cur + step, num); setN(cur); if (cur >= num) clearInterval(t); }, 18);
    return () => clearInterval(t);
  }, [vis, num]);
  return <span ref={ref}>{num ? `${n}${suffix}` : to}</span>;
}

/* ─────────────── TYPEWRITER ─────────────── */
function Typewriter({ words, speed = 85, pause = 1600 }) {
  const [text, setText] = useState("");
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[wi];
    const delay = del ? speed / 2 : speed;
    const t = setTimeout(() => {
      if (!del) {
        if (ci < word.length) { setText(word.slice(0, ci + 1)); setCi(c => c + 1); }
        else setTimeout(() => setDel(true), pause);
      } else {
        if (ci > 0) { setText(word.slice(0, ci - 1)); setCi(c => c - 1); }
        else { setDel(false); setWi(w => (w + 1) % words.length); }
      }
    }, delay);
    return () => clearTimeout(t);
  }, [ci, del, wi]);
  return (
    <span style={{ color: "#7ca8ff" }}>
      {text}
      <span style={{ borderRight: "2.5px solid #7ca8ff", animation: "blink .7s step-end infinite", marginLeft: 1 }}>&nbsp;</span>
    </span>
  );
}

/* ─────────────── DATA ─────────────── */
const MATCHES = [
  { i: "MA", name: "Maira A.", city: "Islamabad", offer: "Python", want: "Guitar", score: 97, sessions: 12, rating: 4.9, grad: ["#3b82f6", "#6366f1"] },
  { i: "SR", name: "Sana R.", city: "Lahore", offer: "UX Design", want: "Marketing", score: 94, sessions: 8, rating: 4.8, grad: ["#8b5cf6", "#a78bfa"] },
  { i: "TK", name: "Tariq K.", city: "Karachi", offer: "Arabic", want: "French", score: 91, sessions: 15, rating: 5.0, grad: ["#06b6d4", "#3b82f6"] },
  { i: "FN", name: "Fatima N.", city: "Rawalpindi", offer: "Photography", want: "Web Dev", score: 88, sessions: 6, rating: 4.7, grad: ["#10b981", "#06b6d4"] },
];

const FEATURES = [
  { Icon: Icons.Brain, title: "Smart Matching", desc: "Proprietary skill-vector algorithm finds your ideal exchange partner with 97% compatibility.", color: "#3b82f6" },
  { Icon: Icons.Chat, title: "Real-time Chat", desc: "WebSocket-powered live messaging with read receipts, file sharing and session scheduling.", color: "#8b5cf6" },
  { Icon: Icons.Shield, title: "Verified & Safe", desc: "Every user verified. Report, block, escalate — moderation responds within 2 hours.", color: "#06b6d4" },
  { Icon: Icons.Star, title: "Reputation System", desc: "Build credibility through peer reviews. Your rating is your passport to better matches.", color: "#f59e0b" },
  { Icon: Icons.Search, title: "Precision Search", desc: "Filter by skill, city, availability, proficiency, and rating. Find exactly who you need.", color: "#10b981" },
  { Icon: Icons.Grid, title: "Live Dashboard", desc: "Track every exchange at a glance — pending, active, completed — with full history.", color: "#ec4899" },
];

const STEPS = [
  { n: "01", tag: "Profile", title: "Build your profile", desc: "List what you know and what you want to learn. Specify proficiency, city, and goals.", Icon: Icons.Pen },
  { n: "02", tag: "Match", title: "Get paired instantly", desc: "Our algorithm runs in real time — scored matches appear ranked by mutual compatibility.", Icon: Icons.Users },
  { n: "03", tag: "Exchange", title: "Teach & learn", desc: "Chat, schedule, exchange, and rate. Your reputation grows with every completed session.", Icon: Icons.CheckCircle },
];

const STATS = [
  { v: "12K+", l: "Active Learners", s: "across Pakistan" },
  { v: "340+", l: "Skills Available", s: "and growing fast" },
  { v: "98%", l: "Match Satisfaction", s: "peer-reviewed" },
  { v: "0 PKR", l: "Always Free", s: "forever, no catch" },
];

const TESTIMONIALS = [
  { q: "I taught Python, learned guitar. Zero rupees spent. This completely changed how I think about education.", name: "Sarah Ahmed", role: "CS Student, NUST", i: "SA", grad: ["#3b82f6", "#6366f1"] },
  { q: "Three months on LinkWiz and I pivoted careers entirely. Marketing for UX design — best trade I ever made.", name: "Ahmed Raza", role: "Marketing Executive", i: "AR", grad: ["#8b5cf6", "#a78bfa"] },
  { q: "The review system kept everything accountable. Four sessions of design for four sessions of code. Flawless.", name: "Fatima Khan", role: "Freelance Designer", i: "FK", grad: ["#10b981", "#06b6d4"] },
];


const S = {
  nl: { color: "#4a5568", textDecoration: "none", fontSize: 14, fontWeight: 500, cursor: "none", transition: "color .2s", position: "relative", paddingBottom: 2 },
  pBtn: { background: "linear-gradient(135deg,#3b82f6 0%,#6366f1 100%)", color: "#fff", border: "none", padding: "12px 26px", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: "none", display: "inline-flex", alignItems: "center", gap: 9, position: "relative", overflow: "hidden", letterSpacing: ".01em", transition: "box-shadow .3s" },
  gBtn: { background: "transparent", color: "#8892a4", border: "1.5px solid rgba(255,255,255,.09)", padding: "11px 22px", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, cursor: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "border-color .2s, color .2s, background .2s" },
  chip: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 700, color: "#3b82f6", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 16, background: "rgba(59,130,246,.08)", border: "1px solid rgba(59,130,246,.15)", padding: "5px 12px", borderRadius: 50 },
  cBlue: { display: "inline-flex", alignItems: "center", background: "rgba(59,130,246,.11)", border: "1px solid rgba(59,130,246,.22)", color: "#93c5fd", padding: "3.5px 11px", borderRadius: 50, fontSize: 12, fontWeight: 600 },
  cGreen: { display: "inline-flex", alignItems: "center", background: "rgba(16,185,129,.1)", border: "1px solid rgba(16,185,129,.22)", color: "#6ee7b7", padding: "3.5px 11px", borderRadius: 50, fontSize: 12, fontWeight: 600 },
  fCard: { background: "rgba(255,255,255,.034)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 18, padding: 17, position: "relative", overflow: "hidden", cursor: "none", transition: "transform .3s, border-color .3s, box-shadow .3s" },
  cBtn: { background: "transparent", border: "1px solid rgba(255,255,255,.09)", color: "#8892a4", fontSize: 10.5, padding: "4px 10px", borderRadius: 8, cursor: "none", fontFamily: "'DM Sans'", transition: ".2s", fontWeight: 600, letterSpacing: ".01em" },
  featCard: { background: "rgba(255,255,255,.024)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 20, padding: "32px 26px", position: "relative", overflow: "hidden", cursor: "none", transition: "transform .35s cubic-bezier(.16,1,.3,1), border-color .3s, box-shadow .3s" },
  mCard2: { background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 20, padding: 22, cursor: "none", position: "relative", overflow: "hidden", transition: "transform .35s cubic-bezier(.16,1,.3,1), border-color .3s, box-shadow .3s" },
  tCard: { background: "rgba(255,255,255,.024)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 20, padding: "30px 26px", position: "relative", cursor: "none", transition: "transform .35s cubic-bezier(.16,1,.3,1), border-color .3s, box-shadow .3s" },
  socBtn: { width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8892a4", fontSize: 12, fontWeight: 700, cursor: "none", transition: ".22s" },
  fLink: { color: "#4a5568", fontSize: 13.5, marginBottom: 12, cursor: "none", transition: "color .2s" },
  formInput: { width: "100%", background: "rgba(255,255,255,.03)", border: "1.5px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "14px 16px", color: "#e8edff", fontFamily: "'DM Sans', sans-serif", fontSize: 14, transition: "all .2s", outline: "none", cursor: "none" },
  formCheckbox: { width: 16, height: 16, accentColor: "#3b82f6", cursor: "none" },
};


function HoverLink({ href, children, onMouseEnter, onMouseLeave, style = {} }) {
  const [h, setH] = useState(false);
  return (
    <a href={href} 
       onMouseEnter={(e) => { setH(true); if(onMouseEnter) onMouseEnter(e); }} 
       onMouseLeave={(e) => { setH(false); if(onMouseLeave) onMouseLeave(e); }}
       style={{ ...S.nl, color: h ? "#e8edff" : S.nl.color, ...style }}>
      {children}
      <div style={{ position: "absolute", bottom: 0, left: 0, height: 1, background: "#3b82f6", width: h ? "100%" : "0%", transition: "width .3s" }} />
    </a>
  );
}

function PrimaryBtn({ children, onMouseEnter, onMouseLeave, style = {}, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button 
      onMouseEnter={(e) => { setH(true); if(onMouseEnter) onMouseEnter(e); }} 
      onMouseLeave={(e) => { setH(false); if(onMouseLeave) onMouseLeave(e); }}
      onClick={onClick}
      style={{ ...S.pBtn, boxShadow: h ? "0 16px 50px rgba(59,130,246,.42)" : "none", ...style }}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onMouseEnter, onMouseLeave, style = {}, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button 
      onMouseEnter={(e) => { setH(true); if(onMouseEnter) onMouseEnter(e); }} 
      onMouseLeave={(e) => { setH(false); if(onMouseLeave) onMouseLeave(e); }}
      onClick={onClick}
      style={{ ...S.gBtn, border: h ? "1.5px solid rgba(59,130,246,.38)" : S.gBtn.border, color: h ? "#e8edff" : S.gBtn.color, background: h ? "rgba(59,130,246,.05)" : S.gBtn.background, ...style }}>
      {children}
    </button>
  );
}

function HoverCard({ children, onMouseEnter, onMouseLeave, style = {} }) {
  const [h, setH] = useState(false);
  const base = { ...S.fCard, ...style };
  return (
    <div 
      onMouseEnter={(e) => { setH(true); if(onMouseEnter) onMouseEnter(e); }} 
      onMouseLeave={(e) => { setH(false); if(onMouseLeave) onMouseLeave(e); }}
      style={{ ...base, transform: h ? "translateY(-5px)" : base.transform || "none", borderColor: h ? "rgba(59,130,246,.3)" : base.border, boxShadow: h ? "0 22px 60px rgba(59,130,246,.13)" : "none" }}>
      {children}
    </div>
  );
}

function FormInput({ type="text", placeholder, onMouseEnter, onMouseLeave, style = {}, defaultValue, rows }) {
  const [f, setF] = useState(false);
  const st = { ...S.formInput, background: f ? "rgba(59,130,246,.05)" : S.formInput.background, border: f ? "1.5px solid rgba(59,130,246,.4)" : S.formInput.border, boxShadow: f ? "0 0 0 3px rgba(59,130,246,.1)" : "none", ...style };
  if (rows) return <textarea rows={rows} placeholder={placeholder} defaultValue={defaultValue} onFocus={()=>setF(true)} onBlur={()=>setF(false)} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={st} />;
  return <input type={type} placeholder={placeholder} defaultValue={defaultValue} onFocus={()=>setF(true)} onBlur={()=>setF(false)} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={st} />;
}

function AnimatedOrb({ w, t, b, l, r, c, d, rev }) {
  const ref = useRef(null);
  useEffect(() => {
    if(!ref.current) return;
    const anim = ref.current.animate([
      { transform: "translate(0,0) scale(1)" },
      { transform: "translate(28px,-18px) scale(1.04)" },
      { transform: "translate(-18px,14px) scale(.97)" },
      { transform: "translate(0,0) scale(1)" }
    ], { duration: d, iterations: Infinity, direction: rev ? "reverse" : "normal", easing: "ease-in-out" });
    return () => anim.cancel();
  }, [d, rev]);
  return <div ref={ref} style={{ position: "absolute", width: w, height: w, top: t, bottom: b, left: l, right: r, background: `radial-gradient(circle,${c} 0%,transparent 70%)`, borderRadius: "50%", pointerEvents: "none", zIndex: 0 }} />;
}

/* ─────────────── COMPONENT ─────────────── */
export default function LinkWizViewProfile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [navScrolled, setNavScrolled] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [cursorBig, setCursorBig] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const [heroRef, heroVis] = useReveal(0);
  const [statsRef, statsVis] = useReveal(0.15);
  const [stepRef, stepVis] = useReveal(0.1);
  const [featRef, featVis] = useReveal(0.1);
  const [matchRef, matchVis] = useReveal(0.1);
  const [testRef, testVis] = useReveal(0.1);

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 44);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const big = useCallback(() => setCursorBig(true), []);
  const small = useCallback(() => setCursorBig(false), []);

  useEffect(() => {
    const fn = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const data = await userService.getUserById(id);

console.log("PROFILE USER:", data);
console.log("PROFILE SERVICES:", data.services);

setUser(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, [id]);
if (loading) {
  return <div>Loading...</div>;
}

if (!user) {
  return <div>User not found</div>;
}
const sendExchangeRequest = async () => {
  try {
    const currentUser = await userService.getCurrentUser();

    if (!currentUser.services?.length) {
      alert("Create a service first.");
      return;
    }

    if (!user.services?.length) {
      alert("This user has no services.");
      return;
    }

    await exchangeService.createExchange({
      provider: user._id,
      serviceOffered: currentUser.services[0]._id,
      serviceRequested: user.services[0]._id,
      message: "Let's exchange skills"
    });

    alert("Exchange request sent!");

  } catch (err) {
    console.error("EXCHANGE ERROR:", err);
    alert("Failed to send exchange request");
  }
};
  return (
    <div style={R.root}>
      {/* ── Custom Cursor ── */}
      <div style={{ ...R.cursorRing, left: cursor.x, top: cursor.y, transform: `translate(-50%,-50%) scale(${cursorBig ? 2.4 : 1})`, opacity: cursor.x ? 1 : 0 }} />
      <div style={{ ...R.cursorDot, left: cursor.x, top: cursor.y, transform: "translate(-50%,-50%)", opacity: cursor.x ? 1 : 0 }} />


      <nav style={{ ...R.nav, background: navScrolled ? "rgba(4,6,14,.9)" : "transparent", borderBottom: navScrolled ? "1px solid rgba(255,255,255,.05)" : "1px solid transparent", backdropFilter: navScrolled ? "blur(28px)" : "none" }}>
        <div style={R.navIn}>
          <div style={R.logo} onClick={() => navigate("/dashboard")} onMouseEnter={big} onMouseLeave={small}>
            <div style={R.logoBox}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#zap)"/>
                <defs><linearGradient id="zap" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs>
              </svg>
            </div>
            <span style={R.logoText}>LinkWiz</span>
          </div>

          <div style={R.navLinks}>
            {["Features", "How It Works", "Community"].map(l => (
              <HoverLink key={l} href="#" onMouseEnter={big} onMouseLeave={small}>{l}</HoverLink>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <GhostBtn onClick={() => navigate("/login")} onMouseEnter={big} onMouseLeave={small}>Log In</GhostBtn>
            <PrimaryBtn onClick={() => navigate("/register")} onMouseEnter={big} onMouseLeave={small}>Get Started</PrimaryBtn>
          </div>
        </div>
      </nav>

      <section style={{ paddingTop: "140px", paddingBottom: "100px", minHeight: "100vh" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 40px" }}>
          
          <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 24, padding: "50px", position: "relative", overflow: "hidden", marginBottom: 40, textAlign: "center" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#8b5cf6,#a78bfa)" }} />
          <div
  style={{
    width: 96,
    height: 96,
    borderRadius: "50%",
    background: `linear-gradient(
      135deg,
      ${user.grad?.[0] || "#3b82f6"},
      ${user.grad?.[1] || "#6366f1"}
    )`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    fontWeight: 700,
    color: "#fff",
    margin: "0 auto 20px"
  }}
>
  {user.fullName
    ?.split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()}
</div>
            
            <h1 style={{ fontFamily: "Fraunces,Georgia,serif", fontSize: 36, fontWeight: 900, color: "#e8edff", marginBottom: 8 }}>{user.fullName}</h1>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, color: "#8892a4", fontSize: 14, marginBottom: 24 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icons.MapPin /> {user.city || "Pakistan"}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icons.StarFill size={14} /> 4.8 Rating (8 Reviews)</span>
            </div>

            <p style={{ fontSize: 15, color: "#c4d0e8", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 30px" }}>
              {user.bio || "No bio available"}
            </p>

            <PrimaryBtn
  style={{ padding: "15px 32px", fontSize: 15 }}
  onClick={sendExchangeRequest}
  onMouseEnter={big}
  onMouseLeave={small}
>
  Send Exchange Request
</PrimaryBtn>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }}>
            <HoverCard onMouseEnter={big} onMouseLeave={small} style={{ padding: "32px 26px" }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "#93c5fd", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><Icons.Sparkle /> {user.fullName?.split(" ")[0]} Offers</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {user.skills?.map(s => (
  <span key={s} style={{...S.cBlue, fontSize: 14, padding: "8px 16px"}}>
    {s}
  </span>
))}
            </div>
            </HoverCard>
            
            <HoverCard onMouseEnter={big} onMouseLeave={small} style={{ padding: "32px 26px" }}>
  <h3
    style={{
      fontSize: 12,
      fontWeight: 700,
      color: "#6ee7b7",
      letterSpacing: ".1em",
      textTransform: "uppercase",
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
      gap: 8
    }}
  >
    <Icons.Search />
    {user.fullName?.split(" ")[0]} Wants
  </h3>

  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
    {user.wantedSkills?.map(s => (
      <span
        key={s}
        style={{
          ...S.cGreen,
          fontSize: 14,
          padding: "8px 16px"
        }}
      >
        {s}
      </span>
    ))}
  </div>
</HoverCard>
</div>
          <div>
            <h3 style={{ fontFamily: "Fraunces,Georgia,serif", fontSize: 24, fontWeight: 700, color: "#e8edff", marginBottom: 24 }}>Recent Reviews</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {TESTIMONIALS.slice(0,2).map((t, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,.015)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 16, padding: "24px" }}>
                  <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                    {[1,2,3,4,5].map(j => <Icons.StarFill key={j} size={12} />)}
                  </div>
                  <p style={{ color: "#8892a4", fontSize: 14, lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>"{user.fullName?.split(" ")[0]} is a fantastic mentor for marketing. Very clear and patient!"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${t.grad[0]},${t.grad[1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>{t.i}</div>
                    <div style={{ fontSize: 13, color: "#e8edff", fontWeight: 600 }}>{t.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      
      <footer style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "62px 40px 42px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 50, marginBottom: 52 }}>
            <div>
              <div style={{ ...R.logo, marginBottom: 15 }}>
                <div style={R.logoBox}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#zap2)"/>
                    <defs><linearGradient id="zap2" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs>
                  </svg>
                </div>
                <span style={R.logoText}>LinkWiz</span>
              </div>
              <p style={{ color: "#4a5568", fontSize: 13, lineHeight: 1.76, maxWidth: 210, marginBottom: 22 }}>Democratizing education through skill exchange. Built at Fatima Jinnah Women University.</p>
              <div style={{ display: "flex", gap: 9 }}>
                {["T","L","G","D"].map((s, i) => <div key={i} style={S.socBtn} onMouseEnter={big} onMouseLeave={small}>{s}</div>)}
              </div>
            </div>
            {[
              { t: "Platform", ls: ["How It Works","Browse Skills","Smart Matching","Dashboard"] },
              { t: "Company", ls: ["About Us","Blog","Careers","Contact"] },
              { t: "Legal", ls: ["Help Center","Safety","Terms","Privacy"] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontFamily: "Fraunces,Georgia,serif", fontWeight: 700, color: "#e8edff", fontSize: 14, marginBottom: 17 }}>{col.t}</div>
                {col.ls.map((l, j) => <div key={j} style={S.fLink} onMouseEnter={big} onMouseLeave={small}>{l}</div>)}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 22, borderTop: "1px solid rgba(255,255,255,.04)", flexWrap: "wrap", gap: 12 }}>
            <span style={{ color: "#2d3748", fontSize: 12.5 }}>© 2024 LinkWiz · Department of Software Engineering · FJWU</span>
            <span style={{ color: "#2d3748", fontSize: 12.5 }}>Crafted with precision in 🇵🇰 Pakistan</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════ STYLES ═══════════════ */
const R = {
  root: { fontFamily: "'DM Sans',sans-serif", background: "#04060e", color: "#e8edff", overflowX: "hidden", cursor: "none" },
  cursorRing: { position: "fixed", width: 36, height: 36, border: "1.5px solid rgba(59,130,246,.5)", borderRadius: "50%", pointerEvents: "none", zIndex: 9999, transition: "transform .28s cubic-bezier(.16,1,.3,1)" },
  cursorDot: { position: "fixed", width: 5, height: 5, background: "#3b82f6", borderRadius: "50%", pointerEvents: "none", zIndex: 9999, transition: "left .04s, top .04s" },
  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, transition: "all .4s" },
  navIn: { maxWidth: 1240, margin: "0 auto", padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { display: "flex", alignItems: "center", gap: 10, cursor: "none" },
  logoBox: { width: 34, height: 34, background: "rgba(59,130,246,.12)", border: "1px solid rgba(59,130,246,.22)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { fontFamily: "Fraunces,Georgia,serif", fontSize: 21, fontWeight: 900, color: "#e8edff", letterSpacing: "-.02em" },
  navLinks: { display: "flex", gap: 36 },
  hero: { minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" },
  noise: { position: "absolute", inset: 0, zIndex: 1, opacity: .022, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "120px", pointerEvents: "none" },
  heroIn: { position: "relative", zIndex: 2, maxWidth: 1240, margin: "0 auto", padding: "120px 40px 80px", display: "flex", alignItems: "center", gap: 56, width: "100%" },
  heroL: { flex: "0 0 510px" },
  heroR: { flex: 1, display: "flex", justifyContent: "flex-end" },
  badge: { display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(59,130,246,.07)", border: "1px solid rgba(59,130,246,.16)", padding: "7px 15px", borderRadius: 50, marginBottom: 26, fontSize: 12.5, color: "#93c5fd", fontWeight: 500, letterSpacing: ".015em", cursor: "none", position: "relative" },
  badgePing: { position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", width: 8, height: 8, borderRadius: "50%", background: "rgba(59,130,246,.35)", animation: "pingBig 2.2s ease-out infinite" },
  badgeDot: { width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", flexShrink: 0, marginLeft: 8 },
  h1: { fontFamily: "Fraunces,Georgia,serif", fontSize: "clamp(42px,5.2vw,72px)", fontWeight: 900, lineHeight: 1.07, color: "#e8edff", marginBottom: 22, letterSpacing: "-.03em" },
  heroP: { color: "#8892a4", fontSize: 15.5, lineHeight: 1.82, marginBottom: 34, maxWidth: 420 },
  playCircle: { width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center" },
  h2: { fontFamily: "Fraunces,Georgia,serif", fontSize: "clamp(30px,4vw,52px)", fontWeight: 900, color: "#e8edff", lineHeight: 1.12, marginBottom: 58, letterSpacing: "-.025em" },
  em: { fontStyle: "italic", background: "linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
};

