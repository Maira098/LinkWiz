import { useState, useEffect, useCallback } from "react"; 
import { useNavigate } from "react-router-dom";
import LinkWizHeader from "./LinkWizHeader";
import exchangeService from "./services/exchangeService";
import userService from "./services/userService";

/* ─────────────── SVG ICONS ─────────────── */
const Icons = {
  Exchange: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  ),
  Inbox: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
    </svg>
  ),
  Send: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  Zap: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  StarFill: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#f59e0b">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Check: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Search: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="8" y1="11" x2="14" y2="11"/><line x1="11" y1="8" x2="11" y2="14"/>
    </svg>
  ),
  Bell: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Trophy: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 21 12 17 16 21"/>
      <path d="M17 4H7L5 8c0 3.3 3.1 6 7 6s7-2.7 7-6l-2-4z"/>
      <path d="M5 8H3c0 2.8 1.5 5.2 3.8 6.5"/>
      <path d="M19 8h2c0 2.8-1.5 5.2-3.8 6.5"/>
      <line x1="12" y1="17" x2="12" y2="14"/>
    </svg>
  ),
  Clock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

/* ─────────────── MOCK DATA ─────────────── */
const USER = { name: "Zainab", initials: "ZK", city: "Lahore", rating: 4.9, sessions: 20, grad: ["#f59e0b","#d97706"], skills: ["SEO", "Copywriting", "Social Media"] };


const ACTIVE_EXCHANGES = [
  { id: 1, name: "Sana R.", initials: "SR", city: "Lahore", rating: 4.8, sessions: 8, grad: ["#8b5cf6","#a78bfa"], offeredSkill: "Copywriting", receivingSkill: "UX Design", nextSession: "Tomorrow, 4 PM", progress: 40 },
  { id: 2, name: "Maira A.", initials: "MA", city: "Islamabad", rating: 4.9, sessions: 12, grad: ["#3b82f6","#6366f1"], offeredSkill: "Digital Marketing", receivingSkill: "Python", nextSession: "Sat, 6 PM", progress: 20 },
];

const RECENT_ACTIVITY = [
  { id: 1, icon: Icons.Check, color: "#10b981", msg: "Sana R. accepted your exchange request", time: "1h ago" },
  { id: 2, icon: Icons.Inbox, color: "#3b82f6", msg: "New request from Tariq K. — Arabic ↔ Copywriting", time: "3h ago" },
  { id: 3, icon: Icons.Bell,  color: "#f59e0b", msg: "Session reminder: Sana R. tomorrow at 4 PM", time: "5h ago" },
  { id: 4, icon: Icons.Check, color: "#10b981", msg: "Exchange with Ali S. marked complete", time: "2d ago" },
];

/* ─────────────── SHARED STYLES ─────────────── */
const S = {
  nl: { color: "#4a5568", textDecoration: "none", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "color .2s", position: "relative", paddingBottom: 2 },
  gBtn: { background: "transparent", color: "#8892a4", border: "1.5px solid rgba(255,255,255,.09)", padding: "11px 22px", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, transition: "border .2s, color .2s, background .2s" },
  cBlue:  { display: "inline-flex", alignItems: "center", background: "rgba(59,130,246,.11)", border: "1px solid rgba(59,130,246,.22)", color: "#93c5fd", padding: "3.5px 11px", borderRadius: 50, fontSize: 12, fontWeight: 600 },
  cGreen: { display: "inline-flex", alignItems: "center", background: "rgba(16,185,129,.1)", border: "1px solid rgba(16,185,129,.22)", color: "#6ee7b7", padding: "3.5px 11px", borderRadius: 50, fontSize: 12, fontWeight: 600 },
};

