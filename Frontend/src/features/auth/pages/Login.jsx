
import React, { useState } from "react";
import { Link, Navigate } from "react-router";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const { handleLogin } = useAuth();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    await handleLogin({
      email: formData.email.trim(),
      password: formData.password,
    });
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <main className="teal-login">
      <style>{`
        .teal-login {
          min-height: 100vh;
          min-height: 100dvh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          isolation: isolate;
          padding: 82px 16px 24px;
          background: #061b3d;
          color: #fff;
          font-family: Inter, Arial, sans-serif;
        }

        .teal-login * {
          box-sizing: border-box;
        }

        .tl-glow {
          position: absolute;
          z-index: -3;
          inset: 0;
          background:
            radial-gradient(ellipse at 10% 0%, #20c9b655, transparent 42%),
            radial-gradient(ellipse at 100% 80%, #0caeaa40, transparent 40%),
            linear-gradient(145deg, #063c60, #071b3e 60%, #042d48);
        }

        .tl-grid {
          position: absolute;
          z-index: -2;
          inset: 0;
          opacity: .12;
          pointer-events: none;
          background-image:
            linear-gradient(#ffffff12 1px, transparent 1px),
            linear-gradient(90deg, #ffffff12 1px, transparent 1px);
          background-size: 42px 42px;
        }

        .tl-orb {
          position: absolute;
          z-index: -1;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          filter: blur(90px);
          background: #20d7b8;
          opacity: .16;
          pointer-events: none;
          animation: tlFloat 12s ease-in-out infinite alternate;
        }

        .tl-orb-one {
          top: -180px;
          left: -100px;
        }

        .tl-orb-two {
          right: -160px;
          bottom: -140px;
          background: #2688ff;
          animation-delay: -5s;
        }

        @keyframes tlFloat {
          from { transform: translate(0, 0); }
          to { transform: translate(35px, 25px); }
        }

        .tl-navbar {
          position: absolute;
          z-index: 5;
          top: 0;
          left: 0;
          width: 100%;
          min-height: 65px;
          padding: 12px clamp(16px, 4vw, 38px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid #ffffff12;
          background: #06152a35;
          backdrop-filter: blur(14px);
        }

        .tl-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          color: white;
          text-decoration: none;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -.4px;
        }

        .tl-brand-icon {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: white;
          color: #07334a;
          transition: transform .25s, box-shadow .25s;
        }

        .tl-brand:hover .tl-brand-icon {
          transform: rotate(-8deg);
          box-shadow: 0 0 22px #31e4c344;
        }

        .tl-signup {
          padding: 9px 14px;
          border: 1px solid #ffffff24;
          border-radius: 10px;
          color: #e4f4fa;
          background: #ffffff09;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          transition: .25s;
        }

        .tl-signup:hover {
          border-color: #32d8bf;
          background: #20cbb218;
        }

        .tl-art {
          position: absolute;
          z-index: -1;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .tl-art polygon {
          fill: #24d9bd;
          opacity: .22;
          animation: tlFade 5s ease-in-out infinite alternate;
        }

        .tl-art polygon:nth-child(2n) {
          fill: #13a7b2;
          animation-delay: -2s;
        }

        .tl-art line {
          stroke: #9ac8a3;
          stroke-width: .8;
          opacity: .3;
        }

        .tl-art circle {
          fill: #28f5d2;
          filter: drop-shadow(0 0 3px #20e8d1);
          animation: tlPulse 3s ease-in-out infinite alternate;
        }

        @keyframes tlFade {
          from { opacity: .08; }
          to { opacity: .3; }
        }

        @keyframes tlPulse {
          from { opacity: .4; }
          to { opacity: 1; }
        }

        .tl-card {
          width: 100%;
          max-width: 340px;
          overflow: hidden;
          border: 1px solid #b0f6ed35;
          border-radius: 24px;
          background: #061326c9;
          backdrop-filter: blur(18px);
          box-shadow: 0 24px 70px #00000040,
                      0 0 35px #18c9b510;
          animation: tlEnter .65s ease-out both;
        }

        @keyframes tlEnter {
          from { opacity: 0; transform: translateY(18px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .tl-card-header {
          padding: 15px 12px;
          text-align: center;
          color: #06364b;
          background: linear-gradient(110deg, #20cbb2, #35d9b9);
          font-size: 15px;
          font-weight: 650;
          letter-spacing: 1.5px;
        }

        .tl-form {
          padding: 23px 20px 19px;
        }

        .tl-field {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 19px;
          border-bottom: 1px solid #b7c8d6a0;
          transition: border-color .25s, box-shadow .25s;
        }

        .tl-field:focus-within {
          border-color: #2de0c4;
          box-shadow: 0 1px 0 #2de0c4;
        }

        .tl-field > svg {
          flex-shrink: 0;
          color: #c6d9e6;
        }

        .tl-input {
          width: 100%;
          min-width: 0;
          height: 38px;
          border: none;
          outline: none;
          background: transparent;
          color: white;
          font: inherit;
          font-size: 13px;
        }

        .tl-input::placeholder {
          color: #b7c4d1;
        }

        .tl-eye {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border: none;
          padding: 5px;
          background: transparent;
          color: #c6d9e6;
          cursor: pointer;
        }

        .tl-eye:hover {
          color: #32e0c4;
        }

        .tl-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin: 1px 0 21px;
          color: #a7b8c9;
          font-size: 10px;
        }

        .tl-remember {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }

        .tl-remember input {
          width: 12px;
          height: 12px;
          margin: 0;
          accent-color: #25cdb4;
        }

        .tl-link {
          color: #a8b8cb;
          text-decoration: none;
        }

        .tl-link:hover {
          color: #36e0c6;
        }

        .tl-button {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 58%;
          min-height: 38px;
          margin: 0 auto;
          border: 1px solid #48e1c333;
          border-radius: 7px;
          background: linear-gradient(100deg, #168e89, #1a9e94);
          color: #f0fffc;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          cursor: pointer;
          transition: .25s ease;
        }

        .tl-button:hover:not(:disabled) {
          transform: translateY(-2px);
          background: linear-gradient(100deg, #20b7a6, #1db9a5);
          box-shadow: 0 7px 22px #19d4b533;
        }

        .tl-button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .tl-error {
          padding: 9px 10px;
          margin-bottom: 15px;
          border: 1px solid #f8717150;
          border-radius: 7px;
          background: #7f1d1d35;
          color: #fecaca;
          font-size: 12px;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .tl-bottom {
          margin: 15px 0 0;
          text-align: center;
          color: #a7b8c9;
          font-size: 11px;
        }

        .tl-footer {
          margin-top: 13px;
          color: #a7b8c985;
          text-align: center;
          font-size: 10px;
        }

        @media (max-height: 620px) {
          .teal-login {
            align-items: flex-start;
            padding-top: 78px;
            padding-bottom: 14px;
          }

          .tl-card {
            max-width: 320px;
          }

          .tl-card-header {
            padding: 11px;
          }

          .tl-form {
            padding: 15px 17px;
          }

          .tl-field {
            margin-bottom: 12px;
          }

          .tl-options {
            margin-bottom: 13px;
          }

          .tl-bottom,
          .tl-footer {
            margin-top: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .teal-login *,
          .teal-login *::before,
          .teal-login *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="tl-glow" />
      <div className="tl-grid" />
      <div className="tl-orb tl-orb-one" />
      <div className="tl-orb tl-orb-two" />

      <svg
        className="tl-art"
        viewBox="0 0 480 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g>
          <polygon points="0,0 80,0 45,90" />
          <polygon points="80,0 180,0 185,90 45,90" />
          <polygon points="0,0 45,90 0,150" />
          <polygon points="45,90 105,130 185,90" />
          <polygon points="185,90 250,40 320,95" />
          <polygon points="0,340 55,280 90,355" />
          <polygon points="390,180 460,150 480,230" />
          <polygon points="400,260 480,230 455,310" />
          <polygon points="350,330 425,380 480,340" />
          <polygon points="380,600 480,555 480,700" />
          <polygon points="240,740 330,710 300,800" />
          <polygon points="0,650 80,600 105,690" />
          <polygon points="0,720 105,690 70,800" />
        </g>
        <g>
          <line x1="35" y1="70" x2="140" y2="45" />
          <line x1="140" y1="45" x2="185" y2="90" />
          <line x1="35" y1="70" x2="70" y2="130" />
          <line x1="70" y1="130" x2="185" y2="90" />
          <line x1="185" y1="90" x2="250" y2="40" />
          <line x1="250" y1="40" x2="320" y2="95" />
          <line x1="0" y1="340" x2="55" y2="280" />
          <line x1="55" y1="280" x2="90" y2="355" />
          <line x1="390" y1="180" x2="460" y2="150" />
          <line x1="460" y1="150" x2="455" y2="310" />
          <line x1="350" y1="330" x2="425" y2="380" />
          <line x1="425" y1="380" x2="480" y2="340" />
          <line x1="380" y1="600" x2="480" y2="555" />
          <line x1="240" y1="740" x2="330" y2="710" />
          <line x1="0" y1="650" x2="105" y2="690" />
        </g>
        <g>
          <circle cx="35" cy="70" r="2" />
          <circle cx="140" cy="45" r="2" />
          <circle cx="185" cy="90" r="2" />
          <circle cx="320" cy="95" r="2" />
          <circle cx="55" cy="280" r="2" />
          <circle cx="390" cy="180" r="2" />
          <circle cx="460" cy="150" r="2" />
          <circle cx="425" cy="380" r="2" />
          <circle cx="330" cy="710" r="2" />
          <circle cx="240" cy="740" r="2" />
          <circle cx="105" cy="690" r="2" />
        </g>
      </svg>

      {/* Same top navbar style as Register page */}
      <header className="tl-navbar">
        <Link to="/" className="tl-brand">
          <span className="tl-brand-icon">
            <Sparkles size={20} />
          </span>
          <span>Perplexity</span>
        </Link>

        <Link to="/register" className="tl-signup">
          Sign up
        </Link>
      </header>

      <section className="tl-card">
        <div className="tl-card-header">CUSTOMER LOGIN</div>

        <form className="tl-form" onSubmit={submitForm}>
          {error && <div className="tl-error">{error}</div>}

          <div className="tl-field">
            <Mail size={15} />
            <input
              className="tl-input"
              type="email"
              name="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="tl-field">
            <LockKeyhole size={15} />
            <input
              className="tl-input"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="tl-eye"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <div className="tl-options">
            <label className="tl-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>

            <Link to="/forgot-password" className="tl-link">
              Forgot Password?
            </Link>
          </div>

          <button
            className="tl-button"
            type="submit"
            disabled={Boolean(loading)}
          >
            {loading ? "PLEASE WAIT..." : "LOGIN"}
          </button>

          <p className="tl-bottom">
            New here?{" "}
            <Link to="/register" className="tl-link">
              Create account
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
