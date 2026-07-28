import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LinkWizHeader from "./LinkWizHeader";
import userService from "./services/userService";
import exchangeService from "./services/exchangeService";
import reviewService from "./services/reviewService";

/* ─── ICONS ─── */
const Icons = {
  MapPin: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Users: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Pen: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  Sparkle: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.727 12.727.707.707M3 12h1m16 0h1M4.22 19.78l.707-.707m12.727-12.727.707-.707M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z"/>
    </svg>
  ),
  Search: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Chat: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  StarFill: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#f59e0b">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
};

/* ─── MATCHES DATA ─── */
const MATCHES = [
  { i: "MA", name: "Maira A.", city: "Islamabad", offer: "Python", want: "Guitar", score: 97, sessions: 12, rating: 4.9, grad: ["#3b82f6", "#6366f1"] },
  { i: "SR", name: "Sana R.", city: "Lahore", offer: "UX Design", want: "Marketing", score: 94, sessions: 8, rating: 4.8, grad: ["#8b5cf6", "#a78bfa"] },
];

const REVIEWS = [
  { i: "TK", name: "Tariq K.", grad: ["#06b6d4","#3b82f6"], rating: 5, text: "Sarah is an amazing Python teacher. Very patient and explained everything clearly. Highly recommend!", date: "2 weeks ago" },
  { i: "FN", name: "Fatima N.", grad: ["#10b981","#06b6d4"], rating: 5, text: "Great exchange experience. Sarah knows her stuff and was very flexible with scheduling.", date: "1 month ago" },
];

