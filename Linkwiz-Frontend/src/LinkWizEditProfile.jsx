import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import userService from "./services/userService";
import serviceService from "./services/serviceService";

// ─── Skills data from Coursera scrape ────────────────────────────────────────
const SKILLS_DATA = [
  // Technology
  { name: "Python", category: "Technology" },
  { name: "JavaScript", category: "Technology" },
  { name: "TypeScript", category: "Technology" },
  { name: "Java", category: "Technology" },
  { name: "C++", category: "Technology" },
  { name: "PHP", category: "Technology" },
  { name: "Kotlin", category: "Technology" },
  { name: "Swift", category: "Technology" },
  { name: "React", category: "Technology" },
  { name: "Node.Js", category: "Technology" },
  { name: "Flutter", category: "Technology" },
  { name: "Django", category: "Technology" },
  { name: "Laravel", category: "Technology" },
  { name: "SQL", category: "Technology" },
  { name: "MongoDB", category: "Technology" },
  { name: "Machine Learning", category: "Technology" },
  { name: "Deep Learning", category: "Technology" },
  { name: "Data Science", category: "Technology" },
  { name: "Data Analytics", category: "Technology" },
  { name: "Data Analysis", category: "Technology" },
  { name: "Cybersecurity", category: "Technology" },
  { name: "Cloud Computing", category: "Technology" },
  { name: "Web Development", category: "Technology" },
  { name: "Mobile Development", category: "Technology" },
  { name: "Ui/Ux Design", category: "Technology" },
  { name: "Digital Marketing", category: "Technology" },
  { name: "Microsoft Excel", category: "Technology" },
  { name: "Project Management", category: "Technology" },
  { name: "Docker", category: "Technology" },
  { name: "Linux", category: "Technology" },
  { name: "DevOps", category: "Technology" },
  { name: "Blockchain", category: "Technology" },
  { name: "Arduino", category: "Technology" },
  { name: "Networking", category: "Technology" },
  { name: "Information Technology", category: "Technology" },
  { name: "Network Administration", category: "Technology" },
  { name: "Computer Science", category: "Technology" },
  { name: "Accounting", category: "Technology" },
  // Business
  { name: "SEO", category: "Business" },
  { name: "Copywriting", category: "Business" },
  { name: "Content Writing", category: "Business" },
  { name: "Social Media Marketing", category: "Business" },
  { name: "Entrepreneurship", category: "Business" },
  { name: "Financial Planning", category: "Business" },
  { name: "Business Analysis", category: "Business" },
  { name: "Brand Management", category: "Business" },
  { name: "Sales", category: "Business" },
  { name: "HR Management", category: "Business" },
  { name: "E-Commerce", category: "Business" },
  { name: "Business", category: "Business" },
  { name: "Foundations Of Project Management", category: "Business" },
  // Creative
  { name: "Graphic Design", category: "Creative" },
  { name: "Video Editing", category: "Creative" },
  { name: "Drawing", category: "Creative" },
  { name: "Painting", category: "Creative" },
  { name: "Photography", category: "Creative" },
  { name: "Interior Design", category: "Creative" },
  { name: "Fashion Design", category: "Creative" },
  { name: "Animation", category: "Creative" },
  { name: "Illustration", category: "Creative" },
  { name: "Logo Design", category: "Creative" },
  { name: "3D Modeling", category: "Creative" },
  { name: "Filmmaking", category: "Creative" },
  { name: "Calligraphy", category: "Creative" },
  { name: "Creative Writing", category: "Creative" },
  // Language
  { name: "English", category: "Language" },
  { name: "Urdu", category: "Language" },
  { name: "Arabic", category: "Language" },
  { name: "French", category: "Language" },
  { name: "Spanish", category: "Language" },
  { name: "Chinese", category: "Language" },
  { name: "German", category: "Language" },
  { name: "Japanese", category: "Language" },
  { name: "Korean", category: "Language" },
  { name: "Public Speaking", category: "Language" },
  { name: "Proofreading", category: "Language" },
  { name: "Language Learning", category: "Language" },
  // Music & Arts
  { name: "Guitar", category: "Music & Arts" },
  { name: "Piano", category: "Music & Arts" },
  { name: "Violin", category: "Music & Arts" },
  { name: "Singing", category: "Music & Arts" },
  { name: "Music Production", category: "Music & Arts" },
  { name: "Music Theory", category: "Music & Arts" },
  { name: "Drums", category: "Music & Arts" },
  { name: "Flute", category: "Music & Arts" },
  { name: "Tabla", category: "Music & Arts" },
  // Health & Wellness
  { name: "Yoga", category: "Health & Wellness" },
  { name: "Meditation", category: "Health & Wellness" },
  { name: "Nutrition", category: "Health & Wellness" },
  { name: "First Aid", category: "Health & Wellness" },
  { name: "Personal Training", category: "Health & Wellness" },
  { name: "Health", category: "Health & Wellness" },
  // Sports
  { name: "Football", category: "Sports" },
  { name: "Cricket", category: "Sports" },
  { name: "Basketball", category: "Sports" },
  { name: "Badminton", category: "Sports" },
  { name: "Chess", category: "Sports" },
  { name: "Swimming", category: "Sports" },
  { name: "Tennis", category: "Sports" },
  { name: "Volleyball", category: "Sports" },
  // Academic
  { name: "Mathematics", category: "Academic" },
  { name: "Physics", category: "Academic" },
  { name: "Chemistry", category: "Academic" },
  { name: "Biology", category: "Academic" },
  { name: "Statistics", category: "Academic" },
  { name: "Economics", category: "Academic" },
  { name: "History", category: "Academic" },
  { name: "Psychology", category: "Academic" },
  { name: "Social Sciences", category: "Academic" },
  { name: "Math And Logic", category: "Academic" },
  // Personal Development
  { name: "Communication", category: "Personal Development" },
  { name: "Time Management", category: "Personal Development" },
  { name: "Critical Thinking", category: "Personal Development" },
  { name: "Problem Solving", category: "Personal Development" },
  { name: "Negotiation", category: "Personal Development" },
  { name: "Agile", category: "Personal Development" },
  { name: "Personal Development", category: "Personal Development" },
  // Lifestyle
  { name: "Cooking", category: "Lifestyle" },
  { name: "Baking", category: "Lifestyle" },
  { name: "Gardening", category: "Lifestyle" },
  { name: "Home Repair", category: "Lifestyle" },
  { name: "Tailoring", category: "Lifestyle" },
  { name: "Handicrafts", category: "Lifestyle" },
];

