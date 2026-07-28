import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LinkWizHeader from "./LinkWizHeader";
import exchangeService from "./services/exchangeService";

/* ─────────────── SVG ICONS ─────────────── */
const Icons = {
  Zap: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  ),
  Exchange: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  ),
  Check: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  X: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
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
  Clock: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Inbox: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
};

/* ─────────────── MOCK DATA ─────────────── */
const INCOMING = [
  { id: 1, name: "Maira A.", initials: "MA", city: "Islamabad", rating: 4.9, sessions: 12, grad: ["#3b82f6","#6366f1"], offeredSkill: "Python", wantedSkill: "Digital Marketing", message: "Hey! I've been learning marketing fundamentals and I think we'd be a great match. I can teach you Python scripting in return.", time: "2h ago" },
  { id: 2, name: "Tariq K.", initials: "TK", city: "Karachi", rating: 5.0, sessions: 15, grad: ["#06b6d4","#3b82f6"], offeredSkill: "Arabic", wantedSkill: "Copywriting", message: "Salaam! I'm a native Arabic speaker and a certified language coach. Would love to swap skills with you.", time: "5h ago" },
  { id: 3, name: "Zainab K.", initials: "ZK", city: "Lahore", rating: 4.9, sessions: 20, grad: ["#f59e0b","#d97706"], offeredSkill: "SEO", wantedSkill: "Social Media", message: null, time: "1d ago" },
  { id: 4, name: "Ali S.", initials: "AS", city: "Islamabad", rating: 4.5, sessions: 3, grad: ["#ec4899","#f43f5e"], offeredSkill: "React", wantedSkill: "Copywriting", message: "I've been building React apps for 2 years. Happy to do pair programming sessions in exchange!", time: "2d ago" },
];