/* ─── MAIN COMPONENT ─── */
export default function LinkWizUserProfile() {
  console.log("PROFILE COMPONENT RENDERED");
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [cursorBig, setCursorBig] = useState(false);
  const [activeTab, setActiveTab] = useState("exchanges");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [user, setUser] = useState(null);
  const [exchanges, setExchanges] = useState([]);
  const [reviews, setReviews] = useState([]);

  

  useEffect(() => {
  console.log("USE EFFECT STARTED");

  const fetchProfileData = async () => {
    console.log("FETCH FUNCTION ENTERED");

    try {
      setLoading(true);

      console.log("BEFORE GET CURRENT USER");

      const userData = await userService.getCurrentUser();

      console.log("USER RECEIVED:", userData);

      setUser(userData);

      if (exchangeService.getOutgoing) {
        const exData = await exchangeService.getOutgoing();

        console.log("EXCHANGES RECEIVED:", exData);

        setExchanges(exData || []);
      }

    } catch (err) {
      console.error("PROFILE ERROR:", err);
      setError("Failed to load profile");

    } finally {
      console.log("FINALLY BLOCK REACHED");
      setLoading(false);
    }
  };

  fetchProfileData();
}, []);
  useEffect(() => {
    const fn = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  if (loading) {
  return <div>Loading...</div>;
}

if (error) {
  return <div>{error}</div>;
}

if (!user) {
  return <div>No user found</div>;
}

  const big = () => setCursorBig(true);
  const small = () => setCursorBig(false);

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#04060e", color: "#e8edff", minHeight: "100vh", cursor: "none" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        @keyframes orbDrift { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(24px,-16px) scale(1.04)} }
        @keyframes pulseRing { 0%{box-shadow:0 0 0 0 rgba(59,130,246,.5)} 70%{box-shadow:0 0 0 7px rgba(59,130,246,0)} 100%{box-shadow:0 0 0 0 rgba(59,130,246,0)} }
        .up-nav-link { color:#4a5568; text-decoration:none; font-size:14px; font-weight:500; cursor:none; transition:color .2s; }
        .up-nav-link:hover { color:#e8edff; }
        .up-primary { background:linear-gradient(135deg,#3b82f6,#6366f1); color:#fff; border:none; padding:11px 22px; border-radius:11px; font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:600; cursor:none; display:inline-flex; align-items:center; gap:7px; transition:box-shadow .3s; }
        .up-primary:hover { box-shadow:0 14px 40px rgba(59,130,246,.4); }
        .up-ghost { background:transparent; color:#8892a4; border:1.5px solid rgba(255,255,255,.09); padding:10px 20px; border-radius:11px; font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:500; cursor:none; display:inline-flex; align-items:center; gap:7px; transition:all .2s; }
        .up-ghost:hover { border-color:rgba(59,130,246,.38); color:#e8edff; background:rgba(59,130,246,.05); }
        .up-card { background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.07); border-radius:18px; transition:transform .3s, border-color .3s, box-shadow .3s; }
        .up-card:hover { transform:translateY(-4px); border-color:rgba(59,130,246,.25); box-shadow:0 20px 55px rgba(59,130,246,.1); }
        .up-tab { background:transparent; border:none; padding:10px 20px; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:600; cursor:none; transition:.2s; }
        .up-tab.active { background:rgba(59,130,246,.15); color:#93c5fd; }
        .up-tab:not(.active) { color:#4a5568; }
        .up-tab:not(.active):hover { color:#8892a4; }
        .up-chip-blue { display:inline-flex; align-items:center; background:rgba(59,130,246,.12); border:1px solid rgba(59,130,246,.22); color:#93c5fd; padding:4px 12px; border-radius:50px; font-size:12px; font-weight:600; }
        .up-chip-green { display:inline-flex; align-items:center; background:rgba(16,185,129,.1); border:1px solid rgba(16,185,129,.22); color:#6ee7b7; padding:4px 12px; border-radius:50px; font-size:12px; font-weight:600; }
        .up-footer-link { color:#4a5568; font-size:13.5px; margin-bottom:11px; cursor:none; transition:color .2s; display:block; }
        .up-footer-link:hover { color:#e8edff; }
        .up-social-btn { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); display:flex; align-items:center; justify-content:center; color:#8892a4; font-size:12px; font-weight:700; cursor:none; transition:.2s; }
        .up-social-btn:hover { background:rgba(59,130,246,.1); border-color:rgba(59,130,246,.22); color:#93c5fd; }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:rgba(255,255,255,.03); } ::-webkit-scrollbar-thumb { background:rgba(59,130,246,.3); border-radius:2px; }
      `}</style>

      {/* Custom Cursor */}
      <div style={{ position:"fixed", width:36, height:36, border:"1.5px solid rgba(59,130,246,.5)", borderRadius:"50%", pointerEvents:"none", zIndex:9999, left:cursor.x, top:cursor.y, transform:`translate(-50%,-50%) scale(${cursorBig?2.2:1})`, opacity:cursor.x?1:0, transition:"transform .28s cubic-bezier(.16,1,.3,1)" }} />
      <div style={{ position:"fixed", width:5, height:5, background:"#3b82f6", borderRadius:"50%", pointerEvents:"none", zIndex:9999, left:cursor.x, top:cursor.y, transform:"translate(-50%,-50%)", opacity:cursor.x?1:0 }} />

      {/* Background Orbs */}
      <div style={{ position:"fixed", width:600, height:600, top:"-10%", left:"-10%", background:"radial-gradient(circle,rgba(59,130,246,.09) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none", zIndex:0, animation:"orbDrift 14s ease-in-out infinite" }} />
      <div style={{ position:"fixed", width:500, height:500, bottom:"-10%", right:"-5%", background:"radial-gradient(circle,rgba(139,92,246,.07) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none", zIndex:0, animation:"orbDrift 18s ease-in-out 2s infinite reverse" }} />

      {/* Nav */}
      <LinkWizHeader onCursorBig={big} onCursorSmall={small} />

      {/* Main */}
      <main style={{ position:"relative", zIndex:1, paddingTop:120, paddingBottom:100 }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 40px" }}>

          {/* ── Profile Header ── */}
          <div style={{ background:"rgba(255,255,255,.022)", border:"1px solid rgba(255,255,255,.07)", borderRadius:24, padding:"40px", position:"relative", overflow:"hidden", marginBottom:32 }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#3b82f6,#6366f1,#a78bfa)" }} />
            <div style={{ position:"absolute", top:-80, right:-80, width:260, height:260, background:"radial-gradient(circle,rgba(59,130,246,.07) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />

            <div style={{ display:"flex", gap:28, alignItems:"center", flexWrap:"wrap" }}>
              {/* Avatar */}
              <div style={{ position:"relative" }}>
                <div
  style={{
    width:100,
    height:100,
    borderRadius:"50%",
    background:"linear-gradient(135deg,#3b82f6,#6366f1)",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    fontSize:32,
    fontWeight:900,
    color:"#fff",
    border:"3px solid rgba(59,130,246,.3)",
    boxShadow:"0 0 0 4px rgba(59,130,246,.1)"
  }}
>
  {user.fullName?.split(" ").map(w => w[0]).join("").slice(0,2)}
</div>
                <div style={{ position:"absolute", bottom:4, right:4, width:18, height:18, borderRadius:"50%", background:"#34d399", border:"2px solid #04060e", animation:"pulseRing 2s ease-in-out infinite" }} />
              </div>

              {/* Info */}
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 }}>
                  <div>
                    <h1 style={{ fontFamily:"Fraunces,Georgia,serif", fontSize:32, fontWeight:900, color:"#e8edff", marginBottom:8, letterSpacing:"-.02em" }}>{user.name}</h1>
                    <div style={{ display:"flex", gap:18, color:"#8892a4", fontSize:13.5, flexWrap:"wrap" }}>
                      <span style={{ display:"flex", alignItems:"center", gap:5 }}><Icons.MapPin /> {user.city}, Pakistan</span>
                      <span style={{ display:"flex", alignItems:"center", gap:5 }}><Icons.Users /> Joined March 2024</span>
                      <span style={{ display:"flex", alignItems:"center", gap:5, color:"#34d399" }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", background:"#34d399", display:"inline-block" }} /> Active now
                      </span>
                    </div>
                  </div>
                  <button className="up-ghost" onClick={() => navigate("/edit-profile")} onMouseEnter={big} onMouseLeave={small}>
                    <Icons.Pen /> Edit Profile
                  </button>
                </div>

                {/* Stats */}
                <div style={{ display:"flex", gap:28, marginTop:22, flexWrap:"wrap" }}>
                  {[
                    { v:user.rating, l:"Rating", icon:<Icons.StarFill size={15}/> },
                    { v:user.sessions, l:"Sessions" },
                    { v:"3", l:"Active Exchanges" },
                    { v:"100%", l:"Response Rate" },
                  ].map((s,i) => (
                    <div key={i}>
                      <div style={{ display:"flex", alignItems:"center", gap:5, fontFamily:"Fraunces,Georgia,serif", fontSize:22, fontWeight:900, color:"#e8edff" }}>{s.icon}{s.v}</div>
                      <div style={{ fontSize:11, color:"#6b7280", fontWeight:600, textTransform:"uppercase", letterSpacing:".06em", marginTop:3 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Content Grid ── */}
          <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:28 }}>

            {/* Left Column */}
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

              {/* Skills Offered */}
              <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:18, padding:"24px" }}>
                <h3 style={{ fontSize:11, fontWeight:700, color:"#93c5fd", letterSpacing:".1em", textTransform:"uppercase", marginBottom:14, display:"flex", alignItems:"center", gap:7 }}>
                  <Icons.Sparkle /> Skills Offered
                </h3>
                <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                  {user.skills && user.skills.length > 0 ? (
                    user.skills.map(s => (
                      <span key={s} className="up-chip-blue">{s}</span>
                    ))
                  ) : (
                    <span className="up-chip-blue">No skills listed</span>
                  )}
                </div>
              </div>

              {/* Skills Wanted */}
              <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:18, padding:"24px" }}>
                <h3 style={{ fontSize:11, fontWeight:700, color:"#6ee7b7", letterSpacing:".1em", textTransform:"uppercase", marginBottom:14, display:"flex", alignItems:"center", gap:7 }}>
                  <Icons.Search /> Skills Wanted
                </h3>
                <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                  {user.wantedSkills && user.wantedSkills.length > 0 ? (
                    user.wantedSkills.map(s => (
                      <span key={s} className="up-chip-green">{s}</span>
                    ))
                  ) : (
                    [(user.skills && user.skills[1]) || "Guitar", "Spanish"].map(s => (
                      <span key={s} className="up-chip-green">{s}</span>
                    ))
                  )}
                </div>
              </div>

              {/* Bio */}
              <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:18, padding:"24px" }}>
                <h3 style={{ fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:".1em", textTransform:"uppercase", marginBottom:12 }}>Bio</h3>
                <p style={{ fontSize:13.5, color:"#8892a4", lineHeight:1.75 }}>
                  {user.bio || "Computer Science grad from FJWU. Happy to exchange coding lessons for creative skills!"}
                </p>
              </div>

              {/* Availability */}
              <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:18, padding:"24px" }}>
                <h3 style={{ fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:".1em", textTransform:"uppercase", marginBottom:14 }}>Availability</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {["Weekday Evenings","Weekends","Flexible Remote"].map((a,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#8892a4" }}>
                      <span style={{ width:6, height:6, borderRadius:"50%", background:"#34d399", flexShrink:0 }} />{a}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Tabs */}
              <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:12, padding:5, marginBottom:24, width:"fit-content" }}>
                {["exchanges","reviews","matches"].map(t => (
                  <button key={t} className={`up-tab ${activeTab===t?"active":""}`} onClick={() => setActiveTab(t)} onMouseEnter={big} onMouseLeave={small}>
                    {t.charAt(0).toUpperCase()+t.slice(1)}
                  </button>
                ))}
              </div>

              {/* Active Exchanges */}
              {activeTab === "exchanges" && (
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                    <h2 style={{ fontFamily:"Fraunces,Georgia,serif", fontSize:22, fontWeight:700, color:"#e8edff" }}>Active Exchanges</h2>
                    <a href="#" style={{ fontSize:13, color:"#60a5fa", fontWeight:600, textDecoration:"none" }} onMouseEnter={big} onMouseLeave={small}>View History →</a>
                  </div>
                  {MATCHES.map((m,i) => (
                    <div key={i} className="up-card" style={{ padding:"22px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
                      <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                        <div style={{ width:48, height:48, borderRadius:"50%", background:`linear-gradient(135deg,${m.grad[0]},${m.grad[1]})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#fff" }}>{m.i}</div>
                        <div>
                          <div style={{ fontFamily:"Fraunces,Georgia,serif", fontSize:16, fontWeight:700, color:"#e8edff", marginBottom:5 }}>{m.name}</div>
                          <div style={{ fontSize:12.5, color:"#8892a4", display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                            Teaching <span className="up-chip-blue" style={{ fontSize:10, padding:"2px 8px" }}>{m.want}</span>
                            · Learning <span className="up-chip-green" style={{ fontSize:10, padding:"2px 8px" }}>{m.offer}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:9 }}>
                        <button className="up-ghost" style={{ padding:"8px 14px", fontSize:12.5 }} onClick={() => navigate("/exchange-messaging")} onMouseEnter={big} onMouseLeave={small}>
                          <Icons.Chat /> Chat
                        </button>
                        <button className="up-primary" style={{ padding:"8px 14px", fontSize:12.5 }} onClick={() => alert("Schedule session - implement with backend")} onMouseEnter={big} onMouseLeave={small}>
                          <Icons.Calendar /> Schedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reviews */}
              {activeTab === "reviews" && (
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <h2 style={{ fontFamily:"Fraunces,Georgia,serif", fontSize:22, fontWeight:700, color:"#e8edff", marginBottom:4 }}>Reviews</h2>
                  {REVIEWS.map((r,i) => (
                    <div key={i} className="up-card" style={{ padding:"24px" }}>
                      <div style={{ display:"flex", gap:2, marginBottom:14 }}>
                        {Array(r.rating).fill(0).map((_,j) => <Icons.StarFill key={j} size={13} />)}
                      </div>
                      <p style={{ color:"#c4d0e8", fontSize:14, lineHeight:1.78, marginBottom:18, fontStyle:"italic" }}>"{r.text}"</p>
                      <div style={{ display:"flex", gap:10, alignItems:"center", borderTop:"1px solid rgba(255,255,255,.05)", paddingTop:16 }}>
                        <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${r.grad[0]},${r.grad[1]})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff" }}>{r.i}</div>
                        <div>
                          <div style={{ fontFamily:"Fraunces,Georgia,serif", fontWeight:700, color:"#e8edff", fontSize:13.5 }}>{r.name}</div>
                          <div style={{ color:"#4a5568", fontSize:12 }}>{r.date}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Matches */}
              {activeTab === "matches" && (
                <div>
                  <h2 style={{ fontFamily:"Fraunces,Georgia,serif", fontSize:22, fontWeight:700, color:"#e8edff", marginBottom:18 }}>Recommended Matches</h2>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                    {MATCHES.map((m,i) => (
                      <div key={i} className="up-card" style={{ padding:"20px" }}>
                        <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14 }}>
                          <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${m.grad[0]},${m.grad[1]})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#fff" }}>{m.i}</div>
                          <div>
                            <div style={{ fontFamily:"Fraunces,Georgia,serif", fontWeight:700, color:"#e8edff", fontSize:14 }}>{m.name}</div>
                            <div style={{ color:"#8892a4", fontSize:11.5 }}>{m.city}</div>
                          </div>
                          <div style={{ marginLeft:"auto", background:"rgba(59,130,246,.12)", border:"1px solid rgba(59,130,246,.2)", color:"#93c5fd", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:50 }}>{m.score}%</div>
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:14 }}>
                          <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                            <span style={{ fontSize:9, fontWeight:700, color:"#4a5568", letterSpacing:".1em", width:38 }}>OFFERS</span>
                            <span className="up-chip-blue" style={{ fontSize:11 }}>{m.offer}</span>
                          </div>
                          <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                            <span style={{ fontSize:9, fontWeight:700, color:"#4a5568", letterSpacing:".1em", width:38 }}>WANTS</span>
                            <span className="up-chip-green" style={{ fontSize:11 }}>{m.want}</span>
                          </div>
                        </div>
                        <button className="up-primary" style={{ width:"100%", justifyContent:"center", fontSize:12.5, padding:"9px 0" }} onClick={() => alert("Exchange request sent!")} onMouseEnter={big} onMouseLeave={small}>
                          Send Request <Icons.ArrowRight />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,.05)", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:1240, margin:"0 auto", padding:"60px 40px 40px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48, marginBottom:48 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <div style={{ width:34, height:34, background:"rgba(59,130,246,.12)", border:"1px solid rgba(59,130,246,.22)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#zapUPF)"/>
                    <defs><linearGradient id="zapUPF" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs>
                  </svg>
                </div>
                <span style={{ fontFamily:"Fraunces,Georgia,serif", fontSize:21, fontWeight:900, color:"#e8edff" }}>LinkWiz</span>
              </div>
              <p style={{ color:"#4a5568", fontSize:13, lineHeight:1.75, maxWidth:210, marginBottom:20 }}>Democratizing education through skill exchange. Built at FJWU.</p>
              <div style={{ display:"flex", gap:8 }}>
                {["T","L","G","D"].map((s,i) => <div key={i} className="up-social-btn" onMouseEnter={big} onMouseLeave={small}>{s}</div>)}
              </div>
            </div>
            {[
              { t:"Platform", ls:["How It Works","Browse Skills","Smart Matching","Dashboard"] },
              { t:"Company", ls:["About Us","Blog","Careers","Contact"] },
              { t:"Legal", ls:["Help Center","Safety","Terms","Privacy"] },
            ].map((col,i) => (
              <div key={i}>
                <div style={{ fontFamily:"Fraunces,Georgia,serif", fontWeight:700, color:"#e8edff", fontSize:14, marginBottom:16 }}>{col.t}</div>
                {col.ls.map((l,j) => {
                  const onClick = (e) => {
                    e.preventDefault();
                    if (l === "Dashboard") navigate("/dashboard");
                    else if (l === "Browse Skills") navigate("/browse-users");
                    else alert(`${l} page is under development`);
                  };
                  return (
                    <a key={j} href="#" onClick={onClick} className="up-footer-link" onMouseEnter={big} onMouseLeave={small}>{l}</a>
                  );
                })}
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
