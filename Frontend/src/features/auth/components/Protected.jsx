import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { Sparkles } from "lucide-react";

const Protected = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090c] text-white">

        <div className="flex flex-col items-center">

          {/* Logo */}

          <div
            className="
              flex h-12 w-12
              items-center justify-center
              rounded-2xl
              bg-white
              text-black
              shadow-lg
              shadow-white/[0.08]
            "
          >
            <Sparkles
              size={22}
              strokeWidth={2.5}
            />
          </div>

          {/* Spinner */}

          <div
            className="
              mt-6
              h-5 w-5
              animate-spin
              rounded-full
              border-2
              border-white/10
              border-t-white/80
            "
          />

          <p className="mt-4 text-sm text-white/40">
            Loading your workspace...
          </p>

        </div>

      </main>
    );
  }

  // =====================================================
  // NOT AUTHENTICATED
  // =====================================================

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // =====================================================
  // AUTHENTICATED
  // =====================================================

  return children;
};

export default Protected;