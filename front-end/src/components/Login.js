import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../context/userContext";
import { getApiUrl } from "../util/api";
import ThemeToggle from "./common/ThemeToggle";

/* ── Inline SVG Icons ── */
const IconEmail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

function Login() {
  const { userIdRef, setUserId } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isSignupRoute = location.pathname === "/signup";
  const [activeMode, setActiveMode] = useState(isSignupRoute ? "signup" : "login");
  const [loginData, setLoginData]   = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading]       = useState(false);
  // Prevents transitions from firing on initial mount (avoids the sudden flash)
  const [transitionReady, setTransitionReady] = useState(false);

  /* Enable transitions only after first paint — double rAF ensures DOM is settled */
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitionReady(true);
      });
    });
  }, []);

  /* Sync mode with URL */
  useEffect(() => {
    setActiveMode(isSignupRoute ? "signup" : "login");
  }, [isSignupRoute]);

  /* Restore session */
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedUserData = localStorage.getItem("userData");
    if (storedAuth === "true" && storedUserData) {
      const user = JSON.parse(storedUserData);
      const name = user?.user?.fullName || user?.fullName;
      if (name) userIdRef.current = `Welcome ${name}`;
    }
  }, [userIdRef]);

  const switchTo = (mode) => {
    // Only update state — no navigate() to avoid full-page route animation
    setActiveMode(mode);
  };

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "login") setLoginData(prev => ({ ...prev, [name]: value }));
    else setSignupData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(getApiUrl("/api/auth/login"), loginData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Welcome back! 🎉");
      const userId = response?.data?.user?.fullName || response?.data?.Name;
      userIdRef.current = userId;
      setUserId(userId);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userData", JSON.stringify(response.data));
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!signupData.fullName || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match! 🔑");
      return;
    }
    if (signupData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(getApiUrl("/api/auth/register"), signupData);
      toast.success("Account created! Please log in. 🚀");
      switchTo("login");
    } catch (err) {
      toast.error(
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isSignup = activeMode === "signup";

  return (
    <div className="background1">
      {/* Floating theme toggle */}
      <div style={{ position: "fixed", top: "1rem", right: "1.2rem", zIndex: 200 }}>
        <ThemeToggle />
      </div>
      <ToastContainer theme="dark" position="top-right" />

      <div className="container">
        {/* Top tab switcher — mobile only */}
        <div className="mobile-tabs">
          <button className={`mobile-tab ${!isSignup ? "active" : ""}`} onClick={() => switchTo("login")}>
            Log In
          </button>
          <button className={`mobile-tab ${isSignup ? "active" : ""}`} onClick={() => switchTo("signup")}>
            Sign Up
          </button>
        </div>

        <div className={`auth-card ${isSignup ? "signup-mode" : ""} ${transitionReady ? "transition-ready" : ""}`}>

          {/* ── LEFT HALF — Login Form ────────────── */}
          <div className="auth-form-left">
            <div className={`auth-form-inner ${!isSignup ? "active" : ""}`}>
              <h2>Welcome back</h2>
              <p className="auth-subtitle">Sign in to continue your journey</p>

              <div className="inputbox">
                <div className="input-group">
                  <label>Email</label>
                  <span className="input-icon"><IconEmail /></span>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={loginData.email}
                    autoComplete="email"
                    onChange={(e) => handleInputChange(e, "login")}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <span className="input-icon"><IconLock /></span>
                  <input
                    id="login-password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    autoComplete="current-password"
                    onChange={(e) => handleInputChange(e, "login")}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>
              </div>

              <div className="auth-forgot">
                <span>{t("forgetpass")}</span>
              </div>

              <button
                id="login-submit"
                className="auth-submit-btn"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Signing in…" : <>{t("logg")} <IconArrow /></>}
              </button>
            </div>
          </div>

          {/* ── RIGHT HALF — Signup Form ──────────── */}
          <div className="auth-form-right">
            <div className={`auth-form-inner ${isSignup ? "active" : ""}`}>
              <h2>Join TripUnite</h2>
              <p className="auth-subtitle">Create an account &amp; start exploring</p>

              <div className="inputbox">
                <div className="input-group">
                  <label>Full Name</label>
                  <span className="input-icon"><IconUser /></span>
                  <input
                    id="signup-name"
                    type="text"
                    name="fullName"
                    placeholder="Your full name"
                    value={signupData.fullName}
                    autoComplete="name"
                    onChange={(e) => handleInputChange(e, "signup")}
                  />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <span className="input-icon"><IconEmail /></span>
                  <input
                    id="signup-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={signupData.email}
                    autoComplete="email"
                    onChange={(e) => handleInputChange(e, "signup")}
                  />
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <span className="input-icon"><IconLock /></span>
                  <input
                    id="signup-password"
                    type="password"
                    name="password"
                    placeholder="Min. 8 characters"
                    value={signupData.password}
                    autoComplete="new-password"
                    onChange={(e) => handleInputChange(e, "signup")}
                  />
                </div>
                <div className="input-group">
                  <label
                    style={{
                      color: signupData.confirmPassword
                        ? signupData.password === signupData.confirmPassword
                          ? "#4ade80"
                          : "#f87171"
                        : undefined,
                    }}
                  >
                    Confirm Password
                    {signupData.confirmPassword && (
                      <span style={{ marginLeft: "0.4rem" }}>
                        {signupData.password === signupData.confirmPassword ? "✓" : "✗"}
                      </span>
                    )}
                  </label>
                  <span className="input-icon"><IconLock /></span>
                  <input
                    id="signup-confirm-password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={signupData.confirmPassword}
                    autoComplete="new-password"
                    style={{
                      borderColor: signupData.confirmPassword
                        ? signupData.password === signupData.confirmPassword
                          ? "rgba(74, 222, 128, 0.5)"
                          : "rgba(248, 113, 113, 0.5)"
                        : undefined,
                    }}
                    onChange={(e) => handleInputChange(e, "signup")}
                    onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  />
                </div>
              </div>

              <button
                id="signup-submit"
                className="auth-submit-btn"
                onClick={handleSignup}
                disabled={loading}
              >
                {loading ? "Creating account…" : <>Create Account <IconArrow /></>}
              </button>
            </div>
          </div>

          {/* ── SLIDING OVERLAY PANEL ─────────────── */}
          {/*  Login mode  → overlay on RIGHT, shows "Sign Up" CTA  */}
          {/*  Signup mode → overlay slides to LEFT, shows "Sign In" CTA  */}
          <div className="auth-overlay-panel">

            {/* Shown while overlay is on the RIGHT (Login mode) */}
            <div className="overlay-msg overlay-login-msg">
              <div className="overlay-logo">Trip<span>Unite</span></div>
              <div className="overlay-tagline">New here?<br />Join us today.</div>
              <div className="overlay-sub">
                Sign up and start planning your next adventure with real travel companions.
              </div>
              <button className="overlay-switch-btn" onClick={() => switchTo("signup")}>
                Sign Up →
              </button>
              <div className="overlay-dots">
                <span /><span /><span />
              </div>
            </div>

            {/* Shown while overlay is on the LEFT (Signup mode) */}
            <div className="overlay-msg overlay-signup-msg">
              <div className="overlay-logo">Trip<span>Unite</span></div>
              <div className="overlay-tagline">Welcome<br />back, Explorer.</div>
              <div className="overlay-sub">
                Already have an account? Sign in and continue where you left off.
              </div>
              <button className="overlay-switch-btn" onClick={() => switchTo("login")}>
                Sign In →
              </button>
              <div className="overlay-dots">
                <span /><span /><span />
              </div>
            </div>

          </div>
          {/* ── end overlay ── */}

        </div>
      </div>
    </div>
  );
}

export default Login;
