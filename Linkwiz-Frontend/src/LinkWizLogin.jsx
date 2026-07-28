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
function FormInput({ type = "text", placeholder, value, onChange, onMouseEnter, onMouseLeave }) {
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
const ZapIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#zapLogin)"/>
    <defs>
      <linearGradient id="zapLogin" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60a5fa"/><stop offset="1" stopColor="#a78bfa"/>
      </linearGradient>
    </defs>
  </svg>
);

/* ─── MAIN COMPONENT ─── */
export default function LinkWizLogin() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [cursorBig, setCursorBig] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fn = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const big = () => setCursorBig(true);
  const small = () => setCursorBig(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      localStorage.setItem("token", response.token);
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
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
        @keyframes pingBig { 0%{opacity:.55;transform:scale(1)} 100%{opacity:0;transform:scale(2.8)} }
        .ln-link { color:#4a5568; text-decoration:none; font-size:14px; font-weight:500; cursor:none; transition:color .2s; }
        .ln-link:hover { color:#e8edff; }
        .ln-primary { background:linear-gradient(135deg,#3b82f6,#6366f1); color:#fff; border:none; padding:13px 26px; border-radius:12px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; cursor:none; display:inline-flex; align-items:center; justify-content:center; gap:8px; transition:box-shadow .3s; width:100%; }
        .ln-primary:hover { box-shadow:0 16px 50px rgba(59,130,246,.42); }
        .ln-ghost { background:transparent; color:#8892a4; border:1.5px solid rgba(255,255,255,.09); padding:11px 22px; border-radius:12px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; cursor:none; transition:all .2s; }
        .ln-ghost:hover { border-color:rgba(59,130,246,.38); color:#e8edff; background:rgba(59,130,246,.05); }
        .ln-footer-link { color:#4a5568; font-size:13.5px; margin-bottom:11px; cursor:none; transition:color .2s; display:block; }
        .ln-footer-link:hover { color:#e8edff; }
        .ln-social-btn { width:36px; height:36px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); display:flex; align-items:center; justify-content:center; color:#8892a4; font-size:12px; font-weight:700; cursor:none; transition:.2s; }
        .ln-social-btn:hover { background:rgba(59,130,246,.1); border-color:rgba(59,130,246,.22); color:#93c5fd; }
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

      {/* Login Section */}
      <section style={{ minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", position:"relative", padding:"100px 20px" }}>
        <ParticleCanvas />

        {/* Grid overlay */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", zIndex:0, pointerEvents:"none" }} preserveAspectRatio="none">
          <defs>
            <pattern id="lgrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,.025)" strokeWidth="1"/>
            </pattern>
            <radialGradient id="lgridFade" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="1"/>
              <stop offset="100%" stopColor="white" stopOpacity="0"/>
            </radialGradient>
            <mask id="lgridMask">
              <rect width="100%" height="100%" fill="url(#lgridFade)"/>
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#lgrid)" mask="url(#lgridMask)"/>
        </svg>

        {/* Login Card */}
        <div style={{ position:"relative", zIndex:2, background:"rgba(10,14,28,.7)", border:"1px solid rgba(255,255,255,.08)", borderRadius:24, padding:"50px 44px", width:"100%", maxWidth:440, backdropFilter:"blur(24px)", boxShadow:"0 24px 80px rgba(0,0,0,.5)" }}>

          {/* Top glow line */}
          <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:1, background:"linear-gradient(90deg,transparent,rgba(59,130,246,.6),transparent)", borderRadius:1 }} />

          {/* Logo */}
          <div style={{ display:"flex", justifyContent:"center", marginBottom:26 }}>
            <div style={{ width:52, height:52, background:"rgba(59,130,246,.12)", border:"1px solid rgba(59,130,246,.22)", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#zapLogin2)"/>
                <defs><linearGradient id="zapLogin2" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs>
              </svg>
            </div>
          </div>

          <h2 style={{ fontFamily:"Fraunces,Georgia,serif", fontSize:30, fontWeight:900, color:"#e8edff", textAlign:"center", marginBottom:8, letterSpacing:"-.02em" }}>Welcome back</h2>
          <p style={{ color:"#8892a4", fontSize:14, textAlign:"center", marginBottom:36, lineHeight:1.6 }}>Log in to continue your skill exchange journey</p>

          <form onSubmit={e => e.preventDefault()} style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#9ca3af", marginBottom:8, letterSpacing:".08em", textTransform:"uppercase" }}>Email Address</label>
              <FormInput type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onMouseEnter={big} onMouseLeave={small} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#9ca3af", marginBottom:8, letterSpacing:".08em", textTransform:"uppercase" }}>Password</label>
              <FormInput type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onMouseEnter={big} onMouseLeave={small} />
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#8892a4", cursor:"none" }} onMouseEnter={big} onMouseLeave={small}>
                <input type="checkbox" style={{ accentColor:"#3b82f6", cursor:"none" }} />
                Remember me
              </label>
              <a href="#" style={{ color:"#60a5fa", fontSize:13, textDecoration:"none", fontWeight:500 }} onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your email!"); }} onMouseEnter={big} onMouseLeave={small}>Forgot password?</a>
            </div>

            <button type="submit" className="ln-primary" style={{ marginTop:8, fontSize:15, padding:"14px" }} 
              onClick={handleLogin}
              disabled={loading}
              onMouseEnter={big} onMouseLeave={small}>
              {loading ? "Logging in..." : "Log In"}
            </button>

            {error && <div style={{ color: "#ff6b6b", fontSize: 13, marginTop: 12, padding: "10px", background: "rgba(255,107,107,.1)", borderRadius: 8, border: "1px solid rgba(255,107,107,.2)" }}>{error}</div>}
          </form>

          <div style={{ display:"flex", alignItems:"center", gap:14, margin:"24px 0" }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,.07)" }} />
            <span style={{ color:"#4a5568", fontSize:12 }}>or continue with</span>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,.07)" }} />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
            {["Google","GitHub"].map((p,i) => (
              <button key={i} className="ln-ghost" style={{ justifyContent:"center", padding:"10px", fontSize:13 }} onClick={() => navigate("/dashboard")} onMouseEnter={big} onMouseLeave={small}>
                {p}
              </button>
            ))}
          </div>

          <div style={{ textAlign:"center", fontSize:14, color:"#8892a4" }}>
            Don't have an account?{" "}
            <a href="#" style={{ color:"#60a5fa", fontWeight:600, textDecoration:"none" }} onClick={(e) => {e.preventDefault(); navigate("/register");}} onMouseEnter={big} onMouseLeave={small}>Sign up free</a>
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
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#zapF)"/>
                    <defs><linearGradient id="zapF" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs>
                  </svg>
                </div>
                <span style={{ fontFamily:"Fraunces,Georgia,serif", fontSize:21, fontWeight:900, color:"#e8edff" }}>LinkWiz</span>
              </div>
              <p style={{ color:"#4a5568", fontSize:13, lineHeight:1.75, maxWidth:210, marginBottom:20 }}>Democratizing education through skill exchange. Built at FJWU.</p>
              <div style={{ display:"flex", gap:8 }}>
                {["T","L","G","D"].map((s,i) => <div key={i} className="ln-social-btn" onMouseEnter={big} onMouseLeave={small}>{s}</div>)}
              </div>
            </div>
            {[
              { t:"Platform", ls:["How It Works","Browse Skills","Smart Matching","Dashboard"] },
              { t:"Company", ls:["About Us","Blog","Careers","Contact"] },
              { t:"Legal", ls:["Help Center","Safety","Terms","Privacy"] },
            ].map((col,i) => (
              <div key={i}>
                <div style={{ fontFamily:"Fraunces,Georgia,serif", fontWeight:700, color:"#e8edff", fontSize:14, marginBottom:16 }}>{col.t}</div>
                {col.ls.map((l,j) => <a key={j} href="#" className="ln-footer-link" onMouseEnter={big} onMouseLeave={small}>{l}</a>)}
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