/* ─────────────── COMPONENTS ─────────────── */
function HoverLink({ href, children, onMouseEnter, onMouseLeave, onClick, style = {} }) {
  const [h, setH] = useState(false);
  return (
    <a href={href} onClick={onClick} onMouseEnter={(e) => { setH(true); onMouseEnter?.(e); }} onMouseLeave={(e) => { setH(false); onMouseLeave?.(e); }}
      style={{ ...S.nl, color: h ? "#e8edff" : S.nl.color, ...style }}>
      {children}
      <div style={{ position: "absolute", bottom: 0, left: 0, height: 1, background: "#3b82f6", width: h ? "100%" : "0%", transition: "width .3s" }} />
    </a>
  );
}

function GhostBtn({ children, onMouseEnter, onMouseLeave, style = {}, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onMouseEnter={(e) => { setH(true); onMouseEnter?.(e); }} onMouseLeave={(e) => { setH(false); onMouseLeave?.(e); }} onClick={onClick}
      style={{ ...S.gBtn, border: h ? "1.5px solid rgba(59,130,246,.38)" : S.gBtn.border, color: h ? "#e8edff" : S.gBtn.color, background: h ? "rgba(59,130,246,.05)" : S.gBtn.background, ...style }}>
      {children}
    </button>
  );
}

function PrimaryBtn({ children, onMouseEnter, onMouseLeave, style = {}, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onMouseEnter={(e) => { setH(true); onMouseEnter?.(e); }} onMouseLeave={(e) => { setH(false); onMouseLeave?.(e); }} onClick={onClick}
      style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 12, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 9, boxShadow: h ? "0 16px 50px rgba(59,130,246,.42)" : "none", transition: "box-shadow .3s", ...style }}>
      {children}
    </button>
  );
}

/* Stat Card */
function StatCard({ stat, big, small, i, navigate }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => { setH(true); big(); }} onMouseLeave={() => { setH(false); small(); }}
      onClick={() => stat.page && navigate(`/${stat.page.toLowerCase()}`)}
      style={{ background: "rgba(255,255,255,.025)", border: `1px solid ${h ? `${stat.color}33` : "rgba(255,255,255,.07)"}`, borderRadius: 20, padding: "24px 22px", cursor: stat.page ? "pointer" : "default", transition: "all .3s cubic-bezier(.16,1,.3,1)", transform: h ? "translateY(-4px)" : "none", boxShadow: h ? `0 16px 50px ${stat.color}18` : "none", animation: `fadeSlideIn .5s cubic-bezier(.16,1,.3,1) ${i * 0.08}s both` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${stat.color}15`, border: `1px solid ${stat.color}28`, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color }}>
          <stat.icon />
        </div>
        {stat.page && (
          <span style={{ fontSize: 11.5, color: "#4a5568", display: "flex", alignItems: "center", gap: 4 }}>
            View <Icons.ArrowRight />
          </span>
        )}
      </div>
      <div style={{ fontSize: 36, fontFamily: "Fraunces,Georgia,serif", fontWeight: 900, color: "#e8edff", letterSpacing: "-.03em", lineHeight: 1, marginBottom: 6 }}>{stat.value}</div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#e8edff", marginBottom: 3 }}>{stat.label}</div>
      <div style={{ fontSize: 12, color: "#4a5568" }}>{stat.sub}</div>
    </div>
  );
}

/* Active Exchange Card */
function ActiveCard({ ex, big, small, i, navigate }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={() => navigate("/view-profile")} onMouseEnter={() => { setH(true); big(); }} onMouseLeave={() => { setH(false); small(); }}
      style={{ background: "rgba(255,255,255,.025)", border: `1px solid ${h ? "rgba(59,130,246,.3)" : "rgba(255,255,255,.07)"}`, borderRadius: 20, padding: "22px 24px", cursor: "pointer", transition: "all .3s cubic-bezier(.16,1,.3,1)", transform: h ? "translateY(-3px)" : "none", boxShadow: h ? "0 16px 50px rgba(59,130,246,.1)" : "none", animation: `fadeSlideIn .5s cubic-bezier(.16,1,.3,1) ${i * 0.1}s both`, position: "relative", overflow: "hidden" }}>
      {/* top gradient line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${ex.grad[0]},${ex.grad[1]})` }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg,${ex.grad[0]},${ex.grad[1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", border: "2px solid #04060e", boxShadow: "0 0 0 1px rgba(255,255,255,.1)", flexShrink: 0 }}>
          {ex.initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15.5, fontWeight: 700, color: "#e8edff", marginBottom: 3 }}>{ex.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#8892a4" }}>
            <Icons.MapPin />{ex.city}
            <span>·</span>
            <Icons.StarFill />{ex.rating}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#10b981", background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.2)", borderRadius: 50, padding: "3px 10px", fontWeight: 600 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
          Active
        </div>
      </div>

      {/* Skill swap */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <span style={S.cBlue}>{ex.offeredSkill}</span>
        <span style={{ color: "#4a5568", fontSize: 13 }}>⇌</span>
        <span style={S.cGreen}>{ex.receivingSkill}</span>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11.5 }}>
          <span style={{ color: "#4a5568" }}>Progress</span>
          <span style={{ color: "#8892a4", fontWeight: 600 }}>{ex.progress}%</span>
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,.06)", borderRadius: 50, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${ex.progress}%`, background: `linear-gradient(90deg,${ex.grad[0]},${ex.grad[1]})`, borderRadius: 50, transition: "width 1.2s cubic-bezier(.16,1,.3,1)" }} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#8892a4" }}>
          <Icons.Clock /> Next: <span style={{ color: "#e8edff", fontWeight: 600 }}>{ex.nextSession}</span>
        </span>
        <GhostBtn style={{ padding: "7px 14px", fontSize: 12.5 }} onClick={(e) => { e.stopPropagation(); navigate("/exchange-messaging", { state: { page: "messages", chatUserId: ex.initials === "SR" ? "u2" : "u1" } }); }}>Message</GhostBtn>
      </div>
    </div>
  );
}

