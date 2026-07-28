import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LinkWizHeader from "./LinkWizHeader";
import messageService from "./services/messageService";
import userService from "./services/userService";
import exchangeService from "./services/exchangeService";

/* ─────────────── GLOBAL STYLES ─────────────── */
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #04060e; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: rgba(255,255,255,.03); }
  ::-webkit-scrollbar-thumb { background: rgba(59,130,246,.3); border-radius: 2px; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideIn { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes msgPop { from{opacity:0;transform:scale(.92) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes statusPing { 0%{transform:scale(1);opacity:1} 100%{transform:scale(2.2);opacity:0} }
`;

/* ─────────────── SVG ICONS ─────────────── */
const Icons = {
  Zap: () => (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>),
  Exchange: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>),
  Chat: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>),
  Send: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>),
  Paperclip: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>),
  CheckCircle: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>),
  Clock: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
  AlertCircle: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>),
  Star: ({ fill = false }) => (<svg width="12" height="12" viewBox="0 0 24 24" fill={fill ? "#f59e0b" : "none"} stroke={fill ? "none" : "#f59e0b"} strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
  MapPin: () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>),
  X: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  Check: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  File: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>),
  Image: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>),
  Search: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  Users: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  ArrowRight: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>),
  MoreHoriz: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>),
  Download: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>),
  Smile: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>),
};

/* ─────────────── HELPER: safely resolve partner from exchange ─────────────── */
/**
 * Given an exchange document and the logged-in user's _id, returns the
 * "other" user object.  Handles both populated objects and raw ID strings.
 */
function resolvePartner(exchange, loggedInUserId) {
  const loggedId = loggedInUserId?.toString();

  const providerObj  = exchange.provider  && typeof exchange.provider  === "object" ? exchange.provider  : null;
  const requesterObj = exchange.requester && typeof exchange.requester === "object" ? exchange.requester : null;

  // Determine whose side the logged-in user is on
  const providerId  = providerObj?._id?.toString()  ?? exchange.provider?.toString();
  const isProvider  = providerId === loggedId;

  return isProvider ? requesterObj : providerObj;
}

/** Derive two-letter initials from a full name string */
function getInitials(fullName) {
  if (!fullName) return "??";
  return fullName
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ─────────────── PARTICLE CANVAS ─────────────── */
function ParticleCanvas() {
  const ref = useRef(null);
  const raf = useRef(null);
  const mouse = useRef({ x: -999, y: -999 });
  const pts = useRef([]);
  useEffect(() => {
    const c = ref.current; const ctx = c.getContext("2d");
    let W = c.width = window.innerWidth, H = c.height = window.innerHeight;
    window.addEventListener("resize", () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; });
    window.addEventListener("mousemove", e => { mouse.current = { x: e.clientX, y: e.clientY }; });
    pts.current = Array.from({ length: 55 }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, r: Math.random() * 1.2 + .3, a: Math.random() * .4 + .07, hue: Math.random() > .5 ? 215 : 260 }));
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      pts.current.forEach((p, i) => {
        const { x: mx, y: my } = mouse.current;
        const d = Math.hypot(mx - p.x, my - p.y);
        if (d < 100) { p.vx -= (mx - p.x) / d * .05; p.vy -= (my - p.y) / d * .05; }
        p.vx *= .984; p.vy *= .984; p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},75%,68%,${p.a})`; ctx.fill();
        pts.current.slice(i + 1).forEach(q => {
          const dd = Math.hypot(p.x - q.x, p.y - q.y);
          if (dd < 90) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.strokeStyle = `rgba(79,124,255,${.12 * (1 - dd / 90)})`; ctx.lineWidth = .5; ctx.stroke(); }
        });
      });
      raf.current = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf.current);
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

