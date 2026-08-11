import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  ArrowUp,
  Menu,
  Plus,
  Search,
  Sparkles,
  MessageSquare,
  MoreHorizontal,
  PanelLeft,
  LogOut,
  User,
  LoaderCircle,
} from "lucide-react";

import { useChat } from "../hooks/useChat";
import axios from "axios";

const Dashboard = () => {
  const chat = useChat();
  const navigate = useNavigate();

  const [chatInput, setChatInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Profile dropdown
  const [profileOpen, setProfileOpen] = useState(false);

  // Search / AI loading state
  const [isSearching, setIsSearching] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState("");

  // Keep track of assistant messages before sending
  const assistantCountBeforeSend = useRef(0);

  const chats = useSelector((state) => state.chat.chats);

  const currentChatId = useSelector(
    (state) => state.chat.currentChatId
  );

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  const currentChat = chats?.[currentChatId];

  const messages = currentChat?.messages || [];

  const chatList = useMemo(() => {
    return Object.values(chats || {});
  }, [chats]);

  /*
   * ============================================================
   * CHECK WHEN AI RESPONSE ARRIVES
   * ============================================================
   */

  useEffect(() => {
    if (!isSearching) return;

    const assistantMessages = messages.filter(
      (message) => message.role === "assistant"
    );

    if (
      assistantMessages.length > assistantCountBeforeSend.current
    ) {
      setIsSearching(false);
      setPendingQuestion("");
    }
  }, [messages, isSearching]);

  /*
   * ============================================================
   * SEND MESSAGE
   * ============================================================
   */

  const handleSubmitMessage = async (event) => {
    event.preventDefault();

    const trimmedMessage = chatInput.trim();

    if (!trimmedMessage || isSearching) {
      return;
    }

    const assistantMessages = messages.filter(
      (message) => message.role === "assistant"
    );

    // Save current assistant message count
    assistantCountBeforeSend.current = assistantMessages.length;

    // Immediately show user's question
    setPendingQuestion(trimmedMessage);

    // Show searching state
    setIsSearching(true);

    // Clear input
    setChatInput("");

    try {
      await chat.handleSendMessage({
        message: trimmedMessage,
        chatId: currentChatId,
      });
    } catch (error) {
      console.error("Message sending error:", error);

      setIsSearching(false);
      setPendingQuestion("");
    }
  };

  /*
   * ============================================================
   * OPEN CHAT
   * ============================================================
   */

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);

    setPendingQuestion("");
    setIsSearching(false);

    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  /*
   * ============================================================
   * NEW THREAD
   * ============================================================
   *
   * NOTE:
   * Your current useChat hook doesn't expose a new-chat function
   * in the code you provided, so this only clears the local UI.
   *
   * We can connect this to backend later.
   */

  const handleNewThread = () => {
    setChatInput("");
    setPendingQuestion("");
    setIsSearching(false);
  };

  /*
   * ============================================================
   * LOGOUT
   * ============================================================
   */

 const handleLogout = async () => {
  try {
    await axios.post(
      "https://perplexity-1-5xj4.onrender.com/api/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );

    setProfileOpen(false);

    navigate("/login");
  } catch (error) {
    console.error("Logout error:", error);

    navigate("/login");
  }
};

  return (
    <main className="min-h-screen w-full bg-[#08090c] text-white">
      <div className="flex h-screen overflow-hidden">

        {/* =====================================================
            MOBILE OVERLAY
        ====================================================== */}

        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}

        {/* =====================================================
            SIDEBAR
        ====================================================== */}

        <aside
          className={`
            fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col
            border-r border-white/[0.06]
            bg-[#0b0c10]
            transition-transform duration-300
            md:relative md:z-20
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:-translate-x-0"
            }
            ${!sidebarOpen ? "md:hidden" : ""}
          `}
        >

          {/* Logo */}

          <div className="flex h-[72px] items-center justify-between px-5">
            <div className="flex items-center gap-2.5">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
                <Sparkles
                  size={17}
                  strokeWidth={2.5}
                />
              </div>

              <span className="text-[19px] font-semibold tracking-tight">
                Perplexity
              </span>

            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white md:hidden"
            >
              <PanelLeft size={18} />
            </button>
          </div>

          {/* =====================================================
              NEW THREAD
          ====================================================== */}

          <div className="px-4">

            <button
              type="button"
              onClick={handleNewThread}
              className="
                flex w-full items-center gap-3 rounded-xl
                border border-white/[0.08]
                bg-white/[0.035]
                px-4 py-3
                text-sm font-medium text-white/90
                transition
                hover:border-white/[0.14]
                hover:bg-white/[0.07]
              "
            >

              <Plus size={17} />

              <span>
                New thread
              </span>

              <span className="ml-auto text-xs text-white/30">
                Ctrl K
              </span>

            </button>

          </div>

          {/* =====================================================
              SEARCH THREADS
          ====================================================== */}

          <div className="px-4 pt-3">

            <button
              type="button"
              className="
                flex w-full items-center gap-3 rounded-xl
                px-3 py-2.5
                text-sm text-white/45
                transition
                hover:bg-white/[0.04]
                hover:text-white/70
              "
            >

              <Search size={16} />

              <span>
                Search threads
              </span>

            </button>

          </div>

          {/* =====================================================
              CHAT HISTORY
          ====================================================== */}

          <div className="mt-7 flex-1 overflow-y-auto px-3">

            <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-white/25">
              Recent
            </div>

            <div className="space-y-1">

              {chatList.length > 0 ? (

                chatList.map((item) => {

                  const active =
                    item.id === currentChatId;

                  return (
                    <button
                      key={item.id}
                      onClick={() => openChat(item.id)}
                      type="button"
                      className={`
                        group flex w-full items-center gap-3
                        rounded-xl px-3 py-2.5
                        text-left text-sm
                        transition
                        ${
                          active
                            ? "bg-white/[0.08] text-white"
                            : "text-white/45 hover:bg-white/[0.045] hover:text-white/80"
                        }
                      `}
                    >

                      <MessageSquare
                        size={15}
                        className={
                          active
                            ? "text-white/80"
                            : "text-white/25"
                        }
                      />

                      <span className="min-w-0 flex-1 truncate">
                        {item.title || "New conversation"}
                      </span>

                      {active && (
                        <MoreHorizontal
                          size={16}
                          className="text-white/30"
                        />
                      )}

                    </button>
                  );
                })

              ) : (

                <div className="px-3 py-8 text-center text-xs text-white/25">
                  No conversations yet
                </div>

              )}

            </div>
          </div>

          {/* =====================================================
              PROFILE
          ====================================================== */}

          <div className="relative border-t border-white/[0.06] p-4">

            {/* Profile button */}

            <button
              type="button"
              onClick={() =>
                setProfileOpen((prev) => !prev)
              }
              className="
                flex w-full items-center gap-3
                rounded-xl px-2 py-2
                text-left
                transition
                hover:bg-white/[0.05]
              "
            >

              <div
                className="
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-white/25
                  to-white/5
                  text-sm font-semibold
                "
              >
                Y
              </div>

              <div className="min-w-0 flex-1">

                <p className="truncate text-sm font-medium text-white/85">
                  Personal
                </p>

                <p className="text-xs text-white/30">
                  Free plan
                </p>

              </div>

              <MoreHorizontal
                size={17}
                className="text-white/30"
              />

            </button>

            {/* =================================================
                PROFILE DROPDOWN
            ================================================== */}

            {profileOpen && (

              <div
                className="
                  absolute bottom-[72px] left-4 right-4
                  z-50
                  overflow-hidden
                  rounded-2xl
                  border border-white/[0.08]
                  bg-[#15171c]
                  p-1.5
                  shadow-2xl
                  shadow-black/50
                "
              >

                {/* Profile */}

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/profile");
                  }}
                  className="
                    flex w-full items-center gap-3
                    rounded-xl px-3 py-2.5
                    text-sm text-white/70
                    transition
                    hover:bg-white/[0.07]
                    hover:text-white
                  "
                >

                  <User size={16} />

                  <span>
                    Profile
                  </span>

                </button>

                <div className="my-1 border-t border-white/[0.06]" />

                {/* Logout */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex w-full items-center gap-3
                    rounded-xl px-3 py-2.5
                    text-sm text-red-400
                    transition
                    hover:bg-red-500/10
                    hover:text-red-300
                  "
                >

                  <LogOut size={16} />

                  <span>
                    Logout
                  </span>

                </button>

              </div>

            )}

          </div>

        </aside>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <section className="relative flex min-w-0 flex-1 flex-col">

          {/* =====================================================
              TOP BAR
          ====================================================== */}

          <header
            className="
              flex h-[72px] shrink-0 items-center
              border-b border-white/[0.05]
              px-4 md:px-6
            "
          >

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(!sidebarOpen)
              }
              className="
                rounded-xl p-2
                text-white/45
                transition
                hover:bg-white/[0.05]
                hover:text-white
              "
            >
              <Menu size={19} />
            </button>

            <div className="ml-3 flex items-center gap-2 md:hidden">

              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black">
                <Sparkles size={14} />
              </div>

              <span className="font-semibold">
                Perplexity
              </span>

            </div>

            <div className="ml-auto flex items-center gap-2">

              <button
                className="
                  hidden rounded-xl px-3 py-2
                  text-xs text-white/40
                  transition hover:bg-white/5 hover:text-white/70
                  sm:block
                "
              >
                Share
              </button>

              <button
                className="
                  rounded-xl p-2
                  text-white/40
                  transition
                  hover:bg-white/5
                  hover:text-white
                "
              >
                <MoreHorizontal size={19} />
              </button>

            </div>

          </header>

          {/* =====================================================
              CHAT AREA
          ====================================================== */}

          <div className="relative flex-1 overflow-hidden">

            <div
              className="
                h-full overflow-y-auto
                px-4 pb-44 pt-8
                md:px-8 md:pt-10
              "
            >

              <div className="mx-auto w-full max-w-3xl">

                {/* =================================================
                    EMPTY STATE
                ================================================== */}

                {!messages.length &&
                !pendingQuestion ? (

                  <div
                    className="
                      flex min-h-[calc(100vh-260px)]
                      flex-col items-center
                      justify-center
                      text-center
                    "
                  >

                    <div
                      className="
                        mb-6 flex h-14 w-14
                        items-center justify-center
                        rounded-2xl
                        border border-white/[0.08]
                        bg-white/[0.035]
                        shadow-2xl shadow-black/30
                      "
                    >
                      <Sparkles
                        size={25}
                        className="text-white/80"
                      />
                    </div>

                    <h2
                      className="
                        text-3xl font-semibold
                        tracking-tight
                        text-white
                        md:text-4xl
                      "
                    >
                      What do you want to know?
                    </h2>

                    <p className="mt-3 max-w-md text-sm leading-6 text-white/35 md:text-base">
                      Ask anything. Search the web, explore ideas,
                      write content, or solve a problem.
                    </p>

                    <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">

                      {[
                        "Explain React hooks",
                        "What is artificial intelligence?",
                        "Build a portfolio website",
                        "Explain JavaScript closures",
                      ].map((suggestion) => (

                        <button
                          key={suggestion}
                          type="button"
                          onClick={() =>
                            setChatInput(suggestion)
                          }
                          className="
                            rounded-xl
                            border border-white/[0.06]
                            bg-white/[0.025]
                            px-4 py-3
                            text-left text-sm
                            text-white/45
                            transition
                            hover:border-white/[0.12]
                            hover:bg-white/[0.05]
                            hover:text-white/80
                          "
                        >
                          {suggestion}
                        </button>

                      ))}

                    </div>

                  </div>

                ) : (

                  /* =================================================
                     MESSAGES
                  ================================================== */

                  <div className="space-y-8">

                    {/* =================================================
                        PENDING USER QUESTION
                    ================================================== */}

                    {pendingQuestion &&
                      !messages.some(
                        (message) =>
                          message.role === "user" &&
                          message.content === pendingQuestion
                      ) && (

                        <div className="flex w-full justify-end">

                          <div
                            className="
                              max-w-[85%]
                              rounded-2xl
                              rounded-br-md
                              bg-white/[0.09]
                              px-4 py-3
                              text-[15px]
                              leading-7
                              text-white/90
                              md:max-w-[75%]
                            "
                          >
                            {pendingQuestion}
                          </div>

                        </div>

                      )}

                    {/* =================================================
                        EXISTING MESSAGES
                    ================================================== */}

                    {messages.map((message) => (

                      <div
                        key={message.id}
                        className={`
                          flex w-full
                          ${
                            message.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }
                        `}
                      >

                        {/* USER MESSAGE */}

                        {message.role === "user" ? (

                          <div
                            className="
                              max-w-[85%]
                              rounded-2xl
                              rounded-br-md
                              bg-white/[0.09]
                              px-4 py-3
                              text-[15px]
                              leading-7
                              text-white/90
                              md:max-w-[75%]
                            "
                          >
                            {message.content}
                          </div>

                        ) : (

                          /* AI MESSAGE */

                          <div className="w-full max-w-3xl">

                            <div className="mb-3 flex items-center gap-2">

                              <div
                                className="
                                  flex h-7 w-7
                                  items-center justify-center
                                  rounded-lg
                                  bg-white
                                  text-black
                                "
                              >
                                <Sparkles size={14} />
                              </div>

                              <span className="text-xs font-medium text-white/50">
                                Perplexity
                              </span>

                            </div>

                            <div
                              className="
                                prose prose-invert
                                max-w-none
                                text-[15px]
                                leading-7
                                text-white/80
                              "
                            >

                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{

                                  h1: ({ children }) => (
                                    <h1 className="mb-4 mt-6 text-2xl font-semibold text-white">
                                      {children}
                                    </h1>
                                  ),

                                  h2: ({ children }) => (
                                    <h2 className="mb-3 mt-6 text-xl font-semibold text-white">
                                      {children}
                                    </h2>
                                  ),

                                  h3: ({ children }) => (
                                    <h3 className="mb-2 mt-5 text-lg font-semibold text-white">
                                      {children}
                                    </h3>
                                  ),

                                  p: ({ children }) => (
                                    <p className="mb-4 leading-7 last:mb-0">
                                      {children}
                                    </p>
                                  ),

                                  ul: ({ children }) => (
                                    <ul className="mb-4 list-disc space-y-1 pl-6">
                                      {children}
                                    </ul>
                                  ),

                                  ol: ({ children }) => (
                                    <ol className="mb-4 list-decimal space-y-1 pl-6">
                                      {children}
                                    </ol>
                                  ),

                                  li: ({ children }) => (
                                    <li className="pl-1">
                                      {children}
                                    </li>
                                  ),

                                  strong: ({ children }) => (
                                    <strong className="font-semibold text-white">
                                      {children}
                                    </strong>
                                  ),

                                  blockquote: ({ children }) => (
                                    <blockquote
                                      className="
                                        my-4 border-l-2
                                        border-white/20
                                        pl-4 text-white/50
                                      "
                                    >
                                      {children}
                                    </blockquote>
                                  ),

                                  code: ({
                                    inline,
                                    children,
                                  }) =>
                                    inline ? (
                                      <code
                                        className="
                                          rounded-md
                                          bg-white/[0.08]
                                          px-1.5 py-0.5
                                          font-mono text-[13px]
                                          text-white/80
                                        "
                                      >
                                        {children}
                                      </code>
                                    ) : (
                                      <code className="font-mono text-[13px]">
                                        {children}
                                      </code>
                                    ),

                                  pre: ({ children }) => (
                                    <pre
                                      className="
                                        my-5 overflow-x-auto
                                        rounded-xl
                                        border border-white/[0.06]
                                        bg-[#050609]
                                        p-4
                                        leading-6
                                      "
                                    >
                                      {children}
                                    </pre>
                                  ),

                                  a: ({ children, href }) => (
                                    <a
                                      href={href}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="
                                        text-white
                                        underline
                                        decoration-white/20
                                        underline-offset-4
                                        hover:decoration-white
                                      "
                                    >
                                      {children}
                                    </a>
                                  ),

                                  hr: () => (
                                    <hr className="my-6 border-white/[0.08]" />
                                  ),

                                }}
                              >
                                {message.content}
                              </ReactMarkdown>

                            </div>

                          </div>

                        )}

                      </div>

                    ))}

                    {/* =================================================
                        SEARCHING INDICATOR
                    ================================================== */}

                    {isSearching && (

                      <div className="flex w-full justify-start">

                        <div className="w-full max-w-3xl">

                          <div className="mb-3 flex items-center gap-2">

                            <div
                              className="
                                flex h-7 w-7
                                items-center justify-center
                                rounded-lg
                                bg-white
                                text-black
                              "
                            >
                              <Sparkles size={14} />
                            </div>

                            <span className="text-xs font-medium text-white/50">
                              Perplexity
                            </span>

                          </div>

                          <div className="flex items-center gap-3 text-sm text-white/40">

                            <LoaderCircle
                              size={16}
                              className="animate-spin"
                            />

                            <span>
                              Searching for the best answer...
                            </span>

                          </div>

                        </div>

                      </div>

                    )}

                  </div>

                )}

              </div>

            </div>

            {/* =====================================================
                BOTTOM INPUT
            ====================================================== */}

            <div
              className="
                pointer-events-none
                absolute bottom-0 left-0 right-0
                bg-gradient-to-t
                from-[#08090c]
                via-[#08090c]/95
                to-transparent
                px-4 pb-5 pt-14
                md:px-8
              "
            >

              <div className="pointer-events-auto mx-auto w-full max-w-3xl">

                <form
                  onSubmit={handleSubmitMessage}
                  className="
                    relative
                    rounded-2xl
                    border border-white/[0.10]
                    bg-[#111318]
                    shadow-2xl
                    shadow-black/40
                    transition
                    focus-within:border-white/[0.18]
                    focus-within:bg-[#13151a]
                  "
                >

                  <textarea
                    value={chatInput}
                    onChange={(event) =>
                      setChatInput(event.target.value)
                    }
                    onKeyDown={(event) => {

                      if (
                        event.key === "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();

                        handleSubmitMessage(event);
                      }

                    }}
                    rows={1}
                    disabled={isSearching}
                    placeholder={
                      isSearching
                        ? "Searching..."
                        : "Ask anything..."
                    }
                    className="
                      min-h-[58px]
                      w-full
                      resize-none
                      bg-transparent
                      px-5
                      py-4
                      pr-16
                      text-[15px]
                      text-white
                      outline-none
                      placeholder:text-white/25
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                  <div className="absolute bottom-2.5 right-2.5">

                    <button
                      type="submit"
                      disabled={
                        !chatInput.trim() ||
                        isSearching
                      }
                      className="
                        flex h-10 w-10
                        items-center justify-center
                        rounded-xl
                        bg-white
                        text-black
                        transition
                        hover:bg-white/90
                        disabled:cursor-not-allowed
                        disabled:bg-white/[0.08]
                        disabled:text-white/20
                      "
                    >

                      {isSearching ? (

                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                        />

                      ) : (

                        <ArrowUp
                          size={18}
                          strokeWidth={2.5}
                        />

                      )}

                    </button>

                  </div>

                </form>

                <p className="mt-2 text-center text-[11px] text-white/20">
                  Perplexity can make mistakes. Check important information.
                </p>

              </div>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
};

export default Dashboard;