import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LinkWizHeader from "./LinkWizHeader";
import authService from "./services/authService";

/* ─── PARTICLE CANVAS ─── */
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

    ptRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.4 + .4,
      a: Math.random() * .4 + .08,
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

/* ─── FORM INPUT ─── */
function FormInput({ type = "text", placeholder, onMouseEnter, onMouseLeave, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
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
      }}
    />
  );
}

/* ─── ICONS ─── */
const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.727 12.727.707.707M3 12h1m16 0h1M4.22 19.78l.707-.707m12.727-12.727.707-.707M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/* ─── MAIN COMPONENT ─── */
export default function LinkWizRegister() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [cursorBig, setCursorBig] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skillsOffer, setSkillsOffer] = useState("");
  const [skillsWant, setSkillsWant] = useState("");

  useEffect(() => {
    const fn = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const big = () => setCursorBig(true);
  const small = () => setCursorBig(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName || !city || !email || !password) {
      setError("Please fill out all required fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const skillsArray = skillsOffer.split(",").map(s => s.trim()).filter(Boolean);
      const response = await authService.register({
  fullName,
  city,
  email,
  password,
  skills: skillsOffer
    .split(",")
    .map(s => s.trim())
    .filter(Boolean),

  wantedSkills: skillsWant
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
});
      localStorage.setItem("token", response.token);
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#04060e", color: "#e8edff", minHeight: "100vh", cursor: "none" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        @keyframes orbDrift { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(24px,-16px) scale(1.04)} }
        .rg-link { color:#4a5568; text-decoration:none; font-size:14px; font-weight:500; cursor:none; transition:color .2s; }
        .rg-link:hover { color:#e8edff; }
        .rg-primary { background:linear-gradient(135deg,#3b82f6,#6366f1); color:#fff; border:none; padding:14px 32px; border-radius:12px; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:600; cursor:none; display:inline-flex; align-items:center; justify-content:center; gap:8px; transition:box-shadow .3s; width:100%; }
        .rg-primary:hover { box-shadow:0 16px 50px rgba(59,130,246,.42); }
        .rg-ghost { background:transparent; color:#8892a4; border:1.5px solid rgba(255,255,255,.09); padding:11px 22px; border-radius:12px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; cursor:none; transition:all .2s; }
        .rg-ghost:hover { border-color:rgba(59,130,246,.38); color:#e8edff; background:rgba(59,130,246,.05); }
        .rg-footer-link { color:#4a5568; font-size:13.5px; margin-bottom:11px; cursor:none; transition:color .2s; display:block; }
        .rg-footer-link:hover { color:#e8edff; }
        .rg-social-btn { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); display:flex; align-items:center; justify-content:center; color:#8892a4; font-size:12px; font-weight:700; cursor:none; transition:.2s; }
        .rg-social-btn:hover { background:rgba(59,130,246,.1); border-color:rgba(59,130,246,.22); color:#93c5fd; }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:rgba(255,255,255,.03); } ::-webkit-scrollbar-thumb { background:rgba(59,130,246,.3); border-radius:2px; }
      `}</style>

      {/* Custom Cursor */}
      <div style={{ position:"fixed", width:36, height:36, border:"1.5px solid rgba(59,130,246,.5)", borderRadius:"50%", pointerEvents:"none", zIndex:9999, left:cursor.x, top:cursor.y, transform:`translate(-50%,-50%) scale(${cursorBig?2.2:1})`, opacity:cursor.x?1:0, transition:"transform .28s cubic-bezier(.16,1,.3,1)" }} />
      <div style={{ position:"fixed", width:5, height:5, background:"#3b82f6", borderRadius:"50%", pointerEvents:"none", zIndex:9999, left:cursor.x, top:cursor.y, transform:"translate(-50%,-50%)", opacity:cursor.x?1:0 }} />

      {/* Background Orbs */}
      <div style={{ position:"fixed", width:600, height:600, top:"-10%", left:"-10%", background:"radial-gradient(circle,rgba(59,130,246,.1) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none", zIndex:0, animation:"orbDrift 13s ease-in-out infinite" }} />
      <div style={{ position:"fixed", width:500, height:500, bottom:"-10%", right:"-5%", background:"radial-gradient(circle,rgba(139,92,246,.08) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none", zIndex:0, animation:"orbDrift 17s ease-in-out 2s infinite reverse" }} />

      {/* Nav */}
      <LinkWizHeader onCursorBig={big} onCursorSmall={small} />

      {/* Register Section */}
      <section style={{ minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", position:"relative", padding:"100px 20px" }}>
        <ParticleCanvas />

        {/* Grid overlay */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", zIndex:0, pointerEvents:"none" }} preserveAspectRatio="none">
          <defs>
            <pattern id="rgrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,.025)" strokeWidth="1"/>
            </pattern>
            <radialGradient id="rgridFade" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="1"/>
              <stop offset="100%" stopColor="white" stopOpacity="0"/>
            </radialGradient>
            <mask id="rgridMask">
              <rect width="100%" height="100%" fill="url(#rgridFade)"/>
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#rgrid)" mask="url(#rgridMask)"/>
        </svg>

        {/* Register Card */}
        <div style={{ position:"relative", zIndex:2, background:"rgba(10,14,28,.7)", border:"1px solid rgba(255,255,255,.08)", borderRadius:24, padding:"50px 44px", width:"100%", maxWidth:560, backdropFilter:"blur(24px)", boxShadow:"0 24px 80px rgba(0,0,0,.5)" }}>

          {/* Top glow line */}
          <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:1, background:"linear-gradient(90deg,transparent,rgba(59,130,246,.6),transparent)", borderRadius:1 }} />

          {/* Step indicators */}
          <div style={{ display:"flex", gap:8, marginBottom:32 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ flex:1, height:3, borderRadius:4, background: i <= step ? "linear-gradient(90deg,#3b82f6,#6366f1)" : "rgba(255,255,255,.08)", transition:"background .4s" }} />
            ))}
          </div>

          {/* Logo */}
          <div style={{ display:"flex", justifyContent:"center", marginBottom:22 }}>
            <div style={{ width:52, height:52, background:"rgba(59,130,246,.12)", border:"1px solid rgba(59,130,246,.22)", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#zapReg2)"/>
                <defs><linearGradient id="zapReg2" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs>
              </svg>
            </div>
          </div>

          <h2 style={{ fontFamily:"Fraunces,Georgia,serif", fontSize:30, fontWeight:900, color:"#e8edff", textAlign:"center", marginBottom:8, letterSpacing:"-.02em" }}>Create your account</h2>
          <p style={{ color:"#8892a4", fontSize:14, textAlign:"center", marginBottom:36, lineHeight:1.6 }}>Join thousands of learners exchanging skills across Pakistan</p>

          <form onSubmit={e => e.preventDefault()}>
            {/* Basic Info */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              <div>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#9ca3af", marginBottom:8, letterSpacing:".08em", textTransform:"uppercase" }}>Full Name</label>
                <FormInput type="text" placeholder="Sarah Ahmed" value={fullName} onChange={e => setFullName(e.target.value)} onMouseEnter={big} onMouseLeave={small} />
              </div>
              <div>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#9ca3af", marginBottom:8, letterSpacing:".08em", textTransform:"uppercase" }}>City</label>
                <FormInput type="text" placeholder="Lahore, Pakistan" value={city} onChange={e => setCity(e.target.value)} onMouseEnter={big} onMouseLeave={small} />
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
              <div>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#9ca3af", marginBottom:8, letterSpacing:".08em", textTransform:"uppercase" }}>Email Address</label>
                <FormInput type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onMouseEnter={big} onMouseLeave={small} />
              </div>
              <div>
                <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#9ca3af", marginBottom:8, letterSpacing:".08em", textTransform:"uppercase" }}>Password</label>
                <FormInput type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onMouseEnter={big} onMouseLeave={small} />
              </div>
            </div>

            <div style={{ height:1, background:"rgba(255,255,255,.05)", margin:"8px 0 24px" }} />

            {/* Skills */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
              <div>
                <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, fontWeight:700, color:"#93c5fd", marginBottom:8, letterSpacing:".08em", textTransform: "uppercase" }}>
                  <SparkleIcon /> Skills You Offer
                </label>
                <FormInput type="text" placeholder="e.g. Python, UX Design" value={skillsOffer} onChange={e => setSkillsOffer(e.target.value)} onMouseEnter={big} onMouseLeave={small} />
                <div style={{ fontSize:11, color:"#6b7280", marginTop:5 }}>Separate with commas</div>
              </div>
              <div>
                <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, fontWeight:700, color:"#6ee7b7", marginBottom:8, letterSpacing:".08em", textTransform: "uppercase" }}>
                  <SearchIcon /> Skills You Want
                </label>
                <FormInput type="text" placeholder="e.g. Guitar, French" value={skillsWant} onChange={e => setSkillsWant(e.target.value)} onMouseEnter={big} onMouseLeave={small} />
                <div style={{ fontSize:11, color:"#6b7280", marginTop:5 }}>Separate with commas</div>
              </div>
            </div>

            {/* Terms */}
            <label style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:28, cursor:"none" }} onMouseEnter={big} onMouseLeave={small}>
              <input type="checkbox" style={{ accentColor:"#3b82f6", marginTop:2, cursor:"none", flexShrink:0 }} />
              <span style={{ fontSize:13, color:"#8892a4", lineHeight:1.6 }}>
                I agree to the <a href="#" style={{ color:"#60a5fa", textDecoration:"none" }}>Terms of Service</a> and <a href="#" style={{ color:"#60a5fa", textDecoration:"none" }}>Privacy Policy</a>
              </span>
            </label>

            <button type="submit" className="rg-primary" onClick={handleRegister} disabled={loading} onMouseEnter={big} onMouseLeave={small}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {error && <div style={{ color: "#ff6b6b", fontSize: 13, marginTop: 12, padding: "10px", background: "rgba(255,107,107,.1)", borderRadius: 8, border: "1px solid rgba(255,107,107,.2)" }}>{error}</div>}
          </form>

          {/* Perks */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:16, justifyContent:"center", marginTop:24 }}>
            {["Free forever","No credit card","2-min setup"].map((t,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:6, color:"#8892a4", fontSize:12 }}>
                <span style={{ color:"#34d399" }}><CheckIcon /></span>{t}
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:22, fontSize:14, color:"#8892a4" }}>
            Already have an account?{" "}
            <a href="#" style={{ color:"#60a5fa", fontWeight:600, textDecoration:"none" }} onClick={(e) => {e.preventDefault(); navigate("/login");}} onMouseEnter={big} onMouseLeave={small}>Log in</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,.05)", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:1240, margin:"0 auto", padding:"60px 40px 40px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48, marginBottom:48 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <div style={{ width:34, height:34, background:"rgba(59,130,246,.12)", border:"1px solid rgba(59,130,246,.22)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#zapRegF)"/>
                    <defs><linearGradient id="zapRegF" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs>
                  </svg>
                </div>
                <span style={{ fontFamily:"Fraunces,Georgia,serif", fontSize:21, fontWeight:900, color:"#e8edff" }}>LinkWiz</span>
              </div>
              <p style={{ color:"#4a5568", fontSize:13, lineHeight:1.75, maxWidth:210, marginBottom:20 }}>Democratizing education through skill exchange. Built at FJWU.</p>
              <div style={{ display:"flex", gap:8 }}>
                {["T","L","G","D"].map((s,i) => <div key={i} className="rg-social-btn" onMouseEnter={big} onMouseLeave={small}>{s}</div>)}
              </div>
            </div>
            {[
              { t:"Platform", ls:["How It Works","Browse Skills","Smart Matching","Dashboard"] },
              { t:"Company", ls:["About Us","Blog","Careers","Contact"] },
              { t:"Legal", ls:["Help Center","Safety","Terms","Privacy"] },
            ].map((col,i) => (
              <div key={i}>
                <div style={{ fontFamily:"Fraunces,Georgia,serif", fontWeight:700, color:"#e8edff", fontSize:14, marginBottom:16 }}>{col.t}</div>
                {col.ls.map((l,j) => <a key={j} href="#" className="rg-footer-link" onMouseEnter={big} onMouseLeave={small}>{l}</a>)}
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
