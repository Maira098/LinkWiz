import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LinkWizHeader from "./LinkWizHeader";
import userService from "./services/userService";

/* ─────────────── SVG ICON SYSTEM ─────────────── */
const Icons = {
  Zap: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
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
  Filter: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
};

/* ─────────────── DATA ─────────────── */
const MATCHES_FALLBACK = [
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
  cBlue: { display: "inline-flex", alignItems: "center", background: "rgba(59,130,246,.11)", border: "1px solid rgba(59,130,246,.22)", color: "#93c5fd", padding: "3.5px 11px", borderRadius: 50, fontSize: 12, fontWeight: 600 },
  cGreen: { display: "inline-flex", alignItems: "center", background: "rgba(16,185,129,.1)", border: "1px solid rgba(16,185,129,.22)", color: "#6ee7b7", padding: "3.5px 11px", borderRadius: 50, fontSize: 12, fontWeight: 600 },
  mCard2: { background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 20, padding: 22, cursor: "none", position: "relative", overflow: "hidden", transition: "transform .35s cubic-bezier(.16,1,.3,1), border-color .3s, box-shadow .3s", display: "flex", flexDirection: "column" },
  socBtn: { width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8892a4", fontSize: 12, fontWeight: 700, cursor: "none", transition: ".22s" },
  fLink: { color: "#4a5568", fontSize: 13.5, marginBottom: 12, cursor: "none", transition: "color .2s" },
  formCheckbox: { width: 16, height: 16, accentColor: "#3b82f6", cursor: "none" },
};

function HoverLink({ href, children, onMouseEnter, onMouseLeave, style = {} }) {
  const [h, setH] = useState(false);
  return (
    <a href={href}
      onMouseEnter={(e) => { setH(true); if (onMouseEnter) onMouseEnter(e); }}
      onMouseLeave={(e) => { setH(false); if (onMouseLeave) onMouseLeave(e); }}
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
      onMouseEnter={(e) => { setH(true); if (onMouseEnter) onMouseEnter(e); }}
      onMouseLeave={(e) => { setH(false); if (onMouseLeave) onMouseLeave(e); }}
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
      onMouseEnter={(e) => { setH(true); if (onMouseEnter) onMouseEnter(e); }}
      onMouseLeave={(e) => { setH(false); if (onMouseLeave) onMouseLeave(e); }}
      onClick={onClick}
      style={{ ...S.gBtn, border: h ? "1.5px solid rgba(59,130,246,.38)" : S.gBtn.border, color: h ? "#e8edff" : S.gBtn.color, background: h ? "rgba(59,130,246,.05)" : S.gBtn.background, ...style }}>
      {children}
    </button>
  );
}

function HoverCard({ children, onMouseEnter, onMouseLeave, style = {} }) {
  const [h, setH] = useState(false);
  const base = { ...S.mCard2, ...style };
  return (
    <div
      onMouseEnter={(e) => { setH(true); if (onMouseEnter) onMouseEnter(e); }}
      onMouseLeave={(e) => { setH(false); if (onMouseLeave) onMouseLeave(e); }}
      style={{ ...base, transform: h ? "translateY(-5px)" : base.transform || "none", borderColor: h ? "rgba(59,130,246,.3)" : base.border, boxShadow: h ? "0 22px 60px rgba(59,130,246,.13)" : "none" }}>
      {children}
    </div>
  );
}

/* ─── City input — plain inline, no wrapper div ─── */
function CityInput({ value, onChange, onMouseEnter, onMouseLeave }) {
  const [f, setF] = useState(false);
  return (
    <input
      type="text"
      placeholder="e.g. Lahore, Karachi"
      value={value}
      onChange={onChange}
      onFocus={() => setF(true)}
      onBlur={() => setF(false)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        width: "100%",
        background: f ? "rgba(59,130,246,.05)" : "rgba(255,255,255,.03)",
        border: f ? "1.5px solid rgba(59,130,246,.4)" : "1.5px solid rgba(255,255,255,.08)",
        boxShadow: f ? "0 0 0 3px rgba(59,130,246,.1)" : "none",
        borderRadius: 12,
        padding: "12px 16px",
        color: "#e8edff",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        transition: "all .2s",
        outline: "none",
        cursor: "text",
        display: "block",
      }}
    />
  );
}

