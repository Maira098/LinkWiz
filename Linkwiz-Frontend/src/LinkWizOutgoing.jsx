import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LinkWizHeader from "./LinkWizHeader";
import exchangeService from "./services/exchangeService";

/* ─────────────── SVG ICONS ─────────────── */
const Icons = {
  Exchange: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Send: () => (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Filter: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
};

/* ─────────────── MOCK DATA ─────────────── */
const OUTGOING = [
  { id: 1, name: "Maira A.", initials: "MA", city: "Islamabad", rating: 4.9, sessions: 12, grad: ["#3b82f6","#6366f1"], offeredSkill: "Digital Marketing", wantedSkill: "Python", message: "Hey! I saw your Python profile and think we'd be a great match.", status: "pending", time: "2h ago" },
  { id: 2, name: "Sana R.", initials: "SR", city: "Lahore", rating: 4.8, sessions: 8, grad: ["#8b5cf6","#a78bfa"], offeredSkill: "Copywriting", wantedSkill: "UX Design", message: null, status: "accepted", time: "1d ago" },
  { id: 3, name: "Fatima N.", initials: "FN", city: "Rawalpindi", rating: 4.7, sessions: 6, grad: ["#10b981","#06b6d4"], offeredSkill: "SEO", wantedSkill: "Photography", message: "Would love to learn portrait photography from you!", status: "rejected", time: "3d ago" },
  { id: 4, name: "Ali S.", initials: "AS", city: "Islamabad", rating: 4.5, sessions: 3, grad: ["#ec4899","#f43f5e"], offeredSkill: "Social Media", wantedSkill: "React", message: "Big fan of your open-source work. Let's swap!", status: "pending", time: "4d ago" },
  { id: 5, name: "Tariq K.", initials: "TK", city: "Karachi", rating: 5.0, sessions: 15, grad: ["#06b6d4","#3b82f6"], offeredSkill: "Copywriting", wantedSkill: "Arabic", message: "I want to learn conversational Arabic for travel.", status: "pending", time: "5d ago" },
];

const STATUS_META = {
  pending:  { label: "Pending",  color: "#f59e0b", bg: "rgba(245,158,11,.1)",  border: "rgba(245,158,11,.25)" },
  accepted: { label: "Accepted", color: "#10b981", bg: "rgba(16,185,129,.1)",  border: "rgba(16,185,129,.25)" },
  rejected: { label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,.09)",  border: "rgba(239,68,68,.22)" },
};

const FILTERS = ["All", "Pending", "Accepted", "Rejected"];

/* ─────────────── SHARED STYLES ─────────────── */
const S = {
  nl: { color: "#4a5568", textDecoration: "none", fontSize: 14, fontWeight: 500, cursor: "none", transition: "color .2s", position: "relative", paddingBottom: 2 },
  gBtn: { background: "transparent", color: "#8892a4", border: "1.5px solid rgba(255,255,255,.09)", padding: "11px 22px", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, cursor: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "border .2s, color .2s, background .2s" },
  cBlue:  { display: "inline-flex", alignItems: "center", background: "rgba(59,130,246,.11)", border: "1px solid rgba(59,130,246,.22)", color: "#93c5fd", padding: "3.5px 11px", borderRadius: 50, fontSize: 12, fontWeight: 600 },
  cGreen: { display: "inline-flex", alignItems: "center", background: "rgba(16,185,129,.1)", border: "1px solid rgba(16,185,129,.22)", color: "#6ee7b7", padding: "3.5px 11px", borderRadius: 50, fontSize: 12, fontWeight: 600 },
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

function GhostBtn({ children, onMouseEnter, onMouseLeave, style = {}, onClick, active }) {
  const [h, setH] = useState(false);
  return (
    <button type="button" onMouseEnter={(e) => { setH(true); onMouseEnter?.(e); }} onMouseLeave={(e) => { setH(false); onMouseLeave?.(e); }} onClick={onClick}
      style={{ ...S.gBtn, border: active ? "1.5px solid rgba(59,130,246,.5)" : h ? "1.5px solid rgba(59,130,246,.38)" : S.gBtn.border, color: active ? "#93c5fd" : h ? "#e8edff" : S.gBtn.color, background: active ? "rgba(59,130,246,.08)" : h ? "rgba(59,130,246,.05)" : S.gBtn.background, ...style }}>
      {children}
    </button>
  );
}

/* ─────────────── CANCEL CONFIRM MODAL ─────────────── */
function CancelModal({ isOpen, request, onConfirm, onCancel }) {
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
  return (
    <>
      <div onClick={onCancel} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(4,6,14,.85)", backdropFilter: "blur(12px)", opacity: visible ? 1 : 0, transition: "opacity .3s", cursor: "none" }} />
      <div style={{ position: "fixed", zIndex: 2001, top: "50%", left: "50%", transform: visible ? "translate(-50%,-50%) scale(1)" : "translate(-50%,-50%) scale(.94)", opacity: visible ? 1 : 0, transition: "transform .35s cubic-bezier(.16,1,.3,1), opacity .3s", width: "100%", maxWidth: 420, padding: "0 20px", cursor: "none" }}>
        <div style={{ background: "#080c14", border: "1px solid rgba(255,255,255,.08)", borderRadius: 24, overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,.8)" }}>
          <div style={{ height: 3, background: "linear-gradient(90deg,#ef4444,#f43f5e)" }} />
          <div style={{ padding: "32px 32px 36px", textAlign: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(239,68,68,.1)", border: "1.5px solid rgba(239,68,68,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", color: "#ef4444" }}>
              <Icons.X />
            </div>
            <h3 style={{ fontFamily: "Fraunces,Georgia,serif", fontSize: 21, fontWeight: 900, color: "#e8edff", marginBottom: 10, letterSpacing: "-.02em" }}>Cancel Request?</h3>
            <p style={{ color: "#8892a4", fontSize: 14, lineHeight: 1.65, marginBottom: 24 }}>
              This will withdraw your exchange request to <span style={{ color: "#e8edff", fontWeight: 600 }}>{request?.name}</span>. This action can't be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={onCancel} style={{ flex: 1, background: "rgba(255,255,255,.04)", color: "#8892a4", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "12px", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, cursor: "none", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#e8edff"; e.currentTarget.style.borderColor = "rgba(255,255,255,.18)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#8892a4"; e.currentTarget.style.borderColor = "rgba(255,255,255,.08)"; }}>
                Keep It
              </button>
              <button type="button" onClick={onConfirm} style={{ flex: 1, background: "linear-gradient(135deg,#ef4444,#f43f5e)", color: "#fff", border: "none", borderRadius: 12, padding: "12px", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, cursor: "none", transition: "box-shadow .3s" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 12px 40px rgba(239,68,68,.35)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────── OUTGOING CARD ─────────────── */
function OutgoingCard({ req, onCancel, big, small, leaving }) {
  const meta = STATUS_META[req.status];
  return (
    <div style={{ opacity: leaving ? 0 : 1, transform: leaving ? "translateX(-40px) scale(.97)" : "translateX(0) scale(1)", transition: "opacity .4s, transform .4s cubic-bezier(.16,1,.3,1)", pointerEvents: leaving ? "none" : "auto" }}>
      <div style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 20, padding: "22px 24px", position: "relative", overflow: "hidden" }}>
        {/* Right accent stripe */}
        <div style={{ position: "absolute", right: 0, top: 20, bottom: 20, width: 3, borderRadius: "3px 0 0 3px", background: `linear-gradient(180deg,${req.grad[0]},${req.grad[1]})` }} />

        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          {/* Avatar */}
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg,${req.grad[0]},${req.grad[1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", border: "2px solid #04060e", boxShadow: "0 0 0 1px rgba(255,255,255,.1)", flexShrink: 0 }}>
            {req.initials}
          </div>

          {/* Info block */}
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#e8edff" }}>{req.name}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, color: "#8892a4" }}><Icons.MapPin />{req.city}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, color: "#8892a4" }}><Icons.StarFill />{req.rating}</span>
              {/* Status badge */}
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color, padding: "2.5px 10px", borderRadius: 50, fontSize: 11.5, fontWeight: 700, letterSpacing: ".04em" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: meta.color, display: "inline-block" }} />
                {meta.label}
              </span>
            </div>

            {/* Skill exchange row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: req.message ? 12 : 0 }}>
              <span style={{ fontSize: 12, color: "#4a5568", fontWeight: 600 }}>You offer</span>
              <span style={S.cBlue}>{req.offeredSkill}</span>
              <span style={{ color: "#4a5568", fontSize: 12 }}>→</span>
              <span style={{ fontSize: 12, color: "#4a5568", fontWeight: 600 }}>for</span>
              <span style={S.cGreen}>{req.wantedSkill}</span>
            </div>

            {/* Message preview */}
            {req.message && (
              <div style={{ fontSize: 13, color: "#4a5568", fontStyle: "italic", lineHeight: 1.6 }}>
                "{req.message}"
              </div>
            )}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#2d3748" }}><Icons.Clock />{req.time}</span>
            {req.status === "pending" && (
              <button 
                type="button"
                onClick={() => onCancel(req)} 
                onMouseEnter={(e) => {
                  big();
                  e.currentTarget.style.background = "rgba(239,68,68,.12)";
                  e.currentTarget.style.borderColor = "rgba(239,68,68,.38)";
                }} 
                onMouseLeave={(e) => {
                  small();
                  e.currentTarget.style.background = "rgba(239,68,68,.06)";
                  e.currentTarget.style.borderColor = "rgba(239,68,68,.18)";
                }}
                style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(239,68,68,.06)", border: "1.5px solid rgba(239,68,68,.18)", color: "#f87171", padding: "8px 14px", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 600, cursor: "none", transition: "all .2s" }}
              >
                <Icons.X /> Cancel
              </button>
            )}
            {req.status === "accepted" && (
              <span style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>Active exchange →</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── MAIN COMPONENT ─────────────── */
export default function LinkWizOutgoing() {
  const navigate = useNavigate();
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [cursorBig, setCursorBig] = useState(false);
  const [requests, setRequests] = useState([]);
  const [leaving, setLeaving] = useState([]);
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState({ open: false, req: null });
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  const big = useCallback(() => setCursorBig(true), []);
  const small = useCallback(() => setCursorBig(false), []);

  // Fetch outgoing exchange requests from API
  useEffect(() => {
    const fetchOutgoing = async () => {
      try {
        setLoading(true);
        const data = await exchangeService.getOutgoing();
        console.log("OUTGOING DATA:", data);



const formatted = data.map(exchange => ({
  id: exchange._id,

  name: exchange.provider?.fullName || "Unknown",

  initials:
    exchange.provider?.fullName
      ?.split(" ")
      .map(w => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "UN",

  city: exchange.provider?.city || "Pakistan",

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
        }
       catch (err) {
        console.error("Error fetching outgoing requests:", err);
        // Use default OUTGOING on error
      } finally {
        setLoading(false);
      }
    };
    
    fetchOutgoing();
  }, []);

  useEffect(() => {
    const fn = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const addToast = (msg) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const openCancel = (req) => setModal({ open: true, req });
  const closeModal = () => setModal({ open: false, req: null });

  const handleCancel = () => {
    const { req } = modal;
    setLeaving(l => [...l, req.id]);
    setTimeout(() => setRequests(r => r.filter(x => x.id !== req.id)), 420);
    addToast(`Request to ${req.name} cancelled.`);
    closeModal();
  };

  const filtered = filter === "All" ? requests : requests.filter(r => r.status === filter.toLowerCase());

  const counts = {
    All: requests.length,
    Pending: requests.filter(r => r.status === "pending").length,
    Accepted: requests.filter(r => r.status === "accepted").length,
    Rejected: requests.filter(r => r.status === "rejected").length,
  };

  return (
    <div style={R.root}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;700;900&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } @keyframes fadeSlideIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} } @keyframes toastIn { from{opacity:0;transform:translateY(10px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }`}</style>

      {/* Cursor */}
      <div style={{ ...R.cursorRing, left: cursor.x, top: cursor.y, transform: `translate(-50%,-50%) scale(${cursorBig ? 2.4 : 1})`, opacity: cursor.x ? 1 : 0 }} />
      <div style={{ ...R.cursorDot, left: cursor.x, top: cursor.y, transform: "translate(-50%,-50%)", opacity: cursor.x ? 1 : 0 }} />

      {/* Toasts */}
      <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 3000, display: "flex", flexDirection: "column", gap: 10 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background: "#0d1117", border: "1px solid rgba(239,68,68,.3)", borderLeft: "3px solid #ef4444", borderRadius: 12, padding: "13px 18px", color: "#e8edff", fontSize: 14, fontWeight: 500, boxShadow: "0 16px 48px rgba(0,0,0,.6)", animation: "toastIn .3s cubic-bezier(.16,1,.3,1)", minWidth: 260 }}>
            {t.msg}
          </div>
        ))}
      </div>

      {/* Header */}
      <LinkWizHeader onCursorBig={big} onCursorSmall={small} />

      {/* Page */}
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "130px 40px 100px" }}>

        {/* Header */}
        <div style={{ marginBottom: 40, animation: "fadeSlideIn .5s cubic-bezier(.16,1,.3,1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(59,130,246,.12)", border: "1px solid rgba(59,130,246,.22)", display: "flex", alignItems: "center", justifyContent: "center", color: "#93c5fd" }}>
              <Icons.Exchange />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", letterSpacing: ".14em", textTransform: "uppercase" }}>Exchange Requests</span>
          </div>
          <h1 style={R.h1}>Outgoing <span style={{ background: "linear-gradient(135deg,#a78bfa,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent" }}>Requests</span></h1>
          <p style={{ color: "#8892a4", fontSize: 15.5, lineHeight: 1.8, maxWidth: 520 }}>
            Requests you've sent out. Track their status and cancel any pending ones if your plans change.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#4a5568", marginRight: 4, alignSelf: "center" }}><Icons.Filter /> Filter</span>
          {FILTERS.map(f => (
            <button type="button" key={f} onClick={() => setFilter(f)} onMouseEnter={big} onMouseLeave={small}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, border: filter === f ? "1.5px solid rgba(59,130,246,.5)" : "1.5px solid rgba(255,255,255,.08)", background: filter === f ? "rgba(59,130,246,.1)" : "transparent", color: filter === f ? "#93c5fd" : "#8892a4", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: "none", transition: "all .2s" }}>
              {f}
              <span style={{ background: filter === f ? "rgba(59,130,246,.25)" : "rgba(255,255,255,.06)", color: filter === f ? "#93c5fd" : "#4a5568", borderRadius: 50, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{counts[f]}</span>
            </button>
          ))}
        </div>

        {/* Cards */}
        {filtered.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((req, i) => (
              <div key={req.id} style={{ animation: `fadeSlideIn .45s cubic-bezier(.16,1,.3,1) ${i * 0.06}s both` }}>
                <OutgoingCard req={req} onCancel={openCancel} big={big} small={small} leaving={leaving.includes(req.id)} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 20px", animation: "fadeSlideIn .5s cubic-bezier(.16,1,.3,1)" }}>
            <div style={{ color: "#2d3748", marginBottom: 20 }}><Icons.Send /></div>
            <h3 style={{ fontFamily: "Fraunces,Georgia,serif", fontSize: 24, fontWeight: 900, color: "#e8edff", marginBottom: 10, letterSpacing: "-.02em" }}>No {filter !== "All" ? filter.toLowerCase() : ""} requests</h3>
            <p style={{ color: "#4a5568", fontSize: 15, lineHeight: 1.7, maxWidth: 320, margin: "0 auto 28px" }}>
              {filter === "All" ? "You haven't sent any exchange requests yet. Browse users to get started." : `No requests with status "${filter.toLowerCase()}" found.`}
            </p>
            <GhostBtn onClick={() => navigate("/browse-users")} onMouseEnter={big} onMouseLeave={small} style={{ margin: "0 auto" }}>
              <Icons.ArrowRight /> Browse Users
            </GhostBtn>
          </div>
        )}
      </main>

      {/* Cancel Modal */}
      <CancelModal isOpen={modal.open} request={modal.req} onConfirm={handleCancel} onCancel={closeModal} />

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