const CATEGORY_COLORS = {
  Technology:             { bg: "rgba(59,130,246,.1)",   border: "rgba(59,130,246,.25)",  text: "#93c5fd" },
  Business:               { bg: "rgba(245,158,11,.09)",  border: "rgba(245,158,11,.22)",  text: "#fcd34d" },
  Creative:               { bg: "rgba(236,72,153,.09)",  border: "rgba(236,72,153,.22)",  text: "#f9a8d4" },
  Language:               { bg: "rgba(16,185,129,.09)",  border: "rgba(16,185,129,.22)",  text: "#6ee7b7" },
  "Music & Arts":         { bg: "rgba(139,92,246,.1)",   border: "rgba(139,92,246,.25)",  text: "#c4b5fd" },
  "Health & Wellness":    { bg: "rgba(20,184,166,.09)",  border: "rgba(20,184,166,.22)",  text: "#5eead4" },
  Sports:                 { bg: "rgba(249,115,22,.09)",  border: "rgba(249,115,22,.22)",  text: "#fdba74" },
  Academic:               { bg: "rgba(99,102,241,.1)",   border: "rgba(99,102,241,.25)",  text: "#a5b4fc" },
  "Personal Development": { bg: "rgba(234,179,8,.09)",   border: "rgba(234,179,8,.22)",   text: "#fde047" },
  Lifestyle:              { bg: "rgba(34,197,94,.09)",   border: "rgba(34,197,94,.22)",   text: "#86efac" },
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Sparkle: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.727 12.727.707.707M3 12h1m16 0h1M4.22 19.78l.707-.707m12.727-12.727.707-.707M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z"/>
    </svg>
  ),
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Back: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  Camera: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  Zap: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#zapEP)"/>
      <defs><linearGradient id="zapEP" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs>
    </svg>
  ),
};

