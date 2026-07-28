import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LinkWizHeader from "./LinkWizHeader";
import userService from "./services/userService";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-track{background:rgba(255,255,255,.03);}
  ::-webkit-scrollbar-thumb{background:rgba(59,130,246,.3);border-radius:2px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes statusPing{0%{transform:scale(1);opacity:1}100%{transform:scale(2.4);opacity:0}}
  @keyframes checkBounce{0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)}}
  @keyframes toastIn{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes toastOut{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(10px) scale(.96)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes sectionIn{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}
  @keyframes toggleSlide{from{transform:translateX(0)}to{transform:translateX(22px)}}
`;

/* ── ICONS ── */
const I = {
  Zap:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#zG)"/><defs><linearGradient id="zG" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs></svg>,
  User:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Lock:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Bell:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Shield:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Globe:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Trash:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Eye:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Check:()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Camera:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Mail:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Phone:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.95-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  MapPin:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Link:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  Palette:()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
  Key:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  AlertTri:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Download:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  LogOut:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Devices:()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="14" height="11" rx="2"/><path d="M20 3h0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="14" x2="12" y2="21"/></svg>,
  Pencil:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  ChevRight:()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Exchange:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
};

/* ── PARTICLE CANVAS ── */
function ParticleCanvas() {
  const ref = useRef(null);
  const raf = useRef(null);
  const mouse = useRef({ x: -999, y: -999 });
  const pts = useRef([]);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    let W = c.width = window.innerWidth, H = c.height = window.innerHeight;
    const rz = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    const mv = e => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("resize", rz); window.addEventListener("mousemove", mv);
    pts.current = Array.from({ length: 50 }, () => ({ x: Math.random()*W, y: Math.random()*H, vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3, r:Math.random()*1.2+.3, a:Math.random()*.38+.07, hue:Math.random()>.5?215:260 }));
    const tick = () => {
      ctx.clearRect(0,0,W,H);
      pts.current.forEach((p,i) => {
        const {x:mx,y:my}=mouse.current, d=Math.hypot(mx-p.x,my-p.y);
        if(d<100){p.vx-=(mx-p.x)/d*.05; p.vy-=(my-p.y)/d*.05;}
        p.vx*=.984; p.vy*=.984; p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`hsla(${p.hue},75%,68%,${p.a})`; ctx.fill();
        pts.current.slice(i+1).forEach(q=>{const dd=Math.hypot(p.x-q.x,p.y-q.y); if(dd<90){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(79,124,255,${.11*(1-dd/90)})`;ctx.lineWidth=.5;ctx.stroke();}});
      });
      raf.current=requestAnimationFrame(tick);
    };
    tick();
    return()=>{cancelAnimationFrame(raf.current);window.removeEventListener("resize",rz);window.removeEventListener("mousemove",mv);};
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}/>;
}

/* ── TOAST ── */
function Toast({ msg, type, onDone }) {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => { setLeaving(true); setTimeout(onDone, 320); }, 2800);
    return () => clearTimeout(t);
  }, []);
  const colors = { success: ["rgba(16,185,129,.12)","rgba(16,185,129,.3)","#6ee7b7"], error: ["rgba(239,68,68,.12)","rgba(239,68,68,.3)","#fca5a5"], info: ["rgba(59,130,246,.12)","rgba(59,130,246,.3)","#93c5fd"] };
  const [bg, border, col] = colors[type] || colors.info;
  return (
    <div style={{ position:"fixed", bottom:28, right:28, zIndex:9999, background:bg, border:`1px solid ${border}`, borderRadius:14, padding:"14px 20px", display:"flex", alignItems:"center", gap:10, color:col, fontSize:13.5, fontWeight:600, fontFamily:"'DM Sans',sans-serif", animation:`${leaving?"toastOut":"toastIn"} .32s ease forwards`, boxShadow:"0 20px 40px rgba(0,0,0,.4)", maxWidth:320 }}>
      {type==="success"&&<span style={{fontSize:16}}>✓</span>}
      {type==="error"&&<span style={{fontSize:16}}>✕</span>}
      {type==="info"&&<span style={{fontSize:16}}>ℹ</span>}
      {msg}
    </div>
  );
}

/* ── TOGGLE ── */
function Toggle({ on, onChange }) {
  return (
    <div onClick={()=>onChange(!on)} style={{ width:44, height:24, borderRadius:50, background: on?"rgba(59,130,246,.7)":"rgba(255,255,255,.1)", border:`1px solid ${on?"rgba(59,130,246,.5)":"rgba(255,255,255,.12)"}`, cursor:"pointer", position:"relative", transition:"all .25s", flexShrink:0 }}>
      <div style={{ position:"absolute", top:3, left: on?19:3, width:16, height:16, borderRadius:"50%", background: on?"#fff":"rgba(255,255,255,.4)", transition:"left .25s cubic-bezier(.34,1.56,.64,1)", boxShadow: on?"0 2px 8px rgba(59,130,246,.5)":"none" }}/>
    </div>
  );
}

