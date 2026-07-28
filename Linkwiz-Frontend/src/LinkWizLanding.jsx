import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

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

/* ─────────────── COMPONENT ─────────────── */
export default function LinkWizLanding() {
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

  useEffect(() => {
    const fn = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveStep(s => (s + 1) % 3), 3200);
    return () => clearInterval(t);
  }, []);

  const big = () => setCursorBig(true);
  const small = () => setCursorBig(false);

  return (
    <div style={R.root}>
      <style>{CSS}</style>

      {/* ── Custom Cursor ── */}
      <div style={{ ...R.cursorRing, left: cursor.x, top: cursor.y, transform: `translate(-50%,-50%) scale(${cursorBig ? 2.4 : 1})`, opacity: cursor.x ? 1 : 0 }} />
      <div style={{ ...R.cursorDot, left: cursor.x, top: cursor.y, transform: "translate(-50%,-50%)", opacity: cursor.x ? 1 : 0 }} />

      {/* ══════════ NAV ══════════ */}
      <nav style={{ ...R.nav, background: navScrolled ? "rgba(4,6,14,.9)" : "transparent", borderBottom: navScrolled ? "1px solid rgba(255,255,255,.05)" : "1px solid transparent", backdropFilter: navScrolled ? "blur(28px)" : "none" }}>
        <div style={R.navIn}>
          <div style={R.logo} onClick={() => navigate("/")} onMouseEnter={big} onMouseLeave={small}>
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
              <a key={l} href="#" className="nl" onMouseEnter={big} onMouseLeave={small}>{l}</a>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <MagneticBtn className="gBtn" onClick={() => navigate("/login")} onMouseEnter={big} onMouseLeave={small}>Log In</MagneticBtn>
            <MagneticBtn className="pBtn" onClick={() => navigate("/register")} onMouseEnter={big} onMouseLeave={small}>
              Get Started <span className="shine" />
            </MagneticBtn>
          </div>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section ref={heroRef} style={R.hero}>
        <ParticleCanvas />
        <div style={R.noise} />

        {/* Orbs */}
        {[
          { w: 700, t: "-20%", l: "-12%", c: "rgba(59,130,246,.11)", d: "12s", delay: "0s" },
          { w: 520, b: "-15%", r: "3%", c: "rgba(139,92,246,.09)", d: "16s", delay: "2s" },
          { w: 280, t: "45%", r: "32%", c: "rgba(6,182,212,.07)", d: "9s", delay: "1s" },
        ].map((o, i) => (
          <div key={i} style={{ position: "absolute", width: o.w, height: o.w, top: o.t, bottom: o.b, left: o.l, right: o.r, background: `radial-gradient(circle,${o.c} 0%,transparent 70%)`, borderRadius: "50%", pointerEvents: "none", zIndex: 0, animation: `orbDrift ${o.d} ease-in-out ${o.delay} infinite` }} />
        ))}

        {/* SVG grid decoration */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,.028)" strokeWidth="1"/>
            </pattern>
            <radialGradient id="gridFade" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="white" stopOpacity="1"/>
              <stop offset="100%" stopColor="white" stopOpacity="0"/>
            </radialGradient>
            <mask id="gridMask">
              <rect width="100%" height="100%" fill="url(#gridFade)"/>
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridMask)"/>
          <line x1="0" y1="55%" x2="45%" y2="25%" stroke="rgba(59,130,246,.05)" strokeWidth="1"/>
          <line x1="100%" y1="20%" x2="55%" y2="65%" stroke="rgba(139,92,246,.05)" strokeWidth="1"/>
          <circle cx="50%" cy="50%" r="28%" stroke="rgba(59,130,246,.04)" strokeWidth="1" fill="none" strokeDasharray="4 10"/>
          <circle cx="50%" cy="50%" r="42%" stroke="rgba(139,92,246,.03)" strokeWidth="1" fill="none" strokeDasharray="2 14"/>
        </svg>

        <div style={R.heroIn}>
          {/* ── LEFT ── */}
          <div style={{ ...R.heroL, opacity: heroVis ? 1 : 0, transform: heroVis ? "none" : "translateY(48px)", transition: "all 1s cubic-bezier(.16,1,.3,1) .1s" }}>

            <div style={R.badge} onMouseEnter={big} onMouseLeave={small}>
              <span style={R.badgePing} />
              <span style={R.badgeDot} />
              <Icons.Sparkle />
              Pakistan's First Skill Exchange Network
            </div>

            <h1 style={R.h1}>
              <span style={{ display: "block" }}>Trade Skills.</span>
              <Typewriter words={["Grow Together.", "Learn Freely.", "Pay Nothing.", "Connect Now."]} />
            </h1>

            <p style={R.heroP}>LinkWiz removes every financial barrier from education. You have knowledge — so does your next match. Swap sessions, grow together.</p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 40 }}>
              <MagneticBtn className="pBtn pBtnLg" onClick={() => navigate("/register")} onMouseEnter={big} onMouseLeave={small}>
                <span>Start Exchanging</span>
                <Icons.ArrowRight />
                <span className="shine" />
              </MagneticBtn>
              <MagneticBtn className="gBtn gBtnLg" onClick={() => navigate("/login")} onMouseEnter={big} onMouseLeave={small}>
                <span style={R.playCircle}><Icons.Play /></span>
                Watch Demo
              </MagneticBtn>
            </div>

            {/* Social proof */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex" }}>
                {[["#3b82f6","#6366f1"],["#8b5cf6","#a78bfa"],["#06b6d4","#3b82f6"],["#10b981","#059669"],["#f59e0b","#ef4444"]].map((g, i) => (
                  <div key={i} style={{ width: 35, height: 35, borderRadius: "50%", background: `linear-gradient(135deg,${g[0]},${g[1]})`, border: "2px solid #04060e", marginLeft: i > 0 ? -11 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", zIndex: 5 - i }}>
                    {["MA","SR","TK","FN","AZ"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 13, color: "#8892a4" }}><span style={{ color: "#e8edff", fontWeight: 600 }}>12,000+</span> learners exchanging daily</div>
                <div style={{ display: "flex", gap: 2, marginTop: 3 }}>
                  {[1,2,3,4,5].map(j => <Icons.StarFill key={j} size={11} />)}
                  <span style={{ color: "#8892a4", fontSize: 11, marginLeft: 4 }}>4.9 avg rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT — Floating Cards ── */}
          <div style={{ ...R.heroR, opacity: heroVis ? 1 : 0, transform: heroVis ? "none" : "translateX(60px)", transition: "all 1s cubic-bezier(.16,1,.3,1) .3s" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
              {MATCHES.map((m, i) => (
                <div key={i} className="fCard" style={{ animationDelay: `${i * .2}s`, animationDuration: `${4 + i * .6}s` }} onMouseEnter={big} onMouseLeave={small}>
                  {/* Top glint */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5, background: `linear-gradient(90deg,transparent,${m.grad[0]}80,transparent)` }} />

                  <div style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${m.grad[0]},${m.grad[1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{m.i}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "Fraunces,Georgia,serif", fontSize: 13, fontWeight: 700, color: "#e8edff" }}>{m.name}</div>
                      <div style={{ display: "flex", gap: 3, alignItems: "center", color: "#8892a4", fontSize: 10.5, marginTop: 1 }}><Icons.MapPin />{m.city}</div>
                    </div>
                    <div style={{ background: "rgba(59,130,246,.12)", border: "1px solid rgba(59,130,246,.2)", color: "#93c5fd", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 50, display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#3b82f6", animation: "pulseRing 1.5s ease-in-out infinite" }} />
                      {m.score}%
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 11 }}>
                    <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#4a5568", letterSpacing: ".1em", width: 36 }}>OFFERS</span>
                      <span className="cBlue">{m.offer}</span>
                    </div>
                    <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#4a5568", letterSpacing: ".1em", width: 36 }}>WANTS</span>
                      <span className="cGreen">{m.want}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid rgba(255,255,255,.05)", paddingTop: 10 }}>
                    <Icons.StarFill size={11} />
                    <span style={{ color: "#8892a4", fontSize: 10.5 }}>{m.rating}</span>
                    <span style={{ color: "#2d3748", fontSize: 10 }}>·</span>
                    <span style={{ color: "#8892a4", fontSize: 10.5 }}>{m.sessions} sessions</span>
                    <button className="cBtn" style={{ marginLeft: "auto" }} onClick={() => navigate("/exchange-messaging")}>Connect</button>
                  </div>
                </div>
              ))}

              {/* Live tag */}
              <div style={{ gridColumn: "1/-1", display: "flex", alignItems: "center", gap: 9, background: "rgba(52,211,153,.06)", border: "1px solid rgba(52,211,153,.14)", borderRadius: 12, padding: "10px 15px" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", display: "inline-block", animation: "pulseRing 1.5s ease-in-out infinite" }} />
                <span style={{ fontSize: 12, color: "#34d399", fontWeight: 600 }}>48 active skill sessions happening now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ width: 1, height: 42, background: "linear-gradient(to bottom,rgba(79,124,255,.55),transparent)", animation: "scrollPulse 2.2s ease-in-out infinite" }} />
          <span style={{ fontSize: 9.5, color: "#2d3748", letterSpacing: ".15em", textTransform: "uppercase" }}>Scroll</span>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section ref={statsRef} style={{ maxWidth: 1240, margin: "0 auto", padding: "70px 40px" }}>
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent)", marginBottom: 54 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, textAlign: "center", marginBottom: 54 }}>
          {STATS.map((s, i) => (
            <div key={i} onMouseEnter={big} onMouseLeave={small} style={{ opacity: statsVis ? 1 : 0, transform: statsVis ? "none" : "translateY(28px)", transition: `all .7s cubic-bezier(.16,1,.3,1) ${i * .1}s` }}>
              <div style={{ fontFamily: "Fraunces,Georgia,serif", fontSize: 54, fontWeight: 900, background: "linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.05, marginBottom: 6 }}>
                <Counter to={s.v} />
              </div>
              <div style={{ color: "#e8edff", fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{s.l}</div>
              <div style={{ color: "#4a5568", fontSize: 11.5, letterSpacing: ".04em" }}>{s.s}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent)" }} />
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section ref={stepRef} style={{ padding: "110px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="chip">Process</div>
          <h2 style={R.h2}>Three steps to your<br /><em style={R.em}>first exchange</em></h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            {/* Stepper */}
            <div style={{ position: "relative" }}>
              {/* Track */}
              <div style={{ position: "absolute", left: 21, top: 22, bottom: 22, width: 1.5, background: "rgba(255,255,255,.06)" }}>
                <div style={{ width: "100%", height: `${((activeStep + 1) / 3) * 100}%`, background: "linear-gradient(to bottom,#3b82f6,#6366f1)", transition: "height .6s ease", borderRadius: 2 }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {STEPS.map((step, i) => (
                  <div key={i} onClick={() => setActiveStep(i)} onMouseEnter={big} onMouseLeave={small}
                    style={{ display: "flex", gap: 20, padding: "24px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,.04)" : "none", cursor: "pointer", opacity: stepVis ? 1 : 0, transform: stepVis ? "none" : "translateX(-28px)", transition: `all .7s cubic-bezier(.16,1,.3,1) ${i * .15}s` }}>
                    <div style={{ width: 43, height: 43, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Fraunces,Georgia,serif", fontSize: 14, fontWeight: 900, flexShrink: 0, transition: "all .4s", background: activeStep === i ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "rgba(255,255,255,.04)", color: activeStep === i ? "#fff" : "#4a5568", border: activeStep === i ? "none" : "1px solid rgba(255,255,255,.08)" }}>
                      {step.n}
                    </div>
                    <div style={{ paddingTop: 3 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#4f7cff", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 5 }}>{step.tag}</div>
                      <div style={{ fontFamily: "Fraunces,Georgia,serif", fontSize: 19, fontWeight: 700, color: activeStep === i ? "#e8edff" : "#8892a4", marginBottom: 6, transition: "color .3s" }}>{step.title}</div>
                      <div style={{ color: "#8892a4", fontSize: 13.5, lineHeight: 1.72, maxHeight: activeStep === i ? "70px" : "0", overflow: "hidden", opacity: activeStep === i ? 1 : 0, transition: "all .5s ease" }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel */}
            <div style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 26, padding: "52px 44px", position: "relative", overflow: "hidden", opacity: stepVis ? 1 : 0, transform: stepVis ? "none" : "translateX(32px)", transition: "all .9s cubic-bezier(.16,1,.3,1) .2s" }}>
              <div style={{ position: "absolute", top: 22, right: 28, fontFamily: "Fraunces,Georgia,serif", fontSize: 72, fontWeight: 900, color: "rgba(255,255,255,.04)", lineHeight: 1 }}>{STEPS[activeStep].n}</div>
              <div style={{ color: "#3b82f6", marginBottom: 22, display: "flex" }}>
                {activeStep === 0 && <Icons.Pen />}
                {activeStep === 1 && <Icons.Users />}
                {activeStep === 2 && <Icons.CheckCircle />}
              </div>
              <h3 style={{ fontFamily: "Fraunces,Georgia,serif", fontSize: 28, fontWeight: 900, color: "#e8edff", marginBottom: 14, letterSpacing: "-.02em" }}>{STEPS[activeStep].title}</h3>
              <p style={{ color: "#8892a4", fontSize: 15, lineHeight: 1.78 }}>{STEPS[activeStep].desc}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 32 }}>
                {STEPS.map((_, i) => (
                  <div key={i} style={{ height: 3, flex: i === activeStep ? 3 : 1, borderRadius: 4, background: i === activeStep ? "linear-gradient(90deg,#3b82f6,#6366f1)" : "rgba(255,255,255,.08)", transition: "flex .5s ease" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" ref={featRef} style={{ padding: "110px 40px", background: "rgba(255,255,255,.012)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="chip">Platform</div>
          <h2 style={R.h2}>Everything you need to<br /><em style={R.em}>learn and teach</em></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {FEATURES.map(({ Icon, title, desc, color }, i) => (
              <div key={i} className="featCard" onMouseEnter={big} onMouseLeave={small}
                style={{ opacity: featVis ? 1 : 0, transform: featVis ? "none" : "translateY(42px)", transition: `all .7s cubic-bezier(.16,1,.3,1) ${i * .08}s` }}>
                <div className="fIconWrap" style={{ "--ic": color }}>
                  <Icon />
                  <div className="fIconGlow" style={{ background: `${color}22` }} />
                </div>
                <h3 style={{ fontFamily: "Fraunces,Georgia,serif", fontSize: 18.5, fontWeight: 700, color: "#e8edff", marginBottom: 10 }}>{title}</h3>
                <p style={{ color: "#8892a4", fontSize: 13.5, lineHeight: 1.76 }}>{desc}</p>
                <div className="fBar" style={{ "--ic": color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ LIVE MATCHES ══════════ */}
      <section id="community" ref={matchRef} style={{ padding: "110px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 52, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="chip">Community</div>
              <h2 style={{ ...R.h2, marginBottom: 0 }}>Live matches<br /><em style={R.em}>happening now</em></h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(52,211,153,.07)", border: "1px solid rgba(52,211,153,.15)", padding: "9px 16px", borderRadius: 50 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", animation: "pulseRing 1.5s ease-in-out infinite" }} />
              <span style={{ fontSize: 12.5, color: "#34d399", fontWeight: 600 }}>48 active sessions</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
            {MATCHES.map((m, i) => (
              <div key={i} className="mCard2" onMouseEnter={big} onMouseLeave={small}
                style={{ opacity: matchVis ? 1 : 0, transform: matchVis ? "none" : "translateY(48px)", transition: `all .7s cubic-bezier(.16,1,.3,1) ${i * .1}s` }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${m.grad[0]},${m.grad[1]})` }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                  <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${m.grad[0]},${m.grad[1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{m.i}</div>
                    <div>
                      <div style={{ fontFamily: "Fraunces,Georgia,serif", fontWeight: 700, color: "#e8edff", fontSize: 15 }}>{m.name}</div>
                      <div style={{ display: "flex", gap: 4, alignItems: "center", color: "#8892a4", fontSize: 11.5, marginTop: 2 }}><Icons.MapPin />{m.city}</div>
                    </div>
                  </div>
                  <div style={{ background: "rgba(59,130,246,.1)", border: "1px solid rgba(59,130,246,.2)", color: "#93c5fd", fontSize: 10.5, fontWeight: 700, padding: "4px 9px", borderRadius: 50, alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#3b82f6", animation: "pulseRing 1.5s ease-in-out infinite" }} />{m.score}%
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 18 }}>
                  {[{ l: "OFFERS", v: m.offer, cls: "cBlue" }, { l: "WANTS", v: m.want, cls: "cGreen" }].map(r => (
                    <div key={r.l} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 9.5, fontWeight: 700, color: "#4a5568", letterSpacing: ".1em", width: 40 }}>{r.l}</span>
                      <span className={r.cls}>{r.v}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 18 }}>
                  {[{ v: m.rating, l: "Rating" }, { v: m.sessions, l: "Sessions" }, { v: "✓", l: "Verified" }].map((s, j) => (
                    <div key={j} style={{ background: "rgba(255,255,255,.03)", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                      <div style={{ fontFamily: "Fraunces,Georgia,serif", fontWeight: 700, fontSize: 16, color: j === 2 ? "#34d399" : "#e8edff" }}>{s.v}</div>
                      <div style={{ color: "#4a5568", fontSize: 10.5, marginTop: 2 }}>{s.l}</div>
                    </div>
                  ))}
                </div>

                <button className="pBtn" style={{ width: "100%", justifyContent: "center", fontSize: 13, padding: "11px 0" }} onClick={() => navigate("/register")} onMouseEnter={big} onMouseLeave={small}>
                  Send Exchange Request <span className="shine" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section ref={testRef} style={{ padding: "110px 40px", background: "rgba(59,130,246,.02)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="chip">Stories</div>
          <h2 style={R.h2}>Real people,<br /><em style={R.em}>real exchanges</em></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="tCard" onMouseEnter={big} onMouseLeave={small}
                style={{ opacity: testVis ? 1 : 0, transform: testVis ? "none" : "translateY(42px)", transition: `all .7s cubic-bezier(.16,1,.3,1) ${i * .14}s` }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 18 }}>
                  {[1,2,3,4,5].map(j => <Icons.StarFill key={j} />)}
                </div>
                <svg style={{ position: "absolute", top: 24, right: 24 }} width="34" height="34" viewBox="0 0 24 24" fill="rgba(59,130,246,.12)">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
                </svg>
                <p style={{ color: "#c4d0e8", fontSize: 14.5, lineHeight: 1.82, marginBottom: 26, fontStyle: "italic" }}>"{t.q}"</p>
                <div style={{ display: "flex", gap: 12, alignItems: "center", borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${t.grad[0]},${t.grad[1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>{t.i}</div>
                  <div>
                    <div style={{ fontFamily: "Fraunces,Georgia,serif", fontWeight: 700, color: "#e8edff", fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: "#8892a4", fontSize: 12, marginTop: 2 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section style={{ padding: "150px 40px", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 450, background: "radial-gradient(ellipse,rgba(59,130,246,.1) 0%,transparent 68%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 450, height: 450, background: "radial-gradient(ellipse,rgba(139,92,246,.07) 0%,transparent 68%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
          <div className="chip" style={{ justifyContent: "center", display: "inline-flex" }}>Get Started</div>
          <h2 style={{ ...R.h2, fontSize: "clamp(34px,5vw,58px)", textAlign: "center" }}>
            Your next skill is<br /><em style={R.em}>one swap away.</em>
          </h2>
          <p style={{ color: "#8892a4", fontSize: 16, lineHeight: 1.82, marginBottom: 46 }}>
            Join 12,000+ learners across Pakistan growing through collaborative skill exchange. Free, forever, no credit card needed.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
            <MagneticBtn className="pBtn pBtnLg" onMouseEnter={big} onMouseLeave={small} onClick={() => navigate("/register")}>
              <span>Create Free Account</span>
              <Icons.ArrowRight />
              <span className="shine" />
            </MagneticBtn>
            <MagneticBtn className="gBtn gBtnLg" onMouseEnter={big} onMouseLeave={small} onClick={() => navigate("/browse-users")}>Browse Skills</MagneticBtn>
          </div>
          <div style={{ display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap" }}>
            {["No credit card", "Always free", "Pakistan-first"].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, color: "#8892a4", fontSize: 13 }}>
                <span style={{ color: "#34d399", display: "flex" }}><Icons.Check /></span>{l}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
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
                {["T","L","G","D"].map((s, i) => <div key={i} className="socBtn" onMouseEnter={big} onMouseLeave={small}>{s}</div>)}
              </div>
            </div>
            {[
              { t: "Platform", ls: ["How It Works","Browse Skills","Smart Matching","Dashboard"] },
              { t: "Company", ls: ["About Us","Blog","Careers","Contact"] },
              { t: "Legal", ls: ["Help Center","Safety","Terms","Privacy"] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontFamily: "Fraunces,Georgia,serif", fontWeight: 700, color: "#e8edff", fontSize: 14, marginBottom: 17 }}>{col.t}</div>
                {col.ls.map((l, j) => {
                  const onClick = () => {
                    if (l === "Dashboard") navigate("/dashboard");
                    else if (l === "Browse Skills") navigate("/browse-users");
                    else alert(`${l} page is under development`);
                  };
                  return (
                    <div key={j} className="fLink" onClick={onClick} onMouseEnter={big} onMouseLeave={small}>{l}</div>
                  );
                })}
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
  root: { fontFamily: "'DM Sans',sans-serif", background: "#04060e", color: "#e8edff", overflowX: "hidden", cursor: "auto" },
  cursorRing: { position: "fixed", width: 36, height: 36, border: "1.5px solid rgba(59,130,246,.5)", borderRadius: "50%", pointerEvents: "none", zIndex: 9999, transition: "transform .28s cubic-bezier(.16,1,.3,1)" },
  cursorDot: { position: "fixed", width: 5, height: 5, background: "#3b82f6", borderRadius: "50%", pointerEvents: "none", zIndex: 9999, transition: "left .04s, top .04s" },
  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, transition: "all .4s" },
  navIn: { maxWidth: 1240, margin: "0 auto", padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  logoBox: { width: 34, height: 34, background: "rgba(59,130,246,.12)", border: "1px solid rgba(59,130,246,.22)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { fontFamily: "Fraunces,Georgia,serif", fontSize: 21, fontWeight: 900, color: "#e8edff", letterSpacing: "-.02em" },
  navLinks: { display: "flex", gap: 36 },
  hero: { minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" },
  noise: { position: "absolute", inset: 0, zIndex: 1, opacity: .022, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "120px", pointerEvents: "none" },
  heroIn: { position: "relative", zIndex: 2, maxWidth: 1240, margin: "0 auto", padding: "120px 40px 80px", display: "flex", alignItems: "center", gap: 56, width: "100%" },
  heroL: { flex: "0 0 510px" },
  heroR: { flex: 1, display: "flex", justifyContent: "flex-end" },
  badge: { display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(59,130,246,.07)", border: "1px solid rgba(59,130,246,.16)", padding: "7px 15px", borderRadius: 50, marginBottom: 26, fontSize: 12.5, color: "#93c5fd", fontWeight: 500, letterSpacing: ".015em", cursor: "pointer", position: "relative" },
  badgePing: { position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", width: 8, height: 8, borderRadius: "50%", background: "rgba(59,130,246,.35)", animation: "pingBig 2.2s ease-out infinite" },
  badgeDot: { width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", flexShrink: 0, marginLeft: 8 },
  h1: { fontFamily: "Fraunces,Georgia,serif", fontSize: "clamp(42px,5.2vw,72px)", fontWeight: 900, lineHeight: 1.07, color: "#e8edff", marginBottom: 22, letterSpacing: "-.03em" },
  heroP: { color: "#8892a4", fontSize: 15.5, lineHeight: 1.82, marginBottom: 34, maxWidth: 420 },
  playCircle: { width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center" },
  h2: { fontFamily: "Fraunces,Georgia,serif", fontSize: "clamp(30px,4vw,52px)", fontWeight: 900, color: "#e8edff", lineHeight: 1.12, marginBottom: 58, letterSpacing: "-.025em" },
  em: { fontStyle: "italic", background: "linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; }

  @keyframes orbDrift {
    0%,100% { transform:translate(0,0) scale(1); }
    33% { transform:translate(28px,-18px) scale(1.04); }
    66% { transform:translate(-18px,14px) scale(.97); }
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes pulseRing {
    0% { box-shadow:0 0 0 0 rgba(59,130,246,.5); }
    70% { box-shadow:0 0 0 7px rgba(59,130,246,0); }
    100% { box-shadow:0 0 0 0 rgba(59,130,246,0); }
  }
  @keyframes pingBig {
    0% { transform:translateY(-50%) scale(1); opacity:.55; }
    100% { transform:translateY(-50%) scale(2.8); opacity:0; }
  }
  @keyframes floatCard {
    0%,100% { transform:translateY(0); }
    50% { transform:translateY(-11px); }
  }
  @keyframes scrollPulse {
    0%,100% { opacity:.35; transform:scaleY(1); }
    50% { opacity:1; transform:scaleY(1.18); }
  }
  @keyframes shine {
    0% { left:-120%; }
    100% { left:160%; }
  }

  .nl { color:#4a5568; text-decoration:none; font-size:14px; font-weight:500; cursor:pointer; transition:color .2s; position:relative; padding-bottom:2px; }
  .nl::after { content:''; position:absolute; bottom:0; left:0; width:0; height:1px; background:#3b82f6; transition:width .3s cubic-bezier(.16,1,.3,1); }
  .nl:hover { color:#e8edff; }
  .nl:hover::after { width:100%; }

  .pBtn {
    background: linear-gradient(135deg,#3b82f6 0%,#6366f1 100%);
    color: #fff;
    border: none;
    padding: 12px 26px;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    position: relative;
    overflow: hidden;
    letter-spacing: .01em;
    transition: box-shadow .3s;
  }
  .pBtn:hover { box-shadow: 0 16px 50px rgba(59,130,246,.42); }
  .pBtnLg { padding:15px 32px; font-size:15px; border-radius:14px; }

  .gBtn {
    background: transparent;
    color: #8892a4;
    border: 1.5px solid rgba(255,255,255,.09);
    padding: 11px 22px;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: border-color .2s, color .2s, background .2s;
  }
  .gBtn:hover { border-color:rgba(59,130,246,.38); color:#e8edff; background:rgba(59,130,246,.05); }
  .gBtnLg { padding:14px 28px; font-size:15px; border-radius:14px; }

  .shine {
    position: absolute;
    top: 0;
    left: -120%;
    width: 55%;
    height: 100%;
    background: linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);
    transform: skewX(-18deg);
    pointer-events: none;
  }
  .pBtn:hover .shine { animation: shine .55s ease forwards; }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 10.5px;
    font-weight: 700;
    color: #3b82f6;
    letter-spacing: .18em;
    text-transform: uppercase;
    margin-bottom: 16px;
    background: rgba(59,130,246,.08);
    border: 1px solid rgba(59,130,246,.15);
    padding: 5px 12px;
    border-radius: 50px;
  }

  .cBlue { display:inline-flex; align-items:center; background:rgba(59,130,246,.11); border:1px solid rgba(59,130,246,.22); color:#93c5fd; padding:3.5px 11px; border-radius:50px; font-size:12px; font-weight:600; }
  .cGreen { display:inline-flex; align-items:center; background:rgba(16,185,129,.1); border:1px solid rgba(16,185,129,.22); color:#6ee7b7; padding:3.5px 11px; border-radius:50px; font-size:12px; font-weight:600; }

  .fCard {
    background: rgba(255,255,255,.034);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 18px;
    padding: 17px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    animation: floatCard ease-in-out infinite;
    transition: transform .3s, border-color .3s, box-shadow .3s;
  }
  .fCard:hover { transform:translateY(-5px) !important; animation-play-state:paused !important; border-color:rgba(59,130,246,.3) !important; box-shadow:0 22px 60px rgba(59,130,246,.13); }

  .cBtn { background:transparent; border:1px solid rgba(255,255,255,.09); color:#8892a4; font-size:10.5px; padding:4px 10px; border-radius:8px; cursor:pointer; font-family:'DM Sans'; transition:.2s; font-weight:600; letter-spacing:.01em; }
  .cBtn:hover { border-color:#3b82f6; color:#93c5fd; }

  .featCard {
    background: rgba(255,255,255,.024);
    border: 1px solid rgba(255,255,255,.06);
    border-radius: 20px;
    padding: 32px 26px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: transform .35s cubic-bezier(.16,1,.3,1), border-color .3s, box-shadow .3s;
  }
  .featCard:hover { transform:translateY(-7px); border-color:rgba(59,130,246,.22); box-shadow:0 28px 70px rgba(59,130,246,.1); }
  .featCard:hover .fIconWrap { transform:scale(1.1) translateY(-2px); }
  .featCard:hover .fBar { transform:scaleX(1) !important; }

  .fIconWrap {
    width: 52px;
    height: 52px;
    background: rgba(59,130,246,.1);
    border: 1px solid rgba(59,130,246,.2);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    color: var(--ic, #60a5fa);
    position: relative;
    overflow: hidden;
    transition: transform .35s cubic-bezier(.16,1,.3,1);
  }
  .fIconGlow { position:absolute; inset:0; opacity:0; transition:opacity .3s; }
  .featCard:hover .fIconGlow { opacity:1; }

  .fBar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--ic, #3b82f6), transparent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform .45s cubic-bezier(.16,1,.3,1);
  }

  .mCard2 {
    background: rgba(255,255,255,.03);
    border: 1px solid rgba(255,255,255,.06);
    border-radius: 20px;
    padding: 22px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform .35s cubic-bezier(.16,1,.3,1), border-color .3s, box-shadow .3s;
  }
  .mCard2:hover { transform:translateY(-7px); border-color:rgba(59,130,246,.24); box-shadow:0 28px 70px rgba(59,130,246,.12); }

  .tCard {
    background: rgba(255,255,255,.024);
    border: 1px solid rgba(255,255,255,.06);
    border-radius: 20px;
    padding: 30px 26px;
    position: relative;
    cursor: pointer;
    transition: transform .35s cubic-bezier(.16,1,.3,1), border-color .3s, box-shadow .3s;
  }
  .tCard:hover { transform:translateY(-7px); border-color:rgba(59,130,246,.22); box-shadow:0 28px 70px rgba(59,130,246,.1); }

  .socBtn { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); display:flex; align-items:center; justify-content:center; color:#8892a4; font-size:12px; font-weight:700; cursor:pointer; transition:.22s; }
  .socBtn:hover { background:rgba(59,130,246,.1); border-color:rgba(59,130,246,.22); color:#93c5fd; }

  .fLink { color:#4a5568; font-size:13.5px; margin-bottom:12px; cursor:pointer; transition:color .2s; }
  .fLink:hover { color:#e8edff; }

  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:#04060e; }
  ::-webkit-scrollbar-thumb { background:rgba(59,130,246,.28); border-radius:3px; }
  ::-webkit-scrollbar-thumb:hover { background:rgba(59,130,246,.48); }
`;