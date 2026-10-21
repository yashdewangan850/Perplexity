
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Sparkles,
  Eye,
  EyeOff,
  User,
  Mail,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";
import { register } from "../service/auth.api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submitForm = async (event) => {
    event.preventDefault();
    setError("");

    const payload = {
      username: username.trim(),
      email: email.trim(),
      password,
    };

    try {
      setLoading(true);
      await register(payload);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <style>{`
        .register-page {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background: #061b3d;
          color: #fff;
          font-family: Inter, Arial, sans-serif;
        }

        .register-page * {
          box-sizing: border-box;
        }

        .rg-background {
          position: absolute;
          inset: 0;
          z-index: -2;
          background:
            radial-gradient(ellipse at 10% 0%, #20c9b650, transparent 42%),
            radial-gradient(ellipse at 100% 80%, #0caeaa40, transparent 42%),
            linear-gradient(145deg, #063c60, #071b3e 60%, #042d48);
        }

        .rg-grid {
          position: absolute;
          inset: 0;
          opacity: .13;
          background-image:
            linear-gradient(#ffffff12 1px, transparent 1px),
            linear-gradient(90deg, #ffffff12 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, black, transparent);
        }

        .rg-orb {
          position: absolute;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          filter: blur(90px);
          background: #20d7b8;
          opacity: .15;
          animation: rgFloat 12s ease-in-out infinite alternate;
        }

        .rg-orb-one {
          top: -160px;
          left: -80px;
        }

        .rg-orb-two {
          bottom: -160px;
          right: -80px;
          background: #2688ff;
          animation-delay: -5s;
        }

        @keyframes rgFloat {
          from { transform: translate(0, 0); }
          to { transform: translate(35px, 28px); }
        }

        .rg-header {
          min-height: 65px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px clamp(16px, 4vw, 38px);
          border-bottom: 1px solid #ffffff12;
          background: #06152a35;
          backdrop-filter: blur(14px);
        }

        .rg-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          color: white;
          text-decoration: none;
          font-size: 18px;
          font-weight: 700;
        }

        .rg-brand-icon {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: white;
          color: #07334a;
          transition: transform .3s, box-shadow .3s;
        }

        .rg-brand:hover .rg-brand-icon {
          transform: rotate(-8deg);
          box-shadow: 0 0 22px #31e4c344;
        }

        .rg-header-link {
          padding: 9px 14px;
          border: 1px solid #ffffff24;
          border-radius: 10px;
          color: #e4f4fa;
          background: #ffffff09;
          text-decoration: none;
          font-size: 12px;
          transition: .25s;
        }

        .rg-header-link:hover {
          border-color: #32d8bf;
          background: #20cbb218;
        }

        .rg-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px 30px;
        }

        .rg-card {
          width: 100%;
          max-width: 365px;
          overflow: hidden;
          border: 1px solid #b0f6ed30;
          border-radius: 23px;
          background: #061326c9;
          backdrop-filter: blur(18px);
          box-shadow: 0 24px 70px #00000040,
                      0 0 32px #18c9b512;
          animation: rgEnter .6s ease-out both;
        }

        @keyframes rgEnter {
          from { opacity: 0; transform: translateY(18px) scale(.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .rg-card-header {
          padding: 15px 12px;
          text-align: center;
          background: linear-gradient(110deg, #20cbb2, #35d9b9);
          color: #06364b;
          font-size: 15px;
          font-weight: 650;
          letter-spacing: 1.5px;
        }

        .rg-form {
          padding: 22px 22px 20px;
        }

        .rg-intro {
          margin-bottom: 21px;
          text-align: center;
        }

        .rg-intro h1 {
          margin: 0;
          font-size: 25px;
          font-weight: 700;
          letter-spacing: -.8px;
        }

        .rg-intro p {
          margin: 7px 0 0;
          color: #a9bfd0;
          font-size: 12px;
        }

        .rg-field {
          margin-bottom: 16px;
        }

        .rg-label {
          display: block;
          margin-bottom: 7px;
          color: #d7e6ef;
          font-size: 12px;
          font-weight: 550;
        }

        .rg-input-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 11px;
          border: 1px solid #ffffff20;
          border-radius: 10px;
          background: #06152a66;
          transition: border-color .25s, box-shadow .25s;
        }

        .rg-input-wrap:focus-within {
          border-color: #2de0c4;
          box-shadow: 0 0 0 3px #20d7b815;
        }

        .rg-input-wrap > svg {
          flex-shrink: 0;
          color: #9dbbc9;
        }

        .rg-input {
          width: 100%;
          min-width: 0;
          height: 43px;
          border: none;
          outline: none;
          background: transparent;
          color: white;
          font-size: 12px;
        }

        .rg-input::placeholder {
          color: #8299ad;
        }

        .rg-toggle {
          display: grid;
          place-items: center;
          padding: 5px;
          border: 0;
          color: #a9c1d0;
          background: transparent;
          cursor: pointer;
        }

        .rg-toggle:hover {
          color: #36e0c6;
        }

        .rg-error {
          margin-bottom: 15px;
          padding: 10px 12px;
          border: 1px solid #f8717150;
          border-radius: 9px;
          background: #7f1d1d35;
          color: #fecaca;
          font-size: 12px;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .rg-submit {
          width: 100%;
          min-height: 43px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-top: 5px;
          border: 1px solid #48e1c333;
          border-radius: 9px;
          background: linear-gradient(100deg, #168e89, #1a9e94);
          color: white;
          font-size: 12px;
          font-weight: 650;
          letter-spacing: .7px;
          cursor: pointer;
          transition: transform .25s, box-shadow .25s, background .25s;
        }

        .rg-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          background: linear-gradient(100deg, #20b7a6, #1db9a5);
          box-shadow: 0 7px 22px #19d4b533;
        }

        .rg-submit:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .rg-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 19px 0 15px;
          color: #9ab0c1;
          font-size: 10px;
          letter-spacing: .6px;
        }

        .rg-divider::before,
        .rg-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #ffffff1b;
        }

        .rg-bottom {
          margin: 0;
          text-align: center;
          color: #a9bfd0;
          font-size: 12px;
        }

        .rg-link {
          color: #39ddc3;
          text-decoration: none;
          font-weight: 600;
        }

        .rg-link:hover {
          color: white;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        @media (max-height: 700px) {
          .rg-header {
            min-height: 55px;
          }

          .rg-main {
            align-items: flex-start;
            padding-top: 14px;
            padding-bottom: 14px;
          }

          .rg-card {
            max-width: 345px;
          }

          .rg-card-header {
            padding: 11px;
          }

          .rg-form {
            padding: 16px 20px;
          }

          .rg-intro {
            margin-bottom: 14px;
          }

          .rg-intro h1 {
            font-size: 22px;
          }

          .rg-field {
            margin-bottom: 12px;
          }

          .rg-input {
            height: 39px;
          }

          .rg-divider {
            margin: 13px 0 11px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .register-page *,
          .register-page *::before,
          .register-page *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="rg-background" aria-hidden="true">
        <div className="rg-grid" />
        <div className="rg-orb rg-orb-one" />
        <div className="rg-orb rg-orb-two" />
      </div>

      <header className="rg-header">
        <Link to="/" className="rg-brand">
          <span className="rg-brand-icon">
            <Sparkles size={20} />
          </span>
          <span>Perplexity</span>
        </Link>

        <Link to="/login" className="rg-header-link">
          Sign in
        </Link>
      </header>

      <section className="rg-main">
        <div className="rg-card">
          <div className="rg-card-header">CREATE ACCOUNT</div>

          <form className="rg-form" onSubmit={submitForm}>
            <div className="rg-intro">
              <h1>Join Perplexity<span style={{ color: "#31d9bd" }}>.</span></h1>
              <p>Create your account and start exploring.</p>
            </div>

            {error && <div className="rg-error">{error}</div>}

            <div className="rg-field">
              <label className="rg-label" htmlFor="register-username">
                Username
              </label>
              <div className="rg-input-wrap">
                <User size={16} />
                <input
                  id="register-username"
                  className="rg-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="rg-field">
              <label className="rg-label" htmlFor="register-email">
                Email address
              </label>
              <div className="rg-input-wrap">
                <Mail size={16} />
                <input
                  id="register-email"
                  className="rg-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="rg-field">
              <label className="rg-label" htmlFor="register-password">
                Password
              </label>
              <div className="rg-input-wrap">
                <LockKeyhole size={16} />
                <input
                  id="register-password"
                  className="rg-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="rg-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button className="rg-submit" type="submit" disabled={loading}>
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              {!loading && <ArrowRight size={16} />}
            </button>

            <div className="rg-divider">
              <span>ALREADY A MEMBER?</span>
            </div>

            <p className="rg-bottom">
              Already have an account?{" "}
              <Link to="/login" className="rg-link">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Register;
