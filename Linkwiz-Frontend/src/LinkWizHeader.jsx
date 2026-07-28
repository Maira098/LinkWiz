import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import messageService from "./services/messageService";
import exchangeService from "./services/exchangeService";

/* ─────────────── HEADER ICONS ─────────────── */
const Icons = {
  Zap: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#zapHeader)" />
      <defs>
        <linearGradient id="zapHeader" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Settings: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  LogOut: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Message: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

const DEFAULT_NOTIFICATIONS = [
  { id: 1, message: "Sana R. accepted your exchange request", time: "1h ago", read: false, type: "accepted", path: "/exchange-messaging" },
  { id: 2, message: "New request from Tariq K. — Arabic ↔ Copywriting", time: "3h ago", read: false, type: "incoming", path: "/incoming" },
  { id: 3, message: "Session reminder: Sana R. tomorrow at 4 PM", time: "5h ago", read: true, type: "reminder", path: "/dashboard" },
  { id: 4, message: "Exchange with Ali S. marked complete", time: "2d ago", read: true, type: "system", path: "/dashboard" }
];

export default function LinkWizHeader({ onCursorBig, onCursorSmall }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [navScrolled, setNavScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Monitor scroll for nav styling
  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch logged in user and notifications
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Safe default
      }
    }

    const storedNotifs = localStorage.getItem("notifications");
    if (storedNotifs) {
      try {
        setNotifications(JSON.parse(storedNotifs));
      } catch (e) {
        setNotifications(DEFAULT_NOTIFICATIONS);
      }
    } else {
      localStorage.setItem("notifications", JSON.stringify(DEFAULT_NOTIFICATIONS));
      setNotifications(DEFAULT_NOTIFICATIONS);
    }
  }, [location.pathname]);

  // Click outside handlers to close menus
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const handleNotificationClick = (n) => {
    const updated = notifications.map(item => item.id === n.id ? { ...item, read: true } : item);
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
    setShowNotifications(false);
    navigate(n.path || "/dashboard");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMouseEnter = () => onCursorBig?.();
  const handleMouseLeave = () => onCursorSmall?.();

  // Navigation Links
  const loggedInLinks = [
    { label: "Browse", path: "/browse-users" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Incoming", path: "/incoming" },
    { label: "Outgoing", path: "/outgoing" },
    { label: "Messages", path: "/exchange-messaging" }
  ];

  const loggedOutLinks = [
    { label: "Features", path: "/#features" },
    { label: "How It Works", path: "/#how-it-works" },
    { label: "Community", path: "/#community" }
  ];

  const activeLinks = user ? loggedInLinks : loggedOutLinks;

  const headerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: navScrolled ? "rgba(4, 6, 14, 0.92)" : "rgba(4, 6, 14, 0.7)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(20px)",
    transition: "all 0.4s",
  };

  const navInStyle = {
    maxWidth: 1240,
    margin: "0 auto",
    padding: "16px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const logoStyle = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "none",
    textDecoration: "none"
  };

  const logoBoxStyle = {
    width: 34,
    height: 34,
    background: "rgba(59, 130, 246, 0.12)",
    border: "1px solid rgba(59, 130, 246, 0.22)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const logoTextStyle = {
    fontFamily: "Fraunces, Georgia, serif",
    fontSize: 21,
    fontWeight: 900,
    color: "#e8edff",
    letterSpacing: "-.02em"
  };

  const navLinksStyle = {
    display: "flex",
    gap: 32,
    alignItems: "center"
  };

  const linkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      color: isActive ? "#93c5fd" : "#8892a4",
      textDecoration: "none",
      fontSize: 14,
      fontWeight: 500,
      cursor: "none",
      transition: "color .2s",
      position: "relative",
      paddingBottom: 4
    };
  };

  return (
    <nav style={headerStyle}>
      <div style={navInStyle}>

        {/* Logo */}
        <a href="#" onClick={(e) => { e.preventDefault(); navigate(user ? "/dashboard" : "/"); }}
          style={logoStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div style={logoBoxStyle}>
            <Icons.Zap />
          </div>
          <span style={logoTextStyle}>LinkWiz</span>
        </a>

        {/* Navigation Links */}
        <div style={navLinksStyle}>
          {activeLinks.map(l => (
            <a key={l.label} href="#" onClick={(e) => {
              e.preventDefault();
              if (l.path.startsWith("/#")) {
                navigate("/");
                setTimeout(() => {
                  const el = document.getElementById(l.path.slice(2));
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              } else {
                navigate(l.path);
              }
            }}
              style={linkStyle(l.path)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
              {l.label}
              {location.pathname === l.path && (
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1.5, background: "#3b82f6", borderRadius: 4 }} />
              )}
            </a>
          ))}
        </div>

        {/* Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {user ? (
            <>
              {/* Notifications Panel Trigger */}
              <div ref={notifRef} style={{ position: "relative" }}>
                <button onClick={() => setShowNotifications(!showNotifications)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: showNotifications ? "#93c5fd" : "#8892a4",
                    cursor: "none",
                    position: "relative",
                    padding: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    transition: "color 0.2s"
                  }}>
                  <Icons.Bell />
                  {unreadCount > 0 && (
                    <div style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 8,
                      height: 8,
                      background: "#ef4444",
                      borderRadius: "50%",
                      boxShadow: "0 0 8px #ef4444"
                    }} />
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 12px)",
                    width: 320,
                    background: "rgba(10, 14, 28, 0.94)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 18,
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
                    backdropFilter: "blur(24px)",
                    overflow: "hidden",
                    animation: "fadeSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#e8edff" }}>Notifications</span>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllRead}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          style={{ background: "none", border: "none", color: "#60a5fa", fontSize: 11.5, fontWeight: 600, cursor: "none", padding: 0 }}>
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div style={{ maxHeight: 280, overflowY: "auto" }}>
                      {notifications.length > 0 ? (
                        notifications.map(n => (
                          <div key={n.id} onClick={() => handleNotificationClick(n)}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            style={{
                              display: "flex",
                              gap: 12,
                              padding: "14px 20px",
                              borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
                              cursor: "none",
                              background: n.read ? "transparent" : "rgba(59, 130, 246, 0.04)",
                              transition: "background 0.2s"
                            }}>
                            <div style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background: n.type === "accepted" ? "rgba(16, 185, 129, 0.1)" : "rgba(59, 130, 246, 0.1)",
                              border: `1px solid ${n.type === "accepted" ? "rgba(16, 185, 129, 0.2)" : "rgba(59, 130, 246, 0.2)"}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: n.type === "accepted" ? "#10b981" : "#3b82f6",
                              flexShrink: 0
                            }}>
                              {n.type === "accepted" ? <Icons.Check /> : <Icons.Message />}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ margin: 0, fontSize: 12.5, color: n.read ? "#8892a4" : "#e8edff", lineHeight: 1.45, fontWeight: n.read ? 400 : 500 }}>
                                {n.message}
                              </p>
                              <span style={{ fontSize: 10.5, color: "#4a5568", marginTop: 4, display: "inline-block" }}>{n.time}</span>
                            </div>
                            {!n.read && (
                              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", marginTop: 6, flexShrink: 0 }} />
                            )}
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: "40px 20px", textAlign: "center", color: "#4a5568", fontSize: 13 }}>
                          No notifications
                        </div>
                      )}
                    </div>

                    <div style={{ padding: 12, borderTop: "1px solid rgba(255, 255, 255, 0.04)", display: "flex", justifyContent: "center" }}>
                      <button onClick={() => setShowNotifications(false)}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        style={{
                          width: "100%",
                          background: "rgba(255, 255, 255, 0.04)",
                          border: "1.5px solid rgba(255, 255, 255, 0.08)",
                          color: "#8892a4",
                          borderRadius: 10,
                          padding: "8px 0",
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: "none",
                          transition: "all 0.2s"
                        }}>
                        Close Panel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown Menu */}
              <div ref={userRef} style={{ position: "relative" }}>
                <button onClick={() => setShowUserMenu(!showUserMenu)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    background: "transparent",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "none",
                    padding: 4
                  }}>
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${user.grad ? user.grad[0] : "#3b82f6"}, ${user.grad ? user.grad[1] : "#6366f1"})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: "#fff",
                    border: "1.5px solid rgba(255, 255, 255, 0.15)"
                  }}>
                    {user.initials || "U"}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#e8edff" }}>{user.name}</span>
                </button>

                {showUserMenu && (
                  <div style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 12px)",
                    width: 190,
                    background: "rgba(10, 14, 28, 0.94)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 16,
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
                    backdropFilter: "blur(24px)",
                    padding: 6,
                    animation: "fadeSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}>
                    {[
                      { label: "My Profile", icon: <Icons.User />, onClick: () => navigate("/profile") },
                      { label: "Settings", icon: <Icons.Settings />, onClick: () => navigate("/settings") },
                    ].map((item, idx) => (
                      <button key={idx} onClick={() => { item.onClick(); setShowUserMenu(false); }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        style={{
                          width: "100%",
                          background: "none",
                          border: "none",
                          color: "#8892a4",
                          padding: "9px 12px",
                          borderRadius: 10,
                          fontSize: 13,
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          cursor: "none",
                          transition: "all 0.2s"
                        }}>
                        {item.icon} {item.label}
                      </button>
                    ))}
                    <div style={{ height: 1, background: "rgba(255, 255, 255, 0.06)", margin: "4px 8px" }} />
                    <button onClick={handleLogout}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        width: "100%",
                        background: "none",
                        border: "none",
                        color: "#f87171",
                        padding: "9px 12px",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        cursor: "none",
                        transition: "all 0.2s"
                      }}>
                      <Icons.LogOut /> Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  background: "transparent",
                  color: "#8892a4",
                  border: "1.5px solid rgba(255,255,255,.09)",
                  padding: "9px 18px",
                  borderRadius: 12,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13.5,
                  fontWeight: 500,
                  cursor: "none",
                  transition: "all 0.2s"
                }}>
                Log In
              </button>
              <button onClick={() => navigate("/register")}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: 12,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: "none",
                  boxShadow: "0 8px 24px rgba(59,130,246,0.3)"
                }}>
                Get Started
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