/* ─────────────── COMPONENT ─────────────── */
export default function LinkWizBrowseUsers() {
  const navigate = useNavigate();

  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [cursorBig, setCursorBig] = useState(false);

  // ── Raw filter inputs (what the user is editing)
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [cityInput, setCityInput] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState([]);

  // ── Applied filters (only committed on "Apply Filters")
  const [appliedSkills, setAppliedSkills] = useState([]);
  const [appliedCity, setAppliedCity] = useState("");
  const [appliedAvailability, setAppliedAvailability] = useState([]);

  // ── Data
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Cursor
  const big = useCallback(() => setCursorBig(true), []);
  const small = useCallback(() => setCursorBig(false), []);

  useEffect(() => {
    const fn = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  // ── Fetch all users once on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAllUsers();
        const formattedUsers = data.map(user => ({
          _id: user._id,
          i: user.fullName?.split(" ").map(w => w[0]).join("").slice(0, 2),
          name: user.fullName,
          city: user.city || "Pakistan",
          offer: user.skills?.[0] || "No Skill",
          want: user.wantedSkills?.[0] || "No Preference",
          allSkills: user.skills || [],
          rating: 5.0,
          sessions: 0,
          grad: ["#3b82f6", "#6366f1"],
        }));
        setUsers(formattedUsers);
      } catch (err) {
        console.log("FULL ERROR:", err);
        setUsers(MATCHES_FALLBACK.map(u => ({ ...u, allSkills: [u.offer] })));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []); // ← fetch once, filter client-side

  // ── Client-side filtering — runs against appliedXxx state
  const displayUsers = (loading ? MATCHES_FALLBACK : users).filter(u => {
    // Skill filter: user must offer at least one of the selected skills (case-insensitive)
    if (appliedSkills.length > 0) {
      const userSkills = (u.allSkills || [u.offer]).map(s => s.toLowerCase());
      const match = appliedSkills.some(s => userSkills.some(us => us.includes(s.toLowerCase())));
      if (!match) return false;
    }

    // City filter
    if (appliedCity.trim()) {
      const cityMatch = (u.city || "").toLowerCase().includes(appliedCity.trim().toLowerCase());
      if (!cityMatch) return false;
    }

    // Availability — backend doesn't expose this field yet, so we skip silently
    // when it does, add: if (appliedAvailability.length > 0) { ... }

    return true;
  });

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleAvailability = (avail) => {
    setSelectedAvailability(prev =>
      prev.includes(avail) ? prev.filter(a => a !== avail) : [...prev, avail]
    );
  };

  const applyFilters = () => {
    setAppliedSkills([...selectedSkills]);
    setAppliedCity(cityInput);
    setAppliedAvailability([...selectedAvailability]);
  };

  const clearAll = () => {
    setSelectedSkills([]);
    setCityInput("");
    setSelectedAvailability([]);
    setAppliedSkills([]);
    setAppliedCity("");
    setAppliedAvailability([]);
  };

  const hasActiveFilters = appliedSkills.length > 0 || appliedCity.trim() || appliedAvailability.length > 0;
  const hasPendingChanges =
    JSON.stringify(selectedSkills) !== JSON.stringify(appliedSkills) ||
    cityInput !== appliedCity ||
    JSON.stringify(selectedAvailability) !== JSON.stringify(appliedAvailability);

  return (
    <div style={R.root}>
      {/* ── Custom Cursor ── */}
      <div style={{ ...R.cursorRing, left: cursor.x, top: cursor.y, transform: `translate(-50%,-50%) scale(${cursorBig ? 2.4 : 1})`, opacity: cursor.x ? 1 : 0 }} />
      <div style={{ ...R.cursorDot, left: cursor.x, top: cursor.y, transform: "translate(-50%,-50%)", opacity: cursor.x ? 1 : 0 }} />

      <LinkWizHeader onCursorBig={big} onCursorSmall={small} />

      <section style={{ paddingTop: "140px", paddingBottom: "100px", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 40px" }}>

          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontFamily: "Fraunces,Georgia,serif", fontSize: 40, fontWeight: 900, color: "#e8edff", marginBottom: 16 }}>Browse Community</h1>
            <p style={{ color: "#8892a4", fontSize: 16, lineHeight: 1.6 }}>Find learners and mentors across Pakistan matching your criteria.</p>
          </div>

          <div style={{ display: "flex", gap: 40, alignItems: "flex-start", flexWrap: "wrap" }}>

            {/* ── Filter Panel ── */}
            <div style={{ width: 280, flexShrink: 0, background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 20, padding: 24, position: "sticky", top: 120 }}>

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h3 style={{ fontFamily: "Fraunces,Georgia,serif", fontSize: 20, fontWeight: 700, color: "#e8edff" }}>Filters</h3>
                <span
                  style={{ fontSize: 12, color: hasActiveFilters ? "#93c5fd" : "#8892a4", cursor: "none", transition: "color .2s" }}
                  onClick={clearAll}
                  onMouseEnter={big} onMouseLeave={small}
                >
                  Clear All
                </span>
              </div>

              {/* Skills */}
              <div style={{ marginBottom: 28 }}>
                <h4 style={{ fontSize: 12, color: "#93c5fd", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14, fontWeight: 700 }}>Skills</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["React", "Python", "UI/UX", "Marketing", "SEO", "Guitar"].map(s => {
                    const active = selectedSkills.includes(s);
                    return (
                      <span
                        key={s}
                        onClick={() => toggleSkill(s)}
                        onMouseEnter={big} onMouseLeave={small}
                        style={{
                          ...S.cBlue,
                          background: active ? "rgba(59,130,246,.25)" : S.cBlue.background,
                          border: active ? "1px solid rgba(59,130,246,.5)" : S.cBlue.border,
                          color: active ? "#fff" : S.cBlue.color,
                          cursor: "none",
                          transition: "all .2s",
                        }}
                      >
                        {s}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* City — fixed alignment */}
              <div style={{ marginBottom: 26 }}>
                <h4 style={{ fontSize: 12, color: "#93c5fd", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14, fontWeight: 700 }}>City</h4>
                <CityInput
                  value={cityInput}
                  onChange={e => setCityInput(e.target.value)}
                  onMouseEnter={big}
                  onMouseLeave={small}
                />
              </div>

              {/* Availability */}
              <div style={{ marginBottom: 28 }}>
                <h4 style={{ fontSize: 12, color: "#93c5fd", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14, fontWeight: 700 }}>Availability</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {["Weekends", "Weekdays", "Evenings"].map(avail => {
                    const active = selectedAvailability.includes(avail);
                    return (
                      <label
                        key={avail}
                        style={{ display: "flex", alignItems: "center", gap: 10, color: active ? "#c4d0e8" : "#8892a4", fontSize: 14, cursor: "none", transition: "color .2s" }}
                        onMouseEnter={big} onMouseLeave={small}
                      >
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleAvailability(avail)}
                          style={S.formCheckbox}
                        />
                        {avail}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", marginBottom: 18 }} />

              {/* Apply Button */}
              <button
                onClick={applyFilters}
                onMouseEnter={big} onMouseLeave={small}
                style={{
                  width: "100%",
                  background: hasPendingChanges
                    ? "linear-gradient(135deg,#3b82f6,#6366f1)"
                    : "rgba(59,130,246,.08)",
                  border: hasPendingChanges
                    ? "none"
                    : "1.5px solid rgba(59,130,246,.2)",
                  color: hasPendingChanges ? "#fff" : "#8892a4",
                  borderRadius: 12,
                  padding: "12px 0",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "all .25s",
                  boxShadow: hasPendingChanges ? "0 8px 28px rgba(59,130,246,.28)" : "none",
                }}
              >
                <Icons.Filter />
                Apply Filters
                {hasPendingChanges && (
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", opacity: .8 }} />
                )}
              </button>

              {/* Active filter count badge */}
              {hasActiveFilters && (
                <div style={{ marginTop: 12, textAlign: "center", fontSize: 12, color: "#6ee7b7" }}>
                  {[
                    appliedSkills.length > 0 && `${appliedSkills.length} skill${appliedSkills.length > 1 ? "s" : ""}`,
                    appliedCity && `city`,
                    appliedAvailability.length > 0 && `${appliedAvailability.length} availability`,
                  ].filter(Boolean).join(" · ")} filter{(appliedSkills.length + (appliedCity ? 1 : 0) + appliedAvailability.length) > 1 ? "s" : ""} active
                  &nbsp;·&nbsp;{displayUsers.length} result{displayUsers.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>

            {/* ── Users Grid ── */}
            <div style={{ flex: 1 }}>
              {/* Result count when no filters */}
              {!hasActiveFilters && !loading && (
                <div style={{ fontSize: 13, color: "#8892a4", marginBottom: 20 }}>
                  Showing {displayUsers.length} member{displayUsers.length !== 1 ? "s" : ""}
                </div>
              )}

              {/* Empty state */}
              {!loading && displayUsers.length === 0 && (
                <div style={{ textAlign: "center", padding: "80px 20px", color: "#8892a4" }}>
                  <div style={{ fontSize: 40, marginBottom: 16, opacity: .4 }}>🔍</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#c4d0e8", marginBottom: 8 }}>No members found</div>
                  <div style={{ fontSize: 14 }}>Try adjusting or clearing your filters.</div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
                {displayUsers.map((m, i) => (
                  <HoverCard key={m._id || i} onMouseEnter={big} onMouseLeave={small}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg,${m.grad[0]},${m.grad[1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", border: "2px solid #04060e", boxShadow: "0 0 0 1px rgba(255,255,255,.1)" }}>{m.i}</div>
                        <div>
                          <div style={{ fontSize: 17, fontWeight: 700, color: "#e8edff", marginBottom: 4 }}>{m.name}</div>
                          <div style={{ fontSize: 13, color: "#8892a4", display: "flex", alignItems: "center", gap: 4 }}><Icons.MapPin /> {m.city}</div>
                        </div>
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
                        <Icons.StarFill size={14} /> <span style={{ fontWeight: 600 }}>{m.rating}</span> <span style={{ color: "#8892a4" }}>({m.sessions})</span>
                      </div>
                      <GhostBtn
                        style={{ padding: "8px 16px", fontSize: 13 }}
                        onMouseEnter={big} onMouseLeave={small}
                        onClick={() => { console.log("CLICKED USER:", m); navigate(`/view-profile/${m._id}`); }}
                      >
                        View Profile
                      </GhostBtn>
                    </div>
                  </HoverCard>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Footer ── */}
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
              { t: "Company",  ls: ["About Us","Blog","Careers","Contact"] },
              { t: "Legal",    ls: ["Help Center","Safety","Terms","Privacy"] },
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