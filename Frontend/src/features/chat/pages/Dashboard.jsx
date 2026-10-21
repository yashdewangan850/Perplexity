
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDispatch, useSelector } from "react-redux";
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
  X,
} from "lucide-react";
import { useChat } from "../hooks/useChat";
import axios from "axios";

const API_URL = "https://perplexity-1-5xj4.onrender.com";

const Dashboard = () => {
  const chat = useChat();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [chatInput, setChatInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [newChatMode, setNewChatMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const requestIdRef = useRef(0);

  const chats = useSelector((state) => state.chat.chats || {});
  const currentChatId = useSelector(
    (state) => state.chat.currentChatId
  );

  const currentChat = newChatMode ? null : chats[currentChatId];
  const messages = currentChat?.messages || [];

  const chatList = useMemo(() => {
    return Object.values(chats).filter(Boolean);
  }, [chats]);

  const filteredChats = useMemo(() => {
    const query = historySearch.trim().toLowerCase();

    if (!query) return chatList;

    return chatList.filter((item) =>
      (item.title || "New conversation")
        .toLowerCase()
        .includes(query)
    );
  }, [chatList, historySearch]);

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, pendingQuestion, isSearching]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        handleNewThread();
      }

      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewThread = () => {
    // Invalidate pending UI updates from the previous request.
    requestIdRef.current += 1;

    setNewChatMode(true);
    setChatInput("");
    setPendingQuestion("");
    setIsSearching(false);
    setErrorMessage("");
    setProfileOpen(false);

    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }

    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const openChat = (chatId) => {
    requestIdRef.current += 1;

    chat.handleOpenChat(chatId, chats);

    setNewChatMode(false);
    setPendingQuestion("");
    setIsSearching(false);
    setErrorMessage("");
    setChatInput("");
    setProfileOpen(false);

    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleSubmitMessage = async (event) => {
    event.preventDefault();

    const messageText = chatInput.trim();

    if (!messageText || isSearching) return;

    const requestId = ++requestIdRef.current;

    setErrorMessage("");
    setChatInput("");
    setPendingQuestion(messageText);
    setIsSearching(true);

    /*
      The question is displayed from pendingQuestion immediately.
      Do not clear it just because an assistant response arrives.
      Clear it after the saved messages contain the user's question.
    */

    try {
      await chat.handleSendMessage({
        message: messageText,
        chatId: newChatMode ? null : currentChatId,
      });

      /*
        The hook should save the user message and assistant response
        into Redux. Once it has completed, keep the saved messages
        as the source of truth and remove the temporary question.
      */
      if (requestId === requestIdRef.current) {
        setNewChatMode(false);
        setPendingQuestion("");
        setIsSearching(false);
      }
    } catch (error) {
      console.error("Message sending error:", error);

      if (requestId === requestIdRef.current) {
        setErrorMessage(
          "Message send nahi ho paya. Please try again."
        );
        setIsSearching(false);

        // Preserve the user's question so it is not lost.
        setChatInput(messageText);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setProfileOpen(false);
      navigate("/register", { replace: true });
    }
  };

  const suggestions = [
    {
      title: "Learn React hooks",
      description: "Understand state and effects",
      prompt: "Explain React hooks with simple examples.",
      icon: Sparkles,
    },
    {
      title: "Prepare for interviews",
      description: "Practice JavaScript questions",
      prompt: "Give me JavaScript interview questions with answers.",
      icon: MessageSquare,
    },
    {
      title: "Build a project",
      description: "Get practical project ideas",
      prompt: "Suggest a practical MERN Stack portfolio project.",
      icon: Plus,
    },
    {
      title: "Understand APIs",
      description: "Learn backend concepts",
      prompt: "Explain REST APIs with a Node.js and Express example.",
      icon: Search,
    },
  ];

  return (
    <main className="min-h-screen w-full overflow-hidden bg-[#06152d] text-white">
      <div className="flex h-screen overflow-hidden">

        {/* Background */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-teal-500/[0.08] blur-[120px]" />
          <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-emerald-500/[0.07] blur-[120px]" />
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-teal-300/10 bg-[#071a32]/95 backdrop-blur-2xl transition-transform duration-300 md:relative md:z-20 ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:hidden"
          }`}
        >
          <div className="flex h-[72px] shrink-0 items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-300 to-emerald-500 text-[#05251f] shadow-lg shadow-teal-500/20">
                <Sparkles size={21} />
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  Perplexity
                </h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-teal-300/60">
                  AI workspace
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-white/50 hover:bg-white/5 md:hidden"
            >
              <PanelLeft size={18} />
            </button>
          </div>

          {/* New chat */}
          <div className="px-4 pt-3">
            <button
              type="button"
              onClick={handleNewThread}
              className="flex w-full items-center gap-3 rounded-xl border border-teal-300/20 bg-teal-300/[0.08] px-4 py-3 text-sm font-semibold text-teal-100 transition hover:border-teal-300/40 hover:bg-teal-300/[0.13]"
            >
              <Plus size={18} />
              <span>New chat</span>
              <span className="ml-auto text-[10px] text-white/40">
                Ctrl K
              </span>
            </button>
          </div>

          {/* Search chats */}
          <div className="px-4 pt-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
              />
              <input
                value={historySearch}
                onChange={(event) =>
                  setHistorySearch(event.target.value)
                }
                placeholder="Search conversations"
                className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] py-2.5 pl-9 pr-3 text-xs outline-none placeholder:text-white/30 focus:border-teal-300/30"
              />
            </div>
          </div>

          {/* History */}
          <div className="mt-7 min-h-0 flex-1 overflow-y-auto px-3 pb-4">
            <div className="mb-3 flex items-center justify-between px-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-100/40">
                Recent chats
              </span>
              <span className="text-[10px] text-white/35">
                {filteredChats.length}
              </span>
            </div>

            <div className="space-y-1">
              {filteredChats.map((item) => {
                const active =
                  !newChatMode && item.id === currentChatId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openChat(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                      active
                        ? "border-teal-300/15 bg-teal-300/[0.09] text-white"
                        : "border-transparent text-white/50 hover:bg-white/[0.04] hover:text-white/85"
                    }`}
                  >
                    <MessageSquare
                      size={15}
                      className={
                        active ? "text-teal-300" : "text-white/35"
                      }
                    />
                    <span className="min-w-0 flex-1 truncate text-[13px]">
                      {item.title || "New conversation"}
                    </span>
                  </button>
                );
              })}

              {filteredChats.length === 0 && (
                <p className="px-3 py-8 text-center text-xs text-white/35">
                  {historySearch
                    ? "No matching conversations"
                    : "No saved chats yet"}
                </p>
              )}
            </div>
          </div>

          {/* Profile */}
          <div className="relative shrink-0 border-t border-teal-100/[0.08] p-4">
            {profileOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close profile menu"
                  onClick={() => setProfileOpen(false)}
                  className="fixed inset-0 z-40 cursor-default"
                />

                <div className="absolute bottom-[78px] left-4 right-4 z-50 rounded-2xl border border-teal-100/10 bg-[#0b203a] p-1.5 shadow-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/profile");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/75 hover:bg-teal-300/[0.08]"
                  >
                    <User size={16} />
                    Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-300 hover:bg-red-400/10"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-white/[0.04]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-200/20 bg-teal-300/10 font-bold text-teal-200">
                Y
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Personal</p>
                <p className="text-[11px] text-white/40">
                  AI workspace
                </p>
              </div>
              <MoreHorizontal size={18} className="text-white/40" />
            </button>
          </div>
        </aside>

        {/* Main panel */}
        <section className="relative z-10 flex min-w-0 flex-1 flex-col">
          <header className="flex h-[72px] shrink-0 items-center border-b border-teal-100/[0.08] bg-[#06152d]/70 px-4 backdrop-blur-xl md:px-7">
            <button
              type="button"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="rounded-xl border border-white/[0.06] p-2.5 text-white/55 hover:border-teal-300/20 hover:text-teal-200"
            >
              <Menu size={18} />
            </button>

            <div className="ml-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              <span className="text-xs text-white/45">
                {newChatMode ? "New conversation" : "AI Assistant"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNewThread}
              className="ml-auto rounded-xl border border-teal-300/15 p-2.5 text-teal-200 hover:bg-teal-300/[0.08]"
              title="New chat"
            >
              <Plus size={18} />
            </button>
          </header>

          {/* Messages */}
          <div className="relative min-h-0 flex-1">
            <div className="h-full overflow-y-auto px-4 pb-48 pt-8 md:px-8 md:pt-10">
              <div className="mx-auto w-full max-w-3xl">
                {messages.length === 0 && !pendingQuestion ? (
                  <div className="flex min-h-[calc(100vh-280px)] flex-col items-center justify-center pb-6 text-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-200/20 bg-teal-300/[0.08] text-teal-200 shadow-xl shadow-teal-950/20">
                      <Sparkles size={28} />
                    </div>

                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-teal-300/70">
                      Your AI workspace
                    </p>

                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                      What do you want to{" "}
                      <span className="bg-gradient-to-r from-teal-200 to-emerald-300 bg-clip-text text-transparent">
                        explore?
                      </span>
                    </h2>

                    <p className="mt-4 max-w-md text-sm leading-7 text-white/45">
                      Ask questions, learn new concepts, write code,
                      and explore ideas with your AI assistant.
                    </p>

                    <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                      {suggestions.map((item) => {
                        const Icon = item.icon;

                        return (
                          <button
                            key={item.title}
                            type="button"
                            onClick={() => {
                              setChatInput(item.prompt);
                              inputRef.current?.focus();
                            }}
                            className="flex items-start gap-3 rounded-2xl border border-teal-100/[0.09] bg-white/[0.025] p-4 text-left transition hover:border-teal-300/25 hover:bg-teal-300/[0.05]"
                          >
                            <Icon
                              size={19}
                              className="mt-1 shrink-0 text-teal-200"
                            />
                            <div>
                              <p className="text-sm font-semibold text-white/85">
                                {item.title}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-white/40">
                                {item.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {messages.map((message, index) => (
                      <div
                        key={message.id || `${message.role}-${index}`}
                        className={`flex w-full ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {message.role === "user" ? (
                          <div className="max-w-[90%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md border border-teal-200/10 bg-teal-300/[0.10] px-4 py-3 text-sm leading-7 text-white/90 md:max-w-[80%]">
                            {message.content}
                          </div>
                        ) : (
                          <div className="w-full max-w-3xl">
                            <div className="mb-3 flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-teal-200/15 bg-teal-300/[0.08] text-teal-200">
                                <Sparkles size={15} />
                              </div>
                              <span className="text-xs font-semibold text-teal-100/80">
                                Perplexity
                              </span>
                            </div>

                            <div className="prose prose-invert max-w-none break-words text-sm leading-7 text-white/75 prose-headings:text-white prose-a:text-teal-300 prose-strong:text-white">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  pre: ({ children }) => (
                                    <pre className="my-5 overflow-x-auto rounded-xl border border-teal-100/10 bg-[#04101f] p-4">
                                      {children}
                                    </pre>
                                  ),
                                  code: ({ children }) => (
                                    <code className="rounded bg-teal-200/[0.08] px-1 py-0.5 font-mono text-[13px] text-teal-100">
                                      {children}
                                    </code>
                                  ),
                                  a: ({ children, href }) => (
                                    <a
                                      href={href}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-teal-300 underline underline-offset-4"
                                    >
                                      {children}
                                    </a>
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

                    {/* Keep the question visible while waiting */}
                    {pendingQuestion && (
                      <div className="flex justify-end">
                        <div className="max-w-[90%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md border border-teal-200/10 bg-teal-300/[0.10] px-4 py-3 text-sm leading-7 text-white/90 md:max-w-[80%]">
                          {pendingQuestion}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {isSearching && (
                  <div className="mt-6 flex items-center gap-3 rounded-xl border border-teal-200/10 bg-teal-300/[0.035] px-4 py-3">
                    <LoaderCircle
                      size={17}
                      className="animate-spin text-teal-300"
                    />
                    <span className="text-sm text-white/50">
                      Preparing your answer...
                    </span>
                  </div>
                )}

                {errorMessage && (
                  <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-red-300/15 bg-red-400/[0.06] px-4 py-3 text-sm text-red-200">
                    <span>{errorMessage}</span>
                    <button
                      type="button"
                      aria-label="Dismiss error"
                      onClick={() => setErrorMessage("")}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Composer */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#06152d] via-[#06152d]/95 to-transparent px-4 pb-4 pt-12 md:px-8 md:pb-6">
              <div className="mx-auto max-w-3xl">
                <form
                  onSubmit={handleSubmitMessage}
                  className="rounded-2xl border border-teal-200/15 bg-[#0a203a]/95 p-2 shadow-2xl backdrop-blur-xl transition focus-within:border-teal-300/40"
                >
                  <div className="flex items-center gap-2 px-3 pb-1 pt-2">
                    <Sparkles size={15} className="text-teal-300" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-100/45">
                      Ask anything
                    </span>
                  </div>

                  <textarea
                    ref={inputRef}
                    value={chatInput}
                    onChange={(event) =>
                      setChatInput(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey &&
                        !event.nativeEvent.isComposing
                      ) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                    placeholder="Ask a question or explore an idea..."
                    rows={2}
                    disabled={isSearching}
                    className="max-h-40 min-h-[60px] w-full resize-y bg-transparent px-3 py-2 text-sm leading-6 text-white outline-none placeholder:text-white/30 disabled:opacity-60"
                  />

                  <div className="flex items-center justify-between px-2 pb-1">
                    <span className="hidden text-[10px] text-white/25 sm:inline">
                      Shift + Enter for a new line
                    </span>

                    <button
                      type="submit"
                      disabled={!chatInput.trim() || isSearching}
                      aria-label="Send message"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-300 to-emerald-400 text-[#05251f] transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      {isSearching ? (
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                        />
                      ) : (
                        <ArrowUp size={19} strokeWidth={2.5} />
                      )}
                    </button>
                  </div>
                </form>

                <p className="mt-3 text-center text-[10px] leading-5 text-white/25">
                  AI can make mistakes. Verify important information.
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