/* ── INPUT FIELD ── */
function Field({ label, value, onChange, type="text", icon, placeholder, hint, disabled, suffix }) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPwd = type === "password";
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display:"block", fontSize:11.5, fontWeight:700, color:"#8892a4", letterSpacing:".1em", textTransform:"uppercase", marginBottom:8 }}>{label}</label>
      <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
        {icon && <span style={{ position:"absolute", left:14, color:"#4a5568", display:"flex", pointerEvents:"none" }}>{icon}</span>}
        <input
          type={isPwd&&!show?"password":isPwd?"text":type}
          value={value}
          onChange={e=>onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={()=>setFocused(true)}
          onBlur={()=>setFocused(false)}
          style={{ width:"100%", background: disabled?"rgba(255,255,255,.02)":"rgba(255,255,255,.04)", border:`1.5px solid ${focused?"rgba(59,130,246,.45)":"rgba(255,255,255,.08)"}`, borderRadius:12, padding:`11px ${isPwd||suffix?42:14}px 11px ${icon?42:14}px`, color: disabled?"#4a5568":"#e8edff", fontFamily:"'DM Sans',sans-serif", fontSize:13.5, outline:"none", cursor: disabled?"not-allowed":"text", transition:"border-color .2s" }}
        />
        {isPwd && <button type="button" onClick={()=>setShow(s=>!s)} style={{ position:"absolute", right:14, color:"#4a5568", background:"none", border:"none", cursor:"pointer", display:"flex" }}>{show?<I.EyeOff/>:<I.Eye/>}</button>}
        {suffix && !isPwd && <span style={{ position:"absolute", right:14, fontSize:12, color:"#4a5568" }}>{suffix}</span>}
      </div>
      {hint && <p style={{ fontSize:11.5, color:"#4a5568", marginTop:6 }}>{hint}</p>}
    </div>
  );
}

/* ── SECTION CARD ── */
function Section({ title, description, icon, children, danger }) {
  return (
    <div style={{ background: danger?"rgba(239,68,68,.03)":"rgba(255,255,255,.022)", border:`1px solid ${danger?"rgba(239,68,68,.15)":"rgba(255,255,255,.065)"}`, borderRadius:20, overflow:"hidden", marginBottom:18, animation:"sectionIn .4s ease both" }}>
      <div style={{ padding:"22px 28px 18px", borderBottom:`1px solid ${danger?"rgba(239,68,68,.1)":"rgba(255,255,255,.05)"}`, display:"flex", alignItems:"flex-start", gap:14 }}>
        <div style={{ width:38, height:38, borderRadius:11, background: danger?"rgba(239,68,68,.1)":"rgba(59,130,246,.1)", border:`1px solid ${danger?"rgba(239,68,68,.2)":"rgba(59,130,246,.18)"}`, display:"flex", alignItems:"center", justifyContent:"center", color: danger?"#f87171":"#93c5fd", flexShrink:0 }}>{icon}</div>
        <div>
          <h3 style={{ fontSize:15.5, fontWeight:700, color: danger?"#f87171":"#e8edff", marginBottom:3 }}>{title}</h3>
          <p style={{ fontSize:12.5, color:"#4a5568", lineHeight:1.6 }}>{description}</p>
        </div>
      </div>
      <div style={{ padding:"24px 28px" }}>{children}</div>
    </div>
  );
}

/* ── SAVE BUTTON ── */
function SaveBtn({ label="Save changes", onClick, loading, disabled, danger }) {
  const [h, setH] = useState(false);
  return (
    <button onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onClick} disabled={disabled||loading}
      style={{ padding:"10px 24px", borderRadius:12, border:"none", background: disabled||loading?"rgba(255,255,255,.05)": danger?"rgba(239,68,68,.18)":"linear-gradient(135deg,#3b82f6,#6366f1)", color: disabled||loading?"#4a5568": danger?"#f87171":"#fff", fontSize:13.5, fontWeight:700, fontFamily:"'DM Sans',sans-serif", cursor: disabled||loading?"not-allowed":"pointer", transition:"all .22s", display:"flex", alignItems:"center", gap:8, boxShadow: h&&!disabled&&!loading&&!danger?"0 12px 30px rgba(59,130,246,.35)":"none" }}>
      {loading && <div style={{ width:13, height:13, border:"2px solid rgba(255,255,255,.25)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 1s linear infinite" }}/>}
      {label}
    </button>
  );
}

