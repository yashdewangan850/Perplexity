import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Search,
  Zap,
} from "lucide-react";

import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const { handleLogin } = useAuth();

  const navigate = useNavigate();

  const submitForm = async (event) => {
    event.preventDefault();

    const payload = {
      email,
      password,
    };

    await handleLogin(payload);

    navigate("/");
  };

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08090c] text-white">

      {/* =====================================================
          BACKGROUND EFFECTS
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Top glow */}
        <div
          className="
            absolute
            left-1/2
            top-[-300px]
            h-[600px]
            w-[600px]
            -translate-x-1/2
            rounded-full
            bg-white/[0.035]
            blur-3xl
          "
        />

        {/* Grid */}
        <div
          className="
            absolute inset-0
            opacity-[0.025]
            [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)]
            [background-size:70px_70px]
          "
        />

      </div>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header
        className="
          relative z-10
          flex h-[72px]
          items-center
          justify-between
          px-5
          md:px-8
        "
      >

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-2.5"
        >

          <div
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              bg-white
              text-black
              shadow-lg
              shadow-white/[0.08]
            "
          >
            <Sparkles
              size={18}
              strokeWidth={2.5}
            />
          </div>

          <span className="text-lg font-semibold tracking-tight">
            Perplexity
          </span>

        </Link>

        {/* Register */}

        <Link
          to="/register"
          className="
            rounded-xl
            border border-white/[0.08]
            bg-white/[0.03]
            px-4 py-2
            text-sm
            font-medium
            text-white/60
            transition
            hover:border-white/[0.15]
            hover:bg-white/[0.06]
            hover:text-white
          "
        >
          Create account
        </Link>

      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <section
        className="
          relative z-10
          flex
          min-h-[calc(100vh-72px)]
          items-center
          justify-center
          px-4
          py-10
          sm:px-6
        "
      >

        <div
          className="
            grid
            w-full
            max-w-5xl
            overflow-hidden
            rounded-[28px]
            border border-white/[0.08]
            bg-white/[0.025]
            shadow-2xl
            shadow-black/50
            backdrop-blur-xl
            lg:grid-cols-[1fr_1fr]
          "
        >

          {/* =================================================
              LEFT SIDE
          ================================================== */}

          <div
            className="
              hidden
              border-r border-white/[0.06]
              bg-white/[0.015]
              p-10
              lg:flex
              lg:flex-col
              lg:justify-between
            "
          >

            <div>

              {/* Logo icon */}

              <div
                className="
                  mb-8
                  flex h-12 w-12
                  items-center justify-center
                  rounded-2xl
                  border border-white/[0.08]
                  bg-white/[0.04]
                "
              >
                <Sparkles
                  size={22}
                  className="text-white"
                />
              </div>

              <h2
                className="
                  max-w-md
                  text-4xl
                  font-semibold
                  leading-tight
                  tracking-tight
                "
              >
                Search, explore,
                <br />
                and discover
                <span className="text-white/35">
                  {" "}anything.
                </span>
              </h2>

              <p
                className="
                  mt-5
                  max-w-md
                  text-sm
                  leading-7
                  text-white/35
                "
              >
                Get intelligent answers, explore ideas,
                understand complex topics, and find
                useful information in one place.
              </p>

            </div>

            {/* Feature cards */}

            <div className="mt-12 space-y-3">

              <div
                className="
                  flex items-center gap-4
                  rounded-2xl
                  border border-white/[0.06]
                  bg-white/[0.025]
                  p-4
                "
              >

                <div
                  className="
                    flex h-10 w-10
                    shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-white/[0.06]
                  "
                >
                  <Search
                    size={18}
                    className="text-white/70"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-white/80">
                    Search smarter
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    Find answers faster
                  </p>
                </div>

              </div>

              <div
                className="
                  flex items-center gap-4
                  rounded-2xl
                  border border-white/[0.06]
                  bg-white/[0.025]
                  p-4
                "
              >

                <div
                  className="
                    flex h-10 w-10
                    shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-white/[0.06]
                  "
                >
                  <Zap
                    size={18}
                    className="text-white/70"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-white/80">
                    AI-powered answers
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    Clear and useful responses
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              LOGIN FORM
          ================================================== */}

          <div className="p-6 sm:p-10 lg:p-12">

            {/* Mobile logo */}

            <div className="mb-8 flex justify-center lg:hidden">

              <div
                className="
                  flex h-12 w-12
                  items-center justify-center
                  rounded-2xl
                  bg-white
                  text-black
                "
              >
                <Sparkles
                  size={22}
                  strokeWidth={2.5}
                />
              </div>

            </div>

            {/* Heading */}

            <div className="text-center lg:text-left">

              <div
                className="
                  mb-4
                  inline-flex
                  items-center gap-2
                  rounded-full
                  border border-white/[0.07]
                  bg-white/[0.03]
                  px-3 py-1.5
                  text-xs
                  text-white/40
                "
              >
                <ShieldCheck size={13} />

                Secure sign in
              </div>

              <h1
                className="
                  text-3xl
                  font-semibold
                  tracking-tight
                  text-white
                  sm:text-4xl
                "
              >
                Welcome back
              </h1>

              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-white/35
                "
              >
                Sign in to continue your conversations.
              </p>

            </div>

            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={submitForm}
              className="mt-8 space-y-5"
            >

              {/* Email */}

              <div>

                <label
                  htmlFor="email"
                  className="
                    mb-2
                    block
                    text-xs
                    font-medium
                    text-white/55
                  "
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="
                    w-full
                    rounded-xl
                    border border-white/[0.08]
                    bg-white/[0.025]
                    px-4 py-3.5
                    text-sm
                    text-white
                    outline-none
                    transition
                    placeholder:text-white/20
                    hover:border-white/[0.12]
                    focus:border-white/[0.25]
                    focus:bg-white/[0.04]
                    focus:ring-4
                    focus:ring-white/[0.03]
                  "
                />

              </div>

              {/* Password */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="
                      block
                      text-xs
                      font-medium
                      text-white/55
                    "
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="
                      text-xs
                      text-white/30
                      transition
                      hover:text-white/60
                    "
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="relative">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="
                      w-full
                      rounded-xl
                      border border-white/[0.08]
                      bg-white/[0.025]
                      px-4 py-3.5
                      pr-12
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-white/20
                      hover:border-white/[0.12]
                      focus:border-white/[0.25]
                      focus:bg-white/[0.04]
                      focus:ring-4
                      focus:ring-white/[0.03]
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      rounded-lg
                      p-1.5
                      text-white/25
                      transition
                      hover:bg-white/[0.05]
                      hover:text-white/60
                    "
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>

              {/* Login button */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-4 py-3.5
                  text-sm
                  font-semibold
                  text-black
                  transition
                  hover:bg-white/90
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {loading ? (
                  <>
                    <span
                      className="
                        h-4 w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-black/20
                        border-t-black
                      "
                    />

                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in

                    <ArrowRight
                      size={16}
                      className="
                        transition-transform
                        group-hover:translate-x-0.5
                      "
                    />
                  </>
                )}

              </button>

            </form>

            {/* Divider */}

            <div className="my-7 flex items-center gap-3">

              <div className="h-px flex-1 bg-white/[0.06]" />

              <span className="text-[11px] text-white/20">
                OR
              </span>

              <div className="h-px flex-1 bg-white/[0.06]" />

            </div>

            {/* Register */}

            <p className="text-center text-sm text-white/35">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="
                  font-medium
                  text-white/75
                  transition
                  hover:text-white
                "
              >
                Create one
              </Link>

            </p>

            {/* Footer */}

            <p className="mt-8 text-center text-[11px] leading-5 text-white/20">
              By continuing, you agree to use this service
              responsibly.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Login;