// ─── Generic form input ───────────────────────────────────────────────────────
function FormInput({ type = "text", placeholder, value, onChange, defaultValue, rows, style = {}, onMouseEnter, onMouseLeave }) {
  const [focused, setFocused] = useState(false);
  const base = {
    width: "100%",
    background: focused ? "rgba(59,130,246,.06)" : "rgba(255,255,255,.03)",
    border: `1.5px solid ${focused ? "rgba(59,130,246,.4)" : "rgba(255,255,255,.08)"}`,
    boxShadow: focused ? "0 0 0 3px rgba(59,130,246,.1)" : "none",
    borderRadius: 12,
    padding: "13px 16px",
    color: "#e8edff",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    outline: "none",
    transition: "all .2s",
    ...style,
  };
  if (rows) return (
    <textarea rows={rows} placeholder={placeholder} value={value} onChange={onChange} defaultValue={defaultValue}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={base} />
  );
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} defaultValue={defaultValue}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={base} />
  );
}

// ─── Skill tag pill ───────────────────────────────────────────────────────────
function SkillTag({ label, color = "blue", onRemove }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: color === "blue" ? "rgba(59,130,246,.12)" : "rgba(16,185,129,.1)",
      border: `1px solid ${color === "blue" ? "rgba(59,130,246,.22)" : "rgba(16,185,129,.22)"}`,
      color: color === "blue" ? "#93c5fd" : "#6ee7b7",
      padding: "5px 12px", borderRadius: 50, fontSize: 12, fontWeight: 600,
    }}>
      {label}
      <span onClick={onRemove} style={{ cursor: "pointer", opacity: .6, fontSize: 14, lineHeight: 1 }}>×</span>
    </div>
  );
}