/* ─────────────── MAIN COMPONENT ─────────────── */
export default function LinkWizDashboard() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [cursorBig, setCursorBig] = useState(false);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    const defaultUser = { name: "Zainab", initials: "ZK", city: "Lahore", rating: 4.9, sessions: 20, grad: ["#f59e0b","#d97706"], skills: ["SEO", "Copywriting", "Social Media"] };
    localStorage.setItem("user", JSON.stringify(defaultUser));
    return defaultUser;
  });
  const [exchanges, setExchanges] = useState([]);
  const stats = [
  {
    label: "Incoming",
    value: exchanges.filter(
      e => e.provider?._id === user?._id
    ).length,
    icon: Icons.Inbox,
    color: "#3b82f6",
    page: "incoming",
    sub: "Received requests"
  },
  {
    label: "Outgoing",
    value: exchanges.filter(
      e => e.requester === user?._id ||
           e.requester?._id === user?._id
    ).length,
    icon: Icons.Send,
    color: "#8b5cf6",
    page: "outgoing",
    sub: "Sent requests"
  },
  {
    label: "Active",
    value: exchanges.filter(
      e => e.status === "accepted"
    ).length,
    icon: Icons.Exchange,
    color: "#10b981",
    sub: "Running exchanges"
  },
  {
    label: "Completed",
    value: exchanges.filter(
      e => e.status === "completed"
    ).length,
    icon: Icons.Trophy,
    color: "#f59e0b",
    sub: "Finished exchanges"
  }
];
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const big = useCallback(() => setCursorBig(true), []);
  const small = useCallback(() => setCursorBig(false), []);

  // Fetch exchanges from API
  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        setLoading(true);
        const [incomingData, outgoingData] = await Promise.all([
          exchangeService.getIncoming(),
          exchangeService.getOutgoing()
        ]);
        
        const allExchanges = [
          ...(incomingData || []),
          ...(outgoingData || [])
        ];
        console.log("INCOMING:", incomingData);
