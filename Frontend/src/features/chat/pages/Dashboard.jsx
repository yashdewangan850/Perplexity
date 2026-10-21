
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
  X,
  Command,
} from "lucide-react";
import { useChat } from "../hooks/useChat";
import axios from "axios";

const Dashboard = () => {
  const chat = useChat();
  const navigate = useNavigate();

  const [chatInput, setChatInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [searchMode, setSearchMode] = useState(false);

  const assistantCountBeforeSend = useRef(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector(
    (state) => state.chat.currentChatId
  );

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
    // Initialize chat connection and fetch existing conversations.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentChat = chats?.[currentChatId];
  const messages = currentChat?.messages || [];

  const chatList = useMemo(() => {
    return Object.values(chats || {}).sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0);
      const dateB = new Date(b.updatedAt || b.createdAt || 0);
      return dateB - dateA;
    });
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, pendingQuestion, isSearching]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        handleNewThread();
        inputRef.current?.focus();
      }

      if (event.key === "Escape") {
        setProfileOpen(false);
        setSearchMode(false);
        setHistorySearch("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitMessage = async (event) => {
    event.preventDefault();

    const trimmedMessage = chatInput.trim();

    if (!trimmedMessage || isSearching) return;

    const assistantMessages = messages.filter(
      (message) => message.role === "assistant"
    );

    assistantCountBeforeSend.current = assistantMessages.length;

    setPendingQuestion(trimmedMessage);
    setIsSearching(true);
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

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);

    setPendingQuestion("");
    setIsSearching(false);
    setProfileOpen(false);

    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleNewThread = () => {
    setChatInput("");
    setPendingQuestion("");
    setIsSearching(false);
    setProfileOpen(false);

    /*
      Your current useChat hook does not expose a new-chat action.
      This resets the visible input/loading state, but does not create
      a new backend conversation or clear the selected Redux chat.
    */
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://perplexity-1-5xj4.onrender.com/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setProfileOpen(false);
      navigate("/login");
    }
  };

  const suggestions = [
    {
      title: "Learn React hooks",
      description: "Understand state and effects",
      prompt: "Explain React hooks with simple examples",
      icon: Sparkles,
    },
    {
      title: "Explore JavaScript",
      description: "Learn important concepts",
      prompt: "Explain important JavaScript concepts for interviews",
      icon: Command,
    },
    {
      title: "Build a project",
      description: "Get project ideas and steps",
      prompt: "Suggest a practical MERN Stack project for my portfolio",
      icon: MessageSquare,
    },
    {
      title: "Solve a problem",
      description: "Break down a difficult topic",
      prompt: "Explain how REST APIs work with a Node.js example",
      icon: Search,
    },
  ];

  return (
    <main className="min-h-screen w-full overflow-hidden bg-[#06152d] text-white">
      <div className="flex h-screen overflow-hidden">

        {/* Background glow */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-teal-500/[0.08] blur-[120px]" />
          <div className="absolute -bottom-48 right-0 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.06] blur-[140px]" />
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
          className={`
            fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col
            border-r border-teal-300/10 bg-[#071a32]/95
            shadow-2xl shadow-black/20 backdrop-blur-2xl
            transition-transform duration-300
            md:relative md:z-20 md:translate-x-0
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:hidden"
            }
          `}
        >
          {/* Logo */}
          <div className="flex h-[72px] shrink-0 items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-300 to-emerald-500 text-[#05251f] shadow-lg shadow-teal-500/20">
                <Sparkles size={21} strokeWidth={2.5} />
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-tight text-white">
                  Perplexity
                </h1>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-teal-300/60">
                  AI workspace
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-white/45 transition hover:bg-white/5 hover:text-teal-300 md:hidden"
            >
              <PanelLeft size={18} />
            </button>
          </div>

          {/* New thread */}
          <div className="px-4 pt-3">
            <button
              type="button"
              onClick={handleNewThread}
              className="group flex w-full items-center gap-3 rounded-xl border border-teal-300/20 bg-gradient-to-r from-teal-400/15 to-emerald-400/[0.07] px-4 py-3 text-sm font-semibold text-teal-100 shadow-lg shadow-teal-950/10 transition duration-200 hover:border-teal-300/40 hover:from-teal-400/20 hover:to-emerald-400/15"
            >
              <Plus
                size={18}
                className="text-teal-300 transition-transform group-hover:rotate-90"
              />
              <span>New thread</span>
              <span className="ml-auto flex items-center gap-1 rounded-md border border-white/10 px-1.5 py-1 text-[10px] text-white/35">
                <Command size={10} /> K
              </span>
            </button>
          </div>

          {/* Search history */}
          <div className="px-4 pt-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-100/35"
              />

              <input
                value={historySearch}
                onChange={(event) =>
                  setHistorySearch(event.target.value)
                }
                placeholder="Search conversations"
                aria-label="Search conversations"
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.035] py-2.5 pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-white/30 focus:border-teal-300/30 focus:bg-teal-300/[0.04]"
              />
            </div>
          </div>

          {/* Chat history */}
          <div className="mt-7 min-h-0 flex-1 overflow-y-auto px-3 pb-4">
            <div className="mb-3 flex items-center justify-between px-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-100/40">
                Recent chats
              </span>

              <span className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-white/35">
                {filteredChats.length}
              </span>
            </div>

            <div className="space-y-1">
              {filteredChats.length > 0 ? (
                filteredChats.map((item) => {
                  const active = item.id === currentChatId;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openChat(item.id)}
                      title={item.title || "New conversation"}
                      className={`
                        group flex w-full items-center gap-3
                        rounded-xl border px-3 py-2.5 text-left
                        transition duration-200
                        ${
                          active
                            ? "border-teal-300/15 bg-teal-300/[0.09] text-white"
                            : "border-transparent text-white/50 hover:border-white/[0.05] hover:bg-white/[0.035] hover:text-white/85"
                        }
                      `}
                    >
                      <MessageSquare
                        size={15}
                        className={
                          active
                            ? "shrink-0 text-teal-300"
                            : "shrink-0 text-white/30 group-hover:text-teal-200/70"
                        }
                      />

                      <span className="min-w-0 flex-1 truncate text-[13px]">
                        {item.title || "New conversation"}
                      </span>

                      {active && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-300 shadow-[0_0_8px_rgba(94,234,212,0.7)]" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-10 text-center">
                  <MessageSquare
                    size={22}
                    className="mx-auto mb-3 text-white/20"
                  />
                  <p className="text-xs text-white/35">
                    {historySearch
                      ? "No matching conversations"
                      : "No conversations yet"}
                  </p>
                  <p className="mt-1 text-[11px] text-white/20">
                    Start a new chat to get going.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar footer */}
          <div className="relative shrink-0 border-t border-teal-100/[0.08] p-4">
            {profileOpen && (
              <button
                type="button"
                aria-label="Close profile menu"
                onClick={() => setProfileOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />
            )}

            {/* Profile dropdown */}
            {profileOpen && (
              <div className="absolute bottom-[78px] left-4 right-4 z-50 overflow-hidden rounded-2xl border border-teal-100/10 bg-[#0b203a] p-1.5 shadow-2xl shadow-black/50">
                <div className="border-b border-white/[0.06] px-3 py-3">
                  <p className="text-xs font-semibold text-white/85">
                    Personal workspace
                  </p>
                  <p className="mt-1 text-[11px] text-white/35">
                    Manage your account
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/profile");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition hover:bg-teal-300/[0.08] hover:text-teal-100"
                >
                  <User size={16} />
                  <span>Profile</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-300 transition hover:bg-red-400/10 hover:text-red-200"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex w-full items-center gap-3 rounded-xl border border-transparent px-2 py-2 text-left transition hover:border-white/[0.06] hover:bg-white/[0.035]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-200/20 bg-gradient-to-br from-teal-300/25 to-emerald-500/10 text-sm font-bold text-teal-200">
                Y
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white/85">
                  Personal
                </p>
                <p className="mt-0.5 text-[11px] text-white/35">
                  AI workspace
                </p>
              </div>

              <MoreHorizontal
                size={18}
                className="text-white/35"
              />
            </button>
          </div>
        </aside>

        {/* Main content */}
        <section className="relative z-10 flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="flex h-[72px] shrink-0 items-center border-b border-teal-100/[0.08] bg-[#06152d]/70 px-4 backdrop-blur-xl md:px-7">
            <button
              type="button"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="rounded-xl border border-white/[0.06] p-2.5 text-white/55 transition hover:border-teal-300/20 hover:bg-teal-300/[0.06] hover:text-teal-200"
            >
              <Menu size={18} />
            </button>

            <div className="ml-3 flex items-center gap-2 md:hidden">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-300 to-emerald-500 text-[#05251f]">
                <Sparkles size={15} />
              </div>
              <span className="text-sm font-bold">Perplexity</span>
            </div>

            <div className="ml-4 hidden items-center gap-2 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.6)]" />
              <span className="text-xs text-white/40">
                AI Assistant
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full border border-teal-300/10 bg-teal-300/[0.04] px-3 py-1.5 sm:flex">
                <Sparkles size={13} className="text-teal-300" />
                <span className="text-[11px] font-medium text-teal-100/70">
                  Ready to explore
                </span>
              </div>

              <button
                type="button"
                onClick={handleNewThread}
                title="New thread"
                className="rounded-xl border border-white/[0.06] p-2.5 text-white/45 transition hover:border-teal-300/20 hover:bg-teal-300/[0.06] hover:text-teal-200"
              >
                <Plus size={18} />
              </button>
            </div>
          </header>

          {/* Chat area */}
          <div className="relative min-h-0 flex-1">
            <div className="h-full overflow-y-auto px-4 pb-48 pt-8 md:px-8 md:pt-10">
              <div className="mx-auto w-full max-w-3xl">

                {/* Empty state */}
                {!messages.length && !pendingQuestion ? (
                  <div className="flex min-h-[calc(100vh-280px)] flex-col items-center justify-center pb-6 text-center">
                    <div className="relative mb-7">
                      <div className="absolute inset-0 rounded-3xl bg-teal-400/20 blur-2xl" />

                      <div className="relative flex h-[68px] w-[68px] items-center justify-center rounded-[22px] border border-teal-200/20 bg-gradient-to-br from-teal-300/20 to-emerald-500/[0.06] shadow-xl shadow-teal-950/20">
                        <Sparkles
                          size={29}
                          className="text-teal-200"
                          strokeWidth={1.7}
                        />
                      </div>
                    </div>

                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-teal-300/70">
                      Your AI workspace
                    </p>

                    <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                      What do you want to{" "}
                      <span className="bg-gradient-to-r from-teal-200 via-teal-300 to-emerald-300 bg-clip-text text-transparent">
                        explore?
                      </span>
                    </h2>

                    <p className="mt-4 max-w-md text-sm leading-7 text-white/45">
                      Ask questions, learn new concepts, write code,
                      and explore ideas with your AI assistant.
                    </p>

                    <div className="mt-9 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                      {suggestions.map((suggestion) => {
                        const Icon = suggestion.icon;

                        return (
                          <button
                            key={suggestion.title}
                            type="button"
                            onClick={() => {
                              setChatInput(suggestion.prompt);
                              inputRef.current?.focus();
                            }}
                            className="group flex items-start gap-3 rounded-2xl border border-teal-100/[0.09] bg-white/[0.025] p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-teal-300/25 hover:bg-teal-300/[0.05] hover:shadow-lg hover:shadow-teal-950/10"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-200/10 bg-teal-300/[0.08] text-teal-200 transition group-hover:bg-teal-300/[0.14]">
                              <Icon size={18} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-white/85 transition group-hover:text-teal-100">
                                {suggestion.title}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-white/40">
                                {suggestion.description}
                              </p>
                            </div>

                            <ArrowUp
                              size={15}
                              className="mt-1 -rotate-45 text-white/20 transition group-hover:text-teal-200"
                            />
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
                          <div className="max-w-[90%] rounded-2xl rounded-br-md border border-teal-200/10 bg-gradient-to-br from-teal-400/[0.15] to-emerald-400/[0.07] px-4 py-3 text-[14px] leading-7 text-white/90 shadow-lg shadow-black/5 md:max-w-[80%]">
                            <div className="whitespace-pre-wrap break-words">
                              {message.content}
                            </div>
                          </div>
                        ) : (
                          <div className="w-full max-w-3xl">
                            <div className="mb-3 flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-teal-200/15 bg-gradient-to-br from-teal-300/20 to-emerald-400/[0.06] text-teal-200">
                                <Sparkles size={15} />
                              </div>

                              <span className="text-xs font-semibold text-teal-100/80">
                                Perplexity
                              </span>

                              <span className="text-[10px] text-white/25">
                                AI response
                              </span>
                            </div>

                            <div className="prose prose-invert max-w-none break-words text-[14px] leading-7 text-white/75 prose-headings:font-semibold prose-headings:text-white prose-a:text-teal-300 prose-strong:text-white prose-li:marker:text-teal-300 prose-hr:border-white/10">
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
                                  blockquote: ({ children }) => (
                                    <blockquote className="my-4 border-l-2 border-teal-300/40 pl-4 text-white/55">
                                      {children}
                                    </blockquote>
                                  ),
                                  code: ({ children, className }) => (
                                    <code
                                      className={`rounded-md bg-teal-200/[0.08] px-1.5 py-0.5 font-mono text-[13px] text-teal-100/90 ${className || ""}`}
                                    >
                                      {children}
                                    </code>
                                  ),
                                  pre: ({ children }) => (
                                    <pre className="my-5 overflow-x-auto rounded-xl border border-teal-100/10 bg-[#04101f] p-4 leading-6">
                                      {children}
                                    </pre>
                                  ),
                                  a: ({ children, href }) => (
                                    <a
                                      href={href}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-teal-300 underline decoration-teal-300/30 underline-offset-4 hover:text-teal-200"
                                    >
                                      {children}
                                    </a>
                                  ),
                                  hr: () => (
                                    <hr className="my-6 border-white/[0.08]" />
                                  ),
                                  table: ({ children }) => (
                                    <div className="my-5 overflow-x-auto rounded-xl border border-white/10">
                                      <table className="w-full border-collapse text-left text-sm">
                                        {children}
                                      </table>
                                    </div>
                                  ),
                                  th: ({ children }) => (
                                    <th className="border-b border-white/10 bg-teal-300/[0.07] px-3 py-2 font-semibold text-teal-100">
                                      {children}
                                    </th>
                                  ),
                                  td: ({ children }) => (
                                    <td className="border-b border-white/[0.06] px-3 py-2">
                                      {children}
                                    </td>
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

                    {/* Pending user question */}
                    {pendingQuestion && (
                      <div className="flex w-full justify-end">
                        <div className="max-w-[90%] rounded-2xl rounded-br-md border border-teal-200/10 bg-gradient-to-br from-teal-400/[0.15] to-emerald-400/[0.07] px-4 py-3 text-[14px] leading-7 text-white/90 md:max-w-[80%]">
                          <div className="whitespace-pre-wrap break-words">
                            {pendingQuestion}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Searching indicator */}
                    {isSearching && (
                      <div className="flex w-full justify-start">
                        <div className="w-full max-w-3xl">
                          <div className="mb-3 flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-teal-200/15 bg-teal-300/[0.08] text-teal-200">
                              <Sparkles size={15} />
                            </div>

                            <span className="text-xs font-semibold text-teal-100/80">
                              Perplexity
                            </span>
                          </div>

                          <div className="flex items-center gap-3 rounded-xl border border-teal-200/10 bg-teal-300/[0.035] px-4 py-3">
                            <LoaderCircle
                              size={17}
                              className="animate-spin text-teal-300"
                            />
                            <span className="text-sm text-white/45">
                              Thinking and preparing a response...
                            </span>
                            <div className="ml-auto flex gap-1">
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-300" />
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-300 [animation-delay:150ms]" />
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-300 [animation-delay:300ms]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message composer */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#06152d] via-[#06152d]/95 to-transparent px-4 pb-4 pt-12 md:px-8 md:pb-6">
              <div className="mx-auto max-w-3xl">
                <form
                  onSubmit={handleSubmitMessage}
                  className="relative rounded-2xl border border-teal-200/15 bg-[#0a203a]/90 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-200 focus-within:border-teal-300/40 focus-within:shadow-teal-950/20"
                >
                  <div className="flex items-center gap-2 px-3 pb-1 pt-2">
                    <Sparkles
                      size={15}
                      className="shrink-0 text-teal-300"
                    />
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
                    aria-label="Message input"
                    className="max-h-40 min-h-[60px] w-full resize-y bg-transparent px-3 py-2 pr-14 text-[14px] leading-6 text-white outline-none placeholder:text-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <div className="flex items-center justify-between px-2 pb-1">
                    <div className="flex items-center gap-2">
                      <span className="hidden text-[10px] text-white/25 sm:inline">
                        Shift + Enter for a new line
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={!chatInput.trim() || isSearching}
                      aria-label="Send message"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-300 to-emerald-400 text-[#05251f] shadow-lg shadow-teal-950/20 transition duration-200 hover:scale-[1.03] hover:shadow-teal-500/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:grayscale"
                    >
                      {isSearching ? (
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                        />
                      ) : (
                        <ArrowUp
                          size={19}
                          strokeWidth={2.5}
                        />
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