/* ─────────────── SHARED COMPONENTS ─────────────── */
const C = {
  root: { fontFamily: "'DM Sans', sans-serif", background: "#04060e", color: "#e8edff", minHeight: "100vh", overflowX: "hidden", cursor: "none" },
  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(4,6,14,.88)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,.05)" },
  navIn: { maxWidth: 1240, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoBox: { width: 32, height: 32, background: "rgba(59,130,246,.12)", border: "1px solid rgba(59,130,246,.22)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { fontFamily: "Fraunces, Georgia, serif", fontSize: 19, fontWeight: 900, color: "#e8edff", letterSpacing: "-.02em" },
  tab: (active) => ({ padding: "8px 20px", borderRadius: 10, fontSize: 13.5, fontWeight: 600, border: "none", cursor: "none", fontFamily: "'DM Sans', sans-serif", transition: "all .22s", background: active ? "rgba(59,130,246,.18)" : "transparent", color: active ? "#93c5fd" : "#8892a4", display: "flex", alignItems: "center", gap: 7 }),
  avatar: (grad, size = 38) => ({ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg,${grad[0]},${grad[1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * .3, fontWeight: 800, color: "#fff", flexShrink: 0 }),
  chip: (color) => ({ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 50, ...(color === "blue" ? { background: "rgba(59,130,246,.1)", border: "1px solid rgba(59,130,246,.2)", color: "#93c5fd" } : color === "green" ? { background: "rgba(16,185,129,.1)", border: "1px solid rgba(16,185,129,.22)", color: "#6ee7b7" } : color === "amber" ? { background: "rgba(245,158,11,.1)", border: "1px solid rgba(245,158,11,.22)", color: "#fcd34d" } : { background: "rgba(139,92,246,.1)", border: "1px solid rgba(139,92,246,.22)", color: "#c4b5fd" }) }),
};

function Avatar({ initials, grad, size = 38, online }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={C.avatar(grad, size)}>{initials}</div>
      {online !== undefined && (
        <div style={{ position: "absolute", bottom: 1, right: 1, width: 9, height: 9, borderRadius: "50%", background: online ? "#10b981" : "#4a5568", border: "1.5px solid #04060e" }}>
          {online && <div style={{ position: "absolute", inset: -2, borderRadius: "50%", background: "rgba(16,185,129,.4)", animation: "statusPing 1.8s infinite" }} />}
        </div>
      )}
    </div>
  );
}

function NavBar({ page, setPage }) {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [big, setBig] = useState(false);
  useEffect(() => {
    const fn = e => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return (
    <>
      <div style={{ ...{ position: "fixed", width: 34, height: 34, border: "1.5px solid rgba(59,130,246,.5)", borderRadius: "50%", pointerEvents: "none", zIndex: 9999, transition: "transform .25s cubic-bezier(.16,1,.3,1)" }, left: cursor.x, top: cursor.y, transform: `translate(-50%,-50%) scale(${big ? 2.2 : 1})`, opacity: cursor.x ? 1 : 0 }} />
      <div style={{ position: "fixed", width: 5, height: 5, background: "#3b82f6", borderRadius: "50%", pointerEvents: "none", zIndex: 9999, left: cursor.x, top: cursor.y, transform: "translate(-50%,-50%)", opacity: cursor.x ? 1 : 0 }} />

      {/* Dynamic Header */}
      <LinkWizHeader onCursorBig={() => setBig(true)} onCursorSmall={() => setBig(false)} />

      {/* Sub tabs bar */}
      <div style={{ position: "fixed", top: 68, left: 0, right: 0, zIndex: 100, background: "rgba(4,6,14,.92)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,.05)", height: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { id: "exchange", label: "Active Exchanges", icon: <Icons.Exchange /> },
            { id: "messages", label: "Messages", icon: <Icons.Chat /> },
          ].map(t => (
            <button key={t.id} onClick={() => setPage(t.id)} onMouseEnter={() => setBig(true)} onMouseLeave={() => setBig(false)} style={C.tab(page === t.id)}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE 1: ACTIVE EXCHANGE
═══════════════════════════════════════════════════ */
function ActiveExchangePage({ setPage, setActiveChat, loggedInUser }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [exchanges, setExchanges] = useState([]);

  useEffect(() => {
    const loadExchanges = async () => {
      try {
        const incoming = await exchangeService.getIncoming();
        const outgoing = await exchangeService.getOutgoing();
        const accepted = [...incoming, ...outgoing].filter(e => e.status === "accepted");
        setExchanges(accepted);
      } catch (err) {
        console.error(err);
      }
    };
    loadExchanges();
  }, []);

  const filtered = filter === "all" ? exchanges : exchanges.filter(e => e.status === filter);

  const statusConfig = {
    active: { label: "Active", color: "green", icon: <Icons.CheckCircle /> },
    pending: { label: "Pending", color: "amber", icon: <Icons.Clock /> },
    review: { label: "Review", color: "blue", icon: <Icons.Star fill={false} /> },
    accepted: { label: "Accepted", color: "green", icon: <Icons.CheckCircle /> },
  };

  return (
    <div style={{ paddingTop: 130, minHeight: "100vh", maxWidth: 1100, margin: "0 auto", padding: "130px 32px 60px" }}>
      {/* Header */}
      <div style={{ marginBottom: 36, animation: "fadeUp .5s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ ...C.chip("blue"), fontSize: 11 }}><Icons.Exchange /> Skill Swaps</div>
        </div>
        <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 38, fontWeight: 900, color: "#e8edff", letterSpacing: "-.02em", marginBottom: 6 }}>
          Active Exchanges
        </h1>
        <p style={{ color: "#8892a4", fontSize: 14.5 }}>Track all your ongoing skill swap partnerships</p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 32, animation: "fadeUp .5s .08s ease both", opacity: 0, animationFillMode: "forwards" }}>
        {[
          { label: "Total Swaps", val: exchanges.length.toString(), sub: "All time", color: "#93c5fd" },
          { label: "Active Now", val: exchanges.filter(e => e.status === "active").length.toString(), sub: "In progress", color: "#6ee7b7" },
          { label: "Sessions Done", val: "—", sub: "This month", color: "#c4b5fd" },
          { label: "Avg Rating", val: "—", sub: "Received", color: "#fcd34d" },
        ].map((s, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 16, padding: "20px 22px" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: "Fraunces, Georgia, serif", marginBottom: 2 }}>{s.val}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e8edff", marginBottom: 1 }}>{s.label}</div>
            <div style={{ fontSize: 11.5, color: "#8892a4" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, animation: "fadeUp .5s .14s ease both", opacity: 0, animationFillMode: "forwards" }}>
        {["all", "active", "pending", "review"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 18px", borderRadius: 10, border: "1px solid", fontSize: 12.5, fontWeight: 600, cursor: "none", fontFamily: "'DM Sans', sans-serif", transition: "all .2s", background: filter === f ? "rgba(59,130,246,.14)" : "transparent", borderColor: filter === f ? "rgba(59,130,246,.3)" : "rgba(255,255,255,.07)", color: filter === f ? "#93c5fd" : "#8892a4", textTransform: "capitalize" }}>
            {f === "all" ? "All Swaps" : f}
          </button>
        ))}
      </div>

      {/* Exchange cards */}
      <div style={{ display: "grid", gap: 16, animation: "fadeUp .5s .2s ease both", opacity: 0, animationFillMode: "forwards" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#8892a4", fontSize: 14 }}>
            No exchanges found.
          </div>
        )}
        {filtered.map((ex) => {
          // ── FIXED: use resolvePartner helper so both populated objects
          //    and raw ID strings are handled safely ──
          const partner = resolvePartner(ex, loggedInUser?._id);
          const partnerInitials = getInitials(partner?.fullName);
          const st = statusConfig[ex.status] || statusConfig["pending"];
          const isOpen = selected === (ex._id || ex.id);

          return (
            <div key={ex._id || ex.id} style={{ background: "rgba(255,255,255,.025)", border: `1px solid ${isOpen ? "rgba(59,130,246,.28)" : "rgba(255,255,255,.07)"}`, borderRadius: 20, overflow: "hidden", transition: "all .3s", boxShadow: isOpen ? "0 20px 60px rgba(59,130,246,.1)" : "none" }}>
              {/* Main row */}
              <div style={{ padding: "22px 28px", display: "flex", alignItems: "center", gap: 20, cursor: "none" }} onClick={() => setSelected(isOpen ? null : (ex._id || ex.id))}>
                <Avatar
                  initials={partnerInitials}
                  grad={["#3b82f6", "#6366f1"]}
                  size={50}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#e8edff" }}>
                      {partner?.fullName || "Unknown User"}
                    </span>
                    <span style={C.chip(st.color)}>{st.icon}{st.label}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#8892a4" }}>
                    <Icons.MapPin />
                    {partner?.city || "—"}
                    <span style={{ margin: "0 4px", opacity: .3 }}>|</span>
                    <span style={{ color: "#93c5fd", fontWeight: 600 }}>
                      {ex.serviceOffered?.title || "—"}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8892a4" strokeWidth="2">
                      <polyline points="17 1 21 5 17 9"/>
                      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                      <polyline points="7 23 3 19 7 15"/>
                      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                    </svg>
                    <span style={{ color: "#6ee7b7", fontWeight: 600 }}>
                      {ex.serviceRequested?.title || "—"}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ width: 130, flexShrink: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8892a4", marginBottom: 6 }}>
                    <span>Progress</span>
                    <span style={{ color: "#e8edff", fontWeight: 600 }}>
                      {ex.sessions?.done ?? 0}/{ex.sessions?.total ?? 0}
                    </span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,.07)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${ex.progress ?? 0}%`, background: ex.progress === 100 ? "linear-gradient(90deg,#10b981,#06b6d4)" : "linear-gradient(90deg,#3b82f6,#6366f1)", borderRadius: 3, transition: "width .6s ease" }} />
                  </div>
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: "#8892a4", marginBottom: 3 }}>Next Session</div>
                  <div style={{ fontSize: 12.5, color: "#e8edff", fontWeight: 600 }}>
                    {ex.nextSession || "—"}
                  </div>
                </div>

                <div style={{ color: "#8892a4", transition: "transform .3s", transform: isOpen ? "rotate(90deg)" : "none", marginLeft: 4 }}>
                  <Icons.ArrowRight />
                </div>
              </div>

              {/* Expanded panel */}
              {isOpen && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,.05)", padding: "22px 28px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, animation: "fadeUp .3s ease" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8892a4", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>Session History</div>
                    {[...Array(ex.sessions?.done ?? 0)].map((_, j) => (
                      <div key={`done-${j}`} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(16,185,129,.15)", border: "1px solid rgba(16,185,129,.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6ee7b7" }}><Icons.Check /></div>
                        <span style={{ fontSize: 12.5, color: "#c4d0e8" }}>Session {j + 1} — Completed</span>
                      </div>
                    ))}
                    {[...Array((ex.sessions?.total ?? 0) - (ex.sessions?.done ?? 0))].map((_, j) => (
                      <div key={`upcoming-${j}`} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 8, color: "#8892a4" }}>○</span></div>
                        <span style={{ fontSize: 12.5, color: "#4a5568" }}>Session {(ex.sessions?.done ?? 0) + j + 1} — Upcoming</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8892a4", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>Partner Info</div>
                    <div style={{ fontSize: 13, color: "#c4d0e8", marginBottom: 4 }}>
                      {partner?.fullName || "Unknown User"}
                    </div>
                    <div style={{ fontSize: 12, color: "#8892a4" }}>
                      {partner?.city || "—"}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#8892a4", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>Actions</div>
                    {[
                      {
                        label: "Send Message",
                        color: "#3b82f6",
                        onClick: () => {
                          if (partner?._id) setActiveChat(partner._id.toString());
                          setPage("messages");
                        }
                      },
                      {
                        label: ex.status === "review" ? "Leave Review" : "Schedule Session",
                        color: "#10b981",
                        onClick: () => {
                          if (ex.status === "review") {
                            navigate("/reviews");
                          } else {
                            alert(`Schedule session with ${partner?.fullName || "partner"} (mocked)`);
                          }
                        }
                      },
                      {
                        label: "View Profile",
                        color: "transparent",
                        border: true,
                        onClick: () => navigate("/view-profile")
                      },
                    ].map((btn, bi) => (
                      <button key={bi} onClick={btn.onClick} style={{ padding: "9px 16px", borderRadius: 10, border: btn.border ? "1px solid rgba(255,255,255,.1)" : "none", background: btn.border ? "transparent" : `${btn.color}22`, color: btn.border ? "#8892a4" : btn.color, fontSize: 12.5, fontWeight: 600, cursor: "none", fontFamily: "'DM Sans', sans-serif", textAlign: "left", transition: "all .2s" }}>
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE 2: MESSAGING SYSTEM
═══════════════════════════════════════════════════ */
function MessagingPage({ activeChat, setActiveChat, loggedInUser }) {
  const navigate = useNavigate();

  const [messages, setMessages] = useState({});
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fileRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Load chat partners from accepted exchanges
  useEffect(() => {
    if (!loggedInUser) return;
    const loadUsers = async () => {
      try {
        const incoming = await exchangeService.getIncoming();
        const outgoing = await exchangeService.getOutgoing();
        const accepted = [...incoming, ...outgoing].filter(x => x.status === "accepted");

        const chatUsers = accepted
          .map(exchange => {
            // ── FIXED: use resolvePartner so raw IDs are handled safely ──
            const partner = resolvePartner(exchange, loggedInUser._id);
            if (!partner || !partner._id) return null; // skip unpopulated
            return {
              id: partner._id.toString(),
              name: partner.fullName || "Unknown",
              online: partner.online ?? false,
              initials: getInitials(partner.fullName),
              grad: ["#3b82f6", "#6366f1"],
              role: partner.role || "",
            };
          })
          .filter(Boolean); // remove nulls

        // Deduplicate by id (in case user has multiple exchanges with same person)
        const seen = new Set();
        const unique = chatUsers.filter(u => {
          if (seen.has(u.id)) return false;
          seen.add(u.id);
          return true;
        });

        setUsers(unique);

        // Auto-select first conversation if none active
        if (!activeChat && unique.length > 0) {
          setActiveChat(unique[0].id);
        }
      } catch (err) {
        console.error("Failed to load chat users:", err);
      }
    };
    loadUsers();
  }, [loggedInUser]);

  // Load + poll messages for the active chat
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      try {
        const data = await messageService.getMessages(activeChat);
        setMessages(prev => ({ ...prev, [activeChat]: data }));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
    const poll = setInterval(fetchMessages, 4000);
    return () => clearInterval(poll);
  }, [activeChat]);

  const currentUser = users.find(u => u.id === activeChat) || null;
  const chatMessages = messages[activeChat] || [];
  const filteredUsers = users.filter(u =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.role || "").toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = async () => {
    if (!input.trim() || !activeChat) return;
    const text = input.trim();
    setInput("");
    try {
      const saved = await messageService.sendMessage(activeChat, text);
      setMessages(prev => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), saved],
      }));
    } catch (err) {
      console.error("Failed to send message:", err);
      setInput(text); // restore so user doesn't lose text
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      const msg = {
        _id: Date.now(),
        sender: loggedInUser?._id,
        text: null,
        createdAt: new Date().toISOString(),
        type: file.type.startsWith("image/") ? "image" : "file",
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(0) + " KB",
      };
      setMessages(prev => ({ ...prev, [activeChat]: [...(prev[activeChat] || []), msg] }));
    }, 1200);
    e.target.value = "";
  };

  return (
    <div style={{ paddingTop: 118, height: "100vh", display: "flex", overflow: "hidden" }}>
      {/* Left: Online Users Panel */}
      <div style={{ width: 230, borderRight: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.012)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "18px 16px 12px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#8892a4", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Icons.Users /> Swap Partners
          </div>
          <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, padding: "7px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#8892a4" }}><Icons.Search /></span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ background: "none", border: "none", outline: "none", fontSize: 12.5, color: "#e8edff", fontFamily: "'DM Sans', sans-serif", width: "100%", cursor: "none" }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#10b981", letterSpacing: ".1em", textTransform: "uppercase", padding: "4px 8px 8px" }}>
            ● Online ({filteredUsers.filter(u => u.online).length})
          </div>
          {filteredUsers.filter(u => u.online).map(u => (
            <UserRow key={u.id} user={u} active={activeChat === u.id} onClick={() => setActiveChat(u.id)} />
          ))}
          <div style={{ fontSize: 10, fontWeight: 700, color: "#4a5568", letterSpacing: ".1em", textTransform: "uppercase", padding: "12px 8px 8px" }}>
            ● Offline ({filteredUsers.filter(u => !u.online).length})
          </div>
          {filteredUsers.filter(u => !u.online).map(u => (
            <UserRow key={u.id} user={u} active={activeChat === u.id} onClick={() => setActiveChat(u.id)} />
          ))}
        </div>
      </div>

      {/* Center: Chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {!currentUser ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, color: "#8892a4" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(59,130,246,.08)", border: "1px solid rgba(59,130,246,.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
              <Icons.Chat />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#c4d0e8", marginBottom: 6 }}>
                {users.length === 0 ? "Loading conversations…" : "Select a conversation"}
              </div>
              <div style={{ fontSize: 13, color: "#8892a4" }}>
                {users.length === 0
                  ? "Fetching your matched partners"
                  : "Pick a swap partner from the left panel to start messaging"}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.015)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Avatar initials={currentUser.initials} grad={currentUser.grad} size={40} online={currentUser.online} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#e8edff" }}>{currentUser.name}</div>
                  <div style={{ fontSize: 12, color: currentUser.online ? "#10b981" : "#4a5568", display: "flex", alignItems: "center", gap: 5 }}>
                    {currentUser.online ? "Online" : "Offline"} · {currentUser.role}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["Session", "Profile"].map(b => {
                  const onClick = () => {
                    if (b === "Profile") navigate("/view-profile");
                    else alert("Session scheduling panel (mocked)");
                  };
                  return (
                    <button key={b} onClick={onClick} style={{ padding: "6px 14px", borderRadius: 9, border: "1px solid rgba(255,255,255,.09)", background: "transparent", color: "#8892a4", fontSize: 12, fontWeight: 600, cursor: "none", fontFamily: "'DM Sans', sans-serif" }}>{b}</button>
                  );
                })}
                <button onClick={() => alert("Options menu (mocked)")} style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid rgba(255,255,255,.09)", background: "transparent", color: "#8892a4", cursor: "none", display: "flex", alignItems: "center", justifyContent: "center" }}><Icons.MoreHoriz /></button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
              {chatMessages.map((msg) => {
                const senderId = msg.sender?.toString();
                const isMe = senderId === loggedInUser?._id?.toString();
                const timeDisplay = msg.createdAt
                  ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "";
                return (
                  <div key={msg._id} style={{ display: "flex", gap: 10, alignItems: "flex-end", flexDirection: isMe ? "row-reverse" : "row", animation: "msgPop .28s ease" }}>
                    {!isMe && <Avatar initials={currentUser.initials} grad={currentUser.grad} size={30} />}
                    <div style={{ maxWidth: "64%", display: "flex", flexDirection: "column", gap: 3, alignItems: isMe ? "flex-end" : "flex-start" }}>
                      <div style={{ background: isMe ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "rgba(255,255,255,.06)", border: isMe ? "none" : "1px solid rgba(255,255,255,.08)", borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "10px 14px", fontSize: 13.5, color: isMe ? "#fff" : "#c4d0e8", lineHeight: 1.5 }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize: 10.5, color: "#4a5568", paddingLeft: 4, paddingRight: 4, display: "flex", alignItems: "center", gap: 4 }}>
                        {timeDisplay}
                        {isMe && <span style={{ color: "#93c5fd", display: "flex" }}><Icons.CheckCircle /></span>}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end", animation: "msgPop .28s ease" }}>
                  <Avatar initials={currentUser.initials} grad={currentUser.grad} size={30} />
                  <div style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "18px 18px 18px 4px", padding: "12px 16px", display: "flex", gap: 4, alignItems: "center" }}>
                    {[0, 1, 2].map(d => (
                      <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: "#8892a4", animation: `pulse 1.2s ${d * .2}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Upload progress */}
            {uploading && (
              <div style={{ margin: "0 28px 8px", background: "rgba(59,130,246,.1)", border: "1px solid rgba(59,130,246,.2)", borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 14, height: 14, border: "2px solid rgba(59,130,246,.3)", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <span style={{ fontSize: 12.5, color: "#93c5fd" }}>Uploading file…</span>
              </div>
            )}

            {/* Input bar */}
            <div style={{ padding: "14px 24px", borderTop: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.012)", display: "flex", alignItems: "center", gap: 10 }}>
              <input ref={fileRef} type="file" style={{ display: "none" }} onChange={handleFileUpload} accept="*/*" />
              <button onClick={() => fileRef.current?.click()} style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid rgba(255,255,255,.09)", background: "rgba(255,255,255,.03)", color: "#8892a4", cursor: "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s" }}>
                <Icons.Paperclip />
              </button>
              <button onClick={() => setInput(prev => prev + "😊")} style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid rgba(255,255,255,.09)", background: "rgba(255,255,255,.03)", color: "#8892a4", cursor: "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icons.Smile />
              </button>
              <div style={{ flex: 1, position: "relative" }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder={`Message ${currentUser.name}…`}
                  style={{ width: "100%", background: "rgba(255,255,255,.05)", border: "1.5px solid rgba(255,255,255,.09)", borderRadius: 12, padding: "11px 16px", color: "#e8edff", fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, outline: "none", cursor: "none", transition: "border-color .2s" }}
                />
              </div>
              <button onClick={sendMessage} style={{ width: 42, height: 42, borderRadius: 12, border: "none", background: input.trim() ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "rgba(255,255,255,.05)", color: input.trim() ? "#fff" : "#4a5568", cursor: "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s", boxShadow: input.trim() ? "0 8px 24px rgba(59,130,246,.35)" : "none" }}>
                <Icons.Send />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Right: Conversations sidebar */}
      <div style={{ width: 270, borderLeft: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.012)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 16px 12px", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#8892a4", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 2 }}>Conversations</div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {users.map(u => {
            const msgs = messages[u.id] || [];
            const last = msgs[msgs.length - 1];
            return (
              <div key={u.id} onClick={() => setActiveChat(u.id)} style={{ padding: "11px 12px", borderRadius: 12, cursor: "none", display: "flex", gap: 12, alignItems: "center", background: activeChat === u.id ? "rgba(59,130,246,.1)" : "transparent", transition: "background .2s", marginBottom: 2 }}>
                <Avatar initials={u.initials} grad={u.grad} size={40} online={u.online} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: "#e8edff" }}>{u.name}</span>
                    <span style={{ fontSize: 10.5, color: "#4a5568" }}>
                      {last?.createdAt ? new Date(last.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#4a5568", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>
                      {last
                        ? (last.sender?.toString() === loggedInUser?._id?.toString() ? "You: " : "") + last.text
                        : "No messages yet"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function UserRow({ user, active, onClick }) {
  return (
    <div onClick={onClick} style={{ padding: "8px 10px", borderRadius: 10, cursor: "none", display: "flex", alignItems: "center", gap: 10, background: active ? "rgba(59,130,246,.12)" : "transparent", transition: "background .2s", marginBottom: 2 }}>
      <Avatar initials={user.initials} grad={user.grad} size={32} online={user.online} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: active ? "#93c5fd" : "#e8edff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
        <div style={{ fontSize: 11, color: "#4a5568", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.role}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════ */
export default function LinkWizApp() {
  const location = useLocation();
  const [page, setPage] = useState(() => (location.state?.page || "exchange"));
  const [activeChat, setActiveChat] = useState(() => (location.state?.chatUserId || null));
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const user = await userService.getCurrentUser();
      setLoggedInUser(user);
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (location.state?.page) setPage(location.state.page);
    if (location.state?.chatUserId) setActiveChat(location.state.chatUserId);
  }, [location.state]);

  return (
    <div style={C.root}>
      <style>{globalStyle}</style>
      <ParticleCanvas />
      <NavBar page={page} setPage={setPage} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {page === "exchange" ? (
          <ActiveExchangePage
            setPage={setPage}
            setActiveChat={setActiveChat}
            loggedInUser={loggedInUser}
          />
        ) : (
          <MessagingPage
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            loggedInUser={loggedInUser}
          />
        )}
      </div>
    </div>
  );
}