// ─── Skill search input with dropdown ────────────────────────────────────────
function SkillSearchInput({ value, onChange, onSelect, onEnterCustom, placeholder, accentColor = "blue", big, small }) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapRef = useRef(null);

  const filtered = value.trim().length === 0
    ? []
    : SKILLS_DATA.filter(s =>
        s.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 40);

  // Group by category, preserving insertion order
  const grouped = filtered.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKey = (e) => {
    if (!open || filtered.length === 0) {
      if (e.key === "Enter") { e.preventDefault(); onEnterCustom(); }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && filtered[activeIdx]) {
        onSelect(filtered[activeIdx].name);
        setOpen(false);
        setActiveIdx(-1);
      } else {
        onEnterCustom();
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
    }
  };

  const borderFocused = accentColor === "green" ? "rgba(16,185,129,.4)" : "rgba(59,130,246,.4)";
  const shadowFocused = accentColor === "green" ? "rgba(16,185,129,.1)" : "rgba(59,130,246,.1)";

  return (
    <div ref={wrapRef} style={{ position: "relative", flex: 1 }}>
      <input
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); setActiveIdx(-1); }}
        onFocus={() => { if (value.trim()) setOpen(true); }}
        onKeyDown={handleKey}
        onMouseEnter={big}
        onMouseLeave={small}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: open ? "rgba(59,130,246,.06)" : "rgba(255,255,255,.03)",
          border: `1.5px solid ${open ? borderFocused : "rgba(255,255,255,.08)"}`,
          boxShadow: open ? `0 0 0 3px ${shadowFocused}` : "none",
          borderRadius: 10,
          padding: "10px 14px",
          color: "#e8edff",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          outline: "none",
          transition: "all .2s",
        }}
      />

      {open && filtered.length > 0 && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          right: 0,
          background: "rgba(8,12,24,.97)",
          border: "1px solid rgba(255,255,255,.1)",
          borderRadius: 14,
          backdropFilter: "blur(24px)",
          boxShadow: "0 20px 60px rgba(0,0,0,.65), 0 0 0 1px rgba(59,130,246,.07)",
          zIndex: 300,
          maxHeight: 288,
          overflowY: "auto",
          padding: "6px 0",
        }}>
          <style>{`
            .sw-dropdown::-webkit-scrollbar { width: 3px; }
            .sw-dropdown::-webkit-scrollbar-track { background: transparent; }
            .sw-dropdown::-webkit-scrollbar-thumb { background: rgba(59,130,246,.25); border-radius: 2px; }
          `}</style>

          {Object.entries(grouped).map(([cat, skills]) => {
            const cc = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Technology;
            return (
              <div key={cat}>
                {/* Category label */}
                <div style={{
                  padding: "8px 14px 3px",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".09em",
                  textTransform: "uppercase",
                  color: cc.text,
                  opacity: .65,
                }}>
                  {cat}
                </div>

                {skills.map(s => {
                  const idx = filtered.indexOf(s);
                  const isActive = idx === activeIdx;
                  return (
                    <div
                      key={s.name}
                      onMouseDown={() => { onSelect(s.name); setOpen(false); setActiveIdx(-1); }}
                      onMouseEnter={() => setActiveIdx(idx)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 14px",
                        cursor: "pointer",
                        background: isActive ? "rgba(59,130,246,.1)" : "transparent",
                        transition: "background .1s",
                      }}
                    >
                      <span style={{ fontSize: 13, color: isActive ? "#e8edff" : "#bdc7de" }}>
                        {s.name}
                      </span>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "2px 9px",
                        borderRadius: 50,
                        background: cc.bg,
                        border: `1px solid ${cc.border}`,
                        color: cc.text,
                        whiteSpace: "nowrap",
                        marginLeft: 10,
                      }}>
                        {cat}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Custom entry hint */}
          {value.trim() && !filtered.some(s => s.name.toLowerCase() === value.toLowerCase()) && (
            <div
              onMouseDown={() => { onEnterCustom(); setOpen(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 14px",
                borderTop: "1px solid rgba(255,255,255,.05)",
                marginTop: 4,
                cursor: "pointer",
                color: "#8892a4",
                fontSize: 12,
              }}
            >
              <span style={{ fontSize: 14, opacity: .6 }}>+</span>
              Add &ldquo;<span style={{ color: "#e8edff", fontWeight: 600 }}>{value}</span>&rdquo; as custom skill
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LinkWizEditProfile() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [cursorBig, setCursorBig] = useState(false);

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return {
      name: "Zainab K.", initials: "ZK", city: "Lahore", rating: 4.9, sessions: 20,
      grad: ["#f59e0b", "#d97706"],
      skills: ["SEO", "Copywriting", "Social Media"],
      wantedSkills: ["Guitar", "UX Design", "Spanish"],
    };
  });

  const [fullName, setFullName] = useState(user.fullName || "");
  const [city, setCity] = useState(user.city || "");
  const [email, setEmail] = useState(user.email || "zainab.k@fjwu.edu.pk");
  const [bio, setBio] = useState(user.bio || "Computer Science student. I love data and writing clean Python code. Currently trying to get into music and design in my free time.");

  const [offeredSkills, setOfferedSkills] = useState(user.skills || ["SEO", "Copywriting", "Social Media"]);
  const [wantedSkills, setWantedSkills] = useState(user.wantedSkills || ["Guitar", "UX Design", "Spanish"]);
  const [newOffered, setNewOffered] = useState("");
  const [newWanted, setNewWanted] = useState("");

  const navigate = useNavigate();

  // ── Scroll listener
  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 44);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // ── Cursor tracker
  useEffect(() => {
    const fn = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  // ── Fetch current user from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getCurrentUser();
        setUser(data);
        setFullName(data.fullName || "");
        setCity(data.city || "");
        setEmail(data.email || "");
        setBio(data.bio || "");
        setOfferedSkills(data.skills || []);
        setWantedSkills(data.wantedSkills || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const big = () => setCursorBig(true);
  const small = () => setCursorBig(false);

  // Add skill — called by the Add button or Enter on custom input
  const addSkill = (type) => {
    if (type === "offered" && newOffered.trim()) {
      setOfferedSkills(s => [...s, newOffered.trim()]);
      setNewOffered("");
    }
    if (type === "wanted" && newWanted.trim()) {
      setWantedSkills(s => [...s, newWanted.trim()]);
      setNewWanted("");
    }
  };

  // Add skill from dropdown selection
  const selectOffered = (name) => {
    if (!offeredSkills.includes(name)) setOfferedSkills(s => [...s, name]);
    setNewOffered("");
  };
  const selectWanted = (name) => {
    if (!wantedSkills.includes(name)) setWantedSkills(s => [...s, name]);
    setNewWanted("");
  };

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#04060e", color: "#e8edff", minHeight: "100vh", cursor: "none" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        @keyframes orbDrift { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-14px) scale(1.03)} }
        @keyframes pingBig { 0%{transform:translateY(-50%) scale(1);opacity:.55} 100%{transform:translateY(-50%) scale(2.8);opacity:0} }
        .ep-nav-link { color:#4a5568; text-decoration:none; font-size:14px; font-weight:500; cursor:none; transition:color .2s; }
        .ep-nav-link:hover { color:#e8edff; }
        .ep-primary-btn { background:linear-gradient(135deg,#3b82f6,#6366f1); color:#fff; border:none; padding:12px 26px; border-radius:12px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; cursor:none; display:inline-flex; align-items:center; gap:8px; transition:box-shadow .3s; }
        .ep-primary-btn:hover { box-shadow:0 16px 50px rgba(59,130,246,.4); }
        .ep-ghost-btn { background:transparent; color:#8892a4; border:1.5px solid rgba(255,255,255,.09); padding:11px 22px; border-radius:12px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; cursor:none; display:inline-flex; align-items:center; gap:8px; transition:all .2s; }
        .ep-ghost-btn:hover { border-color:rgba(59,130,246,.38); color:#e8edff; background:rgba(59,130,246,.05); }
        .ep-section-card { background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.07); border-radius:20px; padding:28px; margin-bottom:20px; }
        .ep-label { display:block; font-size:11px; font-weight:700; color:#9ca3af; margin-bottom:8px; letter-spacing:.08em; text-transform:uppercase; }
        .ep-footer-link { color:#4a5568; font-size:13.5px; margin-bottom:11px; cursor:none; transition:color .2s; display:block; }
        .ep-footer-link:hover { color:#e8edff; }
        .ep-social-btn { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); display:flex; align-items:center; justify-content:center; color:#8892a4; font-size:12px; font-weight:700; cursor:none; transition:.2s; }
        .ep-social-btn:hover { background:rgba(59,130,246,.1); border-color:rgba(59,130,246,.22); color:#93c5fd; }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:rgba(255,255,255,.03); } ::-webkit-scrollbar-thumb { background:rgba(59,130,246,.3); border-radius:2px; }
      `}</style>

      {/* Custom Cursor */}
      <div style={{ position:"fixed", width:36, height:36, border:"1.5px solid rgba(59,130,246,.5)", borderRadius:"50%", pointerEvents:"none", zIndex:9999, left:cursor.x, top:cursor.y, transform:`translate(-50%,-50%) scale(${cursorBig?2.2:1})`, opacity:cursor.x?1:0, transition:"transform .28s cubic-bezier(.16,1,.3,1)" }} />
      <div style={{ position:"fixed", width:5, height:5, background:"#3b82f6", borderRadius:"50%", pointerEvents:"none", zIndex:9999, left:cursor.x, top:cursor.y, transform:"translate(-50%,-50%)", opacity:cursor.x?1:0 }} />

      {/* Background Orbs */}
      <div style={{ position:"fixed", width:500, height:500, top:"-10%", left:"-10%", background:"radial-gradient(circle,rgba(59,130,246,.08) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none", zIndex:0, animation:"orbDrift 14s ease-in-out infinite" }} />
      <div style={{ position:"fixed", width:400, height:400, bottom:"-10%", right:"5%", background:"radial-gradient(circle,rgba(139,92,246,.07) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none", zIndex:0, animation:"orbDrift 18s ease-in-out 2s infinite reverse" }} />

      {/* Nav */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, background:navScrolled?"rgba(4,6,14,.9)":"transparent", borderBottom:navScrolled?"1px solid rgba(255,255,255,.05)":"1px solid transparent", backdropFilter:navScrolled?"blur(28px)":"none", transition:"all .4s" }}>
        <div style={{ maxWidth:1240, margin:"0 auto", padding:"18px 40px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"none" }} onMouseEnter={big} onMouseLeave={small}>
            <div style={{ width:34, height:34, background:"rgba(59,130,246,.12)", border:"1px solid rgba(59,130,246,.22)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icons.Zap />
            </div>
            <span style={{ fontFamily:"Fraunces,Georgia,serif", fontSize:21, fontWeight:900, color:"#e8edff", letterSpacing:"-.02em" }}>LinkWiz</span>
          </div>
          <div style={{ display:"flex", gap:36 }}>
            {["Features","How It Works","Community"].map(l => (
              <a key={l} href="#" className="ep-nav-link" onMouseEnter={big} onMouseLeave={small}>{l}</a>
            ))}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button className="ep-ghost-btn" onClick={() => navigate("/login")} onMouseEnter={big} onMouseLeave={small}>Log In</button>
            <button className="ep-primary-btn" onClick={() => navigate("/register")} onMouseEnter={big} onMouseLeave={small}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main style={{ position:"relative", zIndex:1, paddingTop:120, paddingBottom:100, minHeight:"100vh" }}>
        <div style={{ maxWidth:760, margin:"0 auto", padding:"0 40px" }}>

          {/* Back */}
          <a href="#" className="ep-nav-link" style={{ display:"inline-flex", alignItems:"center", gap:6, marginBottom:28, color:"#60a5fa", fontSize:14, fontWeight:500, textDecoration:"none" }}
            onClick={(e) => { e.preventDefault(); navigate("/profile"); }}
            onMouseEnter={big} onMouseLeave={small}>
            <Icons.Back /> Back to Profile
          </a>

          <h1 style={{ fontFamily:"Fraunces,Georgia,serif", fontSize:36, fontWeight:900, color:"#e8edff", marginBottom:8, letterSpacing:"-.02em" }}>Edit Profile</h1>
          <p style={{ color:"#8892a4", fontSize:14.5, marginBottom:36 }}>Update your information and manage your skill listings.</p>

          {/* Avatar */}
          <div className="ep-section-card">
            <div style={{ display:"flex", alignItems:"center", gap:22 }}>
              <div style={{ position:"relative" }}>
                <div style={{ width:86, height:86, borderRadius:"50%", background:"linear-gradient(135deg,#3b82f6,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontWeight:900, color:"#fff", border:"3px solid rgba(59,130,246,.3)" }}>
                  {user.fullName?.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
                </div>
                <div style={{ position:"absolute", bottom:2, right:2, width:24, height:24, borderRadius:"50%", background:"#3b82f6", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #04060e" }}>
                  <Icons.Camera />
                </div>
              </div>
              <div>
                <div style={{ fontFamily:"Fraunces,Georgia,serif", fontWeight:700, color:"#e8edff", fontSize:16, marginBottom:4 }}>{user.fullName}</div>
                <div style={{ color:"#8892a4", fontSize:12, marginBottom:12 }}>JPG, GIF or PNG. Max size of 2MB.</div>
                <button className="ep-ghost-btn" style={{ padding:"7px 16px", fontSize:12 }} onMouseEnter={big} onMouseLeave={small}>Change Photo</button>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="ep-section-card">
            <div style={{ fontFamily:"Fraunces,Georgia,serif", fontWeight:700, color:"#e8edff", fontSize:18, marginBottom:22 }}>Basic Information</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:18 }}>
              <div>
                <label className="ep-label">Full Name</label>
                <FormInput type="text" value={fullName} onChange={e => setFullName(e.target.value)} onMouseEnter={big} onMouseLeave={small} />
              </div>
              <div>
                <label className="ep-label">City</label>
                <FormInput type="text" value={city} onChange={e => setCity(e.target.value)} onMouseEnter={big} onMouseLeave={small} />
              </div>
            </div>
            <div style={{ marginBottom:18 }}>
              <label className="ep-label">Email</label>
              <FormInput type="email" value={email} onChange={e => setEmail(e.target.value)} onMouseEnter={big} onMouseLeave={small} />
            </div>
            <div>
              <label className="ep-label">Bio</label>
              <FormInput rows={4} value={bio} onChange={e => setBio(e.target.value)} onMouseEnter={big} onMouseLeave={small} style={{ resize:"vertical" }} />
            </div>
          </div>

          {/* Skills Offered */}
          <div className="ep-section-card">
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <span style={{ color:"#93c5fd" }}><Icons.Sparkle /></span>
              <div style={{ fontFamily:"Fraunces,Georgia,serif", fontWeight:700, color:"#e8edff", fontSize:18 }}>Skills You Offer</div>
            </div>
            <p style={{ color:"#8892a4", fontSize:12.5, marginBottom:16 }}>Search from our skill library or type your own.</p>

            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
              {offeredSkills.map((s, i) => (
                <SkillTag key={i} label={s} color="blue" onRemove={() => setOfferedSkills(sk => sk.filter((_, j) => j !== i))} />
              ))}
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <SkillSearchInput
                value={newOffered}
                onChange={setNewOffered}
                onSelect={selectOffered}
                onEnterCustom={() => addSkill("offered")}
                placeholder="Search skills (Python, Guitar, SEO…)"
                accentColor="blue"
                big={big}
                small={small}
              />
              <button
                className="ep-primary-btn"
                style={{ padding:"10px 18px", fontSize:13, flexShrink:0 }}
                onClick={() => addSkill("offered")}
                onMouseEnter={big}
                onMouseLeave={small}
              >
                Add
              </button>
            </div>
          </div>

          {/* Skills Wanted */}
          <div className="ep-section-card">
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <span style={{ color:"#6ee7b7" }}><Icons.Search /></span>
              <div style={{ fontFamily:"Fraunces,Georgia,serif", fontWeight:700, color:"#e8edff", fontSize:18 }}>Skills You Want to Learn</div>
            </div>
            <p style={{ color:"#8892a4", fontSize:12.5, marginBottom:16 }}>Search from our skill library or type your own.</p>

            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
              {wantedSkills.map((s, i) => (
                <SkillTag key={i} label={s} color="green" onRemove={() => setWantedSkills(sk => sk.filter((_, j) => j !== i))} />
              ))}
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <SkillSearchInput
                value={newWanted}
                onChange={setNewWanted}
                onSelect={selectWanted}
                onEnterCustom={() => addSkill("wanted")}
                placeholder="Search skills (Guitar, Spanish, Design…)"
                accentColor="green"
                big={big}
                small={small}
              />
              <button
                className="ep-primary-btn"
                style={{ padding:"10px 18px", fontSize:13, flexShrink:0 }}
                onClick={() => addSkill("wanted")}
                onMouseEnter={big}
                onMouseLeave={small}
              >
                Add
              </button>
            </div>
          </div>

          {/* Availability */}
          <div className="ep-section-card">
            <div style={{ fontFamily:"Fraunces,Georgia,serif", fontWeight:700, color:"#e8edff", fontSize:18, marginBottom:18 }}>Availability</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
              {["Weekday Mornings","Weekday Evenings","Weekends","Flexible","Remote Only","In-Person"].map((opt, i) => (
                <label key={i} style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:10, padding:"12px 14px", cursor:"none" }} onMouseEnter={big} onMouseLeave={small}>
                  <input type="checkbox" defaultChecked={i < 2} style={{ accentColor:"#3b82f6", cursor:"none" }} />
                  <span style={{ fontSize:13, color:"#8892a4" }}>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display:"flex", justifyContent:"flex-end", gap:14, marginTop:8 }}>
            <button className="ep-ghost-btn" onClick={() => navigate("/profile")} onMouseEnter={big} onMouseLeave={small}>Cancel</button>
            <button className="ep-primary-btn" onMouseEnter={big} onMouseLeave={small} onClick={async () => {
              if (!fullName.trim()) { alert("Name cannot be empty."); return; }
              try {
                const response = await userService.updateProfile({
                  fullName, city, bio,
                  skills: offeredSkills,
                  wantedSkills,
                });

                const currentUser = await userService.getCurrentUser();

                if (!currentUser.services?.length && offeredSkills.length > 0) {
                  await serviceService.createService({
                    title: `${offeredSkills[0]} Skill Exchange`,
                    description: `Offering ${offeredSkills[0]} skills`,
                    price: 0,
                    tags: [offeredSkills[0]],
                  });
                }

                localStorage.setItem("user", JSON.stringify(response.user));
                setUser(response.user);
                alert("Profile saved successfully!");
                navigate("/profile");
              } catch (err) {
                console.error("Error saving profile:", err);
                alert("Error saving profile. Please try again.");
              }
            }}>
              Save Changes
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,.05)", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:1240, margin:"0 auto", padding:"60px 40px 40px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48, marginBottom:48 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, cursor:"none" }}>
                <div style={{ width:34, height:34, background:"rgba(59,130,246,.12)", border:"1px solid rgba(59,130,246,.22)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}><Icons.Zap /></div>
                <span style={{ fontFamily:"Fraunces,Georgia,serif", fontSize:21, fontWeight:900, color:"#e8edff" }}>LinkWiz</span>
              </div>
              <p style={{ color:"#4a5568", fontSize:13, lineHeight:1.75, maxWidth:210, marginBottom:20 }}>Democratizing education through skill exchange. Built at FJWU.</p>
              <div style={{ display:"flex", gap:8 }}>
                {["T","L","G","D"].map((s,i) => <div key={i} className="ep-social-btn" onMouseEnter={big} onMouseLeave={small}>{s}</div>)}
              </div>
            </div>
            {[
              { t:"Platform", ls:["How It Works","Browse Skills","Smart Matching","Dashboard"] },
              { t:"Company",  ls:["About Us","Blog","Careers","Contact"] },
              { t:"Legal",    ls:["Help Center","Safety","Terms","Privacy"] },
            ].map((col,i) => (
              <div key={i}>
                <div style={{ fontFamily:"Fraunces,Georgia,serif", fontWeight:700, color:"#e8edff", fontSize:14, marginBottom:16 }}>{col.t}</div>
                {col.ls.map((l,j) => <a key={j} href="#" className="ep-footer-link" onMouseEnter={big} onMouseLeave={small}>{l}</a>)}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:20, borderTop:"1px solid rgba(255,255,255,.04)", flexWrap:"wrap", gap:10 }}>
            <span style={{ color:"#2d3748", fontSize:12.5 }}>© 2024 LinkWiz · Department of Software Engineering · FJWU</span>
            <span style={{ color:"#2d3748", fontSize:12.5 }}>Crafted with precision in 🇵🇰 Pakistan</span>
          </div>
        </div>
      </footer>
    </div>
  );
}