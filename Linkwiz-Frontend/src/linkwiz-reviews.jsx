import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import reviewService from "./services/reviewService";
import LinkWizHeader from "./LinkWizHeader";

const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: rgba(255,255,255,.03); }
  ::-webkit-scrollbar-thumb { background: rgba(59,130,246,.3); border-radius: 2px; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.35} }
  @keyframes statusPing { 0%{transform:scale(1);opacity:1}100%{transform:scale(2.4);opacity:0} }
  @keyframes starPop { 0%{transform:scale(1)}50%{transform:scale(1.4)}100%{transform:scale(1)} }
  @keyframes shimmer { 0%{opacity:.5}50%{opacity:1}100%{opacity:.5} }
  @keyframes slideRight { from{width:0}to{width:var(--w)} }
  @keyframes cardIn { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
  @keyframes checkBounce { 0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)} }
`;

/* ─── ICONS ─── */
const I = {
  Zap: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#zapR)"/><defs><linearGradient id="zapR" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs></svg>,
  Star: ({ size=18, filled=false, half=false, color="#f59e0b" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : half ? "url(#half)" : "none"} stroke={color} strokeWidth="1.5">
      {half && <defs><linearGradient id="half"><stop offset="50%" stopColor={color}/><stop offset="50%" stopColor="transparent"/></linearGradient></defs>}
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Check: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Exchange: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
  Filter: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  MapPin: () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  ThumbUp: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>,
  X: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Send: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  ChevDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Quote: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>,
  Sparkle: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m0 16v1M4.22 4.22l.707.707m12.727 12.727.707.707M3 12h1m16 0h1M4.22 19.78l.707-.707m12.727-12.727.707-.707"/></svg>,
  Award: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
};

/* ─── DATA ─── */
const PARTNERS = [
  { id: "p1", initials: "MA", name: "Maira Ahmed", city: "Islamabad", role: "Python • Data Science", grad: ["#3b82f6","#6366f1"], online: true, skill: "Python Basics" },
  { id: "p2", initials: "TK", name: "Tariq Khan", city: "Karachi", role: "React Developer", grad: ["#06b6d4","#3b82f6"], online: false, skill: "React Fundamentals" },
];

const REVIEWS_DATA = [
  { id: 1, reviewer: { initials: "MA", name: "Maira Ahmed", city: "Islamabad", role: "Python · Data Science", grad: ["#3b82f6","#6366f1"], online: true }, skill: "Digital Marketing", receivedSkill: "Python Basics", rating: 5, date: "May 2, 2025", text: "Ahmed is an exceptional marketing mentor. His explanations of SEO strategies and content funnels were incredibly clear and practical. I implemented his advice immediately and saw measurable results within the first week. Highly recommend him to anyone looking to grow their digital presence.", helpful: 12, tags: ["Clear explanations", "Very patient", "Practical advice"], verified: true },
  { id: 2, reviewer: { initials: "SR", name: "Sana Rafiq", city: "Lahore", role: "UX Designer", grad: ["#8b5cf6","#a78bfa"], online: true }, skill: "SEO Strategy", receivedSkill: "UX Design", rating: 4.5, date: "Apr 18, 2025", text: "The SEO session was comprehensive and well-structured. Ahmed walked me through keyword research, on-page optimisation, and link-building fundamentals. A few sessions ran slightly over time but the content quality was excellent. Would definitely swap skills again!", helpful: 8, tags: ["Well structured", "Knowledgeable", "Punctual"], verified: true },
  { id: 3, reviewer: { initials: "TK", name: "Tariq Khan", city: "Karachi", role: "React Developer", grad: ["#06b6d4","#3b82f6"], online: false }, skill: "Copywriting", receivedSkill: "React Fundamentals", rating: 5, date: "Apr 5, 2025", text: "Ahmed's copywriting sessions transformed how I write documentation and product descriptions. He has an incredible ability to distill complex ideas into compelling narratives. Our exchange was perfectly balanced and professionally managed.", helpful: 15, tags: ["Transformative", "Professional", "Great communicator"], verified: true },
  { id: 4, reviewer: { initials: "FN", name: "Fatima Noor", city: "Rawalpindi", role: "Photographer", grad: ["#10b981","#06b6d4"], online: true }, skill: "Social Media", receivedSkill: "Photography", rating: 4, date: "Mar 22, 2025", text: "Really solid social media coaching. Ahmed has a great eye for content strategy and helped me build a posting calendar that's consistent and engaging. The Instagram growth tips alone were worth the exchange. Looking forward to future sessions!", helpful: 6, tags: ["Strategic thinker", "Creative", "Responsive"], verified: true },
  { id: 5, reviewer: { initials: "ZA", name: "Zara Ali", city: "Faisalabad", role: "Graphic Designer", grad: ["#f59e0b","#ef4444"], online: false }, skill: "Content Strategy", receivedSkill: "Branding", rating: 5, date: "Mar 10, 2025", text: "One of the best skill-swap experiences I've had on LinkWiz. Ahmed came fully prepared with tailored content plans for my specific niche. He listened attentively and adapted his approach when I needed a different angle. Will absolutely recommend.", helpful: 19, tags: ["Tailored advice", "Attentive listener", "Well prepared"], verified: true },
  { id: 6, reviewer: { initials: "HS", name: "Hassan Shah", city: "Peshawar", role: "Flutter Developer", grad: ["#ec4899","#8b5cf6"], online: true }, skill: "Email Marketing", receivedSkill: "Mobile Dev", rating: 4.5, date: "Feb 28, 2025", text: "Great experience overall. Ahmed taught me email marketing fundamentals, automation workflows, and A/B testing strategy in just four sessions. He is approachable, thorough, and genuinely invested in your progress.", helpful: 9, tags: ["Thorough", "Approachable", "Invested"], verified: false },
];

const RATING_DIST = { 5: 4, 4.5: 2, 4: 1, 3: 0, 2: 0, 1: 0 };
const AVG = 4.8;

/* ─── HELPERS ─── */
function Avatar({ initials, grad, size = 40, online }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg,${grad[0]},${grad[1]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * .3, fontWeight: 800, color: "#fff" }}>{initials}</div>
      {online !== undefined && (
        <div style={{ position: "absolute", bottom: 1, right: 1, width: size > 36 ? 10 : 8, height: size > 36 ? 10 : 8, borderRadius: "50%", background: online ? "#10b981" : "#374151", border: "1.5px solid #04060e" }}>
          {online && <div style={{ position: "absolute", inset: -2, borderRadius: "50%", background: "rgba(16,185,129,.4)", animation: "statusPing 1.8s infinite" }} />}
        </div>
      )}
    </div>
  );
}

function StarRow({ rating, size = 18, interactive = false, onRate }) {
  const [hover, setHover] = useState(0);
  const display = interactive ? (hover || rating) : rating;
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s}
          style={{ cursor: interactive ? "pointer" : "default", display: "flex", color: "#f59e0b", transition: "transform .15s", transform: interactive && hover >= s ? "scale(1.2)" : "scale(1)" }}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate?.(s)}
        >
          <I.Star size={size} filled={display >= s} half={display >= s - .5 && display < s} />
        </span>
      ))}
    </div>
  );
}

function RatingBar({ label, count, total, pct }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <span style={{ fontSize: 12, color: "#8892a4", width: 24, textAlign: "right", flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,.06)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: pct > 60 ? "linear-gradient(90deg,#f59e0b,#fcd34d)" : "rgba(245,158,11,.4)", borderRadius: 3, transition: "width .8s ease" }} />
      </div>
      <span style={{ fontSize: 11.5, color: "#4a5568", width: 16, textAlign: "left", flexShrink: 0 }}>{count}</span>
    </div>
  );
}

/* ─── PARTICLE CANVAS ─── */
function ParticleCanvas() {
  const ref = useRef(null);
  const raf = useRef(null);
  const mouse = useRef({ x: -999, y: -999 });
  const pts = useRef([]);
  useEffect(() => {
    const c = ref.current; const ctx = c.getContext("2d");
    let W = c.width = window.innerWidth, H = c.height = window.innerHeight;
    const onR = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    const onM = e => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("resize", onR); window.addEventListener("mousemove", onM);
    pts.current = Array.from({ length: 50 }, () => ({ x: Math.random()*W, y: Math.random()*H, vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3, r: Math.random()*1.2+.3, a: Math.random()*.38+.07, hue: Math.random()>.5?215:260 }));
    const tick = () => {
      ctx.clearRect(0,0,W,H);
      pts.current.forEach((p,i) => {
        const {x:mx,y:my}=mouse.current, d=Math.hypot(mx-p.x,my-p.y);
        if(d<100){p.vx-=(mx-p.x)/d*.05;p.vy-=(my-p.y)/d*.05;}
        p.vx*=.984;p.vy*=.984;p.x+=p.vx;p.y+=p.vy;
        if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`hsla(${p.hue},75%,68%,${p.a})`;ctx.fill();
        pts.current.slice(i+1).forEach(q=>{const dd=Math.hypot(p.x-q.x,p.y-q.y);if(dd<88){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(79,124,255,${.11*(1-dd/88)})`;ctx.lineWidth=.5;ctx.stroke();}});
      });
      raf.current = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize",onR); window.removeEventListener("mousemove",onM); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

