"use client";

import { useUsername } from "@/hooks/use-username";
import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense>
      <Lobby />
    </Suspense>
  );
};

export default Page;

function Lobby() {
  const { username } = useUsername();
  const router = useRouter();

  const searchParams = useSearchParams();
  const wasDestroyed = searchParams.get("destroyed") === "true";
  const error = searchParams.get("error");

  const { mutate: createRoom } = useMutation({
    mutationFn: async () => {
      const res = await client.room.create.post();

      if (res.status === 200) {
        router.push(`/room/${res.data?.roomId}`);
      }
    },
  });

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-black text-zinc-200 overflow-hidden">
      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,120,0.08),transparent_60%)]"></div>

      {/* subtle noise */}
      <div className="pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay bg-[url('/noise.png')]"></div>

      <div className="relative w-full max-w-md space-y-8">
        {/* Alerts */}
        {wasDestroyed && (
          <div className="bg-red-950/60 border border-red-800 p-4 text-center backdrop-blur-md shadow-[0_0_20px_rgba(220,38,38,0.3)]">
            <p className="text-red-500 text-sm font-bold tracking-wider">
              ROOM DESTROYED
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              All messages were permanently deleted.
            </p>
          </div>
        )}

        {error === "room-not-found" && (
          <div className="bg-red-950/60 border border-red-800 p-4 text-center backdrop-blur-md shadow-[0_0_20px_rgba(220,38,38,0.3)]">
            <p className="text-red-500 text-sm font-bold tracking-wider">
              ROOM NOT FOUND
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              This room may have expired or never existed.
            </p>
          </div>
        )}

        {error === "room-full" && (
          <div className="bg-red-950/60 border border-red-800 p-4 text-center backdrop-blur-md shadow-[0_0_20px_rgba(220,38,38,0.3)]">
            <p className="text-red-500 text-sm font-bold tracking-wider">
              ROOM FULL
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              This room is at maximum capacity.
            </p>
          </div>
        )}

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-widest text-green-400 font-mono drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] flicker">
            {">"}whispr
          </h1>

          <p className="text-zinc-500 text-sm italic tracking-wide">
            you were never here...
          </p>
        </div>

        {/* Panel */}
        <div className="border border-zinc-800 bg-black/60 p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.9)]">
          <div className="space-y-5">
            {/* Identity */}
            <div className="space-y-2">
              <label className="flex items-center text-zinc-500 text-sm">
                Your Identity
              </label>

              <div className="flex items-center gap-3">
                <div className="flex-1 bg-black border border-zinc-800 p-3 text-sm text-green-400 font-mono tracking-wider shadow-inner">
                  {username}
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => createRoom()}
              className="w-full bg-green-500/90 text-black p-3 text-sm font-bold tracking-wider hover:bg-green-400 hover:shadow-[0_0_15px_rgba(34,197,94,0.8)] transition-all duration-300 mt-2 cursor-pointer disabled:opacity-50"
            >
              CREATE SECURE ROOM
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
