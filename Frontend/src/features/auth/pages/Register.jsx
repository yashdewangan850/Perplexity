import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Search,
  Zap,
} from "lucide-react";

import { register } from "../service/auth.api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitForm = async (event) => {
    event.preventDefault();

    const payload = {
      username,
      email,
      password,
    };

    console.log("Register payload:", payload);

    try {
      setLoading(true);

      const response = await register(payload);

      console.log("Register response:", response);

      // Registration successful
      navigate("/login");
    } catch (error) {
      console.error(
        "Register error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08090c] text-white">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Glow */}

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
          HEADER
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

        {/* Login */}

        <Link
          to="/login"
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
          Sign in
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
              LEFT SECTION
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

              {/* Icon */}

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
                Your search
                <br />
                starts
                <span className="text-white/35">
                  {" "}here.
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
                Create your account and start exploring
                ideas, finding answers, and having
                intelligent conversations.
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
                    Explore anything
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    Ask questions without limits
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
                    AI-powered
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    Get useful answers quickly
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              REGISTER FORM
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

                Create your account
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
                Create account
              </h1>

              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-white/35
                "
              >
                Join Perplexity and start exploring.
              </p>

            </div>

            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={submitForm}
              className="mt-8 space-y-5"
            >

              {/* Username */}

              <div>

                <label
                  htmlFor="username"
                  className="
                    mb-2
                    block
                    text-xs
                    font-medium
                    text-white/55
                  "
                >
                  Username
                </label>

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  placeholder="Choose a username"
                  required
                  autoComplete="username"
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

                <label
                  htmlFor="password"
                  className="
                    mb-2
                    block
                    text-xs
                    font-medium
                    text-white/55
                  "
                >
                  Password
                </label>

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
                    placeholder="Create a password"
                    required
                    autoComplete="new-password"
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

              {/* Register button */}

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

                    Creating account...
                  </>
                ) : (
                  <>
                    Create account

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
                ALREADY A MEMBER?
              </span>

              <div className="h-px flex-1 bg-white/[0.06]" />

            </div>

            {/* Login */}

            <p className="text-center text-sm text-white/35">

              Already have an account?{" "}

              <Link
                to="/login"
                className="
                  font-medium
                  text-white/75
                  transition
                  hover:text-white
                "
              >
                Sign in
              </Link>

            </p>

            {/* Footer */}

            <p className="mt-8 text-center text-[11px] leading-5 text-white/20">
              Your account helps keep your conversations
              and preferences organized.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
};

export default Register;