/* ── SETTINGS NAV ITEM ── */
function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <button onClick={onClick} style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"10px 14px", borderRadius:12, border:"none", background: active?"rgba(59,130,246,.14)":"transparent", color: active?"#93c5fd":"#8892a4", fontSize:13.5, fontWeight: active?700:500, fontFamily:"'DM Sans',sans-serif", cursor:"pointer", textAlign:"left", transition:"all .2s", marginBottom:4, position:"relative" }}>
      <span style={{ color: active?"#93c5fd":"#4a5568", display:"flex" }}>{icon}</span>
      {label}
      {badge && <span style={{ marginLeft:"auto", fontSize:10, fontWeight:800, background:"rgba(239,68,68,.2)", border:"1px solid rgba(239,68,68,.3)", color:"#f87171", padding:"1px 7px", borderRadius:50 }}>{badge}</span>}
      {active && <span style={{ position:"absolute", left:0, top:"20%", bottom:"20%", width:3, borderRadius:"0 2px 2px 0", background:"linear-gradient(180deg,#3b82f6,#6366f1)" }}/>}
    </button>
  );
}

/* ══════════════════════════════════
   SECTION PANELS
══════════════════════════════════ */


 function ProfileSection({ user, toast }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setUsername(
        user.fullName
          ?.toLowerCase()
          .replace(/\s+/g, ".") || ""
      );
      setBio(user.bio || "");
      setCity(user.city || "");
    }
  }, [user]);
  const save = async () => {
  try {
    setLoading(true);

    await userService.updateProfile({
      fullName: name,
      city,
      bio
    });

    toast("Profile updated successfully", "success");
  } catch (err) {
    console.error(err);
    toast("Failed to update profile", "error");
  } finally {
    setLoading(false);
  }
};
  return (
    <>
      <Section title="Profile Photo" description="Update your profile picture visible to swap partners" icon={<I.Camera/>}>
        <div style={{ display:"flex", alignItems:"center", gap:20 }}>
          <div style={{ position:"relative" }}>
            <div style={{ width:76, height:76, borderRadius:"50%", background:"linear-gradient(135deg,#3b82f6,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontWeight:800, color:"#fff", border:"3px solid rgba(59,130,246,.3)" }}>AR</div>
            <div style={{ position:"absolute", bottom:0, right:0, width:24, height:24, borderRadius:"50%", background:"rgba(59,130,246,.9)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", border:"2px solid #04060e", color:"#fff" }}><I.Camera/></div>
          </div>
          <div>
            <p style={{ fontSize:13, color:"#c4d0e8", marginBottom:8 }}>JPG, PNG or WebP. Max 5 MB.</p>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => toast("Photo upload triggered (mocked)", "success")} style={{ padding:"7px 16px", borderRadius:9, border:"1px solid rgba(59,130,246,.3)", background:"rgba(59,130,246,.08)", color:"#93c5fd", fontSize:12.5, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Upload photo</button>
              <button onClick={() => toast("Photo removed (mocked)", "success")} style={{ padding:"7px 16px", borderRadius:9, border:"1px solid rgba(255,255,255,.08)", background:"transparent", color:"#4a5568", fontSize:12.5, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Remove</button>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Personal Information" description="Your name, bio, and public-facing details" icon={<I.User/>}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 24px" }}>
          <Field label="Full name" value={name} onChange={setName} icon={<I.User/>} placeholder="Your full name"/>
          <Field label="Username" value={username} onChange={setUsername} placeholder="username" hint="linkwiz.io/@ahmed.raza" suffix="@"/>
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={{ display:"block", fontSize:11.5, fontWeight:700, color:"#8892a4", letterSpacing:".1em", textTransform:"uppercase", marginBottom:8 }}>Bio</label>
          <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3}
            style={{ width:"100%", background:"rgba(255,255,255,.04)", border:"1.5px solid rgba(255,255,255,.08)", borderRadius:12, padding:"11px 14px", color:"#e8edff", fontFamily:"'DM Sans',sans-serif", fontSize:13.5, resize:"vertical", outline:"none", lineHeight:1.7, cursor:"text" }}
            onFocus={e=>e.target.style.borderColor="rgba(59,130,246,.45)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.08)"}/>
          <p style={{ textAlign:"right", fontSize:11, color: bio.length>160?"#f87171":"#4a5568", marginTop:5 }}>{bio.length}/200</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 24px" }}>
          <Field label="City / Location" value={city} onChange={setCity} icon={<I.MapPin/>} placeholder="Your city"/>
          <Field label="Phone number" value={phone} onChange={setPhone} icon={<I.Phone/>} placeholder="+92 ..."/>
        </div>
        <Field label="Website / Portfolio" value={website} onChange={setWebsite} icon={<I.Link/>} placeholder="yoursite.com"/>
        <SaveBtn onClick={save} loading={loading}/>
      </Section>
    </>
  );
}


function AccountSection({ user, toast }) {
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  useEffect(() => {
  if (user) {
    setEmail(user.email || "");
  }
}, [user]);

  const pwdStrength = newPwd.length===0?0:newPwd.length<6?1:newPwd.length<10?2:/[A-Z]/.test(newPwd)&&/[0-9]/.test(newPwd)&&/[^a-zA-Z0-9]/.test(newPwd)?4:3;
  const strengthLabel = ["","Too short","Fair","Good","Strong"];
  const strengthColor = ["","#ef4444","#f59e0b","#3b82f6","#10b981"];

  const saveEmail = () => {
    if(!newEmail.includes("@")){toast("Please enter a valid email","error");return;}
    setEmailLoading(true);
    setTimeout(()=>{ setEmailLoading(false); toast("Verification sent to "+newEmail,"info"); setNewEmail(""); },1200);
  };
  const savePwd = () => {
    if(newPwd!==confirmPwd){toast("Passwords do not match","error");return;}
    if(newPwd.length<8){toast("Password must be at least 8 characters","error");return;}
    setPwdLoading(true);
    setTimeout(()=>{ setPwdLoading(false); toast("Password changed successfully","success"); setCurrentPwd(""); setNewPwd(""); setConfirmPwd(""); },1300);
  };

  return (
    <>
      <Section title="Email Address" description="Update the email used to sign in and receive notifications" icon={<I.Mail/>}>
        <Field label="Current email" value={email} onChange={()=>{}} disabled icon={<I.Mail/>}/>
        <Field label="New email address" value={newEmail} onChange={setNewEmail} placeholder="newemail@example.com" icon={<I.Mail/>} hint="A verification link will be sent to your new address."/>
        <SaveBtn label="Update email" onClick={saveEmail} loading={emailLoading} disabled={!newEmail.trim()}/>
      </Section>

      <Section title="Change Password" description="Use a strong, unique password to protect your account" icon={<I.Lock/>}>
        <Field label="Current password" value={currentPwd} onChange={setCurrentPwd} type="password" icon={<I.Key/>} placeholder="Enter current password"/>
        <Field label="New password" value={newPwd} onChange={setNewPwd} type="password" icon={<I.Lock/>} placeholder="Min 8 characters"/>
        {newPwd.length>0 && (
          <div style={{ marginBottom:16, marginTop:-12 }}>
            <div style={{ display:"flex", gap:4, marginBottom:5 }}>
              {[1,2,3,4].map(s=><div key={s} style={{ flex:1, height:3, borderRadius:2, background: s<=pwdStrength?strengthColor[pwdStrength]:"rgba(255,255,255,.07)", transition:"background .3s" }}/>)}
            </div>
            <p style={{ fontSize:11.5, color:strengthColor[pwdStrength] }}>Password strength: {strengthLabel[pwdStrength]}</p>
          </div>
        )}
        <Field label="Confirm new password" value={confirmPwd} onChange={setConfirmPwd} type="password" icon={<I.Lock/>} placeholder="Repeat new password"/>
        {confirmPwd&&newPwd!==confirmPwd && <p style={{ fontSize:11.5, color:"#f87171", marginTop:-14, marginBottom:16 }}>Passwords don't match</p>}
        <SaveBtn label="Change password" onClick={savePwd} loading={pwdLoading} disabled={!currentPwd||!newPwd||!confirmPwd}/>
      </Section>
    </>
  );
}

function NotifSection({ toast }) {
  const [settings, setSettings] = useState({
    newMessage:true, exchangeRequest:true, sessionReminder:true, reviewReceived:true,
    swapAccepted:true, weeklySummary:false, newMatch:true, promotions:false,
    emailDigest:true, pushBrowser:false,
  });
  const toggle = k => setSettings(s=>({...s,[k]:!s[k]}));
  const save = () => toast("Notification preferences saved","success");

  const rows = [
    { group:"Exchanges & Messages", items:[
      { key:"newMessage", label:"New messages", desc:"When a swap partner sends you a message" },
      { key:"exchangeRequest", label:"Exchange requests", desc:"When someone wants to swap skills with you" },
      { key:"swapAccepted", label:"Swap accepted", desc:"When your exchange request is confirmed" },
      { key:"sessionReminder", label:"Session reminders", desc:"30 minutes before a scheduled session" },
    ]},
    { group:"Reviews & Matches", items:[
      { key:"reviewReceived", label:"New review", desc:"When a partner leaves you a review" },
      { key:"newMatch", label:"New skill match", desc:"When someone matches your skill interests" },
    ]},
    { group:"Emails & Promotions", items:[
      { key:"weeklySummary", label:"Weekly digest", desc:"A summary of your activity each week" },
      { key:"emailDigest", label:"Email notifications", desc:"Receive notifications via email as well" },
      { key:"promotions", label:"Promotions & tips", desc:"Platform updates, feature announcements" },
    ]},
    { group:"Push Notifications", items:[
      { key:"pushBrowser", label:"Browser push notifications", desc:"Real-time alerts in your browser" },
    ]},
  ];

  return (
    <Section title="Notification Preferences" description="Choose what alerts you receive and how" icon={<I.Bell/>}>
      {rows.map(g=>(
        <div key={g.group} style={{ marginBottom:24 }}>
          <p style={{ fontSize:11, fontWeight:700, color:"#8892a4", letterSpacing:".12em", textTransform:"uppercase", marginBottom:12 }}>{g.group}</p>
          {g.items.map(it=>(
            <div key={it.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
              <div>
                <p style={{ fontSize:13.5, fontWeight:600, color:"#e8edff", marginBottom:2 }}>{it.label}</p>
                <p style={{ fontSize:12, color:"#4a5568" }}>{it.desc}</p>
              </div>
              <Toggle on={settings[it.key]} onChange={()=>toggle(it.key)}/>
            </div>
          ))}
        </div>
      ))}
      <SaveBtn onClick={save}/>
    </Section>
  );
}

function PrivacySection({ toast }) {
  const [priv, setPriv] = useState({
    profilePublic:true, showLocation:true, showOnline:true, allowMessages:"everyone", allowRequests:"everyone", indexProfile:false,
  });
  const toggle = k => setPriv(s=>({...s,[k]:!s[k]}));
  const save = () => toast("Privacy settings saved","success");

  const [sessions] = useState([
    { device:"Chrome on MacBook Pro", location:"Lahore, PK", time:"Active now", current:true },
    { device:"Safari on iPhone 14", location:"Islamabad, PK", time:"2 hours ago", current:false },
    { device:"Firefox on Windows", location:"Karachi, PK", time:"3 days ago", current:false },
  ]);

  return (
    <>
      <Section title="Profile Visibility" description="Control who can see your profile and activity" icon={<I.Shield/>}>
        {[
          { key:"profilePublic", label:"Public profile", desc:"Anyone can view your profile page" },
          { key:"showLocation", label:"Show location", desc:"Display your city on your public profile" },
          { key:"showOnline", label:"Show online status", desc:"Let others see when you're active" },
          { key:"indexProfile", label:"Appear in search results", desc:"Show up when people search for your skills" },
        ].map(it=>(
          <div key={it.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
            <div>
              <p style={{ fontSize:13.5, fontWeight:600, color:"#e8edff", marginBottom:2 }}>{it.label}</p>
              <p style={{ fontSize:12, color:"#4a5568" }}>{it.desc}</p>
            </div>
            <Toggle on={priv[it.key]} onChange={()=>toggle(it.key)}/>
          </div>
        ))}
        <div style={{ marginTop:16 }}>
          {[
            { key:"allowMessages", label:"Who can message you" },
            { key:"allowRequests", label:"Who can send exchange requests" },
          ].map(f=>(
            <div key={f.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <label style={{ fontSize:13.5, fontWeight:600, color:"#e8edff" }}>{f.label}</label>
              <select value={priv[f.key]} onChange={e=>setPriv(s=>({...s,[f.key]:e.target.value}))}
                style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.09)", borderRadius:9, padding:"7px 14px", color:"#c4d0e8", fontSize:12.5, fontFamily:"'DM Sans',sans-serif", cursor:"pointer", outline:"none" }}>
                <option value="everyone">Everyone</option>
                <option value="partners">Swap partners only</option>
                <option value="none">No one</option>
              </select>
            </div>
          ))}
        </div>
        <SaveBtn onClick={save}/>
      </Section>

      <Section title="Active Sessions" description="Devices currently signed in to your account" icon={<I.Devices/>}>
        {sessions.map((s,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 0", borderBottom: i<sessions.length-1?"1px solid rgba(255,255,255,.04)":"none" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:10, background: s.current?"rgba(16,185,129,.1)":"rgba(255,255,255,.04)", border:`1px solid ${s.current?"rgba(16,185,129,.22)":"rgba(255,255,255,.07)"}`, display:"flex", alignItems:"center", justifyContent:"center", color:s.current?"#10b981":"#4a5568" }}>
                <I.Devices/>
              </div>
              <div>
                <div style={{ fontSize:13.5, fontWeight:600, color:"#e8edff", display:"flex", alignItems:"center", gap:8 }}>
                  {s.device}
                  {s.current&&<span style={{ fontSize:10, fontWeight:700, color:"#10b981", background:"rgba(16,185,129,.1)", border:"1px solid rgba(16,185,129,.22)", padding:"2px 8px", borderRadius:50 }}>This device</span>}
                </div>
                <div style={{ fontSize:12, color:"#4a5568" }}>{s.location} · {s.time}</div>
              </div>
            </div>
            {!s.current && <button onClick={()=>toast("Session revoked","success")} style={{ padding:"5px 13px", borderRadius:8, border:"1px solid rgba(239,68,68,.2)", background:"rgba(239,68,68,.06)", color:"#f87171", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Revoke</button>}
          </div>
        ))}
        <button onClick={()=>toast("All other sessions signed out","success")} style={{ marginTop:4, padding:"8px 16px", borderRadius:10, border:"1px solid rgba(239,68,68,.2)", background:"rgba(239,68,68,.06)", color:"#f87171", fontSize:12.5, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:7 }}>
          <I.LogOut/>Sign out all other sessions
        </button>
      </Section>
    </>
  );
}

function PrefsSection({ toast }) {
  const [lang, setLang] = useState("en");
  const [timezone, setTimezone] = useState("Asia/Karachi");
  const [theme, setTheme] = useState("dark");
  const [compact, setCompact] = useState(false);
  const [animations, setAnimations] = useState(true);
  const save = () => toast("Preferences saved","success");

  const accentColors = ["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ec4899","#06b6d4"];
  const [accent, setAccent] = useState("#3b82f6");

  return (
    <>
      <Section title="Language & Region" description="Set your preferred language and timezone" icon={<I.Globe/>}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 24px" }}>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:"block", fontSize:11.5, fontWeight:700, color:"#8892a4", letterSpacing:".1em", textTransform:"uppercase", marginBottom:8 }}>Language</label>
            <select value={lang} onChange={e=>setLang(e.target.value)} style={{ width:"100%", background:"rgba(255,255,255,.04)", border:"1.5px solid rgba(255,255,255,.08)", borderRadius:12, padding:"11px 14px", color:"#e8edff", fontFamily:"'DM Sans',sans-serif", fontSize:13.5, outline:"none", cursor:"pointer" }}>
              <option value="en">English</option>
              <option value="ur">Urdu</option>
              <option value="ar">Arabic</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:"block", fontSize:11.5, fontWeight:700, color:"#8892a4", letterSpacing:".1em", textTransform:"uppercase", marginBottom:8 }}>Timezone</label>
            <select value={timezone} onChange={e=>setTimezone(e.target.value)} style={{ width:"100%", background:"rgba(255,255,255,.04)", border:"1.5px solid rgba(255,255,255,.08)", borderRadius:12, padding:"11px 14px", color:"#e8edff", fontFamily:"'DM Sans',sans-serif", fontSize:13.5, outline:"none", cursor:"pointer" }}>
              <option value="Asia/Karachi">PKT — Karachi (UTC+5)</option>
              <option value="Asia/Dubai">GST — Dubai (UTC+4)</option>
              <option value="Europe/London">GMT — London</option>
              <option value="America/New_York">EST — New York</option>
              <option value="America/Los_Angeles">PST — Los Angeles</option>
            </select>
          </div>
        </div>
        <SaveBtn onClick={save}/>
      </Section>

      <Section title="Appearance" description="Customise the look and feel of your LinkWiz experience" icon={<I.Palette/>}>
        <div style={{ marginBottom:20 }}>
          <p style={{ fontSize:11.5, fontWeight:700, color:"#8892a4", letterSpacing:".1em", textTransform:"uppercase", marginBottom:12 }}>Theme</p>
          <div style={{ display:"flex", gap:10 }}>
            {[["dark","Dark"],["light","Light"],["system","System"]].map(([v,l])=>(
              <button key={v} onClick={()=>setTheme(v)} style={{ flex:1, padding:"10px", borderRadius:11, border:`1px solid ${theme===v?"rgba(59,130,246,.4)":"rgba(255,255,255,.08)"}`, background: theme===v?"rgba(59,130,246,.1)":"rgba(255,255,255,.03)", color:theme===v?"#93c5fd":"#8892a4", fontSize:13, fontWeight:theme===v?700:500, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all .2s" }}>
                {v==="dark"?"🌙":v==="light"?"☀️":"💻"} {l}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom:20 }}>
          <p style={{ fontSize:11.5, fontWeight:700, color:"#8892a4", letterSpacing:".1em", textTransform:"uppercase", marginBottom:12 }}>Accent color</p>
          <div style={{ display:"flex", gap:10 }}>
            {accentColors.map(c=>(
              <div key={c} onClick={()=>setAccent(c)} style={{ width:34, height:34, borderRadius:"50%", background:c, cursor:"pointer", border:`2.5px solid ${accent===c?"#fff":"transparent"}`, display:"flex", alignItems:"center", justifyContent:"center", transition:"border-color .2s" }}>
                {accent===c && <span style={{ color:"#fff", fontSize:13 }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
        {[
          { key:"compact", label:"Compact mode", desc:"Reduce spacing for a denser layout", val:compact, set:setCompact },
          { key:"animations", label:"Animations", desc:"Enable motion effects throughout the app", val:animations, set:setAnimations },
        ].map(it=>(
          <div key={it.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
            <div>
              <p style={{ fontSize:13.5, fontWeight:600, color:"#e8edff", marginBottom:2 }}>{it.label}</p>
              <p style={{ fontSize:12, color:"#4a5568" }}>{it.desc}</p>
            </div>
            <Toggle on={it.val} onChange={it.set}/>
          </div>
        ))}
        <div style={{ marginTop:18 }}><SaveBtn onClick={save}/></div>
      </Section>
    </>
  );
}

function DangerSection({ toast }) {
  const [phrase, setPhrase] = useState("");
  const CONFIRM_PHRASE = "delete my account";
  return (
    <>
      <Section title="Export Data" description="Download a copy of all your LinkWiz data" icon={<I.Download/>}>
        <p style={{ fontSize:13, color:"#8892a4", lineHeight:1.7, marginBottom:16 }}>Export includes your profile, exchange history, messages, reviews, and session notes in a portable JSON archive.</p>
        <button onClick={()=>toast("Your data export will be emailed to you within 24 hours","info")} style={{ padding:"10px 20px", borderRadius:12, border:"1px solid rgba(59,130,246,.3)", background:"rgba(59,130,246,.08)", color:"#93c5fd", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:8 }}>
          <I.Download/>Request data export
        </button>
      </Section>

      <Section title="Danger Zone" description="Irreversible actions — proceed with extreme caution" icon={<I.AlertTri/>} danger>
        <div style={{ padding:"16px 18px", background:"rgba(239,68,68,.05)", border:"1px solid rgba(239,68,68,.12)", borderRadius:12, marginBottom:20 }}>
          <p style={{ fontSize:13, color:"#fca5a5", lineHeight:1.7 }}>Deleting your account is permanent. All your exchanges, reviews, messages, and profile data will be erased and cannot be recovered.</p>
        </div>
        <Field label={`Type "${CONFIRM_PHRASE}" to confirm`} value={phrase} onChange={setPhrase} placeholder="delete my account" icon={<I.AlertTri/>}/>
        <SaveBtn label="Permanently delete account" onClick={()=>{ if(phrase===CONFIRM_PHRASE){ toast("Account deletion requested — check your email","info"); }else{ toast("Please type the exact confirmation phrase","error"); } }} danger disabled={phrase!==CONFIRM_PHRASE}/>
      </Section>
    </>
  );
}

/* ════════════════════
   ROOT
════════════════════ */
const TABS = [
  { id:"profile", label:"Profile", icon:<I.User/> },
  { id:"account", label:"Account & Security", icon:<I.Lock/> },
  { id:"notifications", label:"Notifications", icon:<I.Bell/>, badge:"3" },
  { id:"privacy", label:"Privacy & Sessions", icon:<I.Shield/> },
  { id:"preferences", label:"Preferences", icon:<I.Palette/> },
  { id:"danger", label:"Data & Danger zone", icon:<I.AlertTri/> },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("profile");
  const [toasts, setToasts] = useState([]);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [cursorBig, setCursorBig] = useState(false);
  const [user, setUser] = useState(null);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const data = await userService.getCurrentUser();
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchUser();
}, []);
  const toast = useCallback((msg, type="info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
  }, []);
  const removeToast = useCallback(id => setToasts(t => t.filter(x=>x.id!==id)), []);

  useEffect(() => {
    const fn = e => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const renderSection = () => {
    if(tab==="profile") return <ProfileSection user={user} toast={toast}/>
    if(tab==="account") return <AccountSection user={user} toast={toast} />
    if(tab==="notifications") return <NotifSection toast={toast}/>;
    if(tab==="privacy") return <PrivacySection toast={toast}/>;
    if(tab==="preferences") return <PrefsSection toast={toast}/>;
    if(tab==="danger") return <DangerSection toast={toast}/>;
  };

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"#04060e", color:"#e8edff", minHeight:"100vh", overflowX:"hidden", cursor:"none" }}>
      <style>{G}</style>
      <ParticleCanvas/>

      {/* cursor */}
      <div style={{ position:"fixed", width:34, height:34, border:"1.5px solid rgba(59,130,246,.5)", borderRadius:"50%", pointerEvents:"none", zIndex:9999, left:cursor.x, top:cursor.y, transform:`translate(-50%,-50%) scale(${cursorBig?2.2:1})`, opacity:cursor.x?1:0, transition:"transform .25s cubic-bezier(.16,1,.3,1)" }}/>
      <div style={{ position:"fixed", width:5, height:5, background:"#3b82f6", borderRadius:"50%", pointerEvents:"none", zIndex:9999, left:cursor.x, top:cursor.y, transform:"translate(-50%,-50%)", opacity:cursor.x?1:0 }}/>

      {/* Header */}
      <LinkWizHeader onCursorBig={() => setCursorBig(true)} onCursorSmall={() => setCursorBig(false)} />

      {/* Page */}
      <div style={{ position:"relative", zIndex:1, paddingTop:80 }}>
        <div style={{ maxWidth:1160, margin:"0 auto", padding:"44px 32px 80px" }}>

          {/* Page header */}
          <div style={{ marginBottom:40, animation:"fadeUp .45s ease" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:11, fontWeight:700, color:"#93c5fd", letterSpacing:".14em", textTransform:"uppercase", marginBottom:10, background:"rgba(59,130,246,.08)", border:"1px solid rgba(59,130,246,.15)", padding:"4px 12px", borderRadius:50 }}>
              ⚙ Account Settings
            </div>
            <h1 style={{ fontFamily:"Fraunces, Georgia, serif", fontSize:40, fontWeight:900, color:"#e8edff", letterSpacing:"-.025em", marginBottom:6 }}>Settings</h1>
            <p style={{ fontSize:14.5, color:"#8892a4" }}>Manage your account, security, and preferences</p>
          </div>

          {/* Two-column layout */}
          <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", gap:28, alignItems:"start" }}>
            {/* Sidebar nav */}
            <div style={{ position:"sticky", top:84, background:"rgba(255,255,255,.022)", border:"1px solid rgba(255,255,255,.065)", borderRadius:20, padding:"16px 12px", animation:"fadeUp .45s .06s ease both", opacity:0, animationFillMode:"forwards" }}>
              {/* User mini */}
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 8px 18px", borderBottom:"1px solid rgba(255,255,255,.05)", marginBottom:14 }}>
                <div style={{ position:"relative" }}>
                  
                  <div style={{ position:"absolute", bottom:1, right:1, width:9, height:9, borderRadius:"50%", background:"#10b981", border:"1.5px solid #04060e" }}>
                    <div style={{ position:"absolute", inset:-2, borderRadius:"50%", background:"rgba(16,185,129,.4)", animation:"statusPing 1.8s infinite" }}/>
                  </div>
                </div>
                <div
  style={{
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#3b82f6,#6366f1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 800,
    color: "#fff"
  }}
>
  {user?.fullName
    ?.split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U"}
</div>

<div style={{ minWidth: 0 }}>
  <p
    style={{
      fontSize: 13,
      fontWeight: 700,
      color: "#e8edff",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }}
  >
    {user?.fullName || "Loading..."}
  </p>

  <p
    style={{
      fontSize: 11,
      color: "#4a5568",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }}
  >
    {user?.email || ""}
  </p>
</div>
              </div>
              {TABS.map(t=>(
                <NavItem key={t.id} icon={t.icon} label={t.label} active={tab===t.id} onClick={()=>setTab(t.id)} badge={t.badge}/>
              ))}
              <div style={{ borderTop:"1px solid rgba(255,255,255,.05)", marginTop:12, paddingTop:12 }}>
                <NavItem icon={<I.LogOut/>} label="Sign out" onClick={()=>toast("Signed out","info")}/>
              </div>
            </div>

            {/* Main content */}
            <div key={tab} style={{ animation:"sectionIn .35s ease" }}>
              {renderSection()}
            </div>
          </div>
        </div>
      </div>

      {/* Toasts */}
      <div style={{ position:"fixed", bottom:28, right:28, zIndex:9999, display:"flex", flexDirection:"column", gap:10 }}>
        {toasts.map(t=><Toast key={t.id} msg={t.msg} type={t.type} onDone={()=>removeToast(t.id)}/>)}
      </div>
    </div>
  );
}