console.log("OUTGOING:", outgoingData);
console.log("ALL EXCHANGES:", allExchanges);
        if (allExchanges.length > 0) {
          setExchanges(allExchanges);
        }
      } catch (err) {
        console.error("Error fetching exchanges:", err);
        // Keep current exchanges on error
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchExchanges();
    }
  }, [user]);

  useEffect(() => {
    const fn = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  return (
    <div style={R.root}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;700;900&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } @keyframes fadeSlideIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>

      {/* Cursor */}
      <div style={{ ...R.cursorRing, left: cursor.x, top: cursor.y, transform: `translate(-50%,-50%) scale(${cursorBig ? 2.4 : 1})`, opacity: cursor.x ? 1 : 0 }} />
      <div style={{ ...R.cursorDot, left: cursor.x, top: cursor.y, transform: "translate(-50%,-50%)", opacity: cursor.x ? 1 : 0 }} />

      {/* Header */}
      <LinkWizHeader onCursorBig={big} onCursorSmall={small} />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "110px 40px 100px" }}>

        {/* Welcome header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 52, animation: "fadeSlideIn .5s cubic-bezier(.16,1,.3,1)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(59,130,246,.12)", border: "1px solid rgba(59,130,246,.22)", display: "flex", alignItems: "center", justifyContent: "center", color: "#93c5fd" }}>
                <Icons.Zap />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", letterSpacing: ".14em", textTransform: "uppercase" }}>Your Hub</span>
            </div>
            <h1 style={R.h1}>Welcome back, <span style={{ background: "linear-gradient(135deg,#93c5fd,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent" }}>{user.fullname}</span></h1>
            <p style={{ color: "#8892a4", fontSize: 15.5, lineHeight: 1.8, maxWidth: 460 }}>
              You have <span style={{ color: "#93c5fd", fontWeight: 600 }}>4 incoming requests</span> and <span style={{ color: "#10b981", fontWeight: 600 }}>2 active exchanges</span> running right now.
            </p>
          </div>
          {/* User card */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 18, padding: "16px 20px", flexShrink: 0 }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: `linear-gradient(135deg,${user.grad ? user.grad[0] : "#f59e0b"},${user.grad ? user.grad[1] : "#d97706"})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700, color: "#fff", border: "2px solid #04060e", boxShadow: "0 0 0 1px rgba(255,255,255,.1)" }}>
              {user.fullName
  ?.split(" ")
  .map(w => w[0])
  .join("")
  .slice(0, 2)
  .toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#e8edff", marginBottom: 4 }}>{user.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#8892a4" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Icons.MapPin />{user.city}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Icons.StarFill />{user.rating}</span>
                <span>{user.sessions} sessions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 16, marginBottom: 52 }}>
          {stats.map((stat, i) => <StatCard key={i} stat={stat} big={big} small={small} i={i} navigate={navigate} />)}
        </div>

        {/* Bottom two-col layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, alignItems: "start", flexWrap: "wrap" }}>

          {/* Active Exchanges */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "Fraunces,Georgia,serif", fontSize: 22, fontWeight: 900, color: "#e8edff", letterSpacing: "-.02em" }}>Active Exchanges</h2>
              <GhostBtn onClick={() => navigate("/incoming")} onMouseEnter={big} onMouseLeave={small} style={{ padding: "7px 14px", fontSize: 12.5 }}>
                View all <Icons.ArrowRight />
              </GhostBtn>
            </div>

            {ACTIVE_EXCHANGES.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {ACTIVE_EXCHANGES.map((ex, i) => <ActiveCard key={ex.id} ex={ex} big={big} small={small} i={i} navigate={navigate} />)}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "50px 20px", background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 20 }}>
                <div style={{ color: "#2d3748", marginBottom: 14 }}><Icons.Exchange /></div>
                <p style={{ color: "#4a5568", fontSize: 14 }}>No active exchanges yet. Accept an incoming request to start.</p>
              </div>
            )}

            {/* Quick actions */}
            <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
              <PrimaryBtn onClick={() => navigate("/browse-users")} onMouseEnter={big} onMouseLeave={small}>
                <Icons.Search /> Browse Users
              </PrimaryBtn>
              <GhostBtn onClick={() => navigate("/incoming")} onMouseEnter={big} onMouseLeave={small}>
                <Icons.Inbox /> View Incoming
              </GhostBtn>
            </div>
          </div>

          {/* Activity feed */}
          <div>
            <h2 style={{ fontFamily: "Fraunces,Georgia,serif", fontSize: 22, fontWeight: 900, color: "#e8edff", letterSpacing: "-.02em", marginBottom: 20 }}>Recent Activity</h2>
            <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 20, overflow: "hidden" }}>
              {RECENT_ACTIVITY.map((act, i) => (
                <div key={act.id} onClick={() => navigate('/incoming')} onMouseEnter={big} onMouseLeave={small}
                  style={{ display: "flex", gap: 12, padding: "16px 18px", borderBottom: i < RECENT_ACTIVITY.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none", cursor: "pointer", transition: "background .2s", animation: `fadeSlideIn .5s cubic-bezier(.16,1,.3,1) ${i * 0.08}s both` }}
                  onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,.025)"}
                  onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: `${act.color}12`, border: `1px solid ${act.color}22`, display: "flex", alignItems: "center", justifyContent: "center", color: act.color, flexShrink: 0, marginTop: 2 }}>
                    <act.icon />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, color: "#c4d0e8", lineHeight: 1.55, marginBottom: 4 }}>{act.msg}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#2d3748" }}>
                      <Icons.Clock /> {act.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Skills summary */}
            <div style={{ marginTop: 20, background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 20, padding: "18px 20px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#4a5568", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 12 }}>Your Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {USER.skills.map(sk => (
                  <span key={sk} style={S.cBlue}>{sk}</span>
                ))}
                <span onClick={() => navigate('/edit-profile')} onMouseEnter={big} onMouseLeave={small} style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,.03)", border: "1px dashed rgba(255,255,255,.1)", color: "#4a5568", padding: "3.5px 11px", borderRadius: 50, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ Add</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "62px 40px 42px" }}>
          {/* CTA Section */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, padding: "32px 28px", background: "rgba(59,130,246,.08)", border: "1px solid rgba(59,130,246,.2)", borderRadius: 20, flexWrap: "wrap", gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#e8edff", marginBottom: 6 }}>Ready to start exchanging?</h3>
              <p style={{ fontSize: 14, color: "#8892a4" }}>Join LinkWiz today and connect with skilled professionals</p>
            </div>
            <PrimaryBtn onClick={() => navigate("/create-account")} onMouseEnter={big} onMouseLeave={small}>
              <Icons.Zap /> Create Free Account
            </PrimaryBtn>
          </div>

          {/* Copyright */}
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
  root: { fontFamily: "'DM Sans',sans-serif", background: "#04060e", color: "#e8edff", overflowX: "hidden", cursor: "auto", minHeight: "100vh" },
  cursorRing: { position: "fixed", width: 36, height: 36, border: "1.5px solid rgba(59,130,246,.5)", borderRadius: "50%", pointerEvents: "none", zIndex: 9999, transition: "transform .28s cubic-bezier(.16,1,.3,1)" },
  cursorDot: { position: "fixed", width: 5, height: 5, background: "#3b82f6", borderRadius: "50%", pointerEvents: "none", zIndex: 9999, transition: "left .04s, top .04s" },
  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, transition: "all .4s" },
  navIn: { maxWidth: 1240, margin: "0 auto", padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  logoBox: { width: 34, height: 34, background: "rgba(59,130,246,.12)", border: "1px solid rgba(59,130,246,.22)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { fontFamily: "Fraunces,Georgia,serif", fontSize: 21, fontWeight: 900, color: "#e8edff", letterSpacing: "-.02em" },
  navLinks: { display: "flex", gap: 36 },
  h1: { fontFamily: "Fraunces,Georgia,serif", fontSize: "clamp(32px,4vw,52px)", fontWeight: 900, lineHeight: 1.07, color: "#e8edff", marginBottom: 14, letterSpacing: "-.03em" },
};