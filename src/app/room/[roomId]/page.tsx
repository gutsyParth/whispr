"use client";

import { useUsername } from "@/hooks/use-username";
import { client } from "@/lib/client";
import { useRealtime } from "@/lib/realtime-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function formatTimeRemaining(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const Page = () => {
  const params = useParams();
  const roomId = params.roomId as string;

  const router = useRouter();
  const { username } = useUsername();

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [copyStatus, setCopyStatus] = useState("COPY");
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const { data: ttlData } = useQuery({
    queryKey: ["ttl", roomId],
    queryFn: async () => {
      const res = await client.room.ttl.get({ query: { roomId } });
      return res.data;
    },
  });

  useEffect(() => {
    if (ttlData?.ttl !== undefined) setTimeRemaining(ttlData.ttl);
  }, [ttlData]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining < 0) return;

    if (timeRemaining === 0) {
      router.push("/?destroyed=true");
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, router]);

  const { data: messages, refetch } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const res = await client.messages.get({ query: { roomId } });
      return res.data;
    },
  });

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      await client.messages.post(
        { sender: username, text },
        { query: { roomId } }
      );

      setInput("");
    },
  });

  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.destroy"],
    onData: ({ event }) => {
      if (event === "chat.message") refetch();
      if (event === "chat.destroy") router.push("/?destroyed=true");
    },
  });

  const { mutate: destroyRoom } = useMutation({
    mutationFn: async () => {
      await client.room.delete(null, { query: { roomId } });
    },
  });

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopyStatus("COPIED!");
    setTimeout(() => setCopyStatus("COPY"), 2000);
  };

  return (
    <main className="relative flex flex-col h-screen max-h-screen overflow-hidden bg-black text-zinc-200">
      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,120,0.08),transparent_60%)]"></div>

      {/* HEADER */}
      <header className="relative border-b border-zinc-800 p-4 flex items-center justify-between bg-black/60 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 uppercase tracking-widest">
              Room ID
            </span>

            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-green-400 drop-shadow-[0_0_6px_rgba(34,197,94,0.7)]">
                {roomId.slice(0, 10) + "..."}
              </span>

              <button
                onClick={copyLink}
                className="text-[10px] bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-2 py-0.5 text-zinc-500 hover:text-green-400 transition-all"
              >
                {copyStatus}
              </button>
            </div>
          </div>

          <div className="h-8 w-px bg-zinc-800" />

          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 uppercase tracking-widest">
              Self-Destruct
            </span>

            <span
              className={`text-sm font-mono font-bold ${
                timeRemaining !== null && timeRemaining < 60
                  ? "text-red-500"
                  : "text-amber-400"
              }`}
            >
              {timeRemaining !== null
                ? formatTimeRemaining(timeRemaining)
                : "--:--"}
            </span>
          </div>
        </div>

        <button
          onClick={() => destroyRoom()}
          className="text-xs bg-zinc-900 border border-zinc-800 hover:bg-red-600 px-3 py-1.5 font-bold text-zinc-400 hover:text-white transition-all flex items-center gap-2"
        >
          💣 DESTROY NOW
        </button>
      </header>

      {/* MESSAGES */}
      <div className="relative flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">
        {messages?.messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-600 text-sm font-mono">
              no messages yet...
            </p>
          </div>
        )}

        {messages?.messages.map((msg) => (
          <div key={msg.id} className="flex flex-col">
            <div className="flex items-baseline gap-3 mb-1">
              <span
                className={`text-xs font-bold tracking-wider ${
                  msg.sender === username ? "text-green-400" : "text-blue-400"
                }`}
              >
                {msg.sender === username ? "YOU" : msg.sender}
              </span>

              <span className="text-[10px] text-zinc-600 font-mono">
                {format(msg.timestamp, "HH:mm")}
              </span>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed break-all font-mono bg-black/40 border border-zinc-900 px-4 py-2">
              {msg.text}
            </p>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="relative p-4 border-t border-zinc-800 bg-black/60 backdrop-blur-xl">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 animate-pulse">
              {">"}
            </span>

            <input
              autoFocus
              type="text"
              value={input}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  sendMessage({ text: input });
                  inputRef.current?.focus();
                }
              }}
              placeholder="type message..."
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-black border border-zinc-800 focus:border-green-500 focus:outline-none text-zinc-100 placeholder:text-zinc-700 py-3 pl-8 pr-4 text-sm font-mono transition-all"
            />
          </div>

          <button
            onClick={() => {
              sendMessage({ text: input });
              inputRef.current?.focus();
            }}
            disabled={!input.trim() || isPending}
            className="bg-green-500/90 text-black px-6 text-sm font-bold hover:bg-green-400 hover:shadow-[0_0_15px_rgba(34,197,94,0.8)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            SEND
          </button>
        </div>
      </div>
    </main>
  );
};

export default Page;