/* ─── GIVE REVIEW FORM ─── */
function GiveReviewForm({ onSubmit }) {
  const [partner, setPartner] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [tags, setTags] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const PRESET_TAGS = ["Clear explanations","Patient teacher","Well prepared","Practical advice","Professional","Engaging sessions","Responsive","Great communicator","Knowledgeable","Punctual"];

  const toggleTag = t => setTags(prev => prev.includes(t) ? prev.filter(x=>x!==t) : prev.length < 3 ? [...prev, t] : prev);

  const handleSubmit = () => {
    if (!partner || rating === 0 || feedback.trim().length < 20) return;
    setSubmitted(true);
    onSubmit?.({ partner, rating, feedback, tags });
    setTimeout(() => { setSubmitted(false); setPartner(null); setRating(0); setFeedback(""); setTags([]); }, 3500);
  };

  const canSubmit = partner && rating > 0 && feedback.trim().length >= 20;

  if (submitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 40px", textAlign: "center", animation: "fadeUp .4s ease" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16,185,129,.15)", border: "1px solid rgba(16,185,129,.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", fontSize: 28, marginBottom: 20, animation: "checkBounce .5s ease" }}>✓</div>
        <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 22, fontWeight: 900, color: "#e8edff", marginBottom: 8 }}>Review Submitted!</div>
        <div style={{ fontSize: 13.5, color: "#8892a4" }}>Thank you for your feedback. It helps build trust in our community.</div>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeUp .5s ease" }}>
      {/* Partner select */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#8892a4", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 12 }}>Who are you reviewing?</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {PARTNERS.map(p => (
            <div key={p.id} onClick={() => setPartner(p)} style={{ padding: "14px 16px", borderRadius: 14, border: `1px solid ${partner?.id === p.id ? "rgba(59,130,246,.4)" : "rgba(255,255,255,.07)"}`, background: partner?.id === p.id ? "rgba(59,130,246,.08)" : "rgba(255,255,255,.02)", cursor: "pointer", transition: "all .22s", display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar initials={p.initials} grad={p.grad} size={40} online={p.online} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#e8edff" }}>{p.name}</div>
                <div style={{ fontSize: 11.5, color: "#8892a4", display: "flex", alignItems: "center", gap: 3 }}><I.MapPin />{p.city}</div>
                <div style={{ fontSize: 11, color: "#93c5fd", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}><I.Exchange />{p.skill}</div>
              </div>
              {partner?.id === p.id && <div style={{ marginLeft: "auto", color: "#10b981", animation: "checkBounce .3s ease" }}><I.Check /></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Star rating */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#8892a4", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 12 }}>Overall Rating</label>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 14 }}>
          <StarRow rating={rating} size={28} interactive onRate={setRating} />
          <span style={{ fontSize: 14, color: rating > 0 ? "#fcd34d" : "#4a5568", fontWeight: 600 }}>
            {rating === 0 ? "Tap to rate" : rating === 5 ? "Outstanding!" : rating === 4 ? "Very good" : rating === 3 ? "Average" : rating === 2 ? "Below average" : "Poor"}
          </span>
        </div>
      </div>

      {/* Feedback textarea */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#8892a4", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 12 }}>Your Feedback <span style={{ color: "#4a5568", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>(min. 20 chars)</span></label>
        <textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="Describe your experience — what went well, what you learned, how the sessions were structured…"
          rows={5}
          style={{ width: "100%", background: "rgba(255,255,255,.03)", border: "1.5px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "14px 16px", color: "#e8edff", fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, resize: "vertical", outline: "none", lineHeight: 1.7, cursor: "text", transition: "border-color .2s" }}
          onFocus={e => e.target.style.borderColor = "rgba(59,130,246,.4)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.08)"}
        />
        <div style={{ textAlign: "right", fontSize: 11, color: feedback.length >= 20 ? "#10b981" : "#4a5568", marginTop: 6 }}>{feedback.length} / 20 min</div>
      </div>

      {/* Tag chips */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#8892a4", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 12 }}>Highlight qualities <span style={{ color: "#4a5568", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>(up to 3)</span></label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PRESET_TAGS.map(t => {
            const sel = tags.includes(t);
            return (
              <button key={t} onClick={() => toggleTag(t)} style={{ padding: "6px 14px", borderRadius: 50, border: `1px solid ${sel ? "rgba(59,130,246,.4)" : "rgba(255,255,255,.08)"}`, background: sel ? "rgba(59,130,246,.12)" : "rgba(255,255,255,.02)", color: sel ? "#93c5fd" : "#8892a4", fontSize: 12, fontWeight: sel ? 600 : 400, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all .2s", display: "flex", alignItems: "center", gap: 5 }}>
                {sel && <span style={{ color: "#93c5fd" }}><I.Check /></span>}{t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        onMouseEnter={() => setHoverSubmit(true)}
        onMouseLeave={() => setHoverSubmit(false)}
        style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: canSubmit ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "rgba(255,255,255,.05)", color: canSubmit ? "#fff" : "#4a5568", fontSize: 14.5, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: canSubmit ? "pointer" : "not-allowed", transition: "all .25s", boxShadow: canSubmit && hoverSubmit ? "0 16px 40px rgba(59,130,246,.4)" : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <I.Send /> Submit Review
      </button>
    </div>
  );
}

/* ─── REVIEW CARD ─── */
function ReviewCard({ review, idx, newReview = false }) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted, setVoted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const long = review.text.length > 200;
  const displayText = !expanded && long ? review.text.slice(0, 200) + "…" : review.text;

  return (
    <div style={{ background: newReview ? "rgba(59,130,246,.04)" : "rgba(255,255,255,.022)", border: `1px solid ${newReview ? "rgba(59,130,246,.25)" : "rgba(255,255,255,.06)"}`, borderRadius: 20, padding: "26px 28px", animation: `cardIn .4s ${idx * .06}s ease both`, opacity: 0, animationFillMode: "forwards", transition: "border-color .3s" }}>
      {newReview && <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10.5, fontWeight: 700, color: "#93c5fd", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14, background: "rgba(59,130,246,.1)", border: "1px solid rgba(59,130,246,.2)", padding: "3px 10px", borderRadius: 50 }}><I.Sparkle /> Just added</div>}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16, gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar initials={review.reviewer.initials} grad={review.reviewer.grad} size={46} online={review.reviewer.online} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
              <span style={{ fontSize: 15.5, fontWeight: 700, color: "#e8edff" }}>{review.reviewer.name}</span>
              {review.verified && (
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,.1)", border: "1px solid rgba(16,185,129,.22)", padding: "2px 8px", borderRadius: 50 }}>
                  <I.Check /> Verified
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, color: "#8892a4", display: "flex", alignItems: "center", gap: 5 }}>
              <I.MapPin />{review.reviewer.city} · {review.reviewer.role}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <StarRow rating={review.rating} size={14} />
          <div style={{ fontSize: 11.5, color: "#4a5568", marginTop: 4 }}>{review.date}</div>
        </div>
      </div>

      {/* Skill exchange badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, fontSize: 12 }}>
        <span style={{ background: "rgba(147,197,253,.08)", border: "1px solid rgba(147,197,253,.18)", color: "#93c5fd", padding: "3px 10px", borderRadius: 50, fontWeight: 600 }}>{review.skill}</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
        <span style={{ background: "rgba(110,231,183,.07)", border: "1px solid rgba(110,231,183,.18)", color: "#6ee7b7", padding: "3px 10px", borderRadius: 50, fontWeight: 600 }}>{review.receivedSkill}</span>
      </div>

      {/* Quote */}
      <div style={{ position: "relative", paddingLeft: 22, marginBottom: 16 }}>
        <div style={{ position: "absolute", left: 0, top: 2, color: "rgba(59,130,246,.3)" }}><I.Quote /></div>
        <p style={{ fontSize: 13.5, color: "#c4d0e8", lineHeight: 1.8, fontStyle: "italic" }}>{displayText}</p>
        {long && (
          <button onClick={() => setExpanded(!expanded)} style={{ background: "none", border: "none", color: "#93c5fd", fontSize: 12.5, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 4, padding: 0 }}>
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Tags */}
      {review.tags?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {review.tags.map(t => (
            <span key={t} style={{ fontSize: 11.5, color: "#8892a4", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", padding: "3px 10px", borderRadius: 50 }}>{t}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,.05)" }}>
        <span style={{ fontSize: 12, color: "#4a5568" }}>Was this helpful?</span>
        <button onClick={() => { if (!voted) { setHelpful(h => h + 1); setVoted(true); } }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 9, border: `1px solid ${voted ? "rgba(16,185,129,.3)" : "rgba(255,255,255,.08)"}`, background: voted ? "rgba(16,185,129,.08)" : "transparent", color: voted ? "#6ee7b7" : "#8892a4", fontSize: 12.5, fontWeight: 600, cursor: voted ? "default" : "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all .22s" }}>
          <I.ThumbUp /> {helpful}
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN APP ─── */
export default function LinkWizReviews() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("list");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [newReviews, setNewReviews] = useState([]);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [cursorBig, setCursorBig] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onM = e => setCursor({ x: e.clientX, y: e.clientY });
    const onS = () => setNavScrolled(window.scrollY > 44);
    window.addEventListener("mousemove", onM);
    window.addEventListener("scroll", onS, { passive: true });
    return () => { window.removeEventListener("mousemove", onM); window.removeEventListener("scroll", onS); };
  }, []);

  const big = useCallback(() => setCursorBig(true), []);
  const small = useCallback(() => setCursorBig(false), []);

  const handleNewReview = ({ partner, rating, feedback, tags }) => {
    const nr = {
      id: Date.now(), reviewer: { initials: "AR", name: "Ahmed Raza (You)", city: "Lahore", role: "Marketing Executive", grad: ["#8b5cf6","#a78bfa"], online: true }, skill: "Digital Marketing", receivedSkill: partner.skill, rating, date: "Just now", text: feedback, helpful: 0, tags, verified: true, isNew: true,
    };
    setNewReviews(prev => [nr, ...prev]);
    setTimeout(() => setTab("list"), 200);
  };

  const allReviews = [...newReviews.map(r => ({ ...r, isNew: true })), ...REVIEWS_DATA];
  const filtered = filter === "all" ? allReviews : allReviews.filter(r => Math.floor(r.rating) === parseInt(filter));
  const sorted = [...filtered].sort((a, b) => sort === "highest" ? b.rating - a.rating : sort === "lowest" ? a.rating - b.rating : sort === "helpful" ? b.helpful - a.helpful : 0);

  const totalReviews = allReviews.length;
  const avgRating = (allReviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#04060e", color: "#e8edff", minHeight: "100vh", overflowX: "hidden", cursor: "none" }}>
      <style>{globalStyle}</style>
      <ParticleCanvas />

      {/* Custom cursor */}
      <div style={{ position: "fixed", width: 34, height: 34, border: "1.5px solid rgba(59,130,246,.5)", borderRadius: "50%", pointerEvents: "none", zIndex: 9999, left: cursor.x, top: cursor.y, transform: `translate(-50%,-50%) scale(${cursorBig ? 2.2 : 1})`, opacity: cursor.x ? 1 : 0, transition: "transform .25s cubic-bezier(.16,1,.3,1)" }} />
      <div style={{ position: "fixed", width: 5, height: 5, background: "#3b82f6", borderRadius: "50%", pointerEvents: "none", zIndex: 9999, left: cursor.x, top: cursor.y, transform: "translate(-50%,-50%)", opacity: cursor.x ? 1 : 0 }} />

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: navScrolled ? "rgba(4,6,14,.9)" : "rgba(4,6,14,.7)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,.05)", transition: "background .4s" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/dashboard")} onMouseEnter={big} onMouseLeave={small}>
            <div style={{ width: 32, height: 32, background: "rgba(59,130,246,.12)", border: "1px solid rgba(59,130,246,.22)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}><I.Zap /></div>
            <span style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 19, fontWeight: 900, color: "#e8edff", letterSpacing: "-.02em" }}>LinkWiz</span>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {[{ id: "list", label: "Reviews" }, { id: "give", label: "Write a Review" }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} onMouseEnter={big} onMouseLeave={small}
                style={{ padding: "8px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all .22s", background: tab === t.id ? "rgba(59,130,246,.18)" : "transparent", color: tab === t.id ? "#93c5fd" : "#8892a4" }}>
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: "#8892a4" }}>Ahmed Raza</span>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff" }}>AR</div>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <div style={{ position: "relative", zIndex: 1, paddingTop: 80 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 80px" }}>

          {/* ── HEADER ── */}
          <div style={{ marginBottom: 40, animation: "fadeUp .5s ease" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "#93c5fd", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 10, background: "rgba(59,130,246,.08)", border: "1px solid rgba(59,130,246,.15)", padding: "4px 12px", borderRadius: 50 }}>
              <I.Award /> Community Reviews
            </div>
            <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 42, fontWeight: 900, color: "#e8edff", letterSpacing: "-.025em", marginBottom: 6 }}>
              {tab === "list" ? "What people say about Ahmed" : "Leave a Review"}
            </h1>
            <p style={{ fontSize: 14.5, color: "#8892a4" }}>
              {tab === "list" ? "Honest feedback from real skill-swap partners on the LinkWiz platform." : "Share your experience with a skill-swap partner to help build trust."}
            </p>
          </div>

          {tab === "list" ? (
            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 28, alignItems: "start" }}>
              {/* ── SIDEBAR ── */}
              <div style={{ position: "sticky", top: 80 }}>
                {/* Rating summary card */}
                <div style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 20, padding: "28px 24px", marginBottom: 18, textAlign: "center", animation: "fadeUp .5s .06s ease both", opacity: 0, animationFillMode: "forwards" }}>
                  <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 56, fontWeight: 900, color: "#e8edff", lineHeight: 1, marginBottom: 8 }}>{avgRating}</div>
                  <StarRow rating={parseFloat(avgRating)} size={20} />
                  <div style={{ fontSize: 12.5, color: "#8892a4", marginTop: 8, marginBottom: 22 }}>{totalReviews} reviews</div>
                  <div>
                    {[5,4,3,2,1].map(s => {
                      const cnt = allReviews.filter(r => Math.floor(r.rating) === s).length;
                      return <RatingBar key={s} label={s} count={cnt} total={totalReviews} pct={totalReviews ? (cnt / totalReviews) * 100 : 0} />;
                    })}
                  </div>
                </div>

                {/* Profile mini card */}
                <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 18, padding: "20px", animation: "fadeUp .5s .12s ease both", opacity: 0, animationFillMode: "forwards" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <Avatar initials="AR" grad={["#3b82f6","#6366f1"]} size={44} online={true} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#e8edff" }}>Ahmed Raza</div>
                      <div style={{ fontSize: 11.5, color: "#8892a4", display: "flex", alignItems: "center", gap: 3 }}><I.MapPin /> Lahore, Pakistan</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[["4.8", "Avg Rating"], ["16", "Sessions"], ["7", "Reviews"], ["4", "Swaps"]].map(([v, l]) => (
                      <div key={l} style={{ background: "rgba(255,255,255,.03)", borderRadius: 10, padding: "10px 12px" }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#e8edff", fontFamily: "Fraunces, Georgia, serif" }}>{v}</div>
                        <div style={{ fontSize: 11, color: "#4a5568" }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── REVIEWS LIST ── */}
              <div>
                {/* Filter & sort bar */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 10, animation: "fadeUp .5s .1s ease both", opacity: 0, animationFillMode: "forwards" }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["all","5","4","3"].map(f => (
                      <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 10, border: `1px solid ${filter===f?"rgba(59,130,246,.35)":"rgba(255,255,255,.07)"}`, background: filter===f?"rgba(59,130,246,.12)":"transparent", color: filter===f?"#93c5fd":"#8892a4", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all .2s", display: "flex", alignItems: "center", gap: 4 }}>
                        {f === "all" ? "All" : <><I.Star size={11} filled color="#f59e0b" />{f}★</>}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <I.Filter />
                    <select value={sort} onChange={e => setSort(e.target.value)} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 9, padding: "6px 12px", color: "#c4d0e8", fontSize: 12, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", outline: "none" }}>
                      <option value="recent">Most Recent</option>
                      <option value="highest">Highest Rated</option>
                      <option value="lowest">Lowest Rated</option>
                      <option value="helpful">Most Helpful</option>
                    </select>
                  </div>
                </div>

                {sorted.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "#4a5568", fontSize: 14 }}>No reviews match this filter.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {sorted.map((r, i) => <ReviewCard key={r.id} review={r} idx={i} newReview={r.isNew} />)}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ── GIVE REVIEW ── */
            <div style={{ maxWidth: 680, margin: "0 auto" }}>
              <div style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 24, padding: "40px 44px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#3b82f6,#6366f1,#8b5cf6)" }} />
                <GiveReviewForm onSubmit={handleNewReview} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
