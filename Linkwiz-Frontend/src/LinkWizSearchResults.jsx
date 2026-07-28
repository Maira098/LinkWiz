import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import userService from "./services/userService";


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

/* ─────────────── DATA ─────────────── */
const MATCHES = [
  { i: "MA", name: "Maira A.", city: "Islamabad", offer: "Python", want: "Guitar", score: 97, sessions: 12, rating: 4.9, grad: ["#3b82f6", "#6366f1"] },
  { i: "SR", name: "Sana R.", city: "Lahore", offer: "UX Design", want: "Marketing", score: 94, sessions: 8, rating: 4.8, grad: ["#8b5cf6", "#a78bfa"] },
  { i: "TK", name: "Tariq K.", city: "Karachi", offer: "Arabic", want: "French", score: 91, sessions: 15, rating: 5.0, grad: ["#06b6d4", "#3b82f6"] },
  { i: "FN", name: "Fatima N.", city: "Rawalpindi", offer: "Photography", want: "Web Dev", score: 88, sessions: 6, rating: 4.7, grad: ["#10b981", "#06b6d4"] },
  { i: "AS", name: "Ali S.", city: "Islamabad", offer: "React", want: "Data Science", score: 85, sessions: 3, rating: 4.5, grad: ["#ec4899", "#f43f5e"] },
  { i: "ZK", name: "Zainab K.", city: "Lahore", offer: "SEO", want: "Python", score: 82, sessions: 20, rating: 4.9, grad: ["#f59e0b", "#d97706"] },
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
  mCard2: { background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 20, padding: 22, cursor: "none", position: "relative", overflow: "hidden", transition: "transform .35s cubic-bezier(.16,1,.3,1), border-color .3s, box-shadow .3s", display: "flex", flexDirection: "column" },
  tCard: { background: "rgba(255,255,255,.024)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 20, padding: "30px 26px", position: "relative", cursor: "none", transition: "transform .35s cubic-bezier(.16,1,.3,1), border-color .3s, box-shadow .3s" },
  socBtn: { width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8892a4", fontSize: 12, fontWeight: 700, cursor: "none", transition: ".22s" },
  fLink: { color: "#4a5568", fontSize: 13.5, marginBottom: 12, cursor: "none", transition: "color .2s" },
  formInput: { width: "100%", background: "rgba(255,255,255,.03)", border: "1.5px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "14px 16px", color: "#e8edff", fontFamily: "'DM Sans', sans-serif", fontSize: 14, transition: "all .2s", outline: "none", cursor: "none" },
  formCheckbox: { width: 16, height: 16, accentColor: "#3b82f6", cursor: "none" },
};

function HoverLink({ href, children, onMouseEnter, onMouseLeave, onClick, style = {} }) {
  const [h, setH] = useState(false);
  return (
    <a href={href} onClick={onClick}
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
    <button type="button"
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
    <button type="button"
      onMouseEnter={(e) => { setH(true); if(onMouseEnter) onMouseEnter(e); }} 
      onMouseLeave={(e) => { setH(false); if(onMouseLeave) onMouseLeave(e); }}
      onClick={onClick}
      style={{ ...S.gBtn, border: h ? "1.5px solid rgba(59,130,246,.38)" : S.gBtn.border, color: h ? "#e8edff" : S.gBtn.color, background: h ? "rgba(59,130,246,.05)" : S.gBtn.background, ...style }}>
      {children}
    </button>
  );
}

function HoverCard({ children, onMouseEnter, onMouseLeave, onClick, style = {} }) {
  const [h, setH] = useState(false);
  const base = { ...S.mCard2, ...style };
  return (
    <div 
      onClick={onClick}
      onMouseEnter={(e) => { setH(true); if(onMouseEnter) onMouseEnter(e); }} 
      onMouseLeave={(e) => { setH(false); if(onMouseLeave) onMouseLeave(e); }}
      style={{ ...base, transform: h ? "translateY(-5px)" : base.transform || "none", borderColor: h ? "rgba(59,130,246,.3)" : base.border, boxShadow: h ? "0 22px 60px rgba(59,130,246,.13)" : "none" }}>
      {children}
    </div>
  );
}

function FormInput({ type="text", placeholder, onMouseEnter, onMouseLeave, style = {}, defaultValue, rows, icon }) {
  const [f, setF] = useState(false);
  const st = { ...S.formInput, paddingLeft: icon ? 44 : 16, background: f ? "rgba(59,130,246,.05)" : S.formInput.background, border: f ? "1.5px solid rgba(59,130,246,.4)" : S.formInput.border, boxShadow: f ? "0 0 0 3px rgba(59,130,246,.1)" : "none", ...style };
  
  return (
    <div style={{ position: "relative", width: "100%" }}>
      {icon && <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#8892a4" }}>{icon}</div>}
      <input type={type} placeholder={placeholder} defaultValue={defaultValue} onFocus={()=>setF(true)} onBlur={()=>setF(false)} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={st} />
    </div>
  );
}

/* ─────────────── COMPONENT ─────────────── */
export default function LinkWizSearchResults() {

  const [navScrolled, setNavScrolled] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [cursorBig, setCursorBig] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(MATCHES);
  const navigate = useNavigate();

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
    const fetchResults = async () => {
      setLoading(true);
      try {
        if (userService.getAllUsers) {
          const data = await userService.getAllUsers();
          setResults(data.users || MATCHES);
        }
      } catch (err) {
        console.error("Error fetching results:", err);
        setResults(MATCHES);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <div style={R.root}>
      {/* ── Custom Cursor ── */}
      <div style={{ ...R.cursorRing, left: cursor.x, top: cursor.y, transform: `translate(-50%,-50%) scale(${cursorBig ? 2.4 : 1})`, opacity: cursor.x ? 1 : 0 }} />
      <div style={{ ...R.cursorDot, left: cursor.x, top: cursor.y, transform: "translate(-50%,-50%)", opacity: cursor.x ? 1 : 0 }} />

      <nav style={{ ...R.nav, background: navScrolled ? "rgba(4,6,14,.9)" : "transparent", borderBottom: navScrolled ? "1px solid rgba(255,255,255,.05)" : "1px solid transparent", backdropFilter: navScrolled ? "blur(28px)" : "none" }}>
        <div style={R.navIn}>
          <div style={R.logo} onMouseEnter={big} onMouseLeave={small} onClick={() => navigate('/')}>
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
            <GhostBtn onMouseEnter={big} onMouseLeave={small} onClick={() => navigate('/login')}>Log In</GhostBtn>
            <PrimaryBtn onMouseEnter={big} onMouseLeave={small} onClick={() => navigate('/register')}>Get Started</PrimaryBtn>
          </div>
        </div>
      </nav>

      <section style={{ paddingTop: "140px", paddingBottom: "100px", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 40px" }}>
          
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontFamily: "Fraunces,Georgia,serif", fontSize: 40, fontWeight: 900, color: "#e8edff", marginBottom: 16 }}>Search Results for "Python"</h1>
            <p style={{ color: "#8892a4", fontSize: 16, lineHeight: 1.6 }}>Found {MATCHES.length} matching learners in your area.</p>
          </div>

          <div style={{ marginBottom: 40, maxWidth: 600 }}>
            <FormInput 
              icon={<Icons.Search />}
              placeholder="Search for skills, people, or cities..." 
              defaultValue="Python"
              onMouseEnter={big} 
              onMouseLeave={small}
              style={{ fontSize: 16, padding: "16px 20px" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
            {loading ? (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#8892a4" }}>Loading results...</div>
            ) : (
              results.map((m, i) => (
              <HoverCard key={i} onMouseEnter={big} onMouseLeave={small} onClick={() => navigate('/view-profile')}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg,${m.grad[0]},${m.grad[1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", border: "2px solid #04060e", boxShadow: "0 0 0 1px rgba(255,255,255,.1)" }}>{m.i}</div>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: "#e8edff", marginBottom: 4 }}>{m.name}</div>
                      <div style={{ fontSize: 13, color: "#8892a4", display: "flex", alignItems: "center", gap: 4 }}><Icons.MapPin /> {m.city}</div>
                    </div>
                  </div>
                  <div style={{ background: "rgba(16,185,129,.1)", border: "1px solid rgba(16,185,129,.2)", color: "#6ee7b7", padding: "4px 8px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                    {m.score}% Match
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, color: "#8892a4", fontWeight: 600, width: 45 }}>Offers</span>
                    <span style={S.cBlue}>{m.offer}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, color: "#8892a4", fontWeight: 600, width: 45 }}>Wants</span>
                    <span style={S.cGreen}>{m.want}</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#c4d0e8" }}>
                    <Icons.StarFill size={14} /> <span style={{ fontWeight: 600 }}>{m.rating}</span> <span style={{ color: "#8892a4" }}>({m.sessions} sessions)</span>
                  </div>
                  <GhostBtn style={{ padding: "8px 16px", fontSize: 13 }}>View Profile</GhostBtn>
                </div>
              </HoverCard>
            )))}
          </div>

        </div>
      </section>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "62px 40px 42px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 50, marginBottom: 52 }}>
            <div>
              <div style={{ ...R.logo, marginBottom: 15 }} onClick={() => navigate('/')}>
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
  root: { fontFamily: "'DM Sans',sans-serif", background: "#04060e", color: "#e8edff", overflowX: "hidden", cursor: "none", minHeight: "100vh" },
  cursorRing: { position: "fixed", width: 36, height: 36, border: "1.5px solid rgba(59,130,246,.5)", borderRadius: "50%", pointerEvents: "none", zIndex: 9999, transition: "transform .28s cubic-bezier(.16,1,.3,1)" },
  cursorDot: { position: "fixed", width: 5, height: 5, background: "#3b82f6", borderRadius: "50%", pointerEvents: "none", zIndex: 9999, transition: "left .04s, top .04s" },
  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, transition: "all .4s" },
  navIn: { maxWidth: 1240, margin: "0 auto", padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { display: "flex", alignItems: "center", gap: 10, cursor: "none" },
  logoBox: { width: 34, height: 34, background: "rgba(59,130,246,.12)", border: "1px solid rgba(59,130,246,.22)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { fontFamily: "Fraunces,Georgia,serif", fontSize: 21, fontWeight: 900, color: "#e8edff", letterSpacing: "-.02em" },
  navLinks: { display: "flex", gap: 36 },
  h1: { fontFamily: "Fraunces,Georgia,serif", fontSize: "clamp(42px,5.2vw,72px)", fontWeight: 900, lineHeight: 1.07, color: "#e8edff", marginBottom: 22, letterSpacing: "-.03em" },
  h2: { fontFamily: "Fraunces,Georgia,serif", fontSize: "clamp(30px,4vw,52px)", fontWeight: 900, color: "#e8edff", lineHeight: 1.12, marginBottom: 58, letterSpacing: "-.025em" },
  heroP: { color: "#8892a4", fontSize: 15.5, lineHeight: 1.82, marginBottom: 34, maxWidth: 420 },
};