/* ─────────────── SHARED STYLES ─────────────── */
const S = {
  nl: { color: "#4a5568", textDecoration: "none", fontSize: 14, fontWeight: 500, cursor: "none", transition: "color .2s", position: "relative", paddingBottom: 2 },
  gBtn: { background: "transparent", color: "#8892a4", border: "1.5px solid rgba(255,255,255,.09)", padding: "11px 22px", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, cursor: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "border .2s, color .2s, background .2s" },
  cBlue: { display: "inline-flex", alignItems: "center", background: "rgba(59,130,246,.11)", border: "1px solid rgba(59,130,246,.22)", color: "#93c5fd", padding: "3.5px 11px", borderRadius: 50, fontSize: 12, fontWeight: 600 },
  cGreen: { display: "inline-flex", alignItems: "center", background: "rgba(16,185,129,.1)", border: "1px solid rgba(16,185,129,.22)", color: "#6ee7b7", padding: "3.5px 11px", borderRadius: 50, fontSize: 12, fontWeight: 600 },
  socBtn: { width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8892a4", fontSize: 12, fontWeight: 700, cursor: "none", transition: ".22s" },
  fLink: { color: "#4a5568", fontSize: 13.5, marginBottom: 12, cursor: "none", transition: "color .2s" },
};

/* ─────────────── REUSABLE COMPONENTS ─────────────── */
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

/* ─────────────── CONFIRM MODAL ─────────────── */
function ConfirmModal({ isOpen, type, request, onConfirm, onCancel }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (isOpen) setTimeout(() => setVisible(true), 10);
    else setVisible(false);
  }, [isOpen]);
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onCancel(); };
    if (isOpen) window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onCancel]);
  if (!isOpen || !request) return null;
  const isAccept = type === "accept";
  return (
    <>
      <div onClick={onCancel} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(4,6,14,.85)", backdropFilter: "blur(12px)", opacity: visible ? 1 : 0, transition: "opacity .3s", cursor: "none" }} />
      <div style={{ position: "fixed", zIndex: 2001, top: "50%", left: "50%", transform: visible ? "translate(-50%,-50%) scale(1)" : "translate(-50%,-50%) scale(.94)", opacity: visible ? 1 : 0, transition: "transform .35s cubic-bezier(.16,1,.3,1), opacity .3s", width: "100%", maxWidth: 440, padding: "0 20px", cursor: "none" }}>
        <div style={{ background: "#080c14", border: "1px solid rgba(255,255,255,.08)", borderRadius: 24, overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,.8)" }}>
          <div style={{ height: 3, background: isAccept ? "linear-gradient(90deg,#10b981,#3b82f6)" : "linear-gradient(90deg,#ef4444,#f43f5e)" }} />
          <div style={{ padding: "32px 32px 36px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: isAccept ? "rgba(16,185,129,.1)" : "rgba(239,68,68,.1)", border: `1.5px solid ${isAccept ? "rgba(16,185,129,.3)" : "rgba(239,68,68,.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: isAccept ? "#10b981" : "#ef4444" }}>
              {isAccept ? <Icons.Check /> : <Icons.X />}
            </div>
            <h3 style={{ fontFamily: "Fraunces,Georgia,serif", fontSize: 22, fontWeight: 900, color: "#e8edff", marginBottom: 10, letterSpacing: "-.02em" }}>
              {isAccept ? "Accept Exchange?" : "Reject Request?"}
            </h3>
            <p style={{ color: "#8892a4", fontSize: 14.5, lineHeight: 1.65, marginBottom: 24 }}>
              {isAccept
                ? <>You'll start a skill swap with <span style={{ color: "#e8edff", fontWeight: 600 }}>{request.name}</span> — trading <span style={{ color: "#93c5fd", fontWeight: 600 }}>{request.wantedSkill}</span> for <span style={{ color: "#6ee7b7", fontWeight: 600 }}>{request.offeredSkill}</span>.</>
                : <>This will decline <span style={{ color: "#e8edff", fontWeight: 600 }}>{request.name}</span>'s request. They won't be notified of the reason.</>
              }
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onCancel} style={{ flex: 1, background: "rgba(255,255,255,.04)", color: "#8892a4", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "12px", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, cursor: "none", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#e8edff"; e.currentTarget.style.borderColor = "rgba(255,255,255,.18)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#8892a4"; e.currentTarget.style.borderColor = "rgba(255,255,255,.08)"; }}>
                Cancel
              </button>
              <button onClick={onConfirm} style={{ flex: 1, background: isAccept ? "linear-gradient(135deg,#10b981,#3b82f6)" : "linear-gradient(135deg,#ef4444,#f43f5e)", color: "#fff", border: "none", borderRadius: 12, padding: "12px", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, cursor: "none", transition: "box-shadow .3s" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = isAccept ? "0 12px 40px rgba(16,185,129,.35)" : "0 12px 40px rgba(239,68,68,.35)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                {isAccept ? "Yes, Accept" : "Yes, Reject"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────── REQUEST CARD ─────────────── */
function RequestCard({ req, onAccept, onReject, big, small, dismissed }) {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => { if (dismissed) setLeaving(true); }, [dismissed]);
  return (
    <div style={{ opacity: leaving ? 0 : 1, transform: leaving ? "translateX(40px) scale(.97)" : "translateX(0) scale(1)", transition: "opacity .4s, transform .4s cubic-bezier(.16,1,.3,1)", pointerEvents: leaving ? "none" : "auto" }}>
      <div style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 20, padding: "24px 26px", position: "relative", overflow: "hidden" }}>
        {/* Left accent stripe */}
        <div style={{ position: "absolute", left: 0, top: 20, bottom: 20, width: 3, borderRadius: "0 3px 3px 0", background: "linear-gradient(180deg,#3b82f6,#6366f1)" }} />

        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          {/* Avatar */}
          <div style={{ width: 50, height: 50, borderRadius: "50%", background: `linear-gradient(135deg,${req.grad[0]},${req.grad[1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700, color: "#fff", border: "2px solid #04060e", boxShadow: "0 0 0 1px rgba(255,255,255,.1)", flexShrink: 0 }}>
            {req.initials}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#e8edff" }}>{req.name}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, color: "#8892a4" }}><Icons.MapPin />{req.city}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, color: "#8892a4" }}><Icons.StarFill />{req.rating} · {req.sessions} sessions</span>
            </div>
            {/* Skill exchange row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: req.message ? 14 : 0 }}>
              <span style={{ fontSize: 12, color: "#4a5568", fontWeight: 600 }}>Offers</span>
              <span style={S.cGreen}>{req.offeredSkill}</span>
              <span style={{ color: "#4a5568", fontSize: 12 }}>→</span>
              <span style={{ fontSize: 12, color: "#4a5568", fontWeight: 600 }}>Wants</span>
              <span style={S.cBlue}>{req.wantedSkill}</span>
            </div>
            {/* Message */}
            {req.message && (
              <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 10, padding: "10px 14px", fontSize: 13.5, color: "#8892a4", lineHeight: 1.65, fontStyle: "italic", marginBottom: 4 }}>
                "{req.message}"
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#2d3748" }}><Icons.Clock />{req.time}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => onReject(req)} onMouseEnter={big} onMouseLeave={small}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(239,68,68,.08)", border: "1.5px solid rgba(239,68,68,.2)", color: "#f87171", padding: "9px 16px", borderRadius: 11, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: "none", transition: "all .2s" }}
                onMouseOver={e => { e.currentTarget.style.background = "rgba(239,68,68,.14)"; e.currentTarget.style.borderColor = "rgba(239,68,68,.4)"; }}
                onMouseOut={e => { e.currentTarget.style.background = "rgba(239,68,68,.08)"; e.currentTarget.style.borderColor = "rgba(239,68,68,.2)"; }}>
                <Icons.X /> Reject
              </button>
              <button onClick={() => onAccept(req)} onMouseEnter={big} onMouseLeave={small}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#10b981,#3b82f6)", color: "#fff", border: "none", padding: "9px 16px", borderRadius: 11, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: "none", transition: "box-shadow .3s" }}
                onMouseOver={e => e.currentTarget.style.boxShadow = "0 8px 28px rgba(16,185,129,.35)"}
                onMouseOut={e => e.currentTarget.style.boxShadow = "none"}>
                <Icons.Check /> Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── MAIN COMPONENT ─────────────── */
export default function LinkWizIncoming() {
  const navigate = useNavigate();
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [cursorBig, setCursorBig] = useState(false);
  const [requests, setRequests] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  const [modal, setModal] = useState({ open: false, type: null, req: null });
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  const big = useCallback(() => setCursorBig(true), []);
  const small = useCallback(() => setCursorBig(false), []);

  // Fetch incoming exchange requests from API
  useEffect(() => {
    const fetchIncoming = async () => {
      try {
        setLoading(true);
        const data = await exchangeService.getIncoming();

console.log("INCOMING DATA:", data);

const formatted = data
  .filter(exchange => exchange.status === "pending")
  .map(exchange => ({
  id: exchange._id,

  name: exchange.requester?.fullName || "Unknown",

  initials:
    exchange.requester?.fullName
      ?.split(" ")
      .map(w => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "UN",

  city: exchange.requester?.city || "Pakistan",

  rating: 5.0,
  sessions: 0,

  grad: ["#3b82f6", "#6366f1"],

  offeredSkill:
    exchange.serviceOffered?.title || "No Service",

  wantedSkill:
    exchange.serviceRequested?.title || "No Service",

  message: exchange.message || "",

  status: exchange.status,

  time: new Date(exchange.createdAt).toLocaleDateString()
}));

setRequests(formatted);
        
      } catch (err) {
        console.error("Error fetching incoming requests:", err);
        // Use default INCOMING on error
      } finally {
        setLoading(false);
      }
    };
    
    fetchIncoming();
  }, []);

  useEffect(() => {
    const fn = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const addToast = (msg, color) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, color }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  };

  const openAccept = (req) => setModal({ open: true, type: "accept", req });
  const openReject = (req) => setModal({ open: true, type: "reject", req });
  const closeModal = () => setModal({ open: false, type: null, req: null });

  const handleConfirm = async () => {
  const { type, req } = modal;

  try {
    if (type === "accept") {
      await exchangeService.acceptExchange(req.id);
    } else {
      await exchangeService.rejectExchange(req.id);
    }

    setDismissed(d => [...d, req.id]);

    setTimeout(() => {
      setRequests(r => r.filter(x => x.id !== req.id));
    }, 420);

    addToast(
      type === "accept"
        ? `✓ Exchange with ${req.name} accepted!`
        : `Request from ${req.name} rejected.`,
      type === "accept" ? "#10b981" : "#ef4444"
    );
  } catch (err) {
    console.error(err);
    addToast("Failed to update request", "#ef4444");
  }

  closeModal();
};

  return (
    <div style={R.root}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;700;900&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } @keyframes fadeSlideIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} } @keyframes toastIn { from{opacity:0;transform:translateY(10px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }`}</style>

      {/* Custom cursor */}
      <div style={{ ...R.cursorRing, left: cursor.x, top: cursor.y, transform: `translate(-50%,-50%) scale(${cursorBig ? 2.4 : 1})`, opacity: cursor.x ? 1 : 0 }} />
      <div style={{ ...R.cursorDot, left: cursor.x, top: cursor.y, transform: "translate(-50%,-50%)", opacity: cursor.x ? 1 : 0 }} />

      {/* Toasts */}
      <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 3000, display: "flex", flexDirection: "column", gap: 10 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background: "#0d1117", border: `1px solid ${t.color}44`, borderLeft: `3px solid ${t.color}`, borderRadius: 12, padding: "13px 18px", color: "#e8edff", fontSize: 14, fontWeight: 500, boxShadow: "0 16px 48px rgba(0,0,0,.6)", animation: "toastIn .3s cubic-bezier(.16,1,.3,1)", minWidth: 260 }}>
            {t.msg}
          </div>
        ))}
      </div>

      {/* Header */}
      <LinkWizHeader onCursorBig={big} onCursorSmall={small} />

      {/* Page */}
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "130px 40px 100px" }}>

        {/* Header */}
        <div style={{ marginBottom: 44, animation: "fadeSlideIn .5s cubic-bezier(.16,1,.3,1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(59,130,246,.12)", border: "1px solid rgba(59,130,246,.22)", display: "flex", alignItems: "center", justifyContent: "center", color: "#93c5fd" }}>
              <Icons.Exchange />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", letterSpacing: ".14em", textTransform: "uppercase" }}>Exchange Requests</span>
          </div>
          <h1 style={R.h1}>Incoming <span style={{ background: "linear-gradient(135deg,#93c5fd,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent" }}>Requests</span></h1>
          <p style={{ color: "#8892a4", fontSize: 15.5, lineHeight: 1.8, maxWidth: 520 }}>
            People who want to swap skills with you. Review their offer and decide to accept or pass.
          </p>
        </div>

        {/* Count bar */}
        {requests.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, padding: "13px 18px", background: "rgba(59,130,246,.06)", border: "1px solid rgba(59,130,246,.15)", borderRadius: 13 }}>
            <span style={{ fontSize: 14, color: "#93c5fd", fontWeight: 600 }}>{requests.length} pending {requests.length === 1 ? "request" : "requests"}</span>
            <span style={{ fontSize: 12.5, color: "#4a5568" }}>Oldest requests expire in 7 days</span>
          </div>
        )}

        {/* Cards */}
        {requests.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {requests.map((req, i) => (
              <div key={req.id} style={{ animation: `fadeSlideIn .45s cubic-bezier(.16,1,.3,1) ${i * 0.07}s both` }}>
                <RequestCard req={req} onAccept={openAccept} onReject={openReject} big={big} small={small} dismissed={dismissed.includes(req.id)} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div style={{ textAlign: "center", padding: "80px 20px", animation: "fadeSlideIn .5s cubic-bezier(.16,1,.3,1)" }}>
            <div style={{ color: "#2d3748", marginBottom: 20 }}><Icons.Inbox /></div>
            <h3 style={{ fontFamily: "Fraunces,Georgia,serif", fontSize: 24, fontWeight: 900, color: "#e8edff", marginBottom: 10, letterSpacing: "-.02em" }}>All caught up!</h3>
            <p style={{ color: "#4a5568", fontSize: 15, lineHeight: 1.7, maxWidth: 340, margin: "0 auto 28px" }}>No incoming requests right now. Your inbox will fill up as others discover your profile.</p>
            <GhostBtn onClick={() => navigate("/browse-users")} onMouseEnter={big} onMouseLeave={small} style={{ margin: "0 auto" }}>
              <Icons.ArrowRight /> Browse Users
            </GhostBtn>
          </div>
        )}
      </main>

      {/* Confirm Modal */}
      <ConfirmModal isOpen={modal.open} type={modal.type} request={modal.req} onConfirm={handleConfirm} onCancel={closeModal} />

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "62px 40px 42px" }}>
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
  h1: { fontFamily: "Fraunces,Georgia,serif", fontSize: "clamp(36px,4.5vw,58px)", fontWeight: 900, lineHeight: 1.07, color: "#e8edff", marginBottom: 16, letterSpacing: "-.03em